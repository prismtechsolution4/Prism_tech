const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function buildBrandAssets() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const imgData = fs.readFileSync('C:/Users/XXII/.gemini/antigravity/brain/ce513fe7-66d8-4fc2-a27f-6c85296079da/.user_uploaded/media_1794383889122_c0d10722.jpg');
  
  // Save original backup in public/brand/
  fs.writeFileSync('public/brand/logo-original.jpg', imgData);

  const base64Img = 'data:image/jpeg;base64,' + imgData.toString('base64');

  await page.setContent(`
    <html>
      <body style="margin: 0; background: transparent;">
        <canvas id="cOrig" width="1024" height="1024"></canvas>
        <img id="img" src="${base64Img}" />
      </body>
    </html>
  `);

  const assetBuffers = await page.evaluate(async () => {
    const img = document.getElementById('img');
    await img.decode();
    
    const cOrig = document.getElementById('cOrig');
    const ctxOrig = cOrig.getContext('2d');
    ctxOrig.drawImage(img, 0, 0);
    const srcData = ctxOrig.getImageData(0, 0, 1024, 1024);
    const d = srcData.data;

    const emblemBounds = { x: 227, y: 209, w: 556, h: 445 };
    const textBounds = { x: 247, y: 675, w: 600, h: 44 };

    // Function to process pixels with smooth antialiased matte removal
    function processPixels(invertCharcoal) {
      const out = new ImageData(1024, 1024);
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i+1], b = d[i+2];
        const minVal = Math.min(r, g, b);
        let a = 0;

        if (minVal < 252) {
          // Precise alpha curve for antialiasing
          a = Math.min(1, Math.max(0, (253 - minVal) / 248));
          a = Math.pow(a, 0.90);
        }

        if (a > 0.005) {
          const invA = 1 / Math.max(a, 0.05);
          let ur = Math.max(0, Math.min(255, (r - 255 * (1 - a)) * invA));
          let ug = Math.max(0, Math.min(255, (g - 255 * (1 - a)) * invA));
          let ub = Math.max(0, Math.min(255, (b - 255 * (1 - a)) * invA));

          // Detect blue vs charcoal
          const isBlue = ub > ur + 25 && ub > ug + 10;
          const isCharcoal = !isBlue && (ur < 135 && ug < 135 && ub < 135);

          if (invertCharcoal && isCharcoal) {
            // Bright, high-contrast white on dark theme
            ur = 255;
            ug = 255;
            ub = 255;
          }

          out.data[i] = ur;
          out.data[i+1] = ug;
          out.data[i+2] = ub;
          out.data[i+3] = Math.round(a * 255);
        } else {
          out.data[i] = 0;
          out.data[i+1] = 0;
          out.data[i+2] = 0;
          out.data[i+3] = 0;
        }
      }
      return out;
    }

    const adaptedImgData = processPixels(true);
    const origImgData = processPixels(false);

    // Helper to get dataURL from canvas
    function getCanvasDataURL(w, h, drawFn) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      drawFn(ctx);
      return c.toDataURL('image/png');
    }

    // 1. Emblem only canvas (High-res 556x445)
    ctxOrig.putImageData(adaptedImgData, 0, 0);
    const cEmblem = document.createElement('canvas');
    cEmblem.width = emblemBounds.w;
    cEmblem.height = emblemBounds.h;
    const ctxEmb = cEmblem.getContext('2d');
    ctxEmb.drawImage(cOrig, emblemBounds.x, emblemBounds.y, emblemBounds.w, emblemBounds.h, 0, 0, emblemBounds.w, emblemBounds.h);

    // Text only canvas
    const cText = document.createElement('canvas');
    cText.width = textBounds.w;
    cText.height = textBounds.h;
    const ctxTxt = cText.getContext('2d');
    ctxTxt.drawImage(cOrig, textBounds.x, textBounds.y, textBounds.w, textBounds.h, 0, 0, textBounds.w, textBounds.h);

    // 2. Generate Horizontal Lockup (logo-transparent.png) at 2x resolution: 1500 x 240
    // At 2x, emblem height = 192, text height = 84
    const lockupDataUrl = getCanvasDataURL(1500, 240, (ctx) => {
      const embH = 192;
      const embW = Math.round(emblemBounds.w * (embH / emblemBounds.h)); // ~240px
      const embX = 16;
      const embY = Math.round((240 - embH) / 2);
      ctx.drawImage(cEmblem, embX, embY, embW, embH);

      const txtH = 82;
      const txtW = Math.round(textBounds.w * (txtH / textBounds.h)); // ~1118px
      const txtX = embX + embW + 48;
      const txtY = Math.round((240 - txtH) / 2);
      ctx.drawImage(cText, txtX, txtY, txtW, txtH);
    });

    // 3. Generate Square Icon (logo-icon.png) at 512 x 512
    const iconDataUrl = getCanvasDataURL(512, 512, (ctx) => {
      // Emblem aspect ratio is 556:445
      // Fit with 10% padding: target width ~430, height ~344
      const targetW = 420;
      const targetH = Math.round(emblemBounds.h * (targetW / emblemBounds.w)); // ~336
      const x = Math.round((512 - targetW) / 2);
      const y = Math.round((512 - targetH) / 2);
      ctx.drawImage(cEmblem, x, y, targetW, targetH);
    });

    // 4. Generate Stacked Logo (logo-stacked.png) at 1024 x 1024
    const stackedDataUrl = getCanvasDataURL(1024, 1024, (ctx) => {
      const embH = 500;
      const embW = Math.round(emblemBounds.w * (embH / emblemBounds.h)); // ~625
      const embX = Math.round((1024 - embW) / 2);
      const embY = 180;
      ctx.drawImage(cEmblem, embX, embY, embW, embH);

      const txtH = 56;
      const txtW = Math.round(textBounds.w * (txtH / textBounds.h)); // ~763
      const txtX = Math.round((1024 - txtW) / 2);
      const txtY = embY + embH + 50;
      ctx.drawImage(cText, txtX, txtY, txtW, txtH);
    });

    // 5. Generate Favicon Canvas (64 x 64) with subtle dark round-rect
    const faviconDataUrl = getCanvasDataURL(64, 64, (ctx) => {
      ctx.fillStyle = '#05080a';
      ctx.beginPath();
      ctx.roundRect(0, 0, 64, 64, 14);
      ctx.fill();

      const embW = 48;
      const embH = Math.round(emblemBounds.h * (embW / emblemBounds.w)); // ~38
      const x = Math.round((64 - embW) / 2);
      const y = Math.round((64 - embH) / 2);
      ctx.drawImage(cEmblem, x, y, embW, embH);
    });

    return {
      lockup: lockupDataUrl,
      icon: iconDataUrl,
      stacked: stackedDataUrl,
      favicon: faviconDataUrl
    };
  });

  // Write PNG files
  function saveBase64(filePath, dataUrl) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    console.log(`Saved ${filePath}`);
  }

  saveBase64('public/brand/logo-transparent.png', assetBuffers.lockup);
  saveBase64('public/brand/logo-icon.png', assetBuffers.icon);
  saveBase64('public/brand/logo-stacked.png', assetBuffers.stacked);
  saveBase64('public/brand/prismtech-logo-clean.png', assetBuffers.lockup);
  saveBase64('public/brand/prismtech-logo.png', assetBuffers.lockup);
  saveBase64('public/favicon.ico', assetBuffers.favicon);

  await browser.close();
}

buildBrandAssets().then(() => {
  console.log('All brand assets successfully built!');
}).catch(err => {
  console.error('Error building assets:', err);
});
