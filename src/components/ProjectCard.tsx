import React, { useState } from 'react';

interface ProjectCardProps {
  title: string;
  images: string[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, images, link }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition">
      <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
        {React.createElement('img', {
          src: images[currentIndex],
          alt: title,
          className: 'w-full h-full object-cover',
        })}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
        >
          &#10094;
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
        >
          &#10095;
        </button>
      </div>
      <h3 className="text-base font-bold mt-3">{title}</h3>
      <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm break-all">
        {link}
      </a>
    </div>
  );
};
