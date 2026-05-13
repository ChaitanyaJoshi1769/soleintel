# May On-Call & Escalation Procedures Guide

**Purpose:** Define on-call rotation, responsibilities, and escalation paths for May 13-27  
**Timeline:** May 13-27, 2026  
**Status:** To be filled in by project manager before May 13

---

## On-Call Rotation Schedule

### May 13 (Pre-Launch Day)

| Time | Role | Name | Phone | Slack | Responsibilities |
|------|------|------|-------|-------|------------------|
| 24 hours | Full team available | All | (Work hours) | @everyone | Final verification, pre-flight checklist |

---

### May 14 (Build & Test Day)

| Time | Role | Name | Phone | Slack | Responsibilities |
|------|------|------|-------|-------|------------------|
| 5:45am - 12:30pm | Engineering team | All on-site | [Phone] | @channel | Build, test, deployment |
| 12:30pm - 6pm | On-call engineer | [Name] | [Phone] | @oncall | Monitor builds, available for issues |
| 6pm - 8am | Night on-call | [Name] | [Phone] | @oncall | Monitor overnight (low priority) |

---

### May 15 (Submission Day)

| Time | Role | Name | Phone | Slack | Responsibilities |
|------|------|------|-------|-------|------------------|
| 8am - 2pm | Submission team | [Names] | [Phone] | @channel | iOS & Android submission |
| 2pm - 6pm | On-call engineer | [Name] | [Phone] | @oncall | Monitor submissions, alert if issues |
| 6pm - 8am | Night on-call | [Name] | [Phone] | @oncall | Monitor overnight (low priority) |

---

### May 16-19 (Submission Review Period)

| Time | Role | Name | Phone | Slack | Responsibilities |
|------|------|------|-------|-------|------------------|
| 9am - 5pm | Check app store status | [Name] | [Phone] | @oncall | Check for approval status, reviewer questions |
| 5pm - 9am | Night on-call | [Name] | [Phone] | @oncall | Passive monitoring |

---

### May 20 (Launch Day) - CRITICAL

| Time | Role | Name | Phone | Slack | Responsibilities |
|------|------|------|-------|-------|------------------|
| 6am - 7am | Verification | Tech lead | [Phone] | @tech_lead | Final system verification |
| 7am - 12pm | Primary on-call | [Name] | [Phone] | @oncall_primary | Active monitoring, metric checking (every 5 min) |
| 7am - 12pm | Secondary monitor | [Name] | [Phone] | @oncall_secondary | Backup monitoring, watch for spikes |
| 12pm - 6pm | Primary on-call | [Name] | [Phone] | @oncall_primary | Continue monitoring |
| 12pm - 6pm | Secondary monitor | [Name] | [Phone] | @oncall_secondary | Backup monitoring |
| 6pm - 8pm | Primary on-call | [Name] | [Phone] | @oncall_primary | Final metrics review |
| 6pm - 8pm | Secondary monitor | [Name] | [Phone] | @oncall_secondary | Backup monitoring |
| 8pm - 6am | Night on-call | [Name] | [Phone] | @oncall_night | Monitor overnight, escalate if needed |

**Note:** May 20 is the most critical day. Have 2 people dedicated to monitoring during peak hours.

---

### May 21-27 (Week 1 Monitoring)

| Date | Time | On-Call Engineer | Phone | Slack | Focus |
|------|------|------------------|-------|-------|-------|
| May 21 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics, monitor phase 2 decision |
| May 21 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 22 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics, monitor phase 3 decision |
| May 22 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 23 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics |
| May 23 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 24 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics |
| May 24 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 25 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics |
| May 25 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 26 | 9am-5pm | [Name] | [Phone] | @oncall | Daily metrics |
| May 26 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |
| May 27 | 9am-5pm | [Name] | [Phone] | @oncall | Final week 1 report & phase 4 readiness |
| May 27 | 5pm-9am | [Name] | [Phone] | @oncall | Night monitoring |

---

## On-Call Responsibilities

### Daily On-Call Engineer (9am-5pm)

**Primary responsibilities:**
- [ ] Monitor metrics dashboard throughout the day
- [ ] Respond to any alerts or issues immediately
- [ ] Check app store status (review progress, reviewer questions)
- [ ] Post daily standup at 9am
- [ ] Post end-of-day status report at 6pm
- [ ] Be first responder for any production issues

