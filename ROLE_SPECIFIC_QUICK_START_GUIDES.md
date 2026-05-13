# Role-Specific Quick Start Guides
## SOLEINTEL Launch Week - May 13-27, 2026

Quick one-page reference guides for each team role. Print these or bookmark them for easy access during launch week.

---

## 📋 Project Manager / Product Lead

**Your Role:** Command center, decision-maker, stakeholder communicator

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (verify all systems)
- [ ] Read: MAY_13_READINESS_REPORT.md (sign off on readiness)
- [ ] Review: MAY_14_15_DETAILED_TIMELINE.md (understand schedule)
- [ ] Action: Schedule 9am daily standup for May 14+
- [ ] Action: Confirm all team members have their role guides

### May 14 (Build Day)
- [ ] 6:30am: Team briefing (5 min, cover timeline)
- [ ] 9:00am: Daily standup (all teams)
- [ ] 12:00pm: Check-in on build progress
- [ ] 12:30pm: EOD debrief, prep for May 15
- [ ] Use: TEAM_COMMUNICATION_TEMPLATES.md for updates

### May 15 (Submission Day)
- [ ] 8:00am: Team arrival briefing
- [ ] 10:00am: Monitor iOS submission progress
- [ ] 1:30pm: Monitor Android submission progress
- [ ] 5:00pm: EOD debrief, celebrate submissions

### May 20 (Launch Day) - CRITICAL
- [ ] 6:00am: Pre-launch briefing with full team
- [ ] 7:00am-8:00pm: Be in war room, available for all decisions
- [ ] Every 15 min: Check metrics dashboard
- [ ] Use: MAY_20_LAUNCH_DAY_GUIDE.md + MAY_20_METRICS_MONITORING_GUIDE.md
- [ ] If issues: Reference EMERGENCY_PROCEDURES_GUIDE.md, escalate to CEO if critical

### May 21-27 (Week 1)
- [ ] 9:00am: Daily standup (metrics review)
- [ ] 12:00pm: Check critical metrics
- [ ] 6:00pm: Daily status report with numbers
- [ ] Use: MAY_21_27_MONITORING_GUIDE.md
- [ ] Friday 5pm: Run retrospective

### Key Contacts
- **Tech Lead:** [Name] - technical decisions, escalations
- **Eng Manager:** [Name] - team issues, performance
- **CEO:** [Name] - critical decisions, investor updates

### Success Criteria
- May 15: Both apps submitted ✓
- May 20: Live with <2% crash rate ✓
- May 27: 1,200+ downloads, 4.0+ rating ✓

### Quick Reference
- Emergency: EMERGENCY_PROCEDURES_GUIDE.md
- Monitoring: MAY_20_METRICS_MONITORING_GUIDE.md
- Troubleshooting: TROUBLESHOOTING_AND_FAQ.md
- Escalation: MAY_ONCALL_ESCALATION_GUIDE.md

---

## 🔧 Tech Lead / Engineering Lead

**Your Role:** Technical decision-maker, blocker resolver, escalation owner

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (run through all checks)
- [ ] Verify: All integration tests passing locally
- [ ] Verify: Build environment correct (iOS certs, Android keys)
- [ ] Verify: All team members have environment set up
- [ ] Review: MAY_14_15_DETAILED_TIMELINE.md (know the schedule)
- [ ] Action: Confirm rollback procedures work (test with git)

### May 14 (Build Day)
- [ ] 5:45am: Arrive early, verify systems
- [ ] 6:00-6:30am: Pre-verification (run preflight)
- [ ] 6:30-7:00am: Team briefing
- [ ] 7:00-8:30am: Run integration tests with engineers
- [ ] 8:30-9:00am: Review test results
- [ ] 9:00-10:30am: Oversee iOS/Android builds
- [ ] 10:30-12:00pm: Device testing, troubleshooting
- [ ] 12:00-12:30pm: Sign off on production builds
- [ ] Use: MAY_14_BUILD_EXECUTION.md for detailed steps

### May 15 (Submission Day)
- [ ] 8:00-9:00am: Verify builds are production-ready
- [ ] 9:00-11:30am: Oversee iOS App Store submission
- [ ] 11:30am-1:30pm: Oversee Android Play Store submission
- [ ] 1:30-5:00pm: Monitor submissions, respond to questions
- [ ] Use: MAY_15_SUBMISSION_GUIDE.md for detailed procedures

### May 16-19 (App Review)
- [ ] Daily 9am: Check app store review status
- [ ] If questions arise: Respond immediately with required info
- [ ] Prepare for potential rejections and responses

