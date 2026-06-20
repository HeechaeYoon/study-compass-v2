# Design System

This file defines initial implementation tokens. Fine-tune them through visual comparison, but preserve the semantic names and overall relationships.

---

## 1. CSS variables

```css
:root {
  color-scheme: light;

  --font-display:
    "Gowun Dodum",
    "Pretendard",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    sans-serif;

  --font-body:
    "Pretendard",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    sans-serif;

  --ink: #101d4b;
  --ink-soft: #30384f;
  --text-muted: #777c89;
  --text-faint: #a2a5ad;

  --primary: #4559de;
  --primary-dark: #3148d4;
  --primary-light: #eef1ff;
  --primary-ring: rgba(69, 89, 222, 0.22);

  --mint: #43c99b;
  --mint-light: #e6f7ee;
  --yellow: #f5be2e;
  --yellow-light: #fff5c7;
  --coral: #f16d48;
  --orange: #e8a45e;

  --bg: #f7f4ee;
  --surface: #fffefc;
  --surface-solid: #ffffff;
  --border: #d9d9d6;
  --border-strong: #bfc3cd;
  --doodle: #8e96a6;

  --shadow-surface:
    0 2px 4px rgba(30, 37, 60, 0.08),
    0 12px 28px rgba(45, 39, 26, 0.06);

  --shadow-card:
    0 3px 8px rgba(25, 34, 60, 0.10);

  --shadow-selected:
    0 7px 18px rgba(69, 89, 222, 0.12);

  --shadow-notebook:
    0 12px 26px rgba(28, 36, 64, 0.15);

  --radius-surface: 10px;
  --radius-card: 9px;
  --radius-small: 7px;
  --radius-pill: 999px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 64px;

  --header-height: 72px;
  --surface-max: 1216px;
  --motion-fast: 160ms;
  --motion-standard: 200ms;
  --ease-standard: cubic-bezier(.2, .8, .2, 1);
}
```

---

## 2. Global reset

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-width: 320px;
  background: var(--bg);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family: var(--font-body);
  color: var(--ink-soft);
  background: var(--bg);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

img,
svg {
  display: block;
}

p,
h1,
h2,
h3,
h4 {
  margin: 0;
  word-break: keep-all;
}
```

---

## 3. Layout primitives

### AppShell

```css
.appShell {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    linear-gradient(rgba(247, 244, 238, .91), rgba(247, 244, 238, .91)),
    url("/assets/paper-texture.webp");
  background-size: auto, 320px 320px;
}
```

### AppHeader

```css
.appHeader {
  height: var(--header-height);
  border-bottom: 1px solid rgba(27, 36, 66, .13);
  background: rgba(250, 248, 243, .94);
}

