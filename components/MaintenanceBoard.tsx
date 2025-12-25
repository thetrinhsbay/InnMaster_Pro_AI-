
import React, { useState } from 'react';
import { MaintenanceTicket } from '../types';
import { Icon } from './Icons';

interface MaintenanceBoardProps {
  tickets: MaintenanceTicket[];
  onSelectTicket: (ticket: MaintenanceTicket) => void;
  onAction: (action: string, ticket: MaintenanceTicket) => void;
  onCreateTicket: () => void;
}

export const MaintenanceBoard: React.FC<MaintenanceBoardProps> = ({ tickets, onSelectTicket, onAction, onCreateTicket }) => {
  const [filter, setFilter] = useState<'open' | 'in_progress' | 'done' | 'overdue' | 'all'>('open');
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter(t => {
    const isOverdue = new Date(t.slaDeadline) < new Date() && t.status !== 'done';
    const matchSearch = t.roomName.toLowerCase().includes(search.toLowerCase()) || 
                        t.issueType.includes(search) ||
                        t.description.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchSearch;
    if (filter === 'overdue') return matchSearch && isOverdue;
    if (filter === 'open') return matchSearch && t.status === 'open';
    if (filter === 'in_progress') return matchSearch && t.status === 'in_progress';
    if (filter === 'done') return matchSearch && t.status === 'done';
    return matchSearch;
  });

  // Sort: Overdue first, then High Priority, then Newest
  const sortedTickets = filteredTickets.sort((a, b) => {
     const now = new Date().getTime();
     const aOverdue = new Date(a.slaDeadline).getTime() < now && a.status !== 'done';
     const bOverdue = new Date(b.slaDeadline).getTime() < now && b.status !== 'done';
     
     if (aOverdue && !bOverdue) return -1;
     if (!aOverdue && bOverdue) return 1;

     const priorityScore = { high: 3, medium: 2, low: 1 };
     if (priorityScore[a.priority] !== priorityScore[b.priority]) {
        return priorityScore[b.priority] - priorityScore[a.priority];
     }
     
     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       {/* Control Bar */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex flex-wrap items-center gap-2">
            {[
               { id: 'open', label: 'Cần xử lý (Open)' },
               { id: 'in_progress', label: 'Đang làm' },
               { id: 'overdue', label: 'Quá hạn (SLA)' },
               { id: 'done', label: 'Đã xong' },
               { id: 'all', label: 'Tất cả' },
            ].map(btn => (
               <button
                 key={btn.id}
                 onClick={() => setFilter(btn.id as any)}
                 className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === btn.id 
                     ? (btn.id === 'overdue' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-900 text-white shadow-lg')
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
                 placeholder="Tìm phòng hoặc lỗi..."
                 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold text-xs"
               />
            </div>
            <button 
               onClick={onCreateTicket}
               className="px-6 py-3.5 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
            >
               + Báo hỏng
            </button>
         </div>
       </div>

       {/* Ticket Cards Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTickets.map(ticket => {
             const isOverdue = new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'done';
             const priorityColor = ticket.priority === 'high' ? 'text-rose-600 bg-rose-50' : ticket.priority === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100';
             
             return (
                <div 
                   key={ticket.id}
                   onClick={() => onSelectTicket(ticket)}
                   className={`bg-white rounded-[2rem] p-6 border transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-full ${
                      isOverdue ? 'border-rose-200 shadow-[0_10px_30px_rgba(239,68,68,0.1)]' : 'border-slate-100 shadow-sm'
                   }`}
                >
                   <div>
                      <div className="flex justify-between items-start mb-4">
                         <span className="px-3 py-1 bg-slate-100 rounded-xl text-xs font-black text-slate-700">{ticket.roomName}</span>
                         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${priorityColor}`}>
                            {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Vừa' : 'Thấp'}
                         </span>
                      </div>
                      
                      <h4 className="text-lg font-black text-slate-900 mb-2 capitalize">{ticket.issueType === 'electric' ? 'Sự cố Điện' : ticket.issueType === 'water' ? 'Sự cố Nước' : ticket.issueType}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4">"{ticket.description}"</p>
                   </div>

                   <div className="space-y-4">
                      {/* SLA Status */}
                      <div className="flex items-center space-x-2">
                         <Icon name="Clock" className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-emerald-500'}`} />
                         <span className={`text-[10px] font-bold uppercase tracking-wide ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                            {isOverdue ? 'Quá hạn SLA' : `Hạn: ${new Date(ticket.slaDeadline).toLocaleDateString('vi-VN')}`}
                         </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4 border-t border-slate-50 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                         {ticket.status === 'open' && (
                            <button 
                               onClick={() => onAction('assign-me', ticket)}
                               className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                               Nhận xử lý
                            </button>
                         )}
                         {ticket.status === 'in_progress' && (
                            <button 
                               onClick={() => onAction('resolve-ticket', ticket)}
                               className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                               Hoàn tất
                            </button>
                         )}
                         {ticket.status === 'done' && (
                            <button className="flex-1 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-default">
                               Đã xong
                            </button>
                         )}
                      </div>
                   </div>
                </div>
             );
          })}
          
          {sortedTickets.length === 0 && (
             <div className="col-span-full p-10 text-center text-slate-400 italic text-sm">
                Tuyệt vời! Không có sự cố nào cần xử lý.
             </div>
          )}
       </div>
    </div>
  );
};