### May 20 (Launch Day) - CRITICAL
- [ ] 6:00am: Pre-launch check (all systems go)
- [ ] 7:00am-8:00pm: In war room, available immediately
- [ ] If yellow alert: Lead investigation, decide fix vs rollback
- [ ] If red/critical alert: Execute rollback immediately
- [ ] Every 5-10 min: Check critical metrics
- [ ] Use: EMERGENCY_PROCEDURES_GUIDE.md for decision trees
- [ ] Use: MAY_ONCALL_ESCALATION_GUIDE.md for escalation path

### May 21-27 (Week 1)
- [ ] 9:00am-5:00pm: Available for emergencies
- [ ] 9:00am daily: Join standup
- [ ] Monitor critical metrics
- [ ] Lead any urgent fixes needed
- [ ] Friday: Lead retrospective and root cause analysis

### Escalation Triggers
- **Yellow:** Investigate 5-15 min, then fix/rollback
- **Red:** Fix or rollback immediately (seconds)
- **Critical:** Rollback now, analyze later
- **Unsure:** Escalate to PM immediately

### Key Tools
- GitHub: git, git revert, git push
- Sentry: Error tracking and monitoring
- Railway: Deployment and rollback
- Xcode/Android Studio: Build verification
- Device testing: Physical iOS/Android testing

### Success Criteria
- May 14: Production builds ready
- May 15: Both apps submitted
- May 20: Live with <2% crash rate
- May 27: No critical issues, positive user feedback

---

## 👨‍💻 Backend Engineers

**Your Role:** Build and deploy the backend, monitor API health

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (code & deploy sections)
- [ ] Verify: Latest code committed and pushed to main
- [ ] Verify: All integration tests passing
- [ ] Verify: Database migrations tested locally
- [ ] Verify: Environment variables all set (Railway)
- [ ] Read: MAY_14_15_DETAILED_TIMELINE.md (know timeline)

### May 14 (Build Day)
- [ ] 7:00-8:30am: Run integration tests
- [ ] 8:30-9:00am: Code review of test results
- [ ] 9:00am: Verify build process (no blockers)
- [ ] 10:30-12:00pm: Verify app can connect to API in testing
- [ ] 12:00pm: Code freeze - no more changes until May 20
- [ ] Use: MAY_14_BUILD_EXECUTION.md for backend section

### May 15 (Submission Day)
- [ ] 8:00-9:00am: Final verification API is stable
- [ ] 9:00am-5:00pm: Available for submission support
- [ ] Monitor: Sentry for any error spikes
- [ ] No changes to production code (code freeze)

### May 20 (Launch Day) - CRITICAL
- [ ] 6:00am: Verify backend is healthy
- [ ] 7:00am: Monitoring active
- [ ] Monitor every 5 min: API error rate and latency
- [ ] If alert: Yellow/red procedures in EMERGENCY_PROCEDURES_GUIDE.md
- [ ] Available: For immediate fixes if needed
- [ ] Use: Sentry dashboard for real-time errors

### May 21-27 (Week 1)
- [ ] 9:00am-5:00pm: Available for urgent fixes
- [ ] Daily 9am: Join standup
- [ ] Monitor: API latency and error rates
- [ ] Deploy: Bug fixes as needed (fast iteration)
- [ ] Friday: Retrospective and learnings

### Critical Metrics to Monitor
- API error rate (should be <0.5%)
- API response time p99 (should be <500ms)
- Database connection pool health
- Cache hit rate (should be >85%)

### Key Tools
- GitHub: Code changes and git commands
- Railway: Production deployment
- Sentry: Error tracking
- Postgres admin: Database queries
- API monitoring: Response time and errors

### Quick Escalation
- API errors spiking? → Alert tech lead immediately
- Slow queries? → Escalate for optimization
- Database issues? → Page SRE/DevOps lead

---

## 📱 Mobile Engineers (iOS & Android)

**Your Role:** Build and test the mobile app for submission

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (mobile section)
- [ ] Verify: XCode/Android Studio updated
- [ ] Verify: iOS certificates and provisioning profiles valid
- [ ] Verify: Android keystore and signing keys ready
- [ ] Verify: App runs on physical devices (not just simulator)
- [ ] Read: MAY_14_15_DETAILED_TIMELINE.md

### May 14 (Build Day) - iOS Lead
- [ ] 7:00-8:30am: Run integration tests on device
- [ ] 8:30-9:00am: Review results
- [ ] 9:00-10:30am: Build iOS production IPA
- [ ] 10:30-11:30am: Test on multiple iOS devices
- [ ] 11:30-12:00pm: Verify screenshots and metadata
- [ ] 12:00-12:30pm: Final QA sign-off
- [ ] Use: MAY_14_BUILD_EXECUTION.md for iOS section

