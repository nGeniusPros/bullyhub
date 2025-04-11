/**
 * Script to fetch dog images from the Dog API and save them to public/images/dog-api/
 * Usage: node scripts/fetch-dog-images.js [count]
 */

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const DOG_API_KEY = process.env.DOG_API_KEY || "live_QTXVxRVbZz6jjQf6FeSGiy6NMoN1eS3Ez10bY2mmbyIwJWqIyRMqVtFAYgmAO56N";
const IMAGE_COUNT = parseInt(process.argv[2], 10) || 10;
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "dog-api");

async function fetchDogImages(count) {
  const res = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${count}`, {
    headers: { "x-api-key": DOG_API_KEY }
  });
  if (!res.ok) throw new Error("Failed to fetch dog images");
  return await res.json();
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${url}`);
  const buffer = await res.buffer();
  fs.writeFileSync(dest, buffer);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const images = await fetchDogImages(IMAGE_COUNT);
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = path.extname(new URL(img.url).pathname) || ".jpg";
    const filename = `dogapi_${i + 1}${ext}`;
    const dest = path.join(OUTPUT_DIR, filename);
    await downloadImage(img.url, dest);
    console.log(`Saved: ${dest}`);
  }
  console.log(`Downloaded ${images.length} images to ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
