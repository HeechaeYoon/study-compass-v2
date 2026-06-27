# Security Policy

## Supported version

The `main` branch is the supported version for security fixes.

## Scope

Security-sensitive areas include:

- Student data privacy: answers, nickname, memo, result, prompt text, and saved local result.
- Static classroom access-code gate and admin-code verifier.
- Local browser storage validation and deletion.
- Clipboard fallback and image export flows.
- GitHub Pages deployment configuration.

The access-code system is a client-side classroom deterrent, not strong authentication. Please do not report "the static bundle can be inspected" as a vulnerability by itself unless it enables a new concrete risk beyond that documented limitation.

## Reporting a vulnerability

Please do not open a public issue containing exploit details or real student data.

Preferred reporting path:

1. Use GitHub private vulnerability reporting / Security Advisories for this repository if available.
2. If that is unavailable, contact the maintainer through the public GitHub profile and request a private channel.

When reporting, include:

- A minimal reproduction using synthetic data only.
- Browser and OS versions.
- Expected impact on student privacy, app integrity, or deployment safety.
- Suggested fix if you have one.

## Maintainer response target

- Acknowledge: within 7 days when possible.
- Triage severity: within 14 days when possible.
- Fix critical privacy or build/deploy issues as soon as practical.

## Student data handling

Never include real student answers, names, nicknames, memos, screenshots with personal information, or copied prompts in issues, pull requests, logs, or reports. Use fixture data from the test suite or synthetic examples.
