
import React from 'react';
import { Icon } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'W1', revenue: 4200, profit: 3100 },
  { name: 'W2', revenue: 5100, profit: 4200 },
  { name: 'W3', revenue: 4900, profit: 3900 },
  { name: 'W4', revenue: 7500, profit: 6300 },
];

interface DashboardProps {
  onModuleSelect: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleSelect }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Strategic Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
            LEAN <span className="text-blue-600">INN</span>
          </h1>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest text-xs">
            Hệ điều hành nhà trọ tinh gọn • Nguyên tắc 80/20
          </p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">Occupancy</span>
            <span className="text-2xl font-black text-slate-900">96.2%</span>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">Net Profit</span>
            <span className="text-2xl font-black text-emerald-600">128M</span>
          </div>
        </div>
      </div>

      {/* Core Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'ops-mgmt', label: 'Vận hành', value: '42 Phòng', sub: '2 phòng sắp trống', icon: 'Home', color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'finance-mgmt', label: 'Dòng tiền', value: '1.2B', sub: '98% đã thu hồi', icon: 'Receipt', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'ai-strategy', label: 'Chiến lược AI', value: 'ROI +12%', sub: 'Tối ưu từ 80/20 logic', icon: 'Sparkles', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <div 
            key={stat.id} 
            onClick={() => onModuleSelect(stat.id)}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group active:scale-95"
          >
            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
              <Icon name={stat.icon} className="w-8 h-8" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">{stat.value}</h3>
            <p className="text-sm font-bold text-slate-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Simplified Revenue Chart */}
      <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Dòng tiền thực tế</h3>
            <p className="text-sm font-bold text-slate-400">Doanh thu & Lợi nhuận (Tuần gần nhất)</p>
          </div>
          <button className="px-6 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest transition-colors">
            Chi tiết P&L
          </button>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fill="none" strokeDasharray="8 8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
