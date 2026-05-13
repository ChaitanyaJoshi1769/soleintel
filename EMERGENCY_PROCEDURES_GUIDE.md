# Emergency Procedures & Rollback Guide

**Purpose:** Critical procedures for responding to launch emergencies  
**Timeline:** May 13-27, 2026  
**Audience:** Engineering team, PM, Tech lead  
**Status:** Reference guide - hopefully never needed

---

## Overview

This guide covers what to do when things go wrong during launch week. It includes decision trees, escalation paths, and rollback procedures.

**Key principle:** Act fast, communicate clearly, escalate appropriately. User experience > speed of deployment.

---

## Severity Levels

### 🟢 INFO - Normal Operations
**Definition:** Everything working as expected  
**Response time:** None required  
**Escalation:** None  
**Example:** Installs at expected rate, crash rate <0.5%

### 🟡 YELLOW - Warning/Slow Issue
**Definition:** Something is off, but not affecting users significantly  
**Response time:** Investigate within 5 minutes  
**Escalation:** If not resolved in 15 min, escalate to tech lead  
**Example:** API latency trending up, crash rate at 0.8%

### 🔴 RED - Critical Issue
**Definition:** Users are experiencing significant problems  
**Response time:** Immediate (<1 minute)  
**Escalation:** Immediately to PM + Tech lead  
**Actions:** Begin mitigation, prepare rollback, communicate to users  
**Example:** Crash rate >2%, API down, massive user complaints

### 🚨 CRITICAL - System Emergency
**Definition:** Complete system failure or uncontrolled cascade  
**Response time:** Seconds  
**Escalation:** Immediately to all leadership  
**Actions:** Begin rollback, activate crisis communication  
**Example:** All users getting blank screen, database down, API completely unavailable

---

## Decision Tree: What to Do When Issues Arise

```
ISSUE DETECTED
    ↓
Determine Severity (use criteria above)
    ├─ 🟢 INFO: Monitor, no action needed
    ├─ 🟡 YELLOW: Investigate, assess root cause, decide action
    ├─ 🔴 RED: Escalate + begin mitigation
    └─ 🚨 CRITICAL: Rollback decision immediately
    
IF YELLOW/RED/CRITICAL:
    ↓
Root Cause Analysis (2-5 minutes)
    ├─ Code issue? (recent deploy, logic error)
    ├─ Infrastructure issue? (database, API, scale)
    ├─ Third-party issue? (app store, payment provider)
    └─ User-caused issue? (too much traffic, attack)
    
IF CODE ISSUE:
    ├─ Can you hotfix quickly? (2-5 min fix)
    │   ├─ YES: Build, test, deploy hotfix
    │   └─ NO: Consider rollback
    └─ How many users affected?
        ├─ Few: Monitor, hotfix if possible
        └─ Many: Prepare rollback
        
IF INFRASTRUCTURE ISSUE:
    ├─ Can you scale quickly? (add capacity)
    │   ├─ YES: Scale and monitor
    │   └─ NO: Consider rollback or reduce traffic
    └─ Severity?
        ├─ Degraded: Scale or reduce traffic (don't rollback)
        └─ Down: Rollback immediately
        
IF THIRD-PARTY ISSUE:
    ├─ Can you workaround? (fallback mechanism)
    ├─ Wait for fix from vendor?
    └─ If critical to experience: Consider rollback

IF MANY USERS AFFECTED & CAN'T FIX QUICKLY:
    ↓
ROLLBACK DECISION POINT
    ├─ PM: "Are we rolling back?"
    ├─ Tech Lead: "Can we fix in <10 min? If yes, fix. If no, rollback."
    └─ Decision: Proceed with rollback or continue mitigation
```

---

## Yellow Alert Procedures (🟡)

**When:** Metric is concerning but not critical  
**Example:** Crash rate 0.7%, API latency 250ms, DAU growth flat

### Immediate Actions (0-2 min)

