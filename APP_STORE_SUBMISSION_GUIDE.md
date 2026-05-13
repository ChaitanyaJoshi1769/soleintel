# App Store Submission Guide 📱

**Date:** May 13, 2026  
**Target Launch:** May 20, 2026  
**Status:** Preparation Phase

---

## iOS App Store Submission

### Step 1: Developer Account & Certificates

```bash
# Prerequisites
1. [ ] Apple Developer Account ($99/year)
2. [ ] Mac with Xcode (free from App Store)
3. [ ] iPhone/iPad for testing
4. [ ] Valid payment method registered
```

### Step 2: Create App ID

**Apple Developer Portal:**
1. Go to `Certificates, Identifiers & Profiles`
2. Click `Identifiers` → `+` button
3. Select `App IDs`
4. Choose `App` type
5. Fill in:
   - App Name: `SOLEINTEL`
   - Bundle ID: `com.soleintel.app`
   - Capabilities: Push Notifications, Sign In with Apple

**Capabilities to Enable:**
```
✅ Push Notifications
✅ Sign In with Apple
✅ HealthKit (optional)
✅ HomeKit (optional)
```

### Step 3: Create Signing Certificates

```bash
# In Xcode:
Xcode → Preferences → Accounts
→ Click Apple ID
→ Click "Manage Certificates"
→ Click "+" → "Apple Distribution"

# Select certificate just created
Xcode → Project → Signing & Capabilities
→ Select Team
→ Automatic signing enabled
```

### Step 4: Create Provisioning Profile

1. `Certificates, Identifiers & Profiles` → `Provisioning Profiles`
2. Click `+` → `App Store`
3. Select `SOLEINTEL` App ID
4. Select distribution certificate
5. Download & install profile

### Step 5: Prepare App Icons & Images

**Required Assets:**
```
App Icon:
├─ 1024x1024px (required)
├─ 512x512px (App Store)
└─ 180x180px (iPhone)

Screenshots (minimum 2, maximum 5):
├─ Size: 1125x2436px (iPhone 12 Pro Max)
├─ Safe area: 60px margins
└─ No device frames (provided by Apple)

Preview:
├─ Size: 1125x2436px
├─ Duration: 5-30 seconds
├─ Autoplay without sound
└─ Format: MP4 or MOV

Privacy Icon:
├─ Size: 512x512px
├─ JPEG/PNG format
```

**Screenshot Sequence:**
1. **Home Screen** - Welcome + Stats
   - Headline: "Track Your Favorite Shoes"
   - Show watchlist count, potential savings

2. **Search & Discovery** - Product Search
   - Headline: "Browse 50,000+ Shoes"
   - Show search bar, category filters, product list

3. **Price Predictions** - AI Predictions
   - Headline: "AI Predicts Price Drops"
   - Show prediction dashboard with wait/buy recommendations

4. **Community Deals** - Trending Deals
   - Headline: "Join 100K+ Shoe Hunters"
   - Show community deal board with upvotes/comments

5. **Achievements** - Gamification
   - Headline: "Unlock Badges & Earn Rewards"
   - Show achievements and referral program

### Step 6: Create App Store Listing

**App Name:**
```
SOLEINTEL - Shoe Price Tracker
(Max 30 characters)
```

**Subtitle:**
```
Smart Price Tracking & Deal Alerts
(Max 30 characters)
```

**Category:**
```
Shopping
```

**Content Rating:**
```
Select "4+" for all ages
```

**Privacy Policy:**
```
URL: https://soleintel.com/privacy
(Must be live before submission)
```

**Support URL:**
```
URL: https://soleintel.com/support
```

**Marketing URL:**
```
URL: https://soleintel.com
```

**Description (Max 4000 chars):**
```
Find the best deals on shoes with SOLEINTEL. 
Get instant price alerts, join the community, and save big.

What's included:
• Real-time shoe price tracking across 50+ retailers
• Instant notifications when prices drop
• AI-powered price predictions (7, 14, 30 days)
• Community deal sharing and voting
• Achievement badges & leaderboards
• Referral rewards program ($5+ per friend)
• Offline browsing support
• Biometric login (Face ID/Touch ID)

Why SOLEINTEL:
✓ Track unlimited products
✓ Never overpay for shoes again
✓ Get the lowest price guarantee
✓ Community-driven deal discovery
✓ Privacy-first approach (no data selling)
```

