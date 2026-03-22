import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_BASE = path.join(process.cwd(), "public/images");
const DIRS = ["stock", "season-2", "season-3", "season-4", "posts"];
const TARGET_WIDTH = 1280;
const QUALITY = 80;

async function main() {
  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const dir of DIRS) {
    const fullDir = path.join(IMAGES_BASE, dir);
    if (!fs.existsSync(fullDir)) continue;

    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".png"));
    if (files.length === 0) continue;

    console.log(`\n📁 ${dir} (${files.length} images)`);

    for (const file of files) {
      const pngPath = path.join(fullDir, file);
      const webpPath = path.join(fullDir, file.replace(/\.png$/, ".webp"));

      // Skip if webp already exists and png is gone
      if (fs.existsSync(webpPath) && !fs.existsSync(pngPath)) continue;

      const beforeSize = fs.statSync(pngPath).size;
      totalBefore += beforeSize;

      await sharp(pngPath)
        .resize(TARGET_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(webpPath);

      const afterSize = fs.statSync(webpPath).size;
      totalAfter += afterSize;
      count++;

      const reduction = Math.round((1 - afterSize / beforeSize) * 100);
      console.log(
        `   ${file} → ${file.replace(".png", ".webp")}  ${(beforeSize / 1024 / 1024).toFixed(1)}MB → ${(afterSize / 1024 / 1024).toFixed(1)}MB  (-${reduction}%)`
      );

      // Remove original PNG
      fs.unlinkSync(pngPath);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Images converted: ${count}`);
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
}

main();
