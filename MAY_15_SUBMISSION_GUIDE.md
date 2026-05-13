# May 15 Execution: SUBMISSION DAY ⚡

**Date:** May 15, 2026  
**Goal:** Submit iOS to App Store & Android to Play Store  
**Critical Timeline:** 11am submission deadline

---

## Pre-Submission Morning Checklist (9am-10am)

### Verify Build Files Exist

```bash
# Check iOS build
ls -lh *.ipa
# Expected: Shows IPA file, <100MB

# Check Android build
ls -lh *.aab
# Expected: Shows AAB file, <100MB

# Check build dates
# Expected: Both built yesterday (May 14)
```

### Verify Screenshots & Icons

```bash
# Check iOS assets
ls -lh ios_screenshots/
# Expected: 5 files at 1125x2436px

# Check Android assets  
ls -lh android_screenshots/
# Expected: 5 files at 1080x1920px

# Check icons
ls -lh app_icons/
# Expected: iOS 1024x1024, Android 512x512
```

### Final System Verification

```bash
# Quick health check
curl -s http://localhost:3000/health
# Expected: {"status":"healthy"}

# Database check
curl -s http://localhost:3000/api/categories
# Expected: 200 with categories array

# ML service check
curl -s http://localhost:8000/health
# Expected: Service responding
```

---

## iOS Submission: Step-by-Step (10am-12pm)

### Step 1: Create/Access App Store Connect Account

**URL:** https://appstoreconnect.apple.com

**Required Information:**
- Apple ID: [Your Apple ID]
- Password: [Your password]
- 2FA Code: [Get from phone]

**Log In:**
1. Visit AppStoreConnect
2. Sign in with Apple ID
3. Verify 2FA code
4. Click "My Apps"

### Step 2: Create New App (If First Time)

```
In App Store Connect:
1. Click "+" button (top left)
2. Select "New App"
3. Fill in:
   - Platforms: iOS (check), visionOS (uncheck)
   - Name: "SOLEINTEL - Shoe Price Tracker"
   - Primary Language: English
   - Bundle ID: "com.soleintel.app"
   - SKU: "SOLEINTEL-2026-IOS"
   - User Access: Full Access

4. Click "Create"
5. You'll be taken to app details page
```

### Step 3: Fill in App Information

**In App Store Connect → Your App:**

**App Information Tab:**

```
Name: SOLEINTEL - Shoe Price Tracker
Subtitle: Smart Price Tracking & Deal Alerts

Category: 
  Primary: Shopping
  Secondary: (leave blank)

Age Rating: 4+
  No content warnings selected

Copyright: 2026 SOLEINTEL
Bundle ID: com.soleintel.app (read-only)
```

**Privacy Tab:**

```
Privacy Policy URL: https://soleintel.com/privacy
Category: Health & Fitness Data Collection (select appropriate)
Third-party services: Yes (explain: Stripe, Twilio, Firebase)
User account deletion: Yes (explain method)
```

**Pricing & Availability:**

```
Pricing: Free (default)
Regions: All (or select specific regions)
Release Date: May 20, 2026
```

### Step 4: Add Version Information

**In App Store Connect → Your App → Prepare for Submission:**

```
Version Number: 1.0.0
Build: (We'll select in next step)
```

### Step 5: Add App Description

**In App Store Connect → Prepare for Submission → Localization (English):**

```
Description (Max 4000 chars):
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

Keywords (Max 100 chars):
price tracker, shoe deals, price alerts, shopping, discount finder, price comparison, deals

Support URL: https://soleintel.com/support
Marketing URL: https://soleintel.com

Demo Account:
  Email: demo@soleintel.com
  Password: Demo123!
```

### Step 6: Add Screenshots

**In App Store Connect → Prepare for Submission → Screenshots:**

```
iPhone 6.7" (Max) - Required:
1. Screenshot 1: home_screen.png (1125x2436px)
   → Home Screen - Welcome + Stats
2. Screenshot 2: search_discovery.png (1125x2436px)
   → Search & Discovery - Products
3. Screenshot 3: price_predictions.png (1125x2436px)
   → Price Predictions - AI Dashboard
4. Screenshot 4: community_deals.png (1125x2436px)
   → Community Deals - Trending
5. Screenshot 5: achievements.png (1125x2436px)
   → Achievements - Badges & Rewards

Optional: Add for other devices (iPhone 5.5", etc.)
```

**Upload Steps:**
1. Click screenshot area for first device type
2. Drag and drop 5 images
3. Let App Store verify sizes
4. Reorder if needed (drag to rearrange)
5. Add captions (optional, recommended):
   - Screenshot 1: "Track Your Favorite Shoes"
   - Screenshot 2: "Browse 50,000+ Shoes"
   - Screenshot 3: "AI Predicts Price Drops"
   - Screenshot 4: "Join 100K+ Shoe Hunters"
   - Screenshot 5: "Unlock Badges & Earn Rewards"

### Step 7: Add App Icon

