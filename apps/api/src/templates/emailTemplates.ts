export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string, email: string) => ({
    subject: "Welcome to SOLEINTEL! 👟",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1>Welcome to SOLEINTEL</h1>
          <p>Your Personal Shoe Price Tracker</p>
        </header>

        <main style="padding: 40px; background: #f9f9f9;">
          <p>Hi ${name || email},</p>

          <p>Thanks for joining SOLEINTEL! We're excited to help you save money on shoes.</p>

          <h2 style="color: #667eea;">Getting Started</h2>
          <ol>
            <li><strong>Install the Chrome extension</strong> - Add SOLEINTEL to your browser</li>
            <li><strong>Browse your favorite retailer</strong> - Amazon, Nike, Walmart, Adidas, etc.</li>
            <li><strong>See price comparisons instantly</strong> - Real-time prices across 10+ stores</li>
            <li><strong>Add to watchlist</strong> - Track prices automatically</li>
            <li><strong>Get alerts</strong> - Email notifications when prices drop</li>
          </ol>

          <h2 style="color: #667eea;">Your Free Tier Includes</h2>
          <ul style="background: white; padding: 20px; border-left: 4px solid #667eea;">
            <li>✓ 5 watchlists</li>
            <li>✓ 10 price alerts</li>
            <li>✓ 30-day price history</li>
            <li>✓ Email notifications</li>
            <li>✓ 10+ supported retailers</li>
          </ul>

          <p><strong>💡 Pro Tip:</strong> Upgrade to Pro ($9.99/month) to unlock SMS alerts, 50 watchlists, and AI buying recommendations.</p>

          <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 15px 0;"><strong>Start Saving Today</strong></p>
            <a href="https://soleintel.com/get-started" style="background: white; color: #667eea; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Install Extension
            </a>
          </div>

          <p>Questions? Reply to this email or visit <a href="https://soleintel.com/support">our support page</a>.</p>

          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Happy shoe hunting!<br>
            The SOLEINTEL Team
          </p>
        </main>
      </div>
    `,
  }),

  // Price drop alert
  priceDropAlert: (productTitle: string, previousPrice: number, newPrice: number, savings: number, productUrl: string) => ({
    subject: `🎉 ${productTitle} dropped to $${newPrice.toFixed(2)}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Price Drop Alert! 🎉</h1>
        </header>

        <main style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #f5576c; margin-top: 0;">${productTitle}</h2>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <strong>Previous Price:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                  <span style="text-decoration: line-through; color: #999;">$${previousPrice.toFixed(2)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <strong>New Price:</strong>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                  <span style="color: #f5576c; font-size: 18px; font-weight: bold;">$${newPrice.toFixed(2)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px;">
                  <strong>You Save:</strong>
                </td>
                <td style="padding: 10px; text-align: right;">
                  <span style="background: #e8f5e9; color: #2e7d32; padding: 5px 10px; border-radius: 4px; font-weight: bold;">
                    $${savings.toFixed(2)}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #f5576c; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 15px 0;">This deal might not last long!</p>
            <a href="${productUrl}" style="background: white; color: #f5576c; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Check Price Now
            </a>
          </div>

          <p style="color: #666; font-size: 13px;">
            💡 <strong>Tip:</strong> Compare prices across retailers using SOLEINTEL to make sure you're getting the best deal.
          </p>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            SOLEINTEL<br>
            <a href="https://soleintel.com/unsubscribe" style="color: #667eea; text-decoration: none;">Unsubscribe from alerts</a>
          </p>
        </main>
      </div>
    `,
  }),

  // Watchlist summary (weekly)
  watchlistSummary: (userName: string, productCount: number, priceDrops: number, totalSavings: number) => ({
    subject: `📊 Your SOLEINTEL Weekly Summary: ${priceDrops} price drops found!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Weekly Price Summary 📊</h1>
        </header>

        <main style="padding: 30px; background: #f9f9f9;">
          <p>Hi ${userName},</p>

          <p>Here's what happened with your SOLEINTEL watchlist this week:</p>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; color: #667eea; font-weight: bold;">${productCount}</div>
              <div style="color: #666;">Items Tracked</div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 32px; color: #f5576c; font-weight: bold;">${priceDrops}</div>
              <div style="color: #666;">Price Drops</div>
            </div>
          </div>

          <div style="background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2e7d32;">💰 Total Potential Savings</h3>
            <p style="font-size: 24px; font-weight: bold; color: #2e7d32; margin: 0;">$${totalSavings.toFixed(2)}</p>
          </div>

          <div style="background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0;">Check your watchlist to see all deals!</p>
            <a href="https://soleintel.com/dashboard" style="background: white; color: #667eea; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-top: 10px;">
              View Full Summary
            </a>
          </div>

          <h3 style="color: #667eea;">💡 Tips to Save Even More</h3>
          <ul>
            <li>Add more items to your watchlist</li>
            <li>Enable SMS alerts for instant notifications</li>
            <li>Check multiple retailers before buying</li>
            <li>Sign up for price predictions (coming soon!)</li>
          </ul>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Happy shoe hunting!<br>
            The SOLEINTEL Team<br>
            <a href="https://soleintel.com/unsubscribe" style="color: #667eea; text-decoration: none;">Manage email preferences</a>
          </p>
        </main>
      </div>
    `,
  }),

  // Upgrade invitation
  upgradeInvitation: (userName: string, reason: string) => ({
    subject: `Upgrade to SOLEINTEL Pro and unlock premium features`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Unlock Premium Features</h1>
          <p style="margin: 10px 0 0 0;">Upgrade to SOLEINTEL Pro</p>
        </header>

        <main style="padding: 40px; background: #f9f9f9;">
          <p>Hi ${userName},</p>

          <p>We noticed you hit your watchlist limit (${reason}). Ready to track MORE shoes and get FASTER alerts?</p>

          <h2 style="color: #667eea;">Compare Plans</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 15px; text-align: left; border: 1px solid #ddd;"><strong>Feature</strong></th>
                <th style="padding: 15px; text-align: center; border: 1px solid #ddd;"><strong>Free</strong></th>
                <th style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #667eea; color: white;"><strong>Pro ⭐</strong></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 15px; border: 1px solid #ddd;">Watchlists</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd;">5</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #f0f7ff;">50</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 15px; border: 1px solid #ddd;">Price Alerts</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd;">10</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #f0f7ff;">100</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #ddd;">SMS Alerts</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd;">❌</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #f0f7ff;">✅ Text Notifications</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td style="padding: 15px; border: 1px solid #ddd;">AI Insights</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd;">❌</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #f0f7ff;">✅ Smart Recommendations</td>
              </tr>
              <tr>
                <td style="padding: 15px; border: 1px solid #ddd; font-weight: bold;">Price</td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd;"><strong>$0</strong></td>
                <td style="padding: 15px; text-align: center; border: 1px solid #ddd; background: #f0f7ff;"><strong>$9.99/mo</strong></td>
              </tr>
            </tbody>
          </table>

          <div style="background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 10px 0;"><strong>First month: $1 (Save 90%)</strong></p>
            <a href="https://soleintel.com/upgrade" style="background: white; color: #667eea; padding: 14px 35px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px;">
              Upgrade to Pro
            </a>
            <p style="margin: 15px 0 0 0; font-size: 12px;">Cancel anytime. No strings attached.</p>
          </div>

          <p style="color: #666;">
            <strong>Pro tip:</strong> Pro members save an average of $200+ per year on shoes. That's 20+ months of Pro membership paid for!
          </p>

          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Questions? <a href="https://soleintel.com/support" style="color: #667eea;">Contact support</a>
          </p>
        </main>
      </div>
    `,
  }),

  // Affiliate program invitation
  affiliateInvitation: (userName: string) => ({
    subject: `Earn money with SOLEINTEL - Join our affiliate program`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Earn Money with SOLEINTEL</h1>
          <p style="margin: 10px 0 0 0;">Join Our Affiliate Program</p>
        </header>

        <main style="padding: 40px; background: #f9f9f9;">
          <p>Hi ${userName},</p>

          <p>You love SOLEINTEL. Now you can earn money by sharing it with others!</p>

          <h2 style="color: #667eea;">How It Works</h2>
          <ol>
            <li><strong>Get your unique link</strong> - We generate a tracking link just for you</li>
            <li><strong>Share with friends</strong> - Twitter, Reddit, blogs, YouTube, etc.</li>
            <li><strong>Earn commission</strong> - 5-15% on every referral</li>
            <li><strong>Get paid</strong> - Monthly payouts to your PayPal</li>
          </ol>

          <h2 style="color: #667eea;">Earning Potential</h2>
          <div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Free Tier Referrals:</strong> <span style="color: #667eea; font-size: 18px; font-weight: bold;">5%</span></p>
            <p style="margin: 0 0 10px 0;"><strong>Pro Tier Referrals:</strong> <span style="color: #667eea; font-size: 18px; font-weight: bold;">10%</span></p>
            <p style="margin: 0;"><strong>Premium Tier Referrals:</strong> <span style="color: #667eea; font-size: 18px; font-weight: bold;">15%</span></p>
          </div>

          <div style="background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2e7d32;">💰 Example Earnings</h3>
            <p style="margin: 0 0 10px 0;">Send 10 referrals:</p>
            <ul style="margin: 0; padding-left: 20px;">
              <li>1 converts to Pro: <strong>$10</strong> (10% of $9.99)</li>
              <li>1 converts to Premium: <strong>$3.75</strong> (15% of $24.99)</li>
              <li>8 stay Free: <strong>$0.40</strong> (5% each)</li>
              <li style="padding-top: 10px; border-top: 1px solid #2e7d32;"><strong>Total: $14.15</strong></li>
            </ul>
          </div>

          <div style="background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0 0 15px 0;"><strong>Join 500+ Affiliates Earning Today</strong></p>
            <a href="https://soleintel.com/affiliate" style="background: white; color: #667eea; padding: 14px 35px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 16px;">
              Join Affiliate Program
            </a>
          </div>

          <h3 style="color: #667eea;">Why Join?</h3>
          <ul>
            <li>✅ No limits on earning potential</li>
            <li>✅ Monthly payouts (minimum $100)</li>
            <li>✅ Real-time dashboard to track performance</li>
            <li>✅ Marketing materials provided</li>
            <li>✅ Dedicated affiliate support</li>
          </ul>

          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            Questions? Email: affiliate@soleintel.com<br>
            <a href="https://soleintel.com/affiliate-faq" style="color: #667eea;">View FAQ</a>
          </p>
        </main>
      </div>
    `,
  }),

  // Reengagement email
  reengagement: (userName: string, daysSinceActive: number) => ({
    subject: `We miss you! Come back to SOLEINTEL`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">We Miss You! 👟</h1>
        </header>

        <main style="padding: 30px; background: #f9f9f9;">
          <p>Hi ${userName},</p>

          <p>It's been ${daysSinceActive} days since we last saw you. A lot has changed at SOLEINTEL!</p>

          <h2 style="color: #f5576c;">What's New?</h2>
          <ul>
            <li>✅ SMS price alerts (text notifications)</li>
            <li>✅ Affiliate program (earn money!)</li>
            <li>✅ AI buying recommendations</li>
            <li>✅ 10+ retailers now supported</li>
            <li>✅ Faster price updates</li>
          </ul>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin-top: 0;"><strong>Special Welcome Back Offer:</strong></p>
            <p style="margin: 0; font-size: 18px; color: #f5576c; font-weight: bold;">50% off Pro for 3 months</p>
            <p style="margin: 10px 0 0 0; color: #666;">Code: <code style="background: #f0f0f0; padding: 5px 10px;">COMEBACK50</code></p>
          </div>

          <div style="background: #f5576c; color: white; padding: 25px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <a href="https://soleintel.com/dashboard" style="background: white; color: #f5576c; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
              Go Back to SOLEINTEL
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            Start tracking shoe prices again and save hundreds of dollars this season.
          </p>

          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            The SOLEINTEL Team
          </p>
        </main>
      </div>
    `,
  }),
};

export function getEmailTemplate(templateName: keyof typeof emailTemplates, ...args: any[]) {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template "${templateName}" not found`);
  }
  return (template as any)(...args);
}
