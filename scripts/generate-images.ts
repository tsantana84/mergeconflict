import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";
import sharp from "sharp";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const IMAGES_DIR = path.join(process.cwd(), "public/images/posts");

const STYLE_PROMPT = `Create a painting that looks like a CENTURIES-OLD oil painting from the Renaissance or Baroque era that has been CORRUPTED by technology — with SURREALIST impossible elements woven throughout.

Style requirements:
- Classical oil painting technique — cracked varnish, aged canvas texture, yellowed patina, visible brushstrokes
- The painting should look PHYSICALLY OLD — found in an attic, wear marks, faded edges, warmth of aged pigments
- Technology bleeds through the canvas: circuit board patterns emerging from cracked paint, holographic glitches disrupting classical scenes, fiber optic cables growing like organic matter through classical architecture
- Technological elements rendered in period-accurate oil painting style — as if the old master SAW these things

SURREALIST ELEMENTS (essential):
- Impossible physics: gravity-defying compositions, spatial paradoxes, dream logic
- Objects that contradict their context — things that shouldn't be where they are
- Impossible spatial relationships — spaces that fold, expand, or contradict themselves
- Scales are wrong, perspectives shift mid-canvas, multiple horizons coexist
- Objects transforming into other objects mid-canvas — organic metamorphosis between unrelated forms
- Organic architecture — structures that feel alive, breathing, growing

Aging and texture:
- Craquelure across the entire surface
- Areas "peeling" to reveal technological layers underneath
- Gold leaf accents in unexpected patterns
- Old master palette — ochres, siennas, deep reds, muted greens — with electric blues and neon bleeding through

NO text, words, letters, numbers, recognizable human faces or portraits.
Aspect ratio 16:9, landscape orientation.

IMPORTANT: Do NOT use melting clocks, infinite staircases, or other common surrealist clichés. Invent NEW surrealist metaphors. Every image must have a completely UNIQUE scene and composition.`;

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY not set in environment or .env.local");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const postsToProcess: { file: string; slug: string; title: string; excerpt: string; tags: string[] }[] = [];

  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(content);

    if (data.image) {
      console.log(`⏭  ${file} — already has image, skipping`);
      continue;
    }

    const slug = file.replace(/\.mdx$/, "");
    postsToProcess.push({
      file,
      slug,
      title: data.title,
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    });
  }

  if (postsToProcess.length === 0) {
    console.log("All posts already have images. Nothing to do.");
    return;
  }

  console.log(`\nGenerating images for ${postsToProcess.length} post(s)...\n`);

  for (const post of postsToProcess) {
    const themeDescription = `Theme: "${post.title}". ${post.excerpt}. Topics: ${post.tags.join(", ")}.`;
    const prompt = `${STYLE_PROMPT}\n\n${themeDescription}`;

    console.log(`🎨 Generating image for: ${post.title}`);

    try {
      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
        n: 1,
        size: "1536x1024",
        quality: "high",
      });

      const imageData = response.data?.[0]?.b64_json;
      if (!imageData) {
        console.error(`   ❌ No image data returned for ${post.file}`);
        continue;
      }

      const pngBuffer = Buffer.from(imageData, "base64");
      const imagePath = path.join(IMAGES_DIR, `${post.slug}.webp`);
      await sharp(pngBuffer)
        .resize(1280, undefined, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(imagePath);

      const relativeImagePath = `/images/posts/${post.slug}.webp`;
      const fullPath = path.join(POSTS_DIR, post.file);
      const fileContent = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContent);
      data.image = relativeImagePath;
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(fullPath, updatedContent);

      console.log(`   ✅ Saved: ${relativeImagePath}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ Failed: ${message}`);
    }
  }

  console.log("\nDone!");
}

main();
