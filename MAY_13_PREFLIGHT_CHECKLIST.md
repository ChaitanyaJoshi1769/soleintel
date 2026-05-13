# May 13 Pre-Flight Checklist

**Date:** May 13, 2026  
**Purpose:** Verify all systems are ready for May 14 build execution  
**Owner:** Project Manager / Tech Lead  
**Status:** In Progress → Complete

---

## ✅ Code & Repository

- [ ] **Main branch is clean**
  - Run: `git status` → should show "nothing to commit, working tree clean"
  - All development complete and merged to main
  
- [ ] **All source code committed**
  - Backend code committed
  - Mobile (React Native) code committed
  - ML service code committed
  - Documentation committed
  
- [ ] **Latest version tagged**
  - Current version: v1.0.0
  - Run: `git tag -l` to verify tag exists
  
- [ ] **No broken imports or syntax errors**
  - Backend: `npm run typecheck` passes
  - Mobile: `npm run typecheck` passes
  - ML: `python -m py_compile src/*.py` passes

---

## ✅ Build Environment Setup

### Backend Environment
- [ ] Node.js 20+ installed
  - Run: `node --version` (expect v20.x.x or higher)
  
- [ ] npm 10+ installed
  - Run: `npm --version` (expect 10.x.x or higher)
  
- [ ] All npm dependencies installed
  - Run: `npm list` in backend directory (no errors)
  - Run: `npm install` if needed
  
- [ ] .env file configured for production
  - DATABASE_URL set
  - JWT_SECRET set
  - NODE_ENV=production
  - All required vars present

### Mobile Environment
- [ ] Node 20+ and npm 10+ (same as backend)

- [ ] Expo CLI installed
  - Run: `npx expo --version`
  
- [ ] EAS CLI installed for builds
  - Run: `npx eas --version`
  
- [ ] iOS building ready (macOS only)
  - Xcode 15+ installed
  - CocoaPods updated: `pod repo update`
  
- [ ] Android building ready
  - Android SDK installed (API 33+)
  - ANDROID_HOME env var set
  - `sdkmanager --list` shows required packages
  
- [ ] Certificates & provisioning profiles downloaded
  - iOS: Apple Developer account configured
  - Android: Keystore file generated and backed up
  - Both stored securely and referenced in build config

### ML Environment
- [ ] Python 3.11+ installed
  - Run: `python --version`
  
- [ ] FastAPI dependencies installed
  - Run: `pip list | grep fastapi` (should show fastapi)
  
- [ ] TensorFlow/LSTM model ready
  - Model file exists at expected path
  - Test prediction works: `python src/test_model.py`

---

## ✅ Test Infrastructure

### Backend Tests
- [ ] Test directory structure verified
  - `/tests/integration/` directory exists
  - All 38 test files present and readable
  
- [ ] Vitest configured
  - Run: `npm test -- --list` (shows all tests)
  - No missing dependencies
  
- [ ] Test database accessible
  - Can connect to test PostgreSQL instance
  - Schema created and seeded
  
- [ ] All 38 backend integration tests pass (or documented blockers)
  - Run: `npm test` in backend
  - Document any failures and mitigation

### Mobile Tests
- [ ] Test directory structure verified
  - `/mobile/__tests__/` directory exists
  - All 20 test files present
  
- [ ] Jest/Vitest configured for mobile
  - Run: `npm test -- --list` in mobile
  - All test suites enumerated
  
- [ ] All 20 mobile integration tests pass (or documented blockers)
  - Run: `npm test` in mobile
  - Document any failures and mitigation

---

## ✅ Deployment & DevOps

### Railway Configuration
- [ ] Railway app created and linked
  - Run: `railway status` (shows connected project)
  
- [ ] Environment variables configured in Railway
  - DATABASE_URL
  - JWT_SECRET
  - NODE_ENV=production
  - All deployment vars set

- [ ] Auto-deploy on git push enabled
  - Webhook configured from GitHub to Railway
  - Test: Push a trivial change and verify auto-deploy triggered

### Monitoring & Observability
- [ ] Sentry project created
  - Sentry DSN configured in .env
  - Test error reported to Sentry
  
- [ ] Firebase Analytics configured
  - Firebase project ID in mobile app config
  - Test event fires and appears in Firebase console
  
- [ ] Logs accessible
  - Railway logs viewable
  - Can check recent deployment logs
  
