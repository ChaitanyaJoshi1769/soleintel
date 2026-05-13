# May 20 Metrics Monitoring Guide

**Purpose:** Real-time monitoring during launch day (May 20, 2026)  
**Audience:** Analytics team, DevOps, PM  
**Timeline:** 6am start, continuous through 8pm  
**Last Updated:** May 13, 2026

---

## Overview

On May 20, we launch SOLEINTEL to 10% of users (Phase 1). This guide tells you:
- What metrics matter
- Where to find them
- What normal looks like
- When to escalate
- How to interpret the data

**Rule of thumb:** Check metrics every 5-15 minutes during the 7am-6pm critical window.

---

## Critical Metrics (Check Every 5 Minutes)

### 1. App Installation Rate

**What it measures:** How many users successfully download and install the app  
**Where to find it:** Google Play Console + App Store Connect  
**Normal value:** Increases 5-10 per minute in first hour, then 1-3 per minute  
**Lag time:** 15-30 minutes (reports update periodically)

**Check procedure:**
1. App Store Connect: Analytics → Installs
2. Google Play Console: Analytics → Installs  
3. Note: These lag actual installs by 15-30 min

**Alert triggers:**
- ⚠️ Yellow alert: Installs drop below 0.5/min for 10+ minutes
- 🔴 Red alert: Installs drop to zero for 5+ minutes
- **Action:** Check if app stores rejected submission, or user-facing crash

### 2. Crash Rate

**What it measures:** What % of users experience a crash (major indicator of app quality)  
**Where to find it:** 
- Firebase Crashlytics (real-time)
- Sentry (real-time)  
**Normal value:** <0.5% for first hour, target <1% all day  
**Lag time:** 30 seconds to 2 minutes

**Check procedure:**
1. Sentry dashboard: https://[your-sentry-domain].sentry.io
2. Look for: "Issues" → view crash rate %-age
3. Also check Firebase: Analytics → User health

**Alert triggers:**
- 🟡 Yellow: Crash rate >0.5% for 5 min
- 🔴 Red: Crash rate >2% for any duration
- **Action:** Check Sentry for which screen/feature is crashing

### 3. DAU (Daily Active Users)

**What it measures:** Number of unique users who opened the app today  
**Where to find it:** Firebase Analytics (real-time)  
**Normal value:** 
- Hour 1: ~50-100 users
- Hour 2-4: ~200-500 cumulative DAU
- Hour 8 (end of day): 1,000+ DAU (Week 1 target)  
**Lag time:** ~15 minutes

**Check procedure:**
1. Firebase Console: Analytics → Realtime
2. Or: Audiences → Custom metrics → DAU
3. Also: Google Play Console → Analytics → Active installs

**Alert triggers:**
- 🟡 Yellow: DAU flat for 30+ minutes
- 🔴 Red: DAU decreasing for 15+ minutes
- **Action:** Check if there's a crash, or if onboarding flow is broken

### 4. Session Count

**What it measures:** Number of times users open and use the app (engagement)  
**Where to find it:** Firebase Analytics  
**Normal value:** 
- Hour 1: 1.5-2 sessions per user (user opens, explores)
- Hour 8: 2.5-4 sessions per user average  
**Lag time:** ~15 minutes

**Check procedure:**
1. Firebase: Analytics → Events
2. Look for: session_start events, count them

**Alert triggers:**
- 🟡 Yellow: Sessions per user drop below 1.2
- **Action:** Onboarding funnel might have UX issue

### 5. API Error Rate

**What it measures:** % of API requests that fail (backend health)  
**Where to find it:** Sentry + Railway logs  
**Normal value:** <0.1% (1 error per 1,000 requests)  
**Lag time:** 1-2 minutes

**Check procedure:**
1. Sentry → Transactions → API routes
2. Look for error rate badge
3. Or: Railway logs: `railway logs -f` (follow in real-time)

**Alert triggers:**
- 🟡 Yellow: Error rate >0.5% for 5 min
- 🔴 Red: Error rate >5% for any duration
- **Action:** Check error logs, may need to scale database or API

### 6. API Response Time (p99)

**What it measures:** Slowness of the API (user experience)  
**Where to find it:** Sentry → Transactions or custom APM  
**Normal value:** <200ms p99 (99th percentile)  
**Lag time:** 2-5 minutes

**Check procedure:**
1. Sentry → Transactions
2. Click on API endpoint, view p99 latency
3. Or: Custom dashboard with API metrics

