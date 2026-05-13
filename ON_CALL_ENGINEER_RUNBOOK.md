# On-Call Engineer Runbook
## Emergency Response & Escalation Procedures for SOLEINTEL Launch
**Owner:** Tech Lead / On-Call Engineer  
**Applies to:** May 14-27 (Launch Week)  
**Updated:** May 14, 2026

---

## Overview

This runbook guides the on-call engineer during launch week. It covers:
- How to detect issues
- What to do when something breaks
- When and how to escalate
- How to communicate during emergencies
- How to prevent the same issue twice

**Core principle:** Act fast, but don't panic. Every issue is recoverable.

---

## Part 1: On-Call Rotation (May 14-27)

### Schedule

| Period | On-Call Engineer | Backup | Time Zone |
|--------|------------------|--------|-----------|
| May 14 (Build Day) | [Engineer 1] | [Engineer 2] | PT |
| May 15 (Submission) | [Engineer 2] | [Engineer 1] | PT |
| May 20 (Launch Day) | [Engineer 1] | [Engineer 2] | PT |
| May 21-23 (Week 1) | [Engineer 3] (day) / [Engineer 2] (night) | [Engineer 1] | PT |
| May 24-27 (Week 1) | [Engineer 2] (day) / [Engineer 3] (night) | [Engineer 1] | PT |

### Contact Info

```
PRIMARY ON-CALL: [Engineer name] - [Phone] - [Email]
BACKUP ON-CALL: [Engineer name] - [Phone] - [Email]
TECH LEAD: [Tech Lead name] - [Phone] - [Email] (24/7)
CEO: [CEO name] - [Phone] - [Email] (escalation)
```

### On-Call Responsibilities

**Before your shift:**
- [ ] Test your alert notifications work
- [ ] Make sure phone is charged and nearby
- [ ] Read recent commits/changes
- [ ] Check status dashboard
- [ ] Have runbook open on computer
- [ ] Know how to access Sentry, Firebase, monitoring

**During your shift:**
- [ ] Monitor Sentry for errors
- [ ] Monitor Firebase for crashes
- [ ] Check Slack #soleintel-alerts for issues
- [ ] Respond to pages within 5 minutes
- [ ] Fix or escalate issues
- [ ] Keep team informed
- [ ] Document what happened

**After your shift:**
- [ ] Debrief with next on-call
- [ ] Document any issues
- [ ] Suggest process improvements
- [ ] Be available for questions (8am-6pm)

---

## Part 2: Monitoring & Alerts

### What We Monitor

**Sentry (Error Tracking):**
- App crashes
- Unhandled exceptions
- Error spike detection
- Performance degradation

**Firebase (App Analytics):**
- Crash rate by version
- Session count
- User engagement
- Feature usage

**Custom Metrics:**
- API response times (APM in Sentry)
- Database query performance
- Download counts
- Revenue metrics

### Alert Thresholds

| Alert | Threshold | Severity | Action |
|-------|-----------|----------|--------|
| **Crash rate surge** | >1% in last hour | 🔴 Critical | Wake up on-call |
| **API response time** | >500ms p99 | 🟡 Warning | Page on-call |
| **Database errors** | >10 in last 10 min | 🔴 Critical | Page on-call |
| **Deployment failure** | Any failed deploy | 🟡 Warning | Notify team |
| **Revenue drop** | >50% drop vs baseline | 🔴 Critical | Wake up on-call |

### Accessing Monitoring

**Sentry Dashboard:**
```
https://sentry.io/soleintel/
Username: [your email]
Password: [stored in 1Password]
```

**Firebase Console:**
```
https://console.firebase.google.com/
Project: soleintel-production
```

**Custom Dashboard (Status Page):**
```
Internal: https://status.soleintel.internal/
Public: https://status.soleintel.com/
```

---

## Part 3: Severity Levels & Response

### 🟢 Low Severity (Green)
**Definition:** Minor issue, no user impact, can wait until morning

