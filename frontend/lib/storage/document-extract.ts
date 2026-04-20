/**
 * Server-side content extraction for uploaded project documents.
 *
 * Given a file URL + name + MIME, returns content Claude can reason about:
 *   - PDFs as base64 document blocks (Claude native PDF support)
 *   - DOCX via `mammoth`, XLSX via `xlsx`, ipynb via JSON parse
 *   - Plain-text/code/config files as raw text (capped)
 *   - Everything else as a short "attached but not parsed" note
 *
 * Budgets: per-doc 5MB download, per-doc 50KB extracted text, overall 200KB.
 */

const PER_DOC_BYTES = 25 * 1024 * 1024 // Matches Whisper's 25MB cap for audio transcription
const PER_DOC_TEXT_CHARS = 50_000
const TOTAL_TEXT_BUDGET = 200_000
const FETCH_TIMEOUT_MS = 15_000

export type ExtractedBlock =
  | { kind: 'pdf'; filename: string; base64: string; mediaType: 'application/pdf' }
  | { kind: 'text'; filename: string; text: string; source: string }
  | { kind: 'note'; filename: string; note: string }

const TEXT_EXT = new Set([
  'txt', 'md', 'csv', 'tsv', 'json', 'jsonl', 'xml', 'yaml', 'yml', 'toml',
  'tex', 'bib', 'log', 'rmd',
  'py', 'r', 'js', 'ts', 'tsx', 'jsx', 'java', 'c', 'h', 'cpp', 'cc', 'hpp',
  'cs', 'go', 'rs', 'swift', 'kt', 'php', 'rb', 'sql', 'sh',
  'html', 'htm', 'css', 'scss',
  'ini', 'cfg', 'conf', 'env',
])

function getExt(filename: string): string {
  const lower = filename.toLowerCase()
  const i = lower.lastIndexOf('.')
  return i >= 0 ? lower.slice(i + 1) : ''
}

function cap(text: string, chars: number): string {
  if (text.length <= chars) return text
  return text.slice(0, chars) + `\n[...truncated ${text.length - chars} chars]`
}

async function downloadBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    if (!res.ok) return null
    const len = Number(res.headers.get('content-length') || 0)
    if (len && len > PER_DOC_BYTES) return null
    const ab = await res.arrayBuffer()
    if (ab.byteLength > PER_DOC_BYTES) return null
    return Buffer.from(ab)
  } catch {
    return null
  }
}

async function extractPdf(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  return {
    kind: 'pdf',
    filename,
    base64: buffer.toString('base64'),
    mediaType: 'application/pdf',
  }
}

async function extractDocx(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    const text = (result.value || '').trim()
    if (!text) return { kind: 'note', filename, note: 'DOCX contained no extractable text.' }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'docx' }
  } catch (err: any) {
    return { kind: 'note', filename, note: `Could not parse DOCX: ${err?.message || 'unknown error'}` }
  }
}

async function extractXlsx(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(buffer, { type: 'buffer' })
    const lines: string[] = []
    for (const sheetName of wb.SheetNames.slice(0, 6)) {
      const sheet = wb.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      lines.push(`## Sheet: ${sheetName}\n${cap(csv, 10_000)}`)
    }
    const text = lines.join('\n\n').trim()
    if (!text) return { kind: 'note', filename, note: 'Spreadsheet had no extractable cells.' }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'xlsx' }
  } catch (err: any) {
    return { kind: 'note', filename, note: `Could not parse spreadsheet: ${err?.message || 'unknown'}` }
  }
}

function extractIpynb(filename: string, buffer: Buffer): ExtractedBlock {
  try {
    const nb = JSON.parse(buffer.toString('utf8'))
    const cells = Array.isArray(nb.cells) ? nb.cells : []
    const parts: string[] = []
    for (const cell of cells) {
      const src = Array.isArray(cell.source) ? cell.source.join('') : (cell.source || '')
      if (cell.cell_type === 'markdown') parts.push(`### [markdown]\n${src}`)
      else if (cell.cell_type === 'code') parts.push(`### [code]\n${src}`)
    }
    const text = parts.join('\n\n').trim()
    if (!text) return { kind: 'note', filename, note: 'Notebook had no cells.' }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'ipynb' }
  } catch (err: any) {
    return { kind: 'note', filename, note: `Could not parse notebook: ${err?.message || 'invalid JSON'}` }
  }
}

function extractPlainText(filename: string, buffer: Buffer, source: string): ExtractedBlock {
  const text = buffer.toString('utf8').trim()
  if (!text) return { kind: 'note', filename, note: 'Empty file.' }
  return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source }
}

