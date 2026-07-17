/** Tiện ích dùng chung trong phân hệ Hợp đồng. */
import { Contract, ContractStatus } from "../../../model/ContractModel";

/** Định dạng ngày kiểu 21/4/2026 (khớp giao diện mẫu). */
export const formatDateVi = (d?: string | null): string => {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "-";
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

/** Định dạng giờ:phút:giây ngày/tháng/năm cho lịch sử. */
export const formatDateTimeVi = (d?: string | null): string => {
  if (!d) return "-";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "-";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

/** Định dạng tiền tệ có hậu tố đơn vị. */
export const formatMoney = (value: number, currency = "VND"): string =>
  `${(value ?? 0).toLocaleString("vi-VN")} ${currency}`;

/** Chuyển value input date (yyyy-mm-dd) an toàn về string ISO ngày. */
export const toDateInputValue = (d?: string | null): string => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
};

/**
 * Thứ tự giai đoạn — dùng để biết 1 hợp đồng đã "đi qua" tab nào chưa
 * (khóa tab chưa tới giai đoạn tương ứng).
 */
export const STAGE_ORDER: ContractStatus[] = [
  "draft",
  "in_negotiation",
  "pending_approval",
  "active",
  "closed",
];

export const stageIndex = (status: ContractStatus): number => STAGE_ORDER.indexOf(status);

/** Hợp đồng đã đạt tối thiểu giai đoạn `min` chưa. */
export const hasReached = (contract: Contract | null, min: ContractStatus): boolean =>
  !!contract && stageIndex(contract.status) >= stageIndex(min);
