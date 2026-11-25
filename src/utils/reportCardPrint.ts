export function formatReportCardPosition(rank: number, classTotal: number): string {
  return `${rank} kati ya ${classTotal}`;
}

type TrimImage = {
  src: string;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  naturalWidth: number;
  naturalHeight: number;
};

type TrimCanvasContext = {
  getImageData(x: number, y: number, width: number, height: number): { data: Uint8ClampedArray };
  putImageData?(data: any, x: number, y: number): void;
  drawImage(image: any, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
};

type TrimCanvas = {
  width: number;
  height: number;
  getContext(type: string): TrimCanvasContext | null;
  toDataURL(type?: string): string;
};

export type SignatureTrimEnvironment = {
  createImage(): TrimImage;
  createCanvas(): TrimCanvas;
};

const SIGNATURE_MAX_WIDTH = 480;

// Prepares a signature image for storing/printing:
//  - white / near-white paper background becomes transparent (photos and scans are opaque),
//  - ink is darkened so it stays strong on a black & white printer,
//  - empty margins are cropped away so the signature fills its box,
//  - the picture is shrunk to a small PNG (a few KB instead of several MB).
export async function trimSignatureDataUrl(
  source: string,
  environment: SignatureTrimEnvironment = {
    createImage: () => new Image(),
    createCanvas: () => document.createElement('canvas')
  }
): Promise<string> {
  if (!source) return source;

  try {
    const image = environment.createImage();
    const loaded = new Promise<boolean>(resolve => {
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = source;
    });
    if (!await loaded || image.naturalWidth === 0 || image.naturalHeight === 0) return source;

    const canvas = environment.createCanvas();
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) return source;
    context.drawImage(image, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

    const imageData: any = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let left = canvas.width;
    let top = canvas.height;
    let right = -1;
    let bottom = -1;
    const canRewrite = typeof context.putImageData === 'function';

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        let alpha = pixels[i + 3];
        if (canRewrite && alpha > 0) {
          const lum = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
          const strength = Math.max(0, Math.min(1, (235 - lum) / 85));
          alpha = Math.round(alpha * strength);
          pixels[i] = pixels[i] * 0.55;
          pixels[i + 1] = pixels[i + 1] * 0.55;
          pixels[i + 2] = pixels[i + 2] * 0.55;
          pixels[i + 3] = alpha;
        }
        if (alpha > 25) {
          if (x < left) left = x;
          if (y < top) top = y;
          if (x > right) right = x;
          if (y > bottom) bottom = y;
        }
      }
    }

    if (right < left || bottom < top) return '';
    if (canRewrite) context.putImageData!(imageData, 0, 0);

    const pad = 4;
    left = Math.max(0, left - pad);
    top = Math.max(0, top - pad);
    right = Math.min(canvas.width - 1, right + pad);
    bottom = Math.min(canvas.height - 1, bottom + pad);
    const cropWidth = right - left + 1;
    const cropHeight = bottom - top + 1;
    const scale = Math.min(1, SIGNATURE_MAX_WIDTH / cropWidth);
    const outWidth = Math.max(1, Math.round(cropWidth * scale));
    const outHeight = Math.max(1, Math.round(cropHeight * scale));

    const output = environment.createCanvas();
    output.width = outWidth;
    output.height = outHeight;
    const outContext = output.getContext('2d');
    if (!outContext) return source;
    outContext.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, outWidth, outHeight);
    return output.toDataURL('image/png');
  } catch {
    return source;
  }
}

