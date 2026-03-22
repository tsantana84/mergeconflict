import fs from "fs";
import path from "path";
import matter from "gray-matter";
import OpenAI from "openai";

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const IMAGES_DIR = path.join(process.cwd(), "public/images/posts");

const STYLE_PROMPT = `Create an abstract, psychedelic digital artwork. The style should be:
- Dark background (#0a0a0a or very dark)
- Vibrant neon colors with orange (#f97316) and pink (#ec4899) as dominant accents
- Abstract geometric shapes, flowing forms, fractals, or warped patterns
- Psychedelic and trippy — think fluid gradients, impossible geometry, optical illusions
- No text, no words, no letters, no numbers
- No people or faces
- Modern and bold, suitable as a blog post header image
- Aspect ratio 16:9, landscape orientation

The artwork should evoke the mood and theme described below, interpreted abstractly through shapes, colors, and patterns — not literally.`;

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
        quality: "medium",
      });

      const imageData = response.data?.[0]?.b64_json;
      if (!imageData) {
        console.error(`   ❌ No image data returned for ${post.file}`);
        continue;
      }

      const imagePath = path.join(IMAGES_DIR, `${post.slug}.png`);
      fs.writeFileSync(imagePath, Buffer.from(imageData, "base64"));

      const relativeImagePath = `/images/posts/${post.slug}.png`;
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
