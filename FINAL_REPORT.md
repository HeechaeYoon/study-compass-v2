# FINAL_REPORT

## 1. Summary

Rebuilt the app as a production-quality static React/Vite/TypeScript web app for a Korean middle-school self-directed-learning class.

- Primary visual target: `reference/design-board.png`
- Product status: complete static app with four core screens, detail report screen, generated local hero asset, and required flows
- Deployment status: production `dist/` builds locally; GitHub Pages workflow added
- Data policy: no backend, login, analytics, tracking, external AI call, or automatic save
- Learning-logic status: audit-driven scoring and report pass completed; all 8 learning types are reachable in the response space, `strategy_designer` is no longer hidden by the balanced rule, and result copy now uses neutral answer-grounded evidence.

## 2. Architecture

- Stack: React 19, Vite, TypeScript, Vitest, Playwright, plain CSS.
- Domain modules:
  - `src/data/*`: axes, questions, type content
  - `src/domain/*`: scoring, validation, matching, result generation, prompt generation
  - `src/infrastructure/*`: localStorage, clipboard, image export
  - `src/screens/*`: start, question, result, prompt
- State flow: `App` + reducer; browser history stores only screen and question index, not answers or nickname.
- Local-only behavior: result is stored in `localStorage` only when explicitly saved. Delete clears saved storage and visible session state.

## 3. Implemented Screens

- Start: visual intro, required safety disclaimer, optional nickname, saved-result reload/delete, privacy strip, and user-confirmed borderless generated learning-map hero artwork.
- Question: 16 questions, native radio cards, progress, pointer-only auto-advance after new selections, keyboard/reduced-motion manual pacing, previous/next fallback, browser Back preservation, Q06 5-card fixture.
- Result: current-response safety language, custom SVG radar without misleading visible caption, conditional type summary and strength/balance cards, detail report entry, copy/save/export/reset.
- Detail report: separate student-facing learning-map report with large title, current-response safety note, neutral answer-grounded evidence, strength/balance/growth snapshot, mission, 5-axis interpretation, strategy bundle, cautions, and avoid methods.
- AI prompt: prompt inputs, memo default off, no tabs, live-updating preview, answer evidence, external-AI privacy guidance, `실시간 갱신` state, copy success feedback, copy fallback, save/delete/export, and result-summary navigation.
- Wide-only: under 900px shows guidance instead of a compromised mobile redesign.

## 4. ImageGen Assets

| Asset | Prompt log | Candidate | Processing | Final size |
|---|---|---|---|---:|
| `public/assets/paper-texture.webp` | `.prompts/IMAGEGEN_ASSETS.md` | paper candidate C | 512 square, blended toward `#F7F4EE`, WebP q78 | 666 bytes |
| `public/assets/pencil-transparent.webp` | `.prompts/IMAGEGEN_ASSETS.md` | pencil candidate C | background removal, trim, padding, WebP alpha | 28,932 bytes |
| `public/assets/start-hero-map.webp` | `.prompts/IMAGEGEN_ASSETS.md` | hero-map candidate C | 1180px wide, WebP q84 | 86,168 bytes |
| `public/assets/start-hero-map-v2.webp` | `.prompts/IMAGEGEN_ASSETS.md` | borderless hero candidate A | cropped to central learning-map area, 1180px wide, light tone blend, WebP q86 | 38,224 bytes |

## 5. Visual Validation

| Screen | Reviewer score | SSIM | Pixel mismatch | Screenshot |
|---|---:|---:|---:|---|
| Start | 91 | 0.4116 | 0.1071 | `artifacts/visual/start-1280x800.png` |
| Question | 91 | 0.4637 | 0.0871 | `artifacts/visual/question-1280x800.png` |
| Result | 91 | 0.4948 | 0.0887 | `artifacts/visual/result-1280x800.png` |
| Prompt | 91 | 0.3057 | 0.1057 | `artifacts/visual/prompt-1280x800.png` |
| Detail | reviewed separately | n/a | n/a | `artifacts/visual/detail-1280x800.png` |

Residual differences:

```text
Not pixel-perfect. The reference is a scaled montage, and the product-required safety/action content creates some density differences. Start now uses the user-confirmed borderless generated learning-map asset instead of the earlier HTML card constellation, with tighter spacing between the copy and artwork. Prompt preview is scrollable real text; result actions are more explicit than the board crop to satisfy save/copy/export/detail requirements.
```

## 6. Functional Validation

- Questionnaire: 16 questions, 12 Likert, 4 scenario, Q06 5 options.
- Question UX: pointer/touch selecting a new answer auto-advances after a short delay; keyboard and reduced-motion users keep manual pacing; previous/browser-back restored answers do not auto-advance by themselves.
- Scoring: data-derived bounds, normalized 0-100, threshold labels, shared response-space distribution coverage.
- Type matching: typed profiles, ranked balanced/foundation guardrails, secondary-type threshold, all 8 types reachable, every type at least 3%, no type above 30%, and `foundation_builder` below the regression cap.
- Current response-space distribution from `npm run logic:distribution`: `strategy_designer` 22.85%, `execution_driver` 19.00%, `concept_explorer` 17.57%, `resource_user` 14.10%, `foundation_builder` 9.62%, `reflection_grower` 7.80%, `routine_stabilizer` 6.04%, `balanced_coordinator` 3.03%.
- Prompt: blank inputs work; subject/unit/goal/situation/difficulty/help update the preview live when set; memo excluded by default and included only when checked; external AI transfer and sensitive-information guidance are included.
- Copy: Clipboard API, `execCommand`, and manual-copy fallback. Prompt copy success changes the button to `복사됨` only after a confirmed copy path.
- Save/delete: explicit save only; malformed saved data rejected; delete clears storage and visible state.
- Image export: exports a dedicated result summary card including growth point, conditional strength/balance labels, and recommended strategies; excludes free-form memo and prompt inputs; PNG output is checked for non-empty content pixels.
- Toast: status messages auto-dismiss after 3 seconds and stale timers do not clear newer messages.
- Privacy: no app-level network path for answers, nickname, memo, result, or prompt.

