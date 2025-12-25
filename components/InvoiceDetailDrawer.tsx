
import React from 'react';
import { Invoice } from '../types';
import { Icon } from './Icons';

interface InvoiceDetailDrawerProps {
  invoice: Invoice | null;
  onClose: () => void;
  onAction: (action: string, invoice: Invoice) => void;
}

export const InvoiceDetailDrawer: React.FC<InvoiceDetailDrawerProps> = ({ invoice, onClose, onAction }) => {
  if (!invoice) return null;

  const remaining = invoice.amount - invoice.paidAmount;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
           <div className="flex justify-between items-start mb-6">
              <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                <Icon name="ArrowRight" className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex space-x-2">
                 {remaining > 0 && (
                     <>
                        <button onClick={() => onAction('send-reminder', invoice)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 transition-all" title="Gửi nhắc nợ">
                           <Icon name="Send" className="w-5 h-5" />
                        </button>
                        <button onClick={() => onAction('record-payment', invoice)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center">
                           <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                           Thu tiền
                        </button>
                     </>
                 )}
              </div>
           </div>

           <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-xl text-slate-700 shadow-sm">
                 {invoice.roomName}
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">{invoice.tenantName}</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Kỳ thu: {invoice.month}</p>
              </div>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
           
           {/* Section 1: Breakdown */}
           <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Chi tiết khoản thu</h4>
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                 <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                       {invoice.items?.map((item, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50">
                             <td className="px-5 py-4 text-sm font-bold text-slate-700">
                                {item.name}
                                {item.quantity && <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{item.quantity} {item.unit} x {item.price.toLocaleString()}</span>}
                             </td>
                             <td className="px-5 py-4 text-sm font-black text-slate-900 text-right">{item.total.toLocaleString()}đ</td>
                          </tr>
                       ))}
                       <tr className="bg-slate-50">
                          <td className="px-5 py-4 text-sm font-black text-slate-900 uppercase">Tổng cộng</td>
                          <td className="px-5 py-4 text-xl font-black text-blue-600 text-right">{invoice.amount.toLocaleString()}đ</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
              
              {/* Paid Status Bar */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã thanh toán</p>
                    <p className="text-lg font-black text-emerald-600">{invoice.paidAmount.toLocaleString()}đ</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Còn lại</p>
                    <p className={`text-lg font-black ${remaining > 0 ? 'text-rose-600' : 'text-slate-400'}`}>{remaining.toLocaleString()}đ</p>
                 </div>
              </div>
           </section>

           {/* Section 2: Payment History */}
           {invoice.payments && invoice.payments.length > 0 && (
             <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Lịch sử thanh toán</h4>
                <div className="space-y-3">
                   {invoice.payments.map((p, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl">
                         <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                               <Icon name={p.method === 'transfer' ? 'Receipt' : 'DollarSign'} className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-800">{p.date}</p>
                               <p className="text-[10px] font-medium text-slate-400 uppercase">{p.method === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}</p>
                            </div>
                         </div>
                         <span className="text-sm font-black text-emerald-600">+{p.amount.toLocaleString()}đ</span>
                      </div>
                   ))}
                </div>
             </section>
           )}

           {/* Section 3: Reminders */}
           {invoice.reminders && invoice.reminders.length > 0 && (
             <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Nhật ký nhắc nợ</h4>
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-4 pl-6 py-2">
                   {invoice.reminders.map((r, i) => (
                      <div key={i} className="relative">
                         <div className="absolute -left-[31px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{r.date} • {r.method}</p>
                         <p className="text-xs font-medium text-slate-600 italic bg-slate-50 p-2 rounded-lg inline-block">"{r.content.substring(0, 50)}..."</p>
                      </div>
                   ))}
                </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
};
