# Reference Image Notes

## Files

- `design-board.png`: original user-provided design board, 1536×1024
- `header-reference.png`: shared header crop
- `start-screen-reference.png`: start panel crop
- `question-screen-reference.png`: question panel crop
- `result-screen-reference.png`: result panel crop
- `prompt-screen-reference.png`: prompt panel crop
- `manifest.json`: crop and mask metadata

## Interpretation

The source is a 2×2 montage, not a Figma export of individual full-size pages.

- The blue numbered labels are design annotations.
- The app should use one shared header on every screen.
- Each panel informs the content surface below that header.
- The canonical implementation viewport is 1280×800.
- Compare the header and screen surface separately.
- Mask annotation rectangles during automated comparison.

## Important limitations

The source does not reveal:

- exact font files
- exact vector paths
- CSS dimensions
- responsive behavior
- component states beyond the shown examples

Use `docs/VISUAL_SPEC.md`, `docs/DESIGN_SYSTEM.md`, and repeated browser comparison to resolve these gaps.