### May 14 (Build Day) - Android Lead
- [ ] 7:00-8:30am: Run integration tests on device
- [ ] 8:30-9:00am: Review results
- [ ] 9:00-10:30am: Build Android production AAB
- [ ] 10:30-11:30am: Test on multiple Android devices
- [ ] 11:30-12:00pm: Verify screenshots and metadata
- [ ] 12:00-12:30pm: Final QA sign-off
- [ ] Use: MAY_14_BUILD_EXECUTION.md for Android section

### May 15 (Submission Day) - iOS Lead
- [ ] 9:00-11:30am: Submit iOS IPA to App Store Connect
- [ ] 11:30am-1:30pm: Monitor submission progress
- [ ] Be available for iOS reviewer questions
- [ ] Use: MAY_15_SUBMISSION_GUIDE.md for detailed steps
- [ ] Have app store credentials ready

### May 15 (Submission Day) - Android Lead
- [ ] 12:00-1:30pm: Submit Android AAB to Google Play Console
- [ ] 1:30-5:00pm: Monitor submission progress
- [ ] Be available for Android reviewer questions
- [ ] Use: MAY_15_SUBMISSION_GUIDE.md for detailed steps
- [ ] Have Play Console credentials ready

### May 16-19 (App Review)
- [ ] Daily 9am: Check app store review status
- [ ] If questions arise: Respond immediately
- [ ] Prepare screenshots/descriptions if needed

### May 20 (Launch Day)
- [ ] 6:00am: Verify app can be downloaded
- [ ] 7:00am: Monitor app ratings and reviews
- [ ] Be available for crash reports or issues
- [ ] Monitor: Sentry for mobile crashes
- [ ] Use: MAY_20_METRICS_MONITORING_GUIDE.md

### May 21-27 (Week 1)
- [ ] Monitor: Crash rate and user ratings
- [ ] Fix: Critical bugs immediately
- [ ] Deploy: Updates as needed
- [ ] Friday: Retrospective

### Key Tools
- XCode: iOS development
- Android Studio: Android development
- App Store Connect: iOS submission
- Google Play Console: Android submission
- Sentry: Crash tracking (mobile)
- Firebase Analytics: User tracking

### Critical Metrics
- App crash rate (should be <2%)
- App store ratings (target: 4.0+)
- Download count
- Session length

---

## 🛠️ DevOps / SRE

**Your Role:** Infrastructure health, deployment, monitoring, rollback

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (DevOps section)
- [ ] Verify: Railway deployment working
- [ ] Verify: All environment variables set correctly
- [ ] Verify: Database backups running
- [ ] Verify: Monitoring dashboards accessible
- [ ] Read: MAY_14_15_DETAILED_TIMELINE.md (know timeline)