**Alert triggers:**
- 🟡 Yellow: p99 >250ms for 10 min
- 🔴 Red: p99 >500ms for any duration
- **Action:** Database slow, check query performance, may need to scale

### 7. App Store Rating

**What it measures:** User satisfaction (1-5 stars)  
**Where to find it:** App Store Connect + Google Play Console  
**Normal value:** 4.0+ star rating  
**Lag time:** 1-2 hours

**Check procedure:**
1. App Store Connect: My Apps → SOLEINTEL → Sales and Trends → Ratings
2. Google Play Console: Analytics → Ratings
3. Note: This updates slowly, don't obsess over it early

**Alert triggers:**
- 🟡 Yellow: Rating drops below 3.8
- 🔴 Red: Rating drops below 3.0
- **Action:** Check reviews for common complaint, fix it rapidly

---

## Secondary Metrics (Check Every 15-30 Minutes)

### 8. Onboarding Completion Rate

**What it measures:** % of users who complete signup/onboarding (funnel success)  
**Where to find it:** Firebase Analytics → Custom funnel  
**Normal value:** 60%+ of installers complete onboarding  
**Lag time:** 15 minutes

**Check procedure:**
1. Firebase: Analytics → Events
2. Look for: `app_open` → `sign_up` → `onboarding_complete`
3. Calculate: (Complete / Install) × 100%

**Alert triggers:**
- 🟡 Yellow: Completion rate <50%
- 🔴 Red: Completion rate <20%
- **Action:** Onboarding flow has UX issue, check support tickets

### 9. Feature Adoption

**What it measures:** Which features users engage with (product success)  
**Where to find it:** Firebase Analytics → Events  
**Normal value:** 
- Search shoe: 80%+ of users
- Add to watchlist: 70%+ of users  
- View deals: 60%+ of users  
**Lag time:** 15 minutes

**Check procedure:**
1. Firebase: Analytics → Custom events
2. View each feature's event count
3. Calculate: (Feature users / DAU) × 100%

**Alert triggers:**
- 🟡 Yellow: Any core feature <40% adoption
- **Action:** Feature might be hard to discover, check UX

### 10. Server Load (CPU, Memory, Database)

**What it measures:** Backend resource utilization (scale readiness)  
**Where to find it:** Railway dashboard or AWS CloudWatch  
**Normal value:** 
- CPU: <60% utilization
- Memory: <70% utilization
- Database connections: <80% of pool  
**Lag time:** 1-2 minutes

**Check procedure:**
1. Railway: https://railway.app → Deployments → Metrics
2. Or: AWS console → EC2 → Metrics
3. Look for: CPU %, Memory %, Network in

**Alert triggers:**
- 🟡 Yellow: CPU >70% or Memory >80%
- 🔴 Red: CPU >85% or Memory >90%
- **Action:** May need to scale horizontally, contact DevOps

---

## Dashboard Setup (6am May 20)

### Recommended Layout

**Main Monitor (Public display for team)**
```
┌─ SOLEINTEL LAUNCH METRICS ────────────────────────┐
│ Time: [Current time ET]    Phase: [1 / 2 / 3]    │
├──────────────────────────────────────────────────┤
│ 📊 LIVE METRICS                                   │
│  • Installs (24h):    XXX ↑                      │
│  • Crash rate:        X.X% ↓                     │
│  • DAU (right now):   XXX ↑                      │
│  • Sessions/user:     X.X ↑                      │
│                                                   │
│ 🔴 ALERTS                                         │
│  • [Alert 1 - if any]                            │
│  • [Alert 2 - if any]                            │
│                                                   │
│ 🎯 PHASE TARGETS                                  │
│  • Downloads: XXX / 200+ ✅                       │
│  • Crash rate: X.X% / <1% ✅                      │
│  • DAU: XXX / 300+ ✅                             │
└──────────────────────────────────────────────────┘
```

### Screen 1: Installation & Growth (DevOps Monitor)

**Tools:** App Store Connect + Play Console + Firebase  
**Refresh:** Every 5 minutes

```
Show:
- Real-time installs (line chart, last 4 hours)
- DAU (line chart, last 4 hours)
- Hourly breakdown (table)
- Growth rate (current installs/min)
```

### Screen 2: Crash & Error Analysis (Engineering Monitor)

**Tools:** Sentry + Firebase Crashlytics  
**Refresh:** Real-time (every 30 seconds)

```
Show:
- Crash rate (large number, red if >1%)
- Top crashes (list of issues, sortable by count)
- Error rate (API %)
- Error timeline (last issue: timestamp)
```

### Screen 3: API Performance (DevOps Monitor)

