
import React, { useState } from 'react';
import { Tenant } from '../types';
import { Icon } from './Icons';

interface TenantProfileDrawerProps {
  tenant: Tenant | null;
  onClose: () => void;
  onAction: (action: string, tenant: Tenant) => void;
}

export const TenantProfileDrawer: React.FC<TenantProfileDrawerProps> = ({ tenant, onClose, onAction }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'payments' | 'history'>('overview');

  if (!tenant) return null;

  const renderStatusPill = (status: Tenant['status']) => {
    switch (status) {
      case 'active': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Đang ở</span>;
      case 'expiring': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">Sắp hết hạn</span>;
      case 'ended': return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Đã đi</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start mb-6">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
              <Icon name="ArrowRight" className="w-5 h-5 rotate-180" />
            </button>
            <div className="flex space-x-2">
               {tenant.status === 'expiring' && (
                  <button onClick={() => onAction('renew-contract', tenant)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                    Gia hạn ngay
                  </button>
               )}
               {tenant.debt > 0 && (
                  <button onClick={() => onAction('remind-debt', tenant)} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
                    Nhắc nợ
                  </button>
               )}
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">
                {tenant.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tenant.name}</h2>
                <div className="flex items-center space-x-2 mt-2">
                   {renderStatusPill(tenant.status)}
                   <span className="text-xs font-bold text-slate-500 flex items-center">
                     <Icon name="Home" className="w-3 h-3 mr-1" /> {tenant.roomName}
                   </span>
                   <span className="text-xs font-bold text-slate-500 flex items-center pl-2 border-l border-slate-200">
                     <Icon name="Phone" className="w-3 h-3 mr-1" /> {tenant.phone}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-8 space-x-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'contracts', label: 'Hợp đồng' },
            { id: 'payments', label: 'Thanh toán' },
            { id: 'history', label: 'Lịch sử' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                     <div className="flex items-center space-x-2 mb-2 text-slate-400">
                        <Icon name="Clock" className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Hợp đồng</span>
                     </div>
                     <p className="text-sm font-bold text-slate-900">Đến: {tenant.contractEnd}</p>
                     <p className="text-[10px] font-bold text-slate-400 mt-1">Cọc: {tenant.deposit.toLocaleString()}đ</p>
                  </div>
                  <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                     <div className="flex items-center space-x-2 mb-2 text-slate-400">
                        <Icon name="Receipt" className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Công nợ</span>
                     </div>
                     <p className={`text-xl font-black ${tenant.debt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {tenant.debt.toLocaleString()}đ
                     </p>
                     <p className="text-[10px] font-bold text-slate-400 mt-1">{tenant.debt > 0 ? 'Quá hạn' : 'Đã thanh toán đủ'}</p>
                  </div>
               </div>

               {/* Risk Tags */}
               {tenant.riskTags && tenant.riskTags.length > 0 && (
                 <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Lưu ý / Rủi ro</p>
                    <div className="flex flex-wrap gap-2">
                       {tenant.riskTags.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-white text-amber-600 rounded-lg text-[10px] font-bold border border-amber-100 uppercase tracking-wide">
                            {tag === 'late_payment' ? 'Hay trả chậm' : tag === 'noisy' ? 'Ồn ào' : tag}
                         </span>
                       ))}
                    </div>
                 </div>
               )}

               {/* Quick Actions */}
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Thao tác nhanh</h4>
                  <div className="space-y-3">
                     <button onClick={() => onAction('move-room', tenant)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex items-center space-x-3">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Icon name="Home" className="w-5 h-5" />
                           </div>
                           <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Chuyển phòng ở</span>
                        </div>
                        <Icon name="ArrowRight" className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                     </button>
                     <button onClick={() => onAction('ticket', tenant)} className="w-full p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between hover:border-rose-300 hover:shadow-md transition-all group">
                        <div className="flex items-center space-x-3">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                              <Icon name="Wrench" className="w-5 h-5" />
                           </div>
                           <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700">Tạo yêu cầu sửa chữa</span>
                        </div>
                        <Icon name="ArrowRight" className="w-4 h-4 text-slate-300 group-hover:text-rose-500" />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {/* TAB 2: CONTRACTS */}
          {activeTab === 'contracts' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Lịch sử Hợp đồng</h3>
                   <button onClick={() => onAction('renew-contract', tenant)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Gia hạn</button>
                </div>
                
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8 py-2">
                   {/* Current Contract */}
                   <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-sm"></div>
                      <div className="p-5 bg-white border border-blue-100 rounded-2xl shadow-sm ring-1 ring-blue-500/20">
                         <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-widest">Hiện tại</span>
                            <span className="text-xs font-bold text-slate-400">01/01/2024 - {tenant.contractEnd}</span>
                         </div>
                         <h4 className="text-sm font-black text-slate-900 mb-1">Hợp đồng thuê 6 tháng</h4>
                         <p className="text-xs text-slate-500">Giá thuê: 3,500,000đ • Cọc: {tenant.deposit.toLocaleString()}đ</p>
                      </div>
                   </div>

                   {/* Past Contract Mock */}
                   <div className="relative opacity-60 grayscale hover:grayscale-0 transition-all">
                      <div className="absolute -left-[41px] top-0 w-6 h-6 bg-slate-300 rounded-full border-4 border-white"></div>
                      <div className="p-5 bg-white border border-slate-100 rounded-2xl">
                         <div className="flex justify-between items-start mb-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">Đã kết thúc</span>
                            <span className="text-xs font-bold text-slate-400">01/06/2023 - 31/12/2023</span>
                         </div>
                         <h4 className="text-sm font-black text-slate-900 mb-1">Hợp đồng thuê 6 tháng</h4>
                         <p className="text-xs text-slate-500">Giá thuê: 3,200,000đ • Cọc: 3,200,000đ</p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === 'payments' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Lịch sử thu tiền</h3>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Xem tất cả</button>
                </div>
                <div className="space-y-3">
                   {tenant.paymentHistory?.map((pay, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-colors">
                         <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pay.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               <Icon name={pay.status === 'paid' ? 'CheckCircle' : 'AlertTriangle'} className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">{pay.month}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">{pay.date || 'Chưa thanh toán'}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-slate-900">{pay.amount.toLocaleString()}đ</p>
                            {pay.status === 'overdue' && (
                               <button onClick={() => onAction('remind-debt', tenant)} className="text-[9px] font-black text-rose-600 uppercase tracking-widest underline decoration-dotted mt-1">Nhắc nợ</button>
                            )}
                         </div>
                      </div>
                   ))}
                   {!tenant.paymentHistory && <p className="text-center text-slate-400 italic text-sm py-4">Chưa có lịch sử thanh toán</p>}
                </div>
             </div>
          )}
          
          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pl-6 py-2">
                   {tenant.history?.map((log, idx) => (
                      <div key={idx} className="relative">
                         <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.date}</p>
                         <p className="text-sm font-bold text-slate-800">{log.action}</p>
                         <p className="text-xs text-slate-500 mt-0.5 italic">{log.detail} • bởi {log.user}</p>
                      </div>
                   ))}
                   {!tenant.history && <p className="text-slate-400 italic text-sm">Chưa có dữ liệu ghi nhận.</p>}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
