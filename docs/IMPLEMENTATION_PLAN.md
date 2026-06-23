# Implementation Plan

This is the required execution sequence. Codex must update `PLAN.md` with real status and evidence.

---

## Phase 0 — Preflight and repository safety

### Tasks

- Read all required docs.
- Run `git status`.
- Inspect package manager, build scripts, and current app.
- Confirm `reference/design-board.png` is readable.
- Confirm image input, `$imagegen`, browser, Playwright, and subagents are available.
- Identify uncommitted user work.
- Decide whether to replace the existing prototype in place or create a clean v2 structure before swapping.
- Create `docs/VISUAL_REVIEW_LOG.md`.
- Record baseline screenshot of the old implementation if it runs.

### Gate P0

Do not continue if:

- reference image cannot be accessed
- project files cannot be written
- destructive replacement would lose uncommitted work
- no browser can be used for visual verification

If `$imagegen` alone is unavailable, report the limitation before implementation because it affects the requested asset workflow.

---

## Phase 1 — Clean scaffold and domain data

### Tasks

- Establish React + Vite + TypeScript strict project.
- Set up CSS tokens and global styles.
- Add bundled Korean fonts.
- Add question, axis, and learning type data.
- Implement scoring, normalization, matching, growth-axis selection, result generation.
- Write unit tests before screen integration.
- Add fixture builders.

### Evidence

- `npm run typecheck`
- `npm run test`
- Unit tests for scoring and matching

### Gate P1

- No TypeScript errors
- All 5-axis bounds computed from data
- All 16 questions valid
- Deterministic type matching
- No React view code required for domain tests

---

## Phase 2 — Asset generation

### Tasks

- Invoke `$imagegen` explicitly.
- Generate at least three paper texture candidates.
- Generate at least three pencil candidates.
- Save prompts in `.prompts/IMAGEGEN_ASSETS.md`.
- Select and process assets.
- Create SVG doodle components in code.
- Create `generated-assets.json`.

### Gate P2

- Paper texture quiet at final opacity
- Pencil has no text, white box, or obstruction
- Asset sizes meet targets
- UI remains understandable with generated assets disabled

---

## Phase 3 — Static visual shells

Implement the four core screens using fixture data only.

### S1 Start

- Shared header
- Hero copy
- nickname input
- CTA
- 5-axis constellation
- privacy strip

### S2 Question

- progress
- Q06 fixture
- five cards
- selected D
- navigation

### S3 Result

- strategy designer fixture
- growth card
- custom radar
- three bottom cards

### S4 Prompt

- form
- tabs
- notebook preview
- copy button
- pencil

### Requirements

- No generic component-library defaults
- Use exact design tokens
- All four screens fit at 1280×800
- Add fixture query modes
- Create Playwright screenshot tests

### Gate P3 — Macro fidelity

Before implementing full behavior:

- Capture all four screens.
- Compare with references.
- Correct:
  - overall proportions
  - columns
  - vertical rhythm
  - card sizes
  - header density
  - major colors
- Visual reviewer score must reach at least 82/100 per screen before moving on.

Do not polish micro details before macro layout passes.

---

## Phase 4 — Functional integration

### Tasks

- Start flow
- nickname optional
- 16 questions
- previous/next
- answer persistence in state
- result generation
- detail report
- prompt inputs
- prompt generation
- memo auto-inclusion and prompt mode selector
- copy and fallback
- local save/load/delete
- image export
- reset
- confirmation modal
- toast/status messages
- narrow-screen guidance and responsive phone portrait support

### Gate P4

Full end-to-end browser flow passes:

```text
start → 16 answers → result → prompt → copy → save → reload saved → delete
```

No network request carries student data.

---

## Phase 5 — Visual refinement

Perform at least three explicit passes.

### Pass A — Typography and spacing

- font selection
- Korean line wrapping
- heading size
- body line height
- input and button size
- card gaps
- whitespace balance

### Pass B — Color and surface

- ivory background
- paper texture opacity
- indigo hue
- border warmth
- shadows
- selected-card fill
- yellow/mint/coral accents

