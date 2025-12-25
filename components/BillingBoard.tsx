
import React, { useState } from 'react';
import { Invoice } from '../types';
import { Icon } from './Icons';

interface BillingBoardProps {
  invoices: Invoice[];
  onSelectInvoice: (invoice: Invoice) => void;
  onAction: (action: string, invoice: Invoice) => void;
  onGenerateCycle: () => void;
}

export const BillingBoard: React.FC<BillingBoardProps> = ({ invoices, onSelectInvoice, onAction, onGenerateCycle }) => {
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');
  const [search, setSearch] = useState("");

  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = inv.roomName.toLowerCase().includes(search.toLowerCase()) || 
                        inv.tenantName.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchSearch;
    if (filter === 'unpaid') return matchSearch && inv.status === 'pending';
    if (filter === 'overdue') return matchSearch && inv.status === 'overdue';
    if (filter === 'paid') return matchSearch && inv.status === 'paid';
    return matchSearch;
  });

  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalExpected = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
  const totalDebt = totalExpected - totalCollected;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       
       {/* Top KPI Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đã thu / Dự kiến</p>
                <div className="flex items-baseline space-x-1">
                   <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{totalCollected.toLocaleString()}</h3>
                   <span className="text-sm font-bold text-slate-400">/ {totalExpected.toLocaleString()}</span>
                </div>
             </div>
             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Icon name="PieChart" className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hóa đơn Quá hạn</p>
                <h3 className="text-2xl font-black text-rose-600 tracking-tight">{overdueCount}</h3>
             </div>
             <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <Icon name="AlertTriangle" className="w-6 h-6" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng nợ hiện tại</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{totalDebt.toLocaleString()}</h3>
             </div>
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                <Icon name="DollarSign" className="w-6 h-6" />
             </div>
          </div>
       </div>

       {/* Control Bar */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex flex-wrap items-center gap-2">
            {[
               { id: 'all', label: 'Tất cả' },
               { id: 'unpaid', label: 'Chưa thu' },
               { id: 'overdue', label: 'Quá hạn' },
               { id: 'paid', label: 'Đã thu' },
            ].map(btn => (
               <button
                 key={btn.id}
                 onClick={() => setFilter(btn.id as any)}
                 className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === btn.id 
                     ? 'bg-slate-900 text-white shadow-lg' 
                     : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                 }`}
               >
                 {btn.label}
               </button>
            ))}
         </div>

         <div className="flex items-center space-x-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:w-64">
               <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                  <Icon name="Search" className="w-4 h-4" />
               </span>
               <input 
                 type="text" 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Tìm phòng hoặc tên khách..."
                 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold text-xs"
               />
            </div>
            <button 
               onClick={onGenerateCycle}
               className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
            >
               + Tạo kỳ thu
            </button>
         </div>
       </div>

       {/* Action Table */}
       <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng / Khách</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cần thu</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn đóng</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác nhanh</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => onSelectInvoice(inv)}>
                         <td className="px-8 py-5">
                            <div className="flex items-center space-x-4">
                               <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">
                                  {inv.roomName}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-900">{inv.tenantName}</p>
                                  {inv.payments && inv.payments.length > 0 && inv.status !== 'paid' && (
                                     <p className="text-[10px] text-emerald-600 font-bold">Đã thu: {inv.paidAmount.toLocaleString()}đ</p>
                                  )}
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <span className="text-sm font-black text-slate-900">{(inv.amount - inv.paidAmount).toLocaleString()}đ</span>
                         </td>
                         <td className="px-8 py-5">
                            {inv.status === 'overdue' ? (
                               <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Quá hạn {inv.agingDays} ngày</span>
                            ) : inv.status === 'paid' ? (
                               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">Đã thu đủ</span>
                            ) : (
                               <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Chờ thu</span>
                            )}
                         </td>
                         <td className="px-8 py-5">
                             <span className="text-xs font-bold text-slate-600">{inv.dueDate}</span>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                               {inv.status !== 'paid' && (
                                  <>
                                     <button 
                                        onClick={() => onAction('record-payment', inv)}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 transition-all text-[10px] font-black uppercase tracking-widest"
                                     >
                                        Thu tiền
                                     </button>
                                     <button 
                                        onClick={() => onAction('send-reminder', inv)}
                                        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-lg hover:border-blue-200 transition-all"
                                        title="Nhắc nợ"
                                     >
                                        <Icon name="Send" className="w-4 h-4" />
                                     </button>
                                  </>
                               )}
                               <button 
                                  onClick={() => onSelectInvoice(inv)}
                                  className="p-2 bg-white border border-transparent hover:bg-slate-100 text-slate-400 rounded-lg transition-all"
                               >
                                  <Icon name="ArrowRight" className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          {filteredInvoices.length === 0 && (
             <div className="p-10 text-center text-slate-400">
                <p className="text-sm font-bold italic">Không có hóa đơn nào trong danh sách lọc.</p>
             </div>
          )}
       </div>
    </div>
  );
};
