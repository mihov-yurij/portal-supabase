import React from 'react';
import { useCanvasScene } from '../lib/useCanvasScene';
import { TAU, drawChart, pseudo, roundRectPath, waveY } from '../lib/nautical';

const MOTES = Array.from({ length: 46 }, (_, i) => ({
  u: pseudo(i + 3),
  v: pseudo(i + 71),
  r: 0.5 + pseudo(i + 131) * 1.6,
  s: 0.006 + pseudo(i + 191) * 0.02,
}));

const dir = (a: number) => ({ x: Math.cos(a), y: Math.sin(a) });

/** РћР±РёРІРєР° РїРµСЂРµР±РѕСЂРєРё РєР°СЋС‚С‹: РІРµСЂС‚РёРєР°Р»СЊРЅС‹Рµ РґРѕСЃРєРё, С€РІС‹, СЃСѓС‡РєРё. */
const drawWall = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const tableY = h * 0.64;
  const wall = ctx.createLinearGradient(0, -h * 0.2, w * 0.6, tableY);
  wall.addColorStop(0, '#2f2318');
  wall.addColorStop(0.5, '#3d2d1f');
  wall.addColorStop(1, '#241a12');
  ctx.fillStyle = wall;
  ctx.fillRect(-w * 0.2, -h * 0.2, w * 1.4, tableY + h * 0.25);

  const planks = 9;
  const pw = (w * 1.2) / planks;
  for (let i = 0; i < planks; i++) {
    const x = -w * 0.1 + i * pw;
    ctx.fillStyle = `rgba(255,214,160,${0.018 + pseudo(i + 5) * 0.022})`;
    ctx.fillRect(x, -h * 0.2, pw, tableY + h * 0.25);
    ctx.strokeStyle = 'rgba(18,11,6,0.55)';
    ctx.lineWidth = Math.max(0.8, w * 0.0018);
    ctx.beginPath();
    ctx.moveTo(x, -h * 0.2);
    ctx.lineTo(x, tableY + h * 0.2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,220,170,0.06)';
    ctx.beginPath();
    ctx.moveTo(x + Math.max(1, w * 0.002), -h * 0.2);
    ctx.lineTo(x + Math.max(1, w * 0.002), tableY + h * 0.2);
    ctx.stroke();

    // Р”СЂРµРІРµСЃРёРЅР°
    ctx.strokeStyle = 'rgba(20,12,6,0.16)';
    for (let g = 0; g < 3; g++) {
      const gx = x + pw * (0.25 + g * 0.25) + pseudo(i * 7 + g) * pw * 0.1;
      ctx.beginPath();
      ctx.moveTo(gx, -h * 0.1);
      ctx.bezierCurveTo(gx + pw * 0.08, tableY * 0.35, gx - pw * 0.08, tableY * 0.7, gx + pw * 0.02, tableY + h * 0.1);
      ctx.stroke();
    }
  }

  // РЎСѓС‡РєРё
  for (let i = 0; i < 5; i++) {
    const kx = pseudo(i + 211) * w;
    const ky = pseudo(i + 233) * tableY * 0.9;
    const kr = w * (0.006 + pseudo(i + 251) * 0.008);
    ctx.strokeStyle = 'rgba(24,14,7,0.4)';
    ctx.lineWidth = Math.max(0.6, w * 0.0014);
    for (let k = 1; k <= 3; k++) {
      ctx.beginPath();
      ctx.ellipse(kx, ky, kr * k, kr * k * 0.6, 0.3, 0, TAU);
      ctx.stroke();
    }
  }

  // РќРёР¶РЅРёР№ СѓРіРѕР»РѕРє РїРµСЂРµР±РѕСЂРєРё
  const ribH = h * 0.045;
  ctx.fillStyle = 'rgba(16,10,5,0.55)';
  ctx.fillRect(-w * 0.2, tableY - ribH, w * 1.4, ribH);
  ctx.fillStyle = 'rgba(255,214,160,0.07)';
  ctx.fillRect(-w * 0.2, tableY - ribH, w * 1.4, Math.max(1, h * 0.004));
  for (let i = 0; i < 8; i++) {
    const rx = (w / 8) * (i + 0.5);
    ctx.fillStyle = 'rgba(255,226,180,0.18)';
    ctx.beginPath();
    ctx.arc(rx, tableY - ribH * 0.45, Math.max(1, w * 0.0035), 0, TAU);
    ctx.fill();
  }
};

