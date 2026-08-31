# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| latest `main` | ✅ |

## Reporting a Vulnerability

**Please do not open a public GitHub Issue for security vulnerabilities.**

If you discover a security vulnerability, please report it responsibly:

1. **Email**: Open a [GitHub Security Advisory](https://github.com/alfindigital/dot-mail/security/advisories/new) (preferred)
2. **Scope**: Include a description of the vulnerability, steps to reproduce, and potential impact
3. **Response time**: We aim to acknowledge reports within 48 hours and provide a fix within 14 days for critical issues

## Scope

The following are **in scope**:
- Cross-site scripting (XSS) in the generator or results components
- Privacy leaks — any mechanism that could send user input to a third-party server
- Dependency vulnerabilities with a CVSS score ≥ 7.0

The following are **out of scope**:
- Self-hosted deployments with custom configurations
- Denial-of-service against a specific deployment
- Social engineering

## Security Design Notes

- **No backend** — all Gmail dot-trick computation happens in the browser
- **No accounts or authentication** — no user data is stored server-side
- **localStorage only** — history is stored locally in your browser, never sent anywhere
- **Analytics opt-in** — GA4 is only loaded when `VITE_GA4_ID` is set at build time