**Keywords (Max 100 chars):**
```
price tracker, shoe deals, price alerts, shopping, 
discount finder, price comparison, deals
```

**Demo Account (Optional):**
```
Email: demo@soleintel.com
Password: Demo123!
```

### Step 7: Build & Archive

```bash
# In Xcode:
1. Product → Scheme → Edit Scheme
2. Set Build Configuration to "Release"
3. Product → Archive
4. Distribute App → App Store Connect
5. Upload for Review

# From CLI:
cd apps/mobile
eas build --platform ios --build-profile production
eas submit --platform ios
```

### Step 8: Submit for Review

1. **Open App Store Connect** → Your App
2. **TestFlight** → Send to App Store Review
3. **Complete Required Info:**
   - Encryption export compliance: Select "No"
   - IDFA: Select "No"
   - Sign in method: "Sign in with Apple" (if applicable)
   - Content rating questionnaire
   - Notes for reviewers (if needed)
4. **Submit for Review**

**Expected Review Time:** 24-48 hours

### Step 9: Monitor Review Status

```bash
# Check status via CLI
gh api /repos/ChaitanyaJoshi1769/soleintel/releases

# Or in App Store Connect
App Store → Activity → Version Release Status
```

### Review Rejection Common Reasons

| Issue | Solution |
|-------|----------|
| Missing privacy policy | Add HTTPS URL to privacy policy |
| Unclear app purpose | Update description with features |
| Crashes on test device | Run on real device, fix bugs |
| Missing legal text | Add Terms of Service in-app |
| Inappropriate content | Review all screenshots/descriptions |
| Misleading claims | Verify all performance claims |

---

## Android Play Store Submission

### Step 1: Developer Account & Keys

```bash
# Prerequisites
1. [ ] Google Play Developer Account ($25 one-time)
2. [ ] Google Account (for payments)
3. [ ] Android device for testing
4. [ ] Valid payment method
```

### Step 2: Generate Signing Key

```bash
# Create keystore file
keytool -genkey -v -keystore app.jks \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -alias soleintel

# Properties
Common Name: Jay (Your Name)
Organization: SOLEINTEL
Location: San Francisco
Country: US
```

### Step 3: Configure Signing

```gradle
// android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('app.jks')
      storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
      keyAlias System.getenv('ANDROID_KEY_ALIAS')
      keyPassword System.getenv('ANDROID_KEY_PASSWORD')
    }
  }
  
  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

### Step 4: Create Google Play Listing

**App Name:**
```
SOLEINTEL - Shoe Price Tracker
```

**Short Description:**
```
Track shoe prices, find deals, get alerts. AI predictions & community deals.
(Max 80 characters)
```

**Full Description:**
```
Same as iOS (Max 4000 characters)
```

**Category:**
```
Shopping
```

**Content Rating:**
```
Everyone (4+)
```

**Screenshots (5-8):**
```
Minimum size: 1080x1920px
Format: PNG or JPEG
Safe area: 60px margins
```

**Feature Graphic:**
```
Size: 1024x500px
PNG/JPEG format
```

### Step 5: Build & Sign APK

```bash
cd apps/mobile

# Build production APK
eas build --platform android --build-profile production

# Sign with release key
jarsigner -verbose -sigalg SHA256withRSA \
  -digestalg SHA256 \
  -keystore app.jks \
  app.aab soleintel
```

### Step 6: Upload to Play Console

1. **Google Play Console** → Your App
2. **Internal Testing** → Create Release
3. **Upload App Bundle** (app.aab file)
4. **Fill in Release Notes:**
   ```
   Version 1.0.0 - Initial Release
   
   Features:
   • Real-time shoe price tracking
   • AI-powered price predictions
   • Community deal board
   • Achievement system
   • Referral rewards program
   ```

### Step 7: Rollout Strategy

**Staged Rollout:**
```
Phase 1: 10% of users (1 week)
  └─ Monitor crashes, reviews, ratings

Phase 2: 50% of users (1 week)
  └─ Continue monitoring, prepare for full release

Phase 3: 100% of users
  └─ Full release to all users
