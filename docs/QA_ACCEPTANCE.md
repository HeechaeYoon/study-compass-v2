# QA and Acceptance Criteria

## 1. Completion policy

The app is not complete when it merely builds or when the first screenshot looks “close enough.” It is complete only when visual, functional, privacy, accessibility, and deployment gates all pass.

Use this document as the source of truth for acceptance.

---

## 2. Canonical visual test setup

```text
Browser: Chromium
Viewport: 1280×800
Device scale factor: 1
Color scheme: light
Reduced motion: reduce
Locale: ko-KR
Timezone: Asia/Seoul
Animations: disabled
Fonts: await document.fonts.ready
```

Fixture routes:

- `/?fixture=start`
- `/?fixture=question`
- `/?fixture=result`
- `/?fixture=prompt`

Each fixture must be deterministic.

---

## 3. Reference comparison strategy

The reference is a montage rather than a direct full-page export. Compare in two layers.

### Layer A — shared header

- Compare implementation header with `reference/header-reference.png`.
- Focus on title, underline, divider, subtitle, metadata, star, baseline.

### Layer B — screen surface

- Capture `[data-testid="screen-surface"]` for each fixture.
- Compare with matching screen crop.
- Mask the blue numbered annotation area defined in `reference/manifest.json`.
- Resize the implementation capture to the reference crop dimensions for automated metrics.
- Save:
  - implementation image
  - reference image
  - overlay
  - diff heatmap
  - metric JSON

Automated comparison is a support tool, not the only acceptance signal.

---

## 4. Automated visual metrics

Recommended implementation:

- `sharp` for resize and mask
- `ssim.js` for structural similarity
- `pixelmatch` for difference image

Before metrics:

1. convert to sRGB
2. resize with Lanczos
3. apply masks
4. optionally apply 0.5–1px blur to both images to reduce antialiasing noise

### Advisory thresholds

Each surface:

- SSIM ≥ 0.80
- mismatched pixels ≤ 22% at a reasonable perceptual threshold

Header:

- SSIM ≥ 0.84

These numbers are advisory because the source is a scaled montage. Failing them requires investigation. Passing them does not override a poor human/agent visual review.

---

## 5. Visual review rubric

Each core screen is scored out of 100.

### A. Macro layout — 25

- shared canvas and surface scale
- column ratios
- vertical positioning
- card arrangement
- header relationship
- whitespace distribution

Minimum: 22/25

### B. Typography — 15

- title character
- hierarchy
- Korean line wrapping
- font weight
- body density
- readable alignment

Minimum: 13/15

### C. Color and surface — 15

- warm ivory background
- white paper surfaces
- indigo primary
- mint/yellow/coral accents
- border warmth
- paper texture subtlety

Minimum: 13/15

### D. Spacing and geometry — 10

- paddings
- gaps
- card dimensions
- radii
- button and input proportions

Minimum: 9/10

### E. Components and states — 15

- answer cards
- selected state
- progress
- radar chart
- fields
- notebook
- bottom cards

Minimum: 13/15

### F. Doodles and generated assets — 10

- underlines
- stars
- arrows
- connectors
- paper texture
- pencil

Minimum: 8/10

### G. Polish and consistency — 10

- no generic library feel
- no clipping
- balanced visual density
- consistent icon strokes
- coherent interaction states

Minimum: 9/10

### Pass

- Total ≥90/100 for each screen
- Every category meets its minimum
- No severe mismatch identified by reviewer

---

## 6. Screen-specific visual acceptance

### Start

- Shared header visually matches.
- Left hero begins near upper-left of surface.
- 5-axis cards form clear 2-over-3 constellation.
- Connector paths remain behind cards.
- CTA size and gradient match.
- Privacy strip spans bottom.
- No mockup number label.

### Question

- Count, bar, and remaining time align.
- Q06 fixture shows 5 cards.
- Selected D card has blue border, pale fill, and check circle.
- Heading is two lines at most.
- Navigation anchors bottom row.
- Card row uses full width and is not cramped.

### Result

- Left narrative and right radar have balanced weight.
- Type name is large and underlined in mint.
- Growth note is warm yellow.
- Radar grid, fill, point labels, and display scores align.
- Three bottom cards are equal and fit without truncation.

### Prompt

- Left form and right notebook maintain reference ratio.
- Tabs and active underline are accurate.
- Notebook has white page, pale blue backing, binding, shadow.
- Pencil is diagonal at right and does not obstruct.
- Prompt text remains readable and not overly dense.
- Copy button is visible.

---

## 7. Functional acceptance

### Start

