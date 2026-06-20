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

## Automated Metrics

| Screen | SSIM | Pixel mismatch | Actual | Diff |
|---|---:|---:|---|---|
| Start | 0.3882 | 0.0994 | `artifacts/visual/start-surface.png` | `artifacts/visual/start-diff.png` |
| Question | 0.5016 | 0.0779 | `artifacts/visual/question-surface.png` | `artifacts/visual/question-diff.png` |
| Result | 0.5015 | 0.0805 | `artifacts/visual/result-surface.png` | `artifacts/visual/result-diff.png` |
| Prompt | 0.3463 | 0.1016 | `artifacts/visual/prompt-surface.png` | `artifacts/visual/prompt-diff.png` |

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
The implementation is not pixel-perfect. The source is a montage, and product-required safety/action content creates some density differences. The prompt screen uses a scrollable real text preview rather than visually hiding overflow. The result screen includes more visible action buttons than the board crop so required copy/save/export flows remain discoverable.
```
