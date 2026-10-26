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
// Trace the original symbol boundaries into smooth native SVG paths, never embed a raster in the hero.
const [originX, originY, w, h] = brand.views.symbol;
const rgb = (x, y) => {
  const i = ((originY + y) * width + originX + x) * 3;
  return [pixels[i], pixels[i + 1], pixels[i + 2]];
};
const inside = (x, y) => {
  const [r, g, b] = rgb(x, y);
  return (
    Math.max(r, g, b) > 52 ||
    (Math.max(r, g, b) > 40 && Math.abs(r - g) < 6 && Math.abs(g - b) < 6)
  );
};
const mask = new Uint8Array(w * h),
  green = new Uint8Array(w * h);
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const [r, g, b] = rgb(x, y);
    mask[y * w + x] = inside(x, y) ? 1 : 0;
    green[y * w + x] =
      mask[y * w + x] &&
      (g - r > 25 || (r > 180 && r - b > 60)) &&
      g - b > 40 &&
      r > 55
        ? 1
        : 0;
  }
function clean(input, minArea) {
  const seen = new Uint8Array(input.length);
  const result = new Uint8Array(input.length);
  const components = [];
  for (let i = 0; i < input.length; i++) {
    if (!input[i] || seen[i]) continue;
    const stack = [i],
      items = [];
    seen[i] = 1;
    let minX = w,
      minY = h,
      maxX = 0,
      maxY = 0;
    while (stack.length) {
      const index = stack.pop(),
        x = index % w,
        y = Math.floor(index / w);
      items.push(index);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ])
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) {
          const n = ny * w + nx;
          if (input[n] && !seen[n]) {
            seen[n] = 1;
            stack.push(n);
          }
        }
    }
    if (items.length >= minArea) {
      for (const index of items) result[index] = 1;
      components.push({ area: items.length, minX, minY, maxX, maxY });
    }
  }
  return { mask: result, components };
}
function smooth(input, passes = 2) {
  let output = input;
  for (let pass = 0; pass < passes; pass++) {
    const next = new Uint8Array(output.length);
    for (let y = 1; y < h - 1; y++)
      for (let x = 1; x < w - 1; x++) {
        let total = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            total += output[(y + dy) * w + x + dx];
        next[y * w + x] = total >= 5 ? 1 : 0;
      }
    output = next;
  }
  return output;
}
function fillSmallHoles(input, maxArea) {
  const inverse = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) inverse[i] = input[i] ? 0 : 1;
  const seen = new Uint8Array(input.length),
    out = input.slice();
  for (let i = 0; i < inverse.length; i++) {
    if (!inverse[i] || seen[i]) continue;
    const stack = [i],
      items = [];
    seen[i] = 1;
    let edge = false;
    while (stack.length) {
      const j = stack.pop(),
        x = j % w,
        y = Math.floor(j / w);
      items.push(j);
      if (!x || !y || x === w - 1 || y === h - 1) edge = true;
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ])
        if (nx >= 0 && ny >= 0 && nx < w && ny < h) {
          const k = ny * w + nx;
          if (inverse[k] && !seen[k]) {
            seen[k] = 1;
            stack.push(k);
          }
        }
    }
    const rearShade =
      items.reduce((sum, j) => sum + (j % w), 0) / items.length > 200 &&
      items.reduce((sum, j) => sum + Math.floor(j / w), 0) / items.length > 180;
    if (!edge && (items.length < maxArea || (maxArea > 100 && rearShade)))
      for (const j of items) out[j] = 1;
  }
  return out;
}
function closeRear(input) {
  const radius = 14,
    dilated = new Uint8Array(input.length),
    out = input.slice();
  for (let y = 150; y < h; y++)
    for (let x = 0; x < w; x++) {
      let hit = false;
      for (let dy = -radius; dy <= radius && !hit; dy++)
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h && input[ny * w + nx]) {
            hit = true;
            break;
          }
        }
      dilated[y * w + x] = hit ? 1 : 0;
    }
  for (let y = 175; y < h; y++)
    for (let x = 0; x < w; x++) {
      let full = true;
      for (let dy = -radius; dy <= radius && full; dy++)
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy > radius * radius) continue;
          const nx = x + dx,
            ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (!dilated[ny * w + nx]) {
            full = false;
            break;
          }
        }
      if (x > 210 && y < h - radius) out[y * w + x] = full ? 1 : 0;
    }
  return out;
}
const cleaned = clean(
    smooth(fillSmallHoles(closeRear(fillSmallHoles(mask, 1800)), 1800), 3),
    200,
  ),
  lime = clean(smooth(fillSmallHoles(green, 100), 2), 100);