/** РР»Р»СЋРјРёРЅР°С‚РѕСЂ: Р»Р°С‚СѓРЅРЅРѕРµ РєРѕР»СЊС†Рѕ, Р±РѕР»С‚С‹, СЃС‚РµРєР»Рѕ СЃ РІРёРґРѕРј РЅР° РјРѕСЂРµ. */
const drawPorthole = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, px: number, py: number, r: number) => {
  // РЎРІРµС‚ РёР· РёР»Р»СЋРјРёРЅР°С‚РѕСЂР° РЅР° РїРµСЂРµР±РѕСЂРєСѓ
  const halo = ctx.createRadialGradient(px, py, r * 0.8, px, py, r * 3.2);
  halo.addColorStop(0, 'rgba(255,214,150,0.16)');
  halo.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(-w * 0.2, -h * 0.2, w * 1.4, h * 1.4);

  // РЎС‚РµРєР»Рѕ
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, r, 0, TAU);
  ctx.clip();

  const sky = ctx.createLinearGradient(0, py - r, 0, py + r * 0.2);
  sky.addColorStop(0, '#0d2b52');
  sky.addColorStop(0.6, '#4b6a92');
  sky.addColorStop(1, '#f0a35e');
  ctx.fillStyle = sky;
  ctx.fillRect(px - r, py - r, r * 2, r * 2);

  const sunX = px + r * 0.34;
  const sunY = py - r * 0.16;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, r * 0.9);
  sunGlow.addColorStop(0, 'rgba(255,236,190,0.95)');
  sunGlow.addColorStop(0.25, 'rgba(255,183,105,0.55)');
  sunGlow.addColorStop(1, 'rgba(255,150,80,0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(px - r, py - r, r * 2, r * 2);

  const horizon = py - r * 0.14;
  const sea = ctx.createLinearGradient(0, horizon, 0, py + r);
  sea.addColorStop(0, '#1b4a63');
  sea.addColorStop(1, '#08202f');
  ctx.fillStyle = sea;
  ctx.fillRect(px - r, horizon, r * 2, r * 2);
  ctx.strokeStyle = 'rgba(255,214,160,0.5)';
  ctx.lineWidth = Math.max(0.6, r * 0.012);
  ctx.beginPath();
  ctx.moveTo(px - r, horizon);
  ctx.lineTo(px + r, horizon);
  ctx.stroke();

  // Р‘Р»РёРє СЃРѕР»РЅС†Р° РЅР° РІРѕРґРµ
  ctx.strokeStyle = 'rgba(255,222,170,0.5)';
  for (let i = 0; i < 7; i++) {
    const yy = horizon + r * (0.1 + i * 0.12);
    const len = r * (0.3 - i * 0.03) * (0.6 + 0.4 * Math.abs(Math.sin(t * 1.6 + i)));
    ctx.lineWidth = Math.max(0.6, r * 0.018);
    ctx.beginPath();
    ctx.moveTo(sunX - len, yy);
    ctx.lineTo(sunX + len, yy);
    ctx.stroke();
  }

  // Р’РѕР»РЅС‹ РІ РёР»Р»СЋРјРёРЅР°С‚РѕСЂРµ
  ctx.strokeStyle = 'rgba(190,230,255,0.35)';
  ctx.lineWidth = Math.max(0.5, r * 0.01);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    for (let x = px - r; x <= px + r; x += 3) {
      const y = waveY(x, horizon + r * (0.25 + i * 0.24), t, r * 0.03, r * 0.9, 1.1 + i * 0.3, i * 2);
      if (x === px - r) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Р”Р°Р»С‘РєРёР№ РїР°СЂСѓСЃРЅРёРє
  const boatU = ((t * 0.014) % 1.7) - 0.35;
  const bx = px - r + boatU * r * 2;
  const by = horizon - r * 0.02;
  const s = Math.max(1, r * 0.012);
  ctx.fillStyle = 'rgba(20,28,40,0.9)';
  ctx.beginPath();
  ctx.moveTo(bx - s * 2.2, by);
  ctx.lineTo(bx + s * 2.2, by);
  ctx.lineTo(bx + s * 1.4, by + s);
  ctx.lineTo(bx - s * 1.6, by + s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(bx - s * 0.2, by);
  ctx.lineTo(bx - s * 0.2, by - s * 4.2);
  ctx.lineTo(bx + s * 1.7, by);
  ctx.closePath();
  ctx.fill();

  // Р§Р°Р№РєРё
  ctx.strokeStyle = 'rgba(30,40,55,0.7)';
  ctx.lineWidth = Math.max(0.5, r * 0.008);
  for (let i = 0; i < 2; i++) {
    const gu = ((t * (0.05 + i * 0.02) + i * 0.4) % 1.3) - 0.15;
    const gx = px - r + gu * r * 2;
    const gy = py - r * (0.55 + i * 0.16) + Math.sin(t * 1.1 + i) * r * 0.03;
    const gs = r * 0.07;
    ctx.beginPath();
    ctx.moveTo(gx - gs, gy);
    ctx.quadraticCurveTo(gx - gs * 0.4, gy - gs * 0.6, gx, gy);
    ctx.quadraticCurveTo(gx + gs * 0.4, gy - gs * 0.6, gx + gs, gy);
    ctx.stroke();
  }

  // Р‘Р»РёРєРё РЅР° СЃС‚РµРєР»Рµ
  const glass = ctx.createLinearGradient(px - r, py - r, px + r, py + r);
  glass.addColorStop(0, 'rgba(255,255,255,0.22)');
  glass.addColorStop(0.35, 'rgba(255,255,255,0.04)');
  glass.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  glass.addColorStop(1, 'rgba(120,190,255,0.1)');
  ctx.fillStyle = glass;
  ctx.fillRect(px - r, py - r, r * 2, r * 2);
  ctx.restore();

  // Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ С‚РµРЅСЊ СЃС‚РµРєР»Р°
  ctx.save();
  ctx.beginPath();
  ctx.arc(px, py, r, 0, TAU);
  ctx.clip();
  const inner = ctx.createRadialGradient(px, py, r * 0.72, px, py, r);
  inner.addColorStop(0, 'rgba(0,0,0,0)');
  inner.addColorStop(1, 'rgba(6,12,20,0.55)');
  ctx.fillStyle = inner;
  ctx.fillRect(px - r, py - r, r * 2, r * 2);
  ctx.restore();

  // РљРѕР»СЊС†Рѕ
  const ring = ctx.createLinearGradient(px - r, py - r, px + r, py + r);
  ring.addColorStop(0, '#d9c39a');
  ring.addColorStop(0.35, '#8b6f45');
  ring.addColorStop(0.6, '#cbb387');
  ring.addColorStop(1, '#5d4726');
  ctx.strokeStyle = ring;
  ctx.lineWidth = r * 0.26;
  ctx.beginPath();
  ctx.arc(px, py, r * 1.13, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(20,12,5,0.5)';
  ctx.lineWidth = Math.max(0.8, r * 0.02);
  ctx.beginPath();
  ctx.arc(px, py, r * 1.27, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px, py, r * 1.0, 0, TAU);
  ctx.stroke();

  // Р‘РѕР»С‚С‹
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU - 0.3;
    const bx2 = px + Math.cos(a) * r * 1.13;
    const by2 = py + Math.sin(a) * r * 1.13;
    ctx.fillStyle = i % 2 ? 'rgba(245,228,190,0.85)' : 'rgba(120,94,55,0.9)';
    ctx.beginPath();
    ctx.arc(bx2, by2, r * 0.055, 0, TAU);
    ctx.fill();
    ctx.fillStyle = 'rgba(20,12,5,0.35)';
    ctx.beginPath();
    ctx.arc(bx2 + r * 0.015, by2 + r * 0.02, r * 0.03, 0, TAU);
    ctx.fill();
  }

  // Р СѓС‡РєР°-РјР°С…РѕРІРёРє
  ctx.strokeStyle = '#b99a63';
  ctx.lineWidth = r * 0.09;
  ctx.beginPath();
  ctx.arc(px + r * 1.36, py + r * 0.16, r * 0.16, -0.6, 2.4);
  ctx.stroke();
  ctx.fillStyle = '#8a6c3c';
  ctx.beginPath();
  ctx.arc(px + r * 1.36, py + r * 0.16, r * 0.06, 0, TAU);
  ctx.fill();
};

/** РЎС‚РѕР»: РґРµСЂРµРІСЏРЅРЅР°СЏ СЃС‚РѕР»РµС€РЅРёС†Р° РІ РїРµСЂСЃРїРµРєС‚РёРІРµ. */
const drawTable = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const tableY = h * 0.64;
  const top = ctx.createLinearGradient(0, tableY, w * 0.5, h * 1.05);
  top.addColorStop(0, '#6b4a2c');
  top.addColorStop(0.45, '#54381f');
  top.addColorStop(1, '#33200f');
  ctx.fillStyle = top;
  ctx.fillRect(-w * 0.2, tableY, w * 1.4, h * 0.6);

  // Р”РѕСЃРєРё СЃС‚РѕР»РµС€РЅРёС†С‹, СЃС…РѕРґСЏС‰РёРµСЃСЏ Рє С‚РѕС‡РєРµ СЃС…РѕРґР°
  const vx = w * 0.5;
  const vy = tableY - h * 0.9;
  for (let i = -6; i <= 6; i++) {
    const bx = w * 0.5 + i * w * 0.17;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(24,14,6,0.5)' : 'rgba(255,214,160,0.05)';
    ctx.lineWidth = Math.max(0.8, w * 0.0018);
    ctx.beginPath();
    ctx.moveTo(vx + (bx - vx) * 0.12, vy + (tableY - vy) * 0.12);
    ctx.lineTo(bx, h * 1.1);
    ctx.stroke();
  }

  // Р‘Р»РёРє РѕС‚ РёР»Р»СЋРјРёРЅР°С‚РѕСЂР° РїРѕ СЃС‚РѕР»Сѓ
  const light = ctx.createRadialGradient(w * 0.28, tableY + h * 0.06, 0, w * 0.28, tableY + h * 0.06, w * 0.62);
  light.addColorStop(0, 'rgba(255,214,150,0.2)');
  light.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.fillStyle = light;
  ctx.fillRect(-w * 0.2, tableY, w * 1.4, h * 0.6);

  // РџРµСЂРµРґРЅСЏСЏ РєСЂРѕРјРєР°
  ctx.fillStyle = 'rgba(18,10,4,0.75)';
  ctx.fillRect(-w * 0.2, h * 0.96, w * 1.4, h * 0.2);
  ctx.fillStyle = 'rgba(255,220,170,0.1)';
  ctx.fillRect(-w * 0.2, h * 0.955, w * 1.4, Math.max(1, h * 0.005));
};

/** РќРѕСѓС‚Р±СѓРє РЅР° СЃС‚РѕР»Рµ: РєРѕСЂРїСѓСЃ, СЌРєСЂР°РЅ СЃ РєР°СЂС‚РѕР№, РѕС‚СЃРІРµС‚ РЅР° СЃС‚РѕР»Рµ. */
const drawLaptop = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, cx: number, hingeY: number, sw: number) => {
  const sh = sw * 0.62;
  const lidH = sh * 1.1;
  const lidX = cx - sw / 2;
  const lidY = hingeY - lidH;
  const baseH = sw * 0.07;
  const baseW = sw * 1.34;

  // РћС‚СЃРІРµС‚ СЌРєСЂР°РЅР° РЅР° СЃС‚РѕР»Рµ
  const glow = ctx.createRadialGradient(cx, hingeY + baseH * 0.6, 0, cx, hingeY + baseH * 0.6, sw * 1.3);
  glow.addColorStop(0, 'rgba(90,190,255,0.2)');
  glow.addColorStop(1, 'rgba(90,190,255,0)');
  ctx.save();
  ctx.translate(cx, hingeY + baseH * 0.6);
  ctx.scale(1, 0.32);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, sw * 1.3, 0, TAU);
  ctx.fill();
  ctx.restore();

  // РўРµРЅСЊ
  ctx.save();
  ctx.translate(cx, hingeY + baseH * 0.9);
  ctx.scale(1, 0.2);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, baseW * 0.7);
  shadow.addColorStop(0, 'rgba(0,0,0,0.55)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(0, 0, baseW * 0.7, 0, TAU);
  ctx.fill();
  ctx.restore();

  // РљСЂС‹С€РєР°
  const shell = ctx.createLinearGradient(lidX, lidY, lidX + sw, hingeY);
  shell.addColorStop(0, '#41525f');
  shell.addColorStop(0.5, '#24313c');
  shell.addColorStop(1, '#101a22');
  ctx.fillStyle = shell;
  roundRectPath(ctx, lidX, lidY, sw, lidH, sw * 0.04);
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,0.2)';
  ctx.lineWidth = Math.max(0.6, w * 0.0015);
  ctx.stroke();

  // Р­РєСЂР°РЅ СЃ РєР°СЂС‚РѕР№
  const bezel = sw * 0.035;
  ctx.fillStyle = '#04070b';
  roundRectPath(ctx, lidX + bezel * 0.5, lidY + bezel * 0.5, sw - bezel, lidH - bezel, sw * 0.02);
  ctx.fill();
  drawChart(ctx, lidX + bezel * 1.2, lidY + bezel * 1.1, sw - bezel * 2.4, lidH - bezel * 2.2, t, {
    detail: false,
  });

  // РћСЃРЅРѕРІР°РЅРёРµ
  const baseGrad = ctx.createLinearGradient(0, hingeY, 0, hingeY + baseH);
  baseGrad.addColorStop(0, '#4a5d6c');
  baseGrad.addColorStop(0.4, '#26333e');
  baseGrad.addColorStop(1, '#0c141b');
  ctx.beginPath();
  ctx.moveTo(lidX + sw * 0.02, hingeY);
  ctx.lineTo(lidX + sw * 0.98, hingeY);
  ctx.lineTo(cx + baseW / 2, hingeY + baseH);
  ctx.lineTo(cx - baseW / 2, hingeY + baseH);
  ctx.closePath();
  ctx.fillStyle = baseGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(226,232,240,0.16)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(3,7,12,0.55)';
  ctx.beginPath();
  ctx.moveTo(cx - baseW * 0.1, hingeY + baseH * 0.12);
  ctx.lineTo(cx + baseW * 0.1, hingeY + baseH * 0.12);
  ctx.lineTo(cx + baseW * 0.12, hingeY + baseH * 0.84);
  ctx.lineTo(cx - baseW * 0.12, hingeY + baseH * 0.84);
  ctx.closePath();
  ctx.fill();
};

