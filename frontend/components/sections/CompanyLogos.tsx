export function CompanyLogos() {
  const companies = [
    { name: 'Google', category: 'Tech Giants' },
    { name: 'Microsoft', category: 'Tech Giants' },
    { name: 'Meta', category: 'Tech Giants' },
    { name: 'Amazon', category: 'Tech Giants' },
    { name: 'Stripe', category: 'Scale-ups' },
    { name: 'Spotify', category: 'Scale-ups' },
    { name: 'Notion', category: 'Scale-ups' },
    { name: 'Vercel', category: 'Scale-ups' },
    { name: 'OpenAI', category: 'AI Companies' },
    { name: 'Anthropic', category: 'AI Companies' },
    { name: 'Hugging Face', category: 'AI Companies' },
    { name: 'DeepMind', category: 'AI Companies' }
  ]

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
            Companies Hiring on InTransparency
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Students Getting Hired by Top Companies
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From tech giants to innovative startups, 400+ companies use InTransparency to find verified talent.
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-bold text-gray-400 hover:text-gray-600 transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 font-medium">
            🏢 150+ Tech Companies
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-full text-sm text-purple-700 font-medium">
            🚀 200+ Startups
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-full text-sm text-green-700 font-medium">
            🤖 50+ AI Companies
          </div>
        </div>
      </div>
    </section>
  )
}
