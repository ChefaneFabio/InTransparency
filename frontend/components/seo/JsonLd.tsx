/**
 * Lightweight JSON-LD structured data component.
 *
 * Server-rendered — emits a <script type="application/ld+json"> so Google,
 * Bing, LinkedIn, and job aggregators can parse structured facts about our
 * pages (Organization on /c/[slug], JobPosting on job pages, etc.).
 */

interface Props {
  data: Record<string, unknown>
}

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
