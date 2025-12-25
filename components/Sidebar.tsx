
import React from 'react';
import { MODULES } from '../constants';
import { Icon } from './Icons';

interface SidebarProps {
  activeModuleId: string | null;
  onSelectModule: (id: string | null) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModuleId, onSelectModule, onLogout, isCollapsed, onToggle }) => {
  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-slate-100 z-50 transition-all duration-300 hidden lg:flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className={`h-full flex flex-col ${isCollapsed ? 'p-4' : 'p-8'}`}>
        {/* Header Logo */}
        <div className={`flex items-center mb-10 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 shrink-0">L</div>
            {!isCollapsed && (
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">LeanInn</span>
            )}
          </div>
          {!isCollapsed && (
             <button onClick={onToggle} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
               <Icon name="ToggleLeft" className="w-5 h-5" />
             </button>
          )}
        </div>

        {/* Collapsed Toggle Button (Visible when collapsed) */}
        {isCollapsed && (
           <button onClick={onToggle} className="mb-8 self-center p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
               <Icon name="ArrowRight" className="w-5 h-5" />
           </button>
        )}

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onSelectModule(null)}
            title={isCollapsed ? "Dashboard" : ""}
            className={`w-full flex items-center py-4 rounded-2xl transition-all ${
              isCollapsed ? 'justify-center px-0' : 'space-x-4 px-6'
            } ${
              activeModuleId === null ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'text-slate-400 hover:bg-slate-50 font-bold'
            }`}
          >
            <Icon name="Activity" className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <span className="font-black text-xs uppercase tracking-widest whitespace-nowrap">Dashboard</span>
            )}
          </button>

          <div className={`py-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {!isCollapsed ? (
               <span className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">Core Modules</span>
            ) : (
               <div className="h-px w-8 bg-slate-100"></div>
            )}
          </div>

          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              title={isCollapsed ? module.title : ""}
              className={`w-full flex items-center py-4 rounded-2xl transition-all group ${
                isCollapsed ? 'justify-center px-0' : 'space-x-4 px-6'
              } ${
                activeModuleId === module.id ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-400 hover:bg-slate-50 font-bold'
              }`}
            >
              <div className={`shrink-0 transition-colors ${activeModuleId === module.id ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-600'}`}>
                <Icon name={module.icon} className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-black tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{module.title}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-slate-50">
          <button 
            onClick={onLogout}
            title={isCollapsed ? "End Session" : ""}
            className={`w-full flex items-center py-4 rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-dashed border-slate-200 hover:border-red-100 ${
               isCollapsed ? 'justify-center' : 'justify-center space-x-2'
            }`}
          >
            <Icon name="Plus" className="rotate-45 w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">End Session</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