**In App Store Connect → Prepare for Submission → App Icon:**

```
1. Click "+" button
2. Select app_icon_1024.png (1024x1024px)
3. App Store verifies size
4. Should show preview
5. Click Save
```

### Step 8: Content Rating

**In App Store Connect → Prepare for Submission → Content Rating:**

```
Click "Fill out Content Rating Questionnaire"

Answer all questions:
- Violence: None
- Sexual Content: None
- Alcohol/Tobacco: None
- Gambling: None
- Unrestricted Web Access: Yes (users can browse web)
- Unresolved Identifiers: No
- Medical Information: No
- Genetic Information: No
- Biometric Information: Yes (Face ID used for login)
- Student Information: No
- Financial Information: Yes (price tracking, referral earnings)

Result: Rating 4+ (All Ages)
```

### Step 9: Add Build (iOS)

**First, use Xcode to create archive:**

```bash
# In your project directory:
cd apps/mobile

# Using EAS (recommended for Expo projects):
eas build --platform ios --build-profile production

# Or using Xcode:
# 1. Open Xcode project
# 2. Product → Archive
# 3. In Organizer: Distribute App → App Store Connect
# 4. Upload automatically
```

**In App Store Connect → Prepare for Submission → Build:**

```
1. Click "Select a build before you can submit for review"
2. Choose version 1.0.0 build from list
3. Build should be labeled as production build
4. Click Select
```

### Step 10: Submit for Review

**Final Checklist Before Submit:**

- [ ] All required fields filled
- [ ] Screenshots added (5 total)
- [ ] App icon added
- [ ] Build selected
- [ ] Privacy policy URL live
- [ ] Content rating completed
- [ ] Demo account credentials provided
- [ ] No warnings/errors showing

**Submit:**

```
1. Click "Submit for Review" button
2. Answer compliance questions:
   - Encryption: Select "No"
   - Third-party APIs: Check boxes as needed
   - Sign in with Apple: "Yes, our app offers Sign In with Apple"
   - Physical goods/services: "No"
   - Age-restricted content: "No"
   - Children's privacy: "No"
   - Clinical health data: "No"

3. Review agreement terms
4. Check "I agree..."
5. Click "Submit"
6. Confirm submission
```

**Expected Response:**
```
✅ App submitted successfully
✅ Submission ID: [ID number provided]
✅ Expected review time: 24-48 hours
```

---

## Android Submission: Step-by-Step (12pm-2pm)

### Step 1: Access Google Play Console

**URL:** https://play.google.com/console

**Required Information:**
- Google Account: [Your email]
- Password: [Your password]
- 2FA Code: (if enabled)

**Log In:**
1. Visit Google Play Console
2. Sign in with Google Account
3. Verify 2FA if prompted
4. You should see your apps list

### Step 2: Create New App (If First Time)

```
In Google Play Console:
1. Click "Create app" button
2. Fill in:
   - App name: "SOLEINTEL - Shoe Price Tracker"
   - Default language: English
   - App or game: Application
   - Free or paid: Free
   - Declarations: Check all that apply
   
3. Click "Create app"
```

### Step 3: Fill in App Details

**In Google Play Console → App details:**

```
App name: SOLEINTEL - Shoe Price Tracker
Short description (80 chars):
Track shoe prices, find deals, get alerts. AI predictions & community deals.

Full description (4000 chars):
[Same as iOS]

App icon: Upload 512x512px PNG
Feature image (optional): 1024x500px

Category: Shopping
```

### Step 4: Add Content Rating

**In Google Play Console → Content rating:**

```
1. Click "Set up content rating"
2. Fill out questionnaire:
   - Violence: None
   - Sexual content: None
   - Alcohol/Tobacco: None
   - Gambling: None
   - Other restrictions: Select as appropriate

3. Generate rating
4. Should result in "Everyone" or "3+" rating
```

### Step 5: Add Target Audience

**In Google Play Console → Target audience:**

```
- Age group: Everyone
- Familiarity: Entertainment
- Interest: Shopping
```

### Step 6: Add Screenshots

**In Google Play Console → Releases → Screenshots:**

```
For phone:
1. Click "+" button
2. Upload 5 screenshots (1080x1920px minimum)
3. Screenshots required: 2 minimum, 8 maximum
4. Recommended: 5 screenshots (same as iOS)

Screenshots:
1. home_screen_android.png
2. search_discovery_android.png
3. price_predictions_android.png
4. community_deals_android.png
5. achievements_android.png
```

### Step 7: Fill in Store Listing

**In Google Play Console → Store listing:**

```
Title: SOLEINTEL - Shoe Price Tracker

Short description: 
Track shoe prices, find deals, get alerts.

Full description:
[Same as iOS, 4000 chars max]

Category: Shopping

Contact information:
Email: support@soleintel.com
Website: https://soleintel.com
Privacy policy: https://soleintel.com/privacy
Support URL: https://soleintel.com/support
```

### Step 8: Upload Build (AAB File)

**In Google Play Console → Releases → Internal testing:**

