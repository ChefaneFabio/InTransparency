export function Testimonials() {
  return (
    <section id="community" className="py-24 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Building a transparent future
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join the movement to create genuine connections between students and employers
            through authentic skill demonstration and transparent career development.
          </p>
        </div>

        {/* Platform Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Students</h3>
            <p className="text-gray-600">
              Showcase your real academic work and projects in a professional format that employers understand and value.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Employers</h3>
            <p className="text-gray-600">
              Access verified academic performance and project portfolios to make informed hiring decisions based on real skills.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏫</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">For Universities</h3>
            <p className="text-gray-600">
              Connect your students with career opportunities while tracking outcomes and building industry partnerships.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-blue-100 mb-6">
              Join the platform that values authenticity and transparency in career development.
            </p>
            <button className="bg-white text-teal-700 px-8 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}