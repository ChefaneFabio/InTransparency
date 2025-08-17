export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-6">
              We collect information you provide directly to us, such as when you create an account, upload academic information, or contact us for support.
            </p>

            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-6">
              We use the information we collect to provide, maintain, and improve our services, including to create your academic portfolio and connect you with relevant opportunities.
            </p>

            <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
            <p className="mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>

            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            <p className="mb-6">
              Your academic records, courses, and projects are stored securely. You control the visibility of your information through privacy settings.
            </p>

            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us through our support channels.
            </p>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}