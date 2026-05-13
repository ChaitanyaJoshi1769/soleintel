# SOLEINTEL Team Communication Templates

**Purpose:** Standardized messaging for team coordination during launch week  
**Date Range:** May 13-27, 2026  
**Audience:** Internal team, stakeholders, users

---

## Daily Standup Template

**When:** 9am daily (May 13-27)  
**Duration:** 15 minutes  
**Format:** Slack or in-person

### Message Structure

```
📊 SOLEINTEL Daily Standup - [DATE]

🟢 YESTERDAY'S PROGRESS:
- [Completed item 1]
- [Completed item 2]
- [Completed item 3]

🟡 TODAY'S FOCUS:
- [Priority 1]
- [Priority 2]
- [Priority 3]

🔴 BLOCKERS:
- [Blocker 1] → [Mitigation]
- [Blocker 2] → [Mitigation]

📈 KEY METRICS:
- [Metric 1]: [Value]
- [Metric 2]: [Value]

❓ HELP NEEDED: [Yes/No] → [Who, what]

Next standup: [Date/Time]
```

### Example (May 14 - Build Day)

```
📊 SOLEINTEL Daily Standup - May 14, 2026

🟢 YESTERDAY'S PROGRESS:
- Pre-flight checklist completed ✅
- All 38 backend tests verified ready
- iOS/Android signing certificates confirmed valid
- Test devices provisioned and ready

🟡 TODAY'S FOCUS:
- 6am: Final pre-launch verification
- 7am-12pm: Run all 38 backend + 20 mobile integration tests
- 1pm-3pm: Build iOS IPA and Android AAB in production configuration
- 3pm-5pm: Test apps on real devices
- 5pm-6pm: Verify app store assets and prepare submission package

🔴 BLOCKERS:
- None identified at standup time

📈 KEY METRICS:
- Tests to run: 38 backend, 20 mobile
- Build targets: iOS IPA, Android AAB
- Device test pool: 2 iPhones, 2 Android phones

❓ HELP NEEDED: No

Next standup: May 15, 9am (Submission Day)
```

---

## Slack Channel Updates (Multi-Channel)

### #soleintel-launch (General Updates)

**Daily Status Update Template**

```
🚀 *SOLEINTEL Launch Status - [DATE]*

*Phase:* [Build | Submission | Launch | Monitoring]
*Status:* [On Track | At Risk | Critical]
*Next Milestone:* [DATE/TIME]

*Key Metrics:*
• Tests passed: [X]/[Y]
• Apps built: [iOS/Android status]
• Review status: [Submitted/In Review/Approved]
• Users: [X] (⬆️ X% from yesterday)

*Action Items:*
✅ [Completed]
🟡 [In Progress - ETA]
🔴 [Blocked - Mitigation]

React with ✅ when read.
```

### #soleintel-dev-alerts (Technical Issues)

**Issue Alert Template**

```
🚨 *ISSUE ALERT*

*Severity:* [Critical | High | Medium | Low]
*System:* [Backend | Mobile | ML | Infrastructure]
*Status:* [New | Investigating | Mitigated | Resolved]

*Description:*
[What happened]

*Impact:*
[Who is affected, what can't they do]

*Mitigation:*
[What we're doing about it]

*Owner:* @[Engineer]
*ETA:* [When we expect resolution]
```

### #soleintel-support (User-Facing Issues)

**Support Alert Template**

```
👥 *SUPPORT ALERT*

*Issue:* [User-facing problem]
*Volume:* [X reports in last hour]
*Status:* [Investigating | Acknowledged | Fix in progress]

*User Impact:*
[What users are experiencing]

*Response:*
[What we're telling users]

*ETA:* [When we expect improvement]

CC: @support-team for response coordination
```

---

## Status Report Template (Daily, 6pm)

**When:** 6pm daily (May 13-27)  
**Audience:** Team + stakeholders  
**Format:** Slack thread or email

