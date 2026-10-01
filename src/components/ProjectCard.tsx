import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useInView } from '../lib/useInView';

interface ProjectCardProps {
  title: string;
  link: string;
  images?: string[];
  /** Кастомное интерактивное превью (например, canvas-сцена) вместо галереи. */
  visual?: React.ReactNode;
  description?: string;
  badge?: string;
}

const AUTOPLAY_MS = 5200;
const FADE_MS = 460;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, link, images, visual, description, badge }) => {
  const slides = images ?? [];
  const hasSlider = slides.length > 0;
  const [index, setIndex] = useState(0);
  const [ghost, setGhost] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const reveal = useInView<HTMLElement>();
  const activity = useInView<HTMLElement>({ once: false, threshold: 0.35 });
  const { inView } = reveal;

  // Один и тот же узел отдаём обоим наблюдателям: reveal — навсегда, activity — для автопрокрутки
  const setNode = (node: HTMLElement | null) => {
    reveal.ref.current = node;
    activity.ref.current = node;
  };

  const goTo = useCallback(
    (next: number) => {
      const total = slides.length;
      if (!total) return;
      const target = ((next % total) + total) % total;
      if (target === indexRef.current) return;
      setGhost(indexRef.current);
      setIndex(target);
    },
    [slides.length],
  );

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (ghost === null) return;
    const timer = window.setTimeout(() => setGhost(null), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [ghost, index]);

  useEffect(() => {
    if (!hasSlider || paused || !activity.inView || prefersReducedMotion()) return;
    const timer = window.setInterval(() => goTo(indexRef.current + 1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [activity.inView, goTo, hasSlider, paused]);

  return (
    <article
      ref={setNode}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 motion-reduce:transform-none motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
        {badge && (
          <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-yellow-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm animate-pulse-soft motion-reduce:animate-none">
            {badge}
          </span>
        )}
        {visual ? (
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none">
            {visual}
          </div>
        ) : (
          <>
            {ghost !== null && (
              <img
                src={slides[ghost]}
                alt={title}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <img
              key={index}
              src={slides[index]}
              alt={`${title} — скриншот ${index + 1}`}
              className="absolute inset-0 h-full w-full animate-slide-fade-in object-cover motion-reduce:animate-none"
            />

            {hasSlider && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Предыдущий скриншот"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Следующий скриншот"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <ChevronRight size={16} />
                </button>
                {slides.length > 1 && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
                    {slides.map((_, dot) => (
                      <button
                        key={dot}
                        type="button"
                        onClick={() => goTo(dot)}
                        aria-label={`Скриншот ${dot + 1}`}
                        aria-current={dot === index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          dot === index ? 'w-5 bg-yellow-400' : 'w-1.5 bg-white/60 hover:bg-white'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-base font-bold leading-snug">{title}</h3>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          aria-label={`Открыть проект ${title} в новой вкладке`}
          className="mt-0.5 shrink-0 rounded-md p-1 text-blue-600 opacity-0 transition-all duration-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <ExternalLink size={15} />
        </a>
      </div>

      {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}

      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex w-fit max-w-full items-center gap-1 break-all text-sm text-blue-600 underline decoration-blue-200 underline-offset-2 transition-colors hover:decoration-blue-600"
      >
        {link.replace(/^https?:\/\//, '')}
      </a>
    </article>
  );
};
