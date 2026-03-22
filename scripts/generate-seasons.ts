import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const BASE_DIR = path.join(process.cwd(), "public/images");

const SURREAL_RULES = `The painting must contain SURREALIST impossible elements (dream logic, impossible physics, spatial paradoxes, objects metamorphosing into other objects) and TECHNOLOGY seamlessly woven into the scene.
NO text, words, letters, numbers, recognizable human faces or portraits.
Aspect ratio 16:9, landscape orientation.
Do NOT use melting clocks, infinite staircases, or other surrealist clichés. Invent NEW surrealist metaphors. Every image must have a completely UNIQUE scene and composition.`;

const STYLE_EXPRESSIONISM = `Create a painting in the style of German Expressionism (Ernst Ludwig Kirchner, Emil Nolde, Edvard Munch).
Style:
- Flat, distorted colors applied in aggressive, visible brushstrokes
- Angular, jagged compositions with tilted perspectives
- Emotional intensity over realism — colors that FEEL rather than describe
- Harsh contrasts: acid yellows, deep blacks, blood reds, electric blues
- Thick impasto texture, paint applied with palette knife
- The raw energy of Die Brücke movement
Technology manifests as glitch and distortion: digital artifacts corrupt the painted surface, scan lines slice through landscapes, pixel noise clusters like bruises on the canvas, color channel separation tears scenes apart.
${SURREAL_RULES}`;

const STYLE_WOODCUT = `Create an image in the style of medieval woodcut prints and engravings (Albrecht Dürer, medieval bestiaries, anatomical drawings).
Style:
- High contrast black and white with sparse red accents
- Carved line work — hatching, cross-hatching, stippling for shading
- The texture of ink pressed into handmade paper from a carved wood block
- Dense, horror vacui compositions filled with detail
- Medieval manuscript marginalia aesthetic
- The aged look of 500-year-old printed pages — yellowed, foxed, ink slightly bleeding
Technical diagrams of impossible machines in the medieval engineering tradition. Bestiaries where creatures are organic-mechanical hybrids. Wireframe 3D models rendered in woodcut technique.
${SURREAL_RULES}`;

const STYLE_CONSTRUCTIVISM = `Create a painting in the style of Soviet Constructivist art and propaganda posters (El Lissitzky, Alexander Rodchenko, Kazimir Malevich).
Style:
- Bold diagonal compositions with extreme dynamic tension
- Severely limited color palette: deep red, black, cream/off-white, metallic gold — nothing else
- Geometric abstraction — circles, triangles, beams, wedges as primary forms
- Photomontage aesthetic — layered flat planes at different angles creating depth
- Industrial energy — the glorification of the machine
- Rough paper texture of Soviet-era lithograph printing — slightly misregistered ink layers
- The aged look of a 1920s propaganda poster — creased, faded at edges, foxed paper
Technology appears as the utopian machine: impossible industrial diagrams, cosmic gears, circuit architectures drawn as revolutionary blueprints. Data flow depicted as rivers of geometric particles.
${SURREAL_RULES}`;