```

### Step 8: Monitor Review

**Expected Review Time:** 24 hours (often instant)

**Check Status:**
```bash
# Via CLI
gh api /repos/ChaitanyaJoshi1769/soleintel/releases

# Via Console
Google Play Console → Your App → Releases
```

---

## Post-Submission Checklist

### iOS (After Submission)
- [ ] Monitor TestFlight for crashes
- [ ] Respond to App Review team messages
- [ ] Prepare phased release strategy
- [ ] Monitor first week metrics
- [ ] Prepare update for any bugs

### Android (After Submission)
- [ ] Monitor internal testing feedback
- [ ] Roll out to 10% of users
- [ ] Monitor crash reports (Firebase)
- [ ] Roll out to 50% if stable
- [ ] Full rollout after 1 week

### Both Platforms
- [ ] Monitor user reviews
- [ ] Track rating trends
- [ ] Monitor download numbers
- [ ] Track active user metrics
- [ ] Prepare response to common issues

---

## Launch Day Checklist

### 24 Hours Before

```
Backend:
- [ ] Verify all APIs responding correctly
- [ ] Check database backups
- [ ] Monitor error tracking (Sentry)
- [ ] Verify caching layer operational

Mobile:
- [ ] Final testing on real iOS device
- [ ] Final testing on real Android device
- [ ] Verify push notifications working
- [ ] Clear cache/data before testing

Operations:
- [ ] Notify on-call team
- [ ] Prepare runbook
- [ ] Test incident response process
- [ ] Verify monitoring dashboards
```

### Launch Day (May 20)

```
6:00 AM PST:
- [ ] Final status check all systems
- [ ] Begin staged rollout (10%)

12:00 PM PST:
- [ ] Review crash reports
- [ ] Check user feedback
- [ ] Monitor app ratings

6:00 PM PST:
- [ ] Review all metrics
- [ ] Decide on 50% rollout
- [ ] Prepare announcement

End of Day:
- [ ] Full rollout to 100% if stable
- [ ] Social media announcements
- [ ] Email to beta testers
- [ ] Begin 24/7 monitoring
```

---

## Success Metrics - First Week

```
Download Targets:
└─ 500+ downloads (realistic)
└─ 200+ active users
└─ 50+ shared watchlists
└─ 20+ community deals
└─ 4.0+ star rating

Stability Targets:
└─ <1% crash rate
└─ 99.9% API uptime
└─ <200ms p99 latency
└─ <0.1% error rate
```

---

## Marketing Launch

### Social Media Posts

**Twitter:**
```
🚀 SOLEINTEL is live on the App Store & Google Play!

Find the best deals on shoes. Get instant price alerts. 
AI predicts price drops. Join 100K+ shoe hunters.

Download now: [iOS link] [Android link]

#ShoeDeals #Fintech #MobileApp #Startups
```

**Instagram:**
```
[Post feature screenshot]

Stop overpaying for shoes. SOLEINTEL tracks prices, 
predicts drops, and alerts you to the best deals.

Available now on iOS & Android. Link in bio 👟

#Shoes #Deals #MobileApp #Innovation
```

**Product Hunt:**
```
SOLEINTEL - Smart Shoe Price Tracker

Never overpay for shoes again. Real-time price tracking, 
AI predictions, and community deals.

Available on iOS & Android.
```

### Email Campaign

**Subject:** "🚀 SOLEINTEL App is Finally Here!"

```
Hi Friend,

We're excited to announce that SOLEINTEL is now live 
on the App Store and Google Play!

Download the app and:
• Track unlimited shoes
• Get instant price drop alerts
• Use AI to predict the best time to buy
• Share deals with the community
• Earn referral rewards

[Download iOS] [Download Android]

P.S. Use code LAUNCH20 for 20% off premium (if applicable)

- The SOLEINTEL Team
```

---

## Summary

**iOS Submission:** 1-2 days
**Android Submission:** Same day (usually)
**Review Time:** 24-48 hours each
**Staged Rollout:** 2-3 weeks recommended

**Total Launch Timeline:**
- Submit: May 15
- Approved: May 17-18
- Launch: May 20 ✅

---

*App Store Submission Guide: May 13, 2026*  
*Status: Ready for submission*  
*Target Launch: May 20, 2026*