function stripRtf(rtf: string): string {
  // Minimal RTF → text: strip control words, groups, and escaped chars.
  return rtf
    .replace(/\\'[0-9a-f]{2}/gi, '')
    .replace(/\\[a-z]+-?\d*\s?/gi, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function extractPptx(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const slides: string[] = []
    const slideFiles = Object.keys(zip.files)
      .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort((a, b) => {
        const na = parseInt(a.match(/slide(\d+)\.xml$/)?.[1] || '0')
        const nb = parseInt(b.match(/slide(\d+)\.xml$/)?.[1] || '0')
        return na - nb
      })
    for (let idx = 0; idx < slideFiles.length; idx++) {
      const slideFile = slideFiles[idx]
      const xml = await zip.files[slideFile].async('string')
      const runs = Array.from(xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)).map(m => m[1])
      if (runs.length) slides.push(`## Slide ${idx + 1}\n${runs.join(' ')}`)
    }
    const text = slides.join('\n\n').trim()
    if (!text) return { kind: 'note', filename, note: 'Presentation had no readable text.' }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'pptx' }
  } catch (err: any) {
    return manualFallback(filename, 'pptx', buffer.byteLength, err?.message)
  }
}

/**
 * OpenDocument formats (ODT/ODS/ODP): ZIP container with a `content.xml`
 * whose <text:p>, <text:h>, <text:span> nodes carry the text. Cells in
 * ODS use <text:p> inside <table:table-cell>.
 */
async function extractOpenDocument(
  filename: string,
  buffer: Buffer,
  kind: 'odt' | 'ods' | 'odp'
): Promise<ExtractedBlock> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const contentFile = zip.files['content.xml']
    if (!contentFile) return manualFallback(filename, kind, buffer.byteLength, 'missing content.xml')
    const xml = await contentFile.async('string')

    // Extract text from <text:p>, <text:h>, <text:span> content runs
    const runs = Array.from(xml.matchAll(/<text:(?:p|h|span)[^>]*>([^<]*)<\/text:(?:p|h|span)>/g))
      .map(m => m[1].trim())
      .filter(Boolean)
    const text = runs.join(kind === 'ods' ? ' | ' : '\n').trim()
    if (!text) return { kind: 'note', filename, note: `${kind.toUpperCase()} had no readable text.` }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: kind }
  } catch (err: any) {
    return manualFallback(filename, kind, buffer.byteLength, err?.message)
  }
}

/**
 * EPUB: ZIP of XHTML documents. Read the main content files and strip tags.
 */
async function extractEpub(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const htmlFiles = Object.keys(zip.files)
      .filter(n => /\.(x?html?)$/i.test(n) && !zip.files[n].dir)
      .sort()

    const parts: string[] = []
    for (const name of htmlFiles.slice(0, 30)) {
      const html = await zip.files[name].async('string')
      const stripped = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()
      if (stripped) parts.push(stripped)
    }
    const text = parts.join('\n\n').trim()
    if (!text) return { kind: 'note', filename, note: 'EPUB had no readable chapters.' }
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'epub' }
  } catch (err: any) {
    return manualFallback(filename, 'epub', buffer.byteLength, err?.message)
  }
}

/**
 * STL ASCII mode: header + "facet normal ..." count gives rough geometry info.
 * Binary STL: header (80 bytes) + triangle count (uint32 LE). Report geometry.
 */
function extractStl(filename: string, buffer: Buffer): ExtractedBlock {
  const asText = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 5000))
  if (asText.startsWith('solid ')) {
    const facetCount = (asText.match(/\bfacet normal\b/g) || []).length
    const name = asText.split('\n')[0].replace(/^solid\s+/, '').trim() || 'unnamed'
    return {
      kind: 'text',
      filename,
      text: `STL ASCII model. Solid name: "${name}". Detected at least ${facetCount} facets in first 5KB (full mesh not read).`,
      source: 'stl',
    }
  }
  // Binary STL — read triangle count at offset 80
  if (buffer.byteLength >= 84) {
    const triCount = buffer.readUInt32LE(80)
    const sizeKb = Math.round(buffer.byteLength / 1024)
    return {
      kind: 'text',
      filename,
      text: `STL binary 3D model. ${triCount.toLocaleString()} triangles, ${sizeKb} KB. Contents not visualized.`,
      source: 'stl',
    }
  }
  return manualFallback(filename, 'stl', buffer.byteLength)
}

/**
 * DXF: AutoCAD Drawing Exchange Format. ASCII key-value pairs in groups.
 * Extract HEADER section (AutoCAD version, units), count entities by type.
 */
