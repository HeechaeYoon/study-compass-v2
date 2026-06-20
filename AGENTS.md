# AGENTS.md

## Mission

Build and finish a production-quality static web app for a Korean middle-school self-directed-learning class. Recreate the visual language in `reference/design-board.png` as closely as practical at a 1280×800 wide viewport while implementing the complete product described in `PRD.md`.

This is a rebuild, not a cosmetic patch of an old prototype.

## Read before editing

Read these files in order:

1. `PRD.md`
2. `docs/CODEX_SETUP.md`
3. `docs/DECISION_LOG.md`
4. `docs/VISUAL_SPEC.md`
5. `docs/DESIGN_SYSTEM.md`
6. `docs/CONTENT_AND_SCORING.md`
7. `docs/TECHNICAL_SPEC.md`
8. `docs/ASSET_GENERATION.md`
9. `docs/IMPLEMENTATION_PLAN.md`
10. `docs/QA_ACCEPTANCE.md`
11. `docs/CODE_REVIEW.md`
12. `PLAN.md`

Update `PLAN.md` as work progresses. Record important visual decisions in `docs/VISUAL_REVIEW_LOG.md`.

## Non-negotiable product rules

- This is not a personality or psychological test.
- Always say the result is based on the student's current responses.
- Never label a student as permanently fixed.
- Use `강점`, `균형`, `성장 포인트`; never use rank, grade, deficiency, or comparison.
- Do not use visual/auditory/kinesthetic learning-style classification.
- Do not send answers, results, nickname, or memo to any server.
- No backend, database, login, analytics, tracking, or external AI call.
- Use local browser storage only when the student explicitly saves.
- Memo inclusion in the AI prompt defaults to off.
- The app must still work when nickname, subject, unit, and goal are blank.

## Visual rules

- Treat `reference/design-board.png` as the primary visual source.
- Blue numbered corner labels in the board are design annotations and must not appear in production.
- Build interactive UI with HTML/CSS/React; never render entire screens as generated images.
- Explicitly invoke `$imagegen` for isolated decorative assets described in `docs/ASSET_GENERATION.md`.
- Save every asset prompt and selected output rationale under `.prompts/`.
- Use custom CSS and SVG. Do not ship a generic Material, Bootstrap, shadcn, or default Tailwind look.
- Use no large UI framework.
- Implement the radar chart as custom SVG.
- Use the canonical 1280×800 viewport as the primary visual target.
- Support wide viewports from 1024px to 1920px without stretching the design beyond its max width.
- Under 900px, show a landscape/wide-screen guidance view rather than a compromised mobile redesign.

## Engineering rules

- Preferred stack: React, Vite, TypeScript, plain CSS or CSS Modules, Vitest, Playwright.
- Keep scoring, result generation, prompt generation, storage, clipboard, and image export outside React view components.
- Store questions and type content as typed data, not hard-coded JSX branches.
- Avoid `any`.
- Prefer small, explicit pure functions.
- Keep dependencies minimal.
- All generated and static assets must be local to the built app.
- Ensure fonts are bundled through package dependencies or local project assets; do not depend on runtime Google Fonts loading.
- GitHub Pages deployment must work with repository subpaths.

## Safe rebuild protocol

1. Run `git status` and inspect the repository.
2. Do not destroy uncommitted user work.
3. If an old prototype exists, do not layer more CSS over it.
4. Preserve useful domain data only after validating it against the current spec.
5. Rebuild the screen architecture and design system cleanly.
6. Rely on Git history when available. If uncommitted legacy files would be overwritten, create a clearly named local backup before replacement.

## Required autonomous workflow

Do not stop after the first working implementation.

1. Inspect and plan.
2. Implement static visual shells for all four core screens.
3. Generate and integrate approved assets with `$imagegen`.
4. Capture the four screens with Playwright at 1280×800.
5. Compare against the reference board and iterate on macro layout.
6. Iterate on typography, spacing, colors, shadows, and decorative details.
7. Implement questionnaire, scoring, type matching, report, prompt, storage, copy, delete, and export.
8. Run unit, type, lint, build, and browser tests.
9. Explicitly spawn and wait for:
   - a visual-fidelity reviewer,
   - a functional/privacy reviewer,
   - an accessibility/performance reviewer.
10. Fix review findings.
11. Repeat visual capture and review until `docs/QA_ACCEPTANCE.md` passes.
12. Write `FINAL_REPORT.md`.

Ask the user only when an actual blocker makes the work impossible. Resolve normal implementation choices using `docs/DECISION_LOG.md`.

## Commands

Use the repository package manager if one is already established. For a new project, use npm.

Expected commands:

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:visual
npm run build
npm run preview
```

Add missing scripts when needed.

## Visual verification discipline

- Wait for `document.fonts.ready`.
- Disable animations during screenshots.
- Use deterministic fixture data.
- Capture each screen at 1280×800.
- Also smoke-test 1024×768, 1366×768, 1440×900, and 1920×1080.
- Compare reference and implementation side by side.
- Generate visual diff artifacts.
- Never declare visual completion based only on reading CSS.

## Definition of done

All must be true:

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:visual`, and `npm run build` pass.
- All four reference screens meet the visual rubric in `docs/QA_ACCEPTANCE.md`.
- No visual category scores below the minimum.
- All required functionality works in a real browser.
- No student data is transmitted.
- Local save and full deletion work.
- Copy has a fallback.
- The app contains the required safety language.
- The final diff has been reviewed under `docs/CODE_REVIEW.md`.
- `FINAL_REPORT.md` accurately lists what was implemented, tested, generated, and not guaranteed.
