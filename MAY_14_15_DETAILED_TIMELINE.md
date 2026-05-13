# May 14-15 Detailed Execution Timeline

**Purpose:** Minute-by-minute execution plan for build and submission days  
**Timeline:** May 14-15, 2026  
**Audience:** All team members (especially operations)  
**Note:** Times shown in ET (Eastern Time). Adjust for your timezone.

---

## May 14 Timeline: Build & Test Day

### 5:45am ET - Team Arrival

**Who:** All engineering + DevOps  
**Location:** Office / War room / Slack video

**Tasks:**
- [ ] Team members log in and settle in
- [ ] Coffee/breakfast ready
- [ ] Laptops powered on and updated
- [ ] Slack notifications enabled
- [ ] Open all required dashboards/tools

**Expected state:** Team ready and focused at 6am

---

### 6:00am - 6:30am ET: Pre-Launch Verification

**Duration:** 30 minutes  
**Who:** Tech lead, DevOps engineer  
**Focus:** Final system checks before build

**Checklist:**
- [ ] Git latest code is clean main branch
  - Run: `git status` → should be clean
  - Run: `git log --oneline -1` → should show latest commit
  
- [ ] All dashboards accessible
  - Sentry: [URL] ✅
  - Firebase: [URL] ✅
  - Railway: [URL] ✅
  - App Store Connect: [URL] ✅
  - Play Console: [URL] ✅
  
- [ ] Build machines have sufficient resources
  - Disk space: >50GB free (run: `df -h`)
  - Memory available: >8GB free (run: `free -m` or Activity Monitor)
  - Network: Connection stable
  
- [ ] Test databases and services running
  - PostgreSQL: Accessible on [host:port]
  - Redis cache: Running (if applicable)
  - All external APIs responsive (run quick health check)
  
- [ ] Certificates and signing keys accessible
  - iOS: `.mobileprovision` files present
  - Android: `keystore.jks` file present
  - Passwords/passphrases ready (stored securely)
  
- [ ] Notify team: "Ready to proceed to test phase" in Slack

**Expected outcome:** Green light to begin integration tests

**If issues found:**
- Document in #soleintel-dev-alerts
- Mitigate or escalate to PM
- Proceed only after resolution

---

### 6:30am - 7:00am ET: Pre-Test Briefing

**Duration:** 30 minutes  
**Who:** Tech lead briefs team  
**Location:** Video call or in-person

