'use client'

export function RealStats() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">Universities</div>
          <div className="text-sm text-gray-600">Partner institutions</div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">Companies</div>
          <div className="text-sm text-gray-600">Hiring partners</div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">Students</div>
          <div className="text-sm text-gray-600">Active community</div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">Global</div>
          <div className="text-sm text-gray-600">Worldwide reach</div>
        </div>
      </div>
    </div>
  )
}