# Product Analytics Dashboard Setup
## Real-Time Monitoring & Metrics for SOLEINTEL Launch
**Owner:** Product Lead / Analytics Engineer  
**Created:** May 14, 2026  
**Applies to:** Launch monitoring (May 20+)

---

## Overview

This document explains how to set up, monitor, and interpret the analytics dashboards we use to track SOLEINTEL's performance during launch and beyond.

**Our analytics stack:**
- **Firebase Analytics** - User behavior, engagement, crashes
- **Sentry APM** - API performance, errors, error tracking
- **Custom Dashboard** - Real-time KPI tracking
- **App Store Connect** - iOS downloads, reviews, ratings
- **Google Play Console** - Android downloads, reviews, ratings

**Daily ritual:** 9am check of all dashboards (5 minutes)

---

## Part 1: Firebase Analytics Setup

### What Firebase Tracks

Firebase automatically collects:
- **User sessions** - How many users, when they open app
- **Feature usage** - Which features users use most
- **Crashes** - App crashes with stack traces
- **User properties** - Device type, OS version, country
- **Events** - Custom events we define (search, purchase, etc.)

### Accessing Firebase

**URL:** https://console.firebase.google.com/

**Project:** soleintel-production

**Login:**
```
Email: [Your Google account]
Password: [Use Google OAuth]
```

### Key Dashboards

#### 1. Overview Dashboard

**URL:** Firebase Console → Analytics → Dashboard

**Key metrics displayed:**
- **Active Users (last 28 days)** - Total unique users who opened app
- **New Users (last 28 days)** - First-time users
- **Avg Session Duration** - How long users stay
- **Session Count** - Total sessions
- **Retention** - % returning users by day

**What to look for:**
- ✅ Active users trending up
- ✅ New users arriving daily
- ✅ Session duration 3-5 minutes (healthy)
- ✅ Retention >50% day 1, >30% day 7
- ❌ Any sudden drops (indicates problem)

#### 2. Real-Time Dashboard

**URL:** Firebase Console → Analytics → Real-time

**Shows right now:**
- Active users online now
- Events happening right now
- Geographic distribution
- Device types
- Top events

**Daily check (9am):**
```
Are users currently using the app?
- Yes: Normal, continue monitoring
- No: Check if scheduled downtime or off-hours
- Sudden drop: Check Sentry for crashes
```

#### 3. User Acquisition Report

**URL:** Firebase Console → Analytics → Acquisition

**Shows:**
- Where users came from (organic, ads, social, etc.)
- Top traffic sources
- First open count
- New user count

**For launch week:**
```
Track downloads by source:
- App Store organic search: [#]
- Google Play organic search: [#]
- Social media referrals: [#]
- Influencer links: [#]
- Paid ads: [#]
```

#### 4. Retention Report

**URL:** Firebase Console → Analytics → Retention

**Shows:**
- % users who return on day 2, 3, 4, 7, 14, 30
- Cohort analysis (group by signup date)
- Retention trends

**Launch week targets:**
- Day 0 → Day 1: 60%+ return
- Day 0 → Day 7: 30%+ return
- Day 0 → Day 14: 20%+ return

#### 5. Crash & Exceptions

**URL:** Firebase Console → Crashes & Exceptions

**Shows:**
- App crash rate
- Stack traces
- Affected users count
- Affected devices

**Alert thresholds:**
- Crash rate <0.5%: ✅ Good
- Crash rate 0.5-1%: ⚠️ Monitor
- Crash rate >1%: 🔴 Alert, investigate

### Custom Events to Track

**We send custom events to Firebase:**