```
📋 *SOLEINTEL Daily Status Report*
*Date:* [DATE]
*Report Time:* 6pm ET

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*🎯 OVERALL STATUS:* [🟢 GREEN | 🟡 YELLOW | 🔴 RED]

*PHASE PROGRESS*

[Current Phase Name]
├─ Goal: [What we're trying to achieve]
├─ Progress: [X% complete]
├─ Timeline: [On schedule | At risk | Behind]
└─ Status: [Description of current state]

*KEY METRICS*

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| [Metric 1] | [T] | [A] | [🟢/🟡/🔴] |
| [Metric 2] | [T] | [A] | [🟢/🟡/🔴] |

*WHAT WENT WELL TODAY*
✅ [Achievement 1]
✅ [Achievement 2]
✅ [Achievement 3]

*CHALLENGES*
⚠️ [Challenge 1] → Mitigated by [Solution]
⚠️ [Challenge 2] → Mitigated by [Solution]

*UPCOMING (Next 24 Hours)*
📅 [Tomorrow's key activities]
- [Activity 1]
- [Activity 2]
- [Activity 3]

*DECISION NEEDED?*
[Yes/No] → [Specific question for PM/stakeholders]

*BLOCKERS*
[None | Describe any blockers]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report compiled by: @[Tech Lead]
```

### Example (May 14 - Build Day)

```
📋 *SOLEINTEL Daily Status Report*
*Date:* May 14, 2026
*Report Time:* 6pm ET

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*🎯 OVERALL STATUS:* 🟢 GREEN - ON SCHEDULE

*BUILD & TEST DAY PROGRESS*

Build & Test Phase
├─ Goal: Build production iOS/Android apps and run all tests
├─ Progress: 95% complete (just finishing device testing)
├─ Timeline: On schedule - will finish by 6:30pm
└─ Status: All tests passing, builds successful, real device testing underway

*KEY METRICS*

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Backend tests passing | 38/38 | 38/38 | 🟢 |
| Mobile tests passing | 20/20 | 20/20 | 🟢 |
| iOS build size | <150 MB | 127 MB | 🟢 |
| Android build size | <120 MB | 98 MB | 🟢 |
| Device test success | 100% | 100% | 🟢 |

*WHAT WENT WELL TODAY*
✅ All integration tests passed first run - no blockers
✅ iOS and Android builds completed in <45 min each
✅ Device testing on both iPhone 14 Pro and Pixel 6 successful
✅ App store assets finalized and validated

*CHALLENGES*
⚠️ Initial build had one warning about deprecated API → Updated to new API, resolved
⚠️ Android device network slowness → Mitigated by using local test data

*UPCOMING (Next 24 Hours)*
📅 May 15 - App Store Submission Day
- 10am: Final pre-submission checklist
- 10:30am-12pm: iOS App Store submission
- 12pm-2pm: Android Play Store submission
- 2pm-5pm: Submit supplementary materials
- Monitor: Review status throughout afternoon

*DECISION NEEDED?*
No - Ready to proceed to May 15 submission

*BLOCKERS*
None

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report compiled by: @Tech Lead
```

---

## Launch Day (May 20) Schedule Announcement

**Send:** May 19 evening  
**Audience:** Entire team  
**Format:** Email + Slack pin

