/**
 * Proxy helper for forwarding requests to the Render backend.
 * Falls back to null if backend is unreachable.
 */

export function getBackendUrl() {
  return process.env.BACKEND_API_URL || 'https://intransparency.onrender.com'
}

export function getServiceKey() {
  return process.env.BACKEND_SERVICE_KEY || ''
}

/**
 * Forward a FormData request to the backend with service auth headers.
 * Returns null if the backend is unreachable (caller should fallback).
 */
export async function proxyUpload(
  formData: FormData,
  path: string,
  userId: string,
  userRole?: string | null
): Promise<Response | null> {
  const backendUrl = getBackendUrl()
  const serviceKey = getServiceKey()

  if (!serviceKey) {
    console.error('BACKEND_SERVICE_KEY not configured, cannot proxy upload')
    return null
  }

  const url = `${backendUrl}${path}`
  console.log(`Proxying upload to ${url}`)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'X-User-Id': userId,
        'X-User-Role': userRole || 'STUDENT',
      },
      body: formData,
      signal: AbortSignal.timeout(25000), // 25s timeout
    })

    return response
  } catch (error: any) {
    console.error(`Backend proxy failed: ${error?.message || error}`)
    return null
  }
}

/**
 * Forward a JSON request to the backend. Returns null if unreachable.
 */
export async function proxyJSON(
  path: string,
  body: any,
  userId: string,
  userRole?: string | null,
  timeoutMs: number = 55000
): Promise<Response | null> {
  const backendUrl = getBackendUrl()
  const serviceKey = getServiceKey()

  if (!serviceKey) return null

  try {
    const response = await fetch(`${backendUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'X-User-Id': userId,
        'X-User-Role': userRole || 'STUDENT',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    })
    return response
  } catch (error: any) {
    console.error(`Backend JSON proxy failed (${path}): ${error?.message}`)
    return null
  }
}
