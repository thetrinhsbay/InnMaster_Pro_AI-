
import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

type ModalType = 'add-property' | 'edit-property' | 'manage-blocks' | 'add-user' | 'edit-user';

interface SettingsActionModalProps {
  isOpen: boolean;
  type: ModalType | null;
  data?: any; // Dữ liệu truyền vào để sửa
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const SettingsActionModal: React.FC<SettingsActionModalProps> = ({ isOpen, type, data, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});
  
  // State riêng cho Quản lý Khu/Tầng
  const [blocks, setBlocks] = useState<{ id: string, name: string, floors: string[] }[]>([
    { id: 'b1', name: 'Khu A (Mặt tiền)', floors: ['Tầng 1', 'Tầng 2', 'Tầng 3'] },
    { id: 'b2', name: 'Khu B (Sân vườn)', floors: ['Trệt', 'Lầu 1'] }
  ]);

  useEffect(() => {
    if (isOpen && data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [isOpen, data]);

  if (!isOpen || !type) return null;

  const handleSubmit = () => {
    if (type === 'manage-blocks') {
        onSubmit({ ...formData, blocks });
    } else {
        onSubmit(formData);
    }
    onClose();
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  // Logic cho Block Manager
  const addBlock = () => {
    const newBlock = { id: Date.now().toString(), name: `Khu mới ${blocks.length + 1}`, floors: ['Tầng 1'] };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const addFloor = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId) return { ...b, floors: [...b.floors, `Tầng ${b.floors.length + 1}`] };
      return b;
    }));
  };

  const renderContent = () => {
    switch (type) {
      case 'add-property':
      case 'edit-property':
        return (
          <div className="space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tên cơ sở</label>
                <input 
                   autoFocus
                   type="text" 
                   defaultValue={data?.name}
                   className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                   placeholder="VD: Chung cư mini Xô Viết"
                   onChange={(e) => handleChange('name', e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Địa chỉ</label>
                <div className="flex items-center bg-slate-50 rounded-xl p-2 border border-transparent focus-within:ring-2 focus-within:ring-blue-500">
                   <Icon name="MapPin" className="w-5 h-5 text-slate-400 ml-2" />
                   <input 
                      type="text" 
                      defaultValue={data?.address}
                      className="w-full p-2 bg-transparent font-bold text-slate-800 border-none focus:outline-none"
                      placeholder="Số nhà, đường, phường..."
                      onChange={(e) => handleChange('address', e.target.value)}
                   />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Khu vực</label>
                   <select 
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleChange('city', e.target.value)}
                   >
                      <option>TP. Hồ Chí Minh</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tổng số phòng</label>
                   <input 
                      type="number" 
                      defaultValue={data?.rooms || 0}
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleChange('rooms', e.target.value)}
                   />
                </div>
             </div>
             <button onClick={handleSubmit} className="w-full py-4 mt-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                {type === 'add-property' ? 'Thêm cơ sở mới' : 'Lưu thay đổi'}
             </button>
          </div>
        );

      case 'manage-blocks':
        return (
          <div className="space-y-6">
             <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center space-x-3">
                <Icon name="Home" className="w-6 h-6 text-blue-600" />
                <div>
                   <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Cấu trúc cơ sở</p>
                   <p className="text-lg font-black text-blue-900">{data?.name}</p>
                </div>
             </div>

             <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {blocks.map((block, index) => (
                   <div key={block.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
                         <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{index + 1}</span>
                            <input 
                               type="text" 
                               defaultValue={block.name} 
                               className="bg-transparent font-black text-sm text-slate-800 focus:outline-none focus:border-b border-blue-500"
                            />
                         </div>
                         <button onClick={() => removeBlock(block.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Icon name="Trash" className="w-4 h-4" />
                         </button>
                      </div>
                      <div className="p-4 bg-white">
                         <div className="flex flex-wrap gap-2">
                            {block.floors.map((floor, fIdx) => (
                               <div key={fIdx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                  {floor}
                               </div>
                            ))}
                            <button 
                               onClick={() => addFloor(block.id)}
                               className="px-3 py-1.5 border border-dashed border-blue-300 text-blue-500 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center"
                            >
                               <Icon name="Plus" className="w-3 h-3 mr-1" /> Thêm tầng
                            </button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>

             <button onClick={addBlock} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-bold uppercase text-xs hover:border-slate-400 hover:text-slate-600 transition-all">
                + Thêm Khu / Dãy mới
             </button>

             <button onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">
                Lưu cấu trúc
             </button>
          </div>
        );

      case 'add-user':
      case 'edit-user':
        return (
          <div className="space-y-5">
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Họ tên nhân viên</label>
                   <input 
                      autoFocus
                      type="text" 
                      defaultValue={data?.name}
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nguyễn Văn A"
                      onChange={(e) => handleChange('name', e.target.value)}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email / SĐT Đăng nhập</label>
                   <input 
                      type="text" 
                      defaultValue={data?.email}
                      className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0909..."
                      onChange={(e) => handleChange('email', e.target.value)}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vai trò & Quyền hạn</label>
                <div className="grid grid-cols-2 gap-3">
                   {['Owner', 'Manager', 'Cashier', 'Accountant'].map(role => (
                      <button 
                         key={role}
                         onClick={() => handleChange('role', role)}
                         className={`p-3 rounded-xl border text-left transition-all ${
                            formData.role === role || (!formData.role && role === 'Manager')
                               ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                               : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                         }`}
                      >
                         <div className="font-black text-xs uppercase mb-1">{role}</div>
                         <div className="text-[9px] font-medium opacity-80">
                            {role === 'Owner' ? 'Toàn quyền hệ thống' : role === 'Manager' ? 'Quản lý vận hành' : role === 'Cashier' ? 'Thu chi & Hóa đơn' : 'Xem báo cáo'}
                         </div>
                      </button>
                   ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phạm vi truy cập</label>
                <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl">
                   {['Căn hộ Quận 1', 'Chung cư Bình Thạnh', 'Nhà trọ Thủ Đức'].map((prop) => (
                      <label key={prop} className="flex items-center space-x-3 cursor-pointer">
                         <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                         <span className="text-xs font-bold text-slate-700">{prop}</span>
                      </label>
                   ))}
                </div>
             </div>

             <button onClick={handleSubmit} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                {type === 'add-user' ? 'Thêm nhân sự' : 'Cập nhật quyền'}
             </button>
          </div>
        );

      default: return null;
    }
  };

  const titles: Record<string, string> = {
    'add-property': 'Thêm Cơ Sở Mới',
    'edit-property': 'Cập Nhật Thông Tin',
    'manage-blocks': 'Quản Lý Khu / Tầng',
    'add-user': 'Thêm Nhân Sự Mới',
    'edit-user': 'Sửa Quyền Truy Cập'
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 p-8 border border-white/20">
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