```
🚀 *LAUNCH DAY TOMORROW - MAY 20, 2026*

Hello team,

SOLEINTEL launches tomorrow! Here's your role and timeline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*SCHEDULE (All times ET)*

*6:00am* - Engineering team joins war room
   📍 Location: [Slack #soleintel-launch or conference room]
   👥 Who: Engineering lead, backend, mobile, DevOps
   🎯 Task: Final system verification

*7:00am* - LAUNCH PHASE 1 (10% rollout)
   👥 Who: Everyone
   🎯 Action: Release approved by PM

*7:30am-8:30am* - Social media blitz
   👥 Who: Marketing + design team
   📱 Channels: Twitter, LinkedIn, TikTok, Instagram
   🎯 First announcement goes live at 7:30am

*8:00am-6:00pm* - CONTINUOUS MONITORING
   👥 Who: Rotating on-call engineers + analytics team
   🎯 Task: Watch metrics, respond to issues in real-time
   📊 Check: Slack #soleintel-dev-alerts every 5 min

*12:00pm (noon)* - PHASE 2 DECISION
   👥 Who: PM + tech lead
   🎯 Decision: Expand to 50% if metrics green
   📈 Criteria: >100 downloads, <2% crash rate, no critical issues

*5:00pm* - PHASE 3 DECISION
   👥 Who: PM + tech lead
   🎯 Decision: Expand to 100% if Phase 2 metrics green
   📈 Criteria: >300 downloads, <1% crash rate, stable

*6:00pm* - Team sync & celebration
   👥 Who: Entire team
   🎯 Activity: Retrospective + celebrate launch

*8:00pm* - War room closes (or extends if issues)
   👥 Who: All
   🎯 Handoff to evening on-call engineer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*YOUR ROLE*

*Engineering (Backend/DevOps):*
- Monitor: API response times, error rates, database load
- Watch: #soleintel-dev-alerts for issues
- Respond: To any infrastructure or backend issues within 5 min
- On-call: [Engineer names] for [times]

*Engineering (Mobile):*
- Monitor: App crash rates, install success, user onboarding
- Watch: Firebase Analytics for user behavior
- Respond: To any mobile or UX issues within 5 min
- On-call: [Engineer names] for [times]

*Product/PM:*
- Monitor: Download rate, user signups, rating
- Decision: Phase 2 at 12pm, Phase 3 at 5pm
- Message: Communicate to team via Slack
- Celebrate: We did it! 🎉

*Marketing:*
- Execute: Social media posts on schedule
- Monitor: Engagement metrics
- Respond: To user comments and questions
- On-call: [Names] for urgent community response

*Support:*
- Monitor: Support emails and in-app feedback
- Respond: To user questions and issues
- Escalate: Critical bugs to engineering
- On-call: [Names] for [times]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*IMPORTANT REMINDERS*

⚠️ *Be Ready:*
- Join Slack war room 5 minutes early
- Have laptop + power
- No meetings, no calls (unless on-call rotation)
- Phone on silent, close other distractions

⚠️ *Escalation:*
- Any critical issue → Slack #soleintel-dev-alerts immediately
- PM makes rollout decisions
- Tech lead makes technical decisions
- When in doubt, overcommunicate

⚠️ *Metrics Priority:*
- Crash rate: Keep <1%
- Response time: Keep <200ms p99
- Error rate: Keep <0.1%

⚠️ *Stay Calm:*
- Issues are normal - we have contingencies
- We've tested this extensively
- We're a team - support each other

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*LINKS*

📋 Full guide: MAY_20_LAUNCH_DAY_GUIDE.md
🎯 Metrics dashboard: [URL]
🚨 Escalation: PM @[name], Tech lead @[name]

See you at 6am! Let's ship this! 🚀

-[Team Lead]
```

---

## Issue Escalation Template

**When:** Issue severity increases or requires decision  
**To:** PM and tech lead  
**Format:** Slack mention + thread

```
🔴 *ESCALATION REQUIRED*

*Issue:* [Issue name/description]
*Severity:* Critical | High | Medium
*Time Reported:* [Time]
*Current Status:* [Investigating | Mitigated | Unresolved]

*Details:*
[What's happening, why it matters, who it affects]

*Attempted Solutions:*
[What we've tried so far]

*Decision Needed:*
[Option A: ... | Option B: ... | Other]

*Recommendation:* [What the technical team recommends]

*Owner:* @[Engineer] (investigating) + @[PM] (decision)

Awaiting decision...
```

---

## User Communication Template (If Issues Arise)

**When:** User-visible issue, need to communicate publicly  
**Audience:** App store reviews, social media, support channels  
**Format:** Honest, transparent, action-oriented

### Typical Response