- [ ] nickname empty allowed
- [ ] nickname displayed when entered
- [ ] start button enters Q1
- [ ] saved result appears when present
- [ ] saved result can be deleted

### Questionnaire

- [ ] exactly 16 questions
- [ ] exactly 12 Likert and 4 scenario questions
- [ ] Likert answers 1–4
- [ ] scenario options resolve by ID
- [ ] next disabled before answer
- [ ] previous preserves answer
- [ ] progress correct
- [ ] Q06 has 5 cards
- [ ] last answer creates result
- [ ] no reverse item

### Scoring

- [ ] bounds derived from question data
- [ ] normalized scores all 0–100
- [ ] labels at exact thresholds
- [ ] type matching ranks profiles first, then applies balanced/foundation guardrails only when the score pattern fits
- [ ] response-space distribution keeps every type at 3% or above and no single type above 30%
- [ ] primary type always set
- [ ] secondary type follows 0.03/5 rules
- [ ] strength axes deterministic
- [ ] growth axis deterministic
- [ ] display scores 1.0–5.0 when shown

### Result

- [ ] current-response language visible
- [ ] five axes visible
- [ ] strong and growth copy reflects result
- [ ] growth mission reflects primary growth axis
- [ ] detail report expands/collapses
- [ ] no fixed-personality wording
- [ ] no student comparison

### Prompt

- [ ] works with all inputs blank
- [ ] subject/unit/goal included when set
- [ ] situation/difficulty/help included when set
- [ ] memo included automatically when any text is entered
- [ ] all 16 question prompts and selected answers included
- [ ] four prompt modes available: study plan, concept learning, study-plan image, concept image
- [ ] 30–40 minute request included
- [ ] 3 self-check questions requested
- [ ] 2 follow-up questions requested
- [ ] middle-school language requested
- [ ] image prompts instruct not to render raw Q/A or private information

### Copy

- [ ] Clipboard API attempted from click
- [ ] fallback works
- [ ] manual-copy fallback shown if both fail
- [ ] success and failure announced

### Save/delete

- [ ] no automatic local save
- [ ] explicit save works
- [ ] saved result loads
- [ ] wrong schema handled
- [ ] delete confirmation appears
- [ ] delete removes result and memo
- [ ] localStorage failure does not break diagnosis

### Image export

- [ ] exports summary card
- [ ] excludes free-form memo
- [ ] waits for fonts/assets
- [ ] filename safe
- [ ] failure message accurate

---

## 8. Unit tests

Required test groups:

### Scoring bounds

- minimum answers
- maximum answers
- mixed answers
- scenario option contribution
- all axes remain in range

### Label thresholds

- 0
- 39
- 40
- 69
- 70
- 100

### Type matching

- strategy profile
- execution profile
- concept profile
- reflection profile
- resource profile
- balanced special rule
- foundation special rule
- response-space distribution regression
- secondary type threshold

### Growth axis

- clear minimum
- tied minima
- all axes ≥70
- type-specific priority

### Prompt

- empty optional inputs
- all inputs
- memo auto-include
- all question/answer context
- four prompt modes
- safety/current-response language

### Storage

- valid data
- null
- invalid JSON
- wrong schema
- quota/unavailable mock
- delete

---

## 9. End-to-end scenarios

### E2E-01 Standard

```text
start without nickname
→ answer all questions
→ see result
→ open prompt
→ enter subject/unit/goal
→ switch prompt modes
→ copy prompt
```

### E2E-02 Nickname and memo

```text
enter nickname
→ complete
→ write memo
→ confirm memo is included automatically
→ confirm no memo checkbox is shown
```

### E2E-03 Save and delete

```text
complete
→ save
→ reload page
→ view saved result
→ delete
→ reload
→ no saved result
```

### E2E-04 Clipboard failure

Mock Clipboard API failure and verify fallback.

### E2E-05 Storage failure

Mock localStorage exception and verify app remains usable.

### E2E-06 Responsive phone support

At 390×844 and 360×740 portrait, show the app and allow the core flow. At 359px portrait and below-560px landscape, show guidance and hide the full app. Portrait transitions into result, detail, and prompt should start at the top of the new screen. Core result/detail/prompt controls should remain at least 44px tall on the canonical tablet view and compact landscape view as well as portrait.

---

## 10. Privacy acceptance

Use browser network inspection during a full flow.

Pass only when:

- no answers in URL
- no nickname in URL
- no memo in URL
- no requests to analytics services
- no request body contains student data
- no console logging of prompt or answers
- fonts and images are local
- external AI is never called

