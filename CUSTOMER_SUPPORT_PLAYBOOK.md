# Customer Support Playbook
## SOLEINTEL Launch Week (May 20-27, 2026)
**Owner:** Support Lead  
**Last Updated:** May 13, 2026

---

## Overview

This playbook provides the customer support team with procedures, templates, and escalation paths for handling user issues during SOLEINTEL's launch week (May 20-27, 2026). The goal is to provide excellent support while maintaining team sanity during a high-volume period.

**Support Philosophy:**
- ✅ Respond quickly (target: <1 hour)
- ✅ Be honest and transparent
- ✅ Solve or escalate appropriately
- ✅ Document all issues
- ✅ Show genuine care for users

---

## Support Team Roles & Responsibilities

### Support Lead (You)
**Responsibilities:**
- Oversee all support channels (email, chat, in-app)
- Triage and prioritize issues
- Escalate critical issues to Engineering/PM
- Track all user feedback
- Report to PM on support metrics
- Manage team morale and breaks

**Working Hours:**
- Daily 7:00am - 8:00pm PT (13 hours)
- Rotation for night coverage (8:00pm - 7:00am)
- Breaks every 2 hours mandatory

### Support Team Members
**Front-Line Support (Handle Tier 1 Issues):**
- [Names]
- 9am-5pm coverage minimum
- Can answer FAQ and basic troubleshooting
- Escalate uncertain issues to Support Lead

**Back-Line Support (Handle Tier 2 Issues):**
- [Names]
- 11am-6pm coverage
- Handle more complex issues
- Work with Engineering on technical problems

**Night Coverage (8pm-7am):**
- [Names]
- Handle critical issues only
- Respond to all escalations immediately
- Page support lead if critical

---

## Support Channels

### 1. Email (Official Support)
**Address:** support@soleintel.com  
**Response Time:** <1 hour for all emails  
**Volume Expectation:** 50-150 emails on May 20, 30-50 daily after

**Workflow:**
1. Check email every 15 minutes during hours
2. Reply to all emails within 1 hour
3. Use templates from "Common Issues" section below
4. Mark resolved issues as done
5. Log all issues in shared spreadsheet

### 2. In-App Chat/Contact
**Location:** Help → Contact Support in app  
**Response Time:** <30 minutes for active chats  
**Volume Expectation:** High (50-200 chats on May 20)

**Workflow:**
1. Check chat every 15 minutes
2. Auto-reply: "We're here! Typical response time: 30 min"
3. Answer directly if possible
4. Offer email for complex issues
5. Close chat when resolved

### 3. App Store Reviews
**Platforms:** iOS App Store, Google Play Store  
**Monitoring:** Check twice daily (9am, 6pm)  
**Response Time:** Reply to 1-star reviews within 24 hours

**Workflow:**
1. Read all new reviews
2. Reply professionally to critical issues
3. Thank users for positive reviews
4. Offer help for negative reviews
5. Forward critical issues to Engineering

### 4. Social Media (Twitter/X, etc.)
**Monitoring:** During launch week, monitor mentions 2x daily  
**Response Time:** <2 hours for public mentions

**Workflow:**
1. Monitor for mentions of SOLEINTEL
2. Reply professionally and empathetically
3. Offer to move to DM for private issues
4. Forward critical issues to PM
5. Share positive feedback with team

---

## Common Issues & Responses

### Tier 1: Account & Access Issues

#### Issue: "Can't log in / Password reset not working"

**First Response (Email Template):**
```
Hi [Name],

Thanks for reaching out! Login issues are usually quick to fix. Let's get you back in.

Can you confirm:
1. Are you getting an error message? If so, what does it say?
2. Are you using the same email you signed up with?
3. Have you checked your spam folder for the reset email?

In the meantime, try:
- Clear your browser cache
- Try a different browser or device
- Use password reset at login screen

Reply with info above and we'll get this fixed ASAP.

Best,
SOLEINTEL Support
```

**Resolution Path:**
- 🟢 User usually fixes with cache clear or browser change
- 🟡 If still failing: Escalate to Engineering (auth issue)
- 🔴 Database issue: Page on-call Engineer immediately

**Escalation to Engineering:**
```
@engineering-team

User [Name] cannot log in.
- Email: [email]
- Error: [error message if any]
- Already tried: cache clear, different browser, password reset
- Started: [when]

Can you check their auth status in the database?
```

---

#### Issue: "Can't sign up / Registration failing"

**First Response (Email Template):**
```
Hi [Name],

We're sorry you're having trouble signing up! Let's get you into SOLEINTEL.

Quick troubleshooting:
1. Make sure you're using a valid email (you'll need to verify it)
2. Use a strong password (8+ characters, mix of upper/lower/numbers)
3. Try using a different email if you have one
4. Clear browser cache and try again
5. Try a different browser (Chrome, Safari, Firefox)

If you're still stuck, reply with:
- What error message are you seeing?
- Which email address are you trying to use?
- What browser/device?

We'll get you signed up!

Best,
SOLEINTEL Support
```

**Resolution Path:**
- 🟢 User fixes with browser/cache clear (~70%)
- 🟡 If specific error: Escalate to Engineering
- 🔴 If widespread: Page Tech Lead (critical signup issue)

---

### Tier 2: Feature & Functionality Issues

#### Issue: "App keeps crashing / Blank screen"

**First Response (Chat Template):**
```
Oh no! Sorry you're seeing that. Let's get it fixed.

Quick fix to try:
1. Force close the app (swipe up or restart)
2. Clear app cache (Settings → [App] → Storage → Clear Cache)
3. Restart your phone
4. Reinstall the app if still crashing

What you see helps us:
- When does it crash? (Startup, browsing, searching?)
- What phone model and OS version?
- Do you see any error message?

Try the steps above and let me know!
```

**Resolution Path:**
- 🟢 Reinstall fixes it (~50% of crashes)
- 🟡 If device-specific: Note for QA testing
- 🔴 If widespread crash: Page Tech Lead IMMEDIATELY

**Critical Escalation (Email to Tech Lead):**
```
🔴 CRITICAL: App Crash Spike

Multiple users reporting app crashes:
- [User 1]: Crashes on startup
- [User 2]: Crashes when viewing details
- [User 3]: Crashes after 5 minutes

All tried: Reinstall, cache clear, restart
This is likely a code issue, not user device.

Crash rate should be <2%. Check Sentry.
```

---

#### Issue: "Search not working / No results showing"

**First Response (Chat Template):**
```
Let's help you find what you're looking for!

First, try:
1. Make sure you're connected to internet (WiFi or mobile data)
2. Try searching for a common shoe (like "Nike Air Max")
3. Check that you spelled it correctly
4. Try a different search term

Tip: Searches work for brand names, shoe types, and styles.

Still not working? Tell me:
- What are you searching for?
- What results do you expect?
- Are you getting "no results" or an error?
```

**Resolution Path:**
- 🟢 Usually user expectation issue (~80%)
- 🟡 If genuinely no results: Check database/cache
- 🔴 If search completely broken: Page Backend Engineer

---

### Tier 3: Data & Privacy Issues

#### Issue: "Where's my data? / Is my data safe? / Privacy concerns"

**First Response (Email Template):**
```
Hi [Name],

Great question - we take data privacy very seriously.

Here's what you should know:
1. Your account data is encrypted in transit (HTTPS) and at rest
2. We never share your personal data with third parties
3. You can delete your account anytime (Settings → Delete Account)
4. Read our full privacy policy: [link]

Your data includes:
- Email address and basic profile
- Your saved shoes and searches
- Your preferences and settings

We never store:
- Payment information (if applicable)
- Passwords in plain text
- Your browsing history outside the app

If you have specific concerns, reply and we'll address them.

Best,
SOLEINTEL Support
```

**Critical Escalation (if data breach suspected):**
```
🚨 URGENT: Possible Data Issue

User [Name] reports: [concern]
This could indicate: [data breach / privacy leak / unauthorized access]

Immediate actions:
1. Page Tech Lead immediately
2. Check security logs
3. If confirmed breach: Notify CEO and legal
4. Do NOT admit fault to user until confirmed
```

---

### Tier 4: Complaint & Feedback

#### Issue: "Your app sucks / I hate this / Bad experience"

**First Response (Chat Template):**
```
I'm sorry you had a bad experience. That's the last thing we want.

Can you tell me what happened? Specifically:
- What did you expect vs. what happened?
- What feature or issue frustrated you most?
- What would make it better?

We're early and actively improving. Your feedback directly impacts what we build next. If there's a specific bug, we can fix it. If it's a feature request, we'll note it.

Genuine feedback (even negative) helps us build something amazing.

What can we do better?
```

**Resolution Path:**
- 🟢 Acknowledge, thank, note feedback
- 🟡 If actionable bug: Escalate to Engineering
- 🔴 If major product concern: Forward to PM for product decision

**PM Escalation:**
```
Product Feedback:

User [Name] reported:
[Issue / Complaint]

Impact: [Is this a blocker for other users?]
Suggested fix: [If user provided one]
Priority: [Low / Medium / High]

Recommend: [Action]
```

---

## Support Metrics & Tracking

### Daily Tracking Sheet
Create a shared Google Sheet with these columns:

```
| Date | Channel | User | Issue | Severity | Response Time | Resolution | Status | Notes |
|------|---------|------|-------|----------|----------------|------------|--------|-------|
| 5/20 | Email | John | Login failing | Yellow | 25 min | Cache clear | Resolved | Quick fix |
| 5/20 | Chat | Jane | Crash on startup | Red | 5 min | Escalated | Investigating | - |
| 5/20 | Reviews | App Store | Great app! | N/A | N/A | Replied | Resolved | 5-star |
```

**Report to PM Daily (6pm):**
```
SOLEINTEL Support Summary - May XX

📊 METRICS
- Total issues: [XX]
- Response time average: [X minutes]
- Resolution rate: [X%]
- Critical issues: [X]

🔴 Critical Issues (if any)
- [Issue]: [Status]

⭐ Positive Feedback
- [Theme]: [Count]

📋 Trending Issues
1. [Issue 1]: [Frequency]
2. [Issue 2]: [Frequency]
3. [Issue 3]: [Frequency]

🎯 Tomorrow's Focus
- [Priority 1]
- [Priority 2]

Team sentiment: [Good/OK/Strained]
```

---

## Escalation Procedures

### Yellow Alert (5-15 min issue affecting users)

**Triggers:**
- Login system slow
- Search returning wrong results
- Specific feature buggy (but app works)
- Single user frustrated (not widespread)

**Action:**
1. Acknowledge to user: "We're looking into this"
2. Notify Support Lead
3. Post in #soleintel-support Slack
4. Investigate for 5-10 minutes
5. Either: Fix or escalate to Red

**Template:**
```
@support-lead-name
Issue: [Description]
Affected users: [Count]
Severity: Yellow (affects some users, not critical)
Started: [Time]
Investigation: [What we've tried]
Next: [What we're doing now]
```

---

### Red Alert (immediate action needed)

**Triggers:**
- App crashing for multiple users
- Login completely broken
- Search completely broken
- User data issues
- Payment/billing problems

**Action:**
1. Page Tech Lead immediately (phone + Slack)
2. Post in #soleintel-alerts
3. Tell users: "We're aware and our team is working on it"
4. Don't speculate on cause
5. Update users every 30 minutes with status

**Template:**
```
🔴 RED ALERT: [Issue Name]

Severity: Critical (multiple users affected)
Impact: [Users can't login / App crashing / etc.]
Started: [Time]
Users affected: [Estimate]
Status: [Investigating / Fixing / Testing]

@tech-lead-name Page immediately
```

---

### Critical Alert (all hands on deck)

**Triggers:**
- Service completely down
- Widespread data loss
- Security breach
- Widespread payment failure

**Action:**
1. Page PM + Tech Lead + CEO (phone + Slack)
2. Stop accepting new support requests (set auto-reply)
3. Provide hourly updates to users
4. Do not speculate on cause publicly
5. Follow EMERGENCY_PROCEDURES_GUIDE.md

**Template:**
```
🚨 CRITICAL: [Issue Name]

Service Status: DOWN
Estimated fix time: [TBD / Investigating]
What we know: [Facts only]
What we're doing: [Actions being taken]

Updates every 30 minutes.
We'll have this fixed ASAP.
```

---

## Response Templates for Common Situations

### Template: Acknowledging User Frustration

```
Hi [Name],

I hear your frustration, and I totally get it. [Issue] is annoying, especially 
on a new app where you want it to just work.

Here's what we're going to do:
1. [Immediate action to fix]
2. [If not fixable immediately: escalation path]
3. [Timeline for resolution]

I'm personally invested in making sure this gets fixed for you. If you don't 
hear back by [time], ping me directly.

Thanks for your patience and for using SOLEINTEL.

Best,
[Your name]
Support Team
```

### Template: Apologizing for Issue

```
Hi [Name],

We sincerely apologize for [issue]. That's not the experience we want you to have.

Here's what happened: [Honest explanation of root cause]

Here's what we've done: [Actions taken to fix]

Here's how we're preventing it: [Prevention measures]

We're giving you [compensation: free premium month / credit / etc.] as our apology.

Thank you for your patience and for being an early SOLEINTEL user.

Best,
SOLEINTEL Team
```

### Template: Saying "No" to Feature Request

```
Hi [Name],

Thanks for the suggestion to [feature]. We love your thinking and we're considering it.

Here's where we are:
- We currently prioritize [current features]
- [Feature] is interesting but not our immediate focus
- We're planning Phase 2 features for [timeframe]

We'll absolutely keep this in mind as we plan. If enough users request it, it 
moves up our priority list.

Keep the ideas coming!

Best,
SOLEINTEL Team
```

### Template: User Asking for Help with Product

```
Hi [Name],

Great question! Here's how to [use feature]:

1. [Step 1]
2. [Step 2]
3. [Step 3]

Tip: [Pro tip for better experience]

Give it a try and let me know if you have questions!

Best,
SOLEINTEL Support
```

---

## Team Practices & Morale

### Support Team Breaks
**Mandatory breaks every 2 hours:**
- 10 min break away from desk
- Stretch, walk, get water
- No email/chat checking during break
- Do NOT skip breaks (burnout is real)

**Lunch coverage:**
- Rotate lunch hours 12-1pm, 1-2pm
- Always 1 person on support during lunch
- Other team members fully off duty

**Night team relief:**
- Night shift is 8pm-7am (11 hours, with breaks)
- 2 people minimum during night
- Sleep during day after night shift
- No double-shifts

### Team Check-Ins
**9am Daily:**
- 15 min team standup
- How is everyone feeling?
- What's the mood?
- Any burning issues?

**6pm Daily:**
- Debrief on the day
- Celebrate wins
- Acknowledge hard moments
- Plan tomorrow

### Appreciating the Team
- Thank team members for handling difficult issues
- Celebrate quick resolutions
- Recognize someone who went above and beyond
- Share positive user feedback with team
- Friday: Team celebration or small reward

---

## Launch Day (May 20) Specific

### Expected Volume
- 50-100 support requests in first 2 hours
- 150-300 requests throughout the day
- Mix of: questions, bugs, compliments, feedback

### Team Assignment
**9am-1pm (Busiest Time):**
- All hands on deck
- Front desk: Monitoring chat & email every 5 min
- Back office: Handling escalations and complex issues
- Support Lead: Triaging and escalating

**1pm-5pm (Still Busy):**
- Main team continues
- Some team members can take breaks

**5pm-8pm (Winding Down):**
- Full team wrapping up issues
- Documenting everything
- Transition to night team

### Key Focus
1. **Respond fast** (under 1 hour)
2. **Be honest** (if you don't know, escalate)
3. **Solve what you can** (don't escalate everything)
4. **Escalate appropriately** (red = immediate)
5. **Document** (log every issue)
6. **Stay positive** (you're the face of SOLEINTEL)

---

## Post-Issue Documentation

### After Resolving Issue
**Log in shared spreadsheet:**
- User name
- Issue description
- Root cause (if known)
- Resolution
- Time to resolution
- Category (bug/feature request/support question)

### Common Issues to Flag
- If same issue from multiple users → Escalate to PM
- If possible bug → Log with QA
- If feature request → Note for product team
- If user data concern → Page Tech Lead immediately

### Weekly Summary for PM
Each Friday, provide:
- Top 5 issues this week
- Volume trends
- User sentiment
- Recommendations for Phase 2
- Team feedback

---

## What NOT to Do

❌ **Don't:**
- Make promises you can't keep
- Speculate on causes without facts
- Blame users for issues
- Take frustration personally
- Work without breaks (burnout is real)
- Share debugging details with users (confusing)
- Commit to timelines you're unsure about
- Ignore escalation requests from Engineering/PM
- Communicate issues without approval from PM

---

## Quick Reference Cards

Print these and keep at your desk:

**Escalation Decision Tree:**
```
User reports issue
  ↓
Is it affecting multiple users? 
  YES → RED ALERT
  NO → Is it a possible bug?
    YES → YELLOW ALERT  
    NO → Troubleshoot

Troubleshoot:
  - Found solution? → Respond and close
  - Can't solve? → Escalate to Engineering
  - Not sure? → Page Support Lead
```

**Response Time Targets:**
```
Email:      <1 hour (absolutely)
Chat:       <30 minutes (aim for 15)
Reviews:    <24 hours (1-star first)
Social:     <2 hours (public mentions)
Escalation: IMMEDIATE (red/critical)
```

**Escalation Contacts:**
```
Tech Lead:    [Phone]
PM:           [Phone]
Engineering:  #soleintel-alerts
Product:      @[PM name]
Support Lead: [Phone]
```

---

## Closing Notes

**Remember:**
- You are the human face of SOLEINTEL during launch
- Users will be frustrated, excited, confused, demanding
- Your patience and helpfulness will define their experience
- Every positive interaction builds loyalty
- Every negative response spreads fast

**You've got this.** 💪

The team trained. The product is solid. The support systems are in place. Your job is to be the bridge between users and solutions.

**Let's make SOLEINTEL's launch week incredible.**

---

**Last Updated:** May 13, 2026  
**Owner:** Support Lead  
**Next Update:** May 28, 2026 (retrospective)  
**Emergency Contact:** [Tech Lead], [PM], [Support Lead]
