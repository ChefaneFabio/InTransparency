/**
 * Proxy helper for forwarding requests to the Render backend.
 */

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://intransparency.onrender.com'
const SERVICE_KEY = process.env.BACKEND_SERVICE_KEY || ''

/**
 * Forward a FormData request to the backend with service auth headers.
 */
export async function proxyUpload(
  formData: FormData,
  path: string,
  userId: string,
  userRole?: string | null
): Promise<Response> {
  const url = `${BACKEND_URL}${path}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'X-User-Id': userId,
      'X-User-Role': userRole || 'STUDENT',
    },
    body: formData,
  })

  return response
}
