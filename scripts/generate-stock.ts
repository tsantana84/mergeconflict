import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/stock");

const STYLE_BASE = `Create a painting that looks like a CENTURIES-OLD oil painting from the Renaissance or Baroque era that has been CORRUPTED by technology — with SURREALIST impossible elements woven throughout.

Style requirements:
- Classical oil painting technique — cracked varnish, aged canvas texture, yellowed patina, visible brushstrokes
- The painting should look PHYSICALLY OLD — found in an attic, wear marks, faded edges, warmth of aged pigments
- Technology must be seamlessly INTEGRATED into the scene — not slapped on top, but woven into the fabric of the painting as if it always belonged there
- Technological elements rendered in period-accurate oil painting style

SURREALIST ELEMENTS (essential):
- Impossible physics, spatial paradoxes, dream logic
- Objects that contradict their context
- Spaces that fold, expand, or contradict themselves
- Organic metamorphosis between unrelated forms

Aging and texture:
- Craquelure across the entire surface
- Areas "peeling" to reveal technological layers underneath
- Gold leaf accents in unexpected patterns
- Old master palette — ochres, siennas, deep reds, muted greens — with electric blues and neon bleeding through where technology emerges

NO text, words, letters, numbers, recognizable human faces or portraits.
Aspect ratio 16:9, landscape orientation.

IMPORTANT: Do NOT use melting clocks, infinite staircases, or other common surrealist clichés. The scene described below IS the painting. Render it exactly.`;

