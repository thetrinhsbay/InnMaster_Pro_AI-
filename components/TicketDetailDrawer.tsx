
import React from 'react';
import { MaintenanceTicket } from '../types';
import { Icon } from './Icons';

interface TicketDetailDrawerProps {
  ticket: MaintenanceTicket | null;
  onClose: () => void;
  onAction: (action: string, ticket: MaintenanceTicket) => void;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ ticket, onClose, onAction }) => {
  if (!ticket) return null;

  const isOverdue = new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'done';
  
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (s: string) => {
     switch (s) {
        case 'open': return 'bg-blue-100 text-blue-700';
        case 'in_progress': return 'bg-indigo-100 text-indigo-700';
        case 'done': return 'bg-emerald-100 text-emerald-700';
        default: return 'bg-slate-100 text-slate-500';
     }
  };

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
                 {ticket.status !== 'done' && (
                    <>
                       {ticket.status === 'open' && (
                          <button onClick={() => onAction('assign-me', ticket)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                             Nhận việc
                          </button>
                       )}
                       {ticket.status === 'in_progress' && (
                          <button onClick={() => onAction('resolve-ticket', ticket)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                             Hoàn tất
                          </button>
                       )}
                    </>
                 )}
              </div>
           </div>

           <div className="flex items-start justify-between">
              <div>
                 <div className="flex space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                       {ticket.priority === 'high' ? 'Khẩn cấp' : ticket.priority === 'medium' ? 'Ưu tiên Vừa' : 'Thấp'}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(ticket.status)}`}>
                       {ticket.status === 'open' ? 'Mới' : ticket.status === 'in_progress' ? 'Đang xử lý' : ticket.status === 'done' ? 'Đã xong' : 'Hủy'}
                    </span>
                 </div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{ticket.issueType === 'electric' ? 'Sự cố Điện' : ticket.issueType === 'water' ? 'Sự cố Nước' : ticket.issueType}</h2>
                 <div className="flex items-center text-slate-500 text-xs font-bold">
                    <Icon name="Home" className="w-4 h-4 mr-1" />
                    {ticket.roomName}
                 </div>
              </div>
              {isOverdue && (
                 <div className="p-3 bg-rose-50 rounded-xl text-rose-600 flex flex-col items-center">
                    <Icon name="AlertTriangle" className="w-6 h-6 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Overdue</span>
                 </div>
              )}
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
           
           {/* Section 1: Details */}
           <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Mô tả sự cố</h4>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed">
                 "{ticket.description}"
              </div>
              <div className="flex items-center mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest space-x-4">
                 <span>Tạo lúc: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}</span>
                 <span>SLA: {new Date(ticket.slaDeadline).toLocaleDateString('vi-VN')} {new Date(ticket.slaDeadline).getHours()}h</span>
              </div>
           </section>

           {/* Section 2: Assignee */}
           <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Người phụ trách</h4>
              <div className="flex items-center space-x-3 p-4 border border-slate-100 rounded-2xl">
                 <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black">
                    {ticket.assignee ? ticket.assignee.charAt(0) : '?'}
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900">{ticket.assignee || 'Chưa có người nhận'}</p>
                    <p className="text-xs text-slate-400 font-medium">Kỹ thuật viên</p>
                 </div>
              </div>
           </section>

           {/* Section 3: Timeline */}
           <section>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Tiến độ xử lý</h4>
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pl-8 py-2">
                 {ticket.logs?.map((log, idx) => (
                    <div key={idx} className="relative">
                       <div className="absolute -left-[41px] top-0 w-6 h-6 bg-white border-4 border-slate-200 rounded-full"></div>
                       <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.date} • {log.user}</p>
                          <p className="text-sm font-bold text-slate-800">{log.action === 'created' ? 'Đã tạo ticket' : log.action === 'assigned' ? 'Đã nhận việc' : log.action === 'resolved' ? 'Đã hoàn thành' : 'Cập nhật'}</p>
                          {log.note && <p className="text-xs text-slate-600 mt-1 italic">"{log.note}"</p>}
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