function extractDxf(filename: string, buffer: Buffer): ExtractedBlock {
  const text = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 500_000))
  const parts: string[] = []

  const versionMatch = text.match(/\$ACADVER\s*\n\s*1\s*\n([^\n\r]+)/)
  if (versionMatch) parts.push(`AutoCAD version: ${versionMatch[1].trim()}`)

  // Entity types in order of appearance: LINE, CIRCLE, ARC, POLYLINE, TEXT, etc.
  const entityCounts: Record<string, number> = {}
  const entityMatches = Array.from(text.matchAll(/^\s*0\s*\n\s*([A-Z]+(?:[A-Z0-9_]+)?)\s*\n/gm))
  for (const m of entityMatches) {
    const name = m[1]
    if (['SECTION', 'ENDSEC', 'ENDBLK', 'EOF', 'TABLE', 'LAYER', 'LTYPE', 'STYLE', 'BLOCK', 'VPORT'].includes(name)) continue
    entityCounts[name] = (entityCounts[name] || 0) + 1
  }
  const topEntities = Object.entries(entityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([k, v]) => `${k}: ${v}`)
  if (topEntities.length) parts.push(`Entities: ${topEntities.join(', ')}`)

  // Layer names from TABLES/LAYER section
  const layers = Array.from(text.matchAll(/^\s*2\s*\n([^\n\r]+)\s*\n\s*70/gm)).map(m => m[1].trim()).slice(0, 20)
  if (layers.length) parts.push(`Layers: ${Array.from(new Set(layers)).join(', ')}`)

  if (!parts.length) return manualFallback(filename, 'dxf', buffer.byteLength)
  return { kind: 'text', filename, text: `DXF drawing.\n${parts.join('\n')}`, source: 'dxf' }
}

/**
 * STEP (ISO 10303-21): ASCII format with HEADER and DATA sections.
 * Extract product name, description, authors, date, CAD system.
 */
