
import React, { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { Icon } from './Icons';

type BillingActionType = 'record-payment' | 'send-reminder' | 'utility-input' | 'generate-cycle';

interface BillingActionModalProps {
  isOpen: boolean;
  type: BillingActionType | null;
  invoice?: Invoice | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const BillingActionModal: React.FC<BillingActionModalProps> = ({ isOpen, type, invoice, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});
  const [reminderTemplate, setReminderTemplate] = useState('gentle');

  useEffect(() => {
    if (isOpen) {
      if (type === 'record-payment' && invoice) {
        setFormData({
          amount: invoice.amount - invoice.paidAmount,
          method: 'transfer',
          note: ''
        });
      } else if (type === 'send-reminder' && invoice) {
        updateReminderContent('gentle');
      } else if (type === 'utility-input' && invoice) {
          // Mock previous readings
          setFormData({
              oldElec: 120, newElec: '',
              oldWater: 45, newWater: ''
          });
      }
    } else {
      setFormData({});
    }
  }, [isOpen, type, invoice]);

  const updateReminderContent = (template: string) => {
    setReminderTemplate(template);
    let content = "";
    const remaining = invoice ? (invoice.amount - invoice.paidAmount).toLocaleString() : '0';
    if (template === 'gentle') {
      content = `Chào bạn ${invoice?.tenantName}, phòng ${invoice?.roomName}. Tiền phòng tháng này là ${remaining}đ. Hạn đóng là ${invoice?.dueDate}. Bạn vui lòng thanh toán sớm nhé!`;
    } else if (template === 'firm') {
      content = `THÔNG BÁO: Phòng ${invoice?.roomName} đã quá hạn thanh toán ${invoice?.agingDays} ngày. Số tiền: ${remaining}đ. Vui lòng thanh toán NGAY để tránh bị cắt dịch vụ.`;
    }
    setFormData(prev => ({ ...prev, content }));
  };

  if (!isOpen || !type) return null;

  const handleSubmit = () => {
    onSubmit({ ...formData, actionType: type, invoiceId: invoice?.id });
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (type) {
      case 'record-payment':
        const remaining = invoice ? invoice.amount - invoice.paidAmount : 0;
        return (
          <>
             <div className="p-4 bg-emerald-50 rounded-2xl mb-6 flex items-center space-x-3">
               <Icon name="DollarSign" className="w-6 h-6 text-emerald-600" />
               <div>
                 <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Ghi nhận thu tiền</p>
                 <p className="text-lg font-black text-emerald-900">{invoice?.roomName} - {invoice?.tenantName}</p>
               </div>
             </div>
             
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Số tiền thu (Còn lại: {remaining.toLocaleString()}đ)</label>
                 <input 
                   autoFocus
                   type="number" 
                   value={formData.amount}
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-2xl text-emerald-600 border-none focus:ring-2 focus:ring-emerald-500"
                   onChange={(e) => handleChange('amount', parseInt(e.target.value))}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phương thức</label>
                 <div className="flex space-x-2">
                    {['transfer', 'cash'].map(m => (
                        <button 
                            key={m}
                            onClick={() => handleChange('method', m)}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase ${formData.method === m ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                            {m === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt'}
                        </button>
                    ))}
                 </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ghi chú</label>
                  <input 
                    type="text" 
                    placeholder="VD: Thu hộ..."
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-emerald-500"
                    onChange={(e) => handleChange('note', e.target.value)}
                  />
               </div>
             </div>
             <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-emerald-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
               Xác nhận Đã thu
             </button>
          </>
        );

      case 'send-reminder':
        return (
          <>
             <div className="p-4 bg-blue-50 rounded-2xl mb-6 flex items-center space-x-3">
               <Icon name="Send" className="w-6 h-6 text-blue-600" />
               <div>
                 <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Gửi nhắc thanh toán</p>
                 <p className="text-lg font-black text-blue-900">{invoice?.roomName} - {invoice?.tenantName}</p>
               </div>
             </div>

             <div className="space-y-4">
                <div className="flex space-x-2 mb-2">
                    <button onClick={() => updateReminderContent('gentle')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${reminderTemplate === 'gentle' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Lịch sự</button>
                    <button onClick={() => updateReminderContent('firm')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${reminderTemplate === 'firm' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Nghiêm khắc</button>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nội dung tin nhắn</label>
                    <textarea 
                        rows={4}
                        value={formData.content}
                        className="w-full p-4 bg-slate-50 rounded-xl font-medium text-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onChange={(e) => handleChange('content', e.target.value)}
                    />
                </div>
                
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => navigator.clipboard.writeText(formData.content)}>
                    <Icon name="Copy" className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Sao chép nội dung</span>
                </div>
             </div>

             <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">
               Lưu Nhật ký Nhắc nợ
             </button>
          </>
        );
        
      case 'generate-cycle':
         return (
             <div className="text-center space-y-6">
                 <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                     <Icon name="Calendar" className="w-10 h-10 text-indigo-600" />
                 </div>
                 <div>
                     <h3 className="text-xl font-black text-slate-800">Tạo Kỳ Thu Tháng 06/2024</h3>
                     <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Hệ thống sẽ tự động tạo hóa đơn cho tất cả các phòng có khách đang ở.</p>
                 </div>
                 
                 <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3 border border-slate-100">
                     <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500 uppercase">Số lượng dự kiến</span>
                         <span className="text-base font-black text-slate-800">12 Hóa đơn</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500 uppercase">Tổng doanh thu</span>
                         <span className="text-base font-black text-indigo-600">45,500,000đ</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500 uppercase">Cảnh báo</span>
                         <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded">2 Phòng thiếu giá điện</span>
                     </div>
                 </div>

                 <button onClick={handleSubmit} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                     Xác nhận & Tạo Hóa đơn
                 </button>
             </div>
         );

      default: return null;
    }
  };

  const titles: Record<string, string> = {
    'record-payment': 'Thu tiền',
    'send-reminder': 'Nhắc thanh toán',
    'utility-input': 'Nhập điện nước',
    'generate-cycle': 'Tạo kỳ thu'
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{titles[type]}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <Icon name="Plus" className="rotate-45 w-6 h-6 text-slate-400" />
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};