### May 14 (Build Day)
- [ ] 6:00-6:30am: Pre-deployment checks
- [ ] 9:00-10:30am: Monitor build deploy to staging
- [ ] 10:30-12:00pm: Verify staging environment healthy
- [ ] 12:00-12:30pm: Prepare production deploy (don't deploy yet)
- [ ] Use: MAY_14_BUILD_EXECUTION.md for deployment section

### May 15 (Submission Day)
- [ ] 8:00-9:00am: Final infrastructure health check
- [ ] 9:00am-5:00pm: Monitor staging environment
- [ ] Available: For deployment if needed
- [ ] 5:00pm: Prepare for May 20 production deployment

### May 20 (Launch Day) - CRITICAL
- [ ] 5:30am: Infrastructure health check
- [ ] 6:00am: Deployment to production (or if live already)
- [ ] 7:00am-8:00pm: Continuous monitoring
- [ ] Every 5 min: Check infrastructure metrics
  - Database CPU/memory
  - Network latency
  - Disk space
  - Error rates
- [ ] If alert: Follow EMERGENCY_PROCEDURES_GUIDE.md
- [ ] Be ready: For immediate rollback if needed
- [ ] Use: MAY_20_METRICS_MONITORING_GUIDE.md

### Rollback Procedure (If Needed)
```
1. Identify issue: error rate spike, latency, crashes
2. Decision: Fix or rollback? (Ask Tech Lead)
3. If rollback: 
   git revert [commit-hash]
   git push origin main
   Monitor: Railway auto-deploys in <2 min
4. Verify: Error rate returns to normal
5. Notify: Team of rollback and next steps
```

### May 21-27 (Week 1)
- [ ] 9:00am-5:00pm: Daily monitoring
- [ ] Daily 9am: Join standup
- [ ] Monitor: Critical infrastructure metrics
- [ ] Deploy: Hotfixes as needed
- [ ] Friday: Review performance and capacity

### Key Dashboards to Monitor
1. **Infrastructure Dashboard**: CPU, memory, disk
2. **Error Dashboard**: API errors, crash rate
3. **Performance Dashboard**: Latency, response times
4. **Database Dashboard**: Connections, query performance
5. **App Store Dashboard**: Downloads, ratings

### Key Tools
- Railway: Deployment and logs
- Sentry: Error tracking
- Firebase: Analytics and performance
- PostgreSQL admin: Database health
- Git/GitHub: Deployment control

### Escalation Triggers
- CPU/memory spike: Investigate immediately
- Database connections maxing out: Page on-call
- Disk space low: Immediate cleanup/expansion
- Error rate spike: Alert tech lead

### Success Criteria
- May 14: Staging environment stable
- May 15: Production ready
- May 20: Live and stable <2% crash rate
- May 27: No critical infrastructure issues

---

## 🧪 QA / Testing Lead

**Your Role:** Test verification, issue triage, device testing

### Today (May 13)
- [ ] Read: MAY_13_PREFLIGHT_CHECKLIST.md (testing section)
- [ ] Verify: All integration tests passing
- [ ] Verify: Test devices charged and updated
- [ ] Verify: Test cases documented for May 14
- [ ] Review: MAY_14_15_DETAILED_TIMELINE.md

### May 14 (Build Day)
- [ ] 7:00-8:30am: Run integration tests
- [ ] 8:30-9:00am: Compile test results
- [ ] 9:00am: Notify team of any issues
- [ ] 10:30-12:00pm: Lead device testing on:
  - Multiple iOS devices (various models/versions)
  - Multiple Android devices (various models/versions)
  - Test critical user paths: signup, login, browsing
- [ ] 12:00pm: Sign off on build readiness
- [ ] Use: MAY_14_BUILD_EXECUTION.md for test procedures

### May 15 (Submission Day)
- [ ] 8:00-9:00am: Run final tests on staging
- [ ] 9:00am-5:00pm: Monitor for any issues
- [ ] Be available: For submission support

### May 20 (Launch Day)
- [ ] 6:00am: Verify app can be downloaded from stores
- [ ] 7:00am: Monitor user reports and issues
- [ ] Monitor: Sentry for crash reports
- [ ] Be available: For rapid issue diagnosis
- [ ] Use: TROUBLESHOOTING_AND_FAQ.md if issues arise

### May 21-27 (Week 1)
- [ ] 9:00am-5:00pm: Monitor user-reported issues
- [ ] Daily 9am: Join standup
- [ ] Triage: All incoming bug reports
- [ ] Prioritize: Critical vs. non-critical issues
- [ ] Friday: Run retrospective on test findings

### Testing Devices
- [ ] iOS: iPhone 13, iPhone 14, iPhone 15, iPad
- [ ] Android: Pixel 6, Samsung S23, OnePlus 11
- [ ] All devices: Latest OS version

### Key Metrics to Monitor
- Crash rate (target: <2%)
- User reports/feedback
- App store ratings
- Session count (validates users can use app)

### Key Tools
- Sentry: Crash tracking
- Firebase: User analytics
- Xcode/Android Studio: Local testing
- Physical devices: Real user experience

---

## 📞 Support / Customer Success Lead

**Your Role:** User communication, issue handling, support team coordination

### Today (May 13)
- [ ] Read: MAY_13_READINESS_REPORT.md (understand status)
- [ ] Prepare: Support team for launch
- [ ] Read: TEAM_COMMUNICATION_TEMPLATES.md (response templates)
- [ ] Set up: Support channels (email, in-app, Slack)
- [ ] Review: TROUBLESHOOTING_AND_FAQ.md (know common issues)

### May 14-15 (Build & Submission)
- [ ] Be available: For any user questions
- [ ] Monitor: Support channels for early issues
- [ ] Prepare: Response templates for launch day

### May 20 (Launch Day) - CRITICAL
- [ ] 6:00am: Support team online and ready
- [ ] 7:00am-8:00pm: Full support team on rotation
- [ ] Monitor: User support channels (email, chat, reviews)
- [ ] Respond: To all user issues within 1 hour
- [ ] Escalate: Critical issues to tech lead immediately
- [ ] Use: TEAM_COMMUNICATION_TEMPLATES.md for responses
- [ ] Track: All user-reported issues in centralized list
- [ ] Be honest: Tell users status and ETA for fixes

### May 21-27 (Week 1)
- [ ] 9:00am-5:00pm: Daily support availability
- [ ] Daily 9am: Join standup
- [ ] Monitor: User feedback and ratings
- [ ] Respond: To all user messages promptly
- [ ] Collect: Feature requests and feedback
- [ ] Friday: Provide user feedback summary to team

### Key Metrics to Monitor
- Support response time (target: <1 hour)
- App store ratings and reviews
- User-reported issues count
- User feedback themes

### Response Templates
Use TEAM_COMMUNICATION_TEMPLATES.md for:
- Launch announcement
- Issue acknowledgment
- Status update templates
- Resolution communication
- Gratitude for patience

### Key Contacts
- Tech Lead: For escalation of critical issues
- Product Manager: For user feedback
- Engineering: For feature requests

### Success Criteria
- May 20: <1 hour response time
- May 27: 4.0+ app store rating
- Week 1: High user satisfaction scores
- Launch: Positive user feedback and momentum

---

## 🚨 On-Call Engineer (May 20+)

**Your Role:** First responder for emergencies

### Your Shift Times (See MAY_ONCALL_ESCALATION_GUIDE.md for full schedule)
- **Daily (9am-5pm):** Active monitoring, respond to any alert
- **Night (5pm-9am):** Passive monitoring, respond if critical
- **Response time:** Yellow alert 5 min, Red alert 1 min, Critical seconds

### Before Your Shift
- [ ] Read: MAY_ONCALL_ESCALATION_GUIDE.md (your shift procedures)
- [ ] Read: EMERGENCY_PROCEDURES_GUIDE.md (decision trees)
- [ ] Read: TROUBLESHOOTING_AND_FAQ.md (known issues)
- [ ] Verify: All tools accessible (Sentry, Firebase, Railway, GitHub)
- [ ] Verify: Phone number on file, team knows how to reach you
- [ ] Get: 8 hours of sleep before your shift

### During Your Shift
- [ ] Monitor: Sentry dashboard continuously
- [ ] Monitor: Firebase metrics every 5-15 min
- [ ] Monitor: Slack channel for alerts
- [ ] Know: Escalation path (Tech Lead → PM → CEO)
- [ ] Know: Severity levels (Green/Yellow/Red/Critical)
- [ ] Have ready: EMERGENCY_PROCEDURES_GUIDE.md
- [ ] Have ready: Rollback git commands

### If Yellow Alert (5-15 min issue)
1. Acknowledge in Slack: "Looking into [issue]"
2. Investigate: Check Sentry, metrics, logs
3. Communicate: Update team every 5 min
4. Decide: Fix now or escalate?
5. Execute: Fix or call Tech Lead for rollback
6. Verify: Metrics return to normal

### If Red Alert (immediate action)
1. Acknowledge: "Red alert, preparing rollback"
2. Escalate: Call Tech Lead immediately
3. Decide: Fix or rollback? (usually rollback)
4. Execute: Rollback via git revert command
5. Verify: Metrics return to normal
6. Analyze: What happened? How do we prevent this?

### If Critical Alert (rollback now)
1. Do not investigate
2. Execute rollback immediately (git revert)
3. Escalate to PM and CEO
4. Analyze after stability restored

### After Your Shift
- [ ] Handoff: Brief next on-call engineer
- [ ] Document: Any issues handled and resolutions
- [ ] Update: Team Slack channel with summary
- [ ] Return to normal: All tools still accessible

### Key Tools
- Sentry: Error tracking
- Firebase: User analytics and performance
- Railway: Deployment and rollback
- GitHub: Git commands
- Slack: Team communication

### Emergency Contacts
- Tech Lead: [Phone]
- PM: [Phone]
- CEO: [Phone]

### Success = No One Notices It Happened
Your job is to catch and fix issues before users notice. Be proactive, communicate clearly, and always have the rollback plan ready.

---

## 🎯 Summary: What Everyone Does Today (May 13)

1. **Read:** Your role-specific guide above ✓
2. **Read:** MAY_13_PREFLIGHT_CHECKLIST.md (your section)
3. **Verify:** Your systems are ready
4. **Attend:** 9am standup with full team
5. **Confirm:** You know your responsibilities
6. **Rest:** Get good sleep for May 14

That's it. You're ready. Let's ship.

---

**Last Updated:** May 13, 2026  
**Questions?** Ask your Tech Lead or PM  
**Emergency?** See EMERGENCY_PROCEDURES_GUIDE.md  
**Stuck?** See TROUBLESHOOTING_AND_FAQ.md