function extractStep(filename: string, buffer: Buffer): ExtractedBlock {
  const text = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 100_000))
  const headerMatch = text.match(/HEADER;([\s\S]*?)ENDSEC;/)
  const parts: string[] = []

  if (headerMatch) {
    const header = headerMatch[1]
    const fileDesc = header.match(/FILE_DESCRIPTION\s*\(\s*\(([^)]*)\)/)
    if (fileDesc) parts.push(`Description: ${fileDesc[1].replace(/['"]/g, '').trim()}`)
    const fileName = header.match(/FILE_NAME\s*\(\s*'([^']*)'/)
    if (fileName) parts.push(`Product name: ${fileName[1]}`)
    const originator = header.match(/FILE_NAME\s*\([^)]*,[^,]+,[^,]+,[^,]+,[^,]+,\s*'([^']*)'/)
    if (originator) parts.push(`Originator: ${originator[1]}`)
    const authSys = header.match(/FILE_NAME\s*\([^)]*,[^,]+,[^,]+,[^,]+,\s*'([^']*)'/)
    if (authSys) parts.push(`Authoring system: ${authSys[1]}`)
  }

  // Entity counts from DATA section
  const entityMatches = Array.from(text.matchAll(/#\d+\s*=\s*([A-Z_]+)\s*\(/g))
  const counts: Record<string, number> = {}
  for (const m of entityMatches) counts[m[1]] = (counts[m[1]] || 0) + 1
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}: ${v}`)
  if (top.length) parts.push(`Top entities: ${top.join(', ')}`)

  if (!parts.length) return manualFallback(filename, 'step', buffer.byteLength)
  return { kind: 'text', filename, text: `STEP CAD model.\n${parts.join('\n')}`, source: 'step' }
}

/**
 * IGES: ASCII format with fixed-column sections (S=Start, G=Global, D=Directory, P=Parameter, T=Terminate).
 * Extract start comments and global section.
 */
function extractIges(filename: string, buffer: Buffer): ExtractedBlock {
  const text = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 50_000))
  const lines = text.split(/\r?\n/)
  const startComments: string[] = []
  const globalLines: string[] = []
  for (const line of lines) {
    if (line.length < 73) continue
    const section = line[72]
    if (section === 'S') startComments.push(line.slice(0, 72).trim())
    else if (section === 'G') globalLines.push(line.slice(0, 72))
  }
  const parts: string[] = []
  if (startComments.length) parts.push(`Comments: ${startComments.slice(0, 3).join(' ')}`)
  if (globalLines.length) {
    const global = globalLines.join('').split(',').slice(0, 20).map(s => s.trim()).filter(Boolean)
    parts.push(`Global: ${global.slice(0, 10).join(' · ')}`)
  }
  if (!parts.length) return manualFallback(filename, 'iges', buffer.byteLength)
  return { kind: 'text', filename, text: `IGES CAD model.\n${parts.join('\n')}`, source: 'iges' }
}

/**
 * OBJ: Wavefront 3D model. Text format with `v`, `f`, `vn`, `vt`, `o`, `g`, `mtllib`.
 */
function extractObj(filename: string, buffer: Buffer): ExtractedBlock {
  const text = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 500_000))
  const vertices = (text.match(/^v\s/gm) || []).length
  const faces = (text.match(/^f\s/gm) || []).length
  const normals = (text.match(/^vn\s/gm) || []).length
  const uvs = (text.match(/^vt\s/gm) || []).length
  const objectNames = Array.from(text.matchAll(/^o\s+(.+)$/gm)).map(m => m[1].trim())
  const mtllib = text.match(/^mtllib\s+(.+)$/m)
  const parts = [
    `OBJ 3D model.`,
    `Vertices: ${vertices}`,
    `Faces: ${faces}`,
    normals ? `Normals: ${normals}` : '',
    uvs ? `UVs: ${uvs}` : '',
    objectNames.length ? `Objects: ${objectNames.slice(0, 5).join(', ')}` : '',
    mtllib ? `Material library: ${mtllib[1].trim()}` : '',
  ].filter(Boolean)
  return { kind: 'text', filename, text: parts.join('\n'), source: 'obj' }
}

/**
 * GLTF (JSON) / GLB (binary with JSON header). Extract scene metadata.
 */
function extractGltf(filename: string, buffer: Buffer, isBinary: boolean): ExtractedBlock {
  try {
    let json: any
    if (isBinary) {
      // GLB: magic (4) + version (4) + length (4) + JSON chunk length (4) + chunk type (4) + JSON
      if (buffer.byteLength < 20 || buffer.toString('utf8', 0, 4) !== 'glTF') {
        return manualFallback(filename, 'glb', buffer.byteLength, 'invalid GLB header')
      }
      const jsonChunkLength = buffer.readUInt32LE(12)
      const jsonStr = buffer.toString('utf8', 20, 20 + jsonChunkLength)
      json = JSON.parse(jsonStr)
    } else {
      json = JSON.parse(buffer.toString('utf8'))
    }
    const parts: string[] = [`${isBinary ? 'GLB' : 'glTF'} 3D scene.`]
    if (json.asset?.generator) parts.push(`Generator: ${json.asset.generator}`)
    if (json.asset?.version) parts.push(`Version: ${json.asset.version}`)
    if (json.scenes) parts.push(`Scenes: ${json.scenes.length}`)
    if (json.nodes) parts.push(`Nodes: ${json.nodes.length}`)
    if (json.meshes) parts.push(`Meshes: ${json.meshes.length}`)
    if (json.materials) parts.push(`Materials: ${json.materials.length}`)
    if (json.animations) parts.push(`Animations: ${json.animations.length}`)
    const nodeNames = (json.nodes || []).map((n: any) => n.name).filter(Boolean).slice(0, 10)
    if (nodeNames.length) parts.push(`Node names: ${nodeNames.join(', ')}`)
    return { kind: 'text', filename, text: parts.join('\n'), source: isBinary ? 'glb' : 'gltf' }
  } catch (err: any) {
    return manualFallback(filename, isBinary ? 'glb' : 'gltf', buffer.byteLength, err?.message)
  }
}

/**
 * DAE (COLLADA): XML 3D scene description.
 */
function extractDae(filename: string, buffer: Buffer): ExtractedBlock {
  const text = buffer.toString('utf8', 0, Math.min(buffer.byteLength, 500_000))
  const parts: string[] = ['COLLADA 3D scene (.dae).']
  const authoringTool = text.match(/<authoring_tool>([^<]+)<\/authoring_tool>/)
  if (authoringTool) parts.push(`Authoring tool: ${authoringTool[1].trim()}`)
  const unit = text.match(/<unit[^>]*name="([^"]+)"/)
  if (unit) parts.push(`Unit: ${unit[1]}`)
  const up = text.match(/<up_axis>([^<]+)<\/up_axis>/)
  if (up) parts.push(`Up axis: ${up[1]}`)
  const geometries = (text.match(/<geometry\b/g) || []).length
  const lights = (text.match(/<light\b/g) || []).length
  const cameras = (text.match(/<camera\b/g) || []).length
  const materials = (text.match(/<material\b/g) || []).length
  parts.push(`Geometries: ${geometries}, Lights: ${lights}, Cameras: ${cameras}, Materials: ${materials}`)
  return { kind: 'text', filename, text: parts.join('\n'), source: 'dae' }
}

/**
 * SKETCH (Sketch app): ZIP of JSON files. Read `meta.json` and `document.json`.
 */
async function extractSketch(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const parts: string[] = ['Sketch design file.']
    const metaFile = zip.files['meta.json']
    if (metaFile) {
      const meta = JSON.parse(await metaFile.async('string'))
      if (meta.app) parts.push(`App version: ${meta.app}`)
      if (meta.appVersion) parts.push(`Sketch version: ${meta.appVersion}`)
      if (meta.pagesAndArtboards) {
        const pageCount = Object.keys(meta.pagesAndArtboards).length
        parts.push(`Pages: ${pageCount}`)
        const pageNames: string[] = []
        for (const pid of Object.keys(meta.pagesAndArtboards)) {
          const p = meta.pagesAndArtboards[pid]
          if (p.name) pageNames.push(p.name)
          if (p.artboards) {
            for (const aid of Object.keys(p.artboards)) {
              if (p.artboards[aid].name) pageNames.push(`  • ${p.artboards[aid].name}`)
            }
          }
        }
        if (pageNames.length) parts.push(`Artboards: ${pageNames.slice(0, 20).join(', ')}`)
      }
    }
    return { kind: 'text', filename, text: parts.join('\n'), source: 'sketch' }
  } catch (err: any) {
    return manualFallback(filename, 'sketch', buffer.byteLength, err?.message)
  }
}

/**
 * PSD (Photoshop): layers, text layers, document dimensions, color mode.
 * Uses `ag-psd` — pure JS, no binary dependencies.
 */
async function extractPsd(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    // @ts-ignore — optional dep, types resolved after `npm install`
    const { readPsd } = await import('ag-psd')
    const psd = readPsd(buffer, { skipLayerImageData: true, skipCompositeImageData: true, skipThumbnail: true })
    const parts: string[] = ['Photoshop design file.']
    if (psd.width && psd.height) parts.push(`Canvas: ${psd.width}×${psd.height} px`)
    if ((psd as any).colorMode !== undefined) parts.push(`Color mode: ${(psd as any).colorMode}`)
    if (psd.bitsPerChannel) parts.push(`Bits per channel: ${psd.bitsPerChannel}`)

    // Walk layer tree, collect names + text content
    const layerNames: string[] = []
    const textContent: string[] = []
    const walk = (layers: any[], depth = 0) => {
      for (const layer of layers) {
        if (layer.name) layerNames.push(`${'  '.repeat(depth)}${layer.name}`)
        if (layer.text?.text) textContent.push(layer.text.text)
        if (layer.children) walk(layer.children, depth + 1)
      }
    }
    if (psd.children) walk(psd.children)
    if (layerNames.length) parts.push(`Layers (${layerNames.length}):\n${layerNames.slice(0, 30).join('\n')}${layerNames.length > 30 ? `\n… and ${layerNames.length - 30} more` : ''}`)
    if (textContent.length) parts.push(`Text content: ${textContent.slice(0, 10).map(t => `"${t.trim()}"`).join(' · ')}`)

    return { kind: 'text', filename, text: cap(parts.join('\n'), PER_DOC_TEXT_CHARS), source: 'psd' }
  } catch (err: any) {
    return manualFallback(filename, 'psd', buffer.byteLength, err?.message)
  }
}

/**
 * Audio metadata via `music-metadata`: duration, bitrate, codec, ID3 tags.
 * If OPENAI_API_KEY is set and the file is under Whisper's 25MB limit,
 * also transcribe the audio.
 */
async function extractAudio(filename: string, buffer: Buffer, ext: string): Promise<ExtractedBlock> {
  const parts: string[] = []
  let hasContent = false

  try {
    // @ts-ignore — optional dep, types resolved after `npm install`
    const mm = await import('music-metadata')
    const meta = await mm.parseBuffer(buffer, undefined, { duration: true })
    const fmt = meta.format
    parts.push(`Audio file (.${ext}).`)
    if (fmt.container) parts.push(`Container: ${fmt.container}`)
    if (fmt.codec) parts.push(`Codec: ${fmt.codec}`)
    if (fmt.duration) {
      const mins = Math.floor(fmt.duration / 60)
      const secs = Math.round(fmt.duration % 60)
      parts.push(`Duration: ${mins}:${secs.toString().padStart(2, '0')}`)
    }
    if (fmt.bitrate) parts.push(`Bitrate: ${Math.round(fmt.bitrate / 1000)} kbps`)
    if (fmt.sampleRate) parts.push(`Sample rate: ${fmt.sampleRate} Hz`)
    if (fmt.numberOfChannels) parts.push(`Channels: ${fmt.numberOfChannels}`)

    const tag = meta.common
    const tags: string[] = []
    if (tag.title) tags.push(`title="${tag.title}"`)
    if (tag.artist) tags.push(`artist="${tag.artist}"`)
    if (tag.album) tags.push(`album="${tag.album}"`)
    if (tag.year) tags.push(`year=${tag.year}`)
    if (tag.genre?.length) tags.push(`genre=${tag.genre.join('/')}`)
    if (tags.length) parts.push(`Tags: ${tags.join(', ')}`)
    hasContent = true
  } catch (err: any) {
    parts.push(`(Could not read metadata: ${err?.message || 'unknown'})`)
  }

  // Whisper transcription (optional)
  const whisperKey = process.env.OPENAI_API_KEY
  const WHISPER_MAX = 25 * 1024 * 1024
  if (whisperKey && buffer.byteLength <= WHISPER_MAX) {
    try {
      const form = new FormData()
      // Re-wrap as Uint8Array to satisfy TS Buffer↔BlobPart type friction
      form.append('file', new Blob([new Uint8Array(buffer)], { type: `audio/${ext}` }), filename)
      form.append('model', 'whisper-1')
      form.append('response_format', 'text')
      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${whisperKey}` },
        body: form,
        signal: AbortSignal.timeout(45_000),
      })
      if (res.ok) {
        const transcript = (await res.text()).trim()
        if (transcript) {
          parts.push(`\n## Transcription (Whisper)\n${cap(transcript, 20_000)}`)
          hasContent = true
        }
      } else {
        parts.push(`(Whisper transcription failed: HTTP ${res.status})`)
      }
    } catch (err: any) {
      parts.push(`(Whisper transcription error: ${err?.message || 'timeout'})`)
    }
  } else if (!whisperKey) {
    parts.push('(Transcription not available — OPENAI_API_KEY not configured.)')
  } else {
    parts.push(`(Skipped transcription: file exceeds Whisper's 25MB limit.)`)
  }

  if (!hasContent) return manualFallback(filename, ext, buffer.byteLength)
  return { kind: 'text', filename, text: cap(parts.join('\n'), PER_DOC_TEXT_CHARS), source: ext }
}

