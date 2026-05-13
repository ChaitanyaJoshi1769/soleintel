# Crisis Communication Plan
## Emergency Response & Public Relations Strategy for SOLEINTEL
**Owner:** CEO / Communications Lead  
**Created:** May 14, 2026  
**Applies to:** Launch week and ongoing

---

## Overview

This document outlines how SOLEINTEL responds to crises. A crisis could be:
- **Technical:** App crashes, data breach, service outage
- **Operational:** Supply chain issue, payment failure
- **Reputational:** Negative media, social media backlash
- **Legal:** Lawsuit, regulatory investigation
- **Personnel:** Key person departure, misconduct

**Core principle:** Respond fast, be transparent, take responsibility, fix the problem.

---

## Part 1: Crisis Response Team

### Who's on the Team

```
CRISIS RESPONSE TEAM (Activate immediately on crisis)

Role 1: Crisis Lead (CEO / Founder)
├─ Authority: Makes final decisions
├─ Responsibility: Overall crisis management
├─ Actions: Decides communication strategy, escalates if needed
└─ Contact: [Name, phone]

Role 2: Communications Lead
├─ Responsibility: Public messaging
├─ Actions: Drafts statements, updates team/public
└─ Contact: [Name, phone]

Role 3: Technical Lead
├─ Responsibility: Technical issues
├─ Actions: Diagnoses problem, works on fix
└─ Contact: [Name, phone]

Role 4: Legal Counsel
├─ Responsibility: Legal review
├─ Actions: Reviews statements, advises on liability
└─ Contact: [Attorney name, phone]

Role 5: Customer Support Lead
├─ Responsibility: User communication
├─ Actions: Responds to user questions
└─ Contact: [Name, phone]

Role 6: Social Media Manager
├─ Responsibility: Social media response
├─ Actions: Monitors mentions, posts updates
└─ Contact: [Name, phone]
```

### Activation Procedure

**When crisis detected:**

1. **Notify Crisis Lead** (CEO)
   ```
   Call immediately: [Phone]
   Don't email or Slack - CALL
   Brief: "[Issue type] detected at [time]. Severity: [level]"
   ```

2. **Crisis Lead activates team**
   ```
   CEO calls or Slacks: @Team - Crisis response activated.
   Issue: [Description]
   Meeting: [Zoom link] in 5 minutes
   Everyone else: Standby mode.
   ```

3. **Team conference call**
   ```
   Meeting: Zoom
   Attendees: All crisis team members
   Duration: First call usually 15-30 minutes
   Frequency: Every hour until resolved, then check-ins
   ```

4. **Initial assessment (First 15 minutes)**
   ```
   Discuss:
   - What's the actual problem?
   - How many users affected?
   - Is it fixable? How long?
   - What should we tell users?
   - What should we tell media?
   ```

---

## Part 2: Crisis Severity Levels

### 🟢 Level 1: Minor (Low Priority)

**Definition:** Small issue, no significant user impact

**Examples:**
- Single user reports a bug
- Typo in app
- Slow API response (but working)
- Minor feature unavailable

**Response Time:** 24-48 hours  
**Communication:** Email or in-app notification (no public statement)  
**Team:** Support lead + relevant engineer

**Process:**
1. Support responds to user
2. Engineer begins investigating
3. Fix created and tested
4. Deploy in next release
5. Follow up with user

**Do not:**
- Post on social media
- Escalate unnecessarily
- Delay response >24 hours

### 🟡 Level 2: Moderate (Medium Priority)

**Definition:** Multiple users affected, workaround exists

**Examples:**
- Feature broken for subset of users
- Performance degraded (slow but working)
- App crashes on some devices
- Intermittent errors

**Response Time:** 4-6 hours  
**Communication:** Public status update (Twitter, Slack, in-app)  
**Team:** Technical Lead + Support + Communications

**Process:**
1. Acknowledge issue publicly (within 1 hour)
2. Provide ETA for fix
3. Post updates every 30 min
4. Deploy fix when ready
5. Confirm resolution

**Sample public statement:**
```
We're aware that [feature] isn't working properly for some users.
We're investigating and working on a fix.

ETA: [time] EDT
Status: Updates on @soleintel Twitter

Thanks for your patience!
```

### 🔴 Level 3: Serious (High Priority)

**Definition:** Major user impact, no workaround

**Examples:**
- App crashes on startup
- All users can't login
- Payment processing broken
- >5% crash rate

**Response Time:** <1 hour  
**Communication:** All channels (app, Twitter, email, status page)  
**Team:** Full crisis team activated

**Process:**
1. CEO notified immediately (call, not email)
2. Crisis team assembles (call within 10 min)
3. Acknowledge issue within 30 minutes
4. Update every 15-30 minutes
5. Deploy fix or rollback
6. Confirm resolution

