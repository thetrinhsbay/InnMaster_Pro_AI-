
import React, { useState } from 'react';
import { Room } from '../types';
import { Icon } from './Icons';

interface RoomGridProps {
  rooms: Room[];
  onRoomClick: (room: Room) => void;
  onQuickAction: (action: string) => void;
  onAddRoom: () => void;
}

export const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onRoomClick, onQuickAction, onAddRoom }) => {
  const [filter, setFilter] = useState<Room['status'] | 'all'>('all');
  const [search, setSearch] = useState("");

  const filteredRooms = rooms.filter(r => {
    const matchStatus = filter === 'all' || r.status === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getCounts = (status: Room['status']) => rooms.filter(r => r.status === status).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'all', label: 'Tất cả', count: rooms.length },
            { id: 'empty', label: 'Trống', count: getCounts('empty') },
            { id: 'occupied', label: 'Đang ở', count: getCounts('occupied') },
            { id: 'reserved', label: 'Đặt cọc', count: getCounts('reserved') },
            { id: 'maintenance', label: 'Bảo trì', count: getCounts('maintenance') },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === btn.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {btn.label} ({btn.count})
            </button>
          ))}
        </div>

        <div className="relative group max-w-xs w-full">
           <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
              <Icon name="Search" className="w-4 h-4" />
           </span>
           <input 
             type="text" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             placeholder="Tìm phòng nhanh..."
             className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 focus:bg-white transition-all font-bold text-xs"
           />
        </div>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredRooms.map((room) => {
          const statusColors = {
            empty: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            occupied: 'bg-blue-50 text-blue-600 border-blue-100',
            maintenance: 'bg-rose-50 text-rose-600 border-rose-100',
            reserved: 'bg-amber-50 text-amber-600 border-amber-100',
          };

          return (
            <div 
              key={room.id}
              onClick={() => onRoomClick(room)}
              className={`group relative bg-white rounded-[2rem] border p-6 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden ${
                room.debt && room.debt > 0 ? 'border-rose-200 shadow-[0_10px_30px_rgba(239,68,68,0.05)]' : 'border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-blue-600 transition-colors">{room.name}</h4>
                <div className={`p-1.5 rounded-lg ${statusColors[room.status]}`}>
                  <Icon name={room.status === 'occupied' ? 'Users' : room.status === 'maintenance' ? 'Wrench' : 'Home'} className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{room.type}</p>
                <p className="text-sm font-black text-slate-800">{room.price.toLocaleString()}đ</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex space-x-1">
                   {room.debt && room.debt > 0 && (
                     <div title="Đang nợ tiền">
                       <Icon name="AlertTriangle" className="w-4 h-4 text-rose-500" />
                     </div>
                   )}
                   {room.hasMaintenanceIssue && (
                     <div title="Cần bảo trì">
                       <Icon name="Wrench" className="w-4 h-4 text-amber-500" />
                     </div>
                   )}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${room.status === 'empty' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {room.status === 'empty' ? `${room.emptyDays} Ngày trống` : 'Đang ở'}
                </span>
              </div>

              {/* Selection Indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          );
        })}

        {/* Quick Create Card */}
        <div 
          onClick={onAddRoom}
          className="border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-slate-300 hover:border-blue-400 hover:text-blue-400 transition-all cursor-pointer group"
        >
           <Icon name="Plus" className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
           <p className="text-[10px] font-black uppercase tracking-widest">Thêm phòng mới</p>
        </div>
      </div>

      {/* Floating Action Dock - Note: Context actions usually require selection, these are generic triggers or placeholders */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-slate-900 p-3 rounded-[2.5rem] shadow-2xl z-40 border border-white/10 animate-in slide-in-from-bottom-10">
         <button onClick={() => alert('Vui lòng chọn phòng cụ thể để Check-in')} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center">
            <Icon name="UserPlus" className="w-4 h-4 mr-2" />
            Check-in
         </button>
         <button onClick={() => alert('Vui lòng chọn phòng cụ thể để Check-out')} className="px-8 py-3 bg-white/5 text-white/70 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center">
            <Icon name="Download" className="w-4 h-4 mr-2" />
            Check-out
         </button>
      </div>
    </div>
  );
};