Static asset requests and GitHub Pages hosting requests are allowed.

---

## 11. Accessibility acceptance

### Required

- All interactive elements reachable by keyboard.
- Focus order follows visual order.
- Focus ring visible.
- Radio groups have fieldset/legend.
- Inputs have labels.
- Progress has accessible value.
- Radar has text summary.
- Toast uses live region.
- Modal traps and restores focus.
- Color is never the sole indicator.
- Contrast is acceptable for body text and controls.
- `prefers-reduced-motion` works.
- Icon-only buttons have accessible names.

No critical axe-core violations on core screens if automated accessibility testing is added.

---

## 12. Responsive acceptance

### 1024×768

- no horizontal page scroll
- surface fits
- question cards readable
- result remains two columns
- prompt pencil shrinks or hides safely

### 1366×768

- core content fits without unintended clipping
- main action remains visible
- no excessive empty top space

### 1440×900

- surface centered
- does not stretch awkwardly
- visual density remains similar

### 1920×1080

- max width respected
- background provides outer whitespace
- typography does not scale excessively

### 390×844 and 360×740 portrait

- app surface renders instead of narrow-screen guidance
- start screen and questionnaire flow are usable
- detail and prompt screens remain readable with vertical page scroll
- result, detail, and prompt navigation resets to the top of the new screen
- core result/detail/prompt controls remain at least 44px tall
- no horizontal page scroll

### 359×740 portrait

- narrow-screen guidance shown because the viewport is below the portrait minimum width

### 844×390 and 667×375 landscape

- app surface renders instead of narrow-screen guidance
- start screen and questionnaire flow are usable
- no horizontal page scroll

### 560×375 landscape

- prompt fixture content stays inside the viewport at the compact minimum width
- no horizontal page scroll

### 559×375 landscape

- narrow-screen guidance shown because the viewport is below the compact landscape minimum width

---

## 13. Performance acceptance

- build completes
- no uncompressed multi-megabyte assets
- no unnecessary chart/UI library
- no runtime external font fetch
- no obvious layout shift
- interaction remains responsive on a typical tablet
- image export library may be lazy-loaded

Suggested target:

- generated assets total <700KB
- app JS gzip <250KB where practical
- no single image >400KB

---

## 14. GitHub Pages acceptance

- relative or correct base path
- direct root load works
- refresh does not 404
- asset URLs work under repository subpath
- Actions build uses lockfile
- deployed version has no fixture mode unless intentionally enabled
- privacy behavior remains unchanged in production
- production build receives `MASTER_CODE` through environment/secret, not source code
- production build receives `ACCESS_CODE_REVISION` through environment/variable, not source code; production build fails when it is missing
- built bundle does not contain the raw production master code
- built bundle does not contain the raw access-code revision value
- `npm run privacy:scan` passes after build

## 14.1 Access-code and ownership acceptance

- first non-fixture visit shows `수업 접속 코드` before the start screen
- invalid and expired access codes are rejected with student-safe copy
- hidden repeated activation of `© Daisy Teacher. All rights reserved. 무단 복제 및 재배포 금지` opens the admin modal
- admin modal verifies the master code, shows `유효 기간 (일 단위)`, defaults to 1 day, and generates 6-character, 1-90 day codes
- admin modal generates a session classroom link, shows a QR code for that link, and supports copying the link/code bundle plus QR image with fallback
- access pass stores only code and revision fingerprints plus expiry
- access pass is ignored when its revision/session fingerprint differs from the current link
- the copyright text appears on screen, in the low-opacity watermark, and on exported result images
- detailed-report copy, AI prompt copy, and manual-copy fallback text do not append the copyright text

## 14.2 Browser and pilot scope

- current classroom-device assumption is Galaxy Tab / Android Chromium-class tablets
- Chromium/Edge/Android Chromium verification remains required
- WebKit/Safari is optional future compatibility work, not a hard gate for this scope
- real teacher/student classroom pilot validation remains future work and is not required for this local verification pass

---

## 15. Final review output

`docs/VISUAL_REVIEW_LOG.md` must include a table:

| Pass | Screen | Score | Main gaps | Changes made | Evidence |
|---|---|---:|---|---|---|

`FINAL_REPORT.md` must include:

- final visual scores
- automated metrics
- exact commands and pass/fail
- browser matrix results
- network/privacy result
- generated asset list
- known residual differences

---

## 16. Stop conditions

Do not finish when:

- any screen <90 visual score
- any visual category below minimum
- any critical/high reviewer finding unresolved
- build/test failure
- network privacy failure
- no imagegen asset log
- no visual review log
- no final report