**Sample public statement:**
```
⚠️ INCIDENT REPORT

At 3:45 PM PT, we experienced an issue where users couldn't 
log into SOLEINTEL. We apologize for the disruption.

Current status: We've identified the issue and are deploying a fix.
ETA: 4:15 PM PT (about 30 minutes)

Updates: https://status.soleintel.com
```

### 🚨 Level 4: Critical (Emergency)

**Definition:** Service-wide outage, major security breach, serious legal issue

**Examples:**
- Complete service down (no users can access app)
- Data breach (user data exposed)
- Major security vulnerability
- Widespread data corruption
- Negative media coverage going viral

**Response Time:** Immediate  
**Communication:** CEO statement, all channels, crisis mode  
**Team:** Full crisis team + board + legal counsel + PR firm

**Process:**
1. CEO notified immediately (call)
2. Crisis team on call within 5 minutes
3. Legal counsel engaged
4. First statement within 1 hour
5. Updates every 15 minutes
6. Executive decision to pause/rollback

**Sample public statement:**
```
URGENT: SOLEINTEL SECURITY INCIDENT

At [time], we detected and contained a security incident that 
may have affected user data. We have:

✓ Isolated the affected systems
✓ Engaged security experts
✓ Notified affected users
✓ Reported to relevant authorities

We are investigating the full scope and will provide updates
every hour via this status page and @soleintel on Twitter.

If you're concerned about your account, you can:
1. Change your password (if still functional)
2. Contact support@soleintel.com
3. View full status at https://status.soleintel.com

We take your trust seriously and sincerely apologize.
```

---

## Part 3: Crisis Communications

### Channel 1: Twitter/Social Media

**When to post:**
- Level 2+: Post within 1 hour
- Updates: Every 30 min until resolved
- Resolution: Confirm fix deployed

**What to post:**

```
INCIDENT (start):
"We're aware that [issue] is affecting some users. 
Our team is working on a fix.
Status: [link]
Updates in 30 min"

UPDATE (ongoing):
"Update on [issue]: Still investigating. 
ETA for fix: [time]
Thank you for your patience."

RESOLUTION (end):
"[Issue] resolved! Fix deployed at [time].
Users should see improvements immediately.
Thanks for your patience and understanding."
```

**Best practices:**
- ✅ Post within 1 hour of issue
- ✅ Provide honest ETA (better to under-promise)
- ✅ Update every 30 min (show active response)
- ✅ Thank users for patience
- ✅ Share status page link (for real-time updates)
- ✅ Acknowledge impact ("We know this is frustrating")
- ✗ Don't ignore (silence = worse PR)
- ✗ Don't make excuses ("This never happened before!")
- ✗ Don't blame users ("User error")

### Channel 2: In-App Notification

**For Level 2+ issues:**

```
Banner at top of app (iOS & Android):
[⚠️ Service Notice]

We're currently experiencing a technical issue with [feature].
Our team is working on a fix.

Status: [Tap for updates]
```

**Banner color:**
- 🟡 Yellow = Issue ongoing (Level 2-3)
- 🔴 Red = Critical issue (Level 4)
- 🟢 Green = Issue resolved

### Channel 3: Email Notification

**For Level 3+ issues (affected users):**

```
Subject: Important: SOLEINTEL Service Alert

We're aware of an issue affecting your account. Here's what happened:

[What happened]
[Who it affects]
[What we're doing]
[ETA for fix]
[What you can do]

We sincerely apologize for the disruption.

Status page: [link]
Support: support@soleintel.com

- SOLEINTEL Team
```

### Channel 4: Status Page

