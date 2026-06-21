# PLAN

> Updated by Codex with real progress, commands, evidence, and blockers.

## 0. Preflight

- [x] Read `AGENTS.md`, `START_HERE.md`, and all required specs in order.
- [x] Inspected `reference/design-board.png` as the primary visual source.
- [x] Ran `git status --short`; repository contents were untracked package/spec/app files, with no existing app source to preserve.
- [x] Confirmed npm stack: Node v24.16.0, npm 11.13.0.
- [x] Confirmed `$imagegen` availability through the built-in image tool and imagegen skill.
- [x] Confirmed Playwright fallback path; Browser plugin was not available.
- [x] Confirmed subagent tools through `tool_search`.

## 1. Project Scaffold

- [x] React 19 + Vite + TypeScript strict project created.
- [x] CSS token system, custom CSS, and local font dependencies added.
- [x] Scripts added: `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:e2e`, `test:e2e:webkit`, `test:visual`, `visual:compare`, `assets:process`.
- [x] GitHub Pages-safe `base: "./"` configured.
- [x] Deterministic fixture mode added for visual capture.
- [x] README and GitHub Pages workflow added.

## 2. Domain Implementation

- [x] 5 axes modeled as typed data.
- [x] 16 questions implemented: 12 Likert, 4 scenario; Q06 has 5 cards.
- [x] Scoring derives bounds from question data and normalizes to 0-100.
- [x] Labels use `강점`, `균형`, `성장 포인트`.
- [x] Type matching ranks nearest profiles first, then applies foundation/balanced guardrails so those types appear only when their score patterns actually fit.
- [x] Result summary, detailed report, growth axes, prompt builder, and safety copy implemented.
- [x] Storage validation rejects malformed saved result data before React state load.

## 3. ImageGen Assets

- [x] Generated 3 paper texture candidates with `$imagegen`.
- [x] Generated 3 pencil candidates with `$imagegen`.
- [x] Generated 3 approved `학습 지도 콜라주` start-hero candidates with `$imagegen`.
- [x] Generated 3 borderless start-hero candidates with `$imagegen` to remove the pasted-frame feeling.
- [x] Selected candidate C for paper, pencil, and start-hero assets.
- [x] Selected user-confirmed borderless hero candidate A for the current start hero.
- [x] Processed assets with `scripts/process-generated-assets.mjs`.
- [x] Prompt log and rationale recorded in `.prompts/IMAGEGEN_ASSETS.md`.
- [x] Final local assets:
  - `public/assets/paper-texture.webp` 666 bytes
  - `public/assets/pencil-transparent.webp` 28,932 bytes
  - `public/assets/start-hero-map.webp` 86,168 bytes
  - `public/assets/start-hero-map-v2.webp` 38,224 bytes

## 4. Screens And Functionality

- [x] Header removes the unclear `5가지 학습 축` label and keeps only `총 16문항`, `약 5~7분 소요`.
- [x] Start screen with safety disclaimer, optional nickname, saved-result state, privacy strip, and generated local learning-map hero artwork.
- [x] Start screen removes the arbitrary HTML 5-axis card constellation; saved-result card remains stable in narrow horizontal space.
- [x] Start hero uses the user-confirmed borderless learning-map image version with reduced left spacing between the copy and artwork.
- [x] Question screen with native radios, progress, pointer-only auto-advance after new selections, keyboard/reduced-motion manual pacing, previous/next fallback, browser Back support, and deterministic Q06 fixture.
- [x] Question screen adds a visible `처음으로` button so students can return to the start screen and enter a missed nickname.
- [x] Question screen removes the ambiguous green arrow and uses a non-directional `study-spark` doodle that does not steer layout.
- [x] Result screen with custom SVG radar chart, no misleading radar caption/legend, conditional summary cards, current-response type summary, detail-screen navigation, copy, save, export, and reset.
- [x] Dedicated detail report screen rebuilt as a student-facing learning map with clear headline, safety note, snapshot, mission, 5-axis cards, recommendations, cautions, and avoid-methods.
- [x] Prompt screen removes tabs and the unclear strategy-guide tab; it keeps live-updating inputs, preview, result navigation, copy success state, copy fallback, save/delete/export, and local pencil asset.
- [x] Prompt screen removes the hidden lower `상세 리포트 복사` floating button from the notebook area.
- [x] Wide-only guidance for phone portrait and extremely narrow screens; compact landscape support for 560–899px phone viewports.
- [x] No backend, login, analytics, tracking, external AI call, or runtime external font request.
- [x] Export uses a dedicated hidden summary card that includes growth point, conditional strength/balance labels, recommended strategies, and excludes free-form prompt inputs/memo.
- [x] Toast messages auto-dismiss after 3 seconds and ignore stale timers.

