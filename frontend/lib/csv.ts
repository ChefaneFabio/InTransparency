/**
 * Minimal CSV parser. Supports:
 *   - Comma OR semicolon delimiter (autodetected by header line).
 *   - Optional double-quoted fields with embedded delimiters and escaped
 *     double-quotes ("" → ").
 *   - LF, CRLF, or CR line endings.
 *   - UTF-8 BOM strip at start of input.
 *
 * NOT a full RFC-4180 implementation (no multiline quoted strings spanning
 * raw newlines — we treat every newline as a row break). Sufficient for
 * the admin-side CSV imports where we control the source spreadsheets.
 *
 * Returns rows as `Record<headerName, string>` so callers index by column
 * name. Header names are trimmed; row values are trimmed.
 */

export interface CsvParseResult {
  rows: Array<Record<string, string>>
  headers: string[]
  delimiter: ',' | ';'
}

export function parseCsv(text: string): CsvParseResult {
  // Strip UTF-8 BOM if present.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  const lines = text.split(/\r\n|\n|\r/).filter(l => l.length > 0)
  if (lines.length === 0) return { rows: [], headers: [], delimiter: ',' }

  // Autodetect delimiter from header line: prefer the one with more splits.
  const headerLine = lines[0]
  const commaCount = (headerLine.match(/,/g) || []).length
  const semiCount = (headerLine.match(/;/g) || []).length
  const delimiter: ',' | ';' = semiCount > commaCount ? ';' : ','

  const headers = splitLine(headerLine, delimiter).map(h => h.trim())
  const rows: Array<Record<string, string>> = []
  for (let i = 1; i < lines.length; i++) {
    const cells = splitLine(lines[i], delimiter)
    if (cells.length === 0 || cells.every(c => c === '')) continue
    const row: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (cells[j] ?? '').trim()
    }
    rows.push(row)
  }
  return { rows, headers, delimiter }
}

function splitLine(line: string, delimiter: ',' | ';'): string[] {
  const out: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === delimiter) { out.push(current); current = '' }
      else current += ch
    }
  }
  out.push(current)
  return out
}