const distance = (p, a, b) => {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    length = dx * dx + dy * dy;
  const t = length
    ? Math.max(
        0,
        Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length),
      )
    : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
function simplify(points, tolerance = 1.4) {
  if (points.length < 3) return points;
  let max = 0,
    at = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = distance(points[i], points[0], points.at(-1));
    if (d > max) {
      max = d;
      at = i;
    }
  }
  if (max <= tolerance) return [points[0], points.at(-1)];
  return [
    ...simplify(points.slice(0, at + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(at), tolerance),
  ];
}
const format = (n) => Math.round(n * 100) / 100;
function rounded(points) {
  const n = points.length;
  let path = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < n; i++) {
    const a = points[(i + n - 1) % n],
      b = points[i],
      c = points[(i + 1) % n],
      d = points[(i + 2) % n];
    const corner = (p, q, r) => {
      const ux = p[0] - q[0],
        uy = p[1] - q[1],
        vx = r[0] - q[0],
        vy = r[1] - q[1];
      return (
        (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)) > -0.35
      );
    };
    const k1 = corner(a, b, c) ? 0 : 1 / 6,
      k2 = corner(b, c, d) ? 0 : 1 / 6;
    path += `C${format(b[0] + (c[0] - a[0]) * k1)} ${format(b[1] + (c[1] - a[1]) * k1)} ${format(c[0] - (d[0] - b[0]) * k2)} ${format(c[1] - (d[1] - b[1]) * k2)} ${c[0]} ${c[1]}`;
  }
  return path + "Z";
}
function trace(input) {
  const edges = new Map();
  const add = (a, b) => {
    const key = a.join(",");
    if (!edges.has(key)) edges.set(key, []);
    edges.get(key).push(b);
  };
  const filled = (x, y) =>
    x >= 0 && y >= 0 && x < w && y < h && input[y * w + x];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (filled(x, y)) {
        if (!filled(x, y - 1)) add([x, y], [x + 1, y]);
        if (!filled(x + 1, y)) add([x + 1, y], [x + 1, y + 1]);
        if (!filled(x, y + 1)) add([x + 1, y + 1], [x, y + 1]);
        if (!filled(x - 1, y)) add([x, y + 1], [x, y]);
      }
  let paths = "";
  while (edges.size) {
    const key = edges.keys().next().value,
      start = key.split(",").map(Number),
      points = [start];
    let current = start;
    for (let count = 0; count < 100000; count++) {
      const k = current.join(","),
        ends = edges.get(k);
      if (!ends?.length) break;
      const next = ends.pop();
      if (!ends.length) edges.delete(k);
      if (next[0] === start[0] && next[1] === start[1]) break;
      points.push(next);
      current = next;
    }
    if (points.length < 12) continue;
    let far = 1;
    for (let i = 1; i < points.length; i++)
      if (
        Math.hypot(points[i][0] - start[0], points[i][1] - start[1]) >
        Math.hypot(points[far][0] - start[0], points[far][1] - start[1])
      )
        far = i;
    const simple = [
      ...simplify(points.slice(0, far + 1)).slice(0, -1),
      ...simplify([...points.slice(far), points[0]]).slice(0, -1),
    ];
    if (simple.length > 2) paths += rounded(simple);
  }
  return paths;
}
const sphere = lime.components
  .filter((c) => c.minX > w * 0.65 && c.maxY < h * 0.5)
  .sort((a, b) => b.area - a.area)[0];
const output = {
  viewBox: `0 0 ${w} ${h}`,
  silhouette: trace(cleaned.mask),
  lime: trace(lime.mask),
  sphere: sphere
    ? {
        cx: (sphere.minX + sphere.maxX + 1) / 2,
        cy: (sphere.minY + sphere.maxY + 1) / 2,
        r:
          Math.min(
            sphere.maxX - sphere.minX + 1,
            sphere.maxY - sphere.minY + 1,
          ) / 2,
      }
    : null,
};
writeFileSync(
  new URL("../Frontend/data/hero-vector.json", import.meta.url),
  JSON.stringify(output) + "\n",
);
console.log(
  JSON.stringify({
    components: cleaned.components,
    green: lime.components,
    sphere: output.sphere,
    pathBytes: output.silhouette.length + output.lime.length,
  }),
);