**Examples:**
- One user reports a visual glitch
- Code style/linting issue
- Documentation typo
- Planned maintenance

**Response Time:** 24 hours  
**Action:** Create issue, plan fix, resolve in next sprint  
**Escalate if:** Affects >10 users or causes data loss

### 🟡 Medium Severity (Yellow)
**Definition:** Some user impact, fix needed today

**Examples:**
- Feature doesn't work for some users
- Performance slow (but not down)
- Intermittent errors (happens sometimes)
- Non-critical path broken

**Response Time:** <2 hours  
**Action:** Investigate, prioritize fix, deploy within hours  
**Escalate if:** Affects >100 users or security risk

### 🔴 High Severity (Red)
**Definition:** Major user impact, needs urgent fix

**Examples:**
- Login broken for all users
- App crashes on startup
- Data loss occurring
- >5% crash rate
- Security vulnerability

**Response Time:** <15 minutes  
**Action:** Wake up leads, investigate, fix, deploy immediately  
**Escalate if:** Needs CEO/board communication

### 🚨 Critical (Siren)
**Definition:** Complete service outage, financial impact

**Examples:**
- All users can't access app
- Payment processing broken
- Database down/corrupted
- Major security breach
- >20% crash rate

**Response Time:** Immediate  
**Action:** All hands on deck, CEO notified, customer communication plan  
**Escalate to:** CEO + Board (significant impact)

---

## Part 4: Issue Response Procedure

### Step 1: Confirm the Issue (5 minutes)

**When you get an alert:**

```
1. Check Sentry - Is this really happening?
   → If no error in Sentry, alert may be false positive
   → Check if alert happened in last 5 minutes
   
2. Check Firebase - What's the actual impact?
   → Crash rate: [X]%
   → Affected users: [#]
   → Affected devices: [iOS/Android/both]
   
3. Check status dashboard
   → API response times normal?
   → Database healthy?
   → Deployments recent?
   
4. Check Slack #soleintel-alerts
   → Did anyone else report this?
   → What were they doing when it happened?
   → Was there a recent change?
```

**If you can't confirm the issue:**
- Check 5 minutes in the past
- Check yesterday at this time (compare)
- Ask on Slack if others are experiencing it
- If unconfirmed after 10 min, dismiss alert and document

### Step 2: Assess Severity (5 minutes)

**Ask yourself:**

```
1. How many users affected?
   < 10 users = Low
   10-100 users = Medium
   100-1000 users = High
   >1000 users = Critical

2. What's the impact?
   - Cosmetic (visual glitch) = Low
   - Feature broken = Medium/High
   - Can't use app at all = Critical
   - Data loss = Critical

3. Is this a regression?
   - New in last 24 hours? = Likely regression, higher priority
   - Been there for weeks? = Can wait
   
4. Is there a workaround?
   - User can retry? = Medium (annoying but works)
   - No workaround = High (blocking)

5. Business impact?
   - Users can't download = Critical
   - Users can't pay = Critical
   - Users can't log in = High
   - Users can't search = Medium
```

**Decision tree:**
```
Users > 1000 AND impact is blocking?
   → CRITICAL: Escalate immediately
   
Users > 100 AND impact is blocking?
   → HIGH: Escalate to Tech Lead
   
Users > 100 AND impact is annoying?
   → MEDIUM: Start investigating
   
Users < 100?
   → LOW: Investigate when ready
```

### Step 3: Gather Information (10 minutes)

**Investigate the root cause:**

```bash
# Check recent deployments
git log --oneline -10
# Which commit went out last?

# Check for errors in Sentry
# https://sentry.io/soleintel/
# What errors are happening? Stack trace?

# Check Firebase for which users/devices
# https://console.firebase.google.com/
# Which version? Which OS?

# Check database health
# connect to production (safe, read-only for now)
SELECT COUNT(*) FROM shoes; # Should be instant
# If slow, database might be issue

# Check API response times
# In Sentry, under Performance
# Which endpoints are slow?

# Check deployment status
# Were there recent changes?
# Did CI pass?

# Ask on Slack
# "Is anyone else seeing [issue]?"
# "When did this start?"
```

