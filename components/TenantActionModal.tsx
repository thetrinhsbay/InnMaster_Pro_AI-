
import React, { useState, useEffect } from 'react';
import { Tenant } from '../types';
import { Icon } from './Icons';

type TenantActionType = 'add-tenant' | 'renew-contract' | 'move-room';

interface TenantActionModalProps {
  isOpen: boolean;
  type: TenantActionType | null;
  tenant?: Tenant | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const TenantActionModal: React.FC<TenantActionModalProps> = ({ isOpen, type, tenant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen && tenant) {
      if (type === 'renew-contract') {
        setFormData({
          newEndDate: '', // Should calculate based on current end date + cycle
          newPrice: '', // Should be current room price
        });
      }
    } else {
      setFormData({});
    }
  }, [isOpen, tenant, type]);

  if (!isOpen || !type) return null;

  const handleSubmit = () => {
    onSubmit({ ...formData, actionType: type, tenantId: tenant?.id });
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (type) {
      case 'add-tenant':
        return (
          <>
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Họ và tên</label>
                 <input 
                   autoFocus
                   type="text" 
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   placeholder="Nguyễn Văn A"
                   onChange={(e) => handleChange('name', e.target.value)}
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
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CCCD / CMND</label>
                   <input 
                     type="text" 
                     className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                     placeholder="12 số..."
                     onChange={(e) => handleChange('idCard', e.target.value)}
                   />
                 </div>
               </div>
               <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start space-x-3">
                  <Icon name="Users" className="w-5 h-5 text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Khách hàng này sẽ được tạo hồ sơ ở trạng thái "Chờ xếp phòng". Vui lòng thực hiện Check-in tại Sơ đồ phòng sau.
                  </p>
               </div>
             </div>
             <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all">
               Tạo hồ sơ khách
             </button>
          </>
        );

      case 'renew-contract':
        return (
          <>
            <div className="p-4 bg-indigo-50 rounded-2xl mb-6 flex items-center space-x-3">
              <Icon name="FileText" className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Gia hạn hợp đồng cho</p>
                <p className="text-lg font-black text-indigo-800">{tenant?.name} • {tenant?.roomName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Hết hạn hiện tại</p>
                  <p className="text-sm font-black text-slate-700">{tenant?.contractEnd}</p>
               </div>
               <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Giá thuê cũ</p>
                  <p className="text-sm font-black text-slate-700">3,500,000đ</p>
               </div>
            </div>

            <div className="space-y-4 mt-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Gia hạn đến ngày</label>
                 <input 
                   type="date" 
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   onChange={(e) => handleChange('newEndDate', e.target.value)}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Giá thuê mới (VNĐ)</label>
                 <input 
                   type="number" 
                   defaultValue="3500000"
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   onChange={(e) => handleChange('newPrice', e.target.value)}
                 />
               </div>
            </div>

            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-indigo-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all">
               Xác nhận Gia hạn
            </button>
          </>
        );

      case 'move-room':
        return (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Icon name="Home" className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Chuyển phòng cho {tenant?.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Từ phòng hiện tại: {tenant?.roomName}</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chọn phòng mới (Trống)</label>
                 <select 
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   onChange={(e) => handleChange('newRoomId', e.target.value)}
                 >
                   <option value="">-- Chọn phòng --</option>
                   <option value="A202">P.A202 - Studio (3.5tr)</option>
                   <option value="A301">P.A301 - Penthouse (8.5tr)</option>
                   <option value="B101">P.B101 - 1PN (5tr)</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ngày chuyển</label>
                 <input 
                   type="date" 
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   onChange={(e) => handleChange('moveDate', e.target.value)}
                 />
               </div>
               <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                  <input type="checkbox" id="keepContract" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                  <label htmlFor="keepContract" className="text-xs font-bold text-slate-700">Giữ nguyên thời hạn hợp đồng cũ</label>
               </div>
            </div>

            <button onClick={handleSubmit} className="w-full py-4 mt-6 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">
               Thực hiện Chuyển phòng
            </button>
          </>
        );

      default: return null;
    }
  };

  const titles: Record<string, string> = {
    'add-tenant': 'Thêm khách thuê mới',
    'renew-contract': 'Gia hạn Hợp đồng',
    'move-room': 'Chuyển đổi phòng ở'
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
