const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    rgbaBuffer.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([header, makeChunk('IHDR', ihdr), makeChunk('IDAT', idat), makeChunk('IEND', Buffer.alloc(0))]);
}

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8, idatChunks = [], width = 0, height = 0;
  while(pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4, stride = 1 + width * bpp;
  const uncompressed = Buffer.alloc(width * height * 4);
  function paeth(a, b, c) {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }
  for (let y = 0; y < height; y++) {
    const filterType = raw[y * stride];
    for (let x = 0; x < width * bpp; x++) {
      const rawByte = raw[y * stride + 1 + x];
      const left = x >= bpp ? uncompressed[y * width * bpp + x - bpp] : 0;
      const up = y > 0 ? uncompressed[(y - 1) * width * bpp + x] : 0;
      const upleft = (y > 0 && x >= bpp) ? uncompressed[(y - 1) * width * bpp + x - bpp] : 0;
      let val = 0;
      if (filterType === 0) val = rawByte;
      else if (filterType === 1) val = (rawByte + left) & 0xff;
      else if (filterType === 2) val = (rawByte + up) & 0xff;
      else if (filterType === 3) val = (rawByte + Math.floor((left + up) / 2)) & 0xff;
      else if (filterType === 4) val = (rawByte + paeth(left, up, upleft)) & 0xff;
      uncompressed[y * width * bpp + x] = val;
    }
  }
  return { width, height, uncompressed };
}

const { width, height, uncompressed } = decodePNG('public/brand/prismtech-logo.png');

// Find bounding box where luminosity > 35
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const lum = Math.max(uncompressed[idx], uncompressed[idx+1], uncompressed[idx+2]);
    if (lum > 32) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Add padding of 4px
const pad = 4;
minX = Math.max(0, minX - pad);
maxX = Math.min(width - 1, maxX + pad);
minY = Math.max(0, minY - pad);
maxY = Math.min(height - 1, maxY + pad);

const cropW = maxX - minX + 1;
const cropH = maxY - minY + 1;
const cropBuf = Buffer.alloc(cropW * cropH * 4);

// Background removal with smooth alpha
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((minY + y) * width + (minX + x)) * 4;
    const destIdx = (y * cropW + x) * 4;
    const r = uncompressed[srcIdx];
    const g = uncompressed[srcIdx + 1];
    const b = uncompressed[srcIdx + 2];
    
    // Background color is approx 11, 14, 19
    const maxVal = Math.max(r, g, b);
    let alpha = 255;
    if (maxVal <= 24) {
      alpha = 0;
    } else if (maxVal < 60) {
      alpha = Math.round(((maxVal - 24) / 36) * 255);
    }
    
    cropBuf[destIdx] = r;
    cropBuf[destIdx + 1] = g;
    cropBuf[destIdx + 2] = b;
    cropBuf[destIdx + 3] = alpha;
  }
}

const png = encodePNG(cropW, cropH, cropBuf);
fs.writeFileSync('public/brand/prismtech-logo-clean.png', png);
console.log('Saved public/brand/prismtech-logo-clean.png', cropW, 'x', cropH);
