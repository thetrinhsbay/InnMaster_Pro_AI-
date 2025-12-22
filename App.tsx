
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ModuleDetail } from './components/ModuleDetail';
import { AIChatWindow } from './components/AIChatWindow';
import { FunctionModal } from './components/FunctionModal';
import { MODULES } from './constants';
import { Icon } from './components/Icons';
import { SubFunction } from './types';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(() => 
    storageService.getState('active_module', null)
  );
  const [selectedSubFunction, setSelectedSubFunction] = useState<SubFunction | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(() => 
    storageService.getState('is_chat_open', false)
  );
  const [initialAIQuery, setInitialAIQuery] = useState("");

  useEffect(() => {
    storageService.saveState('active_module', activeModuleId);
  }, [activeModuleId]);

  useEffect(() => {
    storageService.saveState('is_chat_open', isAIChatOpen);
  }, [isAIChatOpen]);

  const activeModule = MODULES.find(m => m.id === activeModuleId);

  const openAIChat = (query: string = "") => {
    setInitialAIQuery(query);
    setIsAIChatOpen(true);
  };

  const handleLogout = () => {
    if (confirm("Xóa phiên làm việc hiện tại?")) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100">
      <Sidebar 
        activeModuleId={activeModuleId} 
        onSelectModule={setActiveModuleId} 
        onLogout={handleLogout}
      />

      <main className="lg:ml-72 p-8 md:p-12 lg:p-20 pt-10 max-w-[1400px]">
        {/* Minimal Global Search / Action Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="relative group max-w-lg flex-1">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                <Icon name="Search" className="w-5 h-5" />
             </span>
             <input 
               type="text" 
               placeholder="Tìm nhanh: Tên khách, số phòng, hóa đơn..."
               className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-medium text-sm shadow-sm"
             />
          </div>
          
          <button 
            onClick={() => openAIChat("Thực hiện Audit 80/20 cho hệ thống ngay.")}
            className="flex items-center space-x-3 px-8 py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:shadow-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95"
          >
            <Icon name="Sparkles" className="w-4 h-4 text-blue-400" />
            <span>AI Audit Now</span>
          </button>
        </header>

        {!activeModuleId ? (
          <Dashboard onModuleSelect={setActiveModuleId} />
        ) : (
          activeModule && (
            <ModuleDetail 
              module={activeModule} 
              onBack={() => setActiveModuleId(null)} 
              onSubFunctionClick={setSelectedSubFunction}
              onAskAI={openAIChat}
            />
          )
        )}
      </main>

      {selectedSubFunction && (
        <FunctionModal 
          subFunction={selectedSubFunction} 
          onClose={() => setSelectedSubFunction(null)} 
        />
      )}

      {isAIChatOpen && (
        <AIChatWindow 
          initialQuery={initialAIQuery} 
          onClose={() => setIsAIChatOpen(false)} 
        />
      )}

      {!isAIChatOpen && (
        <button 
          onClick={() => openAIChat()}
          className="fixed bottom-12 right-12 w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-300 hover:scale-110 active:scale-90 transition-all z-40 border-4 border-white"
        >
          <Icon name="Sparkles" className="w-10 h-10" />
        </button>
      )}
    </div>
  );
};

export default App;