export function createReportCardPrintDocument(cardsHtml: string): string {
  return `<!DOCTYPE html>
<html lang="sw">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Report Cards</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { width: 100%; margin: 0; padding: 0; }
  body {
    color: #000;
    background: #fff;
    font-family: Arial, "Segoe UI", Helvetica, sans-serif;
    font-size: 10.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .report-card {
    width: 100%;
    max-width: 210mm;
    margin: 12px auto;
    padding: 8mm 10mm 7mm;
    background: #fff;
    border: 1px solid #888;
    border-radius: 4mm;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .header {
    position: relative;
    width: 100%;
    margin: 0 0 3mm;
    padding: 0 0 3mm;
    text-align: center;
    border-bottom: 3px double #000;
  }
  .header > * { max-width: 100%; overflow-wrap: anywhere; }
  .header img {
    display: block;
    width: auto;
    height: auto;
    max-width: 22mm;
    max-height: 22mm;
    margin: 0 auto 2mm;
    object-fit: contain;
  }
  .header .lh-side { width: 27mm; height: 27mm; }
  .header .lh-side img { max-width: 27mm !important; max-height: 27mm !important; width: auto !important; height: auto !important; }
  .header .lh-center { padding: 0 2mm; }
  .council-name { color: #222; font-size: 9pt !important; font-weight: 700; }
  .school-name { color: #000; font-size: 18pt !important; line-height: 1.15; }
  .report-title {
    display: inline-block;
    max-width: 100%;
    margin-top: 2mm !important;
    padding: 2mm 4mm;
    border-radius: 2mm;
    border: 2px solid #000;
    color: #000;
    background: #fff;
    font-family: Arial, "Segoe UI", Helvetica, sans-serif;
    font-size: 12pt !important;
    font-weight: 700;
    letter-spacing: 0;
    text-decoration: none !important;
  }
  .exam-name { margin-top: 1.5mm !important; color: #000; font-size: 10pt !important; font-weight: 700; }
  .info-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    width: 100%;
    margin: 0 0 3mm;
    overflow-wrap: anywhere;
    border: 1px solid #000;
    border-radius: 2mm;
    background: #f2f2f2;
  }
  .info-cell { min-width: 0; padding: 2.5mm 3mm; border: 1px solid #000; font-size: 10pt; }
  .info-label { color: #222; }
  .info-value { color: #000; font-weight: 700; }
  table {
    width: 100%;
    max-width: 100%;
    margin: 2.5mm 0;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th, td {
    min-width: 0;
    padding: 1.8mm 1.4mm;
    border: 1px solid #000;
    font-size: 10pt;
    line-height: 1.15;
    overflow-wrap: anywhere;
    font-family: inherit;
  }
  .subjects-table th {
    border: 1.5px solid #000;
    color: #000 !important;
    background: #d9d9d9 !important;
    font-weight: 700;
  }
  .subjects-table th:first-child, .subjects-table td:first-child { width: 38%; text-align: left !important; }
  .subjects-table th:nth-child(2), .subjects-table td:nth-child(2) { width: 14%; }
  .subjects-table th:nth-child(3), .subjects-table td:nth-child(3) { width: 12%; }
  .subjects-table th:nth-child(4), .subjects-table td:nth-child(4) { width: 13%; }
  .subjects-table th:nth-child(5), .subjects-table td:nth-child(5) { width: 23%; }
  .subjects-table th:not(:first-child), .subjects-table td:not(:first-child) { text-align: center !important; }
  .subjects-table tbody tr:nth-child(even) { background: #f2f2f2; }
  .subjects-table tbody tr:last-child { border-top: 2px solid #000; background: #fff !important; font-weight: 700; }
  .grade-low { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 1.5px; }
  .grade-box {
    width: 100%;
    margin: 2.5mm 0;
    padding: 2.5mm;
    border: 1.5px solid #000;
    border-radius: 2mm;
    background: #e3e3e3;
    color: #000;
    text-align: center;
  }
  .behavior-table { margin-top: 3mm; }
  .behavior-table thead tr:nth-child(2) th {
    width: 10%;
    padding: 0.8mm 0.2mm !important;
    font-size: 8pt !important;
    line-height: 1.05;
    letter-spacing: 0;
    white-space: normal;
    overflow-wrap: anywhere;
    vertical-align: middle;
  }
  .behavior-table th {
    border: 1px solid #000;
    padding: 1mm 0.2mm !important;
    color: #000 !important;
    background: #e3e3e3 !important;
    font-size: 8pt !important;
    font-family: inherit;
  }
  .behavior-table th strong { font-family: inherit !important; }
  .behavior-table td {
    height: 8mm;
    padding: 0.5mm 0.2mm !important;
    font-size: 8pt !important;
    line-height: 1.05;
    font-weight: 700;
    text-align: center;
    vertical-align: middle;
    overflow-wrap: anywhere;
  }
  .comments-row { display: flex; width: 100%; gap: 3mm; margin-top: 4mm; align-items: stretch; }
  .comment-box {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-width: 0;
    padding: 0 2.5mm 2.5mm;
    border: 1px solid #000;
    border-radius: 2mm;
    background: #fff;
    overflow-wrap: anywhere;
  }
  .comment-title {
    margin: 0 -2.5mm 2mm;
    padding: 2mm 2.5mm 1.5mm;
    border-radius: 2mm 2mm 0 0;
    border-bottom: 2px solid #000;
    color: #000;
    background: #d9d9d9;
    font-size: 9.5pt;
    font-weight: 700;
  }
  .comment-text { flex: 1 1 auto; min-width: 0; font-size: 9.5pt; line-height: 1.3; }
  .sig-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1mm;
    min-width: 0;
    min-height: 23mm;
    margin-top: 2mm;
    font-size: 9pt;
  }
  .sig-row > span { display: flex; min-width: 0; align-items: flex-end; gap: 1mm; }
  .sig-row > span:first-child { flex: 1 1 0; }
  .sig-row > span:last-child { flex: 0 0 auto; justify-content: flex-end; }
  .sig-img {
    display: block;
    width: auto;
    height: 20mm;
    max-width: 52mm;
    max-height: 20mm;
    object-fit: contain;
    object-position: bottom right;
    margin-bottom: 0;
    border: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    mix-blend-mode: multiply;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .footer {
    width: 100%;
    margin-top: 3mm;
    padding-top: 2mm;
    border-top: 1px solid #000;
    color: #000 !important;
    font-size: 9pt !important;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .page-break { break-after: page; page-break-after: always; }
  @media screen {
    .report-card { min-height: 297mm; box-shadow: 0 4px 18px #00000018; }
  }
  @media screen and (max-width: 600px) {
    .report-card { padding: 6mm; }
    .school-name { font-size: clamp(14px, 5vw, 18px) !important; }
    .report-title { font-size: clamp(10px, 3.2vw, 12px) !important; padding: 1mm 2mm; }
    .subjects-table th { padding: 1mm 0.5mm; font-size: 9px; white-space: nowrap; }
    .comments-row { flex-direction: column; }
  }
  @media print {
    * { color-adjust: exact; }
    html, body { width: 100%; margin: 0; padding: 0; background: #fff; overflow: visible; }
    .report-card {
      width: 100%;
      max-width: none;
      margin: 0;
      padding: 7mm 9mm 6mm;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .page-break { break-after: page; page-break-after: always; }
    .subjects-table { margin: 2mm 0; }
    .subjects-table th, .subjects-table td { padding: 1.5mm 1.1mm; }
    .behavior-table th { overflow-wrap: anywhere; word-break: normal; hyphens: none; }
    .info-cell { padding: 2mm 2.5mm; }
    .grade-box { margin: 2.5mm 0; padding: 2.5mm; }
    .comment-title { padding-top: 1.8mm; padding-bottom: 1.5mm; }
    .comment-text { font-size: 9.5pt; line-height: 1.25; }
    .sig-row { min-height: 22mm; }
    .sig-img { max-height: 20mm; }
    .footer { margin-top: 3mm; padding-top: 2mm; }
    .report-card--compact .header { margin-bottom: 2mm; padding-bottom: 2mm; }
    .report-card--compact .school-name { font-size: 16pt !important; }
    .report-card--compact .report-title { font-size: 11pt !important; }
    .report-card--compact table { margin: 2mm 0; }
    .report-card--compact th, .report-card--compact td { padding: 1mm 0.8mm; font-size: 9pt; line-height: 1.1; }
    .report-card--compact .info-cell { padding: 1.6mm 2mm; font-size: 9pt; }
    .report-card--compact .grade-box { margin: 1.8mm 0; padding: 1.8mm; }
    .report-card--compact .comment-box { padding-bottom: 1.5mm; }
    .report-card--compact .comment-text { font-size: 9pt; line-height: 1.15; }
    .report-card--compact .sig-row { min-height: 21mm; font-size: 9pt; }
    .report-card--compact .sig-img { max-height: 19mm; }
    .report-card--long-comments .header { margin-bottom: 1mm; padding-bottom: 1mm; }
    .report-card--long-comments .info-cell { padding: 1mm 2mm; }
    .report-card--long-comments .subjects-table { margin: 1mm 0; }
    .report-card--long-comments .subjects-table th,
    .report-card--long-comments .subjects-table td { padding: 0.8mm 0.8mm; }
    .report-card--long-comments .grade-box { margin: 1.2mm 0; padding: 1.2mm; }
    .report-card--long-comments .behavior-table { margin: 0.5mm 0 !important; }
    .report-card--long-comments .behavior-table th { padding: 0.5mm 0.15mm !important; }
    .report-card--long-comments .behavior-table td { padding: 0.5mm 0.5mm !important; }
    .report-card--long-comments .comments-row { gap: 2mm; margin-top: 1mm; }
    .report-card--long-comments .comment-title { margin-bottom: 1mm; padding-top: 1mm; padding-bottom: 1mm; }
    .report-card--long-comments .comment-text { font-size: 9pt; line-height: 1.05; }
    .report-card--long-comments.report-card--compact .comment-text { font-size: 9pt; line-height: 1.05; }
  }
</style>
</head>
<body>${cardsHtml}</body>
</html>`;
}
