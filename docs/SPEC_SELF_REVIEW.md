# Specification Self-Review

- Review date: 2026-06-19
- Scope: all Markdown files, reference crops, manifest, and prompt templates in this package
- Review objective: determine whether Codex can work autonomously toward a high-fidelity implementation without needing routine clarification

---

## 1. Review method

The package was reviewed against five questions.

1. Is the product behavior fully specified?
2. Is the visual target translated from the screenshot into implementable rules?
3. Are conflicts and missing source details resolved explicitly?
4. Can Codex plan, implement, test, visually compare, and self-review without stopping after a first pass?
5. Are privacy, learning-tool language, and technical constraints preserved?

A file-existence and cross-reference check was also performed.

---

## 2. Completeness review

| Area | Status | Notes |
|---|---|---|
| Product goals and non-goals | Pass | `PRD.md` |
| User flow and screens | Pass | Four core screens and expanded result functions |
| Visual target | Pass with residual risk | Detailed from a PNG montage; no original design source |
| Design tokens | Pass | Colors, type scale, radius, shadow, layout |
| Question content | Pass | 16 items, 12 Likert + 4 scenario |
| Scoring | Pass | Bounds, normalization, labels, profile matching |
| Type copy | Pass | 8 types and growth-centered language |
| AI prompt | Pass | Optional inputs, memo rule, detailed template |
| Privacy | Pass | No server, explicit save, delete |
| Architecture | Pass | Static React/Vite/TypeScript |
| ImageGen workflow | Pass | Isolated assets only, prompt log required |
| Visual verification | Pass | Playwright, reference crops, metrics, rubric |
| Functional testing | Pass | Unit, E2E, error cases |
| Accessibility | Pass | Semantics, keyboard, focus, live regions |
| Autonomous workflow | Pass | Phases, gates, subagents, final report |
| GitHub Pages | Pass | Static build and subpath requirements |

No required product area is missing.

---


## 2.1 Automated consistency checks

The following checks were run on the generated package.

| Check | Result |
|---|---|
| Q01–Q16 present exactly once in the base-question section | Pass |
| Base question mix is 12 Likert and 4 scenario | Pass |
| Markdown code fences balanced in every document | Pass |
| Root `AGENTS.md` remains below the default instruction-size concern | Pass |
| Every file listed in `MANIFEST.md` exists | Pass |
| Reference image dimensions are 1536×1024 | Pass |
| Reference crops and JSON mask manifest generated | Pass |


## 3. Consistency findings and corrections

### Finding R-01 — 4-point requirement versus 5-card reference

**Risk:** The original functional requirement uses a 4-point agreement scale, while the screenshot shows five answer cards.

**Resolution applied:**

- Likert items remain 4-point with no neutral response.
- Scenario items may use five choices.
- Q06 is defined as a five-choice scenario/self-description item and matches the reference question screen.
- The answer-card component must support both four and five cards.

**Status:** Resolved.

---

### Finding R-02 — Mockup labels could leak into production

**Risk:** Blue labels such as `1 시작 화면` could be misinterpreted as app UI.

**Resolution applied:**

- `DECISION_LOG.md` states they are board annotations.
- `manifest.json` provides annotation masks.
- Visual spec explicitly forbids them in production.

**Status:** Resolved.

---

### Finding R-03 — Reference result numbers versus type prototype

**Risk:** The reference result displays high plan, execution, understanding, and checking values with `전략 설계형`. The first prototype vector would have classified those values closer to `균형 조율형`.

**Correction applied:**

`strategy_designer` was adjusted to:

```ts
{ P: 82, E: 82, U: 72, M: 75, H: 62 }
```

This is also more consistent with the reference explanation: plan systematically, execute, and self-check.

**Status:** Resolved for the fixture and initial heuristic. It remains a non-standardized design value and must be reviewed after student pilot data.

---

### Finding R-04 — ImageGen could reduce UI fidelity if overused

**Risk:** Generating whole screens would produce non-interactive, inaccessible, and inconsistent UI.

**Resolution applied:**

- ImageGen is limited to paper texture and pencil.
- UI, chart, text, notebook, and doodles remain code/SVG.
- Prompt logs and multiple candidate selection are mandatory.

**Status:** Resolved.

---

