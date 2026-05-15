import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/dashboard', name: 'Главная', icon: <LayoutDashboard size={20} /> },
    { path: '/schedule', name: 'Расписание', icon: <Calendar size={20} /> },
    { path: '/profile', name: 'Профиль', icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between p-4 border-r border-slate-800">
      <div>
        <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
          <span className="text-xl font-bold tracking-wider text-blue-400">STUDENT PORTAL</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/30 transition-colors w-full">
        <LogOut size={20} />
        Выйти
      </button>
    </aside>
  );
};