## 5. Visual Validation

Final automated metrics from `npm run test:visual`:

| Screen | Reviewer score | SSIM | Mismatch | Status |
|---|---:|---:|---:|---|
| Start | 91 | 0.4208 | 0.1049 | Pass |
| Question | 91 | 0.4863 | 0.0810 | Pass |
| Result | 91 | 0.4969 | 0.0875 | Pass |
| Prompt | 91 | 0.3257 | 0.1067 | Pass |

Notes:

- SSIM is below advisory thresholds because the source is a scaled annotated montage. Pixel mismatch ratios are within the advisory 22% cap.
- Final evidence paths are under `artifacts/visual/`.
- Latest UX refinement replaces the start-card flow with the generated learning-map artwork, switches the start hero to the user-corrected borderless candidate A with tighter left spacing, removes the question arrow, removes the radar caption, removes prompt tabs/guide, improves prompt copy feedback, refreshes the detail report, fixes export capture, and adds toast auto-dismiss.
- Detail report fixture capture added at `artifacts/visual/detail-1280x800.png`.

## 6. Accessibility And Robustness

- [x] Keyboard-reachable native controls.
- [x] Radio groups use fieldset/legend.
- [x] Inputs and prompt mode controls have labels.
- [x] Progress has accessible values.
- [x] Radar has text summary.
- [x] Toast uses live region.
- [x] Modal now traps focus, marks background inert, supports Escape, and restores focus.
- [x] Reduced-motion mode avoids smooth scroll.
- [x] Clipboard failure shows manual-copy modal.
- [x] Storage quota/unavailable/invalid schema handled.
- [x] Prompt preview is scrollable and keyboard focusable.

## 7. Independent Reviews

- [x] Visual reviewer: latest pass found guide-tab utility clipping. Fixed compact two-column guide cards and added canonical-surface fit coverage.
- [x] Functional/privacy reviewer: no blockers. Added coverage for re-clicked answers, memo deletion, localStorage deletion, and export exclusion of free-form prompt/memo inputs.
- [x] Accessibility/performance reviewer: fixed keyboard/reduced-motion manual pacing, screen-heading focus after navigation, and mounted hidden tab panels.
- [x] Second visual reviewer: fixed detail footer clipping at 1280x800 by moving copy/prompt actions into the detail header; also removed remaining non-visual `5가지 학습 축` wording.
- [x] Second functional/privacy reviewer: no blocking findings after export, toast, copy feedback, prompt-tab removal, storage, auto-advance, and detail fixture coverage.
- [x] Fast accessibility/performance reviewer: no blocking findings on focus handoff, copy feedback, reduced motion, radar labeling, decorative hero image treatment, or visible tests.
- [x] Learning-logic reviewers: fixed no-strength type-summary leakage, neutralized raw scenario-answer evidence, compressed detail report layout, and synced prompt visual spec.
- [x] Remaining environment blocker: optional WebKit smoke cannot run on this host because WebKit system libraries are missing and `install-deps` needs sudo authentication.

## 8. Final Commands

