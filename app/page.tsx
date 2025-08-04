import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 font-sans">Localix</h1>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium font-sans">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium font-sans">Pricing</a>
                <Link href="/auth/signin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium font-sans">Sign In</Link>
                <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 font-sans">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-8 font-sans">
              <span className="mr-2">✨</span>
              All-in-one business management platform
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight font-sans">
              Manage Your Business
              <span className="text-blue-600"> Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed font-sans">
              All-in-one platform for small businesses. Automate social media, analyze performance, 
              and grow your business with powerful tools and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center font-sans">
                Start Free Trial
                <span className="ml-2">→</span>
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center font-sans">
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 font-sans">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                No credit card required
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Free 14-day trial
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-sans">
              Everything You Need to Grow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              Powerful tools designed specifically for small businesses to streamline operations and drive growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Business Analytics',
                description: 'Get detailed insights into your business performance with comprehensive analytics and reporting.',
                color: 'bg-blue-50 text-blue-600'
              },
              {
                title: 'Social Media Automation',
                description: 'Schedule and automate your social media posts across multiple platforms effortlessly.',
                color: 'bg-green-50 text-green-600'
              },
              {
                title: 'Target Audience Segmentation',
                description: 'Identify and segment your target audience for better marketing strategies.',
                color: 'bg-purple-50 text-purple-600'
              },
              {
                title: 'Business Model Canvas',
                description: 'Create and visualize your business model with our interactive canvas tool.',
                color: 'bg-orange-50 text-orange-600'
              },
              {
                title: 'AI Content Assistant',
                description: 'Generate engaging content ideas and get AI-powered suggestions for your posts.',
                color: 'bg-pink-50 text-pink-600'
              },
              {
                title: 'Growth Reports',
                description: 'Track your business growth with detailed reports and actionable insights.',
                color: 'bg-indigo-50 text-indigo-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200 bg-white"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-sans">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-sans">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-sans">
            Join thousands of small businesses already using our platform to grow and succeed.
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center font-sans">
            Start Your Free Trial
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">✨</span>
                </div>
                <h3 className="text-2xl font-bold font-sans">Localix</h3>
              </div>
              <p className="text-gray-400 leading-relaxed font-sans">
                Empowering small businesses with powerful tools and insights to grow and succeed in the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Product</h4>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Company</h4>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 font-sans">Support</h4>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 font-sans">
            <p>&copy; 2024 Localix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 