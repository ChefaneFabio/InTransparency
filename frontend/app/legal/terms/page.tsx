export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using the InTransparency platform, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-6">
              Permission is granted to temporarily use InTransparency for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service.
            </p>

            <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="mb-6">
              You may not use our service for any unlawful purposes or to solicit others to take or refrain from taking any unlawful action. You may not upload harmful or malicious content.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Privacy</h2>
            <p className="mb-6">
              Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your data.
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