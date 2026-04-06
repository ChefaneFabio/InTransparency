import { NextRequest, NextResponse } from 'next/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://in-transparency.vercel.app'

/**
 * GET /api/embed/profile/[username]
 * Returns a JavaScript snippet that renders a mini profile card.
 * Usage: <script src="https://in-transparency.vercel.app/api/embed/profile/fabio-chefane"></script>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const badgeUrl = `${APP_URL}/api/badge/profile/${username}`
  const profileUrl = `${APP_URL}/students/${username}/public`

  const js = `(function(){
  var container = document.currentScript.parentElement;
  var link = document.createElement('a');
  link.href = '${profileUrl}';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'inline-block';
  link.style.textDecoration = 'none';
  var img = document.createElement('img');
  img.src = '${badgeUrl}';
  img.alt = 'InTransparency Verified Profile';
  img.style.height = '60px';
  img.style.borderRadius = '8px';
  link.appendChild(img);
  container.appendChild(link);
})();`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