**Document your findings:**

```
INCIDENT REPORT - [Time]

Issue: [What's broken]
Severity: [Low/Medium/High/Critical]
Users affected: [#]
Devices: [iOS/Android/both]
First detected: [Time]

Root cause hypothesis: [What you think is happening]

Recent changes:
- Commit [hash]: [message]
- Commit [hash]: [message]

Evidence:
- Sentry error: [type, frequency, stack trace]
- Firebase: [crash rate, affected users]
- Database: [slow queries?]
```

### Step 4: Fix or Escalate (Time depends on severity)

**If you know how to fix it (Low/Medium):**

```
1. Create a hotfix branch
   git checkout -b hotfix/[issue-name]
   
2. Make the minimal fix
   - Change only what's broken
   - Don't refactor or clean up
   - Run tests locally first: npm run test
   
3. Create PR and request review
   - Tag #soleintel-alerts for visibility
   - Explain the fix in detail
   - Link to Sentry error/incident
   
4. Once approved, merge and deploy
   git checkout main && git merge hotfix/[name]
   git push origin main  # Auto-deploys via Railway
   
5. Verify the fix worked
   - Check Sentry (errors gone?)
   - Check Firebase (crash rate down?)
   - Check Slack #soleintel-alerts
   - Celebrate! 🎉
```

**If you don't know how to fix it (or High/Critical):**

```
1. DON'T TRY TO FIX IT YOURSELF
   Time is critical, get help faster

2. Escalate to Tech Lead immediately
   Phone call: [Tech Lead phone]
   Text: "@[Tech Lead] on-call needs help with [issue]"
   Slack: @[Tech Lead] URGENT: [issue description]
   
3. Provide all information you gathered
   - Severity level
   - Root cause hypothesis
   - Recent changes
   - Sentry stack trace
   - Firebase impact
   
4. Follow Tech Lead's instructions
   - They may ask you to rollback
   - They may help you fix it
   - They may know a workaround
   
5. Keep documenting
   - What are we trying?
   - Did it work?
   - What's next?
```

### Step 5: Rollback If Needed (15 minutes)

**If the fix made things worse:**

```bash
# REVERT THE LAST DEPLOYMENT
git revert HEAD --no-edit

# This creates a NEW commit that undoes the previous commit
# The old commit is still in history (safer than force push)

git push origin main  # Auto-deploys the revert

# Check Sentry & Firebase
# Did the issue go away?

# If yes:
# - Document what went wrong
# - Create issue for root cause
# - Plan fix for later (not in panic mode)

# If no:
# - Revert again if needed
# - Escalate to Tech Lead
# - Consider rolling back multiple commits
```

**When to rollback (no questions asked):**
- ❌ Crash rate went from 0% to 5%+
- ❌ Performance degraded significantly (500ms → 5s)
- ❌ Database down/hanging
- ❌ Payment processing broken
- ❌ Data corruption occurring
- ❌ Security vulnerability exposed

**Better to have old features work than new features broken.**

---

## Part 6: Communication During Incidents

### Immediate Communication (First 15 minutes)

**Post to #soleintel-alerts:**

```
🚨 INCIDENT DETECTED - [Time]

Issue: [What's broken]
Severity: [🟡 Medium / 🔴 High / 🚨 Critical]
Users affected: [#]
Status: Investigating

On-call: @[Your name]
Tech Lead: @[Tech Lead name]

Will update every 10 minutes.
```

### Ongoing Updates (Every 10-15 minutes)

**If investigating:**
```
UPDATE - [Time]
Status: Still investigating
Root cause hypothesis: [What you think]
Next step: [What we're trying next]
ETA to fix: [Best guess + confidence]
```

