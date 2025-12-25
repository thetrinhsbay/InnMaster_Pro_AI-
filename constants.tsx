
import { MainModule } from './types';

export const MODULES: MainModule[] = [
  {
    id: 'ceo-command',
    title: 'CEO Command Center',
    icon: 'Activity', // Hoặc 'LayoutGrid' nếu có, tạm dùng Activity biểu thị sự điều hành
    color: 'indigo',
    description: 'Trung tâm điều hành hợp nhất: KPI, Chiến lược AI và Chính sách vận hành.',
    subFunctions: [
      { id: 'c1', name: 'AI Strategy Brief', icon: 'Sparkles', description: 'Đề xuất chiến lược 80/20 hàng ngày.' },
      { id: 'c2', name: 'KPI Monitor', icon: 'BarChart3', description: 'Theo dõi chỉ số sống còn toàn chuỗi.' },
      { id: 'c3', name: 'Workboard Ưu tiên', icon: 'List', description: 'Top việc cần xử lý ngay (Nợ/Trống/Sự cố).' },
      { id: 'c4', name: 'Policy Switchboard', icon: 'Shield', description: 'Bật/tắt chính sách vận hành & tự động hóa.' },
      { id: 'c5', name: 'Executive Report', icon: 'FileText', description: 'Báo cáo cô đọng 1 trang cho chủ đầu tư.' },
      { id: 'c6', name: 'Playbooks', icon: 'Zap', description: 'Kịch bản hành động mẫu (Tăng lấp đầy, Giảm nợ).' },
    ]
  },
  {
    id: 'room-grid',
    title: 'Sơ đồ Phòng (Ops)',
    icon: 'Home',
    color: 'blue',
    description: 'Quản lý trạng thái hiện trường: Trống, Đang ở, Đã cọc, Bảo trì.',
    subFunctions: [
      { id: 'r1', name: 'Sơ đồ lưới (Grid)', icon: 'List', description: 'Xem nhanh trạng thái toàn bộ phòng theo tầng.' },
      { id: 'r2', name: 'Check-in nhanh', icon: 'UserPlus', description: 'Quy trình tạo khách và hợp đồng 2 bước.' },
      { id: 'r3', name: 'Check-out & Tất toán', icon: 'Download', description: 'Chốt công nợ và trả cọc khi khách rời đi.' },
      { id: 'r4', name: 'Đặt cọc giữ chỗ', icon: 'Shield', description: 'Quản lý khách đặt cọc nhưng chưa dọn vào.' },
      { id: 'r5', name: 'Cấu hình Giá phòng', icon: 'DollarSign', description: 'Thiết lập đơn giá và các dịch vụ mặc định.' },
      { id: 'r6', name: 'Kiểm kê Tài sản', icon: 'Package', description: 'Danh mục nội thất từng phòng và khấu hao.' },
    ]
  },
  {
    id: 'tenant-mgmt',
    title: 'Khách & Hợp đồng',
    icon: 'Users',
    color: 'emerald',
    description: 'Quản lý hồ sơ cư dân, hợp đồng số và nhắc gia hạn.',
    subFunctions: [
      { id: 't1', name: 'Hồ sơ cư dân', icon: 'UserCheck', description: 'Thông tin định danh, CCCD và lịch sử ở.' },
      { id: 't2', name: 'Quản lý Hợp đồng', icon: 'FileText', description: 'Theo dõi thời hạn và các điều khoản ký kết.' },
      { id: 't3', name: 'Nhắc gia hạn', icon: 'Clock', description: 'Tự động lọc khách sắp hết hạn hợp đồng.' },
      { id: 't4', name: 'Khai báo tạm trú', icon: 'Shield', description: 'Dữ liệu phục vụ báo cáo chính quyền.' },
      { id: 't5', name: 'Đánh giá khách thuê', icon: 'Star', description: 'Ghi chú về ý thức ở và kỷ luật thanh toán.' },
      { id: 't6', name: 'Tìm kiếm nhanh', icon: 'Search', description: 'Truy xuất hồ sơ theo tên hoặc số điện thoại.' },
    ]
  },
  {
    id: 'billing-ar',
    title: 'Thu tiền & Công nợ',
    icon: 'Receipt',
    color: 'amber',
    description: 'Chốt điện nước, xuất hóa đơn và đối soát dòng tiền thực tế.',
    subFunctions: [
      { id: 'b1', name: 'Chốt Điện/Nước', icon: 'Zap', description: 'Nhập chỉ số và tự động tính tiền theo bậc thang.' },
      { id: 'b2', name: 'Hóa đơn hàng tháng', icon: 'FileText', description: 'Tổng hợp tiền phòng + dịch vụ thành hóa đơn.' },
      { id: 'b3', name: 'Xác nhận Thu tiền', icon: 'CheckCircle', description: 'Ghi nhận thanh toán mặt/chuyển khoản.' },
      { id: 'b4', name: 'Công nợ (AR Aging)', icon: 'Briefcase', description: 'Phân tích nợ theo thời gian: 7 ngày, 30 ngày.' },
      { id: 'b5', name: 'Nhắc nợ tự động', icon: 'Send', description: 'Gửi mẫu thông báo qua Zalo/SMS nhanh.' },
      { id: 'b6', name: 'Chi phí tòa nhà', icon: 'TrendingDown', description: 'Quản lý các khoản chi vận hành (sửa chữa, thuế).' },
    ]
  },
  {
    id: 'maintenance-sl',
    title: 'Bảo trì & Sự cố',
    icon: 'Wrench',
    color: 'rose',
    description: 'Xử lý phản ánh từ khách thuê và quản lý SLA bảo trì.',
    subFunctions: [
      { id: 'm1', name: 'Tiếp nhận Ticket', icon: 'Inbox', description: 'Yêu cầu sửa chữa kèm ảnh từ khách thuê.' },
      { id: 'm2', name: 'Phân công kỹ thuật', icon: 'UserPlus', description: 'Giao việc cho thợ và theo dõi tiến độ.' },
      { id: 'm3', name: 'Giám sát SLA', icon: 'Clock', description: 'Cảnh báo các yêu cầu xử lý quá hạn.' },
      { id: 'm4', name: 'Kho vật tư thay thế', icon: 'Package', description: 'Quản lý bóng đèn, vòi nước, thiết bị dự phòng.' },
      { id: 'm5', name: 'Lịch bảo trì định kỳ', icon: 'Calendar', description: 'Kiểm tra máy lạnh, PCCC, bể nước định kỳ.' },
      { id: 'm6', name: 'Khảo sát hài lòng', icon: 'Star', description: 'Ghi nhận phản hồi khách sau khi xử lý xong.' },
    ]
  },
  {
    id: 'admin-settings',
    title: 'Cài đặt & Admin',
    icon: 'Settings',
    color: 'slate',
    description: 'Cấu hình hệ thống, phân quyền nhân sự và mẫu tin nhắn.',
    subFunctions: [
      { id: 's1', name: 'Hồ sơ & Tùy chọn', icon: 'UserCheck', description: 'Thông tin tài khoản, ngôn ngữ, múi giờ.' },
      { id: 's2', name: 'Cơ sở & Khu', icon: 'Home', description: 'Quản lý danh sách chi nhánh và cấu trúc phòng.' },
      { id: 's3', name: 'Nhân sự & Phân quyền', icon: 'Users', description: 'Cấp quyền Owner, Manager, Accountant.' },
      { id: 's4', name: 'Mẫu tin nhắc', icon: 'Send', description: 'Soạn thảo kịch bản Zalo/SMS tự động.' },
      { id: 's5', name: 'Lịch sử hệ thống', icon: 'History', description: 'Audit log mọi thao tác quan trọng.' },
      { id: 's6', name: 'Tích hợp mở rộng', icon: 'Layers', description: 'API Keys, Zalo OA, Ngân hàng.' },
    ]
  },
];