/**
 * RAR extraction via `node-unrar-js` (WASM). List entries, read text files inside.
 */
async function extractRar(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    // @ts-ignore — optional dep, types resolved after `npm install`
    const unrar = await import('node-unrar-js')
    // node-unrar-js wants ArrayBuffer, not Node's Buffer (which is Uint8Array-backed).
    // Copy into a fresh ArrayBuffer to satisfy strict type + avoid sharing the pool.
    const ab = new ArrayBuffer(buffer.byteLength)
    new Uint8Array(ab).set(buffer)
    const extractor = await unrar.createExtractorFromData({ data: ab })
    const list = extractor.getFileList()
    const fileHeaders = Array.from(list.fileHeaders || [])
    const names = fileHeaders.map((f: any) => f.name).sort()
    const parts: string[] = []
    parts.push(`## RAR archive (${names.length} files):\n${names.slice(0, 50).join('\n')}${names.length > 50 ? `\n… and ${names.length - 50} more` : ''}`)

    // Extract text files
    let textFilesRead = 0
    const filesToRead = names.filter(n => TEXT_EXT.has(getExt(n))).slice(0, 15)
    if (filesToRead.length) {
      const extracted = extractor.extract({ files: filesToRead })
      const files = Array.from(extracted.files || [])
      for (const f of files as any[]) {
        if (textFilesRead >= 15) break
        if (!f.extraction) continue
        const content = Buffer.from(f.extraction).toString('utf8').trim()
        if (!content) continue
        parts.push(`\n### ${f.fileHeader.name}\n${cap(content, 2_000)}`)
        textFilesRead++
      }
    }

    return { kind: 'text', filename, text: cap(parts.join('\n'), PER_DOC_TEXT_CHARS), source: 'rar' }
  } catch (err: any) {
    return manualFallback(filename, 'rar', buffer.byteLength, err?.message)
  }
}

