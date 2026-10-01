import React from 'react';
import { useInView } from '../lib/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Reveal: React.FC<RevealProps> = ({ children, className = '', delay = 0 }) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-5 opacity-0 blur-[2px]'
      } ${className}`}
    >
      {children}
    </div>
  );
};