/** Р‘СѓРјР°Р¶РЅР°СЏ РјРѕСЂСЃРєР°СЏ РєР°СЂС‚Р°, Р»РµР¶Р°С‰Р°СЏ СЂСЏРґРѕРј СЃ РЅРѕСѓС‚Р±СѓРєРѕРј. */
const drawPaperChart = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  const breathe = 1 + Math.sin(t * 0.4) * 0.006;
  const pw = w * 0.3 * breathe;
  const ph = h * 0.19 * breathe;
  const shear = 0.16;

  ctx.save();
  ctx.translate(w * 0.7, h * 0.855);
  ctx.rotate(-0.05 + Math.sin(t * 0.3) * 0.004);
  ctx.transform(1, 0, shear, 1, 0, 0);

  // РўРµРЅСЊ Р±СѓРјР°РіРё РЅР° СЃС‚РѕР»Рµ
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(-pw / 2 + w * 0.005, -ph / 2 + h * 0.014, pw, ph);

  // РџРѕР»РѕС‚РЅРѕ РєР°СЂС‚С‹
  drawChart(ctx, -pw / 2, -ph / 2, pw, ph, t, { detail: false, showShip: true });

  // РўС‘РїР»С‹Р№ Р±СѓРјР°Р¶РЅС‹Р№ С‚РѕРЅ
  ctx.fillStyle = 'rgba(226,205,160,0.32)';
  ctx.fillRect(-pw / 2, -ph / 2, pw, ph);

  // РЎРіРёР±
  ctx.strokeStyle = 'rgba(90,66,32,0.35)';
  ctx.lineWidth = Math.max(0.6, w * 0.0014);
  ctx.beginPath();
  ctx.moveTo(-pw * 0.18, -ph / 2);
  ctx.lineTo(-pw * 0.18, ph / 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,245,215,0.28)';
  ctx.beginPath();
  ctx.moveTo(-pw * 0.18 + w * 0.003, -ph / 2);
  ctx.lineTo(-pw * 0.18 + w * 0.003, ph / 2);
  ctx.stroke();

  // РџСѓРЅРєС‚РёСЂРЅС‹Р№ РїСЂРѕРєР»Р°РґРєР° РєСѓСЂСЃР° РєР°СЂР°РЅРґР°С€РѕРј
  ctx.strokeStyle = 'rgba(40,32,20,0.35)';
  ctx.lineWidth = Math.max(0.6, w * 0.0016);
  ctx.setLineDash([w * 0.008, w * 0.006]);
  ctx.beginPath();
  ctx.moveTo(-pw * 0.42, ph * 0.36);
  ctx.quadraticCurveTo(pw * 0.1, -ph * 0.3, pw * 0.4, ph * 0.1);
  ctx.stroke();
  ctx.setLineDash([]);

  // РљРѕС„РµР№РЅРѕРµ РєРѕР»СЊС†Рѕ
  ctx.strokeStyle = 'rgba(120,72,30,0.28)';
  ctx.lineWidth = Math.max(0.8, w * 0.0025);
  ctx.beginPath();
  ctx.ellipse(pw * 0.24, ph * 0.18, pw * 0.14, ph * 0.2, 0.3, 0.4, TAU);
  ctx.stroke();

  // Р—Р°РіРЅСѓС‚С‹Р№ СѓРіРѕР»РѕРє
  const cxp = pw * 0.12;
  const cyp = ph * 0.3;
  ctx.fillStyle = 'rgba(58,38,14,0.4)';
  ctx.beginPath();
  ctx.moveTo(pw / 2, ph / 2 - cyp);
  ctx.lineTo(pw / 2 - cxp, ph / 2);
  ctx.lineTo(pw / 2, ph / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(240,224,190,0.5)';
  ctx.beginPath();
  ctx.moveTo(pw / 2, ph / 2 - cyp);
  ctx.lineTo(pw / 2 - cxp, ph / 2);
  ctx.lineTo(pw / 2 - cxp * 0.55, ph / 2 - cyp * 0.55);
  ctx.lineTo(pw / 2 - cxp * 0.55, ph / 2 - cyp);
  ctx.closePath();
  ctx.fill();

  // РЎРєРѕР»СЊР·СЏС‰РёР№ Р±Р»РёРє СЃРІРµС‚Р°
  const band = (((t * 0.08) % 1.6) - 0.3) * pw;
  const sheen = ctx.createLinearGradient(band - pw * 0.2, 0, band + pw * 0.2, 0);
  sheen.addColorStop(0, 'rgba(255,236,196,0)');
  sheen.addColorStop(0.5, 'rgba(255,236,196,0.26)');
  sheen.addColorStop(1, 'rgba(255,236,196,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(-pw / 2, -ph / 2, pw, ph);

  ctx.strokeStyle = 'rgba(255,232,190,0.22)';
  ctx.lineWidth = Math.max(0.6, w * 0.0014);
  ctx.strokeRect(-pw / 2, -ph / 2, pw, ph);
  ctx.restore();
};

/** РЎРѕР»РЅРµС‡РЅС‹Р№ Р»СѓС‡ РёР· РёР»Р»СЋРјРёРЅР°С‚РѕСЂР° Рё РїС‹Р»РёРЅРєРё РІ РЅС‘Рј. */
const drawBeam = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, px: number, py: number, r: number) => {
  const sway = Math.sin(t * 0.42) * 0.07;
  const a = 0.62 + sway;
  const spread = 0.3;
  const len = Math.max(w, h) * 2.2;
  const a1 = dir(a - spread);
  const a2 = dir(a + spread);
  const p1 = { x: px + Math.cos(a - spread) * r * 1.1, y: py + Math.sin(a - spread) * r * 1.1 };
  const p2 = { x: px + Math.cos(a + spread) * r * 1.1, y: py + Math.sin(a + spread) * r * 1.1 };

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(px + a1.x * len, py + a1.y * len);
  ctx.lineTo(px + a2.x * len, py + a2.y * len);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  const beam = ctx.createLinearGradient(px, py, px + Math.cos(a) * len * 0.7, py + Math.sin(a) * len * 0.7);
  beam.addColorStop(0, 'rgba(255,226,168,0.2)');
  beam.addColorStop(0.35, 'rgba(255,220,160,0.1)');
  beam.addColorStop(1, 'rgba(255,214,150,0)');
  ctx.fillStyle = beam;
  ctx.fill();
  ctx.restore();

  // РџС‹Р»РёРЅРєРё РІ Р»СѓС‡Рµ
  for (const m of MOTES) {
    const d = ((m.u + t * m.s) % 1) * len;
    const spreadNow = r * 1.1 + d * 0.26;
    const x = px + Math.cos(a) * d + Math.cos(a + Math.PI / 2) * (m.v - 0.5) * spreadNow;
    const y = py + Math.sin(a) * d + Math.sin(a + Math.PI / 2) * (m.v - 0.5) * spreadNow;
    if (x < -w * 0.1 || x > w * 1.1) continue;
    const fade = Math.max(0, 1 - d / (len * 0.65));
    ctx.fillStyle = `rgba(255,240,205,${0.5 * fade * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + m.u * 9)))})`;
    ctx.beginPath();
    ctx.arc(x, y, m.r, 0, TAU);
    ctx.fill();
  }
};