```
We're aware of [issue] and apologize for the impact. Here's what we're doing:

✅ Status: We're actively investigating and have [deployed fix | are rolling back]
⏱️ ETA: We expect resolution by [time]
🙏 Thank you: Thank you for your patience and feedback

We're monitoring closely and will update within 1 hour.
```

### Example (If Crash Rate Spikes)

```
We're aware of increased crashes in v1.0.0 and apologize. Here's what we're doing:

✅ Status: Our team identified the root cause and is deploying v1.0.1
⏱️ ETA: Available in 2 hours via automatic update
🔧 Fix: Updated [specific component] to resolve [technical issue]

1-Star reviews during this time: We understand and will restore your trust by shipping quality updates regularly.

Thank you for your patience!
```

---

## Weekly Retrospective Template (May 21-27)

**When:** 5pm Friday (May 24)  
**Attendees:** Full team  
**Format:** Slack thread or Google Doc

```
📊 *WEEK 1 RETROSPECTIVE - MAY 20-27, 2026*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*METRICS SUMMARY*

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Downloads Day 1 | 200+ | [X] | 🟢 |
| Downloads Week 1 | 1,200+ | [X] | 🟢 |
| Rating | 4.0+ | [X.X] | 🟢 |
| Crash rate | <1% | [X]% | 🟢 |
| Active users | 300+ | [X] | 🟢 |

*LAUNCH SUCCESS:* ✅ YES - All targets met or exceeded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*WHAT WENT WELL*
👍 [Achievement 1 - celebrate it]
👍 [Achievement 2]
👍 [Achievement 3]
👍 [Team collaboration example]

*WHAT WAS CHALLENGING*
😤 [Challenge 1] - How we overcame it
😤 [Challenge 2] - Lessons learned
😤 [Challenge 3]

*WHAT WE LEARNED*
💡 [Learning 1 - apply next time]
💡 [Learning 2]
💡 [Learning 3]

*IMPROVEMENTS FOR NEXT PHASE*
🎯 [Change to make going forward]
🎯 [Process improvement]
🎯 [Communication improvement]

*FEEDBACK FROM USERS (First Week)*
📣 [Most common feature request]
📣 [Most common complaint]
📣 [Surprising positive feedback]

*NEXT PHASE READINESS*
✅ Ready for Phase 2 (50% rollout)? [YES/NO]
✅ Ready for Phase 3 (100% rollout)? [YES/NO]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Compiled by: @[Facilitator]
```

---

## Crisis Communication Template (If Major Issue)

**When:** Critical issue affecting significant users  
**To:** Stakeholders + users + press (if needed)  
**Format:** Honest, swift, solution-focused

```
🚨 *INCIDENT: [Issue Name]*

*Status Update: [Time]*

We're aware of [issue affecting X users] and are actively working to resolve it.

*What happened:*
[Factual explanation]

*Current impact:*
- Users affected: ~X
- Service status: [Service X is down | Users experiencing Y]
- Workaround: [If applicable, how to work around]

*What we're doing:*
✅ [Action 1 - in progress]
✅ [Action 2 - in progress]
🎯 ETA for resolution: [Time]

*Next update in: 30 minutes*

Thank you for your patience.
```

---

## Template Quick Reference

| Situation | Template | Send To | Frequency |
|-----------|----------|---------|-----------|
| Daily progress | Daily Standup | Team | 9am daily |
| End of day update | Status Report | Team + PM | 6pm daily |
| Launch day schedule | Launch Announcement | Team | May 19 evening |
| Technical issue | Issue Alert | #soleintel-dev-alerts | As needed |
| User impact issue | Support Alert | #soleintel-support | As needed |
| Requires decision | Escalation | PM + Tech Lead | As needed |
| User communication | User Response | Twitter/Email/App | As needed |
| Week over | Retrospective | Team | Friday 5pm |
| Crisis | Incident Update | All | Every 30 min |

---

**SOLEINTEL Team Communication Templates**

Use these to maintain clarity, transparency, and quick response times during the critical May 13-27 launch period.

🚀 **Clear communication = successful launch**