// 30 unique scenes for Season 2 — Expressionism + Glitch
const SCENES_S2 = [
  "A barbershop where every mirror reflects a different version of the room — one shows it underwater, another in flames, another as pure static. The barber's chair rotates between all realities simultaneously",
  "A greenhouse made of television screens playing footage of forests. The plants inside have grown through the screens and now exist in both the digital forest and the physical greenhouse at once",
  "A laundromat where the washing machines are portals — clothes go in dirty on one continent and come out clean on another. The lint traps collect fragments of foreign skies",
  "A deep sea diving helmet sitting on a desert mesa, filled with storm clouds. Lightning inside the helmet illuminates the brass rivets from within. Tumbleweeds orbit it like electrons",
  "A grand ballroom where the chandeliers are actually upside-down cities. Their light comes from the tiny streetlamps and windows of the inverted civilization hanging above the dance floor",
  "A kitchen where someone left the fridge open and winter escaped — half the room is frozen tundra with aurora borealis on the ceiling, the other half is a normal warm kitchen. The boundary is razor sharp",
  "A parking garage that spirals downward into the earth's mantle. Cars on the lower levels have evolved — grown mineral shells, crystalline headlights, exhaust pipes that vent geothermal steam",
  "A phone booth in the middle of the ocean, standing on the water's surface. The phone cord spirals down into the abyss. Whales circle it at a respectful distance. The receiver hums with tidal data",
  "A barbecue grill that has burned through the patio, through the earth's crust, and is now grilling on the surface of the earth's core. The smoke rises through geological strata in reverse",
  "A swimming pool built vertically against the side of a skyscraper. Swimmers move through the water as if gravity doesn't apply to them. The pool's drain connects to a cloud directly above",
  "A record player where the vinyl disc is a cross-section of a tree trunk. The needle follows the growth rings and plays the sound of centuries — storms, fires, bird songs, the hum of nearby power lines being built",
  "A mailbox that has grown roots and branches, becoming a tree. Its slot now accepts migrating birds instead of letters. Each bird carries a signal on a frequency only the tree can decode",
  "An elevator shaft with no building around it — just a freestanding shaft rising into the sky. Each floor opens onto a different ecosystem. The cables are braided from copper wire and living vines",
  "A typewriter where each keystrike doesn't print a letter but plants a seed in the paper. A miniature forest has grown from a finished page, complete with tiny creatures made of punctuation marks",
  "A fishbowl the size of a house, sitting in a living room of normal scale. The fish inside have built a tiny civilization with architecture mimicking the room outside the bowl. They have tiny fishbowls too",
  "A highway overpass that ties itself in a knot — cars drive along the Möbius surface without noticing they're upside down. Traffic lights grow like flowers from the concrete, blooming red and green",
  "A shower stall where the water falls upward from the drain, passes through the person-shaped void where someone should be standing, and collects on the ceiling in the shape of a topographic map",
  "A vending machine in a forest clearing that dispenses bottled lightning, canned fog, and packets of compressed silence. Its electrical cord trails away into the woods, connected to a mushroom network",
  "A telescope aimed at the ground, looking through the earth and out the other side into a different night sky. The eyepiece shows stars that haven't been named because they're hidden behind a planet",
  "An umbrella opened inside a house, but it's raining only under the umbrella — a private localized storm. The rain is warm and glows faintly. The drops contain tiny reflected rooms",
  "A bookshelf where the books are arranged by color and together they form a landscape painting. Pull one book out and a hole appears in the landscape — you can reach through and touch the painted world",
  "A fire escape that has detached from its building and walks through the city on its own, an angular metal spider. Pigeons nest in its landings. It occasionally stops and attaches to buildings that don't have one",
  "A sewing machine stitching together two landscapes — a glacier and a volcano — into one continuous terrain. The thread is a river that steams where it crosses the seam between ice and lava",
  "A bathroom sink whose drain leads directly to the sky above a distant mountain. When you wash your hands, rain falls on the peak. The faucet pulls water from a well that taps into the same mountain's aquifer",
  "A piano dropped from a great height, frozen in the instant before impact. Every key has released its note as a physical object — 88 different geometric shapes floating upward from the keys in formation",
  "A bus stop bench that has been waiting so long it has fossilized, along with the ghost outline of passengers who also waited too long. The bus route sign shows destinations that are emotions, not places",
  "A fire hydrant that has erupted not with water but with a geyser of old photographs. The photos scatter across the street, each one showing the same intersection at a different decade. Some show the future",
  "A chain-link fence where each diamond of the mesh contains a different weather system. Miniature tornadoes, snowstorms, and heat waves coexist in adjacent cells. The fence posts are lightning rods charging batteries underground",
  "A junkyard where discarded appliances have formed a coral reef ecosystem. Refrigerators are caves for mechanical hermit crabs. Washing machine drums are tidal pools. A TV antenna is a perch for copper birds",
  "A revolving door that connects four different rooms instead of inside/outside — a library, a furnace, an aquarium, and an empty field. Each quarter-turn is a different temperature, smell, and century",
];

