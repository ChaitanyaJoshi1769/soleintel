# Engineering Quality Standards
## SOLEINTEL Code Quality, Testing, and Performance Requirements
**Owner:** Tech Lead / Engineering Lead  
**Last Updated:** May 14, 2026  
**Applies to:** All code pushed to main branch before May 20 launch

---

## Overview

This document defines the minimum quality standards for all code in SOLEINTEL. Every commit to main must meet these standards. Non-compliance blocks deployment.

**Our commitment:**
- ✅ Ship with confidence
- ✅ Minimize bugs in production
- ✅ Maintain code readability
- ✅ Enable fast iteration
- ✅ Protect user data and privacy

**Core principle:** Better to ship slowly with quality than fast with bugs that crash the app or leak data.

---

## Part 1: Code Review Standards

### Every PR requires code review before merge

**Code review checklist (reviewer must verify):**

- [ ] **Functional correctness**
  - [ ] Changes do what the PR description says
  - [ ] Edge cases are handled
  - [ ] Error handling is appropriate
  - [ ] No new runtime errors introduced

- [ ] **Code quality**
  - [ ] Code is readable and clear
  - [ ] Variable/function names are descriptive
  - [ ] Follows team naming conventions
  - [ ] No unused imports or variables
  - [ ] No commented-out code blocks

- [ ] **Testing**
  - [ ] New code has tests (unit or integration)
  - [ ] Existing tests still pass
  - [ ] Test coverage for happy path + edge cases
  - [ ] Tests are clear and maintainable

- [ ] **Performance**
  - [ ] No new N+1 queries
  - [ ] Database queries use indexes
  - [ ] API endpoints respond <200ms
  - [ ] No unnecessary loops or iterations
  - [ ] Memory leaks checked (especially mobile)

- [ ] **Security**
  - [ ] No hardcoded secrets or API keys
  - [ ] User input is validated
  - [ ] SQL injection risks mitigated (using Prisma ORM)
  - [ ] No credentials in logs
  - [ ] No XSS vulnerabilities in mobile/web

- [ ] **Dependencies**
  - [ ] No new dependencies added carelessly
  - [ ] Dependencies have known vulnerabilities checked
  - [ ] Version pins are justified
  - [ ] No duplicate dependencies

- [ ] **Documentation**
  - [ ] Code comments explain WHY not WHAT
  - [ ] Complex logic is documented
  - [ ] Public APIs have docstrings
  - [ ] Breaking changes are noted

### Code review process

**Before requesting review:**
- [ ] Code is formatted (Prettier for JS, Black for Python)
- [ ] Linter passes with zero errors
- [ ] Local tests pass
- [ ] Commits are logical and well-messaged

**During review:**
- [ ] Reviewer runs code locally to test
- [ ] Reviewer asks clarifying questions
- [ ] Reviewer suggests improvements but marks optional vs required
- [ ] Author responds to all comments

**Before merge:**
- [ ] All required comments resolved
- [ ] At least 1 approval from code owner
- [ ] All CI checks pass (tests, linting, type checking)
- [ ] Branch is up to date with main

**Block merge if:**
- ❌ Tests don't pass
- ❌ Linter fails
- ❌ Type checking errors
- ❌ No code review done
- ❌ Comments unresolved
- ❌ Breaks existing tests

---

## Part 2: Testing Standards

### Every feature needs tests

**Test coverage requirements:**

**Minimum coverage by component:**
- Backend API endpoints: 80%+ line coverage
- Mobile app screens: 70%+ line coverage
- Business logic: 90%+ line coverage
- Critical paths: 95%+ line coverage

**Test types required:**

**Unit Tests (Backend & Mobile):**
- Test individual functions in isolation
- Mock external dependencies
- Test happy path + edge cases + errors
- Example: `calculateShoeSize()` tested with valid/invalid/boundary inputs

**Integration Tests (Backend & Mobile):**
- Test feature end-to-end
- Use real database for backend tests (via test database)
- Use real device/emulator for mobile tests
- Example: User signup flow from API to database

**E2E Tests (Mobile only):**
- Test critical user journeys
- Login → Search → Filter → Details → Reviews → Checkout
- Run on real iOS and Android devices

### Running tests before commit

**Backend tests (must pass):**
```bash
# Run all tests
npm run test

# Run tests for specific file
npm run test -- src/users/users.controller.spec.ts

# Run with coverage
npm run test:cov

# Run in watch mode (develop interactively)
npm run test:watch
```

**Expected output:**
- All tests pass (0 failures)
- Coverage meets requirements
- No warnings or errors

**Mobile tests (must pass):**
```bash
# Run all tests
npm test

# Run specific test file
npm test -- Users.test.tsx

# Run with coverage
npm test -- --coverage
```

**Python microservice tests:**
```bash
# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_predictions.py -v

# Run with coverage
pytest tests/ --cov=app
```

### Test requirements checklist

For each new feature/fix:

- [ ] Unit tests written for business logic
- [ ] Integration tests written for API endpoints (backend) or screens (mobile)
- [ ] All tests pass locally
- [ ] Coverage meets minimum requirements
- [ ] Test names are clear and describe what they test
- [ ] No test data left in test files (use fixtures/seeds)
- [ ] Tests don't depend on external services (mock them)
- [ ] Tests don't have race conditions (async/await handled correctly)
- [ ] Tests run in <10 seconds (fast feedback loop)

### CI/CD automatically enforces

GitHub Actions runs on every PR:
- All tests must pass
- Coverage must not decrease
- Linting must pass
- Type checking must pass

**If CI fails, you cannot merge. Period.**

---

## Part 3: Code Style & Linting

### Formatting is automatic

**Backend & Mobile (JavaScript/TypeScript):**
```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

**Backend & Mobile (TypeScript linting):**
```bash
# Check linting errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**Python (FastAPI microservice):**
```bash
# Format with Black
black app/ tests/

# Lint with Pylint
pylint app/
```

### Code style rules

**General:**
- Indentation: 2 spaces (JavaScript/TypeScript), 4 spaces (Python)
- Line length: max 100 characters
- Semicolons: required (TypeScript)
- Quotes: double quotes for strings (except Python docstrings)
- Trailing commas: required in multi-line objects/arrays

**Naming:**
- Variables & functions: camelCase (JS/TS) or snake_case (Python)
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Private methods: prefix with `_`

**Comments:**
- Use `//` for single line (JS/TS)
- Use `/* */` for multi-line blocks
- Explain WHY, not WHAT (code should be clear what it does)
- Remove all debug comments before committing

**Imports:**
- Order: external packages → internal modules → types
- Remove unused imports before commit
- Use absolute imports with path aliases (configured in tsconfig)

### Pre-commit hook

**Before you commit, run:**

**Backend:**
```bash
npm run lint && npm run test && npm run format
```

**Mobile:**
```bash
npm run lint && npm test && npm run format
```

This prevents bad code from being committed.

---

## Part 4: Performance Standards

### API Performance

**Every API endpoint must:**
- [ ] Respond in <200ms (p99)
- [ ] Handle pagination (no endpoint returns >100 items)
- [ ] Use database indexes for filters
- [ ] Cache responses when appropriate (Redis)
- [ ] Rate limit authenticated requests

**Performance checklist:**

```
ENDPOINT: GET /api/shoes/search
- Average response time: [X]ms
- P99 response time: <200ms ✓
- Database query: indexed on [column], <20ms
- Caching: enabled, 5min TTL
- Rate limit: 100 requests/min per user
```

**Monitor with:**
```bash
# Check API response times
npm run test:performance

# View in Sentry dashboard (real production data)
# https://sentry.io/soleintel/
```

### Mobile Performance

**App must meet these standards:**

| Metric | Requirement | Check |
|--------|-------------|-------|
| **Startup Time** | <3 seconds | Measured on iPhone 12 |
| **Screen Navigation** | <500ms | iOS & Android both |
| **Search Results** | <1 second | 100 shoes loaded |
| **Image Loading** | <500ms | Normal 4G connection |
| **Memory Usage** | <100MB | Normal usage after 5 min |
| **Battery Drain** | <5% per hour | Light usage (normal) |
| **Crash Rate** | <0.5% | App stability |

**Performance testing:**
```bash
# iOS: Use Xcode Instruments
# 1. Product → Profile
# 2. Select Time Profiler or Memory
# 3. Run app, measure metrics

# Android: Use Android Profiler
# 1. Run → Profile
# 2. View CPU, Memory, Network tabs
# 3. Measure metrics during use
```

### Database Performance

**Every query must:**
- [ ] Use appropriate indexes
- [ ] Be tested for large datasets (100k+ records)
- [ ] Use pagination (never fetch all records)
- [ ] Select only needed columns (no SELECT *)
- [ ] Avoid N+1 queries (use joins)

**Check with Prisma logging:**
```bash
# Enable query logging in development
DATABASE_LOG=query

# Review slow queries
# Look for sequential identical queries (N+1 problem)
```

### Bundle Size

**Frontend bundle must be:**
- [ ] <3MB gzipped (main bundle)
- [ ] <500KB per screen (lazy loaded)
- [ ] Images optimized (WebP, compressed)
- [ ] No unnecessary dependencies

**Check with:**
```bash
# Analyze bundle size
npm run analyze

# Identify large dependencies
npm ls [package-name]
```

---

## Part 5: Type Safety

### TypeScript must be strict

**tsconfig.json settings:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**This means:**
- Every variable must have a type
- No `any` types (except in rare justified cases)
- Null checks required before use
- Unused variables cause build failure
- Return types must match function signature

### Type checking before commit

```bash
# Check for type errors (must pass)
npx tsc --noEmit

# Fix common type errors
npx tsc --noEmit | head -20
```

**Types required for:**
- All function parameters
- All function return values
- All API responses
- All database models (via Prisma)

---

## Part 6: Security Standards

### No secrets in code

**Forbidden:**
- ❌ API keys in code
- ❌ Database passwords in code
- ❌ JWT secrets in code
- ❌ OAuth tokens in code
- ❌ Private keys in code

**Allowed:**
- ✅ Load from environment variables (.env)
- ✅ Load from AWS Secrets Manager
- ✅ Load from secure vaults

**Check before committing:**
```bash
# Scan for secrets
git diff HEAD~1 | grep -E "password|token|secret|key|api"

# Use git-secrets tool
git secrets --scan
```

### Input validation

**All user input must be validated:**
- [ ] Required fields present
- [ ] Data types correct
- [ ] String length within limits
- [ ] Numbers within valid ranges
- [ ] Email format valid
- [ ] File uploads have size limits
- [ ] SQL/NoSQL injection prevented (Prisma prevents)

**Example:**
```typescript
// ❌ BAD - no validation
app.post('/users', (req, res) => {
  db.users.create(req.body);
});

// ✅ GOOD - validation
app.post('/users', async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
    age: z.number().min(13).max(120),
  });
  
  const validated = schema.parse(req.body);
  db.users.create(validated);
});
```

### Authentication & Authorization

**Every API endpoint must:**
- [ ] Verify user is authenticated (except public endpoints)
- [ ] Verify user has permission to access data
- [ ] Return 401 if not authenticated
- [ ] Return 403 if not authorized
- [ ] Log suspicious access attempts

**Example:**
```typescript
// ❌ BAD - no auth check
app.get('/users/:id', async (req, res) => {
  const user = await db.users.findUnique({ id: req.params.id });
  res.json(user);
});

// ✅ GOOD - auth check
app.get('/users/:id', [requireAuth], async (req, res) => {
  const user = await db.users.findUnique({ id: req.params.id });
  
  if (user.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  res.json(user);
});
```

### Error handling

**Never leak secrets in errors:**
```typescript
// ❌ BAD - exposes database structure
res.status(500).json({ error: err.message });

// ✅ GOOD - generic message
res.status(500).json({ 
  error: 'Something went wrong. Please try again.' 
});

// Log full error internally (Sentry)
Sentry.captureException(err);
```

---

## Part 7: Documentation Standards

### Code comments

**When to add comments:**
- [ ] Complex algorithm that isn't obvious
- [ ] Workaround for a specific bug
- [ ] Business logic that needs explanation
- [ ] Non-obvious reason for a decision

**Don't comment:**
- ❌ What the code does (should be obvious from names)
- ❌ Basic operations (x = 5 means x = 5)
- ❌ Lines you're about to delete

**Good comment example:**
```typescript
// Users are sorted by score DESC then by created_at ASC
// to show highest-scored recent reviews first
const reviews = await db.reviews.findMany({
  orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
});
```

### Function documentation

**All exported functions need JSDoc:**

```typescript
/**
 * Calculate shoe size based on measurements.
 * @param footLength - Length in mm (required)
 * @param footWidth - Width in mm (required)
 * @returns Size as string (e.g., "US 10", "EU 44")
 * @throws SizeError if measurements are invalid
 * @example
 * const size = calculateShoeSize(260, 105);
 * // Returns "US 10"
 */
export function calculateShoeSize(
  footLength: number,
  footWidth: number
): string {
  // implementation
}
```

### Type documentation

**All complex types need description:**

```typescript
/**
 * Represents a shoe product with pricing and availability.
 * Used across search results, details pages, and checkout.
 */
interface Shoe {
  id: string;
  name: string;
  /** Shoe size in format "US 10", "EU 44", etc. */
  size: string;
  /** Price in cents (e.g., 9999 = $99.99) */
  priceInCents: number;
  /** True if in stock and available for purchase */
  inStock: boolean;
}
```

---

## Part 8: Git & Commit Standards

### Commit messages