- [ ] Monitoring dashboard prepared
  - Grafana or Data Studio dashboard created
  - Key metrics defined (DAU, API latency, errors)
  - Dashboard accessible to team

### Database
- [ ] PostgreSQL running
  - Can connect: `psql -U user -d dbname -c "SELECT 1;"`
  
- [ ] Latest schema deployed
  - All 28 tables created
  - All indexes in place
  - Can verify with: `npm run db:info` or similar
  
- [ ] Production database backup configured
  - Automated daily backups enabled
  - Latest backup verified as restorable
  
- [ ] Database performance baselines recorded
  - Query performance tested
  - <200ms p99 latency confirmed
  - 90% query reduction via caching confirmed

---

## ✅ Security & Compliance

- [ ] API authentication working
  - JWT token generation works
  - Token validation works
  - 30-day expiry set correctly
  
- [ ] CORS configured correctly
  - Allowed origins documented
  - Mobile and web URLs whitelisted
  
- [ ] HTTPS enforced
  - All endpoints use HTTPS
  - SSL certificate valid and not expiring soon
  
- [ ] Secrets not committed
  - Run: `git log -S "password\|secret\|key" --all` (should be empty)
  - No .env files in git history
  
- [ ] API rate limiting configured
  - Per-user rate limits set
  - Test endpoint respects limits
  
- [ ] Password policy enforced
  - Minimum length: 8 characters
  - Complexity requirements: uppercase, number, special char
  - Hashing algorithm: bcrypt (not plaintext)

---

## ✅ App Store Preparation

### iOS (App Store)
- [ ] App Store Connect access verified
  - Can log in to App Store Connect
  - App created in App Store Connect
  - Bundle ID matches Xcode project
  
- [ ] Certificates & provisioning profiles current
  - Distribution certificate valid (not expiring within 30 days)
  - Provisioning profile synced with current certificate
  - Xcode can sign builds
  
- [ ] Signing configuration correct
  - Build settings use correct team ID
  - Automatic code signing enabled
  - Can build locally and verify signature: `codesign -v build.ipa`
  
- [ ] App icon and splash screen ready
  - 1024x1024 PNG for app icon (180x180, 120x120 variants also present)
  - Launch screen assets prepared
  - All in correct locations in Xcode

### Android (Play Store)
- [ ] Google Play Console access verified
  - Can log in to Play Console
  - App created in Play Console
  - Package name matches build config
  
- [ ] Signing key generated and secured
  - Keystore file exists and not in git
  - Keystore password stored securely (not in code)
  - Backup keystore created and stored offline
  
- [ ] Build signing configured
  - Build.gradle references keystore
  - Key alias and passwords correct
  - Can build locally: `./gradlew assembleRelease` (or EAS equivalent)
  
