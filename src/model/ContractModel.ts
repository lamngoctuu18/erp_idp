/**
 * Model phân hệ Quản lý Hợp đồng (Nhà cung cấp).
 *
 * Vòng đời hợp đồng đi qua 4 giai đoạn (khớp 4 tab trên giao diện):
 *   draft ─▶ in_negotiation ─▶ pending_approval ─▶ active ─▶ closed
 *
 * Dữ liệu được lưu tạm trong localStorage qua `contractMockService.ts`
 * (theo đúng khuôn mock service của phân hệ AP).
 */

// ─────────────────────────────────────────────────────────────────────────
// ENUM / LITERAL TYPES
// ─────────────────────────────────────────────────────────────────────────

/** Trạng thái tổng của hợp đồng. */
export type ContractStatus =
  | "draft" // Nháp
  | "in_negotiation" // Đang đàm phán
  | "pending_approval" // Chờ phê duyệt
  | "active" // Đang hoạt động
  | "closed"; // Đã đóng

/** Nguồn tạo hợp đồng. */
export type ContractSource = "manual" | "from_po" | "from_quote";

/** Trạng thái một điều khoản trong quá trình đàm phán. */
export type TermNegotiationStatus =
  | "pending" // Chờ phản hồi
  | "accepted" // Đã đồng ý / chốt
  | "revising" // Đang đề xuất sửa
  | "rejected"; // Bị từ chối

/** Loại người gửi trong lịch sử đàm phán. */
export type NegotiationSenderType = "buyer" | "supplier" | "system";

/** Trạng thái một bước phê duyệt. */
export type ApprovalStepStatus = "pending" | "approved" | "rejected";

/** Trạng thái chữ ký số. */
export type SignatureStatus = "pending" | "signed";

/** Trạng thái xuất bản catalog. */
export type CatalogStatus = "not_published" | "pending" | "published";

/** Trạng thái một dòng sản phẩm/dịch vụ trong catalog. */
export type CatalogItemStatus = "pending" | "approved" | "inactive";

// ─────────────────────────────────────────────────────────────────────────
// NHÃN HIỂN THỊ (tiếng Việt) — dùng chung cho badge, tiêu đề...
// ─────────────────────────────────────────────────────────────────────────

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  draft: "Nháp",
  in_negotiation: "Đang đàm phán",
  pending_approval: "Chờ phê duyệt",
  active: "Đang hoạt động",
  closed: "Đã đóng",
};

export const CONTRACT_STATUS_COLOR: Record<ContractStatus, string> = {
  draft: "gray",
  in_negotiation: "blue",
  pending_approval: "yellow",
  active: "green",
  closed: "red",
};

export const CONTRACT_SOURCE_LABEL: Record<ContractSource, string> = {
  manual: "Thủ công",
  from_po: "Từ PO",
  from_quote: "Từ Báo giá",
};

export const TERM_STATUS_LABEL: Record<TermNegotiationStatus, string> = {
  pending: "Chờ phản hồi",
  accepted: "Đã đồng ý",
  revising: "Đang đề xuất sửa",
  rejected: "Bị từ chối",
};

// ─────────────────────────────────────────────────────────────────────────
// ENTITIES
// ─────────────────────────────────────────────────────────────────────────

/** Một điều khoản trong thư viện điều khoản mẫu (tái sử dụng khi tạo HĐ). */
export interface TermLibraryItem {
  termCode: string; // Mã điều khoản, vd "PAYMENT"
  title: string; // Tên hiển thị, vd "Điều khoản thanh toán"
  content: string; // Nội dung mẫu
}

/** Điều khoản đã gắn vào 1 hợp đồng (có phiên bản để phục vụ đàm phán). */
export interface ContractTerm {
  termId: number;
  contractId: number;
  code: string; // vd "HDPE-4/2026"
  title: string;
  originalContent: string; // Phiên bản gốc
  currentContent: string; // Đề xuất hiện tại (có thể khác gốc)
  version: number; // Số phiên bản, bắt đầu từ 1
  status: TermNegotiationStatus;
}

/** Một dòng trong lịch sử đàm phán (chat / sự kiện hệ thống). */
export interface NegotiationMessage {
  messageId: number;
  contractId: number;
  senderType: NegotiationSenderType;
  content: string;
  createdAt: string; // ISO
}

/** Một bước / người trong quy trình phê duyệt. */
export interface ApprovalStep {
  stepId: number;
  contractId: number;
  approverName: string;
  role: string;
  level: number;
  status: ApprovalStepStatus;
  approvedAt?: string | null;
}

/** Chữ ký số của 1 bên (Buyer / Supplier). */
export interface ContractSignature {
  signatureId: number;
  contractId: number;
  party: "buyer" | "supplier";
  signerName?: string | null;
  signerTitle?: string | null;
  status: SignatureStatus;
  signedAt?: string | null;
}

/** Một sản phẩm/dịch vụ được liên kết trong catalog của hợp đồng. */
export interface CatalogItem {
  itemId: number;
  contractId: number;
  productCode: string;
  productName: string;
  category?: string;
  unitPrice: number;
  unit?: string;
  status: CatalogItemStatus;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
}

/** Nhật ký hành động (audit) trên hợp đồng. */
export interface ContractActionLog {
  logId: number;
  contractId: number;
  actionCode: string; // vd "submit_contract", "close_negotiation"
  actorName: string;
  fromStatus?: ContractStatus | null;
  toStatus?: ContractStatus | null;
  note?: string;
  createdAt: string;
}

/** Hợp đồng — bản ghi tổng. */
export interface Contract {
  contractId: number;
  contractCode: string; // vd "HD-20260421174310"
  refCode?: string | null; // Mã tham chiếu nội bộ, vd "HDPE-2026"
  name: string; // Tên hợp đồng
  contractType?: string; // Loại hợp đồng
  description?: string;
  source: ContractSource;
  status: ContractStatus;

  // Thông tin nhà cung cấp
  supplierName: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierAddress?: string;

  // Chi tiết
  effectiveDate?: string | null;
  expiryDate?: string | null;
  currency: string; // vd "VND"
  value: number; // Giá trị hợp đồng

  // Catalog & ký kết
  catalogStatus: CatalogStatus;
  catalogName?: string;
  catalogScope?: string;
  catalogType?: string;
  catalogDescription?: string;
  signed: boolean;

  createdAt: string;
  updatedAt: string;
}

/** Trạng thái được phép chuyển tiếp — phục vụ khóa/mở tab & hành động. */
export const CONTRACT_NEXT_STATUS: Record<ContractStatus, ContractStatus | null> = {
  draft: "in_negotiation",
  in_negotiation: "pending_approval",
  pending_approval: "active",
  active: "closed",
  closed: null,
};
