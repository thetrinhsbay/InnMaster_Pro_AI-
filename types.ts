
export interface SubFunction {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface MainModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  subFunctions: SubFunction[];
}

export interface Room {
  id: string;
  name: string;
  type: string;
  status: 'empty' | 'occupied' | 'maintenance' | 'reserved';
  price: number;
  floor: number;
  area?: number;
  debt?: number;
  hasMaintenanceIssue?: boolean;
  emptyDays?: number;
  occupiedSince?: string;
  lastReading?: {
    electricity: number;
    water: number;
    date: string;
  };
}

export interface TenantHistoryLog {
  date: string;
  action: string;
  detail: string;
  user: string;
}

export interface TenantPayment {
  id: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  date?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  roomId: string;
  roomName: string;
  idCard?: string;
  contractStart: string;
  contractEnd: string;
  deposit: number;
  status: 'active' | 'expiring' | 'ended';
  debt: number;
  riskTags?: string[]; // 'late_payment', 'noisy', etc.
  paymentHistory?: TenantPayment[];
  history?: TenantHistoryLog[];
  contractCycle?: number; // months
}

export interface InvoiceItem {
  name: string;
  quantity?: number;
  price: number;
  total: number;
  unit?: string;
}

export interface PaymentRecord {
  date: string;
  amount: number;
  method: 'cash' | 'transfer';
  note?: string;
}

export interface ReminderLog {
  date: string;
  method: 'zalo' | 'sms' | 'manual';
  content: string;
}

export interface Invoice {
  id: string;
  roomName: string;
  tenantName: string;
  tenantPhone?: string;
  amount: number; // Tổng phải thu
  paidAmount: number; // Đã thu
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  dueDate: string;
  agingDays: number; // Số ngày quá hạn
  items?: InvoiceItem[]; // Chi tiết: Tiền phòng, điện, nước...
  payments?: PaymentRecord[];
  reminders?: ReminderLog[];
  month: string; // MM/YYYY
}

export interface TicketLog {
  date: string;
  action: string; // 'created', 'assigned', 'status_change', 'resolved'
  user: string;
  note?: string;
}

export interface MaintenanceTicket {
  id: string;
  roomId: string;
  roomName: string;
  issueType: 'electric' | 'water' | 'ac' | 'internet' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'done' | 'cancelled';
  createdAt: string;
  slaDeadline: string; // ISO date string
  assignee?: string; // Name of staff
  images?: string[];
  logs?: TicketLog[];
  resolution?: string; // Ghi chú khi đóng ticket
  cost?: number; // Chi phí sửa chữa
}

// AI Specific Types
export interface AIAction {
  label: string;
  type: 'navigate' | 'filter' | 'modal' | 'copy';
  payload: any;
  icon?: string;
}

export interface AISmartResponse {
  summary: string; // Decision line
  details: string[]; // 3 bullets
  actions: AIAction[]; // Next actions
  rawText?: string; // Fallback
}
