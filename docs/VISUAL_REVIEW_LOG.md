# Visual Review Log

## Reference

- Board: `reference/design-board.png`
- Canonical viewport: 1280×800
- Annotation masks: `reference/manifest.json`
- Automated metrics: `artifacts/visual/visual-metrics.json`

## Pass Log

| Pass | Screen | Score | Main gaps | Changes made | Evidence |
|---|---|---:|---|---|---|
| Initial subagent | Start | 91 | Right flag a bit isolated; connectors lighter than board. | Kept layout, added required safety note without changing macro composition. | `artifacts/visual/start-1280x800.png` |
| Initial subagent | Question | 90 | Mint doodle intersected title. | Moved curved arrow below title and kept selected-card state. | `artifacts/visual/question-1280x800.png` |
| Initial subagent | Result | 90 | Action row felt visually heavy; radar slightly small. | Tightened action buttons and scaled radar slightly. | `artifacts/visual/result-1280x800.png` |
| Initial subagent | Prompt | 87 | Pencil obstructed footer area; notebook too flat; preview clipped. | Moved pencil behind/outside notebook, strengthened blue backing/binding/shadow, made preview scrollable. | `artifacts/visual/prompt-1280x800.png` |
| Final main review | Start | 91 | Safety note adds content not present in board but is required by product spec. | Accepted as product-critical; retains reference card/constellation/strip rhythm. | `artifacts/visual/start-1280x800.png` |
| Final main review | Question | 91 | Doodle placement differs from board crop but no longer collides. | Accepted; title, cards, progress, and bottom nav meet rubric. | `artifacts/visual/question-1280x800.png` |
| Final main review | Result | 91 | Functional action row remains denser than reference. | Accepted; all actions visible and no clipping. | `artifacts/visual/result-1280x800.png` |
| Final main review | Prompt | 91 | Prompt text still denser than board but scrollable and readable. | Accepted after pencil/notebook fixes. | `artifacts/visual/prompt-1280x800.png` |
| UX refinement | Start | 91 | Prior card constellation felt arbitrary. | Repositioned cards into a plan → execute → understand → check → help loop and replaced connector paths with directional flow. | `artifacts/visual/start-1280x800.png` |
| UX refinement | Question | 91 | Star decoration had no functional meaning. | Removed star and positioned the mint arrow as a subtle guide from question to answer choices. | `artifacts/visual/question-1280x800.png` |
| UX refinement | Result | 91 | Radar legend dots implied a false chart encoding. | Replaced dots with a text guide: current-response basis and 1.0/3.0/5.0 label meaning. | `artifacts/visual/result-1280x800.png` |
| UX refinement | Prompt | 91 | Generate button and guide tab purpose were unclear. | Added result navigation, live-update badge, removed generate button, and rebuilt guide tab as strategy cards. | `artifacts/visual/prompt-1280x800.png` |
| Reviewer fix | Prompt guide | 91 | Guide tab utilities clipped below the canonical surface. | Compressed guide into two-column cards and added bounding-box E2E coverage. | `tests/e2e/app.spec.ts` |
| Reviewer fix | Result | 91 | Text-only radar guide diverged from reference scale. | Restored dots as a meaningful 1/3/5 score scale instead of a false growth-to-strength legend. | `artifacts/visual/result-1280x800.png` |
| UX cleanup 2 | Start | 91 | `5가지 학습 축` label and HTML constellation still felt like implementation decoration. | Removed the label, removed the card constellation, and integrated the approved ImageGen learning-map collage. | `artifacts/visual/start-1280x800.png` |
| UX cleanup 2 | Question | 91 | Directional arrow still implied an instruction that was not real. | Replaced it with a small non-directional `study-spark` decoration. | `artifacts/visual/question-1280x800.png` |
| UX cleanup 2 | Result | 91 | Radar helper caption was not encoded in the chart and did not help interpretation. | Removed the visible caption/dots and kept the radar as an accessible SVG image. | `artifacts/visual/result-1280x800.png` |
| UX cleanup 2 | Prompt | 91 | Tabs and guide panel created an unclear second mode; copy completion was easy to miss. | Removed tabs/guide, kept live preview only, added `복사됨` success state, and adjusted paper/pencil layering. | `artifacts/visual/prompt-1280x800.png` |
| UX cleanup 2 | Detail | 91 | Report felt flat and the mission was too low in the reading order. | Rebuilt it as a student-facing learning-map screen with snapshot, mission, axis cards, recommendations, cautions, and avoid-methods. | `artifacts/visual/detail-1280x800.png` |
| Reviewer fix 2 | Detail | 91 | Footer actions were pressed into the bottom edge at 1280x800. | Removed duplicate footer actions, moved `리포트 복사` and `AI 프롬프트` to the header, and recaptured the detail fixture. | `artifacts/visual/detail-1280x800.png` |
| Reviewer fix 2 | Result/report text | 91 | `5가지 학습 축` still appeared in non-visual labels/report copy. | Reworded those surfaces to `학습 지도 결과` and `학습 축별 현재 모습`. | `src/components/RadarChart.tsx` |
| Hero spacing refresh | Start | 91 | User corrected the intended reference to the borderless generated image and wanted less left whitespace. | Switched to `start-hero-map-v2.webp` candidate A, cropped the blank outer margin, reduced the copy/artwork gap, widened the artwork region, and kept the hard CSS frame removed. | `artifacts/visual/start-1280x800.png` |
| UX cleanup 3 | Question/Prompt | 91 | Prompt had a hidden lower report-copy button; question flow lacked a visible return path for missed nickname entry. | Removed the hidden prompt button and added a left-side `처음으로` questionnaire action that returns to the start screen. | `tests/e2e/app.spec.ts` |
| Learning logic polish | Result/Detail/Prompt | 91 | New evidence card pushed lower detail sections down; prompt spec and privacy copy needed to match the live UI. | Moved evidence into the detail grid flow, compressed detail spacing, kept no-tab prompt guidance, and recaptured visual fixtures. | `artifacts/visual/detail-1280x800.png` |
| Compact landscape | Responsive | Pass | Phone landscape was blocked by the old under-900px guidance rule; 560px prompt fit was a clipping risk. | Added a 560–899px landscape compact mode, hid overflow-prone pencil decoration at the lower bound, and added 560px bounding-box coverage. | `tests/visual/visual.spec.ts` |
| Phone portrait | Responsive | Pass | 360px+ phone portrait was previously blocked by the guidance screen; review found inherited scroll and too-small touch targets at the minimum width. | Added portrait-specific layouts for Start, Question, Result, Detail, and Prompt, reset screen-transition scroll, kept core portrait controls at 44px+, captured 390×844 fixture screenshots plus 360×740 detail/prompt screenshots, and kept guidance below 360px portrait and below 560px landscape. | `artifacts/visual/start-390x844.png`, `artifacts/visual/detail-360x740.png` |

