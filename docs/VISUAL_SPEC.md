# Visual Specification

## 1. Visual north star

Primary reference: `reference/design-board.png`

The desired feeling is:

> A carefully designed Korean study worksheet and notebook, combined with a polished educational dashboard.

It must feel warm, calm, structured, and credible. It must not look like a generic SaaS dashboard, a children's game, a personality quiz, or a scrapbook.

Key visual ingredients:

- Warm ivory paper background
- White paper-like content surfaces
- Deep navy Korean typography
- Indigo blue as the main interaction color
- Small mint, yellow, orange, and coral accents
- Thin gray hand-drawn connectors and doodles
- Slightly imperfect underlines
- Quiet shadows and 1px borders
- Generous horizontal spacing
- Card-based choices
- A custom 5-axis radar chart
- Notebook-paper prompt preview
- A realistic but understated orange pencil decoration

---

## 2. Reference files

| File | Use |
|---|---|
| `reference/design-board.png` | Full visual context |
| `reference/header-reference.png` | Shared header |
| `reference/start-screen-reference.png` | Start screen |
| `reference/question-screen-reference.png` | Question screen |
| `reference/result-screen-reference.png` | Result screen |
| `reference/prompt-screen-reference.png` | Prompt screen |
| `reference/manifest.json` | Crop coordinates and annotation masks |

The blue numbered tags in the screen crops are board annotations and must be ignored during production rendering and masked during visual comparison.

---

## 3. Canonical canvas

### Primary

```text
Viewport: 1280 × 800
Pixel ratio for baseline screenshots: 1
Browser: Chromium
Zoom: 100%
```

### Shared layout

```text
App header: 72px high
Main top gap: 16px
Main horizontal inset: 32px
Main max width: 1216px
Main content surface height target: 680px
Bottom breathing room: 24px
```

At 1280px:

```text
32px + 1216px + 32px = 1280px
```

At wider viewports, keep the surface at a maximum of 1280px and center it. At 1024px, reduce the outer inset to 20px and gaps via `clamp()`.

---

## 4. Global background

### Base

- Color: `#F7F4EE`
- Use a local seamless paper texture as a pseudo-element.
- Texture opacity: 0.10–0.16
- Texture blend: `multiply` or `soft-light`
- Texture scale: 260–360px tile
- Avoid visible repeating seams.

Suggested CSS:

```css
.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(rgba(247, 244, 238, 0.90), rgba(247, 244, 238, 0.90)),
    url("/assets/paper-texture.webp");
  background-repeat: repeat;
  background-size: 320px 320px;
  color: var(--ink);
}
```

The background must remain quiet. If the texture is obvious at first glance, it is too strong.

---

## 5. Shared header

### Geometry

- Height: 72px
- Padding: `0 36px`
- Display: flex, align center, justify between
- Bottom border: `1px solid rgba(27, 36, 66, 0.13)`
- Background: translucent warm paper, not glassmorphism
- No drop shadow

### Left cluster

- Main title: `나의 공부 스타일을 탐색하는 시간`
- Subtitle: `자기주도학습 유형 진단`
- Vertical divider between title and subtitle
- Yellow hand-drawn underline below the title
- The underline starts around 15% into the title and extends to 96%.

### Typography

- Main title:
  - 30px at 1280px
  - weight 700
  - line-height 1
  - color `#101D4B`
  - display font
- Subtitle:
  - 13px
  - weight 500
  - color `#3F465A`
- Divider:
  - height 28px
  - `#D5D2CB`

### Right cluster

- Small hand-drawn star icon
- Text:
  - `총 16문항`
  - separator
  - `5가지 학습 축`
  - separator
  - `약 5~7분 소요`
- Font size: 13px
- Color: `#444957`
- Gap: 14px
- Star: 25–30px, gray-blue line

### Header responsive behavior

- At 1024–1150px: main title 26px; right metadata 12px; subtitle can shorten to `자기주도학습 진단`.
- At 900px or below: replace app with unsupported-width guidance.

---

## 6. Main paper surface

Every core screen uses one main surface.

```css
.screen-surface {
  width: min(1216px, calc(100vw - 64px));
  min-height: 660px;
  margin: 16px auto 24px;
  border: 1px solid rgba(53, 56, 70, 0.17);
  border-radius: 10px;
  background:
    linear-gradient(rgba(255,255,255,.94), rgba(255,255,255,.94)),
    url("/assets/paper-texture.webp");
  box-shadow:
    0 2px 4px rgba(30, 37, 60, .08),
    0 12px 28px rgba(45, 39, 26, .06);
}
```

Do not use large 20–24px SaaS radii. Reference surfaces are restrained and paper-like.

---

## 7. Color palette

Use these as initial values, then tune by screenshot comparison.

| Token | Hex | Use |
|---|---|---|
| Ink / deep navy | `#101D4B` | headings, primary text |
| Ink soft | `#30384F` | body |
| Muted | `#777C89` | support text |
| Primary indigo | `#4559DE` | CTA, progress, selection |
| Primary dark | `#3148D4` | CTA gradient end |
| Primary pale | `#EEF1FF` | selected-card fill |
| Blue outline | `#4D68E6` | selected border |
| Mint | `#43C99B` | execution/help accents |
| Mint pale | `#E6F7EE` | chips |
| Yellow | `#F5BE2E` | understanding/growth highlight |
| Yellow pale | `#FFF5C7` | growth card |
| Coral | `#F16D48` | checking/target icon |
| Soft orange | `#E8A45E` | pencil |
| Border | `#D9D9D6` | surfaces, fields |
| Border dark | `#BFC3CD` | focused fields |
| Background | `#F7F4EE` | app |
| Surface | `#FFFEFC` | cards |
| Success/blue-gray | `#5371D8` | chart secondary |
| Hand-doodle gray | `#8E96A6` | stars/arrows/connectors |

No pure black. No neon colors. No high-saturation rainbow gradients.

---

## 8. Typography

### Font strategy

- Display: `Gowun Dodum` or a visually closer bundled Korean font
- Body: `Pretendard`
- Fallback:
  - `Apple SD Gothic Neo`
  - `Noto Sans KR`
  - `Malgun Gothic`
  - sans-serif

Do not fetch fonts from Google at runtime.

### Type scale

| Role | Size / line height | Weight |
|---|---|---|
| App title | 30 / 1.0 | 700 |
| Hero heading | 34 / 1.35 | 700 |
| Question heading | 34 / 1.35 | 700 |
| Result type | 38 / 1.15 | 700 |
| Section title | 20 / 1.35 | 700 |
| Card title | 17 / 1.3 | 700 |
| Body | 15 / 1.75 | 400–500 |
| Small body | 13 / 1.65 | 400 |
| Label | 12 / 1.4 | 600 |
| Button | 16 / 1 | 700 |
| Micro | 11 / 1.4 | 400–500 |

### Text appearance

- Korean text should not be overly letter-spaced.
- Use `word-break: keep-all`.
- Keep question lines to no more than two lines at canonical width.
- Use underlines as SVG decoration, not CSS text-decoration.

---

## 9. Lines, borders, radii, shadows

### Borders

- Default: 1px warm gray
- Selected answer: 2px indigo
- Focused field: 1.5–2px indigo
- Divider: 1px gray at 50–80% opacity

### Radii

| Element | Radius |
|---|---|
| Main surface | 10px |
| Option cards | 9px |
| Small info cards | 8px |
| Inputs | 7px |
| CTA | 7px |
| Chips | 999px |
| Check circle | 50% |

### Shadows

- Surface: subtle two-layer shadow
- Axis cards: `0 3px 8px rgba(25,34,60,.10)`
- Selected card: optional `0 6px 16px rgba(69,89,222,.10)`
- Notebook: slightly stronger paper shadow
- Do not use broad colored glow.

---

## 10. Hand-drawn visual language

Implement with custom inline SVG paths.

### Required doodles

- Yellow rough underline
- Blue rough underline
- Mint rough underline
- Small five-point scribble star
- Curved arrow
- Pencil-line progress ending
- Axis card connector path
- Small flag
- Rising line arrow in growth card
- Notebook binding loops or holes

