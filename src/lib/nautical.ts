export const TAU = Math.PI * 2;

export const pseudo = (seed: number): number => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

export const roundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
};

/** Береговая линия суши в нормализованных координатах (0..1). */
export const COAST: Array<[number, number]> = (() => {
  const pts: Array<[number, number]> = [[0, 0]];
  for (let i = 0; i <= 8; i++) {
    const p = i / 8;
    pts.push([p * 0.46, 0.05 + pseudo(i + 3) * 0.09 + Math.sin(p * Math.PI * 1.7) * 0.05]);
  }
  pts.push([0.45, 0.3], [0.38, 0.41], [0.33, 0.52], [0.24, 0.6], [0.14, 0.57], [0.07, 0.64], [0, 0.62]);
  return pts;
})();

/** Глубины, подписанные на карте. */
export const SOUNDINGS: Array<[number, number, number]> = Array.from({ length: 14 }, (_, i) => [
  0.12 + pseudo(i + 11) * 0.82,
  0.12 + pseudo(i + 57) * 0.8,
  8 + Math.round(pseudo(i + 91) * 90),
]);

export const BUOYS: Array<[number, number]> = [
  [0.63, 0.63],
  [0.79, 0.47],
  [0.54, 0.8],
  [0.88, 0.72],
];

export const ROUTE = { p0: [0.08, 0.88], p1: [0.46, 0.18], p2: [0.9, 0.4] } as const;

export const quadPoint = (t: number) => {
  const [x0, y0] = ROUTE.p0;
  const [x1, y1] = ROUTE.p1;
  const [x2, y2] = ROUTE.p2;
  const inv = 1 - t;
  return {
    x: inv * inv * x0 + 2 * inv * t * x1 + t * t * x2,
    y: inv * inv * y0 + 2 * inv * t * y1 + t * t * y2,
    angle: Math.atan2(2 * inv * (y1 - y0) + 2 * t * (y2 - y1), 2 * inv * (x1 - x0) + 2 * t * (x2 - x1)),
  };
};

export const waveY = (x: number, y: number, t: number, amp: number, len: number, speed: number, phase: number) =>
  y + Math.sin(x / len + t * speed + phase) * amp;

export interface ChartOptions {
  /** Подписи глубин, координаты и подпись карты — только на больших экранах. */
  detail?: boolean;
  /** Угол наклона карты (для бумажной карты на столе). */
  rotate?: number;
  showShip?: boolean;
}

