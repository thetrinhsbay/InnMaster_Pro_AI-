
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ModuleDetail } from './components/ModuleDetail';
import { AIChatWindow } from './components/AIChatWindow';
import { FunctionModal } from './components/FunctionModal';
import { MODULES } from './constants';
import { Icon } from './components/Icons';
import { SubFunction, AIAction } from './types';
import { storageService } from './services/storage';

const App: React.FC = () => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(() => 
    storageService.getState('active_module', null)
  );
  const [selectedSubFunction, setSelectedSubFunction] = useState<SubFunction | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(() => 
    storageService.getState('is_chat_open', false)
  );
  // State cho Sidebar thu gọn
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => 
    storageService.getState('is_sidebar_collapsed', false)
  );

  const [initialAIQuery, setInitialAIQuery] = useState("");
  const [aiContextData, setAIContextData] = useState<any>(null);
  const [pendingAIAction, setPendingAIAction] = useState<AIAction | null>(null);

  useEffect(() => {
    storageService.saveState('active_module', activeModuleId);
  }, [activeModuleId]);

  useEffect(() => {
    storageService.saveState('is_chat_open', isAIChatOpen);
  }, [isAIChatOpen]);

  useEffect(() => {
    storageService.saveState('is_sidebar_collapsed', isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  const activeModule = MODULES.find(m => m.id === activeModuleId);

  const openAIChat = (query: string = "", context?: any) => {
    setInitialAIQuery(query);
    if (context) setAIContextData(context);
    setIsAIChatOpen(true);
  };

  const handleLogout = () => {
    if (confirm("Xóa phiên làm việc hiện tại?")) {
      storageService.clearAll();
      window.location.reload();
    }
  };

  const handleAIAction = (action: AIAction) => {
    console.log("Executing AI Action:", action);
    
    if (action.type === 'navigate') {
       if (action.payload.moduleId) {
          setActiveModuleId(action.payload.moduleId);
       }
    } else if (action.type === 'filter' || action.type === 'modal') {
       if (activeModuleId === action.payload.moduleId || !action.payload.moduleId) {
          setPendingAIAction(action);
       } else {
          setActiveModuleId(action.payload.moduleId);
          setTimeout(() => setPendingAIAction(action), 500);
       }
    } else if (action.type === 'copy') {
       navigator.clipboard.writeText(action.payload.text);
       alert("Đã sao chép vào bộ nhớ tạm!");
    }
  };

  const handleContextUpdate = (data: any) => {
     setAIContextData(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-blue-100">
      <Sidebar 
        activeModuleId={activeModuleId} 
        onSelectModule={setActiveModuleId} 
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main 
        className={`transition-all duration-300 p-6 md:p-10 lg:p-16 pt-8 max-w-[1600px] mx-auto ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Global Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-white/50 p-4 rounded-[2.5rem] backdrop-blur-sm border border-white sticky top-4 z-40 shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                 <Icon name="Home" className="w-4 h-4" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cơ sở hiện tại</p>
                 <p className="text-sm font-black text-slate-800 tracking-tight leading-none">Căn hộ dịch vụ Quận 1</p>
               </div>
               <Icon name="ArrowRight" className="w-4 h-4 text-slate-300 rotate-90 ml-4" />
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200"></div>

            <div className="relative group max-w-sm flex-1">
               <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                  <Icon name="Search" className="w-4 h-4" />
               </span>
               <input 
                 type="text" 
                 placeholder="Tìm nhanh: P.302, Nguyễn Văn A..."
                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-medium text-xs shadow-sm"
               />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => openAIChat("Phân tích tổng quan hôm nay")}
              className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-xl font-black ${
                isAIChatOpen 
                  ? 'bg-indigo-600 text-white shadow-indigo-200 ring-4 ring-indigo-100' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              <Icon name="Sparkles" className={`w-4 h-4 ${isAIChatOpen ? 'text-white' : 'text-indigo-500'}`} />
              <span>AI Core</span>
            </button>
          </div>
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
              onUpdateContext={handleContextUpdate}
              pendingAction={pendingAIAction}
              onActionComplete={() => setPendingAIAction(null)}
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
          contextData={aiContextData}
          currentModuleId={activeModuleId}
          onAIAction={handleAIAction}
        />
      )}
    </div>
  );
};

export default App;