```
1. Click "Create release"
2. Click "App signing by Google Play" (recommended)
3. Click "Browse files"
4. Select app.aab file (Android App Bundle)
5. Wait for upload (should be quick)
6. File should show as uploaded

App signing: Let Google manage signing (default)
```

**Or go directly to Production:**

```
1. Go to "Releases" → "Production"
2. Click "Create new release"
3. Follow same steps as internal testing
4. Add Release notes:
   
   Version 1.0.0 - Initial Release
   
   Features:
   • Real-time shoe price tracking
   • AI-powered price predictions
   • Community deal sharing
   • Achievement system
   • Referral rewards program
   • Leaderboards
   • Watchlist sharing
```

### Step 9: Review and Confirm

**Final Checklist:**

- [ ] App name correct
- [ ] Description complete
- [ ] Screenshots added (5 total)
- [ ] App icon added
- [ ] Target audience set
- [ ] Content rating completed
- [ ] AAB file uploaded
- [ ] Release notes added
- [ ] Privacy policy URL correct
- [ ] No errors or warnings

### Step 10: Submit for Review

**Submit:**

```
1. Click "Review" button
2. Review all information one more time
3. Click "Submit release"
4. Confirm message appears
5. App submitted to Play Store

Expected review time: 24 hours (often instant)
```

**Expected Response:**
```
✅ Release submitted for review
✅ Status: In review (usually within 24 hours)
✅ You'll receive email notification when approved
```

---

## Post-Submission (2pm-5pm)

### Document Submission Details

**Create SUBMISSION_LOG.txt:**

```
SOLEINTEL APP STORE SUBMISSIONS
Date: May 15, 2026

iOS APP STORE:
  Submission Time: [11:XX AM PST]
  App ID: [Provided by App Store]
  App Name: SOLEINTEL - Shoe Price Tracker
  Build Version: 1.0.0
  Bundle ID: com.soleintel.app
  Expected Review: 24-48 hours
  Status: Submitted for Review
  
Android PLAY STORE:
  Submission Time: [12:XX PM PST]
  App ID: [Provided by Play Store]
  App Name: SOLEINTEL - Shoe Price Tracker
  Build Version: 1.0.0
  Package: com.soleintel.app
  Expected Review: 24 hours (often instant)
  Status: Submitted for Review

Next Steps:
- May 16: Monitor both app stores for status
- May 17-18: Check review progress daily
- May 19: Final verification before launch
- May 20: Release apps to users
```

### Set Up Monitoring

**Create daily monitoring script:**

```bash
#!/bin/bash
# save as check_status.sh

echo "=== iOS App Store Status ==="
echo "Check: https://appstoreconnect.apple.com"
echo "App: SOLEINTEL - Shoe Price Tracker"
echo "Look for: In Review → Ready for Sale"
echo ""

echo "=== Android Play Store Status ==="
echo "Check: https://play.google.com/console"
echo "App: SOLEINTEL - Shoe Price Tracker"
echo "Look for: In review → Approved"
echo ""

echo "Last checked: $(date)"
```

### Enable Status Notifications

**Set Reminders:**
1. iPhone Calendar: "Check iOS App Store Status" - 9am daily
2. iPhone Calendar: "Check Android Play Store Status" - 9am daily
3. Slack notification: #launch-status channel

---

## Success Criteria

✅ **iOS Submission Complete**
- App submitted to App Store
- Build accepted
- Awaiting review (24-48 hours)
- Submission details documented

✅ **Android Submission Complete**
- App submitted to Play Store
- Build accepted
- Awaiting review (24 hours)
- Submission details documented

✅ **Both Apps Submitted**
- iOS: SUBMITTED ✅
- Android: SUBMITTED ✅
- Ready to monitor May 16-18

---

## Troubleshooting

### If iOS Submission Rejected

```
1. Read rejection reason carefully
2. Fix identified issue
3. Re-submit with same or new build
4. Expected: Usually minor issues (screenshots, policy)
```

### If Android Submission Rejected

```
1. Read rejection reason
2. Fix issue
3. Re-submit
4. Play Store: Usually very quick approval
```

### If Build Won't Upload

```
1. Verify file format (IPA for iOS, AAB for Android)
2. Verify file size <100MB
3. Verify signing certificate valid
4. Try uploading again
5. Contact EAS/Apple support if persistent
```

---

## Celebration Time! 🎉

**Both apps are now in the review queue:**
- iOS App Store: Review in progress (24-48 hours)
- Android Play Store: Review in progress (24 hours)

**Expected Outcomes:**
- Both approved by end of May 18
- Ready to launch May 20
- Monitoring begins May 16

**Next Document:** MAY_16_18_MONITORING_GUIDE.md

---

**May 15 Submission Complete!**

Both SOLEINTEL apps now submitted to their respective app stores.
Approval expected by May 18.
Launch scheduled for May 20.

🚀 **TWO DOWN, THREE DAYS TO LAUNCH!** 🚀

