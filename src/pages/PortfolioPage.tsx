import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProjectCard } from '../components/ProjectCard';




export const PortfolioPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  // 1. Массив картинок (укажите свои импортированные переменные)
  const images = ['/assets/mor1.png', '/assets/mor2.png', '/assets/mor3.png','/assets/mor4.png','/assets/mor5.png','/assets/mor6.png','/assets/mor7.png']; // замените на ваши импорты
  const newProjectImages = ['/assets/new1.png', '/assets/new2.png', '/assets/new3.png']; // Массив картинок для второго проекта





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
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID?.trim(); // ID формы из Formspree

      const promises = [];

      // 2. Добавляем в очередь Telegram (чистый fetch)
      if (token && chatId) {
        const text = `Новое сообщение!\nИмя: ${formData.name}\nEmail: ${formData.email}\nТелефон: ${formData.phone}\nСообщение: ${formData.message}`;
        
        const tgPromise = fetch(`https://api.telegram.org/bot${token}/sendMessage`, {

          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text })
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
            message: formData.message
          })
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
        {/* Адаптивное неоновое свечение, пропорционально уменьшающееся на смартфонах */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] sm:h-96 sm:w-96 md:h-[500px] md:w-[500px] md:blur-[120px] -mr-20 -mt-20"></div>
        
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:text-left text-center">
            {/* Аватар с жестким размером shrink-0, чтобы картинка не сжималась при деформации экрана */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-yellow-400 shadow-2xl transition-transform duration-300 hover:scale-105 sm:h-36 sm:w-36 md:h-40 md:w-40">
              <img src="/my-photo.jpg" alt="Yurij Avatar" className="h-full w-full object-cover" />
            </div>

            <div className="space-y-4 max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400 sm:text-sm animate-pulse">
                Fullstack Developer 
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl md:text-6xl leading-[1.1]">Hi, I'm Yuriy<br />I build <span className="text-yellow-400">modern interfaces</span>
              </h1>
              <p className="text-xs text-slate-300 sm:text-sm md:text-base leading-relaxed">Fullstack Developer specializing in React, TypeScript, and cloud backends
              </p>
              <div className="pt-2">
                <a href="/hillel-certificate.pdf" download className="inline-flex items-center ...">
  Download Certificate
</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY NAVBAR: Горизонтальный скролл (overflow-x-auto) включается только на экранах меньше 400px, защищая ссылки от ужимания */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-md px-4 py-4">
        <div className="container mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-semibold sm:text-sm text-slate-600">
          <span className="font-bold text-sm sm:text-base text-blue-600">Portfolio</span>
          <a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
      </nav>

      {/* MAIN CONTENT GRID: 1 колонка по умолчанию на мобилках. Чистый md:grid-cols-12 делит экран на 3-6-3 секции на экранах от 768px */}
      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        <section id="projects" className="md:col-span-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-lg">Projects</h2>
          <ProjectCard 
            title="University Portal (ONMU)" 
            images={images} 
            link="https://www.maritimebusiness.com.ua/" 
          />
          <ProjectCard 
            title="onmu-matcher" 
            images={newProjectImages} 
            link="https://onmu-matcher-frontend.andreygorogogo.workers.dev/" 
          />
        </section>

        {/* Центральная колонка: Описание стека */}
        <section id="about" className="md:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-xl">About Me</h2>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed sm:text-sm">
            <p>## PROFESSIONAL SUMMARY Result-oriented Fullstack Developer and certified graduate of Hillel IT School with 50+ verified GitHub contributions over the past 8th months. Prior to tech, spent over a decade as a Marine Engineer (Second Engineer) and Stevedore Mechanic, mastering complex system logic and cross-functional team leadership under pressure. Recently delivered my first commercial web application on freelance for the "Marine Business and Marketing" department at ONMU, successfully leveraging a strong engineering background into production-ready software development.
               ## FREELANCE & COMMERCIAL EXPERIENCE
                 * Freelance Fullstack Developer (2026 – Present)
                 - Project: "Marine Business and Marketing" Department Web Portal (ONMU)
                 - Key Achievements: Engineered a responsive, modern web application from scratch. Collected client requirements, established architecture, and delivered a production-ready system matching real-world business criteria.
               ## EDUCATION & CERTIFICATIONS
                 * Fullstack JavaScript Course | Hillel IT School (2025 – 2026)
                 - Result: Successfully completed 100% of the practical curriculum (69 out of 69 advanced assignments) covering Frontend (React, TS), Backend (Node.js, Express), Databases (MongoDB), and Automated Testing.
                 - Graduated with a "Very Good" diploma status and ranked #3 in the group metrics.
                 * Master’s Degree in Port Engineering | Odessa National Maritime University (ONMU)
                 * Bachelor’s Degree in Marine Engineering (Marine Power Plants) | ONMU
            </p>
          </div>
        </section>

        {/* Правая колонка: Валидная форма контактов */}
        <section id="contact" className="h-fit md:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-lg">Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Message</label>
              <textarea rows={3} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Describe the task..." className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none sm:text-sm" />
            </div>
            <button type="submit" className="w-full rounded bg-slate-900 py-2.5 text-xs font-bold text-white shadow transition-colors hover:bg-slate-800 active:scale-[0.98] sm:text-sm">
              Send Message
            </button>
            {status && <p className="mt-2 text-center text-xs font-semibold text-blue-600">{status}</p>}
          </form>
        </section>
       </main>
    </div>
  );
};

export default PortfolioPage;