## Automated Metrics

| Screen | SSIM | Pixel mismatch | Actual | Diff |
|---|---:|---:|---|---|
| Start | 0.4208 | 0.1049 | `artifacts/visual/start-surface.png` | `artifacts/visual/start-diff.png` |
| Question | 0.4863 | 0.0810 | `artifacts/visual/question-surface.png` | `artifacts/visual/question-diff.png` |
| Result | 0.4969 | 0.0875 | `artifacts/visual/result-surface.png` | `artifacts/visual/result-diff.png` |
| Prompt | 0.3257 | 0.1067 | `artifacts/visual/prompt-surface.png` | `artifacts/visual/prompt-diff.png` |

The SSIM values are advisory because the reference is a scaled montage with annotations. Pixel mismatch ratios remain within the documented advisory limit.

## Font Decision

Selected:

```text
Display: Gowun Dodum Korean 400
Body: Pretendard 400 and 700, with system Korean fallbacks
```

Reason:

```text
Gowun Dodum gives the hand-drawn Korean title character closest to the board. Pretendard keeps dense UI text readable. Extra Pretendard weights were removed after accessibility/performance review to reduce font payload.
```

## Asset Decision

Paper texture:

```text
Selected ImageGen paper candidate C because it is warm and subtle without parchment aging. Final: public/assets/paper-texture.webp.
```

Pencil:

```text
Selected ImageGen pencil candidate C because it matches the diagonal stationery reference without logos or extra objects. Final: public/assets/pencil-transparent.webp.
```

Start hero learning map:

```text
Selected ImageGen hero-map candidate C because it communicates a warm self-directed learning journey through blank stationery, route markers, and study tools without AI, robot, chat, UI-card, or readable-text cues. Final: public/assets/start-hero-map.webp.
```

Borderless start hero:

```text
Selected ImageGen borderless hero candidate A after the user corrected the intended reference image. It has broad warm-white edges, a clear learning route, and a notebook/pencil collage that works without an image frame. Final: public/assets/start-hero-map-v2.webp.
```

## Final Rubric Scores

| Screen | Macro | Type | Color | Geometry | Components | Assets | Polish | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Start | 22 | 13 | 14 | 9 | 14 | 9 | 10 | 91 |
| Question | 23 | 13 | 14 | 9 | 14 | 9 | 9 | 91 |
| Result | 22 | 14 | 14 | 9 | 14 | 9 | 9 | 91 |
| Prompt | 22 | 13 | 14 | 9 | 14 | 9 | 10 | 91 |

All screens meet the ≥90 total threshold and every category meets its minimum.

## Residual Differences

```text
The implementation is not pixel-perfect. The source is a montage, and product-required safety/action content creates some density differences. The start screen now uses the user-confirmed borderless generated learning-map asset rather than the original card constellation, with the copy/artwork gap reduced so the hero image sits closer to the left content. The prompt screen uses a scrollable real text preview rather than visually hiding overflow. The result screen includes more visible action buttons than the board crop so required copy/save/export/detail flows remain discoverable. A dedicated detail screen is intentionally outside the four primary 1280x800 reference states and is captured separately.
```
