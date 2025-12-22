
import React from 'react';
import { MainModule, SubFunction } from '../types';
import { Icon } from './Icons';

interface ModuleDetailProps {
  module: MainModule;
  onBack: () => void;
  onSubFunctionClick: (sub: SubFunction) => void;
  onAskAI: (query: string) => void;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({ module, onBack, onSubFunctionClick, onAskAI }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-sm active:scale-95"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{module.title}</h1>
            <p className="text-slate-500 font-medium">{module.description}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onAskAI(`Tôi cần tư vấn về module ${module.title}. Hãy liệt kê 3 chiến lược tối ưu.`)}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          <Icon name="Sparkles" className="w-5 h-5" />
          <span>Tư vấn AI cho Module này</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {module.subFunctions.map((sub) => (
          <div 
            key={sub.id} 
            onClick={() => onSubFunctionClick(sub)}
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all cursor-pointer hover:border-blue-400 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
               <Icon name={sub.icon} className="w-20 h-20 text-blue-600" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon name={sub.icon} className="w-6 h-6" />
                </div>
                <div className="bg-slate-50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ArrowRight" className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors">{sub.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {sub.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-blue-200 mt-10">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Tự động hóa với InnMaster AI</h2>
          <p className="text-blue-100 max-w-md font-medium">
            Hệ thống đang tích hợp sâu Gemini 2.5 để tự động hóa việc tính toán hóa đơn và nhận diện khuôn mặt khách thuê.
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all">
            Tìm hiểu thêm
          </button>
          <button 
            onClick={() => onAskAI("Làm sao để triển khai hệ thống nhà trọ tự động hoàn toàn?")}
            className="px-8 py-3 bg-white text-blue-700 font-extrabold rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95"
          >
            Trải nghiệm ngay
          </button>
        </div>
      </div>
    </div>
  );
};
