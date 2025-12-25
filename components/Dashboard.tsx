
import React from 'react';
import { Icon } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { name: '01/05', collected: 400, expected: 600 },
  { name: '05/05', collected: 800, expected: 900 },
  { name: '10/05', collected: 1200, expected: 1300 },
  { name: '15/05', collected: 1100, expected: 1500 },
  { name: '20/05', collected: 1800, expected: 2000 },
  { name: '25/05', collected: 2300, expected: 2500 },
  { name: '30/05', collected: 3100, expected: 3200 },
];

interface DashboardProps {
  onModuleSelect: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleSelect }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* SECTION 1: TODAY'S FOCUS (WORKLIST + AI) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left 70%: Worklist Today */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Hôm nay cần làm gì?</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Worklist Today • 5 nhiệm vụ nóng</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { task: 'Thu tiền: Quá hạn 3 ngày', room: 'P.302', amount: '2.5M', type: 'billing-ar', icon: 'Receipt', color: 'text-amber-600' },
                  { task: 'Nhắc hợp đồng: Hết hạn (10d)', room: 'P.101', amount: '-', type: 'tenant-mgmt', icon: 'Clock', color: 'text-indigo-600' },
                  { task: 'Bảo trì: Ticket quá hạn', room: 'P.205', amount: '-', type: 'maintenance-sl', icon: 'Wrench', color: 'text-rose-600' },
                  { task: 'Check-out: Khách báo rời đi', room: 'P.404', amount: '-', type: 'room-grid', icon: 'Download', color: 'text-blue-600' },
                  { task: 'Thu tiền: Đợt 2 tháng 5', room: 'P.210', amount: '1.8M', type: 'billing-ar', icon: 'Receipt', color: 'text-emerald-600' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-xl bg-slate-100 ${item.color}`}>
                          <Icon name={item.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.task}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.amount !== '-' ? `Số tiền: ${item.amount}` : 'Cần xử lý ngay'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">{item.room}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onModuleSelect(item.type)} className="p-2 hover:bg-white rounded-lg border border-slate-200 shadow-sm text-slate-400 hover:text-blue-600">
                          <Icon name="ArrowRight" className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 30%: AI Action Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full"></div>
          <div className="relative z-10 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Icon name="Sparkles" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Strategic</h3>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">3 việc ưu tiên (80/20)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { text: "Ưu tiên thu 5 khoản nợ > 7 ngày", action: "Mở danh sách", id: "billing-ar" },
                { text: "Phòng trống lâu nhất: A-05 (12 ngày)", action: "Xem phòng", id: "room-grid" },
                { text: "Điện nước P.402 tăng đột biến 60%", action: "Kiểm tra", id: "billing-ar" }
              ].map((rec, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => onModuleSelect(rec.id)}>
                  <p className="text-sm font-bold text-slate-300 mb-2 group-hover:text-white transition-colors">"{rec.text}"</p>
                  <div className="flex items-center text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    <span>{rec.action}</span>
                    <Icon name="ArrowRight" className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onModuleSelect('ai-strategy')} className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/20">
            Audit toàn hệ thống
          </button>
        </div>
      </div>

      {/* SECTION 2: 6 STRATEGIC KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { id: 'room-grid', label: 'Lấp đầy', value: '96.2%', trend: '+2%', sub: '2 phòng trống', icon: 'Home', color: 'bg-blue-600' },
          { id: 'billing-ar', label: 'Thu tiền', value: '120/150M', trend: '80%', sub: 'Dự kiến tháng', icon: 'Receipt', color: 'bg-emerald-600' },
          { id: 'billing-ar', label: 'Quá hạn', value: '18 khoản', trend: '↑ 5.4%', sub: 'Cần nhắc nợ', icon: 'AlertTriangle', color: 'bg-amber-600' },
          { id: 'billing-ar', label: 'Công nợ (AR)', value: '45M', sub: 'Aging: 0-7 / 8-30 / >30', icon: 'Briefcase', color: 'bg-indigo-600', isAR: true },
          { id: 'maintenance-sl', label: 'Bảo trì', value: '7 Open', sub: '2 quá hạn xử lý', icon: 'Wrench', color: 'bg-rose-600' },
          { id: 'ai-strategy', label: 'AI Risk', value: '3 Alerts', sub: 'Rủi ro vận hành', icon: 'Sparkles', color: 'bg-slate-900' },
        ].map((stat) => (
          <div 
            key={stat.label} 
            onClick={() => onModuleSelect(stat.id)}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
          >
            <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon name={stat.icon} className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            {stat.isAR ? (
               <div className="flex space-x-1 mt-2">
                 <div className="h-1 flex-1 bg-emerald-400 rounded-full" title="0-7 ngày"></div>
                 <div className="h-1 flex-1 bg-amber-400 rounded-full" title="8-30 ngày"></div>
                 <div className="h-1 flex-1 bg-rose-400 rounded-full" title=">30 ngày"></div>
               </div>
            ) : (
              <p className="text-[10px] font-bold text-slate-400 mt-1">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* SECTION 3: TREND STRIP & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Hiệu suất thu tiền</h3>
              <p className="text-sm font-bold text-slate-400 italic">Thực thu vs Dự kiến (30 ngày gần nhất)</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-xl">
               <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black uppercase tracking-widest">30 Ngày</button>
               <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">90 Ngày</button>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={3} fill="url(#colorCol)" />
                <Area type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={2} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action Sidebar Dashboard */}
        <div className="space-y-4 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 px-4">Thao tác nhanh</p>
          <button className="w-full p-6 bg-white border border-slate-100 rounded-3xl flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Icon name="PlusCircle" className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Tạo kỳ thu</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Tháng mới</p>
            </div>
          </button>
          <button className="w-full p-6 bg-white border border-slate-100 rounded-3xl flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Icon name="CheckCircle" className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Ghi nhận thu</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Khớp lệnh CK</p>
            </div>
          </button>
          <button className="w-full p-6 bg-white border border-slate-100 rounded-3xl flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Icon name="UserPlus" className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Check-in</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Hợp đồng mới</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