1. **Alert team in Slack**
   ```
   🟡 YELLOW ALERT - [Issue Name]
   
   Metric: [What's wrong]
   Status: Investigating
   ETA: Will update in 5 minutes
   ```

2. **Begin investigation**
   - Check Sentry error logs
   - Check application metrics
   - Identify pattern or root cause
   - Determine scope (% of users affected)

3. **Notify tech lead**
   - Slack mention: `@Tech_Lead [Issue summary]`
   - Escalate if unsure severity

### Response Actions (2-10 min)

**Option A: Identified and Fix Easy**
- Deploy hotfix immediately
- Monitor metrics after deploy
- Update Slack with resolution

**Option B: Identified but Complex Fix**
- If fixable in <10 min: Fix and deploy
- If needs >10 min: Prepare rollback option, decide whether to proceed with fix or rollback

**Option C: Cannot Identify Root Cause**
- Escalate to tech lead immediately
- Prepare rollback
- Continue investigation while standing by

### Escalation (If Not Resolved in 15 min)

- Escalate to tech lead: "We have [issue], [what we've tried], [recommendation]"
- Tech lead decides: Rollback or continue mitigation
- Update stakeholders

---

## Red Alert Procedures (🔴)

**When:** Significant user impact, must act now  
**Example:** Crash rate >2%, >100 user complaints, feature completely broken

### Immediate Actions (0-1 min)

1. **Alert team in #soleintel-dev-alerts (CRITICAL)**
   ```
   🔴 CRITICAL ISSUE ALERT 🔴
   
   Issue: [What's happening]
   Impact: [Who, how many, what can't they do]
   Status: INVESTIGATING
   
   @PM @Tech_Lead - Immediate attention needed
   ```

2. **Tech lead makes immediate assessment**
   - Is this a code issue? Infrastructure? Third-party?
   - Can we fix in 5-10 minutes?
   - How many users affected?

3. **Parallel actions**
   - Begin root cause analysis
   - Prepare rollback (if code might be issue)
   - Check infrastructure metrics
   - Notify customer support to expect complaints

### Tech Lead Decision (1-3 min)

**Decision Tree:**
```
Can we identify and fix in <10 minutes?
├─ YES: Deploy fix immediately, monitor closely
└─ NO: Is rollback appropriate?
   ├─ YES (new code caused it): Rollback immediately
   └─ NO (infrastructure): Scale up or check third-party
```

### If Rollback Decided

**Tech lead says:** "Rolling back to version [X.X.X]"

**Execute immediately:**
1. `git revert [commit hash]` or checkout previous version
2. Build and deploy to production
3. Monitor metrics after deploy
4. Expected: 2-3 minute downtime (users see "loading")

**Steps:**
```
1. Identify problem commit
2. Revert: git revert [hash]
3. Build: npm run build
4. Deploy: git push origin main (triggers auto-deploy)
5. Monitor: Watch crash rate, API latency, installs
6. Confirm: "Metrics normal again" → declare success
7. Communicate: Send message to #soleintel-launch
```

### User Communication

**Immediate (during fix):**
```
We're aware of [issue] and are working on a fix. We apologize for the impact.

Status: [Investigating / Deploying fix / Rolling back]
ETA: [X minutes]

Thank you for your patience.
```

**After resolution:**
```
✅ Issue resolved. The fix was [brief explanation].

We apologize for the disruption. We've implemented [preventive measure] to prevent this in the future.

Thank you for your patience and support!
```

---

## Critical Alert Procedures (🚨)

**When:** Complete system failure, uncontrolled problem, cascading issues  
**Example:** All users seeing blank screen, database completely down, API returning errors for all requests

### Immediate Actions (0-30 seconds)

1. **Declare emergency in Slack**
   ```
   🚨 SYSTEM EMERGENCY 🚨
   
   Issue: [System is down]
   Status: CRITICAL - Rolling back immediately
   
   All hands on deck. Standing by for updates every 30 seconds.
   ```

2. **PM activates crisis communication**
   - Prepare user message
   - Notify social media team
   - Prepare for support surge

