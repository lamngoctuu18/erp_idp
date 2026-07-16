/**
 * TÀI KHOẢN MẪU — DÙNG TẠM ĐỂ ĐĂNG NHẬP KHI CHƯA CÓ BACKEND.
 *
 * Toàn bộ luồng đăng nhập ở `_login.tsx` đang bỏ qua API và đối chiếu trực tiếp
 * với danh sách bên dưới. Khi backend sẵn sàng, xem hướng dẫn khôi phục luồng
 * thật ở đầu hàm `handleLogin` trong `_login.tsx`, rồi xoá thư mục này.
 */

export interface DemoAccount {
  username: string;
  password: string;
  fullName: string;
  role: string;
  /** Mô tả ngắn hiển thị trên trang đăng nhập. */
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    username: "admin",
    password: "admin123",
    fullName: "Nguyễn Quản Trị",
    role: "Quản trị hệ thống",
    description: "Toàn quyền mọi phân hệ",
  },
  {
    username: "ketoan",
    password: "ketoan123",
    fullName: "Trần Kế Toán",
    role: "Kế toán",
    description: "Công nợ phải thu, Tài sản cố định",
  },
  {
    username: "thukho",
    password: "thukho123",
    fullName: "Lê Thủ Kho",
    role: "Thủ kho",
    description: "Quản lý Kho & Vật tư",
  },
];

export const findDemoAccount = (
  username: string,
  password: string
): DemoAccount | undefined =>
  DEMO_ACCOUNTS.find(
    (acc) =>
      acc.username.toLowerCase() === username.trim().toLowerCase() &&
      acc.password === password
  );

/**
 * Sinh token giả để `routes.tsx` (loader kiểm tra localStorage "token") cho qua.
 * Đây KHÔNG phải JWT hợp lệ — chỉ là chuỗi đánh dấu phiên demo.
 */
export const createDemoToken = (account: DemoAccount): string =>
  `demo-token.${account.username}.${Date.now()}`;

export const buildDemoProfile = (account: DemoAccount) => ({
  userName: account.username,
  fullName: account.fullName,
  role: account.role,
  isDemo: true,
});
