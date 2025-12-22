
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { geminiService } from '../services/gemini';
import { storageService } from '../services/storage';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIChatWindowProps {
  initialQuery?: string;
  onClose: () => void;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({ initialQuery, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(() => 
    storageService.getState('ai_messages', [
      { role: 'ai', text: 'Chào bạn! Tôi là trợ lý chiến lược InnMaster. Tôi đã khôi phục phiên làm việc trước đó của bạn. Tôi có thể giúp gì thêm?' }
    ])
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync messages to storage
  useEffect(() => {
    storageService.saveState('ai_messages', messages);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (initialQuery && initialQuery !== "") {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await geminiService.getQuickHelp(text);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Rất tiếc, bộ não AI đang quá tải. Hãy thử lại sau vài giây!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    const defaultMsg: Message[] = [{ role: 'ai', text: 'Nhật ký đã được xóa. Tôi đã sẵn sàng cho ngữ cảnh mới.' }];
    setMessages(defaultMsg);
    storageService.saveState('ai_messages', defaultMsg);
  };

  return (
    <div className="fixed bottom-8 right-8 w-[450px] h-[700px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] z-50 flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Icon name="Sparkles" className="w-7 h-7" />
          </div>
          <div>
            <p className="font-black text-sm uppercase tracking-wider">InnMaster AI Brain</p>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] text-blue-100 uppercase tracking-[0.2em] font-black">Strategic Mode Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={clearHistory} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400" title="Xóa nhật ký">
            <Icon name="RefreshCw" className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Icon name="Plus" className="rotate-45 w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed font-medium ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 rounded-tl-none flex space-x-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-100 bg-white">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Nạp dữ liệu hoặc đặt câu hỏi chiến lược..."
            className="w-full pl-6 pr-14 py-4 bg-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold border-transparent focus:border-blue-200 transition-all"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-50 active:scale-95 transition-all shadow-xl"
          >
            <Icon name="ArrowRight" className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Cognitive Engine: Gemini 3 Pro</p>
          <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Persisted Session</p>
        </div>
      </div>
    </div>
  );
};
