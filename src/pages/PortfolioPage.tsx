import React, { useState } from 'react';
import { Award, Briefcase, Download, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProjectCard } from '../components/ProjectCard';
import { NauticalLaptopCanvas } from '../components/NauticalLaptopCanvas';
import { CabinSceneCanvas } from '../components/CabinSceneCanvas';
import { Reveal } from '../components/Reveal';

export const PortfolioPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  // 1. Массив картинок (укажите свои импортированные переменные)
  const images = ['/assets/mor1.png', '/assets/mor2.png', '/assets/mor3.png', '/assets/mor4.png', '/assets/mor5.png', '/assets/mor6.png', '/assets/mor7.png'];
  const newProjectImages = ['/assets/new1.png', '/assets/new2.png', '/assets/new3.png'];
  const newPlatformImages = ['/assets/platform1.png', '/assets/platform2.png', '/assets/platform3.png'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    // 1. Сохраняем в базу данных Supabase
    const { error } = await supabase
      .from('contacts')
      .insert([formData]);

    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }

    try {
      const token = import.meta.env.VITE_TELEGRAM_TOKEN?.trim();
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim();
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID?.trim();

      const promises = [];

      // 2. Добавляем в очередь Telegram (чистый fetch)
      if (token && chatId) {
        const text = `Новое сообщение!\nИмя: ${formData.name}\nEmail: ${formData.email}\nТелефон: ${formData.phone}\nСообщение: ${formData.message}`;

        const tgPromise = fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text }),
        });
        promises.push(tgPromise);
      }

      // 3. Добавляем в очередь отправку на Почту через чистый fetch (Formspree)
      if (formspreeId) {
        const emailPromise = fetch(`https://formspree.io${formspreeId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        });
        promises.push(emailPromise);
      }

      // 4. Отправляем всё параллельно
      await Promise.all(promises);

      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Ошибка отправки уведомлений:', err);
      setStatus('Message saved, but notification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-yellow-400 selection:text-slate-900">
      {/* HERO SECTION: Идеальный баланс Flexbox. На мобильных — контент центрирован в колонку, на десктопе (md:) — выровнен по левому краю */}
      <section className="relative overflow-hidden bg-[#1a2c3d] px-4 py-16 text-white sm:px-6 md:py-24">
        {/* Плавающее неоновое свечение + мягкая сетка как фон */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] animate-float-slow motion-reduce:animate-none sm:h-96 sm:w-96 md:h-[500px] md:w-[500px] md:blur-[120px] -mr-20 -mt-20" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-yellow-400/10 blur-[70px] animate-float-slow motion-reduce:animate-none [animation-delay:-4.5s]" />

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Левая колонка: аватар + текст */}
            <div className="flex flex-col items-center gap-6 text-center lg:col-span-7 lg:flex-row lg:items-center lg:gap-6 lg:text-left xl:gap-8">
              {/* Аватар: hover-зум + медленное «плавание» */}
              <Reveal className="shrink-0">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-yellow-400 shadow-2xl transition-transform duration-500 hover:scale-105 sm:h-32 sm:w-32 lg:h-36 lg:w-36 xl:h-40 xl:w-40">
                  <img src="/my-photo.jpg" alt="Yurij Avatar" className="h-full w-full object-cover" />
                </div>
              </Reveal>

              <Reveal delay={90} className="space-y-4 max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400 sm:text-sm">
                  Fullstack Developer
                  <span className="ml-1 inline-block animate-pulse motion-reduce:animate-none">_</span>
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl lg:text-5xl leading-[1.1]">
                  Hi, I'm Yuriy
                  <br />
                  I build <span className="text-yellow-400">modern interfaces</span>
                </h1>
                <p className="text-xs text-slate-300 sm:text-sm md:text-base leading-relaxed">
                  Fullstack Developer specializing in React, TypeScript, and cloud backends
                </p>
                <div className="pt-2">
                  <a
                    href="/hillel-certificate.pdf"
                    download
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-yellow-400 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-lg shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 active:translate-y-0 sm:text-sm"
                  >
                    <Download size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                    Download Certificate
                    <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-sheen motion-reduce:hidden" />
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Правая колонка: анимированная сцена каюты (canvas) */}
            <Reveal delay={200} className="lg:col-span-5">
              <figure className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#241a12] shadow-2xl shadow-black/40 ring-1 ring-inset ring-white/5 transition-transform duration-700 ease-out group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
                  <CabinSceneCanvas />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                </div>
                <figcaption className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Bridge deck · laptop &amp; nautical chart
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STICKY NAVBAR: Горизонтальный скролл (overflow-x-auto) включается только на экранах меньше 400px, защищая ссылки от ужимания */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md px-4 py-4">
        <div className="container mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-semibold sm:text-sm text-slate-600">
          <span className="font-bold text-sm sm:text-base text-blue-600">Portfolio</span>
          {[
            { href: '#projects', label: 'Projects' },
            { href: '#about', label: 'About' },
            { href: '#contact', label: 'Contact' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 hover:text-blue-600 hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT GRID: 1 колонка по умолчанию на мобилках. Чистый md:grid-cols-12 делит экран на 3-6-3 секции на экранах от 768px */}
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        <section id="projects" className="scroll-mt-24 md:col-span-3">
          <Reveal>
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-lg">
              Projects
            </h2>
          </Reveal>

          <div className="space-y-5">
            <ProjectCard
              title="University Portal (ONMU)"
              description="
ONMU Department of Maritime Business and Marketing website: from requirements to production."
              images={images}
              link="https://www.maritimebusiness.com.ua/"
            />
            <ProjectCard
              title="onmu-matcher"
              description="Online matching service for ONMU applicants."
              images={newProjectImages}
              link="https://onmu-matcher-frontend.andreygorogogo.workers.dev/"
            />
            <ProjectCard
              title="University Platform"              
              description="Website of the Odessa National Maritime University (ONMU)"              
              images={newPlatformImages}
              link="https://university-platform-three.vercel.app/"
            />
          </div>
        </section>

        {/* Центральная колонка: Описание стека */}
        <section id="about" className="scroll-mt-24 md:col-span-6">
          <Reveal>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-xl">About Me</h2>
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed sm:text-sm">
                <p className="text-sm text-slate-700">
                  Result-oriented Fullstack Developer and certified graduate of Hillel IT School with 50+ verified
                  GitHub contributions. Prior to tech, spent over a decade as a Marine Engineer (Second Engineer) and
                  Stevedore Mechanic, mastering complex system logic and cross-functional team leadership under
                  pressure.
                </p>

                <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50/40">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <Briefcase size={14} className="text-blue-600" />
                    Freelance &amp; Commercial Experience
                  </h3>
                  <p>
                    <span className="font-semibold text-slate-800">Freelance Fullstack Developer (2026 – Present)</span>
                  </p>
                  <ul className="list-inside list-disc space-y-1 marker:text-blue-400">
                    <li>
                      Project: “Marine Business and Marketing” Department Web Portal (ONMU)
                    </li>
                    <li>
                      Engineered a responsive, modern web application from scratch — requirements, architecture and a
                      production-ready system matching real-world business criteria.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <GraduationCap size={14} className="text-blue-600" />
                    Education
                  </h3>
                  <ul className="space-y-1">
                    <li>
                      <span className="font-semibold text-slate-800">Master’s Degree in Port Engineering</span> — Odessa
                      National Maritime University (ONMU)
                    </li>
                    <li>
                      <span className="font-semibold text-slate-800">Bachelor’s Degree in Marine Engineering</span>{' '}
                      (Marine Power Plants) — ONMU
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <Award size={14} className="text-blue-600" />
                    Fullstack JavaScript Course | Hillel IT School (2025 – 2026)
                  </h3>
                  <ul className="list-inside list-disc space-y-1 marker:text-blue-400">
                    <li>100% of the practical curriculum completed: 69 out of 69 advanced assignments.</li>
                    <li>Frontend (React 18, 19, TypeScript, React Fiber), Backend (Node.js, Express), Databases (MongoDB,Docker), Testing.</li>
                    <li>Graduated with a “Very Good” diploma status and ranked #3 in the group metrics.</li>
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Правая колонка: Валидная форма контактов */}
        <section id="contact" className="scroll-mt-24 h-fit md:col-span-3">
          <Reveal>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-lg">Contact</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the task..."
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition-all duration-300 hover:bg-slate-800 hover:shadow-lg active:scale-[0.98] sm:text-sm"
                >
                  Send Message
                </button>
                {status && <p className="mt-2 text-center text-xs font-semibold text-blue-600">{status}</p>}
              </form>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Yuriy — Fullstack Developer
      </footer>
    </div>
  );
};

export default PortfolioPage;
