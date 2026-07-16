/**
 * AR Status Enums and Metadata
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
  OPEN = 'OPEN',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
  VOIDED = 'VOIDED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export const InvoiceStatusMeta: Record<InvoiceStatus, { label: string; color: string }> = {
  [InvoiceStatus.DRAFT]: { label: 'Bản nháp', color: 'gray' },
  [InvoiceStatus.INCOMPLETE]: { label: 'Chưa hoàn tất', color: 'yellow' },
  [InvoiceStatus.COMPLETE]: { label: 'Hoàn tất', color: 'teal' },
  [InvoiceStatus.OPEN]: { label: 'Đang mở', color: 'blue' },
  [InvoiceStatus.PARTIALLY_PAID]: { label: 'Thanh toán một phần', color: 'orange' },
  [InvoiceStatus.PAID]: { label: 'Đã thanh toán', color: 'green' },
  [InvoiceStatus.CLOSED]: { label: 'Đã đóng', color: 'dark' },
  [InvoiceStatus.VOIDED]: { label: 'Vô hiệu', color: 'red' },
  [InvoiceStatus.CANCELLED]: { label: 'Đã hủy', color: 'red' },
  [InvoiceStatus.OVERDUE]: { label: 'Quá hạn', color: 'red' },
};

export enum ReceiptStatus {
  DRAFT = 'DRAFT',
  UNIDENTIFIED = 'UNIDENTIFIED',
  UNAPPLIED = 'UNAPPLIED',
  PARTIALLY_APPLIED = 'PARTIALLY_APPLIED',
  APPLIED = 'APPLIED',
  ON_ACCOUNT = 'ON_ACCOUNT',
  CLEARED = 'CLEARED',
  REVERSED = 'REVERSED'
}

export const ReceiptStatusMeta: Record<ReceiptStatus, { label: string; color: string }> = {
  [ReceiptStatus.DRAFT]: { label: 'Bản nháp', color: 'gray' },
  [ReceiptStatus.UNIDENTIFIED]: { label: 'Chưa xác định KH', color: 'orange' },
  [ReceiptStatus.UNAPPLIED]: { label: 'Chưa phân bổ', color: 'yellow' },
  [ReceiptStatus.PARTIALLY_APPLIED]: { label: 'Phân bổ một phần', color: 'blue' },
  [ReceiptStatus.APPLIED]: { label: 'Đã phân bổ hết', color: 'green' },
  [ReceiptStatus.ON_ACCOUNT]: { label: 'Tạm thu (On Account)', color: 'teal' },
  [ReceiptStatus.CLEARED]: { label: 'Đã thanh toán (Cleared)', color: 'dark' },
  [ReceiptStatus.REVERSED]: { label: 'Đã hoàn trả (Reversed)', color: 'red' },
};

export enum AccountingStatus {
  UNACCOUNTED = 'UNACCOUNTED',
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  TRANSFERRED = 'TRANSFERRED',
  POSTED = 'POSTED',
  ERROR = 'ERROR'
}

export const AccountingStatusMeta: Record<AccountingStatus, { label: string; color: string }> = {
  [AccountingStatus.UNACCOUNTED]: { label: 'Chưa hạch toán', color: 'gray' },
  [AccountingStatus.DRAFT]: { label: 'Hạch toán nháp', color: 'yellow' },
  [AccountingStatus.FINAL]: { label: 'Hạch toán chính thức', color: 'teal' },
  [AccountingStatus.TRANSFERRED]: { label: 'Đã đẩy sang GL', color: 'blue' },
  [AccountingStatus.POSTED]: { label: 'Đã sổ ghi sổ GL', color: 'green' },
  [AccountingStatus.ERROR]: { label: 'Lỗi hạch toán', color: 'red' },
};

export enum AdjustmentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACCOUNTED = 'ACCOUNTED',
  REVERSED = 'REVERSED'
}

export const AdjustmentStatusMeta: Record<AdjustmentStatus, { label: string; color: string }> = {
  [AdjustmentStatus.DRAFT]: { label: 'Nháp', color: 'gray' },
  [AdjustmentStatus.PENDING_APPROVAL]: { label: 'Chờ duyệt', color: 'yellow' },
  [AdjustmentStatus.APPROVED]: { label: 'Đã duyệt', color: 'green' },
  [AdjustmentStatus.REJECTED]: { label: 'Từ chối', color: 'red' },
  [AdjustmentStatus.ACCOUNTED]: { label: 'Đã hạch toán', color: 'teal' },
  [AdjustmentStatus.REVERSED]: { label: 'Đã hoàn đảo', color: 'orange' },
};

export enum AutoInvoiceStatus {
  NEW = 'NEW',
  VALIDATING = 'VALIDATING',
  VALID = 'VALID',
  ERROR = 'ERROR',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  RETRYING = 'RETRYING'
}

export const AutoInvoiceStatusMeta: Record<AutoInvoiceStatus, { label: string; color: string }> = {
  [AutoInvoiceStatus.NEW]: { label: 'Mới nhận', color: 'gray' },
  [AutoInvoiceStatus.VALIDATING]: { label: 'Đang kiểm tra', color: 'yellow' },
  [AutoInvoiceStatus.VALID]: { label: 'Hợp lệ', color: 'blue' },
  [AutoInvoiceStatus.ERROR]: { label: 'Lỗi kiểm tra', color: 'red' },
  [AutoInvoiceStatus.PROCESSING]: { label: 'Đang xử lý', color: 'orange' },
  [AutoInvoiceStatus.PROCESSED]: { label: 'Đã chuyển thành HĐ', color: 'green' },
  [AutoInvoiceStatus.RETRYING]: { label: 'Đang chạy lại', color: 'teal' },
};

export enum NettingBatchStatus {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  REVIEWED = 'REVIEWED',
  SUBMITTED = 'SUBMITTED',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED'
}

export const NettingBatchStatusMeta: Record<NettingBatchStatus, { label: string; color: string }> = {
  [NettingBatchStatus.DRAFT]: { label: 'Nháp', color: 'gray' },
  [NettingBatchStatus.CALCULATED]: { label: 'Đã tính toán', color: 'yellow' },
  [NettingBatchStatus.REVIEWED]: { label: 'Đã duyệt', color: 'blue' },
  [NettingBatchStatus.SUBMITTED]: { label: 'Đã gửi duyệt', color: 'orange' },
  [NettingBatchStatus.COMPLETE]: { label: 'Hoàn tất', color: 'green' },
  [NettingBatchStatus.ERROR]: { label: 'Lỗi xử lý', color: 'red' },
  [NettingBatchStatus.CANCELLED]: { label: 'Đã hủy', color: 'dark' },
};
