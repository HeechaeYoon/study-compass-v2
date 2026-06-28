# Contributing

Study Compass V2 is a privacy-first classroom web app for Korean middle-school self-directed-learning lessons. Contributions should protect students first, then improve learning value, maintainability, and visual fidelity.

## Good first contributions

- Browser compatibility fixes for Chromium, Edge, and Android Chromium-class tablets. Safari/WebKit checks are optional future compatibility work, not the current release gate.
- Accessibility improvements with clear before/after evidence.
- Test coverage for scoring, prompt generation, storage failure, copy fallback, and visual fixtures.
- Documentation that helps educators deploy or adapt the app safely.
- Local-only UI improvements that keep the paper-notebook design language.

## Non-negotiable rules

- Do not add a backend, analytics, tracking, login, database, or runtime external AI call.
- Do not send student answers, nickname, memo, result, or prompt text to any server.
- Do not add Google Fonts or other runtime third-party assets.
- Do not use rank, grade, deficiency, fixed-personality, or visual/auditory/kinesthetic learning-style wording.
- Keep scoring, result generation, prompt generation, storage, clipboard, and export logic outside React view components.
- Use custom CSS/SVG; do not replace the UI with a generic component-library look.

## Local setup

```bash
npm install
npm run dev
```

For production builds, provide both a private classroom-admin master code and an access-code revision string:

```bash
MASTER_CODE=your-private-master-code ACCESS_CODE_REVISION=your-private-revision npm run build
```

Production builds fail when either value is missing. Change `ACCESS_CODE_REVISION` before redeploying to invalidate previous classroom access codes. Do not commit real values.

## Verification before a pull request

Run the checks that match your change. For broad changes, run the full set:

```bash
npm run typecheck
npm run lint
npm run test
npm run logic:distribution
npm run test:e2e
npm run test:visual
MASTER_CODE=your-private-master-code ACCESS_CODE_REVISION=your-private-revision npm run build
MASTER_CODE=your-private-master-code ACCESS_CODE_REVISION=your-private-revision npm run privacy:scan
```

If the default preview port is busy, run a strict external preview and point Playwright at it:

```bash
MASTER_CODE=development-master-code ACCESS_CODE_REVISION=development-access-code-revision VITE_ENABLE_FIXTURES=true npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual
```

If an optional browser dependency is unavailable, note the exact blocker in the PR. WebKit/Safari is not required for the current Galaxy Tab / Android Chromium classroom target.

## Pull request checklist

- [ ] I did not add any network path for student data.
- [ ] I updated or added tests for changed behavior.
- [ ] I checked Korean copy for non-stigmatizing, current-response wording.
- [ ] I preserved GitHub Pages subpath compatibility.
- [ ] I updated docs when product behavior changed.
- [ ] I included screenshots or visual artifacts for UI changes.

## Branding and classroom ownership text

The source code is MIT licensed. The deployed classroom copy currently shows Daisy ownership text to discourage casual redistribution of a specific classroom link. Forks that adapt the project for another teacher or organization should replace classroom-specific branding and ownership copy in `src/data/ownership.ts`.

That file is the single source for:

- the subtle global ownership mark
- the low-opacity screen watermark
- the result-image footer

Clipboard text payloads intentionally do not append the ownership text, including detailed-report copy, AI prompt copy, and manual-copy fallback text. Preserve that behavior for forks.

## Educator pilot feedback

Use [`docs/PILOT_FEEDBACK_TEMPLATE.md`](docs/PILOT_FEEDBACK_TEMPLATE.md) for future classroom or educator pilot notes. Real teacher/student pilot validation is outside the current local verification scope. Pilot notes and GitHub issues must use aggregated observations, synthetic examples, or generalized wording only. Do not paste real student answers, nicknames, memos, screenshots with personal information, or copied prompts.