### Stroke style

- Stroke width: 1.6–2.2px
- Line cap: round
- Line join: round
- Slight path asymmetry
- Opacity: 0.65–0.95
- No cartoon face or character

Create a reusable `<Doodle />` SVG component library with deterministic paths. Do not use randomly generated paths at runtime because screenshots must be stable.

---

## 11. Icon style

Use outline icons with 1.7–2px stroke.

Recommended semantic mapping:

| Axis | Icon | Accent |
|---|---|---|
| 계획 | Calendar | Indigo |
| 실행 | PlayCircle | Mint |
| 이해 | BookOpen | Yellow |
| 점검 | ClipboardCheck | Coral |
| 도움 | Users | Blue |
| 강점 | Trophy | Indigo |
| 균형 | ChartNoAxesCombined / BarChart | Mint |
| 추천 전략 | Target | Coral |

Lucide icons are acceptable if their stroke and proportions are adjusted consistently. Avoid mixing icon sets.

---

# Screen S1 — Start

## 12. Start screen macro layout

### Surface

- Padding: 48px 40px 24px
- Layout rows:
  1. Main content
  2. Privacy strip

```text
Main row height: ~480px
Privacy strip: 62px
Gap: 18px
```

### Main grid

```css
grid-template-columns: 350px minmax(0, 1fr);
column-gap: 68px;
```

### Left hero block

Position:

- Top: 54px relative to surface
- Left: 38px
- Width: 340px

Elements:

1. Hero heading, two lines
2. Body copy with blue underline under the second line
3. Nickname label
4. Nickname input with pencil icon
5. Primary button

#### Hero heading

```text
나의 공부 스타일을
탐색하는 시간
```

- 34px
- 700
- Deep navy

#### Body

```text
나에게 맞는 학습 방법을 알고 있으면
공부가 더 효율적이고 즐거워져요.
```

- 15px
- 1.8 line-height
- Blue rough underline under the second sentence

#### Nickname input

- Width: 320px
- Height: 50px
- Border: `#C9CEDA`
- Placeholder: `예) 지혜로운 독서가`
- Right pencil icon
- Label: `닉네임을 입력해 주세요`
- Input is optional; include `(선택)` in accessible label or helper text.

#### CTA

- Width: 320px
- Height: 58px
- Margin-top: 14px
- Gradient: indigo left to dark indigo right
- White text `시작하기`
- Arrow icon on right
- Slight shadow
- Hover: translateY(-1px), no dramatic glow

### Right axis constellation

Use five cards in a 2-over-3 arrangement.

Reference logical arrangement:

```text
              [ 계획 ]       [ 실행 ]

      [ 이해 ]       [ 점검 ]       [ 도움 ]
```

Approximate card size at 1280 canvas:

- Width: 166px
- Height: 154px
- Gap top row: 90px
- Gap bottom row: 36px

Cards:

- White surface
- 1px gray border
- 8px radius
- subtle shadow
- 18px padding
- icon + title row
- two-line question
- colored rough underline near bottom

Card copy:

- 계획: `공부를 시작하기 전, 어떻게 계획하나요?`
- 실행: `공부할 때, 어떻게 실천하나요?`
- 이해: `어려운 내용을 어떻게 이해하나요?`
- 점검: `공부한 내용을 어떻게 확인하나요?`
- 도움: `누구에게 도움을 받고 있나요?`

Behind cards:

- gray hand-drawn connector paths
- small arrow heads
- right-side flag
- connectors must never cross readable text

### Privacy strip

- Full available width
- Height: 62px
- Border: 1px blue-gray
- Radius: 8px
- Background: very light white
- Label floats slightly above top border: `개인정보 보호 안내`
- Four evenly spaced items:
  - person icon: `이름 대신 닉네임 사용`
  - shield: `응답 데이터는 익명으로 처리`
  - lock: `진단 결과는 본인에게만 제공`
  - trash: `저장되지 않으며, 진단 후 삭제`

Because the actual app can save locally, change the last two lines to accurate language:

