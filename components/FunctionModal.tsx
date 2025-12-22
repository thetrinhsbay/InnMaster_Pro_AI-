
import React, { useState } from 'react';
import { SubFunction } from '../types';
import { Icon } from './Icons';

interface FunctionModalProps {
  subFunction: SubFunction;
  onClose: () => void;
}

export const FunctionModal: React.FC<FunctionModalProps> = ({ subFunction, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'strategy'>('status');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        {/* Header Section */}
        <div className="p-10 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200">
              <Icon name={subFunction.icon} className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest rounded-md">Smart-Logic</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Function</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{subFunction.name}</h2>
              <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-wider">{subFunction.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-4 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all active:scale-90 shadow-sm self-start md:self-center"
          >
            <Icon name="Plus" className="rotate-45 w-7 h-7" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 border-r border-slate-100 p-6 space-y-3 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('status')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}
            >
              Real-time Status
            </button>
            <button 
              onClick={() => setActiveTab('strategy')}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'strategy' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}
            >
              5W2H Strategy
            </button>
            <div className="pt-10">
               <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">AI Score</p>
                  <p className="text-3xl font-black tracking-tighter">9.8</p>
                  <p className="text-[9px] font-bold mt-2 uppercase">Hệ thống đang hoạt động tối ưu</p>
               </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-10">
            {activeTab === 'status' ? (
              <div className="space-y-8">
                <div className="bg-slate-50 rounded-[2rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner relative">
                     <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                     <Icon name="Activity" className="w-12 h-12 text-slate-400" />
                   </div>
                   <div className="space-y-3">
                     <h4 className="text-2xl font-black text-slate-800 tracking-tight">AI Engine đang phân tích...</h4>
                     <p className="text-sm text-slate-500 max-w-md font-medium leading-relaxed">
                       Chúng tôi đang khởi tạo phiên làm việc bảo mật. Mọi thay đổi trong <span className="text-blue-600 font-black">"{subFunction.name}"</span> sẽ được lưu vào bộ nhớ đệm tự động.
                     </p>
                   </div>
                   <div className="flex space-x-4 w-full max-w-sm pt-4">
                     <button className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm uppercase text-[10px] tracking-widest">
                       Kiểm tra log
                     </button>
                     <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl uppercase text-[10px] tracking-widest">
                       Tiếp tục tác vụ
                     </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Phân tích 5W2H cho {subFunction.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { q: 'What', a: `Mục tiêu chính: Tối ưu hóa quy trình ${subFunction.name.toLowerCase()}.`, icon: 'Activity' },
                    { q: 'Why', a: 'Giảm 20% thời gian xử lý thủ công & loại bỏ sai sót 80/20.', icon: 'Sparkles' },
                    { q: 'Who', a: 'Manager & AI Strategic Assistant cùng phối hợp.', icon: 'Users' },
                    { q: 'Where', a: 'Đồng bộ đa nền tảng (Cloud / Mobile / Desktop).', icon: 'Home' },
                    { q: 'When', a: 'Ngay lập tức (Real-time Syncing).', icon: 'Clock' },
                    { q: 'How Much', a: 'Dự kiến tiết kiệm 15M/tháng chi phí vận hành.', icon: 'Receipt' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900 shadow-sm font-black text-[10px] uppercase">
                          {item.q}
                        </span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Strategic Factor</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700 leading-snug">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-10">
           <div className="flex items-center space-x-3 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">AI Context Loaded: Verified</span>
           </div>
           <button 
             onClick={onClose}
             className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-2xl uppercase text-xs tracking-[0.2em]"
           >
             Terminate Session
           </button>
        </div>
      </div>
    </div>
  );
};
