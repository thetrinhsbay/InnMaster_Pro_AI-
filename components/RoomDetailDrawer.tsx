
import React from 'react';
import { Room, Tenant } from '../types';
import { Icon } from './Icons';

interface RoomDetailDrawerProps {
  room: Room | null;
  onClose: () => void;
  onAction: (actionType: string, roomId: string) => void;
}

export const RoomDetailDrawer: React.FC<RoomDetailDrawerProps> = ({ room, onClose, onAction }) => {
  if (!room) return null;

  const getStatusConfig = (status: Room['status']) => {
    switch (status) {
      case 'empty': return { label: 'Trống', color: 'bg-emerald-100 text-emerald-700', icon: 'Home' };
      case 'occupied': return { label: 'Đang ở', color: 'bg-blue-100 text-blue-700', icon: 'Users' };
      case 'maintenance': return { label: 'Bảo trì', color: 'bg-rose-100 text-rose-700', icon: 'Wrench' };
      case 'reserved': return { label: 'Đã cọc', color: 'bg-amber-100 text-amber-700', icon: 'Shield' };
    }
  };

  const config = getStatusConfig(room.status);

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm ${config.color}`}>
              {room.name}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                  {config.label}
                </span>
                {room.debt && room.debt > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md">Nợ: {room.debt.toLocaleString()}đ</span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Tầng {room.floor} • {room.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-xl transition-colors">
            <Icon name="Plus" className="rotate-45 w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-3 gap-3">
             <button onClick={() => onAction('remind', room.id)} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl border border-slate-100 transition-all group">
                <Icon name="Send" className="w-5 h-5 mb-2 text-slate-400 group-hover:text-blue-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">Nhắc thu</span>
             </button>
             <button onClick={() => onAction('payment', room.id)} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-2xl border border-slate-100 transition-all group">
                <Icon name="CheckCircle" className="w-5 h-5 mb-2 text-slate-400 group-hover:text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">Thu tiền</span>
             </button>
             <button onClick={() => onAction('ticket', room.id)} className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-2xl border border-slate-100 transition-all group">
                <Icon name="Wrench" className="w-5 h-5 mb-2 text-slate-400 group-hover:text-rose-600" />
                <span className="text-[9px] font-black uppercase tracking-widest">Sự cố</span>
             </button>
          </div>

          {/* Section 1: Tenant Info */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Thông tin khách thuê</h4>
            {room.status === 'occupied' || room.status === 'reserved' ? (
              <div className="p-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black">
                    NV
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight">Nguyễn Văn A</p>
                    <p className="text-xs font-bold text-slate-400">0901 234 567</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 border border-slate-100"><Icon name="Users" className="w-4 h-4" /></button>
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 border border-slate-100"><Icon name="ArrowRight" className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center text-center">
                 <p className="text-sm font-bold text-slate-400 italic">Phòng đang để trống</p>
                 <button onClick={() => onAction('checkin', room.id)} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Tạo Check-in ngay</button>
              </div>
            )}
          </section>

          {/* Section 2: Financial Summary */}
          <section>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tài chính & Dòng tiền</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Giá thuê</p>
                  <p className="text-lg font-black text-slate-800">{room.price.toLocaleString()}đ</p>
               </div>
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Công nợ</p>
                  <p className={`text-lg font-black ${room.debt && room.debt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {room.debt ? room.debt.toLocaleString() : '0'}đ
                  </p>
               </div>
            </div>
          </section>

          {/* Section 3: Utilities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Chỉ số điện nước</h4>
              <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest underline decoration-dotted">Nhập số mới</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="flex items-center space-x-3">
                    <Icon name="Zap" className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Điện (Số cũ)</span>
                 </div>
                 <span className="text-sm font-black text-slate-800">{room.lastReading?.electricity || 0} kWh</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="flex items-center space-x-3">
                    <Icon name="TrendingDown" className="w-4 h-4 text-blue-500 rotate-180" />
                    <span className="text-xs font-bold text-slate-600 uppercase">Nước (Số cũ)</span>
                 </div>
                 <span className="text-sm font-black text-slate-800">{room.lastReading?.water || 0} m³</span>
              </div>
            </div>
          </section>

          {/* Section 4: Maintenance Log */}
          {room.hasMaintenanceIssue && (
            <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sự cố đang xử lý</h4>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                    <Icon name="Wrench" className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-rose-800 leading-tight italic">"Vòi sen bị rỉ nước mạnh"</p>
                    <p className="text-[9px] font-black text-rose-400 uppercase mt-1 tracking-widest">SLA: 24h còn lại</p>
                 </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex space-x-4">
           {room.status === 'occupied' ? (
             <button onClick={() => onAction('checkout', room.id)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-sm">
                Check-out (Tất toán)
             </button>
           ) : room.status === 'empty' ? (
             <button onClick={() => onAction('checkin', room.id)} className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200">
                Check-in ngay
             </button>
           ) : (
             <button onClick={() => onAction('complete-maintenance', room.id)} className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest">
                Hoàn tất bảo trì
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