const SCENES = [
  { slug: "stock-01", scene: "A Venetian bridge that folds over itself forming a Möbius strip — its ancient bricks have veins of copper pulsing beneath the mortar" },
  { slug: "stock-02", scene: "A Baroque aquarium where fish swim between thermionic valves and corals made of oxidized circuit boards" },
  { slug: "stock-03", scene: "A spiral staircase seen from above descending infinitely — each step is a different era, from Roman marble to carbon fiber, all coexisting" },
  { slug: "stock-04", scene: "A field of sunflowers tracking not the sun but a glowing satellite — their stems are bundles of braided cables covered in moss" },
  { slug: "stock-05", scene: "A crystal cave with stalactites that function as prisms, projecting rainbows that solidify into fiber optic threads upon touching the ground" },
  { slug: "stock-06", scene: "A ship inside a bottle, but the bottle is cathedral-sized — the liquid inside is mercury reflecting a sky that doesn't exist outside" },
  { slug: "stock-07", scene: "A formal 17th century dinner table floating over a mirrored lake — the plates contain miniature landscapes that change with the light" },
  { slug: "stock-08", scene: "A Japanese zen garden where the stones are water-polished processors and the raked sand forms electromagnetic wave patterns" },
  { slug: "stock-09", scene: "An observatory dome cracked in half — one side shows a classical starry sky, the other an infinite green motherboard where chips are constellations" },
  { slug: "stock-10", scene: "Roots of a centuries-old tree that transform into submarine telecommunication cables as they penetrate the soil, shown in cross-section like an anatomical diagram" },
  { slug: "stock-11", scene: "A Dutch windmill whose blades are translucent turbine propellers — inside, wooden gears fuse with magnetic rotors" },
  { slug: "stock-12", scene: "A still life with fruits cut in half revealing microchips and capacitors instead of seeds — the juice dripping out is liquid light" },
  { slug: "stock-13", scene: "A ruined Greek amphitheater where acoustics are visible — sound waves painted as golden silk veils carrying electric pulses between columns" },
  { slug: "stock-14", scene: "A medieval reliquary opened to show not holy bones but a miniature ecosystem with rivers of molten solder and mountains of crystallized silicon" },
  { slug: "stock-15", scene: "A Gothic window with stained glass depicting data centers instead of saints — the colored light projects network diagram shadows on the stone floor" },
  { slug: "stock-16", scene: "An underwater volcano seen from inside — the emerging lava cools into fractal metallic structures while bioluminescent fish swim through thermal currents" },
  { slug: "stock-17", scene: "A navigator's desk with rolled maps, but the seas on the maps are real liquid overflowing the parchment edges, containing microscopic submarines" },
  { slug: "stock-18", scene: "A giant pipe organ where each pipe is a telescope pointing at different directions of the cosmos — the keyboard is made of fossilized amber keys with insects inside" },
  { slug: "stock-19", scene: "A drawbridge suspended in mid-air with no castle or moat — its chains extend upward into clouds, and between the planks grow piezoelectric crystals" },
  { slug: "stock-20", scene: "An ancient herbarium where the pressed plants between pages are specimens of antennas, resistors and transistors blooming like electronic flora" },
  { slug: "stock-21", scene: "A colossal hourglass in a Renaissance plaza where the falling sand is actually thousands of tiny glass spheres, each containing a captured lightning bolt" },
  { slug: "stock-22", scene: "A sculptor's atelier where the marble block being carved reveals geological layers — each layer is a different technological era, from bronze to silicon to materials that don't exist" },
  { slug: "stock-23", scene: "An underground wine cellar with oak barrels connected by glowing copper tubing — the wine inside boils and emits infrared light visible through the wood" },
  { slug: "stock-24", scene: "A Moorish courtyard with fountains where water rises instead of falling, forming liquid arches that support an inverted garden on the ceiling" },
  { slug: "stock-25", scene: "A luthier's workshop where an opened violin reveals its insides are a labyrinth of golden microcircuits — the strings vibrate on their own producing visible waves in the air" },
  { slug: "stock-26", scene: "A lighthouse on an impossible coast — the ocean is vertical like a wall, the lighthouse projects its beam horizontally through transparent geological layers" },
  { slug: "stock-27", scene: "A medieval council chamber with a spherical world map in the center that is actually a fusion reactor contained by wrought iron rings and magnetic runes" },
  { slug: "stock-28", scene: "A Victorian greenhouse glass roof seen from below — the rain falling on it transforms into binary data before running down the verdigris copper gutters" },
  { slug: "stock-29", scene: "An archaeological dig that revealed not ruins but immense ancestral hardware — Ionic columns are heat sinks, Roman mosaics are PCB layouts" },
  { slug: "stock-30", scene: "A Tower of Babel under construction where each floor uses materials from a different era — stone, wood, steel, glass, solidified light — and the scaffolding is made of frozen radio waves" },
];

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY not set");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const toGenerate = SCENES.filter((s) => {
    const exists = fs.existsSync(path.join(OUTPUT_DIR, `${s.slug}.png`));
    if (exists) console.log(`⏭  ${s.slug} — exists, skipping`);
    return !exists;
  });

  if (toGenerate.length === 0) {
    console.log("All images already exist.");
    generateGallery();
    return;
  }

  console.log(`\nGenerating ${toGenerate.length} images...\n`);

  for (let i = 0; i < toGenerate.length; i++) {
    const item = toGenerate[i];
    const prompt = `${STYLE_BASE}\n\nScene: ${item.scene}`;

    console.log(`🎨 [${i + 1}/${toGenerate.length}] ${item.slug}`);

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
        console.error(`   ❌ No data returned`);
        continue;
      }

      fs.writeFileSync(path.join(OUTPUT_DIR, `${item.slug}.png`), Buffer.from(imageData, "base64"));
      console.log(`   ✅ Done`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ ${message}`);
    }
  }

  generateGallery();
  console.log("\nDone!");
}

function generateGallery() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Merge Conflict — Image Stock</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fafafa; font-family: -apple-system, sans-serif; padding: 40px; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    h1 span { background: linear-gradient(135deg, #f97316, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #71717a; margin-bottom: 40px; font-size: 14px; }
    .gallery { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; max-width: 1600px; }
    .card { border: 1px solid #27272a; border-radius: 14px; overflow: hidden; background: #18181b; cursor: pointer; transition: border-color 0.2s; }
    .card:hover { border-color: #f97316; }
    .card img { width: 100%; aspect-ratio: 3/2; object-fit: cover; display: block; }
    .card-body { padding: 12px 16px; }
    .card-body p { font-size: 11px; color: #a1a1aa; line-height: 1.5; margin-bottom: 6px; }
    .slug { font-size: 12px; color: #f97316; font-family: monospace; font-weight: 600; }
  </style>
</head>
<body>
  <h1>MERGE<span>CONFLICT</span> — Image Stock</h1>
  <p class="subtitle">30 pre-generated images. Use in frontmatter: image: /images/stock/stock-XX.png</p>
  <div class="gallery">
${SCENES.map((s) => `    <div class="card">
      <img src="/images/stock/${s.slug}.png" alt="${s.slug}">
      <div class="card-body">
        <span class="slug">${s.slug}.png</span>
        <p>${s.scene.substring(0, 140)}...</p>
      </div>
    </div>`).join("\n")}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), "public/stock-gallery.html"), html);
  console.log(`📄 Gallery: http://localhost:3456/stock-gallery.html`);
}

main();
