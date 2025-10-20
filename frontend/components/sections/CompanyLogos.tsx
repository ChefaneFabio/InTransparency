export function CompanyLogos() {
  const targetCompanies = [
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
          <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🚀 Building Our Network
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Where Our Students Want to Work
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building partnerships with top companies. Join early access to help shape our recruiter network.
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
          {targetCompanies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg"
            >
              <span className="text-lg font-bold text-gray-400">
                {company.name}
              </span>
            </div>
          ))}
        </div>

        {/* Value Proposition for Companies */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700 font-medium">
            💼 Verified Portfolios
          </div>
          <div className="px-4 py-2 bg-purple-50 rounded-full text-sm text-purple-700 font-medium">
            🎓 University-Backed Skills
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-full text-sm text-green-700 font-medium">
            🤝 Early Partner Program
          </div>
        </div>
      </div>
    </section>
  )
}