- [ ] App icon and assets ready
  - 512x512 PNG for app icon
  - All required screen densities (ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
  - splash.png prepared

---

## ✅ Build Testing

- [ ] Local iOS build succeeds
  - Run: `npx eas build --platform ios --local` (if using local build)
  - Or: `xcodebuild -scheme SoleIntel -configuration Release` (native Xcode)
  - Output: SoleIntel.ipa file created
  - File size reasonable (expect 50-150 MB)
  
- [ ] Local Android build succeeds
  - Run: `npx eas build --platform android --local` (if using EAS)
  - Or: `./gradlew assembleRelease` (native Android)
  - Output: app-release.aab or .apk created
  - File size reasonable (expect 40-120 MB)
  
- [ ] iOS build installs on test device
  - Test device available (physical iPhone or simulator)
  - Can install via Xcode or TestFlight
  - App launches without crash
  
- [ ] Android build installs on test device
  - Test device available (physical Android or emulator)
  - Can install: `adb install -r app-release.apk`
  - App launches without crash
  
- [ ] Basic functionality verified on devices
  - App starts
  - Can sign in with test account
  - Can view home screen
  - Can navigate between screens
  - No immediate crashes

---

## ✅ Team Readiness

### Communication
- [ ] Slack channels created and members added
  - #soleintel-launch channel exists
  - #soleintel-dev-alerts configured
  - #soleintel-support ready (for user issues)
  
- [ ] Team distribution list created
  - All team members have email
  - Emergency contact list compiled
  - On-call rotation for May 20 launch day established
  
- [ ] Daily standup scheduled
  - Time: [insert time]
  - Frequency: 9am daily May 13-27
  - Meeting link shared with team
  
- [ ] Status page prepared
  - Where will team communicate status to users?
  - Twitter account ready for launch announcement
  - Blog post drafted for launch day

### Runbooks & Procedures
- [ ] Team has read MAY_14_BUILD_EXECUTION.md
  - Each engineer knows their role
  - Test phase procedures understood
  - Build procedures understood
  
- [ ] Team has read LAUNCH_PLAYBOOK_MASTER.md
  - Decision framework understood
  - Escalation paths known
  - Communication standards reviewed
  
- [ ] Contingency plans reviewed
  - What if tests fail?
  - What if build fails?
  - What if submissions rejected?
  - Team knows response procedures
  
- [ ] On-call rotation assigned
  - Engineer on-call for May 14: [name]
  - Engineer on-call for May 15: [name]
  - Engineer on-call for May 20: [name]

### Hardware & Access
- [ ] Test devices available
  - iPhone (iOS 16+) available for testing
  - Android phone (Android 13+) available for testing
  - Both charged and accessible
  
- [ ] Developer accounts accessible
  - Apple ID for App Store Connect: [verified]
  - Google Account for Play Console: [verified]
  - All team members can access
  
- [ ] Build machine available
  - macOS for iOS builds (if not using EAS)
  - Linux/Windows/macOS for Android builds
  - Sufficient disk space (50+ GB free)
  - Sufficient RAM (16+ GB)

---

## ✅ Documentation & Knowledge

- [ ] All documentation files reviewed
  - MAY_14_BUILD_EXECUTION.md read and understood
  - PHASE_3_TEST_READINESS.md reviewed
  - APP_STORE_SUBMISSION_GUIDE.md bookmarked
  - MAY_20_LAUNCH_DAY_GUIDE.md available
  
- [ ] Success metrics understood
  - Launch day targets: 200+ downloads, <1% crash rate
  - Week 1 targets: 1,200+ downloads, 4.0+ rating
  - Team knows what success looks like
  
- [ ] Metrics dashboard accessible
  - Firebase Analytics accessible to team
  - Sentry dashboard accessible to team
  - Can view real-time metrics during launch
  
- [ ] Known issues documented
  - Any known bugs tracked in issue tracker
  - Severity levels assigned
  - Workarounds documented (if any)

---

## ✅ Backup & Contingency

- [ ] Code backup prepared
  - GitHub repository is backup
  - Verify: Can clone fresh copy from GitHub
  
- [ ] Database backup prepared
  - Last backup timestamp: [check]
  - Backup tested restorable: [yes/no]
  - Backup location documented
  
- [ ] Build artifacts backed up
  - Previous builds (v0.9.x) archived
  - Know where to find previous builds if rollback needed
  
- [ ] Signing keys backed up
  - iOS distribution certificate backed up (not in git)
  - Android keystore backed up (not in git)
  - Passwords stored securely (not in git)
  - Backup location known to 2+ people
  
- [ ] Rollback plan documented
  - If May 20 launch has critical issue, what's rollback?
  - Can revert to previous version?
  - Procedure documented and tested

---

## ✅ Final Verification

- [ ] No critical issues blocking build
  - Any known critical bugs? [yes/no]
  - If yes, are they documented and mitigated?
  
- [ ] All prerequisites met
  - Can run: `npm test` successfully
  - Can build: `npx eas build` successfully
  - Can verify on devices: apps install and run
  
- [ ] Team confident and prepared
  - Team standup: "Are we ready?" → All affirmative
  - No blockers identified that can't be mitigated
  
- [ ] Go/No-Go decision made
  - **PROCEED TO MAY 14 BUILD?** [YES / NO]
  - If NO, document blockers and remediation plan

---

## Sign-Off

**Completed By:** [Engineer Name]  
**Verified By:** [Tech Lead/PM Name]  
**Date & Time:** May 13, 2026 [time]  
**Status:** ✅ READY FOR MAY 14 BUILD

---

## Notes & Issues

```
[Document any issues found during this checklist]
[Include mitigation or workaround if blocking]
[Update as items are verified]
```

---

**Next Step:** Begin MAY_14_BUILD_EXECUTION.md at 6am May 14, 2026

🚀 **Ready to launch!**