// 30 unique scenes for Season 3 — Woodcut + Wireframe
const SCENES_S3 = [
  "A medieval bestiary entry depicting a creature that is half pipe organ, half deep-sea anglerfish. Its anatomical cross-section shows bellows for lungs and copper pipes for veins. Its lure is a vacuum tube that glows",
  "A cartographer's nightmare: a map that maps itself. The parchment terrain features include the desk the map sits on, the cartographer's tools, and a smaller map within the map that contains an even smaller one",
  "An alchemist's recipe diagram for transforming a mechanical clock into a living heart — each step shows the intermediate hybrid forms, half-clockwork half-organ, rendered in precise anatomical-engineering detail",
  "A cross-section of a castle wall revealing that the fortifications are alive — the stones are cells, the mortar is connective tissue, the arrow slits are eyes, the moat is a circulatory system carrying molten data",
  "A medieval siege engine designed by a madman — it launches not projectiles but entire rooms, furniture and all. The engineering diagrams show impossible load calculations and trajectories that curve through dimensions",
  "A page from a monk's herbarium cataloging a plant species that grows copper wire instead of roots, silicon wafers instead of leaves, and bears fruit that are perfectly formed vacuum tubes",
  "A navigation chart for sailing across a sea that is also a circuit board — the shipping lanes follow copper traces, the ports are solder points, sea monsters lurk in the gaps between components",
  "A anatomical diagram of a hand where each finger is a different tool — one is a compass, one a quill, one a soldering iron, one a key, one a tuning fork. The palm contains a map of all five skills",
  "A blueprint for a cathedral designed by bees — hexagonal architecture, wax buttresses, honey-filled fonts, pollen-stained glass windows. The engineering notes are written in dance-language notation",
  "A medieval tournament bracket where instead of knights, different inventions compete. The bracket tree grows literal branches. The final match is between fire and memory. The referee is a sundial",
  "A bestiary illustration of a creature that lives inside mirrors — shown from both sides of the glass simultaneously. On one side it appears biological, on the other mechanical. The glass between them is cracking",
  "A technical diagram for a perpetual motion machine that actually works because one of its components is a trained falcon that never tires. The falcon's anatomy is rendered in engineering blueprint style",
  "A page from a shipwright's manual showing how to build a vessel from a single enormous seashell. Cross-sections reveal natural chambers repurposed as cabins, the spiral as a staircase, nacre walls reflecting sonar",
  "A star chart where constellations are connected not by lines but by underground root systems shown in x-ray view beneath the sky. The stars are nodes. The roots are networks. The soil between is time",
  "A diagram of a mechanical tree that produces different metals as seasonal fruit — iron apples in winter, copper pears in spring, silver plums in summer, gold figs in autumn. Its rings count in binary",
  "A medieval map of a city built entirely on the back of a sleeping automaton. The streets follow the seams between its plates. Residents live in fear of it waking, but it hasn't moved in 400 years",
  "A cross-section of a mountain showing it is hollow and contains a vertical ocean — water held in place by some impossible force. Fish swim vertically. A boat sails up the inside of the peak",
  "An engineering schematic for a bridge between two thoughts — the structural elements are logical propositions, the cables are syllogisms, the foundations are axioms. Load-bearing capacity measured in certainty",
  "A naturalist's field sketch of a migration pattern where birds follow ley lines that are also power grid routes. The sketch overlays the bird formations with circuit diagrams showing the same topology",
  "A mason's guide to building with volcanic glass and living coral simultaneously — the construction technique requires the wall to be grown and carved at the same time. The mortar is a symbiotic organism",
  "A diagram showing the life cycle of a bell — from ore in the ground, through smelting and casting, through centuries of ringing, to the moment it cracks and the stored sound escapes as a visible shockwave",
  "A technical illustration of rain, treating each raindrop as an individual machine with its own anatomy — a casing of surface tension, an engine of gravity, cargo of dissolved minerals, and a tiny parachute of air resistance",
  "A page from a veterinary manual for mechanical animals — showing common ailments like rust in the joints, moths in the bellows-lungs, and birds nesting in gear cavities. Treatment involves both blacksmithing and surgery",
  "A cartographic cross-section of a river from source to sea, but the river flows through time as well as space — its headwaters are in the future, its mouth empties into the past. Fish swim upstream into tomorrow",
  "A medieval locksmith's catalog showing keys that open non-physical things — a key to a season, a key to a sound, a key to a specific shade of blue. Each key's teeth are tuned to the frequency of what it unlocks",
  "A woodcut depicting a library that has been flooded, but the water has taken on the properties of the books it touched — poetry water flows differently than history water, and mathematics water forms geometric patterns",
  "A technical diagram of a volcano reimagined as a pipe organ played by tectonic pressure. The magma chamber is the wind chest. Lava tubes are organ pipes. Eruptions are crescendos in a geological symphony",
  "An anatomical study of a compass needle, treating it as a living creature — it has a nervous system aligned to magnetic north, a cardiovascular system of liquid iron, and it reproduces by magnetizing other needles",
  "A bestiary page for an animal that is a living knot — it has no beginning or end, its skeleton is a topological impossibility, its circulatory system is a Klein bottle. Rendered in precise Dürer-style hatching",
  "A medieval engineering diagram for harvesting lightning using a cathedral as an antenna — flying buttresses as tuning elements, the spire as a collector, holy water fonts as capacitors, bell ropes as discharge circuits",
];