.appHeaderInner {
  width: min(1440px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### ScreenSurface

```css
.screenSurface {
  position: relative;
  width: min(var(--surface-max), calc(100vw - 64px));
  min-height: calc(100vh - var(--header-height) - 40px);
  max-height: 680px;
  margin: 16px auto 24px;
  border: 1px solid rgba(53, 56, 70, .17);
  border-radius: var(--radius-surface);
  background:
    linear-gradient(rgba(255, 255, 255, .95), rgba(255, 255, 255, .95)),
    url("/assets/paper-texture.webp");
  background-size: auto, 320px 320px;
  box-shadow: var(--shadow-surface);
}
```

Do not force `max-height` if it clips expanded report content. The four primary summary states should fit in 800px; expanded sections may extend and scroll.

---

## 4. Typography classes

```css
.displayTitle {
  font-family: var(--font-display);
  font-size: clamp(30px, 2.65vw, 38px);
  line-height: 1.32;
  font-weight: 700;
  color: var(--ink);
}

.questionTitle {
  font-family: var(--font-display);
  font-size: clamp(28px, 2.65vw, 36px);
  line-height: 1.35;
  font-weight: 700;
  color: var(--ink);
}

.sectionTitle {
  font-size: 20px;
  line-height: 1.35;
  font-weight: 700;
  color: var(--ink);
}

.body {
  font-size: 15px;
  line-height: 1.75;
  color: var(--ink-soft);
}

.small {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
}

.label {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 650;
  color: var(--ink-soft);
}
```

---

## 5. Buttons

### Primary

```css
.buttonPrimary {
  min-height: 50px;
  padding: 0 22px;
  border: 0;
  border-radius: var(--radius-small);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 6px 14px rgba(55, 73, 200, .18);
  transition:
    transform var(--motion-fast) var(--ease-standard),
    box-shadow var(--motion-fast) var(--ease-standard),
    opacity var(--motion-fast) var(--ease-standard);
}
```

### Secondary

```css
.buttonSecondary {
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-small);
  background: rgba(255, 255, 255, .88);
  color: var(--ink);
  font-weight: 650;
}
```

### Outline primary

```css
.buttonOutlinePrimary {
  min-height: 48px;
  padding: 0 20px;
  border: 1.5px solid #8fa0ee;
  border-radius: var(--radius-small);
  background: rgba(255, 255, 255, .88);
  color: var(--primary-dark);
  font-weight: 700;
}
```

### Destructive

```css
.buttonDanger {
  border-color: rgba(208, 91, 67, .45);
  color: #b34e3d;
  background: #fffaf7;
}
```

### Shared interaction

```css
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
[role="radio"]:focus-visible {
  outline: 3px solid var(--primary-ring);
  outline-offset: 2px;
}

button:disabled {
  opacity: .48;
  cursor: not-allowed;
  transform: none;
}
```

---

## 6. Inputs

```css
.field {
  display: grid;
  gap: 7px;
}

.input,
.textarea {
  width: 100%;
  border: 1px solid #cbd0da;
  border-radius: var(--radius-small);
  background: rgba(255, 255, 255, .86);
  color: var(--ink-soft);
  transition:
    border-color var(--motion-fast) var(--ease-standard),
    box-shadow var(--motion-fast) var(--ease-standard);
}

.input {
  height: 46px;
  padding: 0 14px;
}

.textarea {
  min-height: 92px;
  padding: 12px 14px;
  resize: vertical;
}

.input::placeholder,
.textarea::placeholder {
  color: #a8abb3;
}
```

---

## 7. Chips

```css
.axisChip {
  display: inline-flex;
  align-items: center;
  min-height: 27px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
}

.axisChip[data-axis="P"] {
  color: #304bc8;
  background: #edf1ff;
}

.axisChip[data-axis="E"] {
  color: #247b5d;
  background: #e1f5e9;
}

.axisChip[data-axis="U"] {
  color: #8a6500;
  background: #fff3c7;
}

.axisChip[data-axis="M"] {
  color: #b34932;
  background: #ffece4;
}

.axisChip[data-axis="H"] {
  color: #375fc4;
  background: #eaf0ff;
}
```

---

## 8. Cards

### Standard card

```css
.paperCard {
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  background:
    linear-gradient(rgba(255,255,255,.94), rgba(255,255,255,.94)),
    url("/assets/paper-texture.webp");
  box-shadow: var(--shadow-card);
}
```

### Answer card

```css
.answerCard {
  position: relative;
  min-height: 178px;
  padding: 26px 18px 22px;
  border: 1px solid #d8dadf;
  border-radius: var(--radius-card);
  background: rgba(255,255,255,.86);
  color: var(--ink-soft);
  text-align: center;
  cursor: pointer;
}

.answerCard[data-selected="true"] {
  border: 2px solid var(--primary);
  background:
    radial-gradient(circle at 50% 70%, rgba(78, 102, 228, .07), transparent 65%),
    #fbfcff;
  box-shadow: var(--shadow-selected);
}
```

### Selected check

```css
.answerCheck {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--primary);
  color: white;
}
```

---

## 9. Progress

```css
.progressTrack {
  height: 8px;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: #eeeeec;
}

.progressFill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #5267e6, #3f55dc);
}
```

---

## 10. Radar chart tokens

```ts
export const RADAR_STYLE = {
  gridStroke: "#CCD0D8",
  axisStroke: "#D8DAE0",
  fill: "rgba(69, 89, 222, 0.23)",
  stroke: "#4559DE",
  pointFill: "#4559DE",
  pointStroke: "#FFFFFF",
  pointRadius: 4,
};
```

- Five grid rings
- One outer pentagon
- No chart background fill
- Labels outside outer ring
- Use SVG `vector-effect="non-scaling-stroke"` where useful

---

## 11. Doodle components

Recommended API:

```ts
type DoodleKind =
  | "underline-yellow"
  | "underline-blue"
  | "underline-mint"
  | "star"
  | "curved-arrow"
  | "growth-arrow"
  | "flag"
  | "connector-plan"
  | "connector-execute";

type DoodleProps = {
  kind: DoodleKind;
  className?: string;
  title?: string;
};
```

- Decorative doodles should use `aria-hidden="true"`.
- Doodle SVGs must not use IDs that collide across instances.
- Use explicit viewBox and preserveAspectRatio.
- Never animate them by default.

---

## 12. Toast and modal

### Toast

```css
.toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 50;
  min-width: 260px;
  max-width: min(520px, calc(100vw - 40px));
  padding: 13px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-card);
}
```

### Modal

- Backdrop: `rgba(15, 24, 55, .18)`
- Dialog width: 420px
- Paper surface
- Title navy
- Two clear buttons
- Focus trap and Escape support

---

## 13. Responsive tokens

```css
@media (max-width: 1150px) {
  :root {
    --surface-max: 984px;
  }
}

@media (max-width: 899px) {
  .wideApp {
    display: none;
  }

  .wideOnlyNotice {
    display: grid;
  }
}

@media (min-width: 900px) {
  .wideApp {
    display: block;
  }

  .wideOnlyNotice {
    display: none;
  }
}
```

Use component-level CSS to reduce gaps at 1024px rather than globally shrinking all text.

---

## 14. Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
```

---

## 15. Asset constraints

- `paper-texture.webp`: 512×512 or smaller, <120KB preferred
- `pencil-transparent.webp/png`: <300KB preferred
- Use responsive `width`, never fixed natural dimensions
- No generated text in image assets
- All functional icons remain SVG
