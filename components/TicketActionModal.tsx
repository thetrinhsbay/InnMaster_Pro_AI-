
import React, { useState, useEffect } from 'react';
import { MaintenanceTicket, Room } from '../types';
import { Icon } from './Icons';

type TicketActionType = 'create-ticket' | 'resolve-ticket';

interface TicketActionModalProps {
  isOpen: boolean;
  type: TicketActionType | null;
  ticket?: MaintenanceTicket | null;
  prefillRoom?: Room | null; // Nếu tạo từ phòng
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const TicketActionModal: React.FC<TicketActionModalProps> = ({ isOpen, type, ticket, prefillRoom, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});
  const [previewSLA, setPreviewSLA] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (type === 'create-ticket') {
        const defaultPriority = 'medium';
        setFormData({
          roomId: prefillRoom?.id || '',
          roomName: prefillRoom?.name || '',
          issueType: 'electric',
          priority: defaultPriority,
          description: ''
        });
        calculateSLA(defaultPriority);
      } else if (type === 'resolve-ticket' && ticket) {
        setFormData({
          resolution: '',
          cost: '',
          status: 'done'
        });
      }
    }
  }, [isOpen, type, ticket, prefillRoom]);

  const calculateSLA = (priority: string) => {
    const hours = priority === 'high' ? 24 : priority === 'medium' ? 48 : 72;
    const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
    setPreviewSLA(`${hours}h (Hạn: ${deadline.toLocaleDateString('vi-VN')} ${deadline.getHours()}:${deadline.getMinutes()})`);
  };

  const handlePriorityChange = (p: string) => {
    handleChange('priority', p);
    calculateSLA(p);
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit({ ...formData, actionType: type, ticketId: ticket?.id });
    onClose();
  };

  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case 'create-ticket':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phòng báo hỏng</label>
                {prefillRoom ? (
                   <div className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-800 border border-slate-200">
                     {prefillRoom.name}
                   </div>
                ) : (
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                         const [id, name] = e.target.value.split('|');
                         handleChange('roomId', id);
                         handleChange('roomName', name);
                    }}
                  >
                    <option value="">-- Chọn phòng --</option>
                    <option value="1|A101">A101</option>
                    <option value="2|A102">A102</option>
                    <option value="3|A103">A103</option>
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loại sự cố</label>
                   <select 
                     className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                     onChange={(e) => handleChange('issueType', e.target.value)}
                     value={formData.issueType}
                   >
                     <option value="electric">Điện / Bóng đèn</option>
                     <option value="water">Nước / Ống nước</option>
                     <option value="ac">Máy lạnh / Đồ gia dụng</option>
                     <option value="internet">Internet / Wifi</option>
                     <option value="other">Khác</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mức độ ưu tiên</label>
                   <div className="flex space-x-1">
                      {['low', 'medium', 'high'].map(p => (
                         <button
                           key={p}
                           onClick={() => handlePriorityChange(p)}
                           className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                             formData.priority === p 
                               ? (p === 'high' ? 'bg-rose-600 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-600 text-white')
                               : 'bg-slate-100 text-slate-400'
                           }`}
                         >
                           {p === 'high' ? 'Cao' : p === 'medium' ? 'Vừa' : 'Thấp'}
                         </button>
                      ))}
                   </div>
                 </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl flex items-center space-x-2 border border-blue-100">
                 <Icon name="Clock" className="w-4 h-4 text-blue-600" />
                 <span className="text-xs font-bold text-blue-800">Cam kết SLA: {previewSLA}</span>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mô tả chi tiết</label>
                <textarea 
                  rows={3}
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Mô tả hiện trạng, vị trí hỏng..."
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-rose-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-rose-700 transition-all shadow-xl shadow-rose-200">
              Tạo Ticket Mới
            </button>
          </>
        );

      case 'resolve-ticket':
        return (
          <>
            <div className="p-4 bg-emerald-50 rounded-2xl mb-6 flex items-center space-x-3">
              <Icon name="CheckCircle" className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Đóng ticket</p>
                <p className="text-lg font-black text-emerald-900">{ticket?.roomName} - {ticket?.issueType}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Kết quả xử lý (Bắt buộc)</label>
                 <textarea 
                   autoFocus
                   rows={3}
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm"
                   placeholder="Đã thay bóng đèn, kiểm tra ổn định..."
                   onChange={(e) => handleChange('resolution', e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chi phí vật tư (nếu có)</label>
                 <input 
                   type="number" 
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-emerald-500"
                   placeholder="0"
                   onChange={(e) => handleChange('cost', parseInt(e.target.value))}
                 />
               </div>
            </div>

            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-emerald-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
               Xác nhận Hoàn thành
            </button>
          </>
        );

      default: return null;
    }
  };

  const titles: Record<string, string> = {
    'create-ticket': 'Tạo Yêu Cầu Bảo Trì',
    'resolve-ticket': 'Hoàn Tất Xử Lý'
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