// 30 unique scenes for Season 4 — Constructivism + Tech
const SCENES_S4 = [
  "A monumental transmission tower built from red and black geometric planes, broadcasting concentric triangular waves that reshape the flat landscape into terraced data-farms. Workers are abstract geometric figures tending signal crops",
  "A factory floor where the assembly line produces planets — raw geometric ore enters from the left, passes through angular presses and circular molds, and finished spherical worlds roll off the right into a cosmic conveyor belt",
  "A geometric interpretation of a thunderstorm: lightning bolts are ruler-straight red diagonal beams, clouds are overlapping gray rectangles, rain is a field of vertical black lines. The ground receiving the storm is a gold circuit grid",
  "A propaganda poster for gravity — depicting it as a heroic force pulling geometric objects toward a bold red center. Objects that resist (floating triangles, defiant circles) are shown being corrected by diagonal red beams",
  "A constructivist subway map that is also the actual subway — the colored lines are physical tubes carrying geometric passengers through a city made of overlapping rectangles. Transfer stations are gear mechanisms",
  "A printing press the size of a city block, its rollers made of red steel cylinders. It prints not on paper but on the landscape itself — stamping geometric patterns onto hills and valleys. The ink is molten copper",
  "A geometric harvest: fields of triangular wheat being gathered by angular combines. The grain silos are monumental red cylinders. The chaff is carried away on black diagonal wind vectors toward a golden processing plant",
  "A constructivist interpretation of the water cycle: evaporation shown as vertical red arrows, clouds as overlapping geometric planes, rain as diagonal black vectors, rivers as horizontal gold channels feeding back into a circular sea",
  "A powerplant where the fuel is geometric forms themselves — triangles are fed into a furnace, their potential energy converted to electricity that flows through the composition as bold red transmission lines",
  "A constructivist observatory: the telescope is a massive red triangle pointing at a sky made of layered black and gold geometric planes. Stars are perfect circles. Orbits are visible as red arcs. Data streams back as diagonal beams",
  "A geometric shipyard where vessels are assembled from basic shapes — hulls are elongated triangles, masts are vertical beams, sails are flat planes catching diagonal wind vectors. The sea is a horizontal gold band",
  "A radio station whose antenna array is a monumental constructivist sculpture — red beams and black circles arranged in dynamic diagonal composition. The broadcast waves radiate as concentric geometric ripples reshaping the landscape",
  "A constructivist forge where raw black ore is transformed through stages: crushed into circles, pressed into triangles, folded into red beams, assembled into golden geometric structures. Each stage more ordered than the last",
  "A geometric dam holding back a reservoir of pure data — the water is represented as dense fields of tiny circles. The dam wall is massive angular concrete with red reinforcement beams. Turbines convert data-flow into geometric energy",
  "A constructivist greenhouse: glass panels are overlapping transparent rectangles, plants are vertical green geometric growths, irrigation is a system of red angular channels, sunlight enters as diagonal gold beams through calculated angles",
  "A monumental gear mechanism floating in space — red and black interlocking circles of various sizes, their teeth meshing perfectly. Each gear drives another across impossible distances via bold geometric transmission beams",
  "A constructivist weather machine: a tower of red and black geometric elements that manufactures clouds (gray rectangles), distributes rain (diagonal black lines), and controls wind (sweeping gold curves) across a planned landscape",
  "A geometric distillery: raw signals enter as chaotic overlapping waveforms on the left, pass through a series of angular red filters and black separators, and exit on the right as pure geometric tones — perfect circles of single frequencies",
  "A constructivist bridge spanning not a river but a temporal gap — one side is rendered in the angular geometry of 1920, the other in unknown future geometry. The bridge itself is the transition between visual languages",
  "A propaganda poster celebrating the circuit: electronic components rendered as heroic geometric figures. Resistors are pillars, capacitors are monumental arches, transistors are dynamic diagonal forms. Current flows in bold red rivers",
  "A geometric quarry where mathematics is mined — workers extract perfect shapes from raw stone. Circles, triangles, and squares are hauled away on angular rail carts. The deeper the mine, the more complex the shapes: fractals at the bottom",
  "A constructivist power grid spanning a continent — transmission towers are monumental red triangles, power lines are bold black diagonals, cities are clusters of gold circles consuming energy. The grid pulses with visible current",
  "A geometric seed vault: seeds are stored as basic shapes in angular red containers. When planted, they grow into increasingly complex geometric structures. The vault itself is buried inside a monumental black triangle mountain",
  "A constructivist clock where time is a physical substance manufactured in a geometric factory — seconds are tiny red circles produced on an assembly line, minutes are gold rectangles, hours are massive black triangles",
  "A geometric interpretation of sound: a monumental red horn broadcasts angular waveforms that physically reshape the landscape. Mountains flatten into plains, plains fold into valleys, all in precise geometric transformations",
  "A constructivist fish farm where the tanks are geometric containers — red rectangular pools connected by black angular channels. The fish are simplified to basic triangular forms. Their school patterns form larger geometric designs",
  "A propaganda poster for the network: interconnected nodes shown as bold red circles, connections as dynamic black diagonals, data packets as tiny gold triangles moving along the lines. The composition itself IS the network diagram",
  "A geometric volcano rendered in constructivist style — the cone is a perfect black triangle, magma channels are red internal diagonals, the eruption is a fountain of gold geometric particles. Lava flows are horizontal red bands",
  "A constructivist library where books are geometric bricks building knowledge-structures — red volumes form load-bearing walls, black references are foundation blocks, gold rare editions are keystone arches. Reading is construction",
  "A geometric space elevator: a monumental vertical red beam extending from a black circular base through layers of atmospheric rectangles into a gold orbital platform. Cargo pods are ascending triangles on diagonal tracks",
];