**If working on fix:**
```
UPDATE - [Time]
Status: Working on fix
Fix approach: [What we're doing]
Rollback ready: [Yes/No]
ETA to deploy: [Time]
```

**If fix deployed:**
```
UPDATE - [Time]
Status: Fix deployed
Metrics: Crash rate [was X%, now Y%]
Verification: [Is issue gone?]
Next steps: [Post-mortem, monitoring]
```

### Resolution Communication

**Once fixed:**

```
✅ RESOLVED - [Time]

Issue: [What was broken]
Root cause: [Why it happened]
Fix: [What we changed]
Deployed: [Commit hash]

Metrics:
- Crash rate: [X%] → [Y%]
- Users affected: [#]
- Time to detect: [X minutes]
- Time to fix: [Y minutes]

Post-mortem: Scheduled for [date/time]
```

### Post-Incident Communication

**After stability confirmed (30+ min no errors):**

**Post in #soleintel-general:**

```
Hey team! We had a brief [issue] this morning. Here's what happened:

What broke: [Issue description]
Root cause: [Why]
What we fixed: [Solution]
Impact: [X users, Y minutes]
What we learned: [3 key learnings]

Post-mortem: Tomorrow at [time]
Preventive measures: [What we'll do to prevent this]

Thanks everyone for being ready to respond!
```

---

## Part 7: Escalation Decision Tree

### When to Escalate to Tech Lead

```
Is it High or Critical severity?
    → YES: Escalate immediately
    
Do you know how to fix it?
    → NO: Escalate immediately
    
Is it taking >30 minutes to diagnose?
    → YES: Escalate now
    
Is there data loss or security risk?
    → YES: Escalate immediately
    
Do you need to rollback?
    → YES: Escalate for approval
```

### When to Escalate to CEO

```
Is it Critical severity?
    → YES: Notify CEO
    
Is it affecting >10% of users?
    → YES: Notify CEO
    
Is it causing financial impact?
    → YES: Notify CEO
    
Is it a security breach?
    → YES: Notify CEO + board
    
Will users need external communication?
    → YES: Notify CEO
```

### How to Escalate

**Level 1: Tech Lead**
```
Phone call: [Tech Lead phone]
Text: "@[Tech Lead] on-call. Need help with [issue]. Severity: [level]. Sentry: [link]"
Slack: @[Tech Lead] URGENT
```

**Level 2: CEO (if Tech Lead not responding)**
```
Phone call: [CEO phone]
Text: "[CEO name] - on-call incident. [Brief description]. Escalating to CEO."
Slack: @[CEO name] URGENT INCIDENT
```

**Always provide:**
- Severity level
- What's broken
- How many users affected
- What you've already tried
- Links to Sentry/Firebase
- Your recommendation (fix/rollback/escalate)

---

## Part 8: Common Issues & Fixes

### Issue: App Crashes on Launch

**Symptoms:**
- Crash rate >10%
- Happens immediately after app opens
- Sentry shows specific error

**First steps:**
```bash
# Check which version has the crash
# Look at Sentry -> Releases

# Compare to previous stable version
# Was there a recent build?

# Check Firebase for device/OS pattern
# Is it iOS only? Android only? Both?

# If very recent deploy:
git log --oneline -5
# Is there a crash-inducing commit?
```

**Likely fixes:**
1. Revert recent commit: `git revert HEAD --no-edit && git push`
2. Fix specific issue (e.g., missing dependency)
3. Rebuild and redeploy

**If crash persists:**
- Escalate to Tech Lead
- May need to rebuild mobile apps
- May need to disable feature flag

---

### Issue: API Endpoints Timing Out

**Symptoms:**
- API responses >5000ms
- Users getting 504 Gateway Timeout
- Sentry shows timeout errors

