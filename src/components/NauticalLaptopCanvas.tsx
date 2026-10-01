import React from 'react';
import { useCanvasScene } from '../lib/useCanvasScene';
import { TAU, drawChart, pseudo, roundRectPath, waveY } from '../lib/nautical';

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  x: pseudo(i + 1),
  y: pseudo(i + 40),
  r: 0.6 + pseudo(i + 80) * 1.5,
  s: 0.01 + pseudo(i + 120) * 0.025,
  a: 0.12 + pseudo(i + 160) * 0.4,
}));

const drawScene = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  ctx.clearRect(0, 0, w, h);

  // Р¤РѕРЅ
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#061a2b');
  bg.addColorStop(0.55, '#0c2c45');
  bg.addColorStop(1, '#04121f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const unit = Math.min(w, h);

  // Р“РµРѕРјРµС‚СЂРёСЏ РЅРѕСѓС‚Р±СѓРєР°
  const lidW = Math.min(w * 0.7, h * 1.05);
  const lidH = lidW * 0.625 * 1.1;
  const lidX = (w - lidW) / 2;
  const lidY = Math.max(unit * 0.07, (h - lidH * 1.18) * 0.46);
  const baseH = lidH * 0.075;
  const baseY = lidY + lidH;
  const baseW = lidW * 1.3;
  const baseX = (w - baseW) / 2;

  // РЎРІРµС‡РµРЅРёРµ Р·Р° РЅРѕСѓС‚Р±СѓРєРѕРј
  const glowX = w / 2;
  const glowY = lidY + lidH * 0.45;
  const glowR = Math.max(lidW * 0.75, h * 0.5);
  const glow = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.7);
  glow.addColorStop(0, `rgba(56,189,248,${0.16 + breathe * 0.08})`);
  glow.addColorStop(0.55, 'rgba(14,116,144,0.08)');
  glow.addColorStop(1, 'rgba(14,116,144,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Р’РѕСЃС…РѕРґСЏС‰РёРµ С‡Р°СЃС‚РёС†С‹
  for (const p of PARTICLES) {
    const y = ((p.y - t * p.s) % 1 + 1) % 1;
    ctx.fillStyle = `rgba(186,230,253,${p.a * (0.4 + 0.6 * (1 - y))})`;
    ctx.beginPath();
    ctx.arc(p.x * w, y * h, p.r, 0, TAU);
    ctx.fill();
  }

  // Р”Р°Р»СЊРЅСЏСЏ РІРѕРґР°
  const seaY = baseY + baseH * 0.55;
  const sea = ctx.createLinearGradient(0, seaY, 0, h);
  sea.addColorStop(0, 'rgba(12,74,110,0.55)');
  sea.addColorStop(1, 'rgba(3,15,28,0.95)');
  ctx.fillStyle = sea;
  ctx.beginPath();
  ctx.moveTo(0, seaY);
  for (let x = 0; x <= w; x += 6) ctx.lineTo(x, waveY(x, seaY, t, h * 0.012, w * 0.32, 0.8, 0));
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // РўРµРЅСЊ РЅРѕСѓС‚Р±СѓРєР°
  ctx.save();
  ctx.translate(w / 2, baseY + baseH * 0.9);
  ctx.scale(1, 0.22);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, baseW * 0.62);
  shadow.addColorStop(0, 'rgba(0,0,0,0.55)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, baseW * 0.62, 0, TAU);
  ctx.fill();
  ctx.restore();

  // РљРѕСЂРїСѓСЃ РЅРѕСѓС‚Р±СѓРєР°
  const caseGrad = ctx.createLinearGradient(lidX, lidY, lidX + lidW, baseY);
  caseGrad.addColorStop(0, '#33475b');
  caseGrad.addColorStop(0.5, '#1d2b39');
  caseGrad.addColorStop(1, '#0e1721');
  ctx.fillStyle = caseGrad;
  roundRectPath(ctx, lidX, lidY, lidW, lidH, lidW * 0.035);
  ctx.fill();
  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.lineWidth = Math.max(0.6, unit * 0.002);
  ctx.stroke();

  // Р­РєСЂР°РЅ
  const bezel = lidW * 0.03;
  const sx = lidX + bezel;
  const sy = lidY + bezel * 0.8;
  const sw = lidW - bezel * 2;
  const sh = lidH - bezel * 1.7;
  ctx.fillStyle = '#05080c';
  roundRectPath(ctx, sx - bezel * 0.4, sy - bezel * 0.4, sw + bezel * 0.8, sh + bezel * 0.8, sw * 0.02);
  ctx.fill();
  drawChart(ctx, sx, sy, sw, sh, t);

  // РљР°РјРµСЂР°
  ctx.fillStyle = 'rgba(148,163,184,0.5)';
  ctx.beginPath();
  ctx.arc(w / 2, lidY + bezel * 0.42, Math.max(0.8, lidW * 0.004), 0, TAU);
  ctx.fill();

  // РљСЂС‹С€РєР°-РєР»Р°РІРёР°С‚СѓСЂР°
  const baseGrad = ctx.createLinearGradient(baseX, baseY, baseX, baseY + baseH);
  baseGrad.addColorStop(0, '#3a5165');
  baseGrad.addColorStop(0.35, '#223140');
  baseGrad.addColorStop(1, '#0b1219');
  ctx.beginPath();
  ctx.moveTo(lidX + lidW * 0.02, baseY);
  ctx.lineTo(lidX + lidW * 0.98, baseY);
  ctx.lineTo(baseX + baseW, baseY + baseH);
  ctx.lineTo(baseX, baseY + baseH);
  ctx.closePath();
  ctx.fillStyle = baseGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(148,163,184,0.3)';
  ctx.lineWidth = Math.max(0.6, unit * 0.002);
  ctx.stroke();

  ctx.fillStyle = 'rgba(2,6,12,0.6)';
  ctx.beginPath();
  ctx.moveTo(w / 2 - baseW * 0.11, baseY + baseH * 0.08);
  ctx.lineTo(w / 2 + baseW * 0.11, baseY + baseH * 0.08);
  ctx.lineTo(w / 2 + baseW * 0.13, baseY + baseH * 0.86);
  ctx.lineTo(w / 2 - baseW * 0.13, baseY + baseH * 0.86);
  ctx.closePath();
  ctx.fill();

  // Р‘Р»РёРє РїРѕ РєСЂРѕРјРєРµ
  ctx.strokeStyle = 'rgba(226,232,240,0.25)';
  ctx.lineWidth = Math.max(0.5, unit * 0.0015);
  ctx.beginPath();
  ctx.moveTo(baseX + baseW * 0.06, baseY + baseH * 0.12);
  ctx.lineTo(baseX + baseW * 0.94, baseY + baseH * 0.12);
  ctx.stroke();

  // Р‘Р»РёР¶РЅРёРµ РІРѕР»РЅС‹ РїРѕРІРµСЂС… РєРѕСЂРїСѓСЃР°
  const waves: Array<[number, number, number, number, number, string]> = [
    [baseY + baseH * 0.75, h * 0.016, w * 0.22, 1.1, 0.4, 'rgba(125,211,252,0.5)'],
    [baseY + baseH * 1.5, h * 0.022, w * 0.3, 0.8, 2.1, 'rgba(56,189,248,0.38)'],
    [baseY + baseH * 2.4, h * 0.026, w * 0.4, 0.6, 4.3, 'rgba(14,165,233,0.3)'],
  ];
  ctx.lineWidth = Math.max(0.8, unit * 0.0035);
  for (const [y, amp, len, speed, phase, color] of waves) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 5) {
      const py = waveY(x, y, t, amp, len, speed, phase);
      if (x === 0) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();
  }
};

export const NauticalLaptopCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useCanvasScene(drawScene);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="РќРѕСѓС‚Р±СѓРє СЃ РјРѕСЂСЃРєРѕР№ РЅР°РІРёРіР°С†РёРѕРЅРЅРѕР№ РєР°СЂС‚РѕР№: СЃСѓРґРЅРѕ РёРґС‘С‚ РїРѕ РјР°СЂС€СЂСѓС‚Сѓ"
      className={`block h-full w-full ${className}`}
    />
  );
};
