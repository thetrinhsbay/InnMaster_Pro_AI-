
import React, { useState } from 'react';
import { Icon } from './Icons';

interface CEOCommandBoardProps {
  onAskAI: (query: string, context?: any) => void;
  onNavigateToModule: (moduleId: string) => void;
}

export const CEOCommandBoard: React.FC<CEOCommandBoardProps> = ({ onAskAI, onNavigateToModule }) => {
  const [propertyScope, setPropertyScope] = useState<'all' | 'p1' | 'p2'>('all');
  const [workboardTab, setWorkboardTab] = useState<'overdue' | 'vacant' | 'tickets'>('overdue');

  // MOCK POLICY STATE
  const [policies, setPolicies] = useState([
    { id: 'auto_cycle', name: 'Tự động tạo kỳ thu', state: true, desc: 'Ngày 1 hàng tháng' },
    { id: 'grace_period', name: 'Grace Period (3 ngày)', state: true, desc: 'Không tính phạt nếu trễ < 3 ngày' },
    { id: 'auto_reminder', name: 'Nhắc nợ tự động (L1)', state: true, desc: 'Gửi Zalo khi có hóa đơn' },
    { id: 'strict_sla', name: 'SLA Bảo trì nghiêm ngặt', state: false, desc: 'Cảnh báo sau 12h thay vì 24h' },
  ]);

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, state: !p.state } : p));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER CONTROL AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-0 z-30">
         <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
               <Icon name="Activity" className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">CEO Command Center</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Điều hành & Chiến lược</p>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-3">
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
               {['all', 'p1', 'p2'].map((scope) => (
                  <button
                     key={scope}
                     onClick={() => setPropertyScope(scope as any)}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        propertyScope === scope ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
                  >
                     {scope === 'all' ? 'Toàn chuỗi' : scope === 'p1' ? 'Cơ sở Q1' : 'Cơ sở BT'}
                  </button>
               ))}
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
               {['7D', '30D', '90D'].map((range) => (
                  <button key={range} className="px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-600 transition-all">
                     {range}
                  </button>
               ))}
            </div>
            <button 
               onClick={() => onAskAI("Phân tích chiến lược tổng thể hôm nay cho CEO")}
               className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
               <Icon name="Sparkles" className="w-4 h-4" />
               <span>Hỏi AI Chiến lược</span>
            </button>
         </div>
      </div>

      {/* ZONE 1: EXECUTIVE KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
         {[
            { label: 'Occupancy', value: '96.2%', sub: '2 phòng trống', color: 'blue', icon: 'Home' },
            { label: 'Doanh thu (Thực/Dự)', value: '82%', sub: '120M / 145M', color: 'emerald', icon: 'PieChart' },
            { label: 'Nợ quá hạn', value: '45M', sub: '18 khoản > 3 ngày', color: 'rose', icon: 'AlertTriangle' },
            { label: 'Rủi ro (Risk)', value: '3', sub: 'Phòng cần lưu ý', color: 'amber', icon: 'Shield' },
            { label: 'SLA Vi phạm', value: '2', sub: 'Ticket quá 48h', color: 'rose', icon: 'Clock' },
            { label: 'Dòng tiền ròng', value: '+85M', sub: 'Sau chi phí', color: 'indigo', icon: 'TrendingUp' },
         ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
               <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 text-${kpi.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon name={kpi.icon} className="w-5 h-5" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</h3>
               <p className="text-[10px] font-bold text-slate-400 mt-1">{kpi.sub}</p>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* ZONE 2: AI STRATEGY PANEL (Central Intelligence) */}
         <div className="xl:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full"></div>
               <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="p-2 bg-indigo-500 rounded-lg animate-pulse">
                        <Icon name="Sparkles" className="w-5 h-5 text-white" />
                     </div>
                     <h3 className="text-lg font-black uppercase tracking-tight">AI Strategy Brief</h3>
                     <span className="px-2 py-1 bg-white/10 rounded-md text-[9px] font-bold uppercase tracking-widest border border-white/10">Daily 80/20</span>
                  </div>

                  <div className="space-y-6">
                     {/* Decision */}
                     <div>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Kết luận (Decision)</p>
                        <p className="text-xl font-bold leading-relaxed">
                           "Tập trung thu hồi <span className="text-indigo-400">45M nợ quá hạn</span> tuần này để đảm bảo dòng tiền nhập quỹ bảo trì tháng sau."
                        </p>
                     </div>

                     {/* Why (Insights) */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                           "Nợ nhóm >30 ngày tăng 15% so với tháng trước.",
                           "2 Phòng (A101, B202) có dấu hiệu rủi ro cao.",
                           "Dự kiến chi phí bảo trì thang máy tuần tới (12M)."
                        ].map((insight, i) => (
                           <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <p className="text-xs font-medium text-slate-300 leading-snug">"{insight}"</p>
                           </div>
                        ))}
                     </div>

                     {/* Next Actions */}
                     <div>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">Hành động ưu tiên (Next Actions)</p>
                        <div className="flex flex-wrap gap-3">
                           <button onClick={() => onNavigateToModule('billing-ar')} className="flex items-center space-x-2 px-5 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                              <Icon name="ArrowRight" className="w-4 h-4" />
                              <span>Mở danh sách Nợ xấu</span>
                           </button>
                           <button onClick={() => onAskAI('Soạn tin nhắc nợ cứng rắn cho nhóm nợ > 30 ngày')} className="flex items-center space-x-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all border border-indigo-500">
                              <Icon name="Send" className="w-4 h-4" />
                              <span>Gửi nhắc nợ hàng loạt (AI)</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Strategic Playbooks */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Strategic Playbooks (Kịch bản mẫu)</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                     { name: 'Tăng lấp đầy', icon: 'TrendingUp', color: 'blue' },
                     { name: 'Giảm công nợ', icon: 'DollarSign', color: 'rose' },
                     { name: 'Tối ưu chi phí', icon: 'PieChart', color: 'emerald' },
                     { name: 'Audit rủi ro', icon: 'Shield', color: 'amber' },
                  ].map((play, idx) => (
                     <button 
                        key={idx} 
                        onClick={() => onAskAI(`Kích hoạt playbook: ${play.name}. Hãy phân tích và đưa ra hành động.`)}
                        className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col items-center justify-center space-y-3 group"
                     >
                        <div className={`p-3 bg-${play.color}-50 text-${play.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                           <Icon name={play.icon} className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-indigo-600">{play.name}</span>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: WORKBOARD & POLICY */}
         <div className="space-y-8">
            
            {/* ZONE 3: CEO WORKBOARD */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[420px] flex flex-col">
               <div className="p-6 border-b border-slate-50">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">CEO Workboard</h3>
                     <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                     <button onClick={() => setWorkboardTab('overdue')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${workboardTab === 'overdue' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400'}`}>Nợ (5)</button>
                     <button onClick={() => setWorkboardTab('vacant')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${workboardTab === 'vacant' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Trống (2)</button>
                     <button onClick={() => setWorkboardTab('tickets')} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${workboardTab === 'tickets' ? 'bg-white shadow-sm text-amber-600' : 'text-slate-400'}`}>Sự cố (3)</button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {workboardTab === 'overdue' && [
                     { room: 'A101', name: 'Nguyễn Văn A', detail: 'Quá hạn 5 ngày', amount: '3.5M' },
                     { room: 'B202', name: 'Lê Thị B', detail: 'Quá hạn 10 ngày', amount: '5.2M' },
                     { room: 'C303', name: 'Trần C', detail: 'Quá hạn 2 ngày', amount: '2.1M' },
                  ].map((item, i) => (
                     <div key={i} className="p-3 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <div>
                           <p className="text-xs font-black text-slate-800">{item.room} - {item.name}</p>
                           <p className="text-[10px] font-bold text-rose-500">{item.detail} • {item.amount}</p>
                        </div>
                        <button className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100" title="Nhắc nợ">
                           <Icon name="Send" className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
                  {workboardTab === 'vacant' && (
                     <div className="text-center p-4 text-slate-400 text-xs font-bold italic">Danh sách phòng trống...</div>
                  )}
                  {workboardTab === 'tickets' && (
                     <div className="text-center p-4 text-slate-400 text-xs font-bold italic">Danh sách sự cố...</div>
                  )}
               </div>
            </div>

            {/* ZONE 4: POLICY SWITCHBOARD */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6">
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Policy Switchboard</h3>
               <div className="space-y-4">
                  {policies.map((p) => (
                     <div key={p.id} className="flex items-center justify-between">
                        <div>
                           <p className={`text-xs font-bold ${p.state ? 'text-slate-800' : 'text-slate-400'}`}>{p.name}</p>
                           <p className="text-[9px] font-medium text-slate-400">{p.desc}</p>
                        </div>
                        <div 
                           onClick={() => togglePolicy(p.id)}
                           className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${p.state ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${p.state ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-6 pt-4 border-t border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Impact Preview</p>
                  <p className="text-xs font-bold text-emerald-600">Bật "Tự động tạo kỳ thu" sẽ tiết kiệm ~2 giờ làm việc/tháng.</p>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};