**First steps:**
```bash
# Check database
SELECT COUNT(*) FROM shoes; # Is this instant?

# Check recent changes
git log --oneline -10 | grep -E "database|query"

# Check Sentry APM
# Which endpoints are slow?
# Is it a specific query?

# Check database metrics
# Are connections maxed out?
# Is there a long-running query?
```

**Likely fixes:**
1. Kill long-running queries (talk to DB admin)
2. Revert recent database changes
3. Scale database up (more CPU/RAM)
4. Optimize specific slow query

**If persists >10 minutes:**
- Escalate to Tech Lead
- May need to rollback
- Consider disabling feature if needed

---

### Issue: Users Can't Log In

**Symptoms:**
- Login endpoint returning errors
- All users or some users?
- Sentry shows auth-specific errors

**First steps:**
```bash
# Test login locally
npm run dev
# Go to http://localhost:3000
# Try to login with test user

# Check database
SELECT COUNT(*) FROM "User"; # Are users in DB?

# Check auth service
# Is JWT token generation working?
# Is database connection to auth working?

# Check recent changes
git log --oneline -10 | grep -i auth
```

**Likely fixes:**
1. Revert recent auth changes
2. Check JWT secret (environment variable)
3. Reset auth database connection
4. Check if user table was accidentally modified

**If persists:**
- ESCALATE IMMEDIATELY (blocking feature)
- Users can't use app at all
- May need full rollback

---

### Issue: Payment Processing Broken

**Symptoms:**
- Checkout failures
- Users can't complete purchases
- Revenue dropping to $0

**First steps:**
```bash
# DO NOT MESS WITH PAYMENT CODE
# This is critical

# Check payment provider status
# Stripe: https://status.stripe.com/
# Is Stripe down?

# Check API logs
# Are requests reaching Stripe?
# Are responses coming back?

# Check Sentry for payment errors
# What specific error message?
```

**What to do:**
1. IMMEDIATELY escalate to Tech Lead
2. Post status update: "Payment processing is temporarily down"
3. DO NOT attempt to fix payment code yourself
4. Wait for Tech Lead guidance

**If payment down >15 minutes:**
- Notify CEO
- May need Stripe support
- Have communication ready for users

---

### Issue: Database Corruption or Out of Disk

**Symptoms:**
- Write errors to database
- "no space left on device" errors
- Data looking corrupted

**First steps:**
```bash
# Check disk space
df -h

# Check database size
# SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname))
# FROM pg_database;

# Check for large tables
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;
```

**What to do:**
1. ESCALATE IMMEDIATELY to Tech Lead and DevOps
2. Stop accepting writes if needed (read-only mode)
3. DO NOT delete data without approval
4. This may require database restore from backup

**Critical response needed - this is severe.**

---

## Part 9: Post-Incident Procedures

### Immediate Aftermath (30 min)

- [ ] Confirm issue is completely resolved
- [ ] Check metrics are back to normal
- [ ] Thank the team on Slack
- [ ] Create issue for post-mortem
- [ ] Document all steps taken

### Post-Mortem (Next morning)

**Attend meeting with:**
- Tech Lead
- On-call engineer (you)
- Any others involved

**Discuss:**
1. Timeline: When did this start? How was it detected?
2. Root cause: Why did it happen?
3. Impact: How many users? How long?
4. Detection: Was it caught automatically?
5. Response: What did we do? Was it effective?
6. Prevention: How do we prevent this next time?
7. Improvements: What should we change?

**Create action items:**
```
Action: [What to change]
Owner: [Person responsible]
Deadline: [When to complete]
Success metric: [How we measure if it worked]
```

### Long-Term Prevention

**For each incident, implement one of:**

1. **Monitoring improvement**
   - Earlier detection
   - Better alerting
   - Example: Add CPU usage alert before database goes down

2. **Code improvement**
   - Fix root cause
   - Example: Optimize slow query to prevent timeout

3. **Process improvement**
   - Prevent in future
   - Example: Code review checklist for payment changes

4. **Infrastructure improvement**
   - More resilient systems
   - Example: Database failover, load balancing

