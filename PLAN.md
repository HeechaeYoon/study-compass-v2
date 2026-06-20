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
- [x] Type matching implements foundation and balanced special rules before distance matching.
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
- [x] Question screen removes the ambiguous green arrow and uses a non-directional `study-spark` doodle that does not steer layout.
- [x] Result screen with custom SVG radar chart, no misleading radar caption/legend, summary cards, detail-screen navigation, copy, save, export, and reset.
- [x] Dedicated detail report screen rebuilt as a student-facing learning map with clear headline, safety note, snapshot, mission, 5-axis cards, recommendations, cautions, and avoid-methods.
- [x] Prompt screen removes tabs and the unclear strategy-guide tab; it keeps live-updating inputs, preview, result navigation, copy success state, copy fallback, save/delete/export, and local pencil asset.
- [x] Wide-only guidance under 900px.
- [x] No backend, login, analytics, tracking, external AI call, or runtime external font request.
- [x] Export uses a dedicated hidden summary card that includes growth point, 강점, 균형, 추천 전략 and excludes free-form prompt inputs/memo.
- [x] Toast messages auto-dismiss after 3 seconds and ignore stale timers.

## 5. Visual Validation

Final automated metrics from `npm run test:visual`:

| Screen | Reviewer score | SSIM | Mismatch | Status |
|---|---:|---:|---:|---|
| Start | 91 | 0.4116 | 0.1071 | Pass |
| Question | 91 | 0.4550 | 0.1097 | Pass |
| Result | 91 | 0.4496 | 0.1242 | Pass |
| Prompt | 91 | 0.3536 | 0.1327 | Pass |

Notes:

- SSIM is below advisory thresholds because the source is a scaled annotated montage. Pixel mismatch ratios are within the advisory 22% cap.
- Final evidence paths are under `artifacts/visual/`.
- Latest UX refinement replaces the start-card flow with the generated learning-map artwork, switches the start hero to the user-corrected borderless candidate A with tighter left spacing, removes the question arrow, removes the radar caption, removes prompt tabs/guide, improves prompt copy feedback, refreshes the detail report, fixes export capture, and adds toast auto-dismiss.
- Detail report fixture capture added at `artifacts/visual/detail-1280x800.png`.

## 6. Accessibility And Robustness

- [x] Keyboard-reachable native controls.
- [x] Radio groups use fieldset/legend.
- [x] Inputs and checkbox have labels.
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
- [x] Remaining environment blocker: optional WebKit smoke cannot run on this host because WebKit system libraries are missing and `install-deps` needs sudo authentication.

## 8. Final Commands

| Command | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test` | Pass, 19 unit tests |
| `npm run test:visual` | Pass, 6 Chromium visual/viewport tests |
| `npm run test:e2e` | Pass, 13 Chromium E2E tests |
| `npm run build` | Pass, production `dist/` generated |
| `npm run test:e2e:webkit` | Blocked by host missing WebKit libraries |

## 9. Final Delivery

- [x] `README.md`
- [x] `.github/workflows/deploy-pages.yml`
- [x] `.prompts/IMAGEGEN_ASSETS.md`
- [x] `docs/VISUAL_REVIEW_LOG.md`
- [x] `FINAL_REPORT.md`
- [x] Local privacy scan: no `fetch`, XHR, beacon, sockets, analytics, external URLs, or console logging in app source.
- [x] Preview smoke: local preview returned production HTML with relative asset URLs.
