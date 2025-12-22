
import React from 'react';
import { MODULES } from '../constants';
import { Icon } from './Icons';

interface SidebarProps {
  activeModuleId: string | null;
  onSelectModule: (id: string | null) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule, onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 z-50 overflow-y-auto hidden lg:block">
      <div className="p-10 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-16">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">L</div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">LeanInn</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onSelectModule(null)}
            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
              activeModuleId === null ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'text-slate-400 hover:bg-slate-50 font-bold'
            }`}
          >
            <Icon name="Activity" className="w-5 h-5" />
            <span className="font-black text-xs uppercase tracking-widest">Dashboard</span>
          </button>

          <div className="pt-10 pb-4">
            <span className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Core Modules</span>
          </div>

          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all group ${
                activeModuleId === module.id ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:bg-slate-50 font-bold'
              }`}
            >
              <div className={`${activeModuleId === module.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-600'} transition-colors`}>
                <Icon name={module.icon} className="w-5 h-5" />
              </div>
              <span className="text-sm font-black tracking-tight">{module.title}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-dashed border-slate-200 hover:border-red-100"
          >
            <Icon name="Plus" className="rotate-45 w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