**Document the action item:**
```
Incident: [What happened]
Root cause: [Why it happened]
Prevention: [What we'll do]
Owner: [Person]
Deadline: [Date]
```

---

## Part 10: On-Call Best Practices

### Before You Go On-Call

- [ ] Get full sleep (8+ hours)
- [ ] Charge all devices
- [ ] Have snacks/water nearby
- [ ] Clear your schedule (don't take vacation)
- [ ] Tell family you might need to respond quickly
- [ ] Make sure backup knows how to reach you

### During Your Shift

- [ ] Keep phone within arm's reach
- [ ] Don't go out of cell service area
- [ ] Respond to pages within 5 minutes
- [ ] Use the procedures (don't improvise)
- [ ] Ask for help when you need it
- [ ] Communicate with team constantly
- [ ] Document everything

### After Your Shift

- [ ] Brief the next on-call engineer
- [ ] Share any incidents/concerns
- [ ] Be available by 8am for questions
- [ ] Sleep well, you earned it
- [ ] Celebrate your shift with team

### Taking Care of Yourself

**On-call is stressful. Help yourself:**

- ✅ Get sleep (set sleep schedule)
- ✅ Exercise (reduces stress)
- ✅ Eat well (fuel your brain)
- ✅ Have hobbies (decompress)
- ✅ Talk about stress (normalize it)
- ✅ Take breaks between incidents (debrief)
- ✅ Know it's temporary (launch week ends)

**If you feel overwhelmed:**
- Tell Tech Lead immediately
- Ask for help (no shame in asking)
- Take break if needed
- Switch with backup if necessary

---

## Emergency Contacts

```
SOLEINTEL ON-CALL CONTACTS
Last updated: May 14, 2026

PRIMARY ON-CALL
Name: [Engineer name]
Phone: [Personal phone]
Email: [Email]
GitHub: [@username]
Slack: @[username]

BACKUP ON-CALL  
Name: [Engineer name]
Phone: [Personal phone]
Email: [Email]
GitHub: [@username]
Slack: @[username]

TECH LEAD (First escalation)
Name: [Tech Lead name]
Phone: [Personal phone]
Email: [Email]
Available: 24/7 during launch week

CEO (Critical escalation)
Name: [CEO name]
Phone: [Personal phone]
Email: [Email]
Available: 24/7 during launch week

EXTERNAL CONTACTS
Stripe Support: [Phone/email]
Database provider: [Phone/email]
Hosting provider: [Phone/email]
```

---

## Resources & Links

**Monitoring & Dashboards:**
- Sentry: https://sentry.io/soleintel/
- Firebase Console: https://console.firebase.google.com/
- Status Page: https://status.soleintel.internal/

**Code & Deployments:**
- GitHub: https://github.com/ChaitanyaJoshi1769/soleintel
- Railway (Deployments): https://railway.app/
- Database: [Connection string in 1Password]

**Documentation:**
- Launch Playbook: LAUNCH_PLAYBOOK_MASTER.md
- Troubleshooting: TROUBLESHOOTING_AND_FAQ.md
- Risk Register: RISK_REGISTER.md

---

## Final Checklist

Before launch week, confirm:

- [ ] On-call rotation scheduled and confirmed
- [ ] Phone numbers up to date and tested
- [ ] Monitoring alerts configured and tested
- [ ] Rollback procedures practiced
- [ ] Sentry/Firebase access working
- [ ] Team knows escalation path
- [ ] This runbook printed/accessible
- [ ] Everyone has read it
- [ ] Backup procedures documented
- [ ] Post-mortem template ready

---

**Runbook Version:** 1.0  
**Created:** May 14, 2026  
**Owner:** Tech Lead  
**Review Cadence:** After each incident, quarterly updates  
**Questions?** Ask Tech Lead or [On-call name]

**Remember: Every incident makes us better. Stay calm, follow the process, and we'll get through it together. You've got this. 🚀**
