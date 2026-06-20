import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagegenRoot =
  "/home/heechae/.codex/generated_images/019ee0b9-64bb-7981-8de2-f7ef6b770945";

const sources = {
  paper: {
    candidate: "paper-candidate-c",
    file: path.join(
      imagegenRoot,
      "ig_0eec34de761a497b016a357077c0a88191a6b17d4b2ff48203.png",
    ),
  },
  pencil: {
    candidate: "pencil-candidate-c",
    file: path.join(
      imagegenRoot,
      "ig_0eec34de761a497b016a357114ae788191b7989de80de772e2.png",
    ),
  },
};

const assetsDir = path.join(root, "public", "assets");
const artifactsDir = path.join(root, "artifacts", "imagegen");
const ivory = { r: 247, g: 244, b: 238 };

function blendChannel(value, target, amount) {
  return Math.round(value * (1 - amount) + target * amount);
}

async function processPaper() {
  const { data, info } = await sharp(sources.paper.file)
    .resize(512, 512, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let index = 0; index < data.length; index += info.channels) {
    data[index] = blendChannel(data[index] ?? ivory.r, ivory.r, 0.46);
    data[index + 1] = blendChannel(data[index + 1] ?? ivory.g, ivory.g, 0.46);
    data[index + 2] = blendChannel(data[index + 2] ?? ivory.b, ivory.b, 0.46);
  }

  const output = path.join(assetsDir, "paper-texture.webp");
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: 78 })
    .toFile(output);

  return {
    file: "paper-texture.webp",
    kind: "imagegen",
    promptFile: ".prompts/IMAGEGEN_ASSETS.md",
    candidate: sources.paper.candidate,
    source: sources.paper.file,
    processing: [
      "resize 512 square",
      "blend 46% toward #F7F4EE to reduce contrast",
      "export webp quality 78",
    ],
  };
}

async function processPencil() {
  const resized = await sharp(sources.pencil.file)
    .resize({ height: 1100, withoutEnlargement: true })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resized;

  for (let index = 0; index < data.length; index += info.channels) {
    const red = data[index] ?? 255;
    const green = data[index + 1] ?? 255;
    const blue = data[index + 2] ?? 255;
    const distance = Math.sqrt(
      (255 - red) ** 2 + (255 - green) ** 2 + (255 - blue) ** 2,
    );

    let alpha = 255;
    if (distance < 42) {
      alpha = 0;
    } else if (distance < 105) {
      alpha = Math.round(((distance - 42) / 63) * 255);
    }

    data[index + 3] = Math.min(data[index + 3] ?? 255, alpha);
  }

  const output = path.join(assetsDir, "pencil-transparent.webp");
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .extend({
      top: 24,
      right: 24,
      bottom: 24,
      left: 24,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(output);

  return {
    file: "pencil-transparent.webp",
    kind: "imagegen",
    promptFile: ".prompts/IMAGEGEN_ASSETS.md",
    candidate: sources.pencil.candidate,
    source: sources.pencil.file,
    processing: [
      "resize source to 1100px high",
      "remove near-white background with feathered alpha",
      "trim transparent bounds",
      "add 24px transparent padding",
      "export webp quality 86 alphaQuality 90",
    ],
  };
}

async function main() {
  await mkdir(assetsDir, { recursive: true });
  await mkdir(artifactsDir, { recursive: true });

  const assets = [await processPaper(), await processPencil()];
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    assets,
  };

  await writeFile(
    path.join(assetsDir, "generated-assets.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(artifactsDir, "selected-assets.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log("Processed generated assets:");
  for (const asset of assets) {
    console.log(`- public/assets/${asset.file} from ${asset.candidate}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