**Specific tasks:**
1. **Morning (9am-12pm)**
   - Review overnight logs for any issues
   - Confirm all systems operational
   - Post daily standup

2. **Midday (12pm-3pm)**
   - Active metric monitoring
   - Check app store status
   - Respond to any issues

3. **Afternoon (3pm-6pm)**
   - Continue monitoring
   - Prepare end-of-day status
   - Handoff to night engineer

4. **End of day (5pm-6pm)**
   - Write status report
   - Handoff to night engineer
   - Share key metrics and decisions needed

### Night On-Call Engineer (5pm-9am)

**Primary responsibilities:**
- [ ] Passive monitoring (check every 1-2 hours)
- [ ] Respond immediately if critical alerts (🚨 or 🔴)
- [ ] Log any issues for morning team
- [ ] Escalate to PM or tech lead if critical

**Specific procedures:**
1. **Handoff at 5pm**
   - Receive status from day engineer
   - Review any issues from the day
   - Know the current status

2. **Overnight monitoring (every 1-2 hours)**
   - Check metrics dashboard
   - Check Sentry for new errors
   - Confirm system is stable

3. **If issue arises**
   - Check severity level (use EMERGENCY_PROCEDURES_GUIDE.md)
   - If yellow/red/critical: Begin response immediately
   - Escalate to tech lead or PM if needed
   - Document in Slack #soleintel-dev-alerts

4. **Handoff at 9am**
   - Brief day engineer on overnight activity
   - Share any logs or issues
   - Confirm current status

### Launch Day (May 20) - Special Procedures

**May 20 is the most critical day. Special procedures apply.**