const SEASONS = [
  { dir: "season-2", name: "Expressionism + Glitch", style: STYLE_EXPRESSIONISM, scenes: SCENES_S2 },
  { dir: "season-3", name: "Woodcut + Wireframe", style: STYLE_WOODCUT, scenes: SCENES_S3 },
  { dir: "season-4", name: "Constructivism + Tech", style: STYLE_CONSTRUCTIVISM, scenes: SCENES_S4 },
];

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY not set");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  for (const season of SEASONS) {
    const dir = path.join(BASE_DIR, season.dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Build interleaved queue
  const queue: { season: typeof SEASONS[0]; sceneIndex: number; slug: string }[] = [];

  for (let i = 0; i < 30; i++) {
    for (const season of SEASONS) {
      const slug = String(i + 1).padStart(2, "0");
      const filePath = path.join(BASE_DIR, season.dir, `${slug}.png`);
      if (!fs.existsSync(filePath)) {
        queue.push({ season, sceneIndex: i, slug });
      } else {
        console.log(`⏭  ${season.dir}/${slug} — exists, skipping`);
      }
    }
  }

  if (queue.length === 0) {
    console.log("All images already exist.");
    generateGallery();
    return;
  }

  console.log(`\nGenerating ${queue.length} images (interleaved across 3 seasons)...\n`);

  for (let i = 0; i < queue.length; i++) {
    const { season, sceneIndex, slug } = queue[i];
    const scene = season.scenes[sceneIndex];
    const prompt = `${season.style}\n\nScene: ${scene}`;

    console.log(`🎨 [${i + 1}/${queue.length}] ${season.dir}/${slug} — ${season.name}`);

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

      fs.writeFileSync(path.join(BASE_DIR, season.dir, `${slug}.png`), Buffer.from(imageData, "base64"));
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
  <title>Merge Conflict — All Seasons</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fafafa; font-family: -apple-system, sans-serif; padding: 40px; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
    h1 span { background: linear-gradient(135deg, #f97316, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #71717a; margin-bottom: 32px; font-size: 14px; }
    h2 { font-size: 20px; font-weight: 700; margin: 48px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #27272a; }
    .s2 { color: #facc15; }
    .s3 { color: #ec4899; }
    .s4 { color: #ef4444; }
    .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; max-width: 1600px; }
    .card { border: 1px solid #27272a; border-radius: 10px; overflow: hidden; background: #18181b; cursor: pointer; transition: border-color 0.2s; }
    .card:hover { border-color: #f97316; }
    .card img { width: 100%; aspect-ratio: 3/2; object-fit: cover; display: block; }
    .card-body { padding: 8px 12px; }
    .slug { font-size: 11px; color: #f97316; font-family: monospace; }
  </style>
</head>
<body>
  <h1>MERGE<span>CONFLICT</span> — Seasons 2-4</h1>
  <p class="subtitle">90 unique images across 3 styles. Use: image: /images/season-X/NN.png</p>

  <h2 class="s2">Season 2 — Expressionism + Glitch</h2>
  <div class="grid">
${Array.from({ length: 30 }, (_, i) => {
  const slug = String(i + 1).padStart(2, "0");
  return `    <div class="card"><img src="/images/season-2/${slug}.png" alt="s2-${slug}"><div class="card-body"><span class="slug">season-2/${slug}.png</span></div></div>`;
}).join("\n")}
  </div>

  <h2 class="s3">Season 3 — Woodcut + Wireframe</h2>
  <div class="grid">
${Array.from({ length: 30 }, (_, i) => {
  const slug = String(i + 1).padStart(2, "0");
  return `    <div class="card"><img src="/images/season-3/${slug}.png" alt="s3-${slug}"><div class="card-body"><span class="slug">season-3/${slug}.png</span></div></div>`;
}).join("\n")}
  </div>

  <h2 class="s4">Season 4 — Constructivism + Tech</h2>
  <div class="grid">
${Array.from({ length: 30 }, (_, i) => {
  const slug = String(i + 1).padStart(2, "0");
  return `    <div class="card"><img src="/images/season-4/${slug}.png" alt="s4-${slug}"><div class="card-body"><span class="slug">season-4/${slug}.png</span></div></div>`;
}).join("\n")}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(process.cwd(), "public/seasons-gallery.html"), html);
  console.log(`📄 Gallery: http://localhost:3456/seasons-gallery.html`);
}

main();
