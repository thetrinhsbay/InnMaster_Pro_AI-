
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { geminiService } from '../services/gemini';
import { storageService } from '../services/storage';
import { AISmartResponse, AIAction } from '../types';

interface Message {
  role: 'user' | 'ai';
  content: string | AISmartResponse;
  timestamp: number;
}

interface AIChatWindowProps {
  initialQuery?: string;
  onClose: () => void;
  contextData?: any;
  currentModuleId?: string | null;
  onAIAction?: (action: AIAction) => void;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({ initialQuery, onClose, contextData, currentModuleId, onAIAction }) => {
  const [messages, setMessages] = useState<Message[]>(() => 
    storageService.getState('ai_messages_v2', [
      { 
        role: 'ai', 
        content: {
          summary: 'Chào Nhà Quản Trị! Tôi là InnMaster AI.',
          details: ['Tôi đã phân tích xong dữ liệu hệ thống.', 'Sẵn sàng hỗ trợ tối ưu vận hành 80/20.', 'Hãy chọn một tác vụ bên dưới.'],
          actions: []
        },
        timestamp: Date.now()
      }
    ])
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    storageService.saveState('ai_messages_v2', messages);
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && initialQuery !== "") {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Enrich context with module info
      const fullContext = {
        currentModule: currentModuleId || 'dashboard',
        data: contextData
      };
      
      const response = await geminiService.getStructuredHelp(text, fullContext);
      setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: { summary: "Lỗi kết nối", details: ["Không thể truy xuất dữ liệu."], actions: [] }, 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Xóa toàn bộ lịch sử trò chuyện?")) {
        setMessages([]);
        storageService.saveState('ai_messages_v2', []);
    }
  };

  const getQuickPrompts = () => {
    if (!currentModuleId || currentModuleId === 'dashboard') {
      return ["Hôm nay cần làm gì?", "Rủi ro lớn nhất?", "Tăng doanh thu thế nào?"];
    }
    if (currentModuleId === 'room-grid') return ["Phòng trống lâu nhất?", "Gợi ý giá phòng?", "Khách nào sắp check-out?"];
    if (currentModuleId === 'billing-ar') return ["Ai nợ quá hạn?", "Soạn tin nhắc nợ", "Tổng thu dự kiến?"];
    if (currentModuleId === 'maintenance-sl') return ["Ticket ưu tiên?", "Lỗi hay gặp nhất?", "Phòng nào hay hỏng?"];
    return ["Phân tích dữ liệu", "Tìm điểm bất thường"];
  };

  const renderSmartCard = (data: AISmartResponse) => (
    <div className="flex flex-col space-y-3 w-full">
       <div className="font-black text-sm text-slate-800 leading-snug">
         {data.summary}
       </div>
       {data.details && data.details.length > 0 && (
         <div className="space-y-1.5 pl-3 border-l-2 border-indigo-100">
            {data.details.map((detail, idx) => (
              <p key={idx} className="text-xs text-slate-600 font-medium flex items-start">
                <span className="mr-2">•</span> {detail}
              </p>
            ))}
         </div>
       )}
       {data.actions && data.actions.length > 0 && (
         <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-50">
            {data.actions.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => onAIAction && onAIAction(action)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all active:scale-95 border border-indigo-200"
              >
                {action.icon && <Icon name={action.icon} className="w-3 h-3" />}
                <span className="text-[10px] font-black uppercase tracking-wide">{action.label}</span>
              </button>
            ))}
         </div>
       )}
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[60] flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
      
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Icon name="Sparkles" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 tracking-tight">AI Assistant</h3>
            <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                    Context: {currentModuleId ? currentModuleId.replace('-', ' ') : 'Dashboard'}
                </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
           <button onClick={clearHistory} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors" title="Xóa lịch sử">
             <Icon name="RefreshCw" className="w-4 h-4" />
           </button>
           <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
             <Icon name="Plus" className="rotate-45 w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 rounded-tl-sm'
            }`}>
              {typeof m.content === 'string' ? (
                 <p className="text-sm font-medium">{m.content}</p>
              ) : (
                 renderSmartCard(m.content)
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-slate-100">
         {/* Quick Prompts */}
         <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
            {getQuickPrompts().map((prompt, idx) => (
               <button 
                 key={idx}
                 onClick={() => handleSend(prompt)}
                 className="flex-shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all whitespace-nowrap"
               >
                 {prompt}
               </button>
            ))}
         </div>

         <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Hỏi AI về dữ liệu..."
              className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 font-medium text-sm transition-all"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-md"
            >
              <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};