**Tools:** Sentry transactions or custom APM  
**Refresh:** Every 2 minutes

```
Show:
- API latency p99 (large number, red if >300ms)
- Slowest endpoints (table, top 5)
- Error rate by endpoint (table)
- Database query times (if available)
```

### Screen 4: Revenue & Engagement (PM Monitor)

**Tools:** Firebase Analytics  
**Refresh:** Every 15 minutes

```
Show:
- Onboarding completion %
- Feature adoption rates
- Session length (average)
- Retention: % of Day 1 users still active
```

---

## Monitoring Shift Schedule

### 6am-7am: Pre-Launch Prep
**Team:** Tech Lead, DevOps  
**Tasks:**
- [ ] Verify all dashboards are accessible
- [ ] Test metric feeds are live
- [ ] Confirm alert channels working
- [ ] Brief team on procedures

### 7am-12pm: Launch & Growth Phase (Critical)
**Team:** 2x engineers + analyst  
**Frequency:** Check metrics every 5 minutes  
**Focus:** Installs, crashes, errors  
**Actions:** Actively intervene if needed

### 12pm-5pm: Sustained Launch Phase
**Team:** 1-2 engineers + analyst  
**Frequency:** Check metrics every 10-15 minutes  
**Focus:** Sustained growth, engagement metrics  
**Actions:** Monitor, but less intervention needed

### 5pm-8pm: Evening Phase & Handoff
**Team:** 1 engineer on-call + analyst  
**Frequency:** Check metrics every 15-30 minutes  
**Focus:** Overall health before EOD  
**Actions:** Prepare overnight on-call handoff

---

## Metric Interpretation Guide

### Installs: Normal Daily Pattern

```
Time        Installs/min  Pattern
6am-7am     0             Pre-launch, app not live
7am-8am     5-10          Launch hour, peak interest
8am-9am     3-5           Initial surge subsides
9am-12pm    1-3           Steady growth
12pm-5pm    1-2           Afternoon lull (expected)
5pm-8pm     1-2           Late afternoon slow
8pm+        <1            Evening drop-off
```

**When to worry:**
- Suddenly drops to zero → Check app stores (might be removed)
- Stays below 0.5/min after hour 3 → Something wrong, check crashes

### Crash Rate: Expected Progression

```
Time        Expected crash rate    Normal
Hour 0-1    0.1-0.5%              Very few installs, some crash expected
Hour 1-3    0.2-0.8%              More users, some crashes normal
Hour 4-6    <0.5%                 Should stabilize
Hour 8+     <1%                    Launch day target
```

**When to worry:**
- Jumps to >2% → Critical crash, needs immediate fix
- Stays >1% → Systemic issue, needs investigation

### DAU: Expected Growth

```
Hour    Expected DAU    Growth rate
1       50-100          New installs + early adopters
2       100-200         2x growth
3       150-300         Spreading
4       200-500         Word of mouth starting
8       1,000+          End of day, Week 1 target
```

**When to worry:**
- Flat or declining DAU → Crash, or onboarding broken
- Should always be going up on launch day

### API Response Time: What's Normal

```
Endpoint              Normal p99    Threshold    Critical
GET /shoes            100-150ms     <200ms       >300ms
POST /search          200-300ms     <400ms       >600ms
GET /watchlist        50-100ms      <150ms       >300ms
POST /alert           100-150ms     <200ms       >400ms
```

**When to worry:**
- Across-the-board slowness → Database under load
- Specific endpoint slow → That service needs scaling

---

## Escalation Procedures

### Severity Levels & Response Times

| Severity | Metric | Response | Example |
|----------|--------|----------|---------|
| 🟢 INFO | Normal ops | Update dashboard | Installs at expected rate |
| 🟡 YELLOW | Warning sign | Investigate | Crash rate at 0.8% |
| 🔴 RED | Critical issue | Immediate action | Crash rate >2%, installs at zero |

### Yellow Alert → Escalation

```
1. Note what's happening
2. Check root cause (is there an error spike?)
3. If no obvious cause, @mention on-call engineer
4. Wait 5 minutes
5. If not improving, escalate to PM for decision to roll back
```

### Red Alert → Immediate Escalation

```
1. STOP normal work
2. @mention PM and Tech Lead in #soleintel-dev-alerts
3. Brief them: "Issue: [what], Impact: [how many], Action: [what we're doing]"
4. Activate emergency response procedures
5. Prepare rollback if needed
```

### Example Escalation Messages

