# Contributing Guide

Thank you for contributing to Trip Pilot! This guide covers our conventions for branches, commits, pull requests, code style, and testing.

## Branch Naming

Use the following branch name format:

```
<type>/<short-description>
```

**Types:**
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation only
- `refactor/` — Code restructuring without behavior change
- `test/` — Test additions or fixes
- `chore/` — Maintenance, tooling, dependencies
- `ci/` — CI/CD changes

**Examples:**
- `feat/add-flight-search`
- `fix/itinerary-date-parsing`
- `docs/update-api-reference`

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `perf`, `build`

**Scope:** Optional, identifies the affected module (e.g., `api`, `ui`, `db`)

**Subject:** Imperative mood, lowercase, no period, max 72 chars

**Examples:**
```
feat(api): add flight search endpoint

fix(ui): resolve date picker timezone bug

docs: update contributing guide

refactor(db): extract repository pattern
```

## Pull Request Process

1. **Create from `develop`** — Base all PRs against the `develop` branch
2. **Link an issue** — Reference the related issue in the PR description
3. **Pass CI** — All checks must pass (lint, typecheck, tests)
4. **Require review** — At least one approval from a maintainer
5. **Squash merge** — Use "Squash and merge" to keep history clean
6. **Delete branch** — Remove the feature branch after merge

**PR Title:** Match the commit message format (will become the squash commit)

**PR Description Template:**
```markdown
## Summary
Brief description of changes

## Related Issue
Closes #<issue-number>

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Manual verification steps (if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or documented)
```

## Code Style

### TypeScript
- **Strict mode** enabled — no `any`, prefer explicit types
- **No implicit any** — always annotate when inference fails
- **Prefer `interface` over `type`** for object shapes
- **Use `const` by default**, `let` only when reassignment needed
- **Avoid enums** — use union types or `as const` objects
- **Organize imports:** external → internal → relative, alphabetized within groups

### ESLint
- Run `npm run lint` before committing
- Fix auto-fixable issues with `npm run lint:fix`
- No disabled rules without justification comment

### Prettier
- Run `npm run format` before committing
- Configuration in `.prettierrc` (single quotes, trailing commas, 100 char line width)

### General
- One export per file (default export for main, named for utilities)
- Colocate tests with source (`*.test.ts` next to `*.ts`)
- Descriptive names: `calculateTotalPrice` not `calc`
- Early returns over nested conditionals

## Test Requirements

- **Unit tests** for all public functions and business logic
- **Integration tests** for API routes and external service clients
- **Coverage target:** ≥ 80% statements, branches, functions, lines
- **Run tests:** `npm test` (watch: `npm run test:watch`)
- **Test naming:** `describe('functionName', () => { it('should ...', () => { ... }) })`
- **Use Vitest** — built-in mocking, TypeScript support
- **Mock external dependencies** — no real network calls in unit tests

## Development Workflow

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run all checks
npm run lint
npm run typecheck
npm test

# Format code
npm run format
```

## Questions?

Open a discussion or ask in the PR. Maintainers are happy to help.