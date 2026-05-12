# Contributing to SOLEINTEL

Thank you for your interest in contributing to SOLEINTEL! We welcome contributions of all kinds.

## Code of Conduct

We're committed to providing a welcoming and inspiring community. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Git
- Docker (recommended)

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/soleintel.git
cd soleintel

# Add upstream remote
git remote add upstream https://github.com/soleintel/soleintel.git

# Install dependencies
pnpm install

# Create development environment file
cp .env.example .env.local

# Start services
docker-compose up -d
```

## Development Guidelines

### Code Style

We follow strict TypeScript and code quality standards:

```typescript
// ✅ Good
interface Product {
  id: string;
  title: string;
  price: number;
  retailer: string;
}

function calculateMarkup(retail: number, wholesale: number): number {
  return ((retail - wholesale) / wholesale) * 100;
}

// ❌ Bad
function calc(r: any, w: any) {
  // Calculate markup
  return ((r - w) / w) * 100;
}
```

### Best Practices

1. **Type Safety**
   - Use strict TypeScript (`noImplicitAny: true`)
   - Avoid `any` type
   - Use discriminated unions instead of enums

2. **Error Handling**
   - Use Zod for validation
   - Handle all promise rejections
   - Provide helpful error messages

3. **Testing**
   - Write tests before code (TDD)
   - Aim for >80% coverage
   - Test edge cases
   - Use meaningful test names

4. **Comments**
   - No obvious comments
   - Explain WHY, not WHAT
   - Keep comments up-to-date

5. **Performance**
   - Minimize bundle size
   - Optimize database queries
   - Use caching strategically
   - Profile before optimizing

## Making Changes

### Branch Naming

```
feat/feature-name        # New feature
fix/bug-description      # Bug fix
docs/doc-title          # Documentation
test/test-description   # Tests
refactor/change-name    # Refactoring
chore/maintenance-task  # Chores
```

### Commit Messages

Follow conventional commits:

```
feat(extension): add price comparison modal
fix(api): handle null SKU in search
docs(readme): update installation steps
test(matching): add similarity tests
refactor(db): optimize product queries
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feat/amazing-feature
   ```

2. **Make Changes**
   - Keep commits atomic and logical
   - Add tests for new functionality
   - Update documentation

3. **Test Locally**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test
   pnpm build
   ```

4. **Push and Create PR**
   ```bash
   git push origin feat/amazing-feature
   ```
   
   In your PR description, include:
   - What problem does this solve?
   - How does it work?
   - Any breaking changes?
   - Testing instructions

5. **Code Review**
   - Address feedback promptly
   - Keep the conversation respectful
   - Ask questions if unclear

6. **Merge**
   - Ensure all checks pass
   - At least one approval required
   - Use "Squash and merge" for clean history

## Types of Contributions

### 🐛 Bug Reports

Report bugs by opening an issue with:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

### ✨ Features

Suggest features by opening an issue with:
- Use case/motivation
- Proposed solution
- Alternatives considered
- Potential impact

### 📚 Documentation

Improve docs by:
- Fixing typos or clarity
- Adding examples
- Improving API documentation
- Writing tutorials

### 🧪 Tests

Help improve coverage by:
- Adding unit tests
- Adding integration tests
- Testing edge cases
- Writing E2E tests

### 🔧 Code

Fix bugs or implement features:
- Check existing issues/PRs first
- Comment on issue before starting
- Keep scope focused
- Include tests with code

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific package
pnpm test --filter=@soleintel/api

# Watch mode
pnpm test -- --watch

# Coverage report
pnpm test -- --coverage
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { MatchingEngine } from './MatchingEngine';

describe('MatchingEngine', () => {
  it('should find exact SKU match', () => {
    const engine = new MatchingEngine();
    const product = { sku: 'ABC123', title: 'Shoe', brand: 'Nike' };
    const candidates = [
      { sku: 'ABC123', title: 'Nike Shoe', brand: 'Nike' },
    ];

    const results = engine.findMatches(product, candidates);

    expect(results[0].confidenceScore).toBeGreaterThan(0.9);
    expect(results[0].matchType).toBe('sku');
  });
});
```

## Documentation

### Writing Docs

- Use clear, simple language
- Include examples
- Keep consistent formatting
- Add Table of Contents for long docs

### Documentation Structure

```markdown
# Title

## Overview
Brief description of the topic

## Getting Started
How to get started

## Examples
Code examples

## Advanced Usage
For experienced users

## Troubleshooting
Common issues and solutions

## See Also
Related topics
```

## Performance Considerations

When contributing, keep these in mind:

### Extension
- Keep size < 5MB
- Load time < 200ms
- API calls < 100ms
- Cache aggressively

### API
- Query time < 100ms
- Response payload < 1MB
- Cache hit rate > 80%
- Pagination for large results

### Database
- Query time < 50ms
- Index hot columns
- Archive old data
- Vacuum regularly

## Release Process

1. **Version Bump** (maintainers)
   - Update version in package.json
   - Update CHANGELOG.md

2. **Build & Test**
   - Run full test suite
   - Build for all platforms
   - Create draft release notes

3. **Tag Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Deploy**
   - Automatic via GitHub Actions
   - Monitor error rates
   - Rollback if needed

## Getting Help

- 📖 Check [documentation](docs/)
- 💬 Join [Discord](https://discord.gg/soleintel)
- 📧 Email hello@soleintel.dev
- 🐛 Search [GitHub Issues](https://github.com/soleintel/soleintel/issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Community highlights

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Fastify Guide](https://www.fastify.io/)
- [Vitest Documentation](https://vitest.dev)
- [GitHub Guides](https://guides.github.com/)

---

**Thank you for contributing to SOLEINTEL! 🚀**