```javascript
// User searched for shoes
analytics().logEvent('shoe_search', {
  query: 'running shoes',
  num_results: 127,
});

// User viewed shoe details
analytics().logEvent('shoe_view', {
  shoe_id: 'nike_1234',
  brand: 'Nike',
  price: 12999,  // cents
});

// User added to cart
analytics().logEvent('add_to_cart', {
  shoe_id: 'nike_1234',
  price: 12999,
  quantity: 1,
});

// User purchased
analytics().logEvent('purchase', {
  transaction_id: 'txn_abc123',
  value: 12999,  // cents
  currency: 'USD',
  items: [{ shoe_id: 'nike_1234', price: 12999 }],
});

// User left review
analytics().logEvent('review_submitted', {
  shoe_id: 'nike_1234',
  rating: 4.5,
  review_length: 150,
});
```

### Setting Up Custom Reports

**To create a custom report:**

1. Go to Firebase Console → Analytics → Custom Reports
2. Click "+ New Report"
3. Select date range, events, filters
4. Save report for future use

**Reports to create for launch:**

```
Report 1: Daily Downloads
- Metric: New Users
- Dimension: Date
- Filter: None
- View: Line chart by date

Report 2: Feature Adoption
- Metric: Event Count
- Dimension: Event name
- Filter: Event = shoe_search, shoe_view, purchase
- View: Bar chart

Report 3: Geographic Distribution
- Metric: Active Users
- Dimension: Country
- Filter: None
- View: Map

Report 4: Device & OS Analysis
- Metric: User count, Crash count
- Dimension: Device model, OS version
- Filter: None
- View: Table
```

---

## Part 2: Sentry APM & Error Tracking

### What Sentry Tracks

Sentry automatically collects:
- **Errors** - Unhandled exceptions, crashes
- **Performance** - API response times, database query times
- **Transactions** - User flows (e.g., login → search → purchase)
- **Releases** - Which version has errors
- **Source maps** - Line-by-line error details

### Accessing Sentry

**URL:** https://sentry.io/soleintel/

**Login:**
```
Email: [Your email]
Password: [Stored in 1Password]
```

### Key Dashboards

#### 1. Issues Dashboard

**URL:** Sentry → Issues

**Shows:**
- Most frequent errors (by count)
- Recently seen errors
- Assigned issues
- Resolved issues

**What to check daily:**

```
Questions to ask:
1. Are there new errors today?
2. Is error count trending up or down?
3. Are any errors affecting >100 users?
4. Do we have a stack trace for debugging?
5. Has this been assigned to someone?
```

**If new high-impact error:**
- Click on error to view stack trace
- Note which version it's in
- Assign to appropriate team member
- Create issue in GitHub
- Plan fix (hotfix if critical)

#### 2. Performance Dashboard

**URL:** Sentry → Performance → Web Vitals OR Transactions

**Shows:**
- API response times by endpoint
- Slowest database queries
- Frontend performance metrics
- Transaction duration

**Key metrics:**

| Metric | Target | Alert |
|--------|--------|-------|
| API response time (p99) | <200ms | >500ms |
| Database query time | <20ms | >100ms |
| Frontend load time | <3 seconds | >5 seconds |
| Mobile screen navigation | <500ms | >1 second |

**Daily check:**
```bash
# Look at Performance tab
# Which endpoints are slow?
# Did they just get slower?
# Was there a recent change?
```

#### 3. Release Health

**URL:** Sentry → Releases

**Shows:**
- Crash rate by version
- Error rate by version
- User adoption by version
- Adoption timeline

**Example:**
```
Version 1.0.0 (Released May 20)
- Users: 10,543
- Crash rate: 0.8%
- Error rate: 2.1%
- Sessions: 150,000

Version 1.0.1 (Released May 21)
- Users: 8,200 (new on this version)
- Crash rate: 0.3% ✅ Improved!
- Error rate: 1.2% ✅ Improved!
- Sessions: 95,000
```

#### 4. Alerts Configuration

**URL:** Sentry → Alerts → Alerts

**Critical alerts to set up:**

```
Alert 1: High Crash Rate
- Trigger: Crash rate > 1% in 1 hour
- Notify: On-call engineer, Tech Lead
- Action: Page on-call, create Slack notification

Alert 2: New Error Type
- Trigger: New error group (first occurrence)
- Notify: Tech Lead
- Action: Slack notification in #soleintel-alerts

Alert 3: Error Spike
- Trigger: Error rate increased 100% vs baseline
- Notify: Tech Lead
- Action: Slack notification in #soleintel-alerts

Alert 4: Slow API Endpoint
- Trigger: Any API endpoint > 500ms p99
- Notify: Team
- Action: Slack notification in #soleintel-performance
```

### Creating Issues in Sentry

**When an error happens:**

1. Click on the error in Sentry
2. View the stack trace
3. Click "Create GitHub Issue"
4. Fill in title and description
5. Assign to engineer
6. Link to Sentry error

**Example issue:**
```
Title: Fix NullPointerException in ShoeSearchService

Sentry: https://sentry.io/soleintel/issues/12345/
Crash rate: 0.5%, affecting ~150 users
Introduced in: v1.0.2 (May 21)

Stack trace:
  at ShoeSearchService.filterBySize()
  at SearchController.handleSearch()
  at SearchScreen.onSearchTap()

Likely cause: 
  - User searches with shoe_id = null
  - Service doesn't validate input
  - Crashes instead of returning empty results

Fix:
  - Add null check in filterBySize()
  - Return empty results if shoe_id is null
  - Add test case for null input
```

---

## Part 3: Custom KPI Dashboard

### Build Our Own Dashboard

**We use a custom internal dashboard for real-time KPIs:**

**URL:** https://soleintel-dashboard.internal/

**Key metrics displayed:**

```
DOWNLOADS
├─ Today: 847
├─ This week: 3,421
├─ Cumulative: 45,230
└─ Target: 10,000

ACTIVE USERS
├─ Today: 3,200
├─ 28-day: 15,430
├─ Trend: ↑ 12% from yesterday
└─ Target: 5,000

RETENTION
├─ Day 1: 68%
├─ Day 7: 35%
├─ Day 14: 18%
└─ Target: >50% day 1

CRASH RATE
├─ Current: 0.6%
├─ 24h avg: 0.7%
├─ Trend: ↓ Improving
└─ Target: <0.5%

APP RATING
├─ iOS: 4.3 ⭐ (87 reviews)
├─ Android: 4.1 ⭐ (54 reviews)
├─ Avg: 4.2 ⭐
└─ Target: >4.0

REVENUE
├─ Today: $2,345
├─ This week: $8,234
├─ Cumulative: $45,230
└─ Target: $50,000 (May)
```

### Setup Instructions

**To set up the dashboard:**

1. Add data sources:
   - Firebase Analytics API
   - Sentry API
   - App Store Connect API
   - Google Play Console API
   - Custom backend metrics

2. Create widgets for each metric
3. Configure refresh intervals (30 seconds)
4. Set alert thresholds
5. Share with team in Slack daily

**Tech stack:**
- Backend: Python/FastAPI (pulls data from APIs)
- Frontend: React (displays in real-time)
- Hosting: Railway (auto-deploys with main)

---

## Part 4: App Store Monitoring

### iOS App Store Connect

**URL:** https://appstoreconnect.apple.com/

**Account:** [Your Apple ID]

**Key metrics:**

#### Dashboard Tab

```
New Purchases: [#]
Active Subscriptions: [#]
Downloads: [#]
Redownloads: [#]
Daily Active Users: [#]
Monthly Active Users: [#]
```

#### Reviews Tab

```
All reviews for your app
Sort by: Newest, Highest rated, Lowest rated

Daily check:
- Any new 1-2 star reviews? Why?
- Any bugs reported in reviews? Cross-check with Sentry.
- Respond to negative reviews within 24 hours
- Thank 5-star reviewers (builds loyalty)
```

#### Trends Tab

