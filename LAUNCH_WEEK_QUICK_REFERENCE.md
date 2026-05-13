# Launch Week Quick Reference Guide
## SOLEINTEL May 20, 2026 - One-Page War Room Guide
**Print this and post it in the war room. Keep a copy on your desk.**

---

## 🚀 LAUNCH TIMELINE AT A GLANCE

```
MAY 13 (TODAY)       → Pre-flight verification ✅
MAY 14              → Build day (5:45am start)
MAY 15              → Submissions to app stores
MAY 16-19           → App review & approval
MAY 20, 10:00am    → 🚀 SOLEINTEL GOES LIVE
MAY 21-27           → Week 1 monitoring
MAY 28              → Retrospective & results
```

---

## 📊 SUCCESS TARGETS

### May 20 (Launch Day)
- **Downloads:** 500+
- **Crash Rate:** <2%
- **API Uptime:** 99.9%+

### May 27 (Week 1)
- **Downloads:** 1,200+
- **Crash Rate:** <1%
- **App Rating:** 4.0+
- **Retention:** 60%+

### June 30 (Month 1)
- **MAU:** 10,000+

---

## 🔴 DECISION TREE - WHEN SOMETHING BREAKS

### Step 1: Identify Severity
```
Is error rate > 1%?
  YES → Is error rate > 5%? → YES → CRITICAL ⚠️
                            → NO  → RED 🔴
  NO  → Is latency > 500ms? → YES → YELLOW 🟡
                            → NO  → GREEN ✅ (monitor)
```

### Step 2: Take Action
```
🟢 GREEN (OK)
  → Monitor closely
  → Document for analysis

🟡 YELLOW (5-15 min to fix)
  → Notify Tech Lead
  → Investigate root cause
  → Fix or escalate to RED

🔴 RED (Immediate action)
  → Page PM + Tech Lead NOW
  → Decide: Fix or Rollback?
  → Usually: Rollback is faster

⚠️ CRITICAL (Rollback now!)
  → NO investigation
  → Execute rollback immediately
  → Notify team AFTER stable
```

### Step 3: Rollback Command (If Needed)
```bash
git revert [commit-hash]
git push origin main
# Railway deploys automatically in <2 min
```

---

## 📞 CRITICAL CONTACTS

| Role | Name | Phone | When |
|------|------|-------|------|
| **Tech Lead** | [Name] | [Phone] | Yellow/Red/Critical alert |
| **PM** | [Name] | [Phone] | Red/Critical issues |
| **CEO** | [Name] | [Phone] | Critical decisions |
| **On-Call Eng** | [Rotating] | [Phone] | After hours emergencies |

**Save these numbers on your phone NOW.**

---

## 🎯 DAILY FOCUS (May 13-28)

### MAY 13 (Pre-Flight)
- ✅ Verify all systems ready
- ✅ Review emergency procedures
- ✅ Confirm team trained
- ✅ Test rollback plan

### MAY 14 (Build Day - 5:45am Start!)
- 6:00-6:30am: Pre-verification
- 7:00-8:30am: Run tests
- 9:00-10:30am: Build apps
- 10:30-12:00pm: Device testing
- 12:30pm: Sign off & celebration

### MAY 15 (Submissions)
- 9:00-11:30am: iOS submission
- 12:00-1:30pm: Android submission
- 1:30-5:00pm: Monitor & respond to questions

### MAY 16-19 (Review Phase)
- **Daily 9am:** Check app store status
- **Be ready:** For reviewer questions
- **Keep calm:** 1-3 day reviews are normal

### MAY 20 (LAUNCH DAY - 6am Start!)
- **6:00am:** Pre-launch check
- **10:00am:** LIVE! 🚀
- **10:30am-5:00pm:** Active monitoring
- **Every 5 min:** Check critical metrics
- **Every hour:** Update Slack
- **5:00-8:00pm:** Shift change
- **8:00pm+:** Night on-call monitoring

### MAY 21-27 (Week 1)
- **Daily 9am:** Standup + metrics review
- **Daily 6pm:** Status report
- **Ongoing:** Monitor, respond to feedback, deploy hotfixes

### MAY 28 (Retrospective)
- **5pm:** Full team retrospective
- **Celebrate wins** 🎉
- **Document learnings** 📚

---

## 📊 CRITICAL METRICS TO WATCH

### Every 5 Minutes on May 20
- 📱 App download count → Target: 100 by 11am
- 💥 Crash rate → Target: <2%
- ⚡ API response time p99 → Target: <500ms
- 🆙 API error rate → Target: <0.5%

### Every 15 Minutes Week 1
- 📱 Daily downloads → Track toward 1,200
- 💥 Crash rate → Keep <1%
- ⭐ App store rating → Aiming for 4.0+
- 👥 Daily active users → Should grow each day

### Where to Find These
- **Firebase:** User growth, engagement, analytics
- **Sentry:** Crash tracking and errors
- **Railway Dashboard:** API latency and uptime
- **App Store/Play Store:** Downloads and ratings

**Dashboard Access:** [Link to shared dashboard]

---

## 🆘 QUICK TROUBLESHOOTING

**App won't download?**
- Check App Store/Play Store is live
- Verify search shows app
- Try on different device

**Crash rate spiking?**
- Check Sentry for top crash
- Identify affected users/devices
- Is it a specific feature or user action?
- Deploy hotfix or rollback

**API is slow?**
- Check database connection pool
- Look for slow queries
- Monitor API logs for patterns
- Add more caching if needed

**Users can't sign up?**
- Check authentication service
- Verify database connectivity
- Review API error logs
- Test signup flow manually

**Not enough downloads?**
- Check marketing is active
- Verify app is visible in search
- Check product is discoverable
- Review user feedback for issues

**For more help:** See TROUBLESHOOTING_AND_FAQ.md

---

## 📋 LAUNCH WEEK CHECKLISTS

### May 20, 10:00am (Go-Live)
- [ ] Apps showing in App Store + Play Store
- [ ] Both apps are downloadable
- [ ] First user downloads confirmed (Firebase)
- [ ] Monitoring dashboard live
- [ ] Team in war room
- [ ] On-call team standing by
- [ ] Support team online
- [ ] CEO notified of launch

### May 20, 1:00pm (Mid-Day Check)
- [ ] 100+ downloads
- [ ] Crash rate <2%
- [ ] Positive user feedback arriving
- [ ] No escalations needed
- [ ] Team morale good
- [ ] Communication on track

### May 20, 5:00pm (Day Summary)
- [ ] Final metrics recorded
- [ ] Status report sent to stakeholders
- [ ] Team recognized and celebrated
- [ ] Night team briefed and ready
- [ ] Next day reviewed

### May 27, 10:00am (Week 1 Results)
- [ ] Total downloads: 1,200+
- [ ] App rating: 4.0+
- [ ] Crash rate: <1%
- [ ] User retention: 60%+
- [ ] Growth trajectory clear
- [ ] Team celebrated

---

## 🎉 CELEBRATION MOMENTS

- **May 15, 11:30am:** Both apps submitted! 🎉
- **May 20, 10:00am:** Live! 🚀
- **May 20, 11:00am:** First 100 downloads! 📱
- **May 20, 10:00pm:** 500+ downloads! 🥳
- **May 27, 10:00am:** 1,200+ downloads! 🎊

---

## 🚨 EMERGENCY ESCALATION PATH

**If Yellow Alert (5-15 min issue):**
```
1. You detect issue
2. Post in #soleintel-alerts
3. Tech Lead reads (within 5 min)
4. Tech Lead leads investigation
5. Team fixes or escalates to RED
```

**If Red Alert (immediate action):**
```
1. You detect issue
2. Post in #soleintel-alerts
3. Page Tech Lead + PM (immediately)
4. They decide: Fix or Rollback
5. Execute decision
```

**If Critical Alert (rollback now!):**
```
1. Error rate >5% or complete failure
2. Page Tech Lead + PM (immediately)
3. Execute rollback NOW (don't wait)
4. Notify CEO after stable
5. Analyze offline
```

---

## 📱 DOWNLOAD TRACKING CHECKLIST

### May 20 (Hour by Hour)
```
10-11am:  [___] 100+ downloads?
11am-12: [___] 150+ downloads?
12-1pm:  [___] 200+ downloads?
1-5pm:   [___] 400+ downloads?
5-10pm:  [___] 500+ downloads?
```

### May 21-27 (Daily)
```
May 21: [___] Downloads: ___
May 22: [___] Downloads: ___
May 23: [___] Downloads: ___
May 24: [___] Downloads: ___
May 25: [___] Downloads: ___
May 26: [___] Downloads: ___
May 27: [___] Downloads: ___ (Target: 1,200+)
```

---

## 📚 KEY DOCUMENTS

Keep these bookmarked and reference them during launch:

1. **EMERGENCY_PROCEDURES_GUIDE.md** - What to do when something breaks
2. **MAY_20_METRICS_MONITORING_GUIDE.md** - How to monitor metrics
3. **TROUBLESHOOTING_AND_FAQ.md** - Common issues and solutions
4. **MAY_ONCALL_ESCALATION_GUIDE.md** - Escalation procedures
5. **ROLE_SPECIFIC_QUICK_START_GUIDES.md** - Your role responsibilities
6. **RISK_REGISTER.md** - Known risks and mitigations

---

## 💬 COMMUNICATION CHANNELS

**During Launch Week:**
- **#soleintel-launch** - All team announcements
- **#soleintel-alerts** - Issues and escalations
- **#soleintel-dev-alerts** - Technical issues
- **#soleintel-support** - User feedback and support
- **#soleintel-metrics** - Daily metrics updates

**Phone Chain for Emergencies:**
1. **Tech Lead** [Phone]
2. **PM** [Phone]  
3. **CEO** [Phone]

---

## ✅ YOUR ROLE (By Date)

**May 13:**
- [ ] Read ROLE_SPECIFIC_QUICK_START_GUIDES.md (YOUR ROLE)
- [ ] Review EMERGENCY_PROCEDURES_GUIDE.md
- [ ] Verify your systems/tools work
- [ ] Attend 9am standup

**May 14:**
- [ ] Arrive early as specified in guide
- [ ] Follow MAY_14_BUILD_EXECUTION.md
- [ ] Execute your role with excellence
- [ ] Attend debriefs

**May 15:**
- [ ] Follow MAY_15_SUBMISSION_GUIDE.md
- [ ] Be available for submissions
- [ ] Monitor and respond

**May 20:**
- [ ] Arrive at scheduled time
- [ ] Follow your role responsibilities
- [ ] Monitor metrics every 5-15 min
- [ ] Escalate if needed
- [ ] Celebrate success!

**May 21-27:**
- [ ] Attend 9am standup
- [ ] Monitor metrics daily
- [ ] Respond to alerts
- [ ] Deploy hotfixes as needed

**May 28:**
- [ ] Attend retrospective at 5pm
- [ ] Celebrate week 1 success
- [ ] Share learnings

---

## 🎯 ONE-LINE GOAL

**Get SOLEINTEL to 1,200+ users by May 27 with <1% crash rate and 4.0+ rating.**

We've trained for this. We've planned for this. We're ready. Let's execute.

---

## 📞 LAST THING - SAVE THESE NOW

| Person | Phone |
|--------|-------|
| Tech Lead | |
| PM | |
| CEO | |
| Your Manager | |

**Print this guide. Keep it visible. Reference it constantly.**

---

**Last Updated:** May 13, 2026  
**Owner:** Project Manager  
**Print and Post:** Yes, in war room and team areas  
**Digital:** Always available in GitHub and Slack
