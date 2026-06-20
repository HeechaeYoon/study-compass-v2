# Asset Generation with `$imagegen`

## 1. Principle

Use image generation only where a raster asset materially improves fidelity.

The interactive interface must remain HTML, CSS, and SVG. Do not generate a screenshot of the whole app and place clickable elements on top of it.

### Generate

1. Seamless warm paper texture
2. Orange wooden pencil decoration
3. Optional subtle blue paper backing texture if CSS alone looks too flat

### Do not generate

- Korean text
- Buttons
- Cards
- Forms
- Icons
- Radar chart
- App header
- Entire notebook UI
- Full screens
- Character illustrations

---

## 2. Required workflow

1. Read `reference/design-board.png`.
2. Explicitly invoke `$imagegen`.
3. Generate at least 3 candidates for each required asset.
4. Save the exact prompts in `.prompts/IMAGEGEN_ASSETS.md`.
5. Inspect candidates at actual UI size.
6. Select the candidate that best matches the reference, not the most visually dramatic candidate.
7. Process with `sharp` if needed.
8. Save optimized files under `public/assets/`.
9. Record selected filename, source candidate, processing steps, and reason in `public/assets/generated-assets.json`.
10. Re-run screenshots after integration.

Do not accept the first candidate automatically.

---

## 3. Global asset style prompt

Reuse the following style clause in every generation prompt.

```text
Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

---

## 4. Asset A — paper texture

### Filename

```text
public/assets/paper-texture.webp
```

### Generation prompt

Invoke `$imagegen` with the reference board attached if possible.

```text
Create a square seamless paper texture tile for a refined educational web interface.

The paper is warm ivory, approximately #F7F4EE, with extremely subtle natural fibers and tiny tonal variations. It should feel like high-quality uncoated notebook paper, not aged parchment. No stains, no folds, no ruled lines, no handwriting, no printed text, no borders, no objects, no strong grain. The texture must remain almost invisible behind dark navy Korean text and white cards.

Make the edges tile seamlessly. Uniform top-down lighting. Low contrast. The final texture will be repeated at about 320px size and shown at only 10–16% opacity.

Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

### Candidate rejection

Reject if:

- yellow or brown aged-paper color
- visible stains
- large fibers
- obvious repeating shapes
- ruled lines
- gradients that create tile seams
- visible texture over body text at 15% opacity

### Processing

- Crop square if needed
- Resize to 512×512
- Check seamless edges
- Reduce contrast
- Export WebP quality 70–82
- Target <120KB

If generated texture is not truly seamless, create a seamless tile in a script using mirrored quadrants and feathered seams.

---

## 5. Asset B — orange pencil

### Filename

```text
public/assets/pencil-transparent.webp
```

### Generation prompt

```text
Generate one isolated sharpened wooden school pencil viewed from above, matching a warm refined educational stationery design.

The pencil has a natural orange-yellow painted body, exposed light wood near the sharpened graphite tip, a small muted metal ferrule, and a soft coral eraser. It is long and slender, realistic but slightly illustrated, clean and elegant rather than photorealistic. The perspective is almost top-down with a slight diagonal angle. Use a pure white background, no cast shadow, no other objects, no text, no logo, no ruler, no notebook.

The pencil will be placed diagonally along the lower-right edge of a notebook-shaped UI panel. It must remain readable at about 260–340px CSS height.

Visual style: refined Korean educational stationery, warm off-white paper, calm and minimal, realistic tactile texture, subtle hand-crafted feel, soft natural light, low contrast, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows, suitable for a polished middle-school learning web app.
```

### Candidate rejection

Reject if:

- pencil has brand text
- perspective is strongly 3D
- multiple pencils
- hard shadow
- oversized eraser
- childish/cartoon proportions
- colored background
- broken or blunt tip
- pencil is too dark brown
- asset has notebook or UI baked in

### Background removal

The generation may include a white background. Remove it deterministically.

Suggested `sharp` strategy:

