export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Smart Resume Editor
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Real-time resume editing during job applications with AI-powered optimization
        </p>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to your resume dashboard
          </h2>
          <p className="text-gray-600">
            This is the main dashboard where you can manage your resumes and view analytics.
          </p>
        </div>
      </div>
    </main>
  )
}