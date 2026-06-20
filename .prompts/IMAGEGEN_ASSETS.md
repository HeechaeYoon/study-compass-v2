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
