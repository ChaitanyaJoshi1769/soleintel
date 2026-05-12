# SOLEINTEL Git Workflow Guide

This guide explains how to maintain and update the SOLEINTEL GitHub repository as development progresses.

---

## 📋 Quick Reference

```bash
# Check status
git status

# See recent commits
git log --oneline -10

# Create a feature branch
git checkout -b feat/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "feat: Brief description of changes"

# Push to GitHub
git push origin feat/feature-name

# Create pull request (via GitHub UI or gh CLI)
gh pr create --title "Brief title" --body "Description"

# Merge (after approval)
git checkout main
git pull origin main
git merge feat/feature-name
git push origin main
```

---

## 🔄 Development Workflow

### 1. Creating a Feature Branch

```bash
# For new features
git checkout -b feat/add-amazon-scraper

# For bug fixes
git checkout -b fix/product-detection-bug

# For documentation
git checkout -b docs/update-api-guide
```

**Branch naming convention:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Refactoring
- `chore/` - Maintenance

---

### 2. Making Commits

```bash
# View what changed
git diff

# Stage specific files
git add apps/api/src/index.ts
git add packages/matching-engine/src/

# Or stage all
git add .

# Commit with clear message
git commit -m "feat: Add Amazon scraper with price extraction

- Implement BaseScraper for Amazon
- Add price and image extraction
- Handle out-of-stock products
- Add tests for Amazon scraper"
```

**Commit message format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Refactoring
- `perf:` - Performance
- `chore:` - Maintenance

**Example:**
```
feat: Add watchlist price alerts

- Create PriceAlert table in database
- Implement email notification system
- Add hourly price checking job
- Handle subscription tiers

Fixes #42
```

---

### 3. Pushing Changes

```bash
# Push to your feature branch
git push origin feat/add-amazon-scraper

# Or set up tracking automatically
git push -u origin feat/add-amazon-scraper
```

---

### 4. Creating Pull Requests

**Via GitHub UI:**
1. Push your branch
2. Go to GitHub repository
3. Click "New Pull Request"
4. Select your branch
5. Fill in title and description
6. Click "Create Pull Request"

**Via gh CLI:**
```bash
gh pr create --title "Add Amazon Scraper" \
  --body "Implements scraper for Amazon products with price extraction"
```

**PR Template** (auto-filled):
- Description of changes
- Related issues (Fixes #42)
- Type of change (feature, fix, etc.)
- Testing instructions
- Checklist

---

### 5. Code Review & Merging

**Getting feedback:**
```bash
# After PR created, request review from maintainer
gh pr review --comment "Please review when available"
```

**Responding to feedback:**
1. Make requested changes
2. Commit and push to same branch
3. PR auto-updates
4. Request re-review

**Merging:**
```bash
# After approval
gh pr merge feat/add-amazon-scraper --squash

# Or manually
git checkout main
git pull origin main
git merge feat/add-amazon-scraper
git push origin main
```

---

## 📅 Weekly Development Cycle

### Each Week, Follow This Pattern:

```bash
# Monday: Start week
git checkout main
git pull origin main

# Create feature branches for the week's tasks
git checkout -b feat/week-1-retailers
# ... work on retailers ...

# Wednesday: Mid-week commit
git add .
git commit -m "feat: Add Walmart scraper (Week 1, Day 3)"
git push origin feat/week-1-retailers

# Friday: End of week
# Finalize, create PR, request review
gh pr create --title "Week 1 Complete: Add 5 Retailers" \
  --body "- Added Amazon scraper
- Added Walmart scraper
- Added Nike scraper
- Added Adidas scraper
- Added Zappos scraper
- Expanded detection to 8 retailers"

# Next Monday: Merge and start Week 2
git checkout main
git pull origin main
gh pr merge feat/week-1-retailers
```

---

## 🎯 Commit Messages for Each Week

### Week 1: Foundation
```bash
git commit -m "feat: Add Amazon scraper implementation"
git commit -m "feat: Add Walmart product detection"
git commit -m "feat: Expand product detection to 8 retailers"
```

### Week 2: Features
```bash
git commit -m "feat: Add historical price tracking job"
git commit -m "feat: Implement watchlist price alerts"
git commit -m "feat: Add AI insights generation"
```

### Week 3: Production
```bash
git commit -m "infra: Configure Railway deployment"
git commit -m "docs: Add deployment guide for Railway"
git commit -m "infra: Set up Sentry error tracking"
```

### Week 4: Launch
```bash
git commit -m "feat: Add affiliate link generation"
git commit -m "feat: Implement subscription tiers"
git commit -m "docs: Add marketing website"
git commit -m "chore: Release v1.0.0 - Initial public launch"
```

---

## 🏷️ Tagging Releases

```bash
# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial launch"

# List tags
git tag -l

# Push tags to GitHub
git push origin v1.0.0
```

---

## 🔍 Useful Git Commands

```bash
# See what's changed since last push
git diff HEAD origin/main

# See commit history with graph
git log --oneline --graph --all

# See commits for a specific file
git log --oneline packages/matching-engine/src/MatchingEngine.ts

# See who changed what (blame)
git blame apps/api/src/index.ts

# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Undo last commit (discards changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop

# Create patch file
git format-patch origin/main

# View pending changes
git status -s
```

---

## 📊 Keeping the Repository Clean

### Before Each Push:

```bash
# Make sure you're on the right branch
git branch

# See what files changed
git status

# Review your changes before committing
git diff --staged

# Check commits before pushing
git log --oneline -5
```

### Regular Maintenance:

```bash
# Update from remote
git fetch origin
git pull origin main

# Clean up deleted remote branches locally
git remote prune origin

# List all branches (local & remote)
git branch -a

# Delete old local branches
git branch -d feat/old-feature
```

---

## 🚨 Troubleshooting

### Merge Conflict

```bash
# If there's a conflict when pulling
git pull origin main

# Fix conflicts in your editor
# Then stage and commit
git add .
git commit -m "fix: Resolve merge conflict"
git push origin feat/your-branch
```

### Accidental Commit to Main

```bash
# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Create proper feature branch
git checkout -b feat/proper-branch

# Commit properly
git add .
git commit -m "feat: Proper commit message"
git push origin feat/proper-branch
```

### Need to Update Branch with Latest Main

```bash
# Fetch latest
git fetch origin

# Rebase on main
git rebase origin/main

# If there are conflicts, fix them
# Then continue rebase
git rebase --continue

# Force push to your branch
git push origin feat/your-branch --force
```

---

## 📋 Pre-Push Checklist

Before pushing any code:

- [ ] Code compiles/runs without errors
- [ ] Tests pass: `pnpm test`
- [ ] Linting passes: `pnpm lint`
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] Meaningful commit message
- [ ] Related issue linked
- [ ] No debug console.logs left
- [ ] Appropriate file changes only

```bash
# Run pre-push checks
pnpm lint && pnpm type-check && pnpm test && git status
```

---

## 🤝 Contributing Guidelines

1. **Fork the repository** (if external contributor)
2. **Create feature branch** from `main`
3. **Make changes** following code standards
4. **Write/update tests**
5. **Update documentation**
6. **Commit with clear messages**
7. **Push to your branch**
8. **Create pull request**
9. **Respond to feedback**
10. **Merge after approval**

---

## 📞 Questions?

- Check existing issues: https://github.com/ChaitanyaJoshi1769/soleintel/issues
- Read CONTRIBUTING.md
- Open a discussion: https://github.com/ChaitanyaJoshi1769/soleintel/discussions

---

**Happy coding! 🚀**