```
Download trends: [Chart by date]
Revenue trends: [Chart by date]
Crashes & issues: [Data from TestFlight/Sentry]
Performance: [Metrics by device/OS]
```

### Google Play Console

**URL:** https://play.google.com/console/

**Account:** [Your Google account]

**Key metrics:**

#### Main Metrics Card

```
Installs (last 28 days): [#]
Uninstalls (last 28 days): [#]
Active devices: [#]
Crashes & ANRs: [#]
Rating: [★ out of ★★★★★]
Rating count: [# reviews]
```

#### Reviews

```
All reviews for your app
Sort by: Most helpful, Newest, Highest rated, Lowest rated

Daily check:
- Any 1-2 star reviews? (Same as iOS)
- Response rate: Are we responding?
- Common themes in reviews
- Cross-check bug reports with Sentry
```

#### Statistics

```
Android version: Which versions are users on?
Device: Which devices have most users?
Country: Where are users downloading from?
Language: What languages?
```

### Daily Review Response Template

**When responding to negative reviews:**

```
Thank you for the feedback! I'm sorry you had a poor experience.

[If it's a bug]
We identified the issue and shipped a fix in v1.0.2 (available now).
Please update the app and try again. Let me know if it helps!

[If it's a feature request]
Great idea! This is on our roadmap for Phase 2 (June). 
Thanks for helping us build a better app.

[If it's a complaint about pricing/policies]
I hear your feedback about [issue]. We appreciate the input
and will take this into consideration for future improvements.

[Always include]
If you continue to experience issues, please email us at 
support@soleintel.com with details. We're here to help!

Thanks for trying SOLEINTEL!
- The SOLEINTEL Team
```

---

## Part 5: Daily Monitoring Checklist

### 9:00 AM Daily Check (5 minutes)

**Start here every morning:**

```
☐ Firebase Overview Dashboard
  ☐ Active users: Trending up? > target?
  ☐ New users: Any dip? Healthy growth?
  ☐ Session duration: 3-5 min? If <2 min, UX issue?
  ☐ Retention: >50% D1, >30% D7?

☐ Sentry Crash Dashboard
  ☐ Crash rate: <0.5%? If >1%, escalate!
  ☐ New errors: Any new types appeared?
  ☐ Error trend: Up or down from yesterday?

☐ Custom KPI Dashboard
  ☐ Downloads: On pace for target?
  ☐ Revenue: On pace for target?
  ☐ Retention: Hitting targets?
  ☐ Rating: Any sudden drops? (<3.5 is warning)

☐ App Store / Play Store
  ☐ Any new 1-2 star reviews? Note reasons.
  ☐ Any common bug reports? Cross-check Sentry.
  ☐ Rating trend: Up or down?

☐ Escalate if needed:
  ☐ Crash rate spike? → On-call engineer
  ☐ Downloads drop? → Product lead
  ☐ Rating below 4.0? → Marketing
  ☐ Major bug in reviews? → Tech lead
```

### Daily Slack Update (9:15 AM)

**Post in #soleintel-general:**

```
📊 DAILY METRICS - May 21

Growth:
• Downloads: 847 (target: 1,200)
• Active users: 3,200 (target: 4,000)
• New users: 623 (target: 800)

Quality:
• Crash rate: 0.6% (target: <0.5%)
• Rating: 4.2⭐ (87 reviews)
• Error count: 2 (down from 5 yesterday)

Engagement:
• Avg session: 4.2 min
• Day 1 retention: 68%
• Day 7 retention: 35%

Issues:
• [List any alerts or concerns]

Wins:
• [Celebrate any milestones or improvements]
```

### Weekly Metrics Review (Friday 3pm)

**Deep dive on the week:**

