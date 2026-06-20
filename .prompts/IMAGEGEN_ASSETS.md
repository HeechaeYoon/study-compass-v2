# ImageGen Asset Log

> Codex: Do not delete prior attempts. Append revisions with a date/time.

## Shared style clause

```text
Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

## Paper texture

### Revision 1

Date: 2026-06-20

Mode: built-in `image_gen`

Reference: `reference/design-board.png` was inspected first and used as the visual target; the generated asset is an isolated texture only, not UI.

Prompt:

```text
Use case: stylized-concept
Asset type: seamless paper texture tile for a local web app asset
Primary request: Create a square seamless paper texture tile for a refined Korean educational web interface.
Scene/backdrop: top-down uniform lighting, no objects
Subject: warm ivory paper texture approximately #F7F4EE
Style/medium: realistic tactile stationery texture, subtle and minimal
Composition/framing: square tile, edge-to-edge, intended to repeat seamlessly at about 320px in CSS
Lighting/mood: soft natural even light, very low contrast
Color palette: warm off-white ivory, no strong yellow or brown
Materials/textures: high-quality uncoated notebook paper with extremely subtle fibers and tiny tonal variations
Text (verbatim): none
Constraints: Make the edges tile seamlessly. The texture must remain almost invisible behind dark navy Korean text and white cards. No stains, no folds, no ruled lines, no handwriting, no printed text, no borders, no objects, no strong grain.
Avoid: aged parchment, visible seams, large fibers, stains, gradients, watermarks, logos, interface elements, cartoon style, dramatic shadows, neon colors.
Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

Candidates:

- Paper candidate A: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a3570152348819184c6110571c71e61.png`
- Paper candidate B: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a35704137f4819180fc4d5de9532e1f.png`
- Paper candidate C: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a357077c0a88191a6b17d4b2ff48203.png`

Selected:

```text
Paper candidate C -> public/assets/paper-texture.webp
```

Reason:

```text
Candidate C is the quietest texture. A and B have more visible fibers and risk reading as aged craft paper behind body text. C is still warm and tactile but safer at 10-16% CSS opacity.
```

Processing:

```text
Resize/crop to 512 square, blend toward #F7F4EE to reduce contrast, export WebP quality 78.
```

## Pencil

### Revision 1

Date: 2026-06-20

Mode: built-in `image_gen`

Prompt:

```text
Use case: product-mockup
Asset type: isolated decorative pencil asset for a local web app
Primary request: Generate one understated orange wooden school pencil decoration matching a warm Korean study-note interface.
Scene/backdrop: perfectly flat pure white #ffffff background, no floor plane
Subject: a single long slender pencil with orange-yellow painted hex body, pale sharpened wood, crisp graphite tip, restrained matte ferrule, muted coral eraser
Style/medium: refined realistic stationery illustration, less glossy, mature school-notebook mood
Composition/framing: almost top-down, diagonal from lower-right to upper-left, full pencil visible, generous padding for clean cutout
Lighting/mood: soft even light, no cast shadow, no contact shadow, no dramatic highlights
Color palette: soft orange-yellow, light wood beige, graphite gray, muted metal gray, coral eraser
Materials/textures: subtle wood grain and matte painted body, clean sharpened point
Text (verbatim): none
Constraints: exactly one pencil; no brand text, no logo, no other objects, no notebook, no ruler, no UI; pure white background for deterministic background removal; must not look childish or dark brown.
Avoid: multiple pencils, hard shadow, colored background, broken/blunt tip, oversized eraser, watermark, interface elements, text.
Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

Candidates:

- Pencil candidate A: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a3570c7c31881918cb8ea0d66b28e93.png`
- Pencil candidate B: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a3570ee62f88191aca22cf5d1387405.png`
- Pencil candidate C: `/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945/ig_0eec34de761a497b016a357114ae788191b7989de80de772e2.png`

Selected:

```text
Pencil candidate C -> public/assets/pencil-transparent.webp
```

Reason:

```text
Candidate C best matches the reference angle and mature stationery feel. It is less glossy than A, cleaner than B, and has no brand text or extra objects.
```

Processing:

```text
Resize to 1100px high, remove near-white background with feathered alpha, trim transparent bounds, add 24px transparent padding, export WebP quality 86 alphaQuality 90.
```

## Optional blue paper texture

Only use if required after visual comparison.

Status:

```text
Not generated in Revision 1. CSS backing paper will be tried first as required.
```

## Start hero learning map

### Revision 2

Date: 2026-06-20

Mode: built-in `image_gen`

User-approved direction:

```text
학습 지도 콜라주
```

Prompt base:

