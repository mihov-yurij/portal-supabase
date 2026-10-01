import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './nautical';

export type SceneDraw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

/**
 * Движок canvas-сцены: rAF с учётом DPR, пауза вне вьюпорта,
 * поддержка prefers-reduced-motion и перерисовка по resize.
 */
export const useCanvasScene = (draw: SceneDraw) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let raf = 0;
    let running = false;
    let elapsed = 0;
    let last = 0;
    let reduced = prefersReducedMotion();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, width, height, elapsed);
    };

    const frame = (time: number) => {
      elapsed += Math.min((time - last) / 1000, 0.05);
      last = time;
      draw(ctx, width, height, elapsed);
      raf = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || running) return;
      running = true;
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const onMotionChange = () => {
      reduced = prefersReducedMotion();
      if (reduced) {
        stop();
        draw(ctx, width, height, 0);
      } else {
        start();
      }
    };

    resize();
    if (reduced) draw(ctx, width, height, 0);
    else start();

    const mq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    mq?.addEventListener?.('change', onMotionChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => resize()) : null;
    ro?.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro?.disconnect();
      mq?.removeEventListener?.('change', onMotionChange);
    };
  }, [draw]);

  return canvasRef;
};