- `저장 전에는 기기에 남기지 않음`
- `저장 결과는 언제든 삭제 가능`

Do not claim true anonymity if a nickname is entered. Use the exact privacy copy in `CONTENT_AND_SCORING.md`.

---

# Screen S2 — Question

## 13. Question screen layout

### Surface padding

- Top: 32px
- Left/right: 34px
- Bottom: 28px

### Progress row

Grid:

```text
question count | progress bar | remaining time
```

- Count width: 70px
- Bar flexes
- Remaining width: 120px
- Bar height: 8px
- Track: `#F0F0EF`
- Fill: indigo
- Rounded
- Add a small pencil-tip doodle at current end only if it does not obstruct readability.

### Question content

- Top chip: axis label
- Chip background based on axis
- Heading max width: 720px
- Heading 34px, two lines max
- A mint/gray hand-drawn arrow or star may sit beside the heading, not behind text.

### Answer cards

- Horizontal row
- Component must support 4 or 5 items.
- Gap: 16px
- Minimum height: 178px
- Vertical content centered
- Unselected:
  - white surface
  - 1px gray border
  - no heavy shadow
- Selected:
  - 2px blue border
  - pale indigo gradient/fill
  - blue check circle at top-right
  - small elevated shadow

For a 5-choice scenario at 1280:

```text
card width: approximately 185px
row usable width: approximately 1030px
```

For 4-point Likert:

- Use 4 wider cards while preserving the same row width.
- Do not leave them bunched to the left.

### Dot indicator

The reference shows four small dots at the top of each answer card.

- Use four dots to indicate direction/intensity.
- Each card uses muted-to-accent coloring.
- Dot size: 9px
- Gap: 6px
- Do not rely on dots alone; full text label is required.

### Footer navigation

- Previous button: left
- Honest-response hint: centered
- Next button: right
- Buttons width 110–130px, height 50px
- Previous white with border
- Next indigo
- `다음` disabled until answer
- Hint icon: lightbulb, text `솔직하게 선택할수록 결과가 더 정확해요.`

---

# Screen S3 — Result summary

## 14. Result screen layout

### Surface padding

- 36px 38px 28px
- Main region around 430px
- Bottom summary cards around 110px

### Main grid

```css
grid-template-columns: 0.82fr 1.18fr;
gap: 34px;
```

### Left result narrative

1. Eyebrow: `진단이 완료되었어요!`
2. Line: `당신의 학습 성향은`
3. Type name: large 38px
4. Gray star doodle
5. Mint underline under type
6. Two-line description
7. Growth card

Example:

```text
당신의 학습 성향은
전략 설계형
```

Use personalized title if nickname exists:

```text
민트고래님의 학습 성향은
전략 설계형
```

### Growth card

- Warm yellow paper rectangle
- Width: 390px
- Height: 130px
- Slight texture
- Heading highlighted by yellow rough stroke
- Growth text 2–3 lines
- Rising arrow doodle at bottom-right

### Radar area

- Centered custom SVG
- Target size: 360×320
- Five grid polygons, thin gray
- Axis points and labels around outside
- Filled polygon:
  - fill indigo at 20–28% opacity
  - stroke indigo 2px
  - point circles 4px
- Labels:
  - icon
  - axis name
  - optional small display score 1.0–5.0
- Put `낮음 1 ... 5 높음` legend below.
- Do not use default chart-library tooltip or fonts.

### Bottom summary cards

Three columns:

1. 강점
2. 균형
3. 추천 전략

- Height: 98–110px
- White surface
- 1px border
- 8px radius
- icon at left
- title and one-line summary
- equal widths

Actual content must use the computed result.

---

# Screen S4 — AI prompt

## 15. Prompt screen layout

### Main grid

```css
grid-template-columns: 0.88fr 1.12fr;
gap: 40px;
```

### Left form

- Tabs at top:
  - `AI 프롬프트`
  - `학습 전략 가이드`
- Active tab:
  - indigo text
  - blue underline 2px
- Intro text below tabs

Fields in vertical stack:

1. 과목
2. 단원
3. 이번 학습 목표
4. 현재 상황
5. 어려운 점
6. 원하는 도움
7. 학생 메모 포함 checkbox

The reference shows four fields. At canonical height, group optional fields into two-column rows or use compact 46px fields so the form fits without a dense appearance.

Input:

- Height 46px
- Border 1px
- Radius 7px
- Label 12px semibold
- Placeholder light gray
- Gap between fields 12px

Primary action:

- Outline indigo button `프롬프트 생성하기`
- Pencil icon
- Height 50px
- When fields change, preview can update live; button may flash highlight and move focus to preview.

### Notebook preview

Composition:

- Pale blue paper backing rotated 1–2 degrees
- White notebook sheet above it rotated -0.5–1 degree
- Sheet width ~550px
- Sheet height ~570px
- Left binding holes or loops
- Quiet paper texture
- Stronger shadow than normal cards
- Title: `프롬프트 미리보기`
- Cyan rough underline
- Copy button top-right
- Dynamic text with blue highlighted placeholders/values
- Bottom hint strip:
  - info icon
  - `프롬프트를 복사해서 Gemini 등 AI 챗봇에 붙여넣어 사용하세요.`

### Pencil asset

- Large orange wood pencil
- Positioned along lower-right edge
- Slight diagonal angle
- May extend outside the main surface but must not cause document overflow
- Use `pointer-events: none`
- Must not cover copy button or prompt text
- At 1024 width, shrink or hide if it obstructs content

---

## 16. Expanded detail sections

The result and prompt screens include content beyond the reference board. Keep the same design language.

### Accordion

- White paper cards
- 1px border
- 8px radius
- navy title
- small chevron
- expanded content has no heavy inset shadow
- gap 10px
- use smooth but subtle height transition

### Strategy cards

- small colored icon
- title
- concise action
- one accent underline
- no emojis

### Save/delete area

- Secondary buttons
- destructive action in muted coral outline, not bright red
- confirmation modal uses the same paper surface style

---

## 17. Interaction states

### Hover

- Only on pointer devices
- translateY -1px
- slight border darkening
- no scaling above 1.01

### Focus

- 3px outer ring using `rgba(69,89,222,.22)`
- maintain border
- visible for keyboard and touch accessibility

### Selected option

- pale blue fill
- 2px indigo border
- blue circular check
- text remains navy

### Disabled

- opacity 0.45–0.55
- cursor not-allowed
- preserve text contrast

### Toast

- bottom center or top-right within app max width
- paper-white surface
- navy text
- icon
- 2.5–3s
- `aria-live="polite"`

---

## 18. Motion

- `transition-duration: 180ms`
- `transition-timing-function: cubic-bezier(.2,.8,.2,1)`
- Page state:
  - fade 0→1
  - translateY 6px→0
- Do not animate radar polygon from zero during screenshot tests.
- Respect `prefers-reduced-motion: reduce`.

---

## 19. Wide responsive rules

### 1440–1920px

- Header max inner width 1440px
- Surface max 1280px
- Keep text size mostly fixed
- Increase outer whitespace, not component size

### 1024–1279px

- Reduce surface width and horizontal padding
- Reduce axis-card gaps
- Question cards shrink with min-width
- Result grid remains two columns down to 1024
- Prompt pencil may shrink 15–25%

### Below 900px

Render a dedicated guidance card:

```text
이 활동은 가로 화면에 맞춰져 있어요.
태블릿을 가로로 돌리거나 PC에서 다시 열어주세요.
```

Do not attempt a full one-column mobile redesign for v1.

---

## 20. Visual anti-patterns

Fail the visual review if any are present:

- Oversized rounded pill cards everywhere
- Purple/blue neon gradient background
- Glassmorphism
- Default shadcn or Material appearance
- Generic dashboard sidebar
- Emoji icons
- 3D illustration characters
- Cartoon animals
- Excessive confetti
- Dark theme
- Bright red warnings
- Dense text wall on the first result screen
- Whole-screen AI-generated bitmap
- Random doodles that change every render
- Paper texture stronger than text
- Pencil covering functional content