3. **Tech lead initiates immediate rollback**
   - No time for investigation
   - Rollback to last known good version
   - Execute now

### Rollback Execution (Emergency Mode)

**Time is critical - execute in order, no time for review:**

```bash
# 1. Identify last known good commit
git log --oneline -5
# Pick the one from before the problem started (usually v1.0.0 tag)

# 2. Revert to that version (this creates a new commit)
git revert [commit-hash]

# 3. Deploy immediately
git push origin main

# 4. Monitor metrics like crazy
# Watch: Crash rate, API latency, DAU, errors
# Should see immediate improvement
```

**Expected result:** Within 2-3 minutes, system is back to normal

### Parallel Crisis Actions

**While rollback deploys:**

1. **Support team:**
   - Post in app store reviews: "We're aware and working on it"
   - Prepare apology/explanation

2. **PM:**
   - Post on Twitter: "We're experiencing issues and are working on a fix"
   - Update status page

3. **Tech team:**
   - Begin investigation into what caused the problem
   - Identify root cause (to prevent recurrence)
   - Prepare post-mortem analysis

### After Rollback (Resolution Phase)

1. **Confirm system is stable (5 min)**
   - Crash rate normal
   - API latency normal
   - DAU recovering
   - No new errors

2. **User communication**
   ```
   ✅ Issue resolved. We've rolled back to a stable version.
   
   Root cause: [Brief explanation when known]
   Status: System fully operational
   
   We deeply apologize for this disruption. We're implementing additional safeguards to prevent future incidents.
   ```

3. **Post-mortem (can wait a few hours)**
   - What happened
   - Why didn't we catch it before launch
   - What preventive measures are needed
   - Timeline for fixes

---

## Specific Emergency Scenarios

### Scenario 1: High Crash Rate (>2%)

**Cause: Usually app code issue (recent deploy)**

**Immediate:**
1. Check Sentry for which screen/feature is crashing
2. Determine: Is this from latest deploy?
3. If yes to #2: Prepare rollback

**Investigation:**
- Sentry → Issues → Sort by crash count
- What screen/feature has most crashes?
- Did we touch that code in recent commit?

**Decision:**
- If confident in hotfix: Deploy fix (5-10 min)
- If not confident: Rollback and hotfix later

**Example escalation:**
```
🔴 HIGH CRASH RATE - 3.2% in last 5 minutes

Issue: Shoe search screen crashing for all users
Root cause: Null pointer in search results parsing (recent commit)
Impact: Users can't search for shoes
Action: Rolling back to v1.0.0

@Tech_Lead @PM Executing rollback now.
```

### Scenario 2: API Latency Too High (p99 >500ms)

**Cause: Usually infrastructure/database issue**

**Immediate:**
1. Check database: CPU %, connections, query time
2. Check Railway metrics: RAM, CPU
3. Determine: Is database overloaded?

**Investigation:**
- Railway dashboard: Infrastructure metrics
- Database: Number of active connections
- Slow queries: Are specific endpoints slow?

**Decision:**
- If database has capacity: Optimize queries (but this takes time)
- If database maxed: Scale up (add capacity)
- If not helping: Rollback to reduce load

**Example escalation:**
```
🔴 API LATENCY SPIKE - p99 latency 800ms

Issue: Search endpoint timing out
Root cause: Database running 95% CPU, 500 active connections
Impact: Users experience 5+ second delays
Action: Scaling database + reducing traffic

@DevOps Scaling initiated. ETA 5 minutes.
```

### Scenario 3: Users Getting Blank Screen

**Cause: Usually app code issue or API completely down**

**Immediate:**
1. App is showing blank screen = frontend issue or no API response
2. Check: Is API responsive?
3. Check Sentry: Are there errors in the app?

**Investigation:**
- Can you manually call API endpoint?
- Does API respond with data?
- Are there JavaScript errors in Sentry?

**Decision:**
- If API down: Check infrastructure, rollback if needed
- If frontend issue: Rollback
- If third-party (payment, ads): Workaround or rollback