1. Convert to RGBA.
2. Measure distance from white for each pixel.
3. Alpha 0 for near-white pixels.
4. Feather alpha for edge pixels.
5. Preserve graphite and light wood edges.
6. Trim transparent bounds.
7. Add 16px transparent padding.
8. Export WebP or PNG.

Pseudo-code:

```js
const distance = Math.sqrt(
  (255 - r) ** 2 +
  (255 - g) ** 2 +
  (255 - b) ** 2
);

if (distance < 10) alpha = 0;
else if (distance < 45) alpha = Math.round(((distance - 10) / 35) * 255);
else alpha = 255;
```

Tune after visual inspection.

### Target

- Transparent bounds
- Height 1000px source before optimization
- Final <300KB
- No white halo on warm paper background

---

## 6. Asset C — optional blue backing paper

Prefer CSS first. Only generate this if the notebook backing feels flat after CSS implementation.

### Filename

```text
public/assets/blue-paper-texture.webp
```

### Prompt

```text
Create a square seamless texture tile for pale blue stationery paper.

The color is a very light desaturated sky blue, approximately #DDECF7. Add only extremely subtle paper fibers and tiny tonal variation. No lines, no text, no stains, no torn edges, no objects, no shadows. It will be used as the rotated blue backing sheet behind a white notebook card in a web interface.

Low contrast, seamless tile, top-down uniform lighting.

Visual style: refined Korean educational stationery, warm and minimal, realistic tactile texture, subtle hand-crafted feel, no cartoon characters, no text, no logos, no watermark, no interface elements, no neon colors, no dramatic shadows.
```

Target <100KB.

---

## 7. SVG assets created in code

Do not use imagegen for these:

### Yellow title underline

- 2 or 3 uneven strokes
- ViewBox around `0 0 320 16`
- Yellow `#F5BE2E`
- Opacity 0.55–0.8

### Blue sentence underline

- 2 short imperfect lines
- Blue `#4D68E6`
- Width determined by container

### Mint type underline

- 2–3 lines
- Mint `#43C99B`

### Scribble star

- 5-point imperfect outline
- Gray-blue `#8E96A6`
- No fill

### Axis connectors

- Thin gray paths
- Curved, slight asymmetry
- Arrow heads
- Behind cards

### Flag

- Single thin pole
- Small outlined flag
- Gray

### Growth arrow

- Orange-yellow rising line
- Small arrow tip
- No chart axes

---

## 8. Prompt consistency file

`.prompts/IMAGEGEN_ASSETS.md` must contain:

```markdown
# ImageGen Asset Log

## Shared style clause
...

## Paper texture
### Prompt
...
### Candidates
- candidate-a.png
- candidate-b.png
- candidate-c.png
### Selected
...
### Reason
...

## Pencil
...
```

Do not overwrite previous prompts during iteration. Append a dated revision section.

---

## 9. Generated asset manifest

Example:

```json
{
  "version": 1,
  "assets": [
    {
      "file": "paper-texture.webp",
      "kind": "imagegen",
      "promptFile": ".prompts/IMAGEGEN_ASSETS.md",
      "candidate": "paper-candidate-02.png",
      "processing": [
        "crop 1024 square",
        "resize 512",
        "reduce contrast 18%",
        "webp quality 78"
      ]
    },
    {
      "file": "pencil-transparent.webp",
      "kind": "imagegen",
      "promptFile": ".prompts/IMAGEGEN_ASSETS.md",
      "candidate": "pencil-candidate-03.png",
      "processing": [
        "remove near-white background",
        "trim",
        "transparent padding",
        "webp quality 86"
      ]
    }
  ]
}
```

---

## 10. Asset visual QA

### Paper texture

At final opacity:

- Text contrast unchanged
- Repetition not obvious
- Surface feels warm rather than dirty
- No visible horizontal/vertical seams

### Pencil

At final placement:

- Similar scale and angle to reference
- Does not cover functional content
- No white box or halo
- Does not dominate the screen
- At 1024px, can shrink or hide safely

### Overall

Generated assets should account for less than 15% of the visual impression. The design must still look correct if they fail to load.