**Prepare analysis:**
```
WEEKLY SUMMARY - [Date Range]

DOWNLOADS
- This week: [#]
- Last week: [#]
- Trend: [↑/↓] [%]
- Target for month: [#]
- On pace? [Yes/No]

REVENUE
- This week: $[#]
- Last week: $[#]
- Trend: [↑/↓] [%]
- Target for month: $[#]
- On pace? [Yes/No]

ENGAGEMENT
- Avg session: [#] min
- % active users: [#]%
- Top features: [List]

QUALITY
- Avg crash rate: [#]%
- Avg rating: [#]⭐
- Top issues: [List]

RETENTION
- Day 1: [#]%
- Day 7: [#]%
- Day 14: [#]%
- Trend: [↑/↓]

NEXT WEEK FOCUS
- [Action 1]
- [Action 2]
- [Action 3]
```

---

## Part 6: Interpreting the Data

### Growth Metrics

**Downloads / New Users**
- Target: Growing 20-30% week-over-week
- Healthy sign: Organic growth staying high
- Warning sign: Plateau or decline
- Action: Check marketing, ask for influencer boost

**Active Users**
- Target: 30-40% of total downloads stay active
- Healthy sign: Consistent daily activity
- Warning sign: Sudden drop (indicates problem)
- Action: Check for crashes/bugs, review user feedback

**Revenue**
- Target: Avg $2-5 per user (ARPU)
- Healthy sign: Revenue growing with users
- Warning sign: Users downloading but not purchasing
- Action: Check conversion funnel, improve pricing/offers

### Engagement Metrics

**Session Duration**
- Target: 3-5 minutes average
- Healthy: Users exploring features
- Low (<2 min): Users not finding what they want
- High (>10 min): Addictive or confusing

**Feature Adoption**
- Track: % users who try search, filter, reviews
- Healthy: >70% try main features
- Low: <30% try a feature = not visible/useful
- Action: Improve onboarding for low-adoption features

**Retention**
- Target: >50% day 1, >30% day 7, >15% day 30
- Industry average: 25% day 30 (we want 30%+)
- If below target: Product quality issue or unclear value
- If above target: Exceptional engagement

### Quality Metrics

**Crash Rate**
- Target: <0.5%
- Yellow alert: 0.5-1%
- Red alert: >1%
- Action: Page on-call, revert if recent deploy

**Rating**
- Target: >4.0 stars
- Healthy: 4.0-4.5 ⭐
- Warning: 3.5-4.0 ⭐ (addressing issues)
- Critical: <3.5 ⭐ (major problem)
- Action: Read reviews, fix bugs, respond to concerns

**Error Rate**
- Target: <5 new errors per day
- Monitor: Which errors? How often?
- Action: Fix high-impact errors in next release

### Understanding Anomalies

**When something changes suddenly:**

```
ANOMALY: Downloads dropped 50% today vs yesterday

1. Is it a real problem or data issue?
   - Check App Store/Play Store directly
   - Check Sentry for errors/crashes
   - Ask team if they remember what changed

2. What could cause this?
   - Bad app version (crashes)?
   - Marketing campaign ended?
   - App removed from search?
   - Server issues?
   - Competitor launched?

3. What to do?
   - If app issue: Hotfix and redeploy
   - If marketing: Boost ads/social
   - If technical: Escalate to tech lead
   - If external: Monitor and adjust

4. Document:
   - What happened
   - Why we think it happened
   - What we did about it
   - Outcome
```

---

## Part 7: Communicating Metrics to Stakeholders

### For Product Team (Daily)

```
Focus on: Feature adoption, retention, quality
Format: Brief Slack message
Frequency: Daily 9:15am
Example:
"📊 Downloads +12%, crashes fixed! Retention D1=68%, D7=35%.
Top feature: Search (84% adoption). Working on: Improve filter UX."
```

### For Engineering Team (Daily)

```
Focus on: Crashes, errors, performance
Format: Brief Slack message
Frequency: Daily 9:15am
Example:
"🔧 Crash rate 0.6% (target: <0.5%). 2 critical fixes deployed.
Top error: NullPointerException in ShoeService (0.2%). Fixed in v1.0.2."
```

