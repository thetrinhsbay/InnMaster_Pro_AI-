
import { MainModule } from './types';

export const MODULES: MainModule[] = [
  {
    id: 'ops-mgmt',
    title: 'Quản trị Vận hành',
    icon: 'Home',
    color: 'blue',
    description: 'Kiểm soát 80% công việc: Trạng thái phòng, Khách thuê và Hợp đồng.',
    subFunctions: [
      { id: 'o1', name: 'Sơ đồ phòng thực tế', icon: 'List', description: 'Trạng thái Trống/Ở/Cọc theo thời gian thực.' },
      { id: 'o2', name: 'Hồ sơ & Hợp đồng', icon: 'UserCheck', description: 'Lưu trữ thông tin khách và ký hợp đồng số nhanh.' },
      { id: 'o3', name: 'Thủ tục Check-out', icon: 'Download', description: 'Tất toán tiền cọc và thanh lý hợp đồng chuẩn xác.' },
      { id: 'o4', name: 'Nhật ký vận hành', icon: 'History', description: 'Lịch sử thay đổi và các ghi chú quan trọng.' },
    ]
  },
  {
    id: 'finance-mgmt',
    title: 'Doanh thu & Dòng tiền',
    icon: 'Receipt',
    color: 'emerald',
    description: 'Trái tim của hệ thống: Chốt điện nước, hóa đơn và thu tiền.',
    subFunctions: [
      { id: 'f1', name: 'Chốt số Điện/Nước', icon: 'Zap', description: 'Ghi chỉ số nhanh và tự động tính toán theo biểu giá.' },
      { id: 'f2', name: 'Xuất hóa đơn tháng', icon: 'FileText', description: 'Tự động tổng hợp tiền phòng, dịch vụ và gửi hóa đơn.' },
      { id: 'f3', name: 'Đối soát Thu tiền', icon: 'CheckCircle', description: 'Xác nhận thanh toán và khớp lệnh chuyển khoản.' },
      { id: 'f4', name: 'Cảnh báo Công nợ', icon: 'AlertTriangle', description: 'Danh sách các phòng chưa đóng tiền và nợ xấu.' },
    ]
  },
  {
    id: 'ai-strategy',
    title: 'Trợ lý Chiến lược AI',
    icon: 'Sparkles',
    color: 'indigo',
    description: 'Phân tích dữ liệu chuyên sâu để tăng ROI và scale chuỗi.',
    subFunctions: [
      { id: 'a1', name: 'Báo cáo Lợi nhuận P&L', icon: 'BarChart3', description: 'Báo cáo Doanh thu - Chi phí thực tế hàng tháng.' },
      { id: 'a2', name: 'Phân tích 80/20', icon: 'Activity', description: 'AI xác định các nguồn thu chính và điểm gây thất thoát.' },
      { id: 'a3', name: 'Dự báo tỷ lệ trống', icon: 'PieChart', description: 'Cảnh báo sớm phòng sắp trống để đẩy mạnh marketing.' },
      { id: 'a4', name: 'Tư vấn mở rộng', icon: 'TrendingUp', description: 'Dựa trên dòng tiền hiện tại để tư vấn đầu tư thêm cơ sở.' },
    ]
  }
];
