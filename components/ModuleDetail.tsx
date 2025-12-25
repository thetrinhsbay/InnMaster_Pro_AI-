
import React, { useState, useEffect } from 'react';
import { MainModule, SubFunction, Room, Tenant, Invoice, MaintenanceTicket, AIAction } from '../types';
import { Icon } from './Icons';
import { RoomGrid } from './RoomGrid';
import { RoomDetailDrawer } from './RoomDetailDrawer';
import { RoomActionModal } from './RoomActionModal';
import { TenantList } from './TenantList';
import { TenantProfileDrawer } from './TenantProfileDrawer';
import { TenantActionModal } from './TenantActionModal';
import { BillingBoard } from './BillingBoard';
import { InvoiceDetailDrawer } from './InvoiceDetailDrawer';
import { BillingActionModal } from './BillingActionModal';
import { MaintenanceBoard } from './MaintenanceBoard';
import { TicketDetailDrawer } from './TicketDetailDrawer';
import { TicketActionModal } from './TicketActionModal';
import { SettingsBoard } from './SettingsBoard';
import { CEOCommandBoard } from './CEOCommandBoard';

interface ModuleDetailProps {
  module: MainModule;
  onBack: () => void;
  onSubFunctionClick: (sub: SubFunction) => void;
  onAskAI: (query: string, context?: any) => void;
  onUpdateContext?: (data: any) => void;
  pendingAction?: AIAction | null;
  onActionComplete?: () => void;
}

// Mock initial rooms data
const INITIAL_ROOMS: Room[] = [
  { id: '1', name: 'A101', type: 'Studio', status: 'empty', price: 3500000, floor: 1, emptyDays: 5, lastReading: { electricity: 120, water: 45, date: '2024-05-01' } },
  { id: '2', name: 'A102', type: 'Studio', status: 'occupied', price: 3500000, floor: 1, debt: 500000, lastReading: { electricity: 250, water: 88, date: '2024-05-01' } },
  { id: '3', name: 'A103', type: '1BR', status: 'occupied', price: 5000000, floor: 1, hasMaintenanceIssue: true, lastReading: { electricity: 310, water: 112, date: '2024-05-01' } },
  { id: '4', name: 'A201', type: 'Studio', status: 'maintenance', price: 3500000, floor: 2, lastReading: { electricity: 50, water: 20, date: '2024-05-01' } },
  { id: '5', name: 'A202', type: 'Studio', status: 'reserved', price: 3500000, floor: 2, lastReading: { electricity: 10, water: 5, date: '2024-05-01' } },
  { id: '6', name: 'A203', type: '1BR', status: 'occupied', price: 5000000, floor: 2, lastReading: { electricity: 420, water: 150, date: '2024-05-01' } },
  { id: '7', name: 'A301', type: 'Penthouse', status: 'empty', price: 8500000, floor: 3, emptyDays: 12, lastReading: { electricity: 0, water: 0, date: '2024-05-01' } },
  { id: '8', name: 'A302', type: '1BR', status: 'occupied', price: 5000000, floor: 3, debt: 1200000, lastReading: { electricity: 190, water: 65, date: '2024-05-01' } },
];

// Mock Tenant Data
const INITIAL_TENANTS: Tenant[] = [
  { 
    id: 't1', name: 'Nguyễn Văn A', phone: '0901234567', roomId: '2', roomName: 'A102', 
    contractStart: '2024-01-01', contractEnd: '2024-06-30', deposit: 3500000, status: 'active', debt: 500000, 
    riskTags: ['late_payment'],
    paymentHistory: [
       { id: 'p1', month: 'Tháng 4/2024', amount: 3800000, status: 'paid', date: '2024-04-05' },
       { id: 'p2', month: 'Tháng 5/2024', amount: 3800000, status: 'overdue' }
    ],
    history: [
       { date: '2024-05-10', action: 'Nhắc nợ', detail: 'Đã gửi tin nhắn Zalo', user: 'Manager' },
       { date: '2024-01-01', action: 'Check-in', detail: 'Ký hợp đồng 6 tháng', user: 'Manager' }
    ]
  },
  { 
    id: 't2', name: 'Trần Thị B', phone: '0912345678', roomId: '3', roomName: 'A103', 
    contractStart: '2023-12-01', contractEnd: '2024-05-31', deposit: 5000000, status: 'expiring', debt: 0,
    history: [
       { date: '2023-12-01', action: 'Check-in', detail: 'Ký hợp đồng 6 tháng', user: 'Manager' }
    ]
  },
  { 
    id: 't3', name: 'Lê Văn C', phone: '0987654321', roomId: '6', roomName: 'A203', 
    contractStart: '2024-02-15', contractEnd: '2024-08-15', deposit: 5000000, status: 'active', debt: 0 
  },
  { 
    id: 't4', name: 'Phạm Thị D', phone: '0999888777', roomId: '8', roomName: 'A302', 
    contractStart: '2023-11-20', contractEnd: '2024-05-20', deposit: 5000000, status: 'expiring', debt: 1200000 
  },
];

// Mock Invoice Data
const INITIAL_INVOICES: Invoice[] = [
    {
        id: 'inv1', roomName: 'A102', tenantName: 'Nguyễn Văn A', amount: 4200000, paidAmount: 3700000, status: 'partial', dueDate: '05/06/2024', agingDays: 0, month: '06/2024',
        items: [{ name: 'Tiền phòng', price: 3500000, total: 3500000 }, { name: 'Điện', quantity: 100, price: 3500, total: 350000, unit: 'kWh' }, { name: 'Nước', quantity: 5, price: 25000, total: 125000, unit: 'm3' }, { name: 'Dịch vụ', price: 225000, total: 225000 }],
        payments: [{ date: '01/06/2024', amount: 3700000, method: 'transfer' }]
    },
    {
        id: 'inv2', roomName: 'A302', tenantName: 'Phạm Thị D', amount: 5500000, paidAmount: 0, status: 'overdue', dueDate: '01/06/2024', agingDays: 5, month: '06/2024',
        items: [{ name: 'Tiền phòng', price: 5000000, total: 5000000 }, { name: 'Dịch vụ', price: 500000, total: 500000 }],
        reminders: [{ date: '02/06/2024', method: 'zalo', content: 'Chào bạn, phòng A302 đã quá hạn thanh toán...' }]
    },
    {
        id: 'inv3', roomName: 'A203', tenantName: 'Lê Văn C', amount: 3800000, paidAmount: 3800000, status: 'paid', dueDate: '05/06/2024', agingDays: 0, month: '06/2024',
        items: [{ name: 'Tổng hợp', price: 3800000, total: 3800000 }],
        payments: [{ date: '03/06/2024', amount: 3800000, method: 'transfer' }]
    }
];

// Mock Maintenance Tickets
const INITIAL_TICKETS: MaintenanceTicket[] = [
    {
        id: 'tk1', roomId: '3', roomName: 'A103', issueType: 'electric', description: 'Đèn phòng tắm bị chập chờn, có mùi khét nhẹ', priority: 'medium', status: 'open',
        createdAt: new Date().toISOString(), slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        logs: [{ date: '12/06/2024', action: 'created', user: 'System' }]
    },
    {
        id: 'tk2', roomId: '4', roomName: 'A201', issueType: 'water', description: 'Vỡ ống nước bồn rửa, nước tràn ra sàn', priority: 'high', status: 'in_progress',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), slaDeadline: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), assignee: 'Thợ Nước B',
        logs: [{ date: '10/06/2024', action: 'created', user: 'Tenant' }, { date: '11/06/2024', action: 'assigned', user: 'Manager' }]
    },
    {
        id: 'tk3', roomId: '6', roomName: 'A203', issueType: 'ac', description: 'Vệ sinh máy lạnh định kỳ', priority: 'low', status: 'done',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), slaDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), assignee: 'Thợ Điện A',
        logs: [{ date: '05/06/2024', action: 'created', user: 'System' }, { date: '07/06/2024', action: 'resolved', user: 'Thợ Điện A', note: 'Đã vệ sinh sạch sẽ' }]
    }
];

export const ModuleDetail: React.FC<ModuleDetailProps> = ({ module, onBack, onSubFunctionClick, onAskAI, onUpdateContext, pendingAction, onActionComplete }) => {
  // State Management
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);

  // Modals State
  const [roomModalState, setRoomModalState] = useState<{ isOpen: boolean; type: 'add-room' | 'checkin' | 'checkout' | 'ticket' | null; room?: Room | null }>({ isOpen: false, type: null, room: null });
  const [tenantModalState, setTenantModalState] = useState<{ isOpen: boolean; type: 'add-tenant' | 'renew-contract' | 'move-room' | null; tenant?: Tenant | null }>({ isOpen: false, type: null, tenant: null });
  const [billingModalState, setBillingModalState] = useState<{ isOpen: boolean; type: 'record-payment' | 'send-reminder' | 'utility-input' | 'generate-cycle' | null; invoice?: Invoice | null }>({ isOpen: false, type: null, invoice: null });
  const [ticketModalState, setTicketModalState] = useState<{ isOpen: boolean; type: 'create-ticket' | 'resolve-ticket' | null; ticket?: MaintenanceTicket | null; prefillRoom?: Room | null }>({ isOpen: false, type: null, ticket: null, prefillRoom: null });

  // Update Context for AI whenever data changes or module mounts
  useEffect(() => {
    if (onUpdateContext) {
      if (module.id === 'room-grid') onUpdateContext({ type: 'rooms', count: rooms.length, data: rooms });
      else if (module.id === 'tenant-mgmt') onUpdateContext({ type: 'tenants', count: tenants.length, data: tenants });
      else if (module.id === 'billing-ar') onUpdateContext({ type: 'invoices', count: invoices.length, overdue: invoices.filter(i => i.status === 'overdue').length, data: invoices });
      else if (module.id === 'maintenance-sl') onUpdateContext({ type: 'tickets', count: tickets.length, data: tickets });
    }
  }, [module.id, rooms, tenants, invoices, tickets]);

  // Handle Pending Actions from AI
  useEffect(() => {
    if (pendingAction) {
       console.log("Processing Pending Action:", pendingAction);
       if (pendingAction.type === 'modal') {
          if (pendingAction.payload.modalType === 'bulk-reminder') {
             // Mock opening bulk reminder
             alert("Mở modal Nhắc nợ hàng loạt (Từ AI)");
          }
       }
       if (onActionComplete) onActionComplete();
    }
  }, [pendingAction]);


  // --- Handlers for Rooms ---
  const handleRoomAction = (actionType: string, roomId?: string) => {
    if (actionType === 'add-room') {
       setRoomModalState({ isOpen: true, type: 'add-room', room: null });
       return;
    }
    if (!roomId) return;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    if (['checkin', 'checkout'].includes(actionType)) {
      setRoomModalState({ isOpen: true, type: actionType as any, room });
    } else if (actionType === 'ticket') {
       setTicketModalState({ isOpen: true, type: 'create-ticket', prefillRoom: room });
    } else {
      onSubFunctionClick({ id: actionType, name: actionType.toUpperCase(), icon: 'Activity', description: `Action triggered: ${actionType}` });
    }
  };

  const handleRoomModalSubmit = (data: any) => {
    const { type, room } = roomModalState;
    if (type === 'add-room') {
      const newRoom: Room = { id: Date.now().toString(), name: data.name || `P.${rooms.length + 1}`, type: data.type || 'Studio', price: data.price || 3000000, floor: data.floor || 1, status: 'empty', emptyDays: 0 };
      setRooms([...rooms, newRoom]);
    } else if (type === 'checkin' && room) {
      setRooms(rooms.map(r => r.id === room.id ? { ...r, status: 'occupied', occupiedSince: new Date().toISOString() } : r));
      setSelectedRoom(null);
    } else if (type === 'checkout' && room) {
      setRooms(rooms.map(r => r.id === room.id ? { ...r, status: 'empty', emptyDays: 0, debt: 0 } : r));
      setSelectedRoom(null);
    }
  };

  // --- Handlers for Tenants ---
  const handleTenantAction = (action: string, tenant: Tenant) => {
    if (['renew-contract', 'move-room'].includes(action)) {
       setTenantModalState({ isOpen: true, type: action as any, tenant });
    } else if (action === 'remind-debt') {
       alert(`Đã gửi tin nhắn nhắc nợ đến ${tenant.name} qua Zalo!`);
    } else if (action === 'ticket') {
       const room = rooms.find(r => r.id === tenant.roomId);
       setTicketModalState({ isOpen: true, type: 'create-ticket', prefillRoom: room });
    }
  };

  const handleTenantModalSubmit = (data: any) => {
    const { actionType, tenantId } = data;
    if (actionType === 'add-tenant') {
       const newTenant: Tenant = { id: Date.now().toString(), name: data.name, phone: data.phone, roomId: '', roomName: 'Chờ xếp', contractStart: '', contractEnd: '', deposit: 0, status: 'active', debt: 0 };
       setTenants([...tenants, newTenant]);
       alert("Đã thêm khách mới vào danh sách chờ.");
    } else if (actionType === 'renew-contract') {
       setTenants(tenants.map(t => t.id === tenantId ? { ...t, contractEnd: data.newEndDate, status: 'active' } : t));
       alert("Đã gia hạn hợp đồng thành công.");
    } else if (actionType === 'move-room') {
       setTenants(tenants.map(t => t.id === tenantId ? { ...t, roomId: 'new_id', roomName: data.newRoomId } : t));
       alert(`Đã chuyển khách sang phòng ${data.newRoomId}`);
    }
    setSelectedTenant(null);
  };

  // --- Handlers for Billing ---
  const handleBillingAction = (action: string, invoice: Invoice) => {
      setBillingModalState({ isOpen: true, type: action as any, invoice });
  };
  
  const handleBillingModalSubmit = (data: any) => {
      const { actionType, invoiceId } = data;
      if (actionType === 'record-payment') {
          setInvoices(invoices.map(inv => {
              if (inv.id === invoiceId) {
                  const newPaid = inv.paidAmount + data.amount;
                  const newStatus = newPaid >= inv.amount ? 'paid' : 'partial';
                  const newPayment = { date: new Date().toLocaleDateString('vi-VN'), amount: data.amount, method: data.method, note: data.note };
                  return { ...inv, paidAmount: newPaid, status: newStatus, payments: [...(inv.payments || []), newPayment as any] };
              }
              return inv;
          }));
      } else if (actionType === 'send-reminder') {
          // Mock reminder
      } else if (actionType === 'generate-cycle') {
          alert('Đã tạo thành công 12 hóa đơn cho tháng 06/2024');
      }
      setSelectedInvoice(null);
  };

  // --- Handlers for Maintenance ---
  const handleTicketAction = (action: string, ticket: MaintenanceTicket) => {
     if (action === 'resolve-ticket') {
        setTicketModalState({ isOpen: true, type: 'resolve-ticket', ticket });
     } else if (action === 'assign-me') {
        setTickets(tickets.map(t => t.id === ticket.id ? { ...t, status: 'in_progress', assignee: 'Tôi (Manager)', logs: [...(t.logs || []), { date: new Date().toLocaleDateString('vi-VN'), action: 'assigned', user: 'Tôi' }] } : t));
     }
  };

  const handleTicketModalSubmit = (data: any) => {
     const { actionType, ticketId } = data;
     if (actionType === 'create-ticket') {
        const priority = data.priority;
        const hours = priority === 'high' ? 24 : priority === 'medium' ? 48 : 72;
        const slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        
        const newTicket: MaintenanceTicket = {
            id: Date.now().toString(),
            roomId: data.roomId,
            roomName: data.roomName,
            issueType: data.issueType,
            description: data.description,
            priority: priority,
            status: 'open',
            createdAt: new Date().toISOString(),
            slaDeadline: slaDeadline,
            logs: [{ date: new Date().toLocaleDateString('vi-VN'), action: 'created', user: 'Manager' }]
        };
        setTickets([newTicket, ...tickets]);
        
        // Update Room status visually
        setRooms(rooms.map(r => r.id === data.roomId ? { ...r, hasMaintenanceIssue: true } : r));

     } else if (actionType === 'resolve-ticket') {
        setTickets(tickets.map(t => t.id === ticketId ? { 
            ...t, 
            status: 'done', 
            resolution: data.resolution, 
            cost: data.cost,
            logs: [...(t.logs || []), { date: new Date().toLocaleDateString('vi-VN'), action: 'resolved', user: 'Manager', note: data.resolution }] 
        } : t));
        
        // Clear room flag
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            setRooms(rooms.map(r => r.id === ticket.roomId ? { ...r, hasMaintenanceIssue: false } : r));
        }
     }
     setSelectedTicket(null); // Close drawer
  };


  const isRoomGrid = module.id === 'room-grid';
  const isTenantMgmt = module.id === 'tenant-mgmt';
  const isBilling = module.id === 'billing-ar';
  const isMaintenance = module.id === 'maintenance-sl';
  const isSettings = module.id === 'admin-settings';
  const isCEOCommand = module.id === 'ceo-command';

  // Handler for navigation from CEO Board to other modules
  const handleNavigate = (moduleId: string) => {
     // This would typically communicate back to App to change module
     // For MVP integration within ModuleDetail, we simulate switching only if possible or alert
     alert(`Chuyển đến module: ${moduleId}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 h-[calc(100vh-140px)] flex flex-col">
      {/* Dynamic Module Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center space-x-6">
          <button 
            onClick={onBack}
            className="p-4 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 shadow-sm active:scale-95 group"
          >
            <Icon name="ArrowRight" className="w-5 h-5 text-slate-400 rotate-180 group-hover:text-blue-600 transition-colors" />
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black text-white uppercase tracking-[0.2em] bg-${module.color}-600`}>
                Core Ops
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{module.title}</h1>
            </div>
            <p className="text-sm font-bold text-slate-400 italic uppercase tracking-wider">{module.description}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onAskAI(`Tôi đang ở module ${module.title}. Hãy phân tích dữ liệu hiện tại để tối ưu vận hành.`, isTenantMgmt ? tenants : isBilling ? invoices : isMaintenance ? tickets : rooms)}
          className="flex items-center space-x-3 px-8 py-4 bg-indigo-50 text-indigo-700 font-black rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-200 shadow-sm shadow-indigo-100 uppercase text-[10px] tracking-widest group"
        >
          <Icon name="Sparkles" className="w-5 h-5 group-hover:animate-spin" />
          <span>Hỏi AI về {module.title}</span>
        </button>
      </div>

      {/* Main Content Area Switcher */}
      <div className="flex-1 overflow-y-auto">
        {isRoomGrid ? (
          <RoomGrid 
            rooms={rooms} 
            onRoomClick={setSelectedRoom} 
            onQuickAction={(action) => handleRoomAction(action)} 
            onAddRoom={() => handleRoomAction('add-room')}
          />
        ) : isTenantMgmt ? (
          <TenantList 
            tenants={tenants}
            onSelectTenant={setSelectedTenant}
            onAction={handleTenantAction}
            onAddTenant={() => setTenantModalState({ isOpen: true, type: 'add-tenant', tenant: null })}
          />
        ) : isBilling ? (
          <BillingBoard 
            invoices={invoices}
            onSelectInvoice={setSelectedInvoice}
            onAction={handleBillingAction}
            onGenerateCycle={() => setBillingModalState({ isOpen: true, type: 'generate-cycle', invoice: null })}
          />
        ) : isMaintenance ? (
          <MaintenanceBoard 
            tickets={tickets}
            onSelectTicket={setSelectedTicket}
            onAction={handleTicketAction}
            onCreateTicket={() => setTicketModalState({ isOpen: true, type: 'create-ticket', prefillRoom: null })}
          />
        ) : isSettings ? (
          <SettingsBoard />
        ) : isCEOCommand ? (
          <CEOCommandBoard onAskAI={onAskAI} onNavigateToModule={handleNavigate} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {module.subFunctions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => onSubFunctionClick(sub)}
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-50 transition-all cursor-pointer hover:border-blue-200 relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all">
                   <Icon name={sub.icon} className="w-32 h-32 text-blue-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 bg-${module.color}-50 text-${module.color}-600 rounded-2xl group-hover:bg-${module.color}-600 group-hover:text-white transition-all duration-300 shadow-sm`}>
                      <Icon name={sub.icon} className="w-6 h-6" />
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ArrowRight" className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-2 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
                    {sub.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlays / Drawers */}
      <RoomDetailDrawer 
        room={selectedRoom} 
        onClose={() => setSelectedRoom(null)} 
        onAction={handleRoomAction} 
      />

      <TenantProfileDrawer 
        tenant={selectedTenant}
        onClose={() => setSelectedTenant(null)}
        onAction={handleTenantAction}
      />

      <InvoiceDetailDrawer 
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        onAction={handleBillingAction}
      />

      <TicketDetailDrawer 
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAction={handleTicketAction}
      />

      {/* Modals */}
      <RoomActionModal 
        isOpen={roomModalState.isOpen}
        type={roomModalState.type}
        room={roomModalState.room}
        onClose={() => setRoomModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleRoomModalSubmit}
      />

      <TenantActionModal 
        isOpen={tenantModalState.isOpen}
        type={tenantModalState.type}
        tenant={tenantModalState.tenant}
        onClose={() => setTenantModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleTenantModalSubmit}
      />

      <BillingActionModal 
        isOpen={billingModalState.isOpen}
        type={billingModalState.type}
        invoice={billingModalState.invoice}
        onClose={() => setBillingModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleBillingModalSubmit}
      />

      <TicketActionModal 
        isOpen={ticketModalState.isOpen}
        type={ticketModalState.type}
        ticket={ticketModalState.ticket}
        prefillRoom={ticketModalState.prefillRoom}
        onClose={() => setTicketModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleTicketModalSubmit}
      />
    </div>
  );
};