**Primary On-Call (7am-12pm, 12pm-6pm, 6pm-8pm):**
- Metrics check every **5 minutes** (not hourly)
- Slack update every 30 minutes
- Escalate at first sign of issue (don't wait)
- Be ready to rollback at any moment

**Secondary Monitor:**
- Watch alongside primary
- Backup if primary needs break
- Watch for metrics primary might miss
- Help escalate if needed

**Night On-Call (8pm-6am):**
- Metrics check every 15 minutes (more frequent than normal)
- Escalate more aggressively
- Have PM/Tech lead contact info ready
- Expect higher volume of checks

---

## Escalation Procedures

### Severity-Based Escalation

| Severity | Response Time | First Contact | Second Contact | Action |
|----------|---|---|---|---|
| 🟢 INFO | No escalation | Monitor | - | Continue work |
| 🟡 YELLOW | 5 minutes | Tech lead | - | Investigate, fix or rollback |
| 🔴 RED | 1 minute | PM + Tech lead | CEO if needed | Fix or rollback immediately |
| 🚨 CRITICAL | Seconds | All leadership | CEO immediately | Rollback now, investigate later |

### Contact Escalation Path

**Yellow Alert (🟡):**
```
1. Post in Slack: #soleintel-dev-alerts with @Tech_Lead
2. Tech lead responds within 5 minutes
3. If no response: Call tech lead phone
4. If still no response (unlikely): @PM in Slack
```

**Red Alert (🔴):**
```
1. Post in Slack: #soleintel-dev-alerts with @PM @Tech_Lead
2. Both respond immediately
3. PM decides: Fix or rollback
4. Tech lead executes decision
5. If can't reach either: Call their phones immediately
```

**Critical Alert (🚨):**
```
1. Post in Slack: 🚨 CRITICAL ALERT 🚨 with @PM @Tech_Lead @CEO
2. Execute rollback immediately (don't wait for approval in this case)
3. Call all leadership phones
4. Begin user communication
5. Investigate root cause after rollback
```

### Contact List (Fill in before May 13)

| Role | Primary Name | Phone | Slack | Backup Name | Phone |
|------|---|---|---|---|---|
| Tech Lead | [Name] | [Phone] | @[Handle] | [Name] | [Phone] |
| PM | [Name] | [Phone] | @[Handle] | [Name] | [Phone] |
| CEO/Owner | [Name] | [Phone] | @[Handle] | N/A | N/A |
| Backend Lead | [Name] | [Phone] | @[Handle] | [Name] | [Phone] |
| Mobile Lead | [Name] | [Phone] | @[Handle] | [Name] | [Phone] |
| DevOps Lead | [Name] | [Phone] | @[Handle] | [Name] | [Phone] |

---

## Escalation Decision Framework

**Use this when deciding whether to escalate:**

### Should I Escalate This Issue?

**Ask yourself:**

1. **Is this a known issue with a documented solution?**
   - YES: Solve it yourself
   - NO: Continue to question 2

2. **Can I fix this in 5-10 minutes with high confidence?**
   - YES: Fix it, then escalate to inform (not for decision)
   - NO: Continue to question 3

3. **Does this affect user experience significantly?**
   - NO: Monitor, log it, escalate if it gets worse
   - YES: Continue to question 4

4. **Is this something only leadership can decide (rollback, traffic shaping)?**
   - YES: Escalate immediately with details
   - NO: Investigate more, then decide

5. **Do I need someone else to make a decision?**
   - YES: Escalate with your recommendation
   - NO: Decide and execute, inform leadership after

### Escalation Message Template

**Always include these elements:**

```
[SEVERITY] [ISSUE_NAME]

Problem: [What is happening]
Impact: [How many users, what can't they do]
Root cause: [If known]
Recommendation: [What should we do]
Actions taken so far: [What I've already tried]
Need from you: [Decision, access, action]
ETA for resolution: [When I think we can fix it]
```

**Example:**
```
🔴 CRASH SPIKE - Shoe Search Feature

Problem: Users on Android experiencing 4.2% crash rate when searching
Impact: ~150 users in past 5 minutes, search completely broken
Root cause: Null pointer in results parser (commit a1b2c3d from 30 min ago)
Recommendation: Rollback to v1.0.0 immediately
Actions taken: Verified in Sentry, confirmed it's the search feature
Need from you: Rollback decision
ETA: If rollback approved now, 2 minutes to deploy

@Tech_Lead @PM - Awaiting decision
```

---

## Shift Handoff Procedures

### End-of-Shift Handoff (5pm - Evening On-Call)

**Day engineer prepares:**
1. [ ] Write end-of-day status report (post to #soleintel-launch)
2. [ ] Check current metrics (DAU, crash rate, rating)
3. [ ] Note any ongoing issues or decisions pending
4. [ ] Prepare brief verbal handoff

**Handoff conversation (5-10 min):**
- "Here's the status at end of day..."
- "We're monitoring these metrics..."
- "If [X happens], do [Y]..."
- "PM/Tech lead are still around if needed..."
- "Questions? Anything else I should know?"

**Evening engineer confirms:**
- [ ] Understands current status
- [ ] Knows who to escalate to
- [ ] Has contact info ready
- [ ] Knows what to monitor

**Example handoff:**
```
Day engineer: "Day 3 of monitoring. All metrics are green:
- DAU: 50,000 (tracking toward 1,200+ target)
- Crash rate: 0.3%
- Rating: 4.2 stars

No issues today. We're on track. Just keep monitoring the usual metrics.
If crash rate jumps above 0.5%, check Sentry and escalate. 
PM @john is still around if needed, phone [XXX].

See you tomorrow!"

Night engineer: "Got it. Monitoring usual metrics. Will check every 1-2 hours.
I have contact info. All clear?"

Day engineer: "Yep. You're good. Thanks!"
```

### Morning Handoff (9am - Day On-Call)

**Night engineer prepares:**
1. [ ] Review overnight logs
2. [ ] Note any issues or anomalies (even small)
3. [ ] Prepare brief verbal handoff

**Handoff conversation (5 min):**
- "Overnight was quiet" or "Here are the issues that came up..."
- "Metrics stayed stable/had this one spike..."
- "You might want to watch [metric] more closely today..."

**Day engineer confirms:**
- [ ] Understands overnight activity
- [ ] Knows what to watch
- [ ] Has action items if any

**Example handoff:**
```
Night engineer: "Quiet night. Metrics stayed stable:
- DAU: 48,000
- Crash rate: 0.2%
- No critical alerts

There was one small API latency blip around 3am - it recovered on its own.
Might be worth checking the database metrics today to see if there's a pattern.
Otherwise smooth sailing."

Day engineer: "Thanks. I'll keep an eye on database metrics.
Anything else I should know?"

Night engineer: "Nope. You're good. Have a good day!"
```

---

## Tools & Access for On-Call

### Dashboards & Tools On-Call Engineer Needs Access To

**Before May 13, ensure on-call engineers have access to:**

- [ ] Sentry dashboard (error tracking)
  - URL: [Your Sentry URL]
  - Login: [On-call account]
  - Key metrics: Crash rate, new errors, error trends

- [ ] Firebase Analytics (user metrics)
  - URL: https://console.firebase.google.com
  - Login: [On-call account]
  - Key metrics: DAU, sessions, retention, events

- [ ] Railway deployment logs (infrastructure)
  - URL: https://railway.app
  - Login: [On-call account]
  - Command: `railway logs -f` to follow live logs

- [ ] App Store Connect (iOS status)
  - URL: https://appstoreconnect.apple.com
  - Login: [On-call account]
  - Key info: App status, reviews, rating

- [ ] Google Play Console (Android status)
  - URL: https://play.google.com/console
  - Login: [On-call account]
  - Key info: App status, reviews, rating

- [ ] Custom metrics dashboard (if exists)
  - URL: [Your dashboard URL]
  - Login: [On-call account]

### On-Call Setup Checklist (Complete before May 13)

**For each on-call engineer:**

- [ ] Test login to Sentry
- [ ] Test login to Firebase
- [ ] Test Railway CLI (`railway login`)
- [ ] Test App Store Connect login
- [ ] Test Google Play Console login
- [ ] Confirm can read metrics
- [ ] Confirm can access logs
- [ ] Confirm phone number in contact list
- [ ] Confirm Slack notifications enabled

---

## On-Call Support & Relief

### Taking Breaks During On-Call (24-hour shifts)

**If on-call for long stretches (>8 hours):**

- Coordinate with backup/secondary monitor
- Take 15-30 min breaks (not during critical hours)
- Always have backup monitor during break
- Notify in Slack: "Taking 15 min break, @backup_monitor has primary"

### Meal & Sleep During Extended On-Call

**Night on-call (5pm-9am shift):**
- You can sleep, but:
  - Keep phone on loud
  - Set alerts for critical issues
  - Check every 1-2 hours minimum
  - Be ready to respond in 5 minutes if issue arises

### Relief and Rotation

**On-call is intense. Rotate people regularly:**

- No one should be on-call >3 days in a row
- Pair up if possible (primary + backup)
- Ensure adequate time off after intense periods
- May 20 (launch day) is most critical - use best people

---

## Post-Shift Procedures

### After Your On-Call Shift

1. [ ] Document any issues that occurred
2. [ ] Note any metrics anomalies
3. [ ] Log any decisions made
4. [ ] Update the on-call log (if maintained)
5. [ ] Share learnings with team

### On-Call Log (Optional but Recommended)

**Keep a running log of on-call activity:**

```
May 20 (Launch Day) - Primary On-Call: John Doe

7:00am - System verification complete, all systems go
7:30am - Phase 1 release begins, installs flowing normally
8:00am - Social media campaign launched
8:45am - Crash rate trending up to 0.4% (still green)
10:00am - Decision point: Phase 2 approved, expanded to 50%
12:00pm - Handoff to afternoon on-call
[... afternoon shift ...]
8:00pm - Day complete, all targets met, systems stable

Issues: None
Decisions: Phase 2 approved at 12:00pm based on metrics
Lessons: Monitoring every 5 minutes critical, good alert thresholds
```

---

## Compensation & Thank You

**On-call during launch week is intense. Acknowledge and reward:**

- [ ] On-call engineers get time off after May 27 (1-2 days)
- [ ] Thank you message from PM/CEO after launch success
- [ ] Bonus (if company can afford it) for launch week
- [ ] Special recognition in team meeting

---

## Testing On-Call Setup (Before May 13)

**Verify everything works:**

1. [ ] Call each on-call engineer - verify they answer
2. [ ] Send test Slack alerts - verify they see them
3. [ ] Test escalation path: On-call → Tech lead → PM
4. [ ] Verify contact list is accurate and up-to-date
5. [ ] Dry-run a fake issue - verify response procedure works

---

**SOLEINTEL On-Call & Escalation Procedures**

**Purpose:** Clear structure for on-call coverage and escalation  
**Timeline:** May 13-27, 2026  
**Status:** To be completed by PM before May 13

✅ **Preparation:** Fill in all names, phones, and Slack handles  
✅ **Testing:** Verify system works before May 13  
✅ **Gratitude:** Remember to thank on-call engineers after launch

🚀 **Well-organized on-call = successful launch**
