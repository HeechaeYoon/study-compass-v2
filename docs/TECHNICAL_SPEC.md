# Technical Specification

## 1. Architecture goals

- Static client-only app
- Deterministic scoring and result generation
- Clear separation between domain logic and UI
- Reproducible visual fixtures
- GitHub Pages-safe navigation
- Minimal dependencies
- Reliable browser storage and clipboard fallback
- Local-only assets and fonts

---

## 2. Recommended stack

| Concern | Choice |
|---|---|
| UI | React |
| Build | Vite |
| Language | TypeScript strict mode |
| CSS | CSS Modules or feature-scoped plain CSS |
| Unit tests | Vitest |
| Component/browser tests | Playwright |
| Icons | `lucide-react`, used selectively |
| DOM image export | `html-to-image` |
| Image processing scripts | `sharp` |
| Reference comparison | `pixelmatch` plus `ssim.js` or equivalent |
| Deployment | GitHub Actions to GitHub Pages |

Avoid a global state library. React reducer and derived selectors are sufficient.

---

## 3. Suggested repository structure

```text
.
├─ AGENTS.md
├─ PRD.md
├─ PLAN.md
├─ START_HERE.md
├─ docs/
├─ reference/
├─ .prompts/
├─ public/
│  └─ assets/
│     ├─ paper-texture.webp
│     ├─ pencil-transparent.webp
│     └─ generated-assets.json
├─ scripts/
│  ├─ process-generated-assets.mjs
│  ├─ crop-reference.mjs
│  └─ visual-compare.mjs
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ appReducer.ts
│  │  ├─ appState.ts
│  │  └─ fixtures.ts
│  ├─ components/
│  │  ├─ AppHeader/
│  │  ├─ AxisCard/
│  │  ├─ AnswerCard/
│  │  ├─ AxisBars/
│  │  ├─ RadarChart/
│  │  ├─ Doodle/
│  │  ├─ Field/
│  │  ├─ Modal/
│  │  ├─ Toast/
│  │  └─ WideOnlyNotice/
│  ├─ screens/
│  │  ├─ StartScreen/
│  │  ├─ QuestionScreen/
│  │  ├─ ResultScreen/
│  │  └─ PromptScreen/
│  ├─ data/
│  │  ├─ questions.ts
│  │  ├─ axes.ts
│  │  ├─ learningTypes.ts
│  │  └─ copy.ts
│  ├─ domain/
│  │  ├─ scoring.ts
│  │  ├─ matching.ts
│  │  ├─ result.ts
│  │  ├─ prompt.ts
│  │  └─ validation.ts
│  ├─ infrastructure/
│  │  ├─ storage.ts
│  │  ├─ clipboard.ts
│  │  └─ imageExport.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ global.css
│  │  └─ print.css
│  ├─ test/
│  │  ├─ builders.ts
│  │  └─ fixtures.ts
│  └─ main.tsx
├─ tests/
│  ├─ unit/
│  ├─ e2e/
│  └─ visual/
├─ playwright.config.ts
├─ vite.config.ts
└─ package.json
```

Use a simpler equivalent if appropriate, but keep domain logic separate.

---

## 4. TypeScript configuration

- `strict: true`
- `noUncheckedIndexedAccess: true` preferred
- `exactOptionalPropertyTypes: true` preferred
- `noImplicitOverride: true`
- no `any`
- exported domain functions have explicit return types

---

## 5. Application state machine

```ts
export type Screen =
  | "start"
  | "question"
  | "result"
  | "prompt";

export type AppState = {
  screen: Screen;
  nickname: string;
  currentQuestionIndex: number;
  answers: Record<string, number | string>;
  result: Result | null;
  memo: string;
  promptInputs: PromptInputs;
  savedResultAvailable: boolean;
};
```

### Actions

```ts
export type AppAction =
  | { type: "SET_NICKNAME"; value: string }
  | { type: "START" }
  | { type: "ANSWER"; questionId: string; value: number | string }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "NEXT_QUESTION" }
  | { type: "COMPLETE"; result: Result }
  | { type: "OPEN_PROMPT" }
  | { type: "OPEN_RESULT" }
  | { type: "SET_MEMO"; value: string }
  | { type: "SET_PROMPT_INPUT"; field: keyof PromptInputs; value: string }
  | { type: "LOAD_SAVED_RESULT"; value: SavedResult }
  | { type: "RESET" };
```

Do not persist in-progress answers automatically in v1 unless it can be done without adding privacy ambiguity.