## 7. Commands Run

| Command | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run test` | Pass, 5 files / 23 tests |
| `npm run logic:distribution` | Pass, all 8 types within 3-30% |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:visual` | Pass, 6 Chromium tests |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 npm run test:e2e` | Pass, 14 Chromium tests |
| `npm run build` | Pass |
| `npm run test:e2e:webkit` | Blocked: host missing WebKit system libraries |

## 8. Browser And Viewport Checks

| Browser | Viewport | Result | Notes |
|---|---:|---|---|
| Chromium | 1280x800 | Pass | start, question, result, prompt, detail fixture captures |
| Chromium | 1024x768 | Pass | smoke test |
| Chromium | 1366x768 | Pass | smoke test |
| Chromium | 1440x900 | Pass | smoke test |
| Chromium | 1920x1080 | Pass | smoke test |
| Chromium | 820x1180 | Pass | wide-only guidance |
| WebKit | 1280x800 | Blocked | missing `libgtk-4`, ICU, GStreamer, WebP, AVIF, and related host libraries |

## 9. Privacy Verification

- Static scan found no `fetch`, XHR, beacon, sockets, analytics, external URLs, or app console logging in runtime app source.
- E2E standard flow records no external HTTP requests.
- E2E confirms answer/nickname data is not placed in the URL.
- Fonts, generated images, and static assets are local to the app build.
- Memo defaults off for prompt generation and is only included after the checkbox is selected.

## 10. Independent Reviews

### Visual Reviewer

Initial prompt score was 87 due pencil obstruction and flatter notebook depth. Later UX cleanup replaced the unclear start HTML card constellation with the approved learning-map asset, removed the question arrow, removed radar caption/dots, removed prompt tabs/guide, strengthened the paper/pencil layering, and rebuilt the detail report as a student-facing learning-map screen. Final main score remains 91 for all four core screens.

Second review found the detail footer actions were pressed into the 1280×800 bottom edge and that `5가지 학습 축` remained in non-visual labels/copy. Fixed by moving detail actions into the header and rewording those surfaces to `학습 지도 결과` / `학습 축별 현재 모습`, then reran visual and E2E tests.

### Functional/Privacy Reviewer

Fixed exact balanced-rule divergence, deepened saved-result validation, removed low/high/comparison wording from runtime content, added start safety disclaimer, made delete clear current visible data, added browser Back support without storing student data in URL/history, fixed image export capture, added toast auto-dismiss, and added E2E coverage for memo deletion plus export exclusion of free-form inputs.

Second review found no blocking functional/privacy issues after the export, toast, copy, prompt-tab removal, local-storage, auto-advance, and detail fixture changes.

### Accessibility/Performance Reviewer

Fixed modal focus trap/restore and inert background, strengthened focus ring and muted contrast, removed the prompt tab model, respected reduced motion for questionnaire pacing and scroll, moved focus to each new screen heading after navigation, made prompt preview focusable/scrollable, kept the decorative hero image hidden from assistive tech, and reduced font import spread.

Second accessibility/performance pass was also checked against the final screens: the prompt screen keeps a focused screen heading after tab removal, copy feedback changes the button label and announces through the toast live region, new animations are covered by `prefers-reduced-motion`, the export card is `aria-hidden`, and the generated hero/pencil assets are local WebP files.

### Learning Logic Reviewers

Fixed reviewer findings from the audit-driven pass: no-strength results no longer reuse type summaries that say `강점`, scenario-answer evidence is summarized in neutral coaching language instead of quoting raw low-response options, the detail report layout was compressed so key sections remain visible in the 1280×800 capture, and the prompt visual spec now matches the live no-tab/privacy-warning UI.

Added a second distribution calibration pass: response-space counting is now a shared domain helper and `logic:distribution` script, primary matching uses a ranked guardrail loop, and type profiles were recalibrated so all 8 types meet the 3% response-space floor without changing the 16-question structure.

## 11. GitHub Pages

- Vite base: `./`
- Workflow: `.github/workflows/deploy-pages.yml`
- Workflow uses `npm ci`, Chromium Playwright install, typecheck, lint, unit, e2e, visual, and production build before upload.
- Deployed URL is not available locally; GitHub Pages must be enabled in repository Settings after pushing.

## 12. Known Limitations

- This is not a validated psychological instrument or psychometric test.
- Visual reproduction is close but not pixel-perfect because the reference is a montage, not a source design file.
- WebKit/Safari smoke could not run on this host due missing system dependencies requiring sudo-level install.
- Font assets remain the largest payload; runtime browsers should prefer WOFF2, and JS/CSS gzip sizes are small.
