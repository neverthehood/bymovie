import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputDir = "./raw"; // исходные JPG/PNG
const outputDir = "./public/assets/gallery"; // куда положить готовые webp

// создаём выходную папку если её нет
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

files.forEach((file, index) => {
  const inputPath = path.join(inputDir, file);

  // имя файла вида team-1.webp, team-2.webp ...
  const outputPath = path.join(outputDir, `team-${index + 1}.webp`);

  sharp(inputPath)
    .webp({ quality: 80 }) // можно 75–85, оптимальный диапазон
    .toFile(outputPath)
    .then(() => console.log(`✔ Saved: ${outputPath}`))
    .catch((err) => console.error("Error converting file", file, err));
});
