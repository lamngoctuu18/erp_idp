/**
 * Model phân hệ Tài sản cố định (Fixed Assets - FA).
 *
 * Ánh xạ theo tài liệu nghiệp vụ Oracle EBS R12 (Assets Workbench):
 * Asset -> Book (thông tin tài chính) -> Assignment (phân bổ sử dụng)
 * -> Depreciation / Retirement -> Create Accounting -> GL.
 */

/** Loại tài sản (Asset Type) */
export type AssetType = "CAPITALIZED" | "CIP" | "GROUP";

/** Trạng thái vòng đời tài sản */
export type AssetStatus = "Active" | "CIP" | "Retired" | "Draft";

/**
 * Hồ sơ tài sản cố định — gộp thông tin nhận diện + Book (tài chính).
 * Trong bản mẫu này 1 tài sản gắn 1 Book (Corporate) để đơn giản hóa.
 */
export interface FaAsset {
  assetId: number;
  assetNumber: string; // Mã tài sản (tự sinh khi chọn Category)
  tagNumber?: string; // Số thẻ TS
  serialNumber?: string;
  description: string; // Tên TSCĐ
  categoryCode: string; // Mã nhóm (VD: 102)
  category: string; // Nhãn nhóm (VD: "102 - Máy móc thiết bị")
  assetKey?: string;
  assetType: AssetType;
  parentAsset?: string; // Mã tài sản cha (với tài sản con)
  units: number;
  manufacturer?: string;
  model?: string;
  ownership: "Owned" | "Leased";
  bought: "New" | "Used";

  // Book / Financial Information
  book: string; // Sổ TS (VD: IDP_CORP)
  currentCost: number; // Nguyên giá hiện tại
  originalCost: number; // Nguyên giá ban đầu (hệ thống tự xác định)
  salvageValue: number; // Giá trị thanh lý ước tính
  recoverableCost: number; // = currentCost - salvageValue (tự tính)
  netBookValue: number; // Giá trị còn lại
  ytdDepreciation: number; // Khấu hao lũy kế từ đầu năm
  accumulatedDepreciation: number; // Khấu hao lũy kế toàn bộ

  // Depreciation setup
  depreciate: boolean; // Có tính khấu hao không (CIP = false)
  method: string; // Phương pháp (STL, FLAT 10%...)
  lifeYears: number;
  lifeMonths: number;
  dateInService: string; // Ngày đưa vào sử dụng
  prorateConvention: string;
  prorateDate: string;
  groupAsset?: string; // Group cha (nếu là Member)

  // Trạng thái nghiệp vụ (khóa Sửa/Xóa)
  status: AssetStatus;
  accounted: boolean; // Đã tạo định khoản
  depreciated: boolean; // Đã chạy khấu hao
  createdDate: string;
}

/** Dòng phân bổ sử dụng (Assignment) */
export interface FaAssignment {
  assignmentId: number;
  assetNumber: string;
  units: number;
  employeeNumber: string;
  employeeName: string;
  location: string; // Đơn vị / phòng ban (Location flexfield)
  expenseAccount: string; // TK chi phí khấu hao
}

/** Phương pháp khấu hao (Setup > Depreciation > Method) */
export interface FaDepreciationMethod {
  methodId: number;
  method: string; // Tên (duy nhất)
  description: string;
  methodType: "Calculated" | "Table" | "Production" | "Flat" | "Formula";
  calculationBasis: "Cost" | "NBV";
  lifeYears: number;
  lifeMonths: number;
  proratePeriodsPerYear: number;
  depreciateInYearRetired: boolean;
  excludeSalvageValue: boolean;
  inUse: boolean; // Đã gán cho Category/Asset -> không cho xóa
}

/** Lịch sử giao dịch tài sản (Transaction History) */
export interface FaTransaction {
  transactionId: number;
  assetNumber: string;
  assetDescription: string;
  transactionType: string; // ADDITION | TRANSFER | RECLASS | ADJUSTMENT | FULL RETIREMENT ...
  book: string;
  periodEffective: string;
  periodEntered: string;
  amount?: number;
  status?: string;
}

/** Bản ghi hàng đợi Request (Run Depreciation / Create Accounting...) */
export interface FaRequest {
  requestId: string;
  program: string;
  book: string;
  period: string; // Period hoặc End Date
  mode: string; // Preview | Final | Draft | Post
  runBy: string;
  status: "Completed" | "Running" | "Posted" | "Error";
  date: string;
}

/** Dòng Mass Addition từ AP */
export interface FaMassAddition {
  massId: number;
  invoiceNumber: string;
  supplierName: string;
  amount: number;
  trackAsAsset: boolean;
  category: string;
  queue: "NEW" | "POST" | "ON HOLD" | "SPLIT" | "POSTED" | "MERGED";
  description: string;
  book: string;
  dateInService: string;
}

/** Giao dịch thanh lý (Retirement) */
export interface FaRetirement {
  retirementId: number;
  assetNumber: string;
  book: string;
  retireDate: string;
  retirementType: "Sale" | "Extraordinary";
  currentUnits: number;
  unitsRetired: number;
  currentCost: number;
  costRetired: number;
  proceedsOfSale: number;
  costOfRemoval: number;
  gainLoss: number;
  status: "Pending" | "Processed" | "Reinstate" | "Deleted";
  soldTo?: string;
  checkInvoice?: string;
}

/** Số liệu tổng quan Dashboard */
export interface FaDashboardStats {
  totalCost: number;
  totalNbv: number;
  cipUncapitalized: number;
  activeAssets: number;
  massAdditionsPending: number;
  missingAssignment: number;
  openPeriod: string;
  unaccountedTransactions: number;
  nbvComposition: { label: string; value: number }[];
  categoryData: {
    label: string;
    cost: number;
    nbv: number;
    accumulated: number;
  }[];
}