---

## 6. Result types

```ts
export type AxisLabel = "강점" | "균형" | "성장 포인트";

export type LearningTypeMatch = {
  primaryType: LearningTypeId;
  secondaryType?: LearningTypeId;
  rankings: Array<{
    id: LearningTypeId;
    distance: number;
    similarity: number;
  }>;
};

export type Result = {
  questionnaireVersion: "16-basic";
  createdAt: string;
  nickname?: string;
  answers: Record<string, number | string>;
  axisScores: AxisScores;
  axisLabels: Record<Axis, AxisLabel>;
  displayScores: Record<Axis, number>;
  match: LearningTypeMatch;
  strengthAxes: Axis[];
  growthAxes: Axis[];
  primaryGrowthAxis: Axis;
};
```

---

## 7. Domain pipeline

```text
validate answers
→ compute raw scores
→ compute axis min/max from question definitions
→ normalize to 0–100
→ create labels and display scores
→ match representative type
→ choose strength axes
→ choose growth axes
→ create result model
→ render screen-specific copy
→ build AI prompt
```

All pipeline functions must be pure except storage, clipboard, and export.

---

## 8. Validation

```ts
export type ValidationResult =
  | { ok: true }
  | { ok: false; error: string; questionId?: string };
```

Validate:

- all 16 question IDs exist
- no unknown answer IDs
- Likert answers are integers 1–4
- scenario answer exists in option list
- all axis scores finite
- normalized scores in 0–100
- primary type exists

Never silently coerce invalid stored data.

---

## 9. Storage

### Key

```ts
export const STORAGE_KEY = "srl-coach-result-v1";
```

### Schema

```ts
export type SavedResult = {
  schemaVersion: 2;
  savedAt: string;
  result: Result;
  memo: string;
  promptInputs: PromptInputs;
};
```

`schemaVersion: 1` saved results may be migrated on load by dropping the old memo checkbox fields and preserving memo text. Malformed saved data must still be rejected.

### API

```ts
export type StorageResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: "unavailable" | "invalid" | "quota" | "unknown" };

export function saveResult(value: SavedResult): StorageResult<void>;
export function loadResult(): StorageResult<SavedResult | null>;
export function deleteResult(): StorageResult<void>;
```

Requirements:

- Wrap all access in `try/catch`.
- Validate parsed JSON.
- Do not throw into React rendering.
- Invalid or wrong-version data must not crash the app.
- Do not store data until user selects save.

---

## 10. Clipboard

### Primary

```ts
await navigator.clipboard.writeText(text);
```

### Fallback

1. Create hidden readonly textarea.
2. Insert into document.
3. Select content.
4. Use `document.execCommand("copy")`.
5. Remove textarea.
6. If it fails, show a modal or textarea with selected text for manual copy.

### API

```ts
export type CopyResult =
  | { ok: true; method: "clipboard" | "execCommand" }
  | { ok: false; manualText: string };
```

Clipboard action must only occur from a user gesture.

---

## 11. Image export

- Export only a dedicated summary element with `data-export-card`.
- Do not export hidden controls.
- Do not include free-form memo or prompt inputs by default.
- Wait for fonts and images.
- Use `html-to-image` or equivalent.
- Apply export-only fixed dimensions if necessary.
- Use local assets only.
- Filename:

```text
학습성향_전략설계형_YYYY-MM-DD.png
```

Sanitize nickname; nickname does not need to be in filename.

Fallback: display failure toast and recommend text copy.

---

## 12. Custom radar chart

### Props

```ts
type RadarChartProps = {
  scores: AxisScores;
  size?: number;
  showDisplayScores?: boolean;
};
```

### Geometry

- center: `(size / 2, size / 2)`
- outer radius: `size * 0.34`
- start angle: `-90deg`
- order: P, E, U, M, H
- 5 grid levels
- score radius: `outerRadius * score / 100`
- label radius: `outerRadius * 1.28`

### SVG constraints

- deterministic output
- `role="img"`
- accessible label summarizing axes
- decorative grid paths `aria-hidden`
- text labels should not be clipped
- use `vector-effect="non-scaling-stroke"`

---

## 13. Doodles

Inline SVG components must be committed in code.

Rules:

- deterministic paths
- `aria-hidden="true"` unless meaningful
- CSS variables for stroke color
- separate viewBoxes
- no external network asset
- no runtime random numbers

---

## 14. Visual fixture mode