/** Морская (nautical) карта: сетка, изобаты, берег, маршрут, судно, роза ветров. */
export const drawChart = (
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  t: number,
  { detail = true, rotate = 0, showShip = true }: ChartOptions = {},
) => {
  const cxr = sx + sw / 2;
  const cyr = sy + sh / 2;
  ctx.save();
  ctx.translate(cxr, cyr);
  if (rotate) ctx.rotate(rotate);
  ctx.translate(-cxr, -cyr);

  roundRectPath(ctx, sx, sy, sw, sh, sw * 0.015);
  ctx.clip();

  const sea = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  sea.addColorStop(0, '#e8f4fa');
  sea.addColorStop(1, '#b9dcec');
  ctx.fillStyle = sea;
  ctx.fillRect(sx - 2, sy - 2, sw + 4, sh + 4);

  // Сетка координат с медленным сдвигом
  const step = sw / 9;
  const shift = ((t * 0.02) % 1) * step;
  ctx.lineWidth = Math.max(0.5, sw * 0.002);
  for (let i = -1; i < 10; i++) {
    const gx = sx + i * step + shift;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(22,86,124,0.28)' : 'rgba(22,86,124,0.13)';
    ctx.beginPath();
    ctx.moveTo(gx, sy);
    ctx.lineTo(gx, sy + sh);
    ctx.stroke();
  }
  for (let i = -1; i < 7; i++) {
    const gy = sy + i * (sh / 6) + shift * 0.6;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(22,86,124,0.22)' : 'rgba(22,86,124,0.1)';
    ctx.beginPath();
    ctx.moveTo(sx, gy);
    ctx.lineTo(sx + sw, gy);
    ctx.stroke();
  }

  // Изобаты
  ctx.lineWidth = Math.max(0.5, sw * 0.0035);
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(18,96,140,${0.34 - i * 0.04})`;
    ctx.beginPath();
    for (let px = 0; px <= 40; px++) {
      const p = px / 40;
      const gx = sx + p * sw;
      const gy =
        sy +
        sh * (0.16 + i * 0.17) +
        Math.sin(p * Math.PI * (2 + i * 0.6) + t * 0.35 + i * 1.4) * sh * 0.045 +
        Math.sin(p * Math.PI * 5 + i) * sh * 0.012;
      if (px === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();
  }

  // Суша
  ctx.beginPath();
  ctx.moveTo(sx + COAST[0][0] * sw, sy + COAST[0][1] * sh);
  for (let i = 1; i < COAST.length; i++) ctx.lineTo(sx + COAST[i][0] * sw, sy + COAST[i][1] * sh);
  ctx.closePath();
  const land = ctx.createLinearGradient(sx, sy, sx + sw * 0.5, sy + sh * 0.6);
  land.addColorStop(0, '#f0e3c2');
  land.addColorStop(1, '#ddc79a');
  ctx.fillStyle = land;
  ctx.fill();
  ctx.strokeStyle = 'rgba(122,96,52,0.75)';
  ctx.lineWidth = Math.max(0.6, sw * 0.004);
  ctx.stroke();

  if (detail) {
    ctx.fillStyle = 'rgba(18,96,140,0.6)';
    ctx.font = `${Math.max(6, sw * 0.032)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = 'center';
    for (const [fx, fy, depth] of SOUNDINGS) {
      ctx.fillText(String(depth), sx + fx * sw, sy + fy * sh);
    }
  }

  // Маршрут
  ctx.strokeStyle = 'rgba(217,119,6,0.9)';
  ctx.lineWidth = Math.max(1, sw * 0.006);
  ctx.setLineDash([sw * 0.03, sw * 0.024]);
  ctx.lineDashOffset = -t * sw * 0.05;
  ctx.beginPath();
  ctx.moveTo(sx + ROUTE.p0[0] * sw, sy + ROUTE.p0[1] * sh);
  ctx.quadraticCurveTo(sx + ROUTE.p1[0] * sw, sy + ROUTE.p1[1] * sh, sx + ROUTE.p2[0] * sw, sy + ROUTE.p2[1] * sh);
  ctx.stroke();
  ctx.setLineDash([]);

  // Маяки
  for (let i = 0; i < BUOYS.length; i++) {
    const [fx, fy] = BUOYS[i];
    const pulse = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.1 + i * 1.7));
    ctx.fillStyle = `rgba(220,38,38,${0.45 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(sx + fx * sw, sy + fy * sh, Math.max(1.4, sw * 0.009), 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(220,38,38,${0.12 + pulse * 0.2})`;
    ctx.lineWidth = Math.max(0.5, sw * 0.003);
    ctx.beginPath();
    ctx.arc(sx + fx * sw, sy + fy * sh, Math.max(2.4, sw * 0.016) + pulse * sw * 0.012, 0, TAU);
    ctx.stroke();
  }

  // Судно на маршруте
  if (showShip) {
    const ship = quadPoint((t * 0.055) % 1);
    const shx = sx + ship.x * sw;
    const shy = sy + ship.y * sh;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = Math.max(0.8, sw * 0.005);
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(shx, shy, sw * 0.014 * i + ((t * 30) % (sw * 0.02)), ship.angle + Math.PI / 2, ship.angle + Math.PI / 2 + 0.9);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(shx, shy);
    ctx.rotate(ship.angle + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -sw * 0.032);
    ctx.lineTo(sw * 0.019, sw * 0.026);
    ctx.lineTo(0, sw * 0.014);
    ctx.lineTo(-sw * 0.019, sw * 0.026);
    ctx.closePath();
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = Math.max(0.5, sw * 0.0025);
    ctx.stroke();
    ctx.restore();
  }

  // Роза ветров
  const rx = sx + sw * 0.78;
  const ry = sy + sh * 0.2;
  const rr = sh * 0.13;
  ctx.strokeStyle = 'rgba(20,60,90,0.5)';
  ctx.lineWidth = Math.max(0.5, sw * 0.003);
  ctx.beginPath();
  ctx.arc(rx, ry, rr, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rx, ry, rr * 0.62, 0, TAU);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU;
    ctx.beginPath();
    ctx.moveTo(rx + Math.cos(a) * rr * 0.2, ry + Math.sin(a) * rr * 0.2);
    ctx.lineTo(rx + Math.cos(a) * rr, ry + Math.sin(a) * rr);
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(20,60,90,0.6)' : 'rgba(20,60,90,0.25)';
    ctx.stroke();
  }
  ctx.save();
  ctx.translate(rx, ry);
  ctx.rotate(t * 0.25);
  ctx.beginPath();
  ctx.moveTo(0, -rr * 0.8);
  ctx.lineTo(rr * 0.14, 0);
  ctx.lineTo(0, rr * 0.8);
  ctx.lineTo(-rr * 0.14, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(190,30,45,0.85)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, -rr * 0.8);
  ctx.lineTo(rr * 0.14, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fillStyle = 'rgba(20,60,90,0.85)';
  ctx.fill();
  ctx.restore();

  if (detail) {
    ctx.fillStyle = 'rgba(20,60,90,0.75)';
    ctx.font = `${Math.max(6, sw * 0.03)}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = 'left';
    ctx.fillText('CHART 1:50 000', sx + sw * 0.05, sy + sh * 0.94);
    ctx.textAlign = 'right';
    ctx.fillText('46°30′N / 30°45′E', sx + sw * 0.95, sy + sh * 0.94);
  }

  // Блик стекла
  const sheenX = sx + (((t * 0.1) % 1.7) - 0.35) * sw;
  const sheen = ctx.createLinearGradient(sheenX - sw * 0.3, sy, sheenX + sw * 0.3, sy + sh);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.22)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(sx - 2, sy - 2, sw + 4, sh + 4);

  // Виньетка
  const vig = ctx.createRadialGradient(sx + sw / 2, sy + sh / 2, sw * 0.15, sx + sw / 2, sy + sh / 2, sw * 0.72);
  vig.addColorStop(0, 'rgba(6,20,32,0)');
  vig.addColorStop(1, 'rgba(6,20,32,0.32)');
  ctx.fillStyle = vig;
  ctx.fillRect(sx - 2, sy - 2, sw + 4, sh + 4);

  ctx.restore();
};