| Command | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test` | Pass, 5 files / 28 tests |
| `npm run logic:distribution` | Pass, all 8 types within 3-30% |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual` | Pass, 9 Chromium visual/viewport tests |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e` | Pass, 17 Chromium E2E tests |
| `npm run build` | Pass, production `dist/` generated |
| `npm run test:e2e:webkit` | Blocked by host missing WebKit libraries |

## 9. Final Delivery

- [x] `README.md`
- [x] `.github/workflows/deploy-pages.yml`
- [x] Rechecked GitHub Pages deployment setup on 2026-06-20: `base: "./"` is present, Pages workflow targets `main`, workflow uses Node 24 and `npm ci`, and README documents `Settings > Pages > Source > GitHub Actions`.
- [x] `.prompts/IMAGEGEN_ASSETS.md`
- [x] `docs/VISUAL_REVIEW_LOG.md`
- [x] `FINAL_REPORT.md`
- [x] Local privacy scan: no `fetch`, XHR, beacon, sockets, analytics, external URLs, or console logging in app source.
- [x] Preview smoke: local preview returned production HTML with relative asset URLs.

## 10. Learning Logic Quality Pass

- [x] Reviewed the audit-driven improvement plan against current source, PRD, scoring/content spec, QA criteria, and code review rules.
- [x] Rebalance learning-type matching so all 8 profiles are reachable and `strategy_designer` is no longer hidden by the balanced special rule.
- [x] Rewrite scenario options toward recent observable study behavior while preserving 16 questions, 12 Likert, and 4 scenario items.
- [x] Make result summary cards conditional so `강점` and `균형` wording matches actual axis labels.
- [x] Add answer-grounded evidence to detailed report and AI prompt while keeping type content as a secondary strategy bundle.
- [x] Replace raw scenario-answer quotations with neutral evidence summaries and keep no-strength type summaries free of `강점` wording.
- [x] Add result-screen and prompt-screen safety/privacy copy near the relevant actions.
- [x] Add distribution, matching-anchor, report-copy, and prompt-safety tests.
- [x] Run validation commands and record results: `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build`, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual` passed.

## 11. Learning Logic Distribution Calibration

- [x] Added reusable response-space distribution helper and `npm run logic:distribution`.
- [x] Replaced hidden test-only DP distribution code with the shared helper.
- [x] Reworked primary type selection into a ranked guardrail loop.
- [x] Recalibrated `strategy_designer` and `balanced_coordinator` profiles so all 8 types clear the response-space floor.
- [x] Kept the 16-question structure unchanged; Q13/Q15/Q16 score edits were not needed after profile and guardrail calibration.
- [x] Recorded the exact distribution from `npm run logic:distribution`: `strategy_designer` 22.85%, `execution_driver` 19.00%, `concept_explorer` 17.57%, `resource_user` 14.10%, `foundation_builder` 9.62%, `reflection_grower` 7.80%, `routine_stabilizer` 6.04%, `balanced_coordinator` 3.03%.
- [x] Added regression expectations: every type >=3%, every type <=30%, `foundation_builder` <=30%, `balanced_coordinator` <=22%, and `strategy_designer` >=3%.

## 12. Prompt Generator Upgrade

- [x] Added `IMPLEMENTATION_NOTES.md` as the subtask progress and resume ledger.
- [x] Replaced the single AI prompt with four modes: `공부 계획`, `개념 학습`, `계획 이미지`, `개념 이미지`.
- [x] Added full 16-question answer context to generated prompts.
- [x] Removed the memo inclusion checkbox; non-empty memo text is included automatically in prompts.
- [x] Added image-generation prompt modes for Gemini/ChatGPT infographic use without calling external AI from the app.
- [x] Migrated saved results to schema version 2 while preserving a v1 load migration.
- [x] Updated unit, E2E, visual, PRD, content, technical, visual, QA, and final-report docs for the new prompt behavior.
- [x] Final validation: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual` passed.