**Create comprehensive status page (https://status.soleintel.com):**

```
SOLEINTEL Status

Last updated: [Time] PT

Service Status:
├─ API: 🔴 DEGRADED
├─ App (iOS): 🟡 PARTIAL OUTAGE
├─ App (Android): 🔴 DOWN
└─ Website: 🟢 OPERATIONAL

Current Incident:
Issue: Authentication service experiencing high latency
Impact: 15,000 users unable to login
Started: 2:45 PM PT
ETA for resolution: 4:15 PM PT

Timeline:
2:45 PM - Issue detected
2:50 PM - Team engaged
3:00 PM - Root cause identified (database overload)
3:15 PM - Scaling database, adding capacity
[will be updated every 30 min]

Affected Services:
- Login/authentication
- Profile updates

Unaffected Services:
- Search
- Browsing shoes (read-only)
- Existing sessions (already logged in)
```

---

## Part 4: Specific Crisis Scenarios

### Scenario 1: App Crashes on Startup

**What happened:** New version causes crashes, 10,000+ affected

**Immediate response (0-1 hour):**
```
1. Confirm crash rate and scope (Sentry/Firebase)
2. Contact crisis team (call CEO)
3. Assemble on Zoom call
4. Decision: Rollback previous version or hotfix

Action A: Rollback (faster, if just deployed)
├─ Revert last commit
├─ Build new version
├─ Submit to app stores
└─ Deploy iOS: 30 min approval, Android: 5 min

Action B: Hotfix (if rollback isn't option)
├─ Identify bug causing crash
├─ Fix + test
├─ Deploy
└─ Takes 30-60 min
```

**Public communication:**
```
Minute 10: Twitter post
"We're aware that SOLEINTEL is crashing on startup for some users.
We're working on a fix and will have an update within 30 minutes."

Minute 30: Status update
"We've identified the issue and are preparing a fix.
Submitting updated app version to app stores now."

Minute 60-90: Resolution
"Fix deployed! We're rolling out the update now.
iOS and Android users should see the new version within 24 hours.
If you still see crashes, please restart your phone."

After resolution:
"Thank you all for your patience during the outage.
We apologize for the disruption and are investigating what caused it."
```

### Scenario 2: Data Breach / Security Incident

**What happened:** Attacker gains access to user database, 5,000 users affected

**Immediate response (0-1 hour):**
```
1. CEO & Legal involved IMMEDIATELY (this is serious)
2. Isolate affected systems (prevent further access)
3. Engage security firm (if internal team can't handle)
4. Begin forensics investigation

Actions:
├─ Determine: What data was accessed?
├─ Determine: How long was access active?
├─ Determine: How did attacker gain access?
├─ Secure: Force password resets
├─ Notify: Regulatory bodies (if required)
└─ Notify: Affected users (within 72 hours legally)
```

**Legal review (mandatory):**
```
Before ANY public statement, legal must:
- Review exact wording
- Assess liability
- Prepare for lawsuits
- Coordinate with authorities (if required)

Legal will advise:
- What to disclose (vs. what harms us legally)
- What NOT to say ("we don't know how it happened")
- Tone (apologetic, taking responsibility)
- Next steps (prevent recurrence)
```

**Public communication (after legal review):**
```
URGENT SECURITY INCIDENT NOTICE [Post within 1 hour]

At [time], we discovered a security incident that may have affected 
5,000 user accounts.

WHAT HAPPENED:
We detected unauthorized access to our user database on [date].

WHAT DATA WAS AFFECTED:
- Email addresses
- First and last names
- Hashed passwords (not plaintext)
[What was NOT affected]:
- Credit card numbers (not stored)
- Payment information (handled by Stripe)

WHAT WE'RE DOING:
✓ Incident contained
✓ Affected systems secured
✓ Forensic investigation ongoing
✓ Affected users notified via email
✓ Security audit underway

WHAT YOU SHOULD DO:
1. Change your SOLEINTEL password immediately
2. If you used this password elsewhere, change those too
3. Monitor your email for suspicious activity
4. Contact support@soleintel.com with concerns

We take your security seriously and sincerely apologize for this 
incident. Full details and our investigation timeline at:
https://status.soleintel.com

- SOLEINTEL Team
```

**Ongoing communication:**
```
Daily updates for first week, then:
- Day 3: Investigation update ("We've determined how the breach occurred")
- Day 5: Remediation plan ("Here's how we're preventing this in future")
- Week 2: Full incident report
- Month 1: Security improvements deployed
```

### Scenario 3: Negative Viral Content

**What happened:** Tweet criticizing SOLEINTEL goes viral with 500K retweets

**Examples:**
- "I trusted SOLEINTEL to get my shoe size right. It failed and I returned 3 pairs."
- "My girlfriend's SOLEINTEL recommendations don't actually fit"
- "SOLEINTEL app steals your location without permission"

**Immediate response (0-2 hours):**
```
1. Monitor social media (is this really viral?)
2. Assess: Is the criticism valid?
3. If valid: Acknowledge, explain, offer to fix
4. If invalid: Gently correct the record

If criticism is VALID:
├─ Respond to original tweet
├─ Apologize sincerely
├─ Offer resolution (refund, help)
├─ Avoid defensiveness
└─ Example:
   "We're sorry your shoes didn't fit. Size prediction 
   isn't perfect, but we work hard to get it right. 
   We'd like to help. Please DM us."

If criticism is INVALID:
├─ Respond factually
├─ Provide evidence
├─ Avoid being defensive
├─ Example:
   "We never request location permission unless you 
   choose to enable it. Check your app settings → 
   Privacy → Location. We respect your choices."
```

**Don't:**
- ❌ Ignore it (makes it worse)
- ❌ Delete comments (looks like censoring)
- ❌ Get defensive ("Actually, you're wrong")
- ❌ Attack the user
- ❌ Make false claims

**Do:**
- ✅ Respond quickly and kindly
- ✅ Acknowledge their experience
- ✅ Offer to help privately
- ✅ Learn if there's a real issue
- ✅ Make actual improvements

### Scenario 4: Regulator Investigation

**What happened:** FTC/State AG investigating SOLEINTEL practices

**Immediate response:**
```
1. CEO & Legal notified immediately
2. Halt ANY related practices immediately
3. Preserve all evidence/documentation
4. DO NOT destroy records
5. Engage regulatory attorney

Legal actions:
├─ Request details of investigation
├─ Prepare honest responses
├─ Avoid admitting guilt
├─ Cooperate fully (looks better)
└─ Timeline: Investigations take months/years

Public communication:
├─ Minimal (legal advice)
├─ Typically: No comment pending outcome
├─ If forced: "We're cooperating fully"
└─ Focus on: "We take user trust seriously"

Example statement:
"We're aware of an inquiry into [issue]. We take user privacy 
and protection seriously and are cooperating fully with the 
investigation. We believe we're in compliance with all relevant laws."
```

---

## Part 5: Post-Crisis Procedures

### Immediate Aftermath (1-24 hours)

```
Do:
☐ Confirm crisis resolved
☐ Post final update (all channels)
☐ Thank users for patience
☐ Document what happened
☐ Debrief crisis team (what went well, what didn't)
☐ Schedule post-mortem (24-48 hours later)
☐ Thank team publicly (boost morale)

Don't:
☐ Move on too fast (feels dismissive)
☐ Forget to follow up with users
☐ Blame individuals (crisis is team issue)
☐ Repeat the same joke in all channels
```

### Short-Term (1 week)

```
Post-mortem meeting:
├─ What happened?
├─ Why did it happen?
├─ How did we respond?
├─ What went well?
├─ What could we improve?
└─ Action items to prevent recurrence

Document findings:
- Create incident report
- Share with team (non-confidential parts)
- Create tasks for improvements
- Prioritize fixes

Offer compensation (if appropriate):
- User affected by downtime? Refund
- Data compromised? Free security monitoring
- Trust damaged? Extra perks
```

### Long-Term (1-3 months)

```
Implement improvements:
- Code changes to prevent technical issue
- Process changes to catch issues faster
- Communication improvements
- Security enhancements

Follow-up communication:
- "Here's what we've done since the incident"
- Shows we learned and took action
- Rebuilds trust
- Example: Monthly email for 3 months

Monitor for recurrence:
- Add metrics to dashboard
- Set up alerts to catch early
- Weekly review for first month
- Monthly review for 3 months
```

---

## Part 6: Team Training

### Crisis Scenario Training

**Before launch, practice:**

```
Drill 1: App crash (Level 3)
└─ Simulate crash at 2pm on a weekday
   ├─ Notify crisis team
   ├─ Assemble team
   ├─ Publish status updates
   ├─ Deploy hotfix
   └─ Resolve and debrief
   Duration: 2 hours
   Frequency: Once before launch, quarterly after

Drill 2: Data breach (Level 4)
└─ Simulate security incident
   ├─ Activate crisis team
   ├─ Engage legal
   ├─ Prepare public statement
   ├─ Notify users
   └─ Media response
   Duration: 3 hours
   Frequency: Twice yearly

Drill 3: Viral negative content (Level 3)
└─ Simulate PR crisis
   ├─ Monitor social media response
   ├─ Craft responses
   ├─ Engage community
   └─ Measure impact
   Duration: 1 hour
   Frequency: Quarterly
```

### Communication Training

**All team members should know:**
- ✅ Who's on crisis team
- ✅ How to report a crisis
- ✅ Response time expectations
- ✅ What to say (and not say) publicly
- ✅ Who approves public statements

---

## Success Indicators

We're prepared for crisis when:

✅ Crisis team identified and trained  
✅ Response procedures documented  
✅ Communication templates ready  
✅ Status page set up and tested  
✅ Escalation paths clear  
✅ Team drills completed  
✅ Legal review before launch  
✅ Insurance in place  
✅ Response time <1 hour for Level 3+  
✅ Clear communication from start  

---

## Final Checklist

Before launch:

- [ ] Crisis team identified
- [ ] Contact list updated
- [ ] Response procedures documented
- [ ] Communication templates prepared
- [ ] Status page set up and tested
- [ ] Team trained on procedures
- [ ] Legal counsel on retainer
- [ ] PR firm contacted (on-call)
- [ ] Insurance verified
- [ ] Drills completed

---

**Crisis Plan Version:** 1.0  
**Created:** May 14, 2026  
**Owner:** CEO / Communications Lead  
**Last Updated:** May 14, 2026  
**Next Drill:** [Schedule before May 20]  
**Questions?** Ask CEO or Communications Lead

**Remember:** The first 30 minutes are critical. Act fast, communicate clearly, take responsibility. The team will handle it together. 💪