```text
Use case: stylized-concept
Asset type: start screen hero illustration for a Korean middle-school self-directed learning web app
Primary request: Create a warm top-down study map collage that represents a student's self-directed learning journey, without any readable text.
Scene/backdrop: refined Korean educational stationery on warm ivory paper, calm desk surface, subtle tactile paper texture.
Subject: an open blank planner and layered blank paper scraps arranged like a map, with a hand-drawn dotted route, gentle compass/path motif, small blank sticky notes, a pencil, eraser, paper clip, and colored circular markers. The route should suggest a calm journey through planning, doing, understanding, reviewing, and asking for help, but with no words or labels.
Style/medium: refined realistic stationery illustration, soft hand-crafted workbook feel, polished enough for a production educational web app, not childish.
Composition/framing: wide landscape composition; main objects form a cohesive cluster that fits a right-side hero area about 620 by 420 CSS pixels; leave breathing room and avoid edge clutter.
Lighting/mood: soft natural light, warm, reassuring, quietly motivational.
Color palette: warm ivory, navy blue linework, soft indigo, mint green, muted yellow, coral accent.
Materials/textures: matte paper, blank notebook, sticky notes, wooden pencil, soft eraser, subtle paper fibers and shadows.
Text (verbatim): none. No letters, no numbers, no labels, no pseudo-handwriting.
Constraints: no UI cards, no buttons, no app screen, no computer screen, no robot, no chatbot, no characters, no faces, no logos, no watermark, no readable writing, no grades/ranks. Avoid generic AI visuals, neon, futuristic effects, glossy 3D, childish stickers, clutter, dramatic shadows, and tiny illegible glyphs.
```

Candidates:

- Hero map candidate A: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_09d05b312e641711016a3622d1553481918643895fe71324ee.png`
- Hero map candidate B: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_09d05b312e641711016a36231bdf548191b0fad3801108317f.png`
- Hero map candidate C: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_09d05b312e641711016a362359331481918adaa216bf0f41ff.png`

Selected:

```text
Hero map candidate C -> public/assets/start-hero-map.webp
```

Reason:

```text
Candidate C best communicates a learning-map journey through stationery, route markers, and a blank notebook without AI or app UI cues. Candidate A was richer but heavier and included more real compass imagery; candidate B had more open space but felt less connected to the app identity.
```

Processing:

```text
Resize to 1180px wide without enlargement, export WebP quality 84.
```

### Revision 3

Date: 2026-06-20

Mode: built-in `image_gen`

User direction:

```text
새로 이미지를 생성해서 기존 히어로 페이지와 조화되게 만들고, 특정 프레임 안에 이미지를 첨부한 느낌이 아니라 화면에 자연스럽게 녹아나도록 한다.
```

Prompt base:

```text
Use case: stylized-concept
Asset type: borderless start hero asset for a Korean middle-school self-directed learning web app
Primary request: Create a warm hero visual that blends naturally into an off-white web app surface, as if study tools are gently laid on the page rather than inside a framed picture.
Scene/backdrop: almost pure warm white paper surface matching #fffefc, no visible rectangular backdrop, no border, no frame. The edges of the entire image must remain mostly empty warm white so it can disappear into a white app background.
Subject: a calm self-directed learning map made from an open blank notebook, one warm wooden pencil, a few very light blank paper scraps, tiny check marks, and a soft dotted route. Keep all objects clustered near the center with generous white/ivory breathing room around every edge.
Style/medium: refined realistic stationery illustration with a subtle hand-crafted Korean educational workbook feeling; polished, warm, age-appropriate for middle-school students; not childish.
Composition/framing: wide landscape composition for a right-side website hero area. Central floating collage, no hard crop. The outer 15-20 percent on all sides should be plain #fffefc or nearly identical warm white with no objects or texture seams.
Lighting/mood: soft natural light, reassuring, quiet, self-directed learning mood. Very subtle shadows only under objects, no dramatic shadow.
Color palette: warm white #fffefc, gentle ivory, deep navy linework, soft indigo, muted mint, tiny coral/yellow accents.
Materials/textures: matte notebook paper, light stationery, soft pencil wood, very subtle paper fibers; all paper must visually blend into the warm white surface.
Text (verbatim): none. No letters, no numbers, no pseudo-writing.
Constraints: no frame, no border, no rounded rectangle, no UI card, no app screen, no computer, no phone, no chatbot, no robot, no AI symbols, no faces, no characters, no logo, no watermark. Avoid edge clutter. Do not make the image look like a photo pasted inside a card.
Avoid: beige rectangular background, framed poster look, strong drop shadow, dark corners, vignette, readable writing, labels, neon, glossy 3D, childish stickers.
```

Candidates:

- Borderless hero candidate A: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_0b13684bb1ee0770016a362ef252b881918cda7b8c04ae4168.png`
- Borderless hero candidate B: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_0b13684bb1ee0770016a362f43b4f4819193f2d9c1681e934b.png`
- Borderless hero candidate C: `/home/heechae/.codex/generated_images/019ee32b-539b-7ac1-939f-d9abda2cf3b1/ig_0b13684bb1ee0770016a362fbea5208191ba31aa759871999f.png`

Selected:

```text
Borderless hero candidate A -> public/assets/start-hero-map-v2.webp
```

Reason:

```text
Candidate A is the user-selected image. It keeps the borderless warm-white surface, has the strongest learning-map route across the top, and gives the notebook/pencil collage enough presence for the hero area without UI, AI, or frame cues.
```

Processing:

```text
Crop the source to the central learning-map area (1200x717 from x=240, y=130), resize to 1180px wide, modulate brightness 1.015 and saturation 0.96, export WebP quality 86 alphaQuality 90. CSS keeps the reduced copy/artwork spacing and removes the previous hard image frame.
```

Status:

```text
Current app hero asset after user corrected the intended reference image.
```