**Example escalation:**
```
🚨 SYSTEM EMERGENCY - Blank Screen for All Users

Issue: Users see blank screen on app launch
Root cause: API endpoints returning 500 errors (investigating)
Impact: App completely unusable for all users
Action: Rolling back immediately

Rollback in progress. ETA 2 minutes.
```

### Scenario 4: User Data Loss / Corruption

**Cause: Database migration, bad query, data corruption**

**Immediate:**
1. STOP ALL DEPLOYMENTS
2. STOP ALL DATA MODIFICATIONS
3. Check database integrity

**Critical actions:**
- Do NOT attempt to "fix" the data
- Restore from backup immediately
- Rollback to version before data corruption
- Investigate offline

**Example escalation:**
```
🚨 DATA INTEGRITY ISSUE 🚨

Issue: User watchlists showing corrupted data
Root cause: INVESTIGATING
Action: Rolling back and restoring from backup

This is critical - activating full crisis mode.
@PM @Tech_Lead - All attention here.
```

---

## Rollback Procedures (Detailed)

### Before You Rollback

1. **Confirm it will help**
   - Is the issue code-related? Rollback will help
   - Is the issue infrastructure? Rollback might not help (and will reduce capacity)
   - Is the issue third-party? Rollback won't help

2. **Identify the last good version**
   - Check git tags: `git tag -l`
   - Usually v1.0.0 is the launched version
   - Rollback to most recent stable tag

3. **Quick risk assessment**
   - Downtime expected: 2-3 minutes
   - Users will see "loading" screen
   - Data loss: No (you're just running old code)
   - Is this acceptable given the severity? (yes, if users can't use app anyway)

### Executing Rollback

**Command sequence:**

```bash
# 1. Identify the stable version to rollback to
git tag -l
# Look for v1.0.0 or similar

# 2. Create a revert commit
git revert [commit-hash-that-broke-it]
# Or: git revert HEAD~1 (if it's the latest commit)

# 3. Check the revert looks correct
git diff HEAD~1

# 4. Push to main (this auto-deploys)
git push origin main

# 5. Monitor deployment
# Watch Railway logs in real-time:
# railway logs -f

# 6. Verify metrics improve
# Check Sentry: crash rate should drop
# Check Dashboard: API latency should improve
# Check Firebase: DAU should stabilize
```

**Expected timeline:**
- T+0min: Rollback initiated
- T+1min: Build and deploy begins
- T+2min: Deploy completes, users see new version
- T+3min: Metrics should show improvement
- T+5min: Can confirm success

### After Rollback

1. **Verify stability (5-10 min)**
   - Crash rate: Should be <0.5%
   - API latency: Should be <200ms p99
   - DAU: Should be recovering/growing
   - User complaints: Should be decreasing

2. **Root cause analysis (later, not now)**
   - What commit caused the issue?
   - Why didn't we catch it before launch?
   - How do we prevent this?

3. **Hotfix or re-deploy (later, when confident)**
   - Fix the issue that caused rollback
   - Test thoroughly
   - Deploy when team is confident

---

## Communication During Emergencies

### Slack #soleintel-dev-alerts

**Format:** `[SEVERITY] [Issue] [Status] [Action]`

**Examples:**

```
🟡 YELLOW - Crash rate trending up (0.6%) - Investigating - ETA 5 min update

🔴 RED - Search feature broken, 500 crashes - Rolling back - ETA 2 min

🚨 CRITICAL - All users blank screen - Emergency rollback in progress - Update every 30 sec
```

### Public Communication (Twitter, App Store Reviews)

**Prepare before launch day, use templates during crisis:**

```
[During incident]
We're aware of [issue] and are working on a fix. We apologize for the impact.
Status: [Investigating | Deploying fix | Rolling back]
ETA: [X minutes]

[After resolution]
✅ Issue resolved. [Brief explanation of what happened]
We apologize for the disruption and appreciate your patience.
```

### Internal Status Updates

**Every 5 minutes during red/critical alert:**

```
Status Update (T+5min):

Issue: [Description]
Root Cause: [If known]
Action: [What we're doing]
ETA: [When we expect resolution]
Next update in 5 minutes
```

---

## Post-Emergency Procedures

### Immediate After-Action (1 hour after resolution)

1. **Create incident report**
   - What happened
   - When
   - Duration
   - How many users affected
   - What we did to fix it
   - Why we didn't prevent it

2. **Team debrief (30 min)**
   - What went well
   - What could we improve
   - Action items to prevent recurrence

3. **Communicate to stakeholders**
   - PM writes post-mortem
   - Share with leadership
   - Plan preventive measures

### Follow-Up Actions (Next days)

1. **Root cause analysis**
   - Deep dive into what caused it
   - Review code, commits, changes
   - Identify why QA didn't catch it

2. **Preventive measures**
   - Add test case to prevent recurrence
   - Update deployment checks
   - Improve monitoring/alerts

3. **Optional: Code review + safety improvements**
   - New deployment checklist
   - Automated tests for this scenario
   - Change review process

---

## Emergency Contact List

**Fill in before May 13:**

| Role | Name | Phone | Slack |
|------|------|-------|-------|
| Tech Lead | [Name] | [Phone] | @[Handle] |
| PM | [Name] | [Phone] | @[Handle] |
| Backend Lead | [Name] | [Phone] | @[Handle] |
| Mobile Lead | [Name] | [Phone] | @[Handle] |
| DevOps | [Name] | [Phone] | @[Handle] |
| CEO/Owner | [Name] | [Phone] | @[Handle] |

**Escalation path:**
1. First: Slack mention in #soleintel-dev-alerts
2. If no response in 1 min: Phone call
3. If that fails: Call CEO/owner

---

## Checklists for Each Severity

### Yellow Alert Checklist

- [ ] Post alert to Slack #soleintel-dev-alerts
- [ ] Investigate root cause (5 min max)
- [ ] Determine severity (is it really yellow?)
- [ ] If yes: Take action (fix or prepare rollback)
- [ ] If no: Update severity level
- [ ] Resolve or escalate within 15 min

### Red Alert Checklist

- [ ] Post RED ALERT to Slack with @PM @Tech_Lead
- [ ] Assess: Code? Infrastructure? Third-party?
- [ ] Can fix in 5-10 min? YES→ Deploy fix | NO→ Prepare rollback
- [ ] Tech lead decides: Fix or rollback
- [ ] If rollback: Execute immediately
- [ ] If fix: Deploy and monitor
- [ ] Communicate to users
- [ ] After resolution: Prepare post-mortem

### Critical Alert Checklist

- [ ] Post 🚨 CRITICAL to Slack immediately
- [ ] Tech lead: Initiate rollback immediately (no investigation)
- [ ] PM: Prepare user communication
- [ ] Support: Prepare to handle complaints
- [ ] Execute rollback (2-3 min)
- [ ] Verify stability
- [ ] Communicate: "Issue resolved, rolling back to stable version"
- [ ] After: Root cause analysis when calm

---

## Testing Rollback Before Launch

**May 13 (before launch):**

**Practice rollback scenario:**
1. Note current commit hash: `git log -1 --oneline`
2. Make a test commit: `echo "test" > testfile.txt; git add .; git commit -m "test"`
3. Simulate rollback: `git revert HEAD`
4. Observe: Railway auto-deploys
5. Monitor: Metrics dashboard updates
6. Revert the revert: `git revert HEAD` (goes back to normal)

**Verify:**
- [ ] Rollback code works
- [ ] Deployment happens automatically
- [ ] No manual steps needed
- [ ] Team understands the process

---

**SOLEINTEL Emergency Procedures & Rollback Guide**

**Purpose:** Be prepared so you don't need to use this  
**Confidence:** If you follow these procedures, you can handle any emergency  
**Key principle:** User experience first, speed second, perfection never in emergencies

🚀 **Hope you never need this. But you're ready if you do.**