### For Marketing Team (Daily)

```
Focus on: Downloads, growth, user acquisition
Format: Brief Slack message
Frequency: Daily 9:15am
Example:
"📈 847 downloads today, +20% from yesterday. 623 new users.
App rating 4.2⭐ (up from 4.1). Top referrer: Twitter (+34%)."
```

### For Leadership/Investors (Weekly)

```
Focus on: Revenue, growth, key metrics
Format: Detailed spreadsheet or PDF
Frequency: Friday end-of-day
Include:
- Revenue vs target
- Downloads vs target
- Growth rate (WoW %)
- User retention cohorts
- Top features
- Key challenges
- Next week priorities
```

---

## Part 8: Tools & Access

### Required Tool Access

**Before launch, ensure everyone has access to:**

- [ ] Firebase Console (all team members)
- [ ] Sentry (all engineers)
- [ ] App Store Connect (product team)
- [ ] Google Play Console (product team)
- [ ] Custom dashboard (all team members)
- [ ] Slack integration (Sentry, Firebase, custom dashboard)

### Slack Integrations

**Set up Slack notifications for:**

```
Firebase Alerts:
- High crash rate (>1%)
- Sudden user drop
- New users milestone (every 1,000)

Sentry Alerts:
- New error type
- Error spike
- Resolved issue

Custom Dashboard:
- Daily KPI report (9:15am)
- Milestone notifications
- Alert if any metric below target
```

---

## Part 9: Troubleshooting Dashboard Issues

### Firebase not showing data?

```
1. Check mobile app is sending data
   - Open Firebase Console → Real-time
   - Open app on phone/emulator
   - Do you see users in real-time? If yes, it's working

2. Check tracking is enabled in app code
   - Search for analytics().logEvent() in codebase
   - Is it being called?
   
3. Check Firebase SDK is initialized
   - Firebase should initialize on app startup
   - Check console for Firebase debug logs
```

### Sentry not showing errors?

```
1. Check app is initialized with Sentry
   - Start app, cause an error intentionally
   - Should appear in Sentry within 1 minute
   
2. Check Sentry API key is correct
   - Check app config for Sentry DSN
   - DSN should start with "https://[key]@sentry.io/[project]"
   
3. Sourcemaps not loading?
   - Errors should show exact line numbers
   - If showing "[unknown]", sourcemaps not uploaded
   - Upload sourcemaps with release
```

### App Store/Play Store not updating?

```
1. Check you're looking at right app
   - iOS: SOLEINTEL (com.soleintel.app)
   - Android: SOLEINTEL (com.soleintel.app)

2. Check data is delayed
   - App Store/Play Store delay ~24 hours
   - Real-time data: Firebase, Sentry, custom dashboard

3. Check build version matches
   - App Store shows metrics for latest build
   - Make sure you built and submitted the right version
```

---

## Success Indicators

We're monitoring well if:

✅ <5 minutes to notice major issues  
✅ <2 hours to identify root cause  
✅ <1 hour to deploy fix  
✅ Team confident in decision-making  
✅ No surprises (we know what's happening)  
✅ Data-driven not gut-feel driven  
✅ All stakeholders informed daily  

---

## Final Checklist

Before launch, confirm:

- [ ] Firebase analytics implemented correctly
- [ ] Sentry error tracking configured
- [ ] Custom dashboard built and deployed
- [ ] App Store Connect/Play Store set up
- [ ] Slack integrations working
- [ ] Team trained on reading dashboards
- [ ] Daily monitoring process documented
- [ ] Alerting thresholds set appropriately
- [ ] Someone assigned to daily 9am check
- [ ] Weekly review meeting scheduled

---

**Dashboard Version:** 1.0  
**Created:** May 14, 2026  
**Owner:** Product Lead / Analytics Engineer  
**Review Cadence:** Weekly during launch, monthly after  
**Questions?** Ask Product Lead or Analytics Engineer