### Finding R-05 — One-shot instruction could stop after a first implementation

**Risk:** Coding agents often regard a working first version as completion.

**Resolution applied:**

- `AGENTS.md` explicitly forbids stopping after the first version.
- Phased gates require macro visual review before functionality and final ≥90 scores.
- Three reviewer subagents are mandatory.
- Final report and visual review log are required.

**Status:** Mitigated. Agent behavior still depends on available Codex capabilities and runtime limits.

---

### Finding R-06 — PNG montage is not a direct full-screen baseline

**Risk:** Automated pixel comparison can be misleading because the reference contains four scaled panels and annotations.

**Resolution applied:**

- Individual crops are included.
- Header and screen surface are compared separately.
- Annotation masks are defined.
- Automated metrics are advisory.
- A category-based visual review is the primary completion gate.

**Status:** Mitigated, not eliminable without original design source.

---

## 4. Technical review

### Positive findings

- Domain logic is isolated from React.
- Axis bounds are derived from question data rather than duplicated constants.
- Storage, clipboard, and export failure paths are explicit.
- Fixture mode creates deterministic screenshots.
- Custom SVG radar avoids chart-library defaults.
- GitHub Pages routing risk is minimized by a state machine rather than path routing.
- Fonts and assets are local, supporting reliable image export and school networks.

### Watch items during implementation

- The `screenSurface` height rule must not clip expanded report content.
- Font packages must include the needed Korean glyph subset.
- Background-removal processing for the pencil must avoid a white halo.
- The prompt form has more fields than the reference; compact grouping must preserve the visual balance.
- The result type thresholds and prototype vectors require future pilot validation.
- `html-to-image` behavior must be tested specifically in Safari/WebKit.

---

## 5. Visual review of the written specification

The specification captures the main visible features of the screenshot:

- warm ivory background
- deep navy title
- yellow hand underline
- shared metadata header
- 2-over-3 axis cards
- gray connector doodles
- wide question card row
- indigo selected state
- result narrative and radar split
- yellow growth note
- three summary cards
- tabbed prompt form
- notebook preview
- large diagonal pencil

The most uncertain visual element is the exact Korean display font. The package deliberately defines a test-and-select process instead of pretending the font is known.

---

## 6. Scored assessment of this documentation package

This score evaluates the **specification package**, not the future app.

| Category | Score | Reason |
|---|---:|---|
| Product completeness | 97/100 | Required functions and limits are covered |
| Implementability | 96/100 | Typed models, algorithms, phases, and tests are concrete |
| Internal consistency | 95/100 | Main conflicts were identified and resolved |
| Visual specificity | 93/100 | Very detailed, but original font/assets are unavailable |
| Autonomous-agent suitability | 96/100 | AGENTS, plan, gates, subagents, logs, and final report |
| Objective verifiability | 91/100 | Screenshot montage limits exact automated comparison |
| Overall | 95/100 | Ready to hand to Codex with known residual risks |

---

## 7. Residual risks that cannot be removed by documentation

1. **Unknown original font and vector assets**  
   A visually close substitute can be selected, but exact identity is unavailable.

2. **Codex environment capability**  
   `$imagegen`, browser use, subagents, or long-running iteration may not be available in every Codex surface.

3. **One-run execution variance**  
   Detailed instructions increase success probability but cannot guarantee that an agent will achieve the target without any human review.

4. **Reference comparison quality**  
   The source is a compressed montage, not full-resolution screen exports.

5. **Measurement validity**  
   Type profiles and cutoffs are coaching heuristics until tested with actual students.

---

## 8. Final verdict

**Ready for implementation.**

There are no unresolved documentation blockers. The package is intentionally strict about visual gates and autonomous review because the previous implementation quality was unacceptable.

The implementation should not be accepted based on “functionality works.” It should only be accepted after the reference comparison, independent reviews, and the full acceptance checklist pass.

---

## 9. Human verification points after Codex finishes

- Confirm the 1280×800 screenshots are genuinely close to the reference, not merely stylistically similar.
- Confirm actual school tablets can load GitHub Pages and copy text.
- Confirm the selected Korean display font feels mature rather than childish.
- Confirm the result language does not make students feel ranked or fixed.
- Confirm network inspection shows no student-data transmission.
