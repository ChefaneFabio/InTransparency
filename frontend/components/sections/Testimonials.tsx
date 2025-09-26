import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Graduate',
    university: 'Stanford University',
    avatar: '/images/avatars/sarah-chen.jpg',
    rating: 5,
    content: 'The automatic profile creation from university data saved me hours of work. The AI analysis helped me understand what skills my projects demonstrated.',
    achievement: 'Beta Program Participant',
    projectType: 'Machine Learning'
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineering Student',
    university: 'MIT',
    avatar: '/images/avatars/marcus-johnson.jpg',
    rating: 5,
    content: 'The platform makes it easy to showcase projects professionally. The AI insights help me understand how my work translates to industry skills.',
    achievement: 'Early Access User',
    projectType: 'Full-Stack Development'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Data Science Major',
    university: 'UC Berkeley',
    avatar: '/images/avatars/emily-rodriguez.jpg',
    rating: 5,
    content: 'Having my university transcript and projects automatically imported into a professional format was incredibly convenient and time-saving.',
    achievement: 'Pilot Program User',
    projectType: 'Data Analytics'
  },
  {
    name: 'David Kim',
    role: 'Recent Graduate',
    university: 'Carnegie Mellon',
    avatar: '/images/avatars/david-kim.jpg',
    rating: 5,
    content: 'The matching algorithm connected me with mentors in my field who provided invaluable guidance. The networking aspect alone is worth it.',
    achievement: 'Startup CTO Position',
    projectType: 'Mobile Development'
  },
  {
    name: 'Lisa Thompson',
    role: 'Cybersecurity Student',
    university: 'Georgia Tech',
    avatar: '/images/avatars/lisa-thompson.jpg',
    rating: 5,
    content: 'As a woman in tech, InTransparency helped me build confidence by showing the real impact and complexity of my security projects.',
    achievement: 'Security Analyst at Bank of America',
    projectType: 'Cybersecurity'
  },
  {
    name: 'Alex Patel',
    role: 'Computer Engineering',
    university: 'University of Illinois',
    avatar: '/images/avatars/alex-patel.jpg',
    rating: 5,
    content: 'The professional story feature turned my IoT capstone project into a narrative that impressed every interviewer. Highly recommended!',
    achievement: 'Hardware Engineer at Intel',
    projectType: 'IoT Development'
  }
]

const stats = [
  { label: 'Active Universities', value: '15+', description: 'top institutions worldwide', color: 'text-teal-600' },
  { label: 'Industry Partners', value: '12+', description: 'leading companies', color: 'text-blue-600' },
  { label: 'Career Opportunities', value: 'Growing', description: 'new jobs added weekly', color: 'text-emerald-600' },
  { label: 'Global Reach', value: '8+', description: 'countries represented', color: 'text-sky-600' }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by students worldwide
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            See how InTransparency helps students transform their
            academic projects into career opportunities.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl font-bold ${stat.color || 'text-teal-600'}`}>{stat.value}</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{stat.label}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-600 mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Achievement Badge */}
              <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-6 inline-block">
                ✨ {testimonial.achievement}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-gray-400">{testimonial.university}</div>
                </div>
              </div>

              {/* Project Type */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">Project Focus</div>
                <div className="text-sm font-medium text-teal-600">{testimonial.projectType}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              See success stories in action
            </h3>
            <p className="text-gray-600">
              Watch how our students transformed their projects into career opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-gray-100 rounded-lg aspect-video cursor-pointer group hover:bg-gray-200 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-sm font-medium text-gray-900">Sarah's ML Journey</div>
                <div className="text-xs text-gray-600">From student project to Google AI</div>
              </div>
            </div>

            <div className="relative bg-gray-100 rounded-lg aspect-video cursor-pointer group hover:bg-gray-200 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-sm font-medium text-gray-900">Marcus's Startup Story</div>
                <div className="text-xs text-gray-600">How projects led to founding a startup</div>
              </div>
            </div>

            <div className="relative bg-gray-100 rounded-lg aspect-video cursor-pointer group hover:bg-gray-200 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[12px] border-l-blue-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-sm font-medium text-gray-900">Emily's Data Career</div>
                <div className="text-xs text-gray-600">From analytics project to Microsoft</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to write your success story?
            </h3>
            <p className="text-blue-100 mb-6">
              Transform your academic projects into career opportunities.
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