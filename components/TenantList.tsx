
import React, { useState } from 'react';
import { Tenant } from '../types';
import { Icon } from './Icons';

interface TenantListProps {
  tenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  onAction: (action: string, tenant: Tenant) => void;
  onAddTenant: () => void;
}

export const TenantList: React.FC<TenantListProps> = ({ tenants, onSelectTenant, onAction, onAddTenant }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'debt'>('all');
  const [search, setSearch] = useState("");

  const filteredTenants = tenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                        t.phone.includes(search) || 
                        t.roomName.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'all') return matchSearch;
    if (filter === 'active') return matchSearch && t.status === 'active';
    if (filter === 'expiring') return matchSearch && t.status === 'expiring';
    if (filter === 'debt') return matchSearch && t.debt > 0;
    return matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex flex-wrap items-center gap-2">
            {[
               { id: 'all', label: 'Tất cả' },
               { id: 'active', label: 'Đang ở' },
               { id: 'expiring', label: 'Sắp hết hạn' },
               { id: 'debt', label: 'Có nợ' },
            ].map(btn => (
               <button
                 key={btn.id}
                 onClick={() => setFilter(btn.id as any)}
                 className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   filter === btn.id 
                     ? 'bg-slate-900 text-white shadow-lg' 
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
                 placeholder="Tìm tên, SĐT, phòng..."
                 className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-bold text-xs"
               />
            </div>
            <button 
               onClick={onAddTenant}
               className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
               <Icon name="Plus" className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách thuê</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phòng</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hợp đồng</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Công nợ</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredTenants.map((tenant) => (
                     <tr key={tenant.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => onSelectTenant(tenant)}>
                        <td className="px-8 py-5">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">
                                 {tenant.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
                                 <p className="text-xs text-slate-400 font-medium">{tenant.phone}</p>
                              </div>
                              {tenant.riskTags && tenant.riskTags.length > 0 && (
                                 <span className="w-2 h-2 rounded-full bg-amber-500" title="Có lưu ý"></span>
                              )}
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">{tenant.roomName}</span>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex flex-col">
                              <span className={`text-xs font-bold ${tenant.status === 'expiring' ? 'text-amber-600' : 'text-slate-600'}`}>
                                 {tenant.status === 'expiring' ? 'Sắp hết hạn' : 'Đang ở'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">Hết: {tenant.contractEnd}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`text-xs font-black ${tenant.debt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {tenant.debt > 0 ? `${tenant.debt.toLocaleString()}đ` : '0đ'}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                              <button 
                                 title="Gọi điện"
                                 className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 transition-all"
                              >
                                 <Icon name="Phone" className="w-4 h-4" />
                              </button>
                              {tenant.debt > 0 && (
                                 <button 
                                    onClick={() => onAction('remind-debt', tenant)}
                                    title="Nhắc nợ"
                                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all"
                                 >
                                    <Icon name="Send" className="w-4 h-4" />
                                 </button>
                              )}
                              {tenant.status === 'expiring' && (
                                 <button 
                                    onClick={() => onAction('renew-contract', tenant)}
                                    title="Gia hạn"
                                    className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all"
                                 >
                                    <Icon name="FileText" className="w-4 h-4" />
                                 </button>
                              )}
                              <button 
                                 onClick={() => onSelectTenant(tenant)}
                                 className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-200 shadow-sm"
                              >
                                 <Icon name="ArrowRight" className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredTenants.length === 0 && (
            <div className="p-10 text-center text-slate-400">
               <p className="text-sm font-bold italic">Không tìm thấy khách thuê phù hợp.</p>
            </div>
         )}
      </div>
    </div>
  );
};