**Briefing agenda:**
1. Today's goals (2-min overview)
2. Timeline and milestones (3-min walkthrough)
3. If issues arise (2-min escalation procedure)
4. Q&A (5-min)
5. Begin testing (on tech lead's go)

**Expected outcome:** Team understands plan and starts tests

---

### 7:00am ET: BEGIN INTEGRATION TESTS

**Duration:** ~90 minutes (7am - 8:30am)  
**Who:** 
- Backend engineer(s): Run 38 backend tests
- Mobile engineer(s): Run 20 mobile tests
- Testing: Monitor test runner output

**Backend Tests (Parallel with mobile):**

```
7:00am - Start test run
Run: npm test (in backend directory)
Expected: ~40-50 tests total (38 integration + some unit)
Expected duration: 45-60 minutes

Tests to run:
- Database connectivity (5 tests)
- Authentication (8 tests)
- API endpoints (15 tests)
- Business logic (10 tests)

7:05am - Tests running, monitor for failures
7:25am - Should see ~50% complete
7:45am - Should see ~90% complete
7:55am - Should see PASS or failures

Expected result: 38/38 PASS ✅
If failures: Diagnose and fix immediately
```

**Mobile Tests (Parallel with backend):**

```
7:00am - Start test run
Run: npm test (in mobile directory)
Expected: ~20 tests total
Expected duration: 30-40 minutes

Tests to run:
- Component rendering (7 tests)
- Navigation flow (6 tests)
- State management (4 tests)
- API integration (3 tests)

7:05am - Tests running, monitor for failures
7:20am - Should see ~60% complete
7:35am - Should see ~95% complete
7:40am - Should see PASS or failures

Expected result: 20/20 PASS ✅
If failures: Diagnose and fix immediately
```

**Monitoring:**
- [ ] Check test output every 5 minutes
- [ ] Watch for failures or slow tests
- [ ] Keep Slack channel updated on progress

**Success criteria:**
- Backend: 38/38 tests PASS
- Mobile: 20/20 tests PASS
- No hangs or timeouts
- Total time <90 minutes

**If test fails:**
```
1. Note which test failed
2. Check error message
3. Attempt fix (or skip if known blocker with documented mitigation)
4. Re-run failed test
5. If still failing: Escalate to PM
```

**Slack updates:**
- 7:00am: "Integration tests starting now"
- 7:30am: "Testing 60% complete, no issues so far"
- 8:00am: "Testing nearing completion"
- 8:30am: "Testing complete - RESULTS: [X/X passed]"

---

### 8:30am - 9:00am ET: Test Results Review

**Duration:** 30 minutes  
**Who:** Tech lead + test engineer

**Review:**
- [ ] Verify all tests passed
- [ ] Document any failures
- [ ] Confirm fix status for any issues
- [ ] Sign off on test readiness

**Go/no-go decision:**
- **✅ All tests passed:** Proceed to build
- **❌ Tests failed:** Document issue and mitigation, then proceed (if mitigated) or escalate

**Slack announcement:**
```
✅ INTEGRATION TESTS COMPLETE

Backend: 38/38 PASSED ✅
Mobile: 20/20 PASSED ✅
Total duration: [X min]

Next phase: Build iOS/Android apps
ETA: 9:00am
```

---

### 9:00am - 10:30am ET: BUILD PHASE

**Duration:** ~90 minutes  
**Who:** Mobile engineer (builds both) + DevOps watching

**iOS Build:**
```
9:00am - Start iOS build
Command: npx eas build --platform ios --production 
         (or xcodebuild if using native Xcode)

Expected:
- Output: SoleIntel.ipa file
- Size: 100-150 MB
- Duration: 40-50 minutes
- Signing: With distribution certificate

9:05am - Build running, archive in progress
9:30am - Build ~50% complete
9:50am - Build ~90% complete
9:55am - Build complete

Expected result: 
- File: SoleIntel.ipa created ✅
- File size: [X] MB
- Signature: Valid ✅
```

**Android Build (Parallel):**
```
9:00am - Start Android build
Command: npx eas build --platform android --production
         (or ./gradlew assembleRelease if native)

Expected:
- Output: app-release.aab (or .apk) file
- Size: 80-120 MB
- Duration: 45-60 minutes
- Signing: With production keystore

9:05am - Build running, gradle dependencies resolving
9:30am - Build ~50% complete
9:50am - Build ~90% complete
10:00am - Build complete

Expected result:
- File: app-release.aab created ✅
- File size: [X] MB
- Signature: Valid ✅
```

**Monitoring:**
- [ ] Watch build logs for warnings/errors
- [ ] Update #soleintel-launch every 15 minutes
- [ ] Confirm both builds complete and signed

**Success criteria:**
- iOS .ipa created successfully
- Android .aab created successfully
- Both files signed correctly
- Both files reasonable size
- Total time <90 minutes

**Slack updates:**
- 9:00am: "Build phase starting - iOS and Android in parallel"
- 9:30am: "Builds 50% complete, no issues"
- 10:00am: "Builds ~complete, verifying artifacts"
- 10:30am: "Builds complete: iOS [size] MB, Android [size] MB"

---

### 10:30am - 11:30am ET: DEVICE TESTING

**Duration:** ~60 minutes  
**Who:** Mobile engineer + QA tester

**Setup (10:30am - 10:45am):**
- [ ] Plug in test devices (iPhone + Android phone)
- [ ] Unlock devices, enable developer mode (if needed)
- [ ] Clear test data from previous builds
- [ ] Have test account credentials ready

**iOS Device Testing (10:45am - 11:05am):**
```
10:45am - Install iOS build on test iPhone
         Method: Xcode (drag .ipa) or Apple Configurator 2

11:00am - Launch app on device
         Expected: App launches without crash
         
Verify basic functionality:
- [ ] App starts
- [ ] Can sign in with test account
- [ ] Home screen renders
- [ ] Can browse shoes
- [ ] Can add to watchlist
- [ ] Can navigate between screens
- [ ] No immediate crashes
- [ ] No memory warnings

11:05am - Device testing complete
```

**Android Device Testing (11:05am - 11:25am):**
```
11:05am - Install Android build on test Android device
         Method: adb install -r app-release.aab
         
11:10am - Launch app on device
         Expected: App launches without crash
         
Verify basic functionality:
- [ ] App starts
- [ ] Can sign in with test account
- [ ] Home screen renders
- [ ] Can browse shoes
- [ ] Can add to watchlist
- [ ] Can navigate between screens
- [ ] No immediate crashes
- [ ] No memory warnings

11:25am - Device testing complete
```

**Issues during testing:**
- Minor UI issue: Note and document, proceed
- Crash: Diagnose, fix, rebuild, retest (if time allows)
- Critical issue: Escalate to PM for go/no-go decision

**Sign-off (11:25am - 11:30am):**
- [ ] Both apps tested on real devices
- [ ] Basic functionality works
- [ ] No critical issues found
- [ ] Ready for app store submission

**Slack announcement:**
```
✅ DEVICE TESTING COMPLETE

iOS: App installs and runs on iPhone ✅
Android: App installs and runs on Android phone ✅
Both: Basic functionality verified ✅

Next phase: Finalize app store assets (final 30 min)
```

---

### 11:30am - 12:00pm ET: Finalize App Store Assets

**Duration:** ~30 minutes  
**Who:** Designer + mobile engineer

**Tasks:**
- [ ] Verify app icons (1024x1024 + all variants)
- [ ] Verify launch screens present
- [ ] Verify app store listing content (title, description, keywords)
- [ ] Verify screenshots ready for upload
- [ ] Verify privacy policy URL correct
- [ ] Verify support URL correct
- [ ] Organize all files for submission package

**File checklist:**
```
iOS App Store Assets:
- [ ] App icon: 1024x1024 PNG
- [ ] Launch screen: Present in Xcode
- [ ] Privacy Policy: https://[correct URL]
- [ ] Support URL: https://[correct URL]
- [ ] Screenshots: 4-5 per language (x3 sizes)
- [ ] Preview video: (optional, if prepared)

Android Play Store Assets:
- [ ] App icon: 512x512 PNG
- [ ] Feature graphic: 1024x500 PNG
- [ ] Screenshots: 5-8 per language
- [ ] Privacy Policy: https://[correct URL]
- [ ] Support URL: https://[correct URL]
- [ ] Video preview: (optional)
```

**Organization:**
- [ ] Create folder: `/submission_package_may15/`
- [ ] Organize: iOS assets in `/ios/` subfolder
- [ ] Organize: Android assets in `/android/` subfolder
- [ ] Create: README with file organization
- [ ] Share: Link to folder with submission team

**Success criteria:**
- All assets present and correct
- No missing files
- All URLs valid
- Ready for May 15 submission

---

### 12:00pm ET: BUILD DAY WRAP-UP

**Duration:** ~30 minutes  
**Who:** Tech lead + team

**Final checks:**
- [ ] All builds successful and tested
- [ ] No critical issues remaining
- [ ] All artifacts ready for submission
- [ ] Submission package organized
- [ ] Team debriefs quickly
- [ ] Post: End-of-day status to Slack

**Team standup (12:15pm):**
```
Quick 5-minute standup:
- Backend lead: "Tests passed, no issues"
- Mobile lead: "Builds successful, devices tested, ready for submission"
- DevOps: "All systems stable"
- PM: "Great work! Tomorrow we submit."
```

**Slack message:**
```
✅ MAY 14 BUILD & TEST DAY COMPLETE

Results:
- ✅ 38/38 backend tests passed
- ✅ 20/20 mobile tests passed
- ✅ iOS build: [size] MB, tested ✅
- ✅ Android build: [size] MB, tested ✅
- ✅ App store assets finalized

Status: READY FOR SUBMISSION

Next: May 15 - App Store Submissions
Timeline: 10:00am iOS, 12:00pm Android

Team: Great work! Grab lunch and rest up. We launch in 6 days! 🚀
```

**Team release (12:30pm):**
- Dismiss team for lunch and afternoon rest
- Optional: Light availability in Slack, but no required work
- Team to review MAY_15_SUBMISSION_GUIDE.md before leaving

---

## May 15 Timeline: App Store Submission Day

### 8:00am ET - Team Arrival & Briefing

**Who:** Full team  
**Duration:** 30 minutes

**Briefing:**
- Submission process overview (5 min)
- iOS submission walkthrough (5 min)
- Android submission walkthrough (5 min)
- Q&A and clarifications (5 min)
- Prep submission materials (5 min)

**Expected outcome:** Team understands submission process

---

### 9:00am - 10:00am ET: PRE-SUBMISSION VERIFICATION

**Duration:** 60 minutes  
**Who:** Tech lead + mobile engineer

**Checklist (from MAY_15_SUBMISSION_GUIDE.md):**
- [ ] Both app builds available (iOS .ipa, Android .aab)
- [ ] All app store assets verified
- [ ] Privacy Policy URL correct
- [ ] Support URL correct
- [ ] Certificates valid (check expiry dates)
- [ ] App Store Connect login working
- [ ] Google Play Console login working
- [ ] Screenshots meet platform requirements
- [ ] App description final and approved
- [ ] Keywords optimized for discoverability

**Go/no-go decision:**
- [ ] All items verified: ✅ READY TO SUBMIT
- [ ] Issues found: Document, resolve, then submit

**Slack announcement:**
```
🟢 PRE-SUBMISSION CHECKLIST COMPLETE

All items verified and ready.
Proceeding with iOS submission at 10:00am.
```

---

### 10:00am - 12:00pm ET: iOS APP STORE SUBMISSION

**Duration:** 120 minutes  
**Who:** Mobile engineer + tech lead

**High-level timeline:**
```
10:00am - Log in to App Store Connect
10:10am - Create new app version or add build
10:15am - Configure app metadata (description, keywords, pricing)
10:30am - Upload binary (build from Xcode or TestFlight)
10:45am - Add screenshots (4-5 per language)
11:00am - Set privacy policy URL
11:05am - Set support URL
11:10am - Final review of all information
11:20am - Submit for review
11:30am - Confirmation email received ✅
```

**Steps (detailed in MAY_15_SUBMISSION_GUIDE.md):**
1. Log in: App Store Connect
2. My Apps → SOLEINTEL
3. App Version → Create new version (or select pending)
4. Upload build (binary)
5. Add metadata (description, keywords, category)
6. Add screenshots (per language, per device size)
7. Set URLs (privacy, support, website)
8. Set pricing (free)
9. Final review
10. Submit for review

**Monitoring:**
- [ ] Upload progresses without errors
- [ ] Screenshots upload successfully
- [ ] Metadata saves correctly
- [ ] Final submission succeeds

**Success criteria:**
- [ ] App submitted to App Store
- [ ] Confirmation received
- [ ] Status shows "Waiting for Review"
- [ ] Build available in TestFlight (automatic)

**Slack update at 11:30am:**
```
✅ iOS APP STORE SUBMISSION COMPLETE

Build: [version] submitted ✅
Status: Waiting for Review
Expected review time: 24-48 hours

Monitoring: Will check status daily May 16-18
```

---

### 12:00pm - 2:00pm ET: ANDROID PLAY STORE SUBMISSION

**Duration:** 120 minutes  
**Who:** Mobile engineer + tech lead

**High-level timeline:**
```
12:00pm - Log in to Google Play Console
12:10pm - Select SOLEINTEL app
12:15pm - Create release (new version)
12:20pm - Upload AAB (build file)
12:30pm - Add release notes / changelog
12:40pm - Add screenshots (5-8 per language)
12:50pm - Set privacy policy URL
12:55pm - Set support URL
1:00pm - Final review of all information
1:10pm - Set rollout percentage (100%)
1:15pm - Submit for review
1:30pm - Confirmation and auto-submission ✅
```

**Steps (detailed in MAY_15_SUBMISSION_GUIDE.md):**
1. Log in: Google Play Console
2. Select SOLEINTEL app
3. Release management → Manage releases
4. Create new release
5. Upload AAB build
6. Add release notes (version description)
7. Add screenshots (per language, per phone size)
8. Set privacy policy URL
9. Set support URL
10. Set rollout: 100% immediately (Phase 1 will be via app store)
11. Review all information
12. Submit

**Monitoring:**
- [ ] Build uploads successfully
- [ ] Screenshots upload without errors
- [ ] Metadata saves correctly
- [ ] Release submits successfully

**Success criteria:**
- [ ] App submitted to Play Store
- [ ] Status shows "Under Review"
- [ ] Build available for internal testing

**Slack update at 1:30pm:**
```
✅ ANDROID PLAY STORE SUBMISSION COMPLETE

Build: [version] submitted ✅
Status: Under Review
Expected review time: 2-4 hours

Monitoring: Will check status throughout afternoon
```

---

### 2:00pm - 5:00pm ET: POST-SUBMISSION MONITORING & DOCUMENTATION

**Duration:** 180 minutes  
**Who:** Tech lead + Mobile engineer

**Activities:**
- [ ] Monitor App Store submission status (check every 30 min)
- [ ] Monitor Play Store submission status (check every 30 min)
- [ ] Check for app store messages/questions
- [ ] Document any questions or issues
- [ ] Prepare responses if review team has questions
- [ ] Update stakeholders on status
- [ ] Prepare for potential approval or rejection

**Status checks:**
```
2:00pm - Initial check
        iOS: "Waiting for Review"
        Android: "Under Review"
        
2:30pm - Check in
        No changes expected yet
        
3:00pm - Check in
        Android may have started review
        
3:30pm - Check in
        Watch for any questions from reviewers
        
4:00pm - Check in
        Watch for approval or rejection
        
4:30pm - Check in
        Continue monitoring
        
5:00pm - Final check of day
        Note any updates
```

**Slack status updates:**
```
2:00pm - "Monitoring submission status, will update as it changes"
3:00pm - "No changes yet - this is normal"
4:00pm - "Status: iOS waiting, Android under review"
5:00pm - "EOD status: [Current status], monitoring continues tomorrow"
```

**If questions from reviewers:**
- [ ] Check email immediately
- [ ] Read entire message
- [ ] Escalate to tech lead and PM
- [ ] Prepare response
- [ ] Reply within 1 hour if possible

**Documentation:**
- [ ] Create post-submission report
- [ ] Document submission timestamps
- [ ] Document any issues or questions
- [ ] Store confirmation emails
- [ ] Prepare for May 16-19 monitoring

---

### 5:00pm ET: END OF SUBMISSION DAY

**Duration:** 30 minutes  
**Who:** Team debrief

**Debrief:**
- [ ] Both submissions successful? ✅ Yes
- [ ] Any issues encountered? ❌ No
- [ ] Team satisfied? ✅ Yes
- [ ] Ready for May 20 launch? ✅ Yes

**Team announcement:**
```
✅ MAY 15 SUBMISSION DAY COMPLETE

Results:
- ✅ iOS app submitted at 11:30am
- ✅ Android app submitted at 1:30pm
- ✅ Both awaiting app store review

Timeline:
- May 16-18: Monitor for approval
- May 20: Launch (pending approval)

Next phase: May 20 Launch Day

Thank you all for a successful build and submission week! 🚀
```

---

## Quick Reference: May 14-15 Timeline Summary

### May 14
```
5:45am   - Team arrival
6:00am   - Pre-launch verification
6:30am   - Team briefing
7:00am   - Integration tests begin (duration: 90 min)
8:30am   - Test results review
9:00am   - Build iOS + Android (duration: 90 min)
10:30am  - Device testing (duration: 60 min)
11:30am  - Finalize assets (duration: 30 min)
12:00pm  - Wrap-up and team release
```

### May 15
```
8:00am   - Team arrival and briefing
9:00am   - Pre-submission verification
10:00am  - iOS submission begins
11:30am  - iOS submitted ✅
12:00pm  - Android submission begins
1:30pm   - Android submitted ✅
2:00pm   - Monitor for approval
5:00pm   - EOD debrief
```

---

## Contingency Timing

**If test fails and we need to rerun:**
- Add 30-60 minutes to timeline
- Push build start to 8:00am or 8:30am
- Still complete by noon

**If build takes longer:**
- Add 30-45 minutes
- Device testing moves to 11:15am or later
- Assets finalization can compress to 20 minutes
- Still complete by 12:30pm

**If submission encounters issues:**
- Plan for 1-2 hour resolution
- iOS resubmission by 1:00pm
- Android resubmission by 3:00pm
- Still ready for May 20 if approved by then

---

**SOLEINTEL May 14-15 Detailed Timeline**

**Use this minute-by-minute guide to execute the build and submission days perfectly.**

⏱️ **Stick to the timeline. Be on time. Stay focused. We ship on May 20!**

🚀