async function extractZip(filename: string, buffer: Buffer): Promise<ExtractedBlock> {
  try {
    const JSZip = (await import('jszip')).default
    const zip = await JSZip.loadAsync(buffer)
    const entries = Object.keys(zip.files)
      .filter(n => !zip.files[n].dir)
      .sort()

    const parts: string[] = []
    parts.push(`## Archive contents (${entries.length} files):\n${entries.slice(0, 50).join('\n')}${entries.length > 50 ? `\n… and ${entries.length - 50} more` : ''}`)

    // Read up to 20 text-based entries, ~2KB each
    let textFilesRead = 0
    for (const entryName of entries) {
      if (textFilesRead >= 20) break
      const entryExt = getExt(entryName)
      if (!TEXT_EXT.has(entryExt)) continue
      const entryBuf = await zip.files[entryName].async('nodebuffer')
      if (entryBuf.byteLength > 200_000) continue
      const entryText = entryBuf.toString('utf8').trim()
      if (!entryText) continue
      parts.push(`\n### ${entryName}\n${cap(entryText, 2_000)}`)
      textFilesRead++
    }

    const text = parts.join('\n').trim()
    return { kind: 'text', filename, text: cap(text, PER_DOC_TEXT_CHARS), source: 'zip' }
  } catch (err: any) {
    return manualFallback(filename, 'zip', buffer.byteLength, err?.message)
  }
}

