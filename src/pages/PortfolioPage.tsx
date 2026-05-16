// import React, { useState } from 'react';
// import { supabase } from '../lib/supabase';

// export const PortfolioPage: React.FC = () => {
//   // 1. Стейт теперь содержит ВСЕ нужные поля: имя, почта, телефон и сообщение
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
//   const [status, setStatus] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus('Отправка...');
    
//     // 2. Отправляем полный объект со всеми четырьмя полями в Supabase
//     const { error } = await supabase
//       .from('contacts')
//       .insert([formData]);

//     if (error) {
//       setStatus('Ошибка: ' + error.message);
//     } else {
//       setStatus('Сообщение успешно отправлено!');
//       setFormData({ name: '', email: '', phone: '', message: '' });
//     }
//   };

//   return (
//     <div className="flex flex-col font-sans bg-slate-50 min-h-screen w-full">      
      
//       {/* HERO SECTION */}
//       <section className="bg-[#1a2c3d] text-white py-16 px-6 flex items-center relative overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-12 duration-1000 w-full">
//         <div className="absolute top-0 right-0 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-[80px] sm:blur-[120px]"></div>        
//         <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
//           <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-6 border-4 border-yellow-400 shadow-xl">
//             <img src="/my-photo.jpg" alt="Yurij Avatar" className="w-full h-full object-cover" />
//           </div>
//           <div className="max-w-3xl space-y-4">
//             <p className="text-yellow-400 font-black uppercase tracking-[0.2em] text-xs sm:text-sm animate-pulse">Frontend Developer Портфолио</p>
//             <h1 className="text-3xl sm:text-6xl font-bold leading-[1.1] tracking-tighter text-gray-100">
//               Привет, я Юрий. <br />Создаю <span className="text-yellow-400">современные интерфейсы</span>
//             </h1>
//             <p className="max-w-xl mx-auto text-xs sm:text-base text-slate-300 leading-relaxed pt-2">
//               Специализируюсь на экосистеме React, TypeScript и интеграции с облачными бэкендами. Успешно сдал 69 из 69 практических работ в процессе обучения.
//             </p>
//             <div className="pt-4">
//               <a href="/87536745_en (1).pdf" download className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-base font-bold rounded-md text-[#1a2c3d] bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-lg active:scale-95 duration-150">
//                 Download Resume
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NAVIGATION BAR */}
//       <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm py-4 px-6 flex items-center justify-between gap-4 w-full">
//         <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
//           <span className="text-blue-600 font-bold text-sm sm:text-lg">Portfolio</span>
//           <a href="#projects" className="text-slate-600 hover:text-blue-600 transition-colors">Projects</a>
//           <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
//           <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
//         </div>
//       </nav>

//       {/* MAIN CONTENT (Responsive-сетка) */}
//       <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        
//         {/* Левая колонка */}
//         <section id="projects" className="md:col-span-3">
//           <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Projects</h2>
//           <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm text-center">
//             <div className="bg-slate-100 aspect-video rounded flex items-center justify-center text-slate-400 mb-2 text-xs border border-dashed border-slate-300">
//               [ University Portal Screen ]
//             </div>
//             <p className="text-sm font-medium text-slate-700">University Portal (ONMU)</p>
//             <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
//               View on GitHub →
//             </a>
//           </div>
//         </section>

//         {/* Центральная колонка */}
//         <section id="about" className="md:col-span-6 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900 mb-4">Обо мне</h2>
//           <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
//             <p>
//               Разрабатываю быстрые SPA-приложения с использованием сборщика Vite. Имею глубокие знания типизации данных в TypeScript и утилитарных стилей Tailwind CSS.
//             </p>
//           </div>
//         </section>

//         {/* Правая колонка — ПОЛНАЯ КОНТАКТНАЯ ФОРМА */}
//         <section id="contact" className="md:col-span-3 bg-white rounded-lg border border-slate-200 p-6 shadow-sm h-fit">
//           <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Контакты</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Name</label>
//               <input 
//                 type="text" required value={formData.name}
//                 onChange={(e) => setFormData({...formData, name: e.target.value})}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email</label>
//               <input 
//                 type="email" required value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone</label>
//               <input 
//                 type="tel" value={formData.phone}
//                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
//               />
//             </div>
//             {/* 3. Добавили текстовое поле для сути обращения (Message) */}
//             <div>
//               <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Message</label>
//               <textarea 
//                 rows={4} required value={formData.message}
//                 onChange={(e) => setFormData({...formData, message: e.target.value})}
//                 placeholder="Опишите вашу задачу..."
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" 
//               />
//             </div>
//             <button type="submit" className="w-full bg-slate-900 text-white text-sm font-semibold py-2.5 rounded hover:bg-slate-800 transition-colors shadow">
//               Send Message
//             </button>
//             {status && <p className="text-xs text-center font-medium mt-2 text-blue-600">{status}</p>}
//           </form>
//         </section>

//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const PortfolioPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Отправка...');
    
    const { error } = await supabase
      .from('contacts')
      .insert([formData]);

    if (error) {
      setStatus(`Error: ${error.message}`);
    } else {
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
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
                <a href="/87536745_en (1).pdf" download className="inline-flex items-center justify-center rounded bg-yellow-400 px-6 py-3 text-xs font-bold text-slate-900 transition-all shadow-md hover:bg-yellow-300 active:scale-95 duration-150 sm:text-sm">
                  Download Resume
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
        
        {/* Левая колонка: Проекты */}
        <section id="projects" className="md:col-span-3">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-lg">Projects</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-300 font-mono mb-3">
              [ University Portal Screen ]
            </div>
            <p className="text-sm font-semibold text-slate-800">University Portal (ONMU)</p>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline">
              View on GitHub →
            </a>
          </div>
        </section>

        {/* Центральная колонка: Описание стека */}
        <section id="about" className="md:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 md:text-xl">About Me</h2>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed sm:text-sm">
            <p>
              I develop fast SPA applications using the modern Vite builder. I have a deep understanding of data typing in TypeScript and utility styles in Tailwind CSS.
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

