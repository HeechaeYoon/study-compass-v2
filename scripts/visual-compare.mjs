import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import sharp from "sharp";
import { ssim } from "ssim.js";

const root = process.cwd();
const manifestPath = path.join(root, "reference", "manifest.json");
const artifactsDir = path.join(root, "artifacts", "visual");
const screens = ["start", "question", "result", "prompt"];

async function loadPng(file) {
  return PNG.sync.read(await readFile(file));
}

async function resizeToPngBuffer(input, width, height) {
  return sharp(input).resize(width, height, { fit: "fill" }).png().toBuffer();
}

async function compareScreen(manifest, screen) {
  const region = manifest.regions[screen];
  const referencePath = path.join(root, "reference", region.file);
  const actualPath = path.join(artifactsDir, `${screen}-surface.png`);
  const referenceMeta = await sharp(referencePath).metadata();
  const width = referenceMeta.width ?? 1;
  const height = referenceMeta.height ?? 1;
  const actualResized = await resizeToPngBuffer(actualPath, width, height);
  const actualPng = PNG.sync.read(actualResized);
  const referencePng = await loadPng(referencePath);

  for (const [x, y, maskWidth, maskHeight] of region.masks ?? []) {
    for (let row = y; row < y + maskHeight; row += 1) {
      for (let col = x; col < x + maskWidth; col += 1) {
        const index = (row * width + col) * 4;
        actualPng.data[index] = referencePng.data[index];
        actualPng.data[index + 1] = referencePng.data[index + 1];
        actualPng.data[index + 2] = referencePng.data[index + 2];
        actualPng.data[index + 3] = referencePng.data[index + 3];
      }
    }
  }

  const diff = new PNG({ width, height });
  const mismatch = pixelmatch(
    referencePng.data,
    actualPng.data,
    diff.data,
    width,
    height,
    { threshold: 0.18 },
  );
  const mismatchRatio = mismatch / (width * height);
  const score = ssim(referencePng, actualPng).mssim;
  const diffPath = path.join(artifactsDir, `${screen}-diff.png`);
  await writeFile(diffPath, PNG.sync.write(diff));

  return {
    screen,
    ssim: Number(score.toFixed(4)),
    mismatchRatio: Number(mismatchRatio.toFixed(4)),
    reference: `reference/${region.file}`,
    actual: `artifacts/visual/${screen}-surface.png`,
    diff: `artifacts/visual/${screen}-diff.png`,
  };
}

async function main() {
  await mkdir(artifactsDir, { recursive: true });
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const results = [];
  for (const screen of screens) {
    try {
      results.push(await compareScreen(manifest, screen));
    } catch (error) {
      results.push({
        screen,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  const output = {
    generatedAt: new Date().toISOString(),
    note: "Metrics are advisory because the source is a scaled montage with annotations.",
    results,
  };
  await writeFile(
    path.join(artifactsDir, "visual-metrics.json"),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8",
  );
  console.table(results);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
