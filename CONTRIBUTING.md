# Contributing to DotMail

Thank you for your interest in contributing! Here is how to get started.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-handle>/dot-mail.git
   cd dot-mail
   bun install
   ```
3. **Create a branch** using the naming convention below
4. Make your changes, then open a Pull Request against `main`

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/add-export-csv` |
| Bug fix | `fix/<short-description>` | `fix/copy-button-ios` |
| Docs | `docs/<short-description>` | `docs/update-readme` |
| Chore | `chore/<short-description>` | `chore/update-deps` |

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short summary>

feat(generator): add bulk export to CSV
fix(copy): resolve clipboard error on iOS Safari
docs: improve quick start instructions
chore: upgrade Tailwind to v4.3
```

## Pull Request Checklist

- [ ] Branch is up-to-date with `main`
- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] `bun run test:e2e` passes (if e2e tests are affected)
- [ ] New features include relevant documentation updates
- [ ] No secrets, tokens, or personal data committed

## Code Style

- TypeScript strict mode — no `any` without justification
- Tailwind CSS for styling — avoid inline styles
- Components are small and single-responsibility
- Use the existing `useT()` hook for any user-facing strings (i18n-ready)

## Reporting Bugs

Open a [GitHub Issue](https://github.com/alfindigital/dot-mail/issues) with:
- Steps to reproduce
- Expected vs actual behaviour
- Browser / OS / device

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