/**
 * Structured manual-fallback note: when we can't parse, give Claude specific
 * questions to ask the student so the information is still captured.
 */
function manualFallback(
  filename: string,
  kind: string,
  sizeBytes: number,
  reason?: string
): ExtractedBlock {
  const sizeKb = Math.round(sizeBytes / 1024)
  const questions: Record<string, string> = {
    doc: 'Ask the student: what is this document about, and could they re-upload as .docx for full analysis?',
    rtf: 'Ask the student: what is this document about, and could they re-upload as .pdf or .docx for richer analysis?',
    pptx: 'Ask the student: what is this presentation about? How many slides? What was the key message or finding?',
    ppt: 'Ask the student: what is this presentation about, and could they export as .pdf for full analysis?',
    zip: 'Ask the student: what does this archive contain (code, data, report)? What are the main files?',
    rar: 'Ask the student: what does this archive contain? Could they re-upload as .zip for auto-analysis?',
    '7z': 'Ask the student: what does this archive contain? Could they re-upload as .zip for auto-analysis?',
    dwg: 'Ask the student: what does this CAD drawing depict? What software and workflow did they use? What role did it play in the project?',
    dxf: 'Ask the student: what does this CAD drawing depict, and what was the design intent?',
    stl: 'Ask the student: what 3D model is this? What tool (Fusion 360, Blender, SolidWorks) and what was it for?',
    step: 'Ask the student: what CAD model is this? What software and what part did it play in the project?',
    mp3: 'Ask the student: what is this audio? Podcast, interview, voice-over, music? Their role in producing it?',
    wav: 'Ask the student: what is this audio recording, and what was their role in producing it?',
    psd: 'Ask the student: what Photoshop composition is this? Could they export a flat .png or .jpg too?',
    ai: 'Ask the student: what Illustrator artwork is this? Could they export a .pdf or .png for preview?',
    fig: 'Ask the student: what Figma design is this? Could they share a public Figma link or export .png?',
    sketch: 'Ask the student: what Sketch design is this? Could they export a .png preview?',
  }
  const prompt = questions[kind] || `Ask the student: what is in this ${kind} file, and what role did it play in the project?`
  const reasonSuffix = reason ? ` (parse error: ${reason})` : ''
  return {
    kind: 'note',
    filename,
    note: `Attached (${sizeKb} KB, .${kind}) — cannot auto-analyze contents${reasonSuffix}. ${prompt}`,
  }
}

export async function extractDocument(
  url: string,
  filename: string,
  mimeType?: string
): Promise<ExtractedBlock> {
  const ext = getExt(filename)
  const buffer = await downloadBuffer(url)
  if (!buffer) {
    return { kind: 'note', filename, note: 'Could not fetch file (too large or unavailable).' }
  }

  // PDF — Claude native
  if (ext === 'pdf' || mimeType === 'application/pdf') {
    return extractPdf(filename, buffer)
  }

  // DOCX
  if (
    ext === 'docx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractDocx(filename, buffer)
  }

  // XLSX / XLS
  if (
    ext === 'xlsx' ||
    ext === 'xls' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel'
  ) {
    return extractXlsx(filename, buffer)
  }

  // Jupyter notebook
  if (ext === 'ipynb') {
    return extractIpynb(filename, buffer)
  }

  // PPTX (ZIP container with slide XML)
  if (
    ext === 'pptx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return extractPptx(filename, buffer)
  }

  // OpenDocument (LibreOffice) — ODT, ODS, ODP
  if (ext === 'odt' || mimeType === 'application/vnd.oasis.opendocument.text') {
    return extractOpenDocument(filename, buffer, 'odt')
  }
  if (ext === 'ods' || mimeType === 'application/vnd.oasis.opendocument.spreadsheet') {
    return extractOpenDocument(filename, buffer, 'ods')
  }
  if (ext === 'odp' || mimeType === 'application/vnd.oasis.opendocument.presentation') {
    return extractOpenDocument(filename, buffer, 'odp')
  }

  // EPUB
  if (ext === 'epub' || mimeType === 'application/epub+zip') {
    return extractEpub(filename, buffer)
  }

  // STL — 3D model geometry summary
  if (ext === 'stl' || mimeType === 'model/stl' || mimeType === 'application/vnd.ms-pki.stl') {
    return extractStl(filename, buffer)
  }

  // DXF — AutoCAD text interchange format
  if (ext === 'dxf' || mimeType === 'application/dxf' || mimeType === 'image/vnd.dxf') {
    return extractDxf(filename, buffer)
  }

  // STEP — ISO 10303 CAD exchange
  if (ext === 'step' || ext === 'stp' || mimeType === 'application/step' || mimeType === 'model/step+zip') {
    return extractStep(filename, buffer)
  }

  // IGES — CAD exchange
  if (ext === 'iges' || ext === 'igs' || mimeType === 'model/iges') {
    return extractIges(filename, buffer)
  }

  // OBJ — Wavefront 3D model
  if (ext === 'obj') {
    return extractObj(filename, buffer)
  }

  // GLTF / GLB — 3D scene
  if (ext === 'gltf' || mimeType === 'model/gltf+json') {
    return extractGltf(filename, buffer, false)
  }
  if (ext === 'glb' || mimeType === 'model/gltf-binary') {
    return extractGltf(filename, buffer, true)
  }

  // DAE — COLLADA 3D scene
  if (ext === 'dae' || mimeType === 'model/vnd.collada+xml') {
    return extractDae(filename, buffer)
  }

  // SKETCH — Sketch app design file
  if (ext === 'sketch') {
    return extractSketch(filename, buffer)
  }

  // AI — Illustrator (usually PDF-wrapped). Try the PDF path first.
  if (ext === 'ai' || mimeType === 'application/postscript') {
    if (buffer.toString('utf8', 0, 5) === '%PDF-') {
      return extractPdf(filename, buffer)
    }
    return manualFallback(filename, 'ai', buffer.byteLength, 'legacy PostScript, not PDF-wrapped')
  }

  // ZIP — list contents + read text-based entries
  if (ext === 'zip' || mimeType === 'application/zip') {
    return extractZip(filename, buffer)
  }

  // RAR — via node-unrar-js (WASM)
  if (ext === 'rar' || mimeType === 'application/x-rar-compressed' || mimeType === 'application/vnd.rar') {
    return extractRar(filename, buffer)
  }

  // PSD — Photoshop
  if (ext === 'psd' || mimeType === 'image/vnd.adobe.photoshop') {
    return extractPsd(filename, buffer)
  }

  // Audio — metadata + optional Whisper transcription
  if (
    ext === 'mp3' || ext === 'wav' || ext === 'flac' ||
    ext === 'm4a' || ext === 'ogg' || ext === 'aac' || ext === 'opus' ||
    (mimeType && mimeType.startsWith('audio/'))
  ) {
    return extractAudio(filename, buffer, ext || 'audio')
  }

  // RTF — strip control codes, keep text
  if (ext === 'rtf' || mimeType === 'application/rtf') {
    const stripped = stripRtf(buffer.toString('utf8'))
    if (!stripped) return manualFallback(filename, 'rtf', buffer.byteLength)
    return { kind: 'text', filename, text: cap(stripped, PER_DOC_TEXT_CHARS), source: 'rtf' }
  }

  // Plain text / code / data
  if (TEXT_EXT.has(ext) || (mimeType && (mimeType.startsWith('text/') || mimeType === 'application/json'))) {
    return extractPlainText(filename, buffer, ext || 'text')
  }

  // Everything else — structured manual fallback with file-type-specific questions.
  return manualFallback(filename, ext || 'binary', buffer.byteLength)
}

/**
 * Extract many documents, honoring a shared text budget.
 * Runs in parallel but trims the combined output to TOTAL_TEXT_BUDGET chars.
 */
export async function extractDocuments(
  docs: Array<{ url: string; name: string; mimeType?: string }>
): Promise<ExtractedBlock[]> {
  if (!docs.length) return []
  const limited = docs.slice(0, 6)
  const results = await Promise.all(
    limited.map(d => extractDocument(d.url, d.name, d.mimeType))
  )

  // Enforce combined text budget across 'text' blocks (PDFs and notes are small)
  let used = 0
  return results.map(block => {
    if (block.kind !== 'text') return block
    const remaining = TOTAL_TEXT_BUDGET - used
    if (remaining <= 0) {
      return {
        kind: 'note' as const,
        filename: block.filename,
        note: 'Not analyzed: total text budget exceeded by earlier documents.',
      }
    }
    if (block.text.length > remaining) {
      used = TOTAL_TEXT_BUDGET
      return { ...block, text: cap(block.text, remaining) }
    }
    used += block.text.length
    return block
  })
}