**Format:**
```
[type]: Short description under 50 characters

Longer explanation if needed. Explain WHY, not WHAT.
Reference related issues: fixes #123, relates to #456
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `perf:` Performance improvement
- `refactor:` Code restructuring (no behavior change)
- `test:` Test additions or fixes
- `docs:` Documentation
- `style:` Code style (formatting, not logic)
- `chore:` Dependencies, build, tooling

**Good commit messages:**
```
feat: Add shoe size calculator with ML predictions

Implements new Prisma model for ShoeSize with unit tests.
Integrates Python microservice for size predictions based on
foot measurements. Adds validation for all user inputs.

Closes #234
```

**Bad commit messages:**
- ❌ "fixes stuff"
- ❌ "wip"
- ❌ "asdf"
- ❌ "update" (update what?)

### Branch naming

**Format:** `[type]/[feature-name]`

Examples:
- `feat/shoe-size-calculator`
- `fix/login-redirect-bug`
- `perf/reduce-bundle-size`

**Never:**
- ❌ Commit directly to main
- ❌ Use branches like "dev", "test", "tmp"
- ❌ Leave branches undeleted after merge

---

## Part 9: Release & Deployment

### Pre-deployment checklist

Before pushing to main (which auto-deploys):

- [ ] All tests pass locally
- [ ] No console errors or warnings
- [ ] Performance metrics acceptable
- [ ] Security audit passes
- [ ] Code review approved
- [ ] Commit message clear
- [ ] Related issues linked
- [ ] Documentation updated
- [ ] Version number bumped (if releasing)

### Breaking changes

**If your change breaks existing API or data model:**

- [ ] Update API version (v1 → v2)
- [ ] Create migration script if needed
- [ ] Document breaking change in CHANGELOG
- [ ] Notify team before merging
- [ ] Update client code simultaneously

### Rollback procedures

**If something breaks in production:**

```bash
# Revert most recent commit
git revert HEAD --no-edit

# Or revert specific commit
git revert [commit-hash] --no-edit

# Push to revert (auto-deploys)
git push origin main
```

---

## Part 10: Monitoring & Alerts

### What we monitor

**Sentry (Error Tracking):**
- App crashes and exceptions
- Unhandled promise rejections
- Type errors in production
- Alert threshold: >5 new errors in 1 hour

**Firebase Analytics:**
- User sessions and retention
- Feature usage patterns
- Crash rate by version
- Alert threshold: crash rate >1%

**Custom Metrics:**
- API response times (Sentry APM)
- Database query times
- Download counts and growth
- Feature adoption rate

### When to escalate

**Alert thresholds:**

| Metric | Alert Level | Action |
|--------|-------------|--------|
| App crash rate >1% | 🔴 Critical | Stop deployment, investigate |
| API response time >500ms | 🟡 Warning | Investigate, may need optimization |
| Unknown error spike | 🟡 Warning | Check recent changes, may rollback |
| Database connection errors | 🔴 Critical | Check database health, escalate to DevOps |

---

## Success Indicators

**We're maintaining quality when:**

✅ <0.5% crash rate (measured daily)  
✅ 80%+ test coverage (line coverage)  
✅ All PRs reviewed before merge  
✅ Code review average <4 hours  
✅ API response times <200ms  
✅ Zero security vulnerabilities found  
✅ Master branch deployable at all times  
✅ Release goes out without emergency patches  

---

## Enforcement

**This is not a suggestion.** These standards are:

- ✅ Enforced by automated CI/CD checks
- ✅ Required for code review approval
- ✅ Monitored with metrics dashboards
- ✅ Part of engineering excellence

**Violations lead to:**
1. PR blocked by CI (can't merge)
2. Discussion with code reviewer (learning opportunity)
3. Repeated violations → team discussion

---

## Questions & Clarifications

**"What if I have a good reason to skip a test?"**  
You don't. Tests catch bugs. Always write tests first (TDD).

**"What if code review is taking too long?"**  
Reach out to Tech Lead for faster review or pair programming.

**"What if I don't know how to write a test?"**  
Ask a teammate, look at existing tests as examples, pair program.

**"What about legacy code that doesn't meet standards?"**  
Improve it as you touch it. Don't need to refactor everything.

---

## Final Notes

These standards exist for one reason: **Ship with confidence.**

When code meets these standards:
- Users get fewer crashes
- We fix bugs faster
- Team works more efficiently
- Code is maintainable long-term
- We can hire and onboard faster

**Quality compounds. Better now = better later.**

---

**Standards Version:** 1.0  
**Adopted:** May 14, 2026  
**Owner:** Tech Lead / Engineering Lead  
**Review Cadence:** Monthly (adjust based on lessons learned)  
**Questions?** Ask [Tech Lead name]
