# Team Onboarding & Setup Checklist
## Getting New Team Members Ready for SOLEINTEL Launch
**Owner:** HR / Tech Lead  
**Last Updated:** May 13, 2026

---

## Overview

This checklist ensures new team members joining SOLEINTEL (before, during, or after launch) are set up correctly and quickly. Use this guide to onboard engineers, support staff, marketing team members, or any role joining the team.

**Goal:** Get any new team member productive within 1-2 days

**Timeline:**
- **Day 1:** Environment setup and basic orientation
- **Day 2:** Role-specific training and first assignment
- **Day 3+:** Full productivity

---

## Pre-Arrival Checklist (1 day before)

**Tech Lead / Manager should complete:**

- [ ] Create GitHub account for new team member
- [ ] Add to GitHub team/org
- [ ] Create email account (if not using personal)
- [ ] Create Slack account and add to channels
- [ ] Set up computer/laptop (if remote, send instructions)
- [ ] Create database credentials (for engineers)
- [ ] Create API keys (for engineers)
- [ ] Create accounts: Sentry, Firebase, Railway (for engineers)
- [ ] Prepare welcome email with first-day info
- [ ] Assign a buddy/mentor (someone on team)
- [ ] Prepare role-specific onboarding materials
- [ ] Schedule first 1-on-1 meeting with manager
- [ ] Schedule role-specific orientation

---

## Day 1: First Day Setup

### Morning (9am-12pm)

**Welcome & Orientation (30 min)**
- [ ] Welcome to the team!
- [ ] Meet the manager and buddy
- [ ] Tour office/virtual setup
- [ ] Introduce to team members
- [ ] Explain team structure and roles
- [ ] Share team values and culture

**Environment Setup (1-2 hours)**

**For All Team Members:**
- [ ] Clone repository: `git clone https://github.com/ChaitanyaJoshi1769/soleintel.git`
- [ ] Check out main branch: `git checkout main`
- [ ] Create personal feature branch: `git checkout -b [name]/welcome`
- [ ] Read LAUNCH_PLAYBOOK_MASTER.md (master reference)
- [ ] Read README.md in repo root
- [ ] Read COMPLETE_DOCUMENTATION_INDEX.md (navigation guide)
- [ ] Read your role-specific guide: ROLE_SPECIFIC_QUICK_START_GUIDES.md
- [ ] Access shared calendar and schedule
- [ ] Join Slack channels
  - [ ] #soleintel-general
  - [ ] #soleintel-launch
  - [ ] #soleintel-[your-role]
  - [ ] #soleintel-alerts
  - [ ] #soleintel-random
- [ ] Update Slack profile with name, role, timezone
- [ ] Add to team contact list

**For Engineers:**
- [ ] Clone backend repo: `cd backend && npm install`
- [ ] Clone mobile repo: `cd mobile && npm install`
- [ ] Check Node version: `node --version` (should be v18+)
- [ ] Check npm version: `npm --version` (should be v9+)
- [ ] Run backend tests: `npm run test` (should pass)
- [ ] Run mobile linter: `npm run lint` (should pass)
- [ ] Create .env file with template values
  - Template: `.env.example` in backend/
  - Get real values from Tech Lead
- [ ] Set up local database
  - [ ] Install PostgreSQL (if not already installed)
  - [ ] Create local database: `createdb soleintel_dev`
  - [ ] Run migrations: `npm run migrate`
  - [ ] Verify: `npm run seed` (loads test data)
- [ ] Test local development setup
  - [ ] Start backend: `npm run dev` (should run on localhost:3000)
  - [ ] Start mobile: `npm start` (should start Expo)
  - [ ] Open app in Expo Go on phone or simulator
  - [ ] Verify basic functionality (login, browse)
- [ ] Get API keys and credentials
  - [ ] Sentry DSN for error tracking
  - [ ] Firebase credentials for analytics
  - [ ] Any third-party service keys needed
- [ ] Add to engineering team access list

**For Support Team:**
- [ ] Set up email client (support@soleintel.com)
- [ ] Access support ticketing system
- [ ] Review CUSTOMER_SUPPORT_PLAYBOOK.md thoroughly
- [ ] Understand support channels (email, chat, reviews, social)
- [ ] Set up access to app store reviews
  - [ ] App Store Connect access
  - [ ] Google Play Console access
- [ ] Review common issues and response templates
- [ ] Get list of team members to escalate to

**For Marketing Team:**
- [ ] Access marketing tools
  - [ ] Twitter/X account access
  - [ ] Instagram/social media access
  - [ ] Email marketing platform
  - [ ] Google Analytics
- [ ] Review MARKETING_LAUNCH_STRATEGY.md
- [ ] Understand launch timeline and messaging
- [ ] Review pre-prepared content and templates
- [ ] Access brand guidelines and assets

**For Product Team:**
- [ ] Review SOLEINTEL_5_YEAR_VISION.md (big picture)
- [ ] Review PHASE_4_ROADMAP.md (Phase 2 planning)
- [ ] Set up product analytics access
  - [ ] Firebase Analytics dashboard
  - [ ] App Store analytics
  - [ ] Google Play analytics
- [ ] Understand current metrics and targets
- [ ] Get access to feature tracking system

**Afternoon (1pm-5pm)**

**Role-Specific Onboarding (2-3 hours)**
- [ ] Attend role-specific orientation with team lead
  - Engineering: Code walkthrough, architecture, testing
  - Support: Common issues, escalation, templates
  - Marketing: Campaign, messaging, social
  - Product: Roadmap, metrics, users
- [ ] Get detailed technical deep-dive (if engineer)
  - [ ] API architecture walkthrough
  - [ ] Mobile app architecture
  - [ ] Database schema overview
  - [ ] Deployment process
- [ ] First assignment given and explained
- [ ] Questions answered
- [ ] Tomorrow scheduled

**End of Day**
- [ ] Confirm environment is set up correctly
- [ ] Verify can run/test the product
- [ ] Complete Day 1 checklist
- [ ] Schedule Day 2 check-in

---

## Day 2: Second Day Integration

### Morning (9am-12pm)

**Role Immersion (1-2 hours)**

**For Engineers:**
- [ ] Pair program with buddy on small task
- [ ] Review and understand existing code patterns
- [ ] Review recent commits and understand changes
- [ ] Ask questions about architecture decisions
- [ ] Set up IDE/editor with team conventions
  - [ ] Install recommended extensions
  - [ ] Set up linting and formatting
  - [ ] Configure debugger
- [ ] Run backend tests locally: `npm run test`
- [ ] Verify mobile builds work
- [ ] First bug fix or small feature assigned

**For Support Team:**
- [ ] Shadow support lead for 2 hours
  - [ ] Watch how issues are handled
  - [ ] See response templates in action
  - [ ] Understand escalation process
- [ ] Review top 10 common issues and solutions
- [ ] Practice responses to 5 example issues
- [ ] Understand team's tone and style
- [ ] Get approval on first response draft

**For Marketing Team:**
- [ ] Review upcoming campaign schedule
- [ ] Understand which channels are priority
- [ ] Draft and get feedback on social post
- [ ] Understand brand voice and messaging
- [ ] First task assigned

**For Product Team:**
- [ ] Deep dive on current roadmap
- [ ] Understand user feedback being collected
- [ ] Review competitive landscape
- [ ] First product task assigned

**Afternoon (1pm-5pm)**

**First Real Task (2-3 hours)**
- [ ] Complete assigned task from manager
  - [ ] Code review if engineer
  - [ ] Support ticket if support
  - [ ] Social post if marketing
  - [ ] Analysis if product
- [ ] Get feedback and iterate
- [ ] Learn team's process
- [ ] Understand quality standards

**End of Day 2**
- [ ] First task completed
- [ ] Feedback received and understood
- [ ] Feel more confident
- [ ] Clear on what Day 3+ looks like

---

## Day 3+: Full Integration

### Ongoing

**Daily:**
- [ ] Attend 9am team standup
- [ ] Contribute to your area
- [ ] Ask questions as needed
- [ ] Check in with buddy/manager

**Weekly:**
- [ ] 1-on-1 with manager (30 min)
- [ ] Pair program or shadow on new task
- [ ] Attend team meeting/retrospective

**First Week:**
- [ ] Complete onboarding documentation
- [ ] Contribute to actual work items
- [ ] Feel part of the team
- [ ] Start understanding the codebase/processes

**First Month:**
- [ ] Comfortable with role
- [ ] Productive contributor
- [ ] Part of team culture
- [ ] Ready for full responsibility

---

## Role-Specific Checklists

### New Engineer Checklist

**By End of Day 1:**
- [ ] Environment running locally
- [ ] Can run tests
- [ ] Can start backend dev server
- [ ] Can start mobile app
- [ ] Understand architecture high-level
- [ ] Know how to get help

**By End of Week 1:**
- [ ] Have made first commit
- [ ] Have created first pull request
- [ ] Code review completed
- [ ] PR merged
- [ ] Understand team's code standards

**By End of Month:**
- [ ] Own multiple features/bug fixes
- [ ] Can review others' code
- [ ] Understand full architecture
- [ ] Can debug production issues
- [ ] Part of on-call rotation (if applicable)

### New Support Team Member Checklist

**By End of Day 1:**
- [ ] Know support channels and tools
- [ ] Understand response templates
- [ ] Know escalation procedures
- [ ] Know team members and roles
- [ ] Comfortable with ticketing system

**By End of Week 1:**
- [ ] Handled 10+ support tickets
- [ ] No escalation needed for simple issues
- [ ] Responses match team tone
- [ ] Know top 10 common issues
- [ ] Can handle most tickets independently

**By End of Month:**
- [ ] Handle 30+ tickets independently
- [ ] Identify patterns and trends
- [ ] Escalate appropriately
- [ ] Part of team morale and culture
- [ ] Can mentor new support members

### New Marketing Team Member Checklist

**By End of Day 1:**
- [ ] Know marketing channels
- [ ] Understand brand voice
- [ ] Know team members
- [ ] Can access all tools
- [ ] Understand campaign timeline

**By End of Week 1:**
- [ ] Posted 5+ social updates
- [ ] Got feedback and iterated
- [ ] Understand engagement metrics
- [ ] Know how posts perform
- [ ] Can draft content independently

**By End of Month:**
- [ ] Own marketing channel(s)
- [ ] Drive engagement metrics
- [ ] Part of strategy discussions
- [ ] Can mentor others
- [ ] Familiar with competitive landscape

---

## Welcome Email Template

**Send to new team member Day -1 (before arrival):**

```
Subject: Welcome to SOLEINTEL! 🚀

Hi [Name],

We're excited to have you joining the team! This is an exciting time - 
we're launching SOLEINTEL on May 20.

FIRST DAY DETAILS:
- Date: [Date]
- Time: [Time]
- Where: [Location or Zoom link]
- Meet with: [Manager name]

BEFORE YOU START:
If you have a company computer coming, it should arrive by [date]. 
If you're remote, we'll send setup instructions.

WHAT TO EXPECT:
Day 1 is orientation and environment setup. You'll meet the team, 
get your computer/accounts set up, and understand the basics.

Day 2 you'll dive deeper into your role and start your first task.

By Day 3 you'll be productive and feeling part of the team.

QUESTIONS?
Reply to this email or reach out to [Manager name] at [phone/email].

Looking forward to working with you!

Best,
The SOLEINTEL Team
```

---

## Buddy System

**Every new team member gets assigned a buddy.**

**Buddy responsibilities:**
- [ ] Meet on Day 1 (introduce, welcome, answer questions)
- [ ] Check in daily for first week
- [ ] Help with environment setup issues
- [ ] Answer newbie questions (no question is too basic)
- [ ] Share team culture and norms
- [ ] Invite to lunch/breaks
- [ ] Make them feel welcome

**Buddy benefits:**
- Recognition in team update
- Appreciation for helping team grow
- Great leadership practice

---

## Troubleshooting Onboarding Issues

### "I can't get my environment set up"

**Solutions:**
1. Check Node version: `node --version`
2. Check npm version: `npm --version`
3. Try clearing cache: `npm cache clean --force`
4. Reinstall dependencies: `rm -rf node_modules && npm install`
5. Ask buddy or tech lead for help
6. Pair program to get unstuck

### "I don't understand the code"

**Solutions:**
1. Read README.md in the repo
2. Ask Tech Lead for code walkthrough
3. Pair program with a team member
4. Read architecture documentation
5. Submit questions - that's what we're here for

### "I don't know how to do my role"

**Solutions:**
1. Read your role-specific guide
2. Ask your manager for clarification
3. Watch how others do it (shadow/pair)
4. Review examples and templates
5. Start with something small and get feedback

### "I feel lost/overwhelmed"

**Solutions:**
1. Take a break (seriously, step away for 15 min)
2. Ask your buddy or manager for help
3. Focus on one thing at a time
4. Reach out - you're not alone
5. Remember: everyone feels overwhelmed on Day 1

---

## Offboarding Checklist (If Team Member Leaves)

**When someone is leaving the team:**

- [ ] Revoke GitHub access
- [ ] Revoke email access
- [ ] Revoke Slack access
- [ ] Revoke all tool access (Firebase, Sentry, etc.)
- [ ] Revoke database credentials
- [ ] Rotate any shared API keys they had
- [ ] Transfer their documentation/notes
- [ ] Document knowledge they had
- [ ] Celebrate their contributions
- [ ] Do exit interview (what worked, what could improve)

---

## Team Contact List Template

**Create and share with all new team members:**

```
SOLEINTEL TEAM CONTACTS

EXECUTIVE
- CEO: [Name] - [Phone] - [Email]
- CTO: [Name] - [Phone] - [Email]

ENGINEERING
- Tech Lead: [Name] - [Phone] - [Email]
- Backend Lead: [Name] - [Phone] - [Email]
- Mobile Lead: [Name] - [Phone] - [Email]
- DevOps Lead: [Name] - [Phone] - [Email]

PRODUCT & BUSINESS
- Product Manager: [Name] - [Phone] - [Email]
- Marketing Lead: [Name] - [Phone] - [Email]

OPERATIONS
- HR/Ops Lead: [Name] - [Phone] - [Email]
- Support Lead: [Name] - [Phone] - [Email]

EMERGENCY CONTACTS
- On-Call Engineer: [Name] - [Phone] - [Rotation schedule]
- CEO (after hours): [Name] - [Phone]

SLACK CHANNELS
- #soleintel-general: General discussion
- #soleintel-alerts: Critical issues and alerts
- #soleintel-launches: Launch week coordination
- #soleintel-random: Non-work chat
```

---

## Success Indicators

**New team member is successfully onboarded when they:**

✅ Can run the product locally  
✅ Understand their role and responsibilities  
✅ Have completed first assigned task  
✅ Are attending team meetings  
✅ Are answering questions confidently  
✅ Know who to ask for help  
✅ Feel welcome and part of the team  
✅ Are productive (contributing code/support/marketing)  
✅ Know the team's process and culture  
✅ Ready to work independently  

---

## Measurement & Feedback

**After 1 week:**
- [ ] Check in with new team member
- [ ] Ask: What's been confusing?
- [ ] Ask: What's been great?
- [ ] Adjust onboarding if needed

**After 1 month:**
- [ ] Formal 1-month feedback
- [ ] Celebrate successes
- [ ] Address any concerns
- [ ] Plan next development

**Use feedback to improve onboarding for next hire**

---

## Final Notes

**Remember:**
- Everyone is nervous on their first day (even if they don't show it)
- Your job is to make them feel welcome, capable, and part of the team
- Investing in good onboarding pays dividends in retention and performance
- A smooth first week sets the tone for their entire tenure

**Onboarding is one of the most important things we do as a team.**

---

**Last Updated:** May 13, 2026  
**Owner:** HR / Tech Lead  
**Next Review:** June 30, 2026 (post-launch retrospective)  
**Questions?** Ask [HR Lead] or [Tech Lead]
