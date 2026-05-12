import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>SOLEINTEL - Real-Time Footwear Pricing Intelligence</title>
        <meta
          name="description"
          content="Get real-time price comparisons across 10+ footwear retailers. Never overpay for shoes again."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-white">SOLEINTEL</div>
          <div className="flex gap-8">
            <Link href="/features" className="text-slate-300 hover:text-white">
              Features
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/affiliate" className="text-slate-300 hover:text-white">
              Affiliate
            </Link>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/extension`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Get Extension
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Never Overpay for Shoes Again
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Real-time price comparisons across 10+ major retailers. Get alerts when prices drop.
              Make smarter buying decisions.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/extension`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Install Free Extension
              </a>
              <Link
                href="/pricing"
                className="border border-slate-400 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-700"
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">10+</div>
              <div className="text-slate-300">Retailers Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">6-Hour</div>
              <div className="text-slate-300">Price Updates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400">100K+</div>
              <div className="text-slate-300">Active Users</div>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Choose SOLEINTEL?</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <div className="text-2xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Detection</h3>
              <p className="text-slate-300">
                Automatically detects shoe products across major retailers.
              </p>
            </div>
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <div className="text-2xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Alerts</h3>
              <p className="text-slate-300">
                Get notified instantly when prices drop on your watchlist.
              </p>
            </div>
            <div className="bg-slate-700/50 p-6 rounded-lg">
              <div className="text-2xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-white mb-2">Save Money</h3>
              <p className="text-slate-300">
                Average users save $200+ per year on footwear purchases.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Saving on Your Next Shoe Purchase
          </h2>
          <p className="text-slate-300 mb-8">
            Join thousands of savvy shoppers who use SOLEINTEL to find the best deals.
          </p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/extension`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
          >
            Get Started Free
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
            <p>&copy; 2026 SOLEINTEL. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-4">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
