# SOLEINTEL Troubleshooting & FAQ Guide

**Purpose:** Solve common problems without escalation  
**Timeline:** May 13-27, 2026  
**Audience:** All team members  
**Status:** Reference guide - check here first before escalating

---

## How to Use This Guide

**When you encounter a problem:**

1. **Check symptom list below** (e.g., "App won't build")
2. **Follow diagnostic steps** (e.g., check logs, verify config)
3. **Try solutions in order** (start with easiest)
4. **If still stuck:** Escalate with diagnosis information

**Time to solution:** Most issues resolve in <15 min with this guide

---

## Table of Contents

- [Pre-Launch Issues (May 13)](#pre-launch-issues-may-13)
- [Build & Test Issues (May 14)](#build--test-issues-may-14)
- [Submission Issues (May 15)](#submission-issues-may-15)
- [Launch Day Issues (May 20)](#launch-day-issues-may-20)
- [Monitoring Issues (May 20+)](#monitoring-issues-may-20)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Quick Reference: Tools & Commands](#quick-reference-tools--commands)

---

## Pre-Launch Issues (May 13)

### Issue: "Git shows uncommitted changes"

**Symptom:** `git status` shows uncommitted files, can't proceed with verification

**Diagnostic:**
1. Run: `git status` → See what's uncommitted
2. Run: `git diff` → See the changes
3. Determine: Are these supposed to be committed?

**Solutions (in order):**

**Solution A: Commit the changes**
```bash
git add [files]
git commit -m "Fix or feature description"
git push origin main
```

**Solution B: Discard the changes** (if they're test/debug code)
```bash
git checkout -- [files]
# Or for all changes:
git checkout -- .
```

**Solution C: Stash for later** (if you want to keep but not commit yet)
```bash
git stash
# Work on main branch
# Later: git stash pop
```

**When to escalate:** If unsure which files should be committed

---

### Issue: "Tests won't run"

**Symptom:** `npm test` fails with dependency errors or test runner issues

**Diagnostic:**
1. Run: `npm list` → See installed dependencies
2. Check error message: Is it missing package? Version conflict?
3. Check node/npm version: `node -v` and `npm -v`

**Solutions (in order):**

**Solution A: Install dependencies**
```bash
npm install
# If that doesn't work:
rm -rf node_modules
npm install
```

**Solution B: Update test runner**
```bash
npm install --save-dev vitest@latest
```

**Solution C: Check Node version**
```bash
node -v
# Should be v20.x or higher
# If not, install Node 20 first
```

**Solution D: Run specific test file**
```bash
npm test -- [specific-test-file.test.ts]
# This helps identify if issue is with all tests or just one
```

**When to escalate:** If dependencies won't install or Node version issues

---

### Issue: "Certificates are invalid or expiring"

**Symptom:** Xcode or Android build tools warn about expired certificates

**Diagnostic:**
1. **iOS:** Check in Xcode: Preferences → Accounts → [Your Team] → Signing Certificates
2. **Android:** Check keystore expiry: `keytool -list -v -keystore keystore.jks`
3. Determine: When do they expire?

**Solutions:**

**Solution A: iOS Certificate Already Expired**
- **Problem:** Can't submit with expired certificate
- **Action:** Must renew from Apple Developer
- **Timeline:** 10-15 minutes through Apple developer portal
- **Escalate to:** PM (may delay submission)

**Solution B: iOS Certificate Expiring Soon (within 30 days)**
- **Status:** Can still use for now
- **Action:** Renew immediately after launch
- **Timeline:** No delay to launch

**Solution C: Android Keystore Expires in Future**
- **Status:** No action needed
- **Note:** Usually valid for 25+ years

**When to escalate:** If certificate is expired NOW

---

### Issue: "Environment variables not set"

**Symptom:** Code can't find DATABASE_URL, JWT_SECRET, or other env vars

**Diagnostic:**
1. Check: Does `.env` file exist? `ls -la .env`
2. Check: Is it in `.gitignore`? (it should be)
3. Verify: Are the right variables in the file?

**Solution:**
```bash
# Copy the template
cp .env.example .env

# Edit with actual values
nano .env
# Or use your editor to fill in:
# DATABASE_URL=postgresql://...
# JWT_SECRET=your-secret
# NODE_ENV=production

# Verify it's set
source .env
echo $DATABASE_URL
```

**Common values:**
- `DATABASE_URL`: PostgreSQL connection string from your database
- `JWT_SECRET`: Any long random string (generate with: `openssl rand -base64 32`)
- `NODE_ENV`: Set to `production` for launch

**When to escalate:** If you don't know the actual values to put in

---

## Build & Test Issues (May 14)

### Issue: "Integration tests failing"

**Symptom:** `npm test` shows failed tests (red X instead of green checkmark)

**Diagnostic:**
1. Run: `npm test -- --reporter=verbose` → See which specific tests fail
2. Read error message: What's the actual error?
3. Check: Did this test pass before?

**Solutions (in order):**

**Solution A: Test DB connection issue**
```bash
# Verify test database is accessible
psql -U user -d test_db -c "SELECT 1"
# If connection fails, start your test database
```

**Solution B: Test data missing**
```bash
# Seed test database with sample data
npm run db:seed:test
# Then re-run tests
npm test
```

**Solution C: Flaky test (passes sometimes)**
```bash
# Run test multiple times to verify it's actually flaky
npm test -- --reporter=verbose [specific-test.test.ts]
# Run 5 times in a row
# If it sometimes passes/fails = flaky test
# Document this and continue (not a blocker)
```

**Solution D: Test actually broken**
- Fix the code (or the test)
- Re-run: `npm test`
- Confirm it passes

**When to escalate:** If 3+ tests fail and you can't identify why

---

### Issue: "Build takes too long"

**Symptom:** `npx eas build` or native build has been running for >90 minutes

**Diagnostic:**
1. Check logs: Are there errors or just slow?
2. Check system: CPU at 100%? Disk full?
3. Is it actually building or stuck?

**Solutions (in order):**

**Solution A: Check system resources**
```bash
# Mac:
top -l 1 | grep PhysMem
# Linux:
free -h
# Windows: Task Manager

# If disk full: Clean up
rm -rf node_modules/.cache
```

**Solution B: Cancel and rebuild**
```bash
# Cancel current build (Ctrl+C)
# Check logs for errors
# Fix the issue
# Restart build
```

**Solution C: Use native build instead**
```bash
# Instead of: npx eas build
# Try native Xcode or Android build
# Faster for testing
```

**When to escalate:** If build fails with actual errors (not just slow)

---

### Issue: "App crashes on test device"

**Symptom:** App installs but immediately crashes when opened

**Diagnostic:**
1. Check device logs: 
   - **iOS:** Xcode → Window → Devices → [Device] → View Device Logs
   - **Android:** `adb logcat` (filter for app name)
2. Look for stack trace or error message
3. Determine: Which screen crashes? All the time?

**Solutions (in order):**

**Solution A: Null pointer error**
- **Symptom:** "Cannot read property X of undefined"
- **Fix:** Debug the code, add null checks
- **Timeline:** 15-30 min to fix

**Solution B: Missing image or asset**
- **Symptom:** "Image not found" or 404
- **Fix:** Verify asset is included in build
- **Timeline:** 10 min to fix

**Solution C: Network issue**
- **Symptom:** API calls failing
- **Fix:** Check if backend is running, verify URLs
- **Timeline:** 5 min to fix

**Solution D: Memory issue**
- **Symptom:** App crashes after a few minutes of use
- **Fix:** Check for memory leaks
- **Timeline:** 20+ min to debug and fix

**When to escalate:** If crash persists after 20 minutes of troubleshooting

---

## Submission Issues (May 15)

### Issue: "iOS submission rejected - missing privacy policy URL"

**Symptom:** App Store Connect rejects submission with message about privacy policy

**Quick fix:**
1. Get privacy policy URL (ask PM or check website)
2. Go to App Store Connect
3. My Apps → SOLEINTEL → App Privacy
4. Add URL and save
5. Re-submit

**Timeline:** <5 minutes

---

### Issue: "Android submission fails - AAB build issues"

**Symptom:** Play Store shows "Invalid app bundle" or similar

**Diagnostic:**
1. Re-generate the AAB:
```bash
npx eas build --platform android --production
```

2. Verify file:
```bash
unzip -l app-release.aab | head -20
# Should show valid structure
```

**Fix:** Re-submit with new AAB file

---

### Issue: "Screenshots don't meet platform requirements"

**Symptom:** App Store or Play Store rejects screenshots as wrong size/format

**Diagnostic:**
1. Check requirements:
   - **iOS:** 1170x2532px, 1284x2778px, or 1179x2556px (different iPhone models)
   - **Android:** 1080x1920px minimum

2. Check current screenshots: What size are they?

**Solutions:**

**Solution A: Resize screenshots**
```bash
# Use ImageMagick to resize
convert old-screenshot.png -resize 1170x2532 new-screenshot.png
```

**Solution B: Use screenshot tool**
- Xcode has screenshot capture (Simulator → Device → Take Screenshot)
- Android Studio has similar feature

**Timeline:** 15-30 min to capture and resize all screenshots

---

## Launch Day Issues (May 20)

### Issue: "Crash rate suddenly spiking"

**Symptom:** Crash rate jumps from 0.3% to 3.2% in last 5 minutes

**Immediate action:**
1. Don't panic - you prepared for this
2. Check Sentry → Issues: Which screen is crashing?
3. Determine: Is this from recent code change?
4. Decision: Hotfix or rollback?

**If obvious code bug:** Hotfix (5-10 min)
```bash
# Fix the code
git add [files]
git commit -m "Fix crash in [feature]"
git push origin main
# Railway auto-deploys
# Monitor crash rate - should drop in 2-3 min
```

**If not sure about fix:** Rollback
```bash
# Revert to last known good
git revert [bad-commit]
git push origin main
# Railway auto-deploys
# Crash rate should drop immediately
```

**Reference guide:** See EMERGENCY_PROCEDURES_GUIDE.md for detailed procedures

---

### Issue: "API returning errors for all requests"

**Symptom:** Every API call gets 500 error or timeout

**Immediate diagnosis:**
1. Check database: Is it running?
   ```bash
   railway status
   ```

2. Check logs: 
   ```bash
   railway logs -f
   # Look for database connection errors
   ```

3. Check load: Is something overwhelming the system?
   - Railway dashboard → Metrics
   - Look for CPU/Memory spikes

**Solutions:**

**Solution A: Database connection pool exhausted**
- Restart database: `railway restart db`
- Monitor: API should recover in 30-60 seconds

**Solution B: Database disk full**
- Check: `railway logs -f | grep disk`
- If disk full: Major issue, needs rollback + investigation
- Escalate immediately

**Solution C: Code bug**
- Check error log carefully
- If obvious bug: Hotfix and deploy
- If not sure: Rollback

---

### Issue: "Users report they can't sign up"

**Symptom:** Multiple users in support saying "Sign up button doesn't work"

**Immediate action:**
1. Try to sign up yourself (test account)
2. Does it work? If yes → User error (guide them)
3. If no → There's a real issue

**Diagnostic:**
1. Check Sentry: Are there authentication errors?
2. Check API logs: Is signup endpoint failing?
3. Check database: Did the test user get created?

**Solutions:**

**Solution A: Email validation failing**
- Check email service (if you have one)
- Temporarily allow all emails
- Hotfix and deploy

**Solution B: Database constraint**
- Check error: Is it "duplicate key" or "constraint violation"?
- Investigate why - may need data cleanup
- Hotfix and deploy

**Solution C: Rate limiting**
- Check: Is IP getting blocked after X attempts?
- Adjust rate limiting
- Hotfix and deploy

**When to escalate:** If >50 users affected and you can't find root cause in 10 min

---

## Monitoring Issues (May 20+)

### Issue: "Metrics dashboard not updating"

**Symptom:** Firebase Analytics or Sentry shows old data, not updating

**Diagnostic:**
1. Check metric age: How old is the last data point?
2. Refresh browser: Does it update after refresh?
3. Check if events are being sent:
   ```bash
   # In app logs, look for analytics event sends
   # Or: Manual test in app, see if event appears
   ```

**Solutions:**

**Solution A: Just old data (normal)**
- Firebase has 15-30 min latency
- Data will update automatically
- No action needed

**Solution B: Browser cache**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear cookies for the dashboard
- Try again

**Solution C: Events not being sent**
- Check app code: Are tracking calls present?
- Check app logs: Are there errors?
- Manual test: Sign in, perform action, check dashboard
- May need to redeploy with tracking code

---

### Issue: "Sentry not showing crashes"

**Symptom:** You see crashes in real users but Sentry shows nothing

**Diagnostic:**
1. Is Sentry configured?
   - Check app code: Is Sentry SDK imported?
   - Check .env: Is SENTRY_DSN set?

2. Are crashes happening in production or dev?
   - Development crashes don't go to Sentry (usually)

3. Is there a Sentry integration issue?
   - Test manually: Trigger an error, see if it appears

**Solutions:**

**Solution A: Sentry not initialized**
```bash
# Check app entry point for Sentry.init()
# If missing, add it:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Solution B: DSN wrong or missing**
```bash
# Check .env file:
echo $SENTRY_DSN
# If empty: Set it correctly from Sentry project settings
```

**Solution C: Filtering errors**
- Sentry has filters that might hide errors
- Check Sentry settings → Filtering → Is your error filtered?

---

## Frequently Asked Questions

### Q: "Do I need to worry about perfection on Day 1?"

**A:** No. Week 1 is about gathering feedback and fixing issues quickly. Perfection is for 2.0. Focus on stability (no crashes) and core features working. Everything else is nice-to-have.

---

### Q: "What if we hit our download targets ahead of schedule?"

**A:** Great news! You can:
1. Accelerate Phase 2 rollout (50%) if crash rate still <1%
2. Start Phase 3 planning early
3. Get extra capacity scaling early if needed

Reference: Decision points in MAY_20_LAUNCH_DAY_GUIDE.md

---

### Q: "What if we miss our targets?"

**A:** That's OK. Follow these steps:
1. Don't panic - launches are unpredictable
2. Investigate why (bad marketing? user issues? bugs?)
3. Fix the root cause
4. Continue monitoring
5. Phase 2 decision moves to May 21 or later

Reference: Contingency plans in EMERGENCY_PROCEDURES_GUIDE.md

---

### Q: "How long do we monitor after launch?"

**A:** 
- **May 20:** All day (6am-8pm minimum)
- **May 21-27:** Daily monitoring (9am-5pm)
- **May 28+:** Normal operations

On-call coverage is lighter after May 27.

---

### Q: "What's the difference between a hotfix and rollback?"

**A:**
- **Hotfix:** Fix the code, deploy a new version. Good when fix is simple and confidence is high. (~5-10 min)
- **Rollback:** Revert to old code. Good when fix is complex or confidence is low. (~2-3 min)

Decision: If you can fix in <5 min with high confidence → hotfix. Otherwise → rollback.

---

### Q: "Can we deploy during launch day?"

**A:** Yes, but:
- Only if necessary (critical bug or security)
- Coordinate with PM before deploying
- Expect 2-3 min downtime (users see loading)
- Have rollback plan ready
- Reference: EMERGENCY_PROCEDURES_GUIDE.md

---

### Q: "Who approves a rollback?"

**A:** 
- **Yellow alert:** Tech lead investigates, decides
- **Red alert:** PM + Tech lead agree
- **Critical alert:** Tech lead can rollback immediately, inform PM after

See MAY_ONCALL_ESCALATION_GUIDE.md for escalation paths.

---

### Q: "What if the app store rejects our submission?"

**A:** Don't panic. This happens. Steps:
1. Read rejection reason carefully
2. Fix the issue (privacy policy, content, technical)
3. Re-submit within 24 hours
4. Most issues are fixable in <30 min

You have 5 days (May 15-19) before launch, so one rejection is survivable.

---

### Q: "Can we deploy a fix after submission?"

**A:** Yes:
- If fix is ready before approval: Deploy it, it goes live at launch
- If approval happened first: Deploy after launch (will be v1.0.1)

You have time before May 20 to deploy fixes if submission gets delayed.

---

### Q: "What if database gets corrupted?"

**A:** This is rare but serious:
1. **Immediate:** Rollback to old code version
2. **Then:** Restore database from backup
3. **Result:** Lose ~15-30 min of new data, but system is stable
4. **Follow-up:** Root cause analysis (why did it corrupt?)

You have backups because you followed MAY_13_PREFLIGHT_CHECKLIST.md. Recovery time: <5 min.

---

### Q: "What if we run out of database capacity?"

**A:** Watch your metrics dashboard:
- If database connections >80% of limit
- If queries getting slow (p99 >300ms)
- Scale up: Add more capacity (in Railway, takes ~2 min)

Your infrastructure supports 10x launch day load, so this is unlikely.

---

### Q: "Can users still install if we're monitoring?"

**A:** Yes. Monitoring doesn't stop new installs. You can:
- Monitor continuously
- Phase 2/3 rollouts keep happening
- New features can wait until May 28

---

## Quick Reference: Tools & Commands

### Git Commands

```bash
# Check status
git status

# View recent commits
git log --oneline -5

# See what changed
git diff

# Rollback to previous version
git revert [commit-hash]
git push origin main

# Emergency: Revert last commit
git revert HEAD
git push origin main
```

### Database Commands

```bash
# Connect to database
psql -U [user] -d [database]

# Test connection
psql -U user -d dbname -c "SELECT 1"

# See tables
\dt

# Exit
\q
```

### Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/tests/mytest.test.ts

# Run with verbose output
npm test -- --reporter=verbose

# Run once and exit (not watch mode)
npm test -- --run
```

### Build Commands

```bash
# iOS build (using EAS)
npx eas build --platform ios --production

# Android build (using EAS)
npx eas build --platform android --production

# Native iOS (Xcode)
xcodebuild -scheme SoleIntel -configuration Release

# Native Android (Gradle)
./gradlew assembleRelease
```

### Deployment Commands

```bash
# Check railway status
railway status

# View logs
railway logs -f

# Restart service
railway restart [service-name]

# Environment variables
railway env
```

### Monitoring Commands

```bash
# Check system resources (Mac)
top -l 1

# Check disk space
df -h

# Check memory
free -h  # Linux
vm_stat  # Mac
```

---

## When to Escalate (and How)

**If you've tried 3 solutions and still stuck:**

1. **Document what you tried**
   - "Tried X, got error Y"
   - "Tried Z, no change"

2. **Identify urgency**
   - 🟡 Yellow: Non-critical, can wait 15 min
   - 🔴 Red: Critical, needed immediately

3. **Escalate appropriately**
   - Yellow → Slack #soleintel-dev-alerts with @tech_lead
   - Red → Slack with @PM @Tech_lead
   - Critical → See EMERGENCY_PROCEDURES_GUIDE.md

4. **Provide diagnosis**
   ```
   Issue: [Problem]
   Tried: [Solution 1, 2, 3]
   Error: [Specific error message]
   Impact: [How many users, severity]
   Time spent: [How long you debugged]
   ```

---

## Before Escalating Checklist

- [ ] Checked this FAQ and Troubleshooting guide
- [ ] Tried at least 2 solutions
- [ ] Read error messages carefully
- [ ] Checked logs (Sentry, Railway, app logs)
- [ ] Confirmed the issue is reproducible
- [ ] Documented exactly what's happening
- [ ] Documented what you've tried

If you checked all these, you're ready to escalate. You've done the work.

---

**SOLEINTEL Troubleshooting & FAQ**

**Purpose:** Solve issues without escalation  
**Use When:** Stuck on a problem during launch week  
**Expected Resolution:** <15 minutes for most issues

✅ **Most common issues covered**  
✅ **Solutions provided in order of likelihood**  
✅ **Escalation paths defined**

🚀 **You've got this. Check this guide first!**
