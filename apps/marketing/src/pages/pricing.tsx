import Head from 'next/head';
import Link from 'next/link';

export default function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for casual shoppers',
      features: [
        '5 watchlists',
        '10 price alerts',
        '30-day price history',
        'Email notifications',
        '10+ retailers',
        '5% affiliate commission',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious shoe hunters',
      features: [
        '50 watchlists',
        '100 price alerts',
        '90-day price history',
        'SMS + Email notifications',
        '10+ retailers',
        '10% affiliate commission',
        'AI buying recommendations',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      description: 'For professional resellers',
      features: [
        'Unlimited watchlists',
        'Unlimited price alerts',
        '365-day price history',
        'SMS + Email + Push notifications',
        '10+ retailers',
        '15% affiliate commission',
        'Advanced AI insights',
        'Bulk export tools',
        'API access',
        '24/7 support',
      ],
      cta: 'Upgrade to Premium',
      highlighted: false,
    },
  ];

  return (
    <>
      <Head>
        <title>Pricing - SOLEINTEL</title>
        <meta name="description" content="SOLEINTEL pricing plans" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-white">
            SOLEINTEL
          </Link>
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
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-300">
            Choose the plan that fits your shoe-hunting needs
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg p-8 ${
                  tier.highlighted ? 'bg-blue-600 ring-2 ring-blue-400 transform scale-105' : 'bg-slate-700/50'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-sm font-semibold text-blue-200 mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className={tier.highlighted ? 'text-blue-100' : 'text-slate-300'}>
                  {tier.description}
                </p>

                <div className="my-6">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  <span className={tier.highlighted ? 'text-blue-100' : 'text-slate-300'}>
                    {tier.period}
                  </span>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                    tier.highlighted
                      ? 'bg-white text-blue-600 hover:bg-slate-100'
                      : 'border border-slate-400 text-white hover:bg-slate-600'
                  }`}
                >
                  {tier.cta}
                </button>

                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={tier.highlighted ? 'text-blue-100' : 'text-slate-300'}
                    >
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliate Section */}
        <section className="max-w-7xl mx-auto px-6 py-12 bg-slate-700/30 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Earn with Our Affiliate Program</h2>
            <p className="text-slate-300">
              Join our affiliate program and earn 5-15% commission on every referral
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">How It Works</h3>
              <ol className="text-slate-300 space-y-3">
                <li>1. Generate your unique affiliate link</li>
                <li>2. Share with friends and on social media</li>
                <li>3. Earn commission on every upgrade</li>
                <li>4. Get paid via PayPal monthly</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Commission Rates</h3>
              <div className="space-y-3 text-slate-300">
                <div>Free Tier Referrals: <span className="text-blue-400">5%</span></div>
                <div>Pro Tier Referrals: <span className="text-blue-400">10%</span></div>
                <div>Premium Tier Referrals: <span className="text-blue-400">15%</span></div>
                <div className="mt-4 pt-4 border-t border-slate-600">
                  Minimum Payout: <span className="text-blue-400">$100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/affiliate"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-block"
            >
              Join Affiliate Program
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 mt-20 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
            <p>&copy; 2026 SOLEINTEL. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