Create deterministic states accessible only through query parameters in development and tests.

Examples:

```text
/?fixture=start
/?fixture=question
/?fixture=result
/?fixture=prompt
```

Production behavior:

- Fixture mode only active when `import.meta.env.DEV` or `VITE_ENABLE_FIXTURES=true`.
- GitHub Pages production build must not expose arbitrary stored student data.
- Visual fixture result uses fixed values matching the reference:
  - P 80
  - E 90
  - U 70
  - M 78
  - H 65
  - primary type strategy_designer
- Question fixture uses Q06, answer D selected, index `6 / 16`.

The reference screen says approximately `계획 4.2`, `실행 4.6`, `이해 3.8`, `점검 4.1`, `도움 3.6`. Use fixture values that create these display values.

---

## 15. Time remaining estimate

Display is supportive only.

```ts
const averageSecondsPerQuestion = 18;
const remainingQuestions = total - answeredCount;
const remainingMinutes = Math.max(
  1,
  Math.ceil((remainingQuestions * averageSecondsPerQuestion) / 60),
);
```

Copy:

```text
약 3분 남음
```

Do not present as exact.

---

## 16. GitHub Pages configuration

Prefer relative asset base for maximum portability.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
});
```

If the repository structure requires an explicit base path, derive it from environment and document it.

Use a GitHub Actions workflow that:

1. installs dependencies with lockfile
2. runs typecheck, lint, unit tests, build
3. uploads `dist`
4. deploys Pages

Visual tests may run separately if browser installation makes deployment workflow too heavy.

---

## 17. Package scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test tests/e2e",
    "test:visual": "playwright test tests/visual",
    "logic:distribution": "vite-node --script scripts/logic-distribution.ts",
    "visual:compare": "node scripts/visual-compare.mjs"
  }
}
```

Adjust to actual TypeScript project references.

---

## 18. Error boundaries

A full React error boundary is optional but recommended.

User-facing fallback:

```text
화면을 불러오는 중 문제가 생겼어요.
응답은 서버로 전송되지 않았습니다.
처음 화면으로 돌아가 다시 시도해주세요.
```

Provide reset button.

---

## 19. Accessibility

### Question cards

Use native radio inputs visually hidden, not only clickable divs.

```html
<fieldset>
  <legend>질문...</legend>
  <label>
    <input type="radio" name="Q06" value="D" />
    ...
  </label>
</fieldset>
```

### Progress

```html
<div
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="16"
  aria-valuenow="6"
  aria-label="16문항 중 6문항 진행"
/>
```

### Radar

Provide a screen-reader summary:

```text
계획 강점, 실행 강점, 이해 균형, 점검 강점, 도움 균형
```

### Toast

`role="status"` and `aria-live="polite"`.

### Modal

- dialog role
- labelled title
- focus trap
- return focus to invoking button
- Escape closes except during irreversible action execution

---

## 20. Security and privacy checks

- Search built bundle for analytics domains.
- Inspect browser network during a full flow.
- No answer values in query string or hash.
- No `fetch`, XHR, WebSocket, beacon, or remote logging for student data.
- External font/CDN requests prohibited.
- Generated assets are committed locally.
- Do not expose the student's prompt in console logs.
- Remove debug logging before completion.

---

## 21. Performance budget

Guideline, not a hard platform limit:

- JS gzip: target under 250KB
- CSS gzip: target under 60KB
- Generated visual assets total: target under 700KB
- No single decorative asset over 400KB
- Avoid loading export library until result screen if easy
- No layout shift after fonts load in baseline screenshots

---

## 22. Browser matrix

Minimum manual or automated smoke checks:

| Browser/engine | Viewport | Required |
|---|---:|---|
| Chromium | 1280×800 | full visual and functional |
| Chromium | 1024×768 | responsive smoke |
| Chromium | 1440×900 | responsive smoke |
| WebKit | 1280×800 | functional smoke |
| Chromium | 1920×1080 | max-width check |

---

## 23. Logging and final report

During implementation:

- Update `PLAN.md`
- Record asset prompts in `.prompts/IMAGEGEN_ASSETS.md`
- Record visual iterations in `docs/VISUAL_REVIEW_LOG.md`
- Store diff images under `artifacts/visual/` or Playwright output, not in `public/`

Final:

- Create `FINAL_REPORT.md`
- Include:
  - implementation summary
  - commands run and results
  - screenshots generated
  - visual review scores
  - generated asset list
  - privacy verification
  - known limitations