const drawScene = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
  const u = Math.min(w, h);
  const px = w * 0.245;
  const py = h * 0.29;
  const r = u * 0.155;

  // РљР°С‡РєР° СЃСѓРґРЅР°: РІСЃСЏ СЃС†РµРЅР° СЃР»РµРіРєР° РєСЂРµРЅРёС‚СЃСЏ
  const rock = Math.sin(t * 0.42) * 0.012 + Math.sin(t * 0.27) * 0.006;
  ctx.save();
  ctx.translate(w / 2, h * 0.55);
  ctx.rotate(rock);
  ctx.scale(1.08, 1.08);
  ctx.translate(-w / 2, -h * 0.55);

  drawWall(ctx, w, h);
  drawPorthole(ctx, w, h, t, px, py, r);
  drawTable(ctx, w, h);
  drawLaptop(ctx, w, h, t, w * 0.5, h * 0.815, w * 0.28);
  drawPaperChart(ctx, w, h, t);
  drawBeam(ctx, w, h, t, px, py, r);

  // Р’РёРЅСЊРµС‚РєР° Рё С‚С‘РїР»Р°СЏ С†РІРµС‚РѕРєРѕСЂСЂРµРєС†РёСЏ
  const vig = ctx.createRadialGradient(w * 0.45, h * 0.5, u * 0.2, w * 0.5, h * 0.5, u * 0.95);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(8,4,2,0.62)');
  ctx.fillStyle = vig;
  ctx.fillRect(-w * 0.2, -h * 0.2, w * 1.4, h * 1.4);

  ctx.restore();
};

export const CabinSceneCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useCanvasScene(drawScene);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="РљР°СЋС‚Р°: РЅРѕСѓС‚Р±СѓРє СЃ РјРѕСЂСЃРєРѕР№ РєР°СЂС‚РѕР№ РЅР° СЃС‚РѕР»Рµ, СЂСЏРґРѕРј Р±СѓРјР°Р¶РЅР°СЏ РєР°СЂС‚Р°, РІ СЃС‚РµРЅРµ РєСЂСѓРіР»С‹Р№ РёР»Р»СЋРјРёРЅР°С‚РѕСЂ СЃ РІРёРґРѕРј РЅР° РјРѕСЂРµ"
      className={`block h-full w-full ${className}`}
    />
  );
};
