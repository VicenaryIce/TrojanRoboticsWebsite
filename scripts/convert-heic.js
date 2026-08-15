// scripts/convert-heic.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import convert from 'heic-convert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, '../src/assets/images');
const ORIGINALS_DIR = path.join(IMAGES_DIR, '_originals');

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Images folder not found at ${IMAGES_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(ORIGINALS_DIR)) {
    fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.heic$/i.test(f)
  );

  if (files.length === 0) {
    console.log('No .HEIC files found — nothing to convert.');
    return;
  }

  console.log(`Found ${files.length} HEIC file(s) to convert.\n`);

  const failed = [];

  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    const baseName = file.replace(/\.heic$/i, '');
    const outputPath = path.join(IMAGES_DIR, `${baseName}.jpg`);

    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.92
      });
      fs.writeFileSync(outputPath, outputBuffer);

      // Move original into _originals/ instead of deleting it
      fs.renameSync(inputPath, path.join(ORIGINALS_DIR, file));

      console.log(`✓ ${file} → ${baseName}.jpg`);
    } catch (err) {
      console.error(`✗ Failed to convert ${file}: ${err.message}`);
      failed.push(file);
    }
  }

  console.log(`\nDone. ${files.length - failed.length}/${files.length} converted.`);
  if (failed.length) {
    console.log('\nThe following files could NOT be converted automatically:');
    failed.forEach(f => console.log(`  - ${f}`));
    console.log('\nRe-export these manually as .jpg (e.g. via macOS Preview or Photos) and drop them back into the images folder.');
  }
}

main();
