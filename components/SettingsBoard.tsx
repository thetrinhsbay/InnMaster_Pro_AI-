
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { SettingsActionModal } from './SettingsActionModal';

export const SettingsBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'properties' | 'roles' | 'templates'>('profile');
  
  // Modal State
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'add-property' | 'edit-property' | 'manage-blocks' | 'add-user' | 'edit-user' | null; data?: any }>({
    isOpen: false,
    type: null,
    data: null
  });

  // MOCK DATA (Local state to simulate CRUD)
  const [properties, setProperties] = useState([
    { id: 1, name: 'Căn hộ dịch vụ Quận 1', address: '123 Nguyễn Trãi, Q1', rooms: 25, status: 'active' },
    { id: 2, name: 'Chung cư mini Bình Thạnh', address: '456 Xô Viết, BT', rooms: 40, status: 'active' },
  ]);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Nguyễn Văn Chủ', role: 'Owner', access: 'All', email: 'owner@leaninn.ai' },
    { id: 2, name: 'Trần Quản Lý', role: 'Manager', access: 'Q1, BT', email: 'manager@leaninn.ai' },
    { id: 3, name: 'Lê Thu Ngân', role: 'Cashier', access: 'Q1', email: 'cashier@leaninn.ai' },
  ]);

  // --- TEMPLATES STATE & LOGIC ---
  const [templates, setTemplates] = useState([
    { id: '1', name: 'Nhắc thu lần 1 (Lịch sự)', content: 'Chào bạn {tenantName}, phòng {room}. Tiền phòng tháng này là {amount}. Hạn đóng là {dueDate}. Bạn vui lòng thanh toán sớm nhé!', type: 'Zalo' },
    { id: '2', name: 'Nhắc thu lần 2 (Cứng)', content: 'THÔNG BÁO: Phòng {room} đã quá hạn thanh toán {agingDays} ngày. Số tiền: {amount}. Vui lòng thanh toán NGAY để tránh bị cắt dịch vụ.', type: 'SMS' },
    { id: '3', name: 'Thông báo cắt dịch vụ', content: 'Do chưa thanh toán tiền phòng {room}, ban quản lý sẽ tạm ngưng cung cấp điện/nước từ 12h trưa mai.', type: 'Zalo' },
    { id: '4', name: 'Chúc mừng sinh nhật', content: 'Chúc mừng sinh nhật bạn {tenantName}! Cảm ơn bạn đã đồng hành cùng chúng tôi.', type: 'Zalo' },
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('1');
  const [editingTemplate, setEditingTemplate] = useState<any>(templates[0]);
  const [showPreview, setShowPreview] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = templates.find(t => t.id === selectedTemplateId);
    if (t) setEditingTemplate({ ...t });
  }, [selectedTemplateId]);

  const handleTemplateChange = (field: string, value: string) => {
    setEditingTemplate((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveTemplate = () => {
    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    alert("Đã lưu mẫu tin thành công!");
  };

  const handleCreateTemplate = () => {
    const newId = Date.now().toString();
    const newTemplate = { id: newId, name: 'Mẫu tin mới', content: '', type: 'Zalo' };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newId);
  };

  const handleDeleteTemplate = () => {
    if (confirm("Bạn có chắc muốn xóa mẫu này?")) {
      const newTemplates = templates.filter(t => t.id !== editingTemplate.id);
      setTemplates(newTemplates);
      if (newTemplates.length > 0) {
        setSelectedTemplateId(newTemplates[0].id);
      } else {
        setEditingTemplate({ id: '', name: '', content: '', type: 'Zalo' }); 
      }
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = textAreaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = editingTemplate.content;
      const newText = text.substring(0, start) + variable + text.substring(end);
      handleTemplateChange('content', newText);
      // Restore cursor position roughly
      setTimeout(() => {
         textarea.focus();
         textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    } else {
       handleTemplateChange('content', editingTemplate.content + " " + variable);
    }
  };

  const getPreviewContent = () => {
     if (!editingTemplate) return "";
     let content = editingTemplate.content;
     const mockData: any = {
        '{tenantName}': 'Nguyễn Văn A',
        '{room}': 'P.302',
        '{amount}': '3,500,000đ',
        '{dueDate}': '05/06/2024',
        '{bankInfo}': 'VCB 1234567890',
        '{agingDays}': '3'
     };
     for (const key in mockData) {
        content = content.replaceAll(key, mockData[key]);
     }
     return content;
  };

  // Handlers
  const handleOpenModal = (type: any, data?: any) => {
    setModalState({ isOpen: true, type, data });
  };

  const handleModalSubmit = (formData: any) => {
    // Simulate updating data
    if (modalState.type === 'add-property') {
       setProperties([...properties, { id: Date.now(), name: formData.name, address: formData.address, rooms: formData.rooms || 0, status: 'active' }]);
    } else if (modalState.type === 'edit-property') {
       setProperties(properties.map(p => p.id === modalState.data.id ? { ...p, ...formData } : p));
    } else if (modalState.type === 'add-user') {
       setRoles([...roles, { id: Date.now(), name: formData.name, role: formData.role || 'Manager', access: 'Custom', email: formData.email }]);
    } else if (modalState.type === 'edit-user') {
       setRoles(roles.map(r => r.id === modalState.data.id ? { ...r, ...formData } : r));
    }
    // Block manager logic is handled inside modal for now visually
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm w-fit">
        {[
          { id: 'profile', label: 'Hồ sơ', icon: 'UserCheck' },
          { id: 'properties', label: 'Cơ sở', icon: 'Home' },
          { id: 'roles', label: 'Phân quyền', icon: 'Users' },
          { id: 'templates', label: 'Mẫu tin', icon: 'Send' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-transparent text-slate-400 hover:bg-slate-50'
            }`}
          >
            <Icon name={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm overflow-y-auto">
        
        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Thông tin tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                     <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-3xl ring-4 ring-indigo-50">
                        A
                     </div>
                     <div>
                        <p className="font-black text-lg text-slate-800">Admin Owner</p>
                        <p className="text-xs font-bold text-slate-400 uppercase">Super Administrator</p>
                        <button className="text-[10px] text-blue-600 font-bold hover:underline mt-1">Đổi mật khẩu</button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Họ tên hiển thị</label>
                     <input type="text" defaultValue="Nguyễn Văn Chủ" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Số điện thoại</label>
                     <input type="text" defaultValue="0909 999 888" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ngôn ngữ</label>
                     <div className="flex p-1 bg-slate-100 rounded-xl">
                        <button className="flex-1 py-3 bg-white rounded-lg shadow-sm font-black text-xs text-slate-800 border border-slate-200">Tiếng Việt</button>
                        <button className="flex-1 py-3 text-slate-400 font-bold text-xs hover:text-slate-600">English</button>
                     </div>
                  </div>
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-3">
                     <Icon name="Shield" className="w-6 h-6 text-amber-500" />
                     <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Phiên đăng nhập</p>
                        <p className="text-xs font-bold text-amber-800">Hết hạn sau: 6 ngày 23 giờ</p>
                     </div>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white font-black rounded-xl uppercase text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                     Lưu thay đổi
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES */}
        {activeTab === 'properties' && (
          <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Quản lý Cơ sở</h3>
                   <p className="text-xs font-bold text-slate-400">Danh sách chi nhánh & cấu trúc phòng</p>
                </div>
                <button 
                   onClick={() => handleOpenModal('add-property')}
                   className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center space-x-2"
                >
                   <Icon name="Plus" className="w-4 h-4" />
                   <span>Thêm cơ sở</span>
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(prop => (
                   <div key={prop.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all group flex flex-col justify-between h-full">
                      <div>
                         <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                               <Icon name="Home" className="w-6 h-6" />
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Active</span>
                         </div>
                         <h4 className="text-lg font-black text-slate-800 mb-1 leading-tight">{prop.name}</h4>
                         <p className="text-xs font-bold text-slate-400 mb-4">{prop.address}</p>
                         <div className="flex items-center space-x-2 mb-4">
                            <span className="px-3 py-1 bg-slate-200 rounded-lg text-[10px] font-bold text-slate-600">{prop.rooms} Phòng</span>
                            <span className="px-3 py-1 bg-slate-200 rounded-lg text-[10px] font-bold text-slate-600">HCM</span>
                         </div>
                      </div>
                      <div className="flex space-x-2 border-t border-slate-200 pt-4 mt-auto">
                         <button onClick={() => handleOpenModal('edit-property', prop)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 transition-all">Sửa</button>
                         <button onClick={() => handleOpenModal('manage-blocks', prop)} className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-blue-600 hover:border-blue-200 transition-all">Cấu trúc</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB 3: ROLES */}
        {activeTab === 'roles' && (
          <div>
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nhân sự & Phân quyền</h3>
                   <p className="text-xs font-bold text-slate-400">Kiểm soát ai được làm gì</p>
                </div>
                <button 
                   onClick={() => handleOpenModal('add-user')}
                   className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center space-x-2"
                >
                   <Icon name="UserPlus" className="w-4 h-4" />
                   <span>Thêm nhân sự</span>
                </button>
             </div>
             <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                         <th className="px-6 py-5">Tên nhân viên</th>
                         <th className="px-6 py-5">Vai trò</th>
                         <th className="px-6 py-5">Phạm vi</th>
                         <th className="px-6 py-5 text-right">Thao tác</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {roles.map(user => (
                         <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                               <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                            </td>
                            <td className="px-6 py-5">
                               <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                  user.role === 'Owner' ? 'bg-purple-100 text-purple-700' : 
                                  user.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                               }`}>
                                  {user.role}
                               </span>
                            </td>
                            <td className="px-6 py-5 text-xs font-bold text-slate-500">{user.access}</td>
                            <td className="px-6 py-5 text-right">
                               <button 
                                  onClick={() => handleOpenModal('edit-user', user)}
                                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase hover:text-blue-600 hover:border-blue-200 transition-all opacity-0 group-hover:opacity-100"
                               >
                                  Sửa quyền
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* TAB 4: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="flex flex-col md:flex-row gap-8 h-full">
             {/* Left Sidebar: List */}
             <div className="w-full md:w-1/3 space-y-4 border-r border-slate-100 pr-6 flex flex-col">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Danh sách mẫu</span>
                   <button 
                      onClick={handleCreateTemplate}
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-lg"
                   >
                      <Icon name="Plus" className="w-3 h-3 mr-1" /> Mới
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                   {templates.map((t) => (
                      <div 
                         key={t.id} 
                         onClick={() => setSelectedTemplateId(t.id)}
                         className={`p-4 rounded-2xl cursor-pointer transition-all border group ${
                            selectedTemplateId === t.id 
                               ? 'bg-slate-900 text-white shadow-lg border-transparent' 
                               : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                         }`}
                      >
                         <div className="flex justify-between items-start">
                            <p className="text-xs font-black uppercase tracking-wide truncate pr-2">{t.name}</p>
                            {selectedTemplateId === t.id && (
                               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                         </div>
                         <p className={`text-[10px] mt-1 font-bold ${selectedTemplateId === t.id ? 'text-slate-400' : 'text-slate-300'}`}>{t.type}</p>
                         <p className={`text-[10px] mt-2 line-clamp-2 ${selectedTemplateId === t.id ? 'text-slate-300' : 'text-slate-400'}`}>
                            {t.content}
                         </p>
                      </div>
                   ))}
                </div>
             </div>

             {/* Right Content: Editor */}
             {editingTemplate ? (
                <div className="flex-1 space-y-5 flex flex-col h-full">
                   <div className="flex space-x-4">
                      <div className="flex-1">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Tên mẫu tin</label>
                         <input 
                            type="text" 
                            value={editingTemplate.name} 
                            onChange={(e) => handleTemplateChange('name', e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500" 
                         />
                      </div>
                      <div className="w-1/3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Loại tin</label>
                         <select 
                            value={editingTemplate.type}
                            onChange={(e) => handleTemplateChange('type', e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-800 border-none focus:ring-2 focus:ring-blue-500"
                         >
                            <option value="Zalo">Zalo</option>
                            <option value="SMS">SMS</option>
                            <option value="Email">Email</option>
                         </select>
                      </div>
                   </div>

                   <div className="flex-1 flex flex-col">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Nội dung chi tiết</label>
                      <textarea 
                         ref={textAreaRef}
                         value={editingTemplate.content}
                         onChange={(e) => handleTemplateChange('content', e.target.value)}
                         className="flex-1 w-full p-4 bg-slate-50 rounded-2xl font-medium text-slate-800 border-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed resize-none"
                         placeholder="Nhập nội dung tin nhắn..."
                      />
                   </div>

                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Biến tự động (Click để chèn)</p>
                      <div className="flex flex-wrap gap-2">
                         {['{tenantName}', '{room}', '{amount}', '{dueDate}', '{bankInfo}', '{agingDays}'].map(v => (
                            <button 
                               key={v} 
                               onClick={() => insertVariable(v)}
                               className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-indigo-100 transition-colors border border-indigo-100 active:scale-95"
                            >
                               {v}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="flex space-x-4 pt-4 border-t border-slate-50">
                      <button 
                         onClick={handleSaveTemplate}
                         className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center"
                      >
                         <Icon name="CheckCircle" className="w-4 h-4 mr-2" /> Lưu mẫu
                      </button>
                      <button 
                         onClick={() => setShowPreview(true)}
                         className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center"
                      >
                         <Icon name="Search" className="w-4 h-4 mr-2" /> Xem trước
                      </button>
                      <button 
                         onClick={handleDeleteTemplate}
                         className="ml-auto px-4 py-3 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 rounded-xl transition-all flex items-center"
                      >
                         <Icon name="Trash" className="w-4 h-4 mr-2" /> Xóa
                      </button>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                   <Icon name="FileText" className="w-16 h-16 mb-4" />
                   <p className="text-sm font-bold uppercase tracking-widest">Chưa chọn mẫu tin nào</p>
                </div>
             )}
          </div>
        )}
      </div>

      {/* Preview Overlay */}
      {showPreview && editingTemplate && (
         <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300 border border-slate-200">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h4 className="text-lg font-black text-slate-900">Xem trước tin nhắn</h4>
                     <p className="text-xs text-slate-400 font-bold uppercase">Giả lập dữ liệu mẫu</p>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                     <Icon name="Plus" className="rotate-45 w-5 h-5 text-slate-500" />
                  </button>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                     Tin nhắn gửi đi
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                     {getPreviewContent()}
                  </p>
               </div>
               <div className="mt-6 flex justify-end">
                  <button onClick={() => setShowPreview(false)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Đóng</button>
               </div>
            </div>
         </div>
      )}

      <SettingsActionModal 
        isOpen={modalState.isOpen}
        type={modalState.type}
        data={modalState.data}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
