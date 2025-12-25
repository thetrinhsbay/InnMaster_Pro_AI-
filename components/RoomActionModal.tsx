
import React, { useState } from 'react';
import { Room } from '../types';
import { Icon } from './Icons';

type ActionType = 'add-room' | 'checkin' | 'checkout' | 'ticket' | null;

interface RoomActionModalProps {
  isOpen: boolean;
  type: ActionType;
  room?: Room | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const RoomActionModal: React.FC<RoomActionModalProps> = ({ isOpen, type, room, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});

  if (!isOpen || !type) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (type) {
      case 'add-room':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tên phòng</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: A-401"
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loại phòng</label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="Studio">Studio</option>
                  <option value="1BR">Duplex / 1PN</option>
                  <option value="2BR">2 Phòng ngủ</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Giá thuê</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3,500,000"
                  onChange={(e) => handleChange('price', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tầng</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                  onChange={(e) => handleChange('floor', parseInt(e.target.value))}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
              Thêm phòng mới
            </button>
          </>
        );

      case 'checkin':
        return (
          <>
            <div className="p-4 bg-blue-50 rounded-2xl mb-6 flex items-center space-x-3">
              <Icon name="Home" className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Phòng được chọn</p>
                <p className="text-lg font-black text-blue-800">{room?.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Họ tên khách</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nguyễn Văn A"
                  onChange={(e) => handleChange('tenantName', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Số điện thoại</label>
                  <input 
                    type="tel" 
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                    placeholder="09xx..."
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tiền cọc</label>
                  <input 
                    type="number" 
                    className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                    placeholder="3,500,000"
                    onChange={(e) => handleChange('deposit', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ngày bắt đầu</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
              Hoàn tất Check-in
            </button>
          </>
        );

      case 'checkout':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Download" className="w-10 h-10 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Xác nhận trả phòng {room?.name}</h3>
              <p className="text-sm text-slate-500 mt-2">Hành động này sẽ chốt công nợ, hoàn cọc và chuyển trạng thái phòng về "Trống".</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="font-medium text-slate-500">Tiền phòng (tạm tính)</span>
                 <span className="font-bold text-slate-800">1,200,000đ</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="font-medium text-slate-500">Điện nước</span>
                 <span className="font-bold text-slate-800">450,000đ</span>
               </div>
               <div className="border-t border-slate-200 pt-2 flex justify-between text-base">
                 <span className="font-black text-slate-800">Tổng thu</span>
                 <span className="font-black text-rose-600">1,650,000đ</span>
               </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-rose-700 transition-all">
              Xác nhận Check-out
            </button>
          </div>
        );

      case 'ticket':
        return (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl mb-4 flex items-center space-x-3">
                <Icon name="Wrench" className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Báo hỏng tại</p>
                  <p className="text-lg font-black text-amber-800">{room?.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Loại sự cố</label>
                <select 
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleChange('issueType', e.target.value)}
                >
                  <option value="electric">Điện / Bóng đèn</option>
                  <option value="water">Nước / Ống nước</option>
                  <option value="ac">Máy lạnh / Đồ gia dụng</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mô tả chi tiết</label>
                <textarea 
                  rows={3}
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Vòi nước bồn rửa mặt bị rỉ..."
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mức độ ưu tiên</label>
                <div className="flex space-x-2">
                  {['Thấp', 'Vừa', 'Cao'].map((level) => (
                    <button 
                      key={level}
                      onClick={() => handleChange('priority', level)}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase ${formData.priority === level ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-amber-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-amber-700 transition-all">
              Tạo Ticket
            </button>
          </>
        );
      
      default: return null;
    }
  };

  const titles: Record<string, string> = {
    'add-room': 'Thêm phòng mới',
    'checkin': 'Check-in Khách mới',
    'checkout': 'Check-out & Tất toán',
    'ticket': 'Báo hỏng / Sự cố'
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
