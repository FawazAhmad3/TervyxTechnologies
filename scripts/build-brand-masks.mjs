// Build SVG visibility masks around the supplied artwork. The source bitmap and its RGB values remain untouched.
import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
const brand = JSON.parse(
  readFileSync(new URL("../Frontend/data/brand.json", import.meta.url), "utf8"),
);
const source = readFileSync(
  new URL("../Frontend/public/brand/brand-board.png", import.meta.url),
);
const width = source.readUInt32BE(16),
  height = source.readUInt32BE(20);
if (source[24] !== 8 || source[25] !== 2 || source[28] !== 0)
  throw new Error("Expected the original non-interlaced 8-bit RGB PNG.");
const chunks = [];
for (let offset = 8; offset < source.length;) {
  const length = source.readUInt32BE(offset),
    type = source.toString("ascii", offset + 4, offset + 8);
  if (type === "IDAT")
    chunks.push(source.subarray(offset + 8, offset + 8 + length));
  offset += length + 12;
}
const raw = inflateSync(Buffer.concat(chunks)),
  stride = width * 3,
  pixels = Buffer.alloc(stride * height);
const paeth = (a, b, c) => {
  const p = a + b - c,
    pa = Math.abs(p - a),
    pb = Math.abs(p - b),
    pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < height; y++) {
  const type = raw[y * (stride + 1)];
  for (let i = 0; i < stride; i++) {
    const index = y * stride + i,
      a = i >= 3 ? pixels[index - 3] : 0,
      b = y ? pixels[index - stride] : 0,
      c = y && i >= 3 ? pixels[index - stride - 3] : 0;
    const prediction =
      type === 0
        ? 0
        : type === 1
          ? a
          : type === 2
            ? b
            : type === 3
              ? Math.floor((a + b) / 2)
              : paeth(a, b, c);
    pixels[index] = (raw[y * (stride + 1) + i + 1] + prediction) & 255;
  }
}
const paths = {};
for (const [name, [x, y, w, h]] of Object.entries(brand.views)) {
  if (name === "icon-dark" || name === "icon-light") continue;
  let path = "";
  const visible = (px, py) => {
    const i = (py * width + px) * 3,
      r = pixels[i],
      g = pixels[i + 1],
      b = pixels[i + 2],
      max = Math.max(r, g, b);
    return max > 38 || (max > 26 && Math.abs(r - g) < 6 && Math.abs(g - b) < 6);
  };
  for (let row = y; row < y + h; row++) {
    let start = -1;
    for (let col = x; col <= x + w; col++) {
      const keep = col < x + w && visible(col, row);
      if (keep && start < 0) start = col;
      if (!keep && start >= 0) {
        const length = col - start;
        path += `M${start} ${row}h${length}v1h-${length}z`;
        start = -1;
      }
    }
  }
  paths[name] = path;
}
writeFileSync(
  new URL("../Frontend/data/brand-masks.json", import.meta.url),
  JSON.stringify(paths) + "\n",
);
console.log(
  "Generated original-color SVG visibility masks. Source artwork unchanged.",
);