**Yellow Alert Example:**
```
🟡 YELLOW ALERT - Elevated Crash Rate

Crash rate: 0.8% (was 0.2%)
Affected: ~50 users
Trending: ⬆️ Increasing
Duration: 10 minutes

Investigating root cause. Checking Sentry now. Will update in 5 min.
```

**Red Alert Example:**
```
🔴 RED ALERT - Critical Crash Spike

Crash rate: 3.2% 🔥
Affected: ~200 users
Trending: ⬆️ Rapidly increasing  
Duration: 5 minutes

Root cause: Null pointer in shoe search feature (19 crashes)
Action: Preparing rollback to v0.9.9
Estimated impact: 5 minute downtime
ETA: 3 minutes

@PM @TechLead - Confirm proceed with rollback?
```

---

## Common Issues & What to Look For

### Issue: "Installs dropping"

**Check in this order:**
1. Did we push Phase 2? (Maybe we hit our target)
2. App store rejection? (Check App Store Connect / Play Console status)
3. Crash spike? (Check Sentry crash rate)
4. Marketing campaign ended? (Check if social media push is still running)

### Issue: "High crash rate"

**Check in this order:**
1. Sentry → Which screen is crashing? (Top crashes list)
2. When did it start? (Crash timeline)
3. Is it a specific device/OS? (Filter by Android vs iOS)
4. Is it new users (onboarding) or existing users? (Compare with registration events)

### Issue: "API slow"

**Check in this order:**
1. Is it all endpoints or specific ones? (Check by route)
2. When did it start? (Timeline of latency)
3. Is database under load? (Check Railway metrics)
4. Is it CPU-bound or I/O-bound? (Check query logs)

### Issue: "Onboarding completion low"

**Check in this order:**
1. Where do users drop? (Funnel analysis - sign up vs. profile vs. first search)
2. Are there any errors? (Check Sentry for signup feature)
3. Is copy/UX unclear? (Check support tickets for feedback)
4. Is there a crash in onboarding? (Check crash logs)

---

## Dashboard Refresh Rates & Reality

| Metric | Source | Actual Lag | Dashboard Lag | Total Lag |
|--------|--------|-----------|----------------|-----------|
| Installs | App Stores | 5-30 min | Usually 15 min | 15-45 min |
| Crashes | Sentry | 30 sec | Real-time | 30 sec |
| DAU | Firebase | 15 min | Real-time | 15 min |
| API Latency | APM | 1-2 min | Real-time | 1-2 min |
| Ratings | App Stores | 2+ hours | 2+ hours | 2+ hours |

**Key insight:** Installs lag significantly. Don't panic if they don't update for 15 minutes—this is normal.

---

## Real-Time Monitoring Checklist (May 20)

### Every 5 Minutes (7am-12pm)

- [ ] Check crash rate in Sentry (is it rising?)
- [ ] Check installs in App Store Connect (is it growing?)
- [ ] Check Sentry errors (any new issues?)
- [ ] Glance at API latency (p99 still <300ms?)
- [ ] Are team members healthy? (Morale check)

### Every 15 Minutes (12pm-8pm)

- [ ] Check DAU trend
- [ ] Check feature adoption
- [ ] Check session length
- [ ] Check ratings (though this updates slowly)
- [ ] Update public dashboard for team morale

### Hourly Summary (All day)

- [ ] Summarize: "Hour [X]: [Install count], [Crash rate], [Any issues]"
- [ ] Post to #soleintel-launch
- [ ] Brief PM on phase readiness

---

## Tools & Access Setup (Before 6am May 20)

**Tools to set up:**
- [ ] Sentry: https://[your-sentry-domain].sentry.io
- [ ] Firebase: https://console.firebase.google.com
- [ ] App Store Connect: https://appstoreconnect.apple.com
- [ ] Google Play Console: https://play.google.com/console
- [ ] Railway: https://railway.app
- [ ] Custom dashboard (Grafana, Data Studio, etc.)

**Permissions needed:**
- [ ] Everyone on team has access
- [ ] No unexpected auth failures
- [ ] API keys configured
- [ ] Dashboard URLs bookmarked

**Test (May 19):**
- [ ] Can you view each dashboard?
- [ ] Do metrics load?
- [ ] Can you see historical data?
- [ ] Alerts working?

---

**SOLEINTEL May 20 Metrics Monitoring Guide**

Use this guide to stay on top of the launch. Monitor metrics continuously, escalate early, and keep the team informed.

🎯 **Rule of thumb: If a metric seems wrong, ask!** Better to over-communicate than miss a real issue.

📊 **Let's monitor this launch successfully!**