### Pass C — Detail and composition

- doodle positions
- underline shapes
- connector lines
- check indicator
- progress pencil doodle
- radar labels
- notebook binding
- pencil scale and angle

After each pass:

- capture screenshots
- create diffs
- write findings and changes in `docs/VISUAL_REVIEW_LOG.md`

### Gate P5 — Final fidelity

Each screen:

- reviewer ≥90/100
- no category below minimum
- automated comparison advisory threshold satisfied
- no obvious generic UI artifacts

---

## Phase 6 — Accessibility, robustness, performance

### Tasks

- native radio semantics
- field labels
- keyboard navigation
- focus visibility
- modal focus handling
- screen-reader progress
- radar summary
- `aria-live`
- reduced motion
- localStorage failure handling
- clipboard failure handling
- export failure handling
- 1024, 1366, 1440, 1920 smoke tests
- asset and bundle size check

### Gate P6

Accessibility/performance reviewer has no critical or high-severity findings.

---

## Phase 7 — Independent review

Explicitly spawn and wait for three subagents.

### Reviewer 1 — Visual fidelity

Prompt:

```text
Review the rendered app against reference/design-board.png.
Use docs/VISUAL_SPEC.md and docs/QA_ACCEPTANCE.md.
Score each core screen independently.
Focus on macro layout, typography, color, spacing, card geometry, paper texture, doodles, radar chart, and notebook composition.
Do not praise generally. List concrete mismatches with severity and exact suggested fixes.
Do not edit files.
```

### Reviewer 2 — Functional and privacy

Prompt:

```text
Review the implementation against PRD.md and docs/CONTENT_AND_SCORING.md.
Check questionnaire count and mapping, score bounds, type matching, ambiguous type logic, prompt generation, local save/delete, clipboard fallback, and network privacy.
Run tests where useful.
Report prioritized findings only.
Do not edit files.
```

### Reviewer 3 — Accessibility and performance

Prompt:

```text
Review the app for keyboard operation, form semantics, focus visibility, screen reader labels, contrast, reduced motion, wide-screen responsiveness, bundle/assets, browser risks, and GitHub Pages behavior.
Use docs/QA_ACCEPTANCE.md.
Report critical, high, medium, and low findings.
Do not edit files.
```

### Main agent tasks

- Consolidate findings.
- Fix critical, high, and relevant medium issues.
- Re-run tests and screenshots.
- Ask reviewers again if fixes materially change UI or logic.

### Gate P7

- No critical findings
- No unresolved high findings
- Visual score remains ≥90 after fixes
- Functional tests pass

---

## Phase 8 — Final verification and report

### Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run test:visual
npm run build
```

Run preview and final smoke test.

### Create `FINAL_REPORT.md`

Include:

- summary
- architecture
- screens implemented
- assets generated
- prompts saved
- tests and exact results
- viewport checks
- visual review scores
- network/privacy verification
- GitHub Pages deployment notes
- known residual limitations

### Completion rule

Do not claim “pixel perfect.” State actual evidence and residual differences honestly.

---

## Rollback and failure handling

### If old code is easier to patch than rebuild

Still follow the rebuild goal. Reuse only:

- valid domain data
- verified test utilities
- working GitHub workflow
- safe storage utilities

Do not preserve a poor visual component hierarchy merely to minimize diff size.

### If visual comparison stalls

Use this order:

1. Fix canvas and surface size
2. Fix column ratios
3. Fix typography
4. Fix card sizes
5. Fix color
6. Fix shadows
7. Fix decorative assets
8. Fix micro spacing

Do not compensate for wrong layout with arbitrary absolute positioning everywhere.

### If an imagegen asset fails

- Generate new candidates with a narrower prompt.
- Do not settle for an asset with text or background artifacts.
- Use CSS/SVG fallback while preserving the layout.
- Record the failure and mitigation.

### If image export is unstable

- Keep copy as primary.
- Show an accurate user message.
- Do not block release if all higher-priority functions pass.
