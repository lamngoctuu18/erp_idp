/**
 * API giả lập phân hệ Tài sản cố định (FA).
 *
 * Dữ liệu lưu trong localStorage — CHƯA kết nối backend thật.
 * Mọi hàm trả về shape { success, data } giống phân hệ Inventory
 * để dễ thay bằng axios khi có API thật.
 */
import {
  FaAsset,
  FaAssignment,
  FaDepreciationMethod,
  FaTransaction,
  FaRequest,
  FaMassAddition,
  FaRetirement,
  FaDashboardStats,
} from "../../model/FixedAssetModel";

const getStorage = <T>(key: string, defaultVal: T): T => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(val);
  } catch {
    return defaultVal;
  }
};

const setStorage = <T>(key: string, val: T) => {
  localStorage.setItem(key, JSON.stringify(val));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// -------------------------------------------------------------
// Danh mục dùng chung (options)
// -------------------------------------------------------------

/** Nhóm tài sản (Category) — theo Asset Key Flexfield trong tài liệu */
export const FA_CATEGORIES = [
  { value: "100", label: "100 - Tài sản cố định hữu hình" },
  { value: "101", label: "101 - Nhà cửa, vật kiến trúc" },
  { value: "102", label: "102 - Máy móc, thiết bị" },
  { value: "103", label: "103 - Phương tiện vận tải, truyền dẫn" },
  { value: "104", label: "104 - Thiết bị, dụng cụ quản lý" },
  { value: "106", label: "106 - Tài sản cố định khác" },
  { value: "301", label: "301 - Quyền sử dụng đất" },
  { value: "305", label: "305 - Phần mềm quản lý" },
];

/** Sổ tài sản (Book) */
export const FA_BOOKS = [
  { value: "IDP_CORP", label: "IDP_CORP - Sổ TSCĐ Corporate" },
  { value: "IDP_TAX", label: "IDP_TAX - Sổ TSCĐ Thuế" },
];

/** Loại giao dịch ghi tăng (Loại giao dịch flexfield) */
export const FA_TXN_TYPES = [
  { value: "01", label: "01 - TSCĐ mua ngoài" },
  { value: "02", label: "02 - TSCĐ nhận điều chuyển nội bộ" },
  { value: "03", label: "03 - Tạo ra từ nội bộ doanh nghiệp (TSCĐVH)" },
  { value: "04", label: "04 - Tăng do hợp nhất kinh doanh" },
  { value: "05", label: "05 - Nhập lại TSCĐ xử lý sai" },
  { value: "09", label: "09 - Tăng khác" },
];

export const FA_PRORATE_CONVENTIONS = [
  { value: "DAILY", label: "DAILY - Theo ngày" },
  { value: "CUR_MONTH", label: "CUR_MONTH - Tháng hiện tại" },
  { value: "NEXT_MONTH", label: "NEXT_MONTH - Tháng kế tiếp" },
  { value: "MONTHLY", label: "MONTHLY - Theo tháng" },
];

export const FA_METHOD_OPTIONS = [
  { value: "STL", label: "STL - Khấu hao đường thẳng" },
  { value: "FLAT_10", label: "FLAT 10% - Tỷ lệ cố định" },
  { value: "150DB", label: "150DB - Số dư giảm dần" },
];

// -------------------------------------------------------------
// Seed data
// -------------------------------------------------------------

const initialAssets: FaAsset[] = [
  {
    assetId: 184,
    assetNumber: "TS000184",
    tagNumber: "IDP-HCM-0184",
    serialNumber: "SN-8FBN-0184",
    description: "Xe nâng điện Toyota 8FBN",
    categoryCode: "102",
    category: "102 - Máy móc, thiết bị",
    assetKey: "102.0600",
    assetType: "CAPITALIZED",
    units: 1,
    manufacturer: "Toyota",
    model: "8FBN25",
    ownership: "Owned",
    bought: "New",
    book: "IDP_CORP",
    currentCost: 680000000,
    originalCost: 680000000,
    salvageValue: 0,
    recoverableCost: 680000000,
    netBookValue: 521000000,
    ytdDepreciation: 68000000,
    accumulatedDepreciation: 159000000,
    depreciate: true,
    method: "STL",
    lifeYears: 5,
    lifeMonths: 0,
    dateInService: "2024-01-01",
    prorateConvention: "DAILY",
    prorateDate: "2024-01-01",
    status: "Active",
    accounted: false,
    depreciated: false,
    createdDate: "2024-01-02T08:00:00",
  },
  {
    assetId: 183,
    assetNumber: "TS000183",
    tagNumber: "IDP-HN-0183",
    serialNumber: "SN-TETRA-0183",
    description: "Máy đóng gói Tetra Pak",
    categoryCode: "102",
    category: "102 - Máy móc, thiết bị",
    assetKey: "102.0300",
    assetType: "CAPITALIZED",
    units: 1,
    manufacturer: "Tetra Pak",
    model: "A3/Flex",
    ownership: "Owned",
    bought: "New",
    book: "IDP_CORP",
    currentCost: 1250000000,
    originalCost: 1250000000,
    salvageValue: 0,
    recoverableCost: 1250000000,
    netBookValue: 1042000000,
    ytdDepreciation: 125000000,
    accumulatedDepreciation: 208000000,
    depreciate: true,
    method: "STL",
    lifeYears: 10,
    lifeMonths: 0,
    dateInService: "2023-06-01",
    prorateConvention: "DAILY",
    prorateDate: "2023-06-01",
    status: "Active",
    accounted: true,
    depreciated: true,
    createdDate: "2023-06-02T08:00:00",
  },
  {
    assetId: 32,
    assetNumber: "CIP00032",
    tagNumber: "IDP-CIP-032",
    serialNumber: "",
    description: "Dây chuyền kho lạnh Long An",
    categoryCode: "101",
    category: "101 - Nhà cửa, vật kiến trúc",
    assetKey: "101.0000",
    assetType: "CIP",
    units: 1,
    ownership: "Owned",
    bought: "New",
    book: "IDP_CORP",
    currentCost: 2860000000,
    originalCost: 2860000000,
    salvageValue: 0,
    recoverableCost: 2860000000,
    netBookValue: 2860000000,
    ytdDepreciation: 0,
    accumulatedDepreciation: 0,
    depreciate: false,
    method: "STL",
    lifeYears: 0,
    lifeMonths: 0,
    dateInService: "2026-07-01",
    prorateConvention: "DAILY",
    prorateDate: "2026-07-01",
    status: "CIP",
    accounted: false,
    depreciated: false,
    createdDate: "2026-05-10T08:00:00",
  },
  {
    assetId: 8,
    assetNumber: "GRP00008",
    tagNumber: "",
    description: "Nhóm thiết bị văn phòng HCM",
    categoryCode: "104",
    category: "104 - Thiết bị, dụng cụ quản lý",
    assetKey: "104.0000",
    assetType: "GROUP",
    units: 1,
    ownership: "Owned",
    bought: "New",
    book: "IDP_CORP",
    currentCost: 920000000,
    originalCost: 920000000,
    salvageValue: 0,
    recoverableCost: 920000000,
    netBookValue: 710000000,
    ytdDepreciation: 92000000,
    accumulatedDepreciation: 210000000,
    depreciate: true,
    method: "STL",
    lifeYears: 4,
    lifeMonths: 0,
    dateInService: "2024-03-01",
    prorateConvention: "DAILY",
    prorateDate: "2024-03-01",
    status: "Active",
    accounted: true,
    depreciated: true,
    createdDate: "2024-03-02T08:00:00",
  },
];

const initialAssignments: FaAssignment[] = [
  {
    assignmentId: 1,
    assetNumber: "TS000184",
    units: 1,
    employeeNumber: "NV00182",
    employeeName: "Nguyễn Minh",
    location: "HCM.NM.SANXUAT",
    expenseAccount: "62740010",
  },
];

const initialMethods: FaDepreciationMethod[] = [
  {
    methodId: 1,
    method: "STL",
    description: "Đường thẳng theo số năm",
    methodType: "Calculated",
    calculationBasis: "Cost",
    lifeYears: 5,
    lifeMonths: 0,
    proratePeriodsPerYear: 12,
    depreciateInYearRetired: true,
    excludeSalvageValue: false,
    inUse: true,
  },
  {
    methodId: 2,
    method: "STL_05Y",
    description: "Đường thẳng 5 năm",
    methodType: "Calculated",
    calculationBasis: "Cost",
    lifeYears: 5,
    lifeMonths: 0,
    proratePeriodsPerYear: 12,
    depreciateInYearRetired: true,
    excludeSalvageValue: false,
    inUse: false,
  },
  {
    methodId: 3,
    method: "FLAT_10",
    description: "Tỷ lệ cố định 10%/năm",
    methodType: "Flat",
    calculationBasis: "NBV",
    lifeYears: 0,
    lifeMonths: 0,
    proratePeriodsPerYear: 12,
    depreciateInYearRetired: false,
    excludeSalvageValue: true,
    inUse: false,
  },
];

const initialTransactions: FaTransaction[] = [
  { transactionId: 1, assetNumber: "TS000183", assetDescription: "Máy đóng gói Tetra Pak", transactionType: "ADDITION", book: "IDP_CORP", periodEffective: "JUN-23", periodEntered: "JUN-23", amount: 1250000000 },
  { transactionId: 2, assetNumber: "TS000183", assetDescription: "Máy đóng gói Tetra Pak", transactionType: "DEPRECIATION", book: "IDP_CORP", periodEffective: "JUN-26", periodEntered: "JUN-26", amount: 10416667 },
  { transactionId: 3, assetNumber: "GRP00008", assetDescription: "Nhóm thiết bị văn phòng HCM", transactionType: "TRANSFER", book: "IDP_CORP", periodEffective: "MAY-26", periodEntered: "MAY-26" },
  { transactionId: 4, assetNumber: "TS000184", assetDescription: "Xe nâng điện Toyota 8FBN", transactionType: "ADDITION", book: "IDP_CORP", periodEffective: "JAN-24", periodEntered: "JAN-24", amount: 680000000 },
];

const initialRequests: FaRequest[] = [
  { requestId: "REQ-260706-018", program: "Run Depreciation", book: "IDP_CORP", period: "JUL-26", mode: "Preview", runBy: "Lê Thu", status: "Completed", date: "2026-07-06T09:00:00" },
  { requestId: "REQ-260705-044", program: "Create Accounting - Assets", book: "IDP_CORP", period: "JUN-26", mode: "Final", runBy: "Lê Thu", status: "Posted", date: "2026-07-05T16:30:00" },
];

const initialMassAdditions: FaMassAddition[] = [
  { massId: 1, invoiceNumber: "AP-26070082", supplierName: "Ingersoll Rand VN", amount: 450000000, trackAsAsset: true, category: "102 - Máy móc, thiết bị", queue: "NEW", description: "Máy nén khí Ingersoll Rand", book: "IDP_CORP", dateInService: "2026-07-06" },
  { massId: 2, invoiceNumber: "AP-26070090", supplierName: "Công ty M&S", amount: 85000000, trackAsAsset: true, category: "104 - Thiết bị, dụng cụ quản lý", queue: "NEW", description: "Bộ máy tính văn phòng", book: "IDP_CORP", dateInService: "2026-07-05" },
  { massId: 3, invoiceNumber: "AP-26070075", supplierName: "DNTN Trường Phát", amount: 250000000, trackAsAsset: true, category: "101 - Nhà cửa, vật kiến trúc", queue: "POST", description: "Cải tạo tòa nhà kho", book: "IDP_CORP", dateInService: "2026-06-30" },
];

const initialRetirements: FaRetirement[] = [
  {
    retirementId: 1,
    assetNumber: "TS000170",
    book: "IDP_CORP",
    retireDate: "2026-06-15",
    retirementType: "Sale",
    currentUnits: 1,
    unitsRetired: 1,
    currentCost: 320000000,
    costRetired: 320000000,
    proceedsOfSale: 180000000,
    costOfRemoval: 5000000,
    gainLoss: -12000000,
    status: "Processed",
    soldTo: "CTCP Thiết bị Minh Phát",
    checkInvoice: "HD-26060012",
  },
];

// -------------------------------------------------------------
// Helper tài chính
// -------------------------------------------------------------

/** Recompute Recoverable Cost & NBV theo quy tắc tài liệu */
const recalcFinancials = (a: FaAsset): FaAsset => {
  const recoverableCost = Math.max(0, a.currentCost - a.salvageValue);
  const netBookValue = Math.max(0, a.currentCost - a.accumulatedDepreciation);
  return { ...a, recoverableCost, netBookValue };
};

// -------------------------------------------------------------
// ASSET API
// -------------------------------------------------------------

export const getAssetList = async (p: {
  skip: number;
  take: number;
  keySearch?: string;
  book?: string;
  assetType?: string;
  status?: string;
}) => {
  await delay(120);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  let filtered = assets;
  if (p.keySearch) {
    const key = p.keySearch.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.assetNumber.toLowerCase().includes(key) ||
        a.description.toLowerCase().includes(key) ||
        (a.tagNumber || "").toLowerCase().includes(key)
    );
  }
  if (p.book && p.book !== "ALL") filtered = filtered.filter((a) => a.book === p.book);
  if (p.assetType && p.assetType !== "ALL") filtered = filtered.filter((a) => a.assetType === p.assetType);
  if (p.status && p.status !== "ALL") filtered = filtered.filter((a) => a.status === p.status);
  return {
    success: true,
    data: { lists: filtered.slice(p.skip, p.skip + p.take), totalCount: filtered.length },
  };
};

export const getAssetByNumber = async (assetNumber: string) => {
  await delay(80);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  const asset = assets.find((a) => a.assetNumber === assetNumber);
  if (!asset) return { success: false, message: "Không tìm thấy tài sản" };
  return { success: true, data: asset };
};

export const createAsset = async (data: Partial<FaAsset>) => {
  await delay(160);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  const seq = assets.length + 185;
  const prefix = data.assetType === "CIP" ? "CIP" : data.assetType === "GROUP" ? "GRP" : "TS";
  const asset: FaAsset = recalcFinancials({
    assetId: Date.now(),
    assetNumber: data.assetNumber || `${prefix}${String(seq).padStart(6, "0")}`,
    tagNumber: data.tagNumber || "",
    serialNumber: data.serialNumber || "",
    description: data.description || "",
    categoryCode: data.categoryCode || "102",
    category: data.category || "102 - Máy móc, thiết bị",
    assetKey: data.assetKey || "",
    assetType: data.assetType || "CAPITALIZED",
    parentAsset: data.parentAsset,
    units: data.units ?? 1,
    manufacturer: data.manufacturer,
    model: data.model,
    ownership: data.ownership || "Owned",
    bought: data.bought || "New",
    book: data.book || "IDP_CORP",
    currentCost: data.currentCost ?? 0,
    originalCost: data.currentCost ?? 0,
    salvageValue: data.salvageValue ?? 0,
    recoverableCost: 0,
    netBookValue: 0,
    ytdDepreciation: data.ytdDepreciation ?? 0,
    accumulatedDepreciation: data.accumulatedDepreciation ?? 0,
    depreciate: data.assetType === "CIP" ? false : data.depreciate ?? true,
    method: data.method || "STL",
    lifeYears: data.lifeYears ?? 5,
    lifeMonths: data.lifeMonths ?? 0,
    dateInService: data.dateInService || new Date().toISOString().slice(0, 10),
    prorateConvention: data.prorateConvention || "DAILY",
    prorateDate: data.prorateDate || data.dateInService || new Date().toISOString().slice(0, 10),
    groupAsset: data.groupAsset,
    status: data.assetType === "CIP" ? "CIP" : "Active",
    accounted: false,
    depreciated: false,
    createdDate: new Date().toISOString(),
  });
  assets.unshift(asset);
  setStorage("fa_assets", assets);
  return { success: true, data: asset };
};

export const updateAsset = async (assetNumber: string, data: Partial<FaAsset>) => {
  await delay(140);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  const idx = assets.findIndex((a) => a.assetNumber === assetNumber);
  if (idx === -1) return { success: false, message: "Không tìm thấy tài sản để cập nhật" };
  assets[idx] = recalcFinancials({ ...assets[idx], ...data });
  setStorage("fa_assets", assets);
  return { success: true, data: assets[idx] };
};

export const deleteAsset = async (assetNumber: string) => {
  await delay(100);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  const target = assets.find((a) => a.assetNumber === assetNumber);
  if (target && (target.accounted || target.depreciated)) {
    return { success: false, message: "Không thể xóa tài sản đã hạch toán hoặc đã chạy khấu hao" };
  }
  setStorage("fa_assets", assets.filter((a) => a.assetNumber !== assetNumber));
  return { success: true };
};

// -------------------------------------------------------------
// ASSIGNMENT API
// -------------------------------------------------------------

export const getAssignments = async (assetNumber?: string) => {
  await delay(80);
  const list = getStorage<FaAssignment[]>("fa_assignments", initialAssignments);
  return { success: true, data: assetNumber ? list.filter((x) => x.assetNumber === assetNumber) : list };
};

// -------------------------------------------------------------
// DEPRECIATION METHOD API
// -------------------------------------------------------------

export const getDepreciationMethods = async () => {
  await delay(90);
  return { success: true, data: getStorage<FaDepreciationMethod[]>("fa_methods", initialMethods) };
};

export const createDepreciationMethod = async (data: Partial<FaDepreciationMethod>) => {
  await delay(120);
  const methods = getStorage<FaDepreciationMethod[]>("fa_methods", initialMethods);
  if (methods.some((m) => m.method.toLowerCase() === (data.method || "").toLowerCase())) {
    return { success: false, message: "Tên phương pháp đã tồn tại" };
  }
  const m: FaDepreciationMethod = {
    methodId: Date.now(),
    method: data.method || "",
    description: data.description || "",
    methodType: data.methodType || "Calculated",
    calculationBasis: data.calculationBasis || "Cost",
    lifeYears: data.lifeYears ?? 0,
    lifeMonths: data.lifeMonths ?? 0,
    proratePeriodsPerYear: data.proratePeriodsPerYear ?? 12,
    depreciateInYearRetired: data.depreciateInYearRetired ?? true,
    excludeSalvageValue: data.excludeSalvageValue ?? false,
    inUse: false,
  };
  methods.unshift(m);
  setStorage("fa_methods", methods);
  return { success: true, data: m };
};

export const deleteDepreciationMethod = async (methodId: number) => {
  await delay(90);
  const methods = getStorage<FaDepreciationMethod[]>("fa_methods", initialMethods);
  const target = methods.find((m) => m.methodId === methodId);
  if (target?.inUse) return { success: false, message: "Phương pháp đang được sử dụng, không thể xóa" };
  setStorage("fa_methods", methods.filter((m) => m.methodId !== methodId));
  return { success: true };
};

// -------------------------------------------------------------
// TRANSACTION / REQUEST API
// -------------------------------------------------------------

export const getTransactions = async (assetNumber?: string) => {
  await delay(90);
  const list = getStorage<FaTransaction[]>("fa_transactions", initialTransactions);
  return { success: true, data: assetNumber ? list.filter((x) => x.assetNumber === assetNumber) : list };
};

export const getRequests = async (program?: string) => {
  await delay(90);
  const list = getStorage<FaRequest[]>("fa_requests", initialRequests);
  return { success: true, data: program ? list.filter((x) => x.program.includes(program)) : list };
};

export const submitRequest = async (data: {
  program: string;
  book: string;
  period: string;
  mode: string;
}) => {
  await delay(180);
  const list = getStorage<FaRequest[]>("fa_requests", initialRequests);
  const now = new Date();
  const req: FaRequest = {
    requestId: `REQ-${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(list.length + 1).padStart(3, "0")}`,
    program: data.program,
    book: data.book,
    period: data.period,
    mode: data.mode,
    runBy: "Lê Thu",
    status: "Completed",
    date: now.toISOString(),
  };
  list.unshift(req);
  setStorage("fa_requests", list);
  return { success: true, data: req };
};

// -------------------------------------------------------------
// MASS ADDITION API
// -------------------------------------------------------------

export const getMassAdditions = async (queue?: string) => {
  await delay(100);
  const list = getStorage<FaMassAddition[]>("fa_mass_additions", initialMassAdditions);
  return { success: true, data: queue && queue !== "ALL" ? list.filter((x) => x.queue === queue) : list };
};

export const updateMassAdditionQueue = async (massId: number, queue: FaMassAddition["queue"]) => {
  await delay(100);
  const list = getStorage<FaMassAddition[]>("fa_mass_additions", initialMassAdditions);
  const idx = list.findIndex((x) => x.massId === massId);
  if (idx === -1) return { success: false };
  list[idx] = { ...list[idx], queue };
  setStorage("fa_mass_additions", list);
  return { success: true, data: list[idx] };
};

export const postMassAdditions = async (book: string) => {
  await delay(220);
  const list = getStorage<FaMassAddition[]>("fa_mass_additions", initialMassAdditions);
  const posted = list.map((x) => (x.queue === "POST" && x.book === book ? { ...x, queue: "POSTED" as const } : x));
  setStorage("fa_mass_additions", posted);
  return { success: true, data: posted.filter((x) => x.queue === "POSTED").length };
};

// -------------------------------------------------------------
// RETIREMENT API
// -------------------------------------------------------------

export const getRetirements = async () => {
  await delay(100);
  return { success: true, data: getStorage<FaRetirement[]>("fa_retirements", initialRetirements) };
};

export const createRetirement = async (data: Partial<FaRetirement>) => {
  await delay(160);
  const list = getStorage<FaRetirement[]>("fa_retirements", initialRetirements);
  const proceeds = data.proceedsOfSale ?? 0;
  const removal = data.costOfRemoval ?? 0;
  const costRetired = data.costRetired ?? 0;
  // Lãi/lỗ ~ thu thanh lý - chi thanh lý - giá trị còn lại (ước tính giá trị còn lại = 60% cost)
  const estimatedNbv = costRetired * 0.6;
  const r: FaRetirement = {
    retirementId: Date.now(),
    assetNumber: data.assetNumber || "",
    book: data.book || "IDP_CORP",
    retireDate: data.retireDate || new Date().toISOString().slice(0, 10),
    retirementType: data.retirementType || "Sale",
    currentUnits: data.currentUnits ?? 1,
    unitsRetired: data.unitsRetired ?? 1,
    currentCost: data.currentCost ?? costRetired,
    costRetired,
    proceedsOfSale: proceeds,
    costOfRemoval: removal,
    gainLoss: proceeds - removal - estimatedNbv,
    status: "Pending",
    soldTo: data.soldTo,
    checkInvoice: data.checkInvoice,
  };
  list.unshift(r);
  setStorage("fa_retirements", list);
  return { success: true, data: r };
};

export const undoRetirement = async (retirementId: number) => {
  await delay(120);
  const list = getStorage<FaRetirement[]>("fa_retirements", initialRetirements);
  const target = list.find((x) => x.retirementId === retirementId);
  if (!target) return { success: false };
  if (target.status !== "Pending") {
    return { success: false, message: "Chỉ Undo được giao dịch trạng thái Pending" };
  }
  setStorage("fa_retirements", list.filter((x) => x.retirementId !== retirementId));
  return { success: true };
};

// -------------------------------------------------------------
// DASHBOARD
// -------------------------------------------------------------

export const getDashboardStats = async (): Promise<{ success: boolean; data: FaDashboardStats }> => {
  await delay(120);
  const assets = getStorage<FaAsset[]>("fa_assets", initialAssets);
  const mass = getStorage<FaMassAddition[]>("fa_mass_additions", initialMassAdditions);
  const totalCost = assets.reduce((s, a) => s + a.currentCost, 0);
  const totalNbv = assets.reduce((s, a) => s + a.netBookValue, 0);
  const cipUncapitalized = assets.filter((a) => a.assetType === "CIP").reduce((s, a) => s + a.currentCost, 0);
  const activeAssets = assets.filter((a) => a.status === "Active").length;
  return {
    success: true,
    data: {
      totalCost,
      totalNbv,
      cipUncapitalized,
      activeAssets,
      massAdditionsPending: mass.filter((m) => m.queue === "NEW").length,
      missingAssignment: 3,
      openPeriod: "JUL-26",
      unaccountedTransactions: assets.filter((a) => !a.accounted).length,
      nbvComposition: [
        { label: "Máy móc, thiết bị", value: assets.filter((a) => a.categoryCode === "102").reduce((s, a) => s + a.netBookValue, 0) },
        { label: "Nhà cửa, vật kiến trúc", value: assets.filter((a) => a.categoryCode === "101").reduce((s, a) => s + a.netBookValue, 0) },
        { label: "Thiết bị quản lý", value: assets.filter((a) => a.categoryCode === "104").reduce((s, a) => s + a.netBookValue, 0) },
        { label: "Khác", value: assets.filter((a) => !["101", "102", "104"].includes(a.categoryCode)).reduce((s, a) => s + a.netBookValue, 0) },
      ],
      categoryData: [
        {
          label: "Máy móc, thiết bị",
          cost: assets.filter((a) => a.categoryCode === "102").reduce((s, a) => s + a.currentCost, 0),
          nbv: assets.filter((a) => a.categoryCode === "102").reduce((s, a) => s + a.netBookValue, 0),
          accumulated: assets.filter((a) => a.categoryCode === "102").reduce((s, a) => s + a.accumulatedDepreciation, 0),
        },
        {
          label: "Nhà cửa, vật kiến trúc",
          cost: assets.filter((a) => a.categoryCode === "101").reduce((s, a) => s + a.currentCost, 0),
          nbv: assets.filter((a) => a.categoryCode === "101").reduce((s, a) => s + a.netBookValue, 0),
          accumulated: assets.filter((a) => a.categoryCode === "101").reduce((s, a) => s + a.accumulatedDepreciation, 0),
        },
        {
          label: "Thiết bị quản lý",
          cost: assets.filter((a) => a.categoryCode === "104").reduce((s, a) => s + a.currentCost, 0),
          nbv: assets.filter((a) => a.categoryCode === "104").reduce((s, a) => s + a.netBookValue, 0),
          accumulated: assets.filter((a) => a.categoryCode === "104").reduce((s, a) => s + a.accumulatedDepreciation, 0),
        },
        {
          label: "Khác",
          cost: assets.filter((a) => !["101", "102", "104"].includes(a.categoryCode)).reduce((s, a) => s + a.currentCost, 0),
          nbv: assets.filter((a) => !["101", "102", "104"].includes(a.categoryCode)).reduce((s, a) => s + a.netBookValue, 0),
          accumulated: assets.filter((a) => !["101", "102", "104"].includes(a.categoryCode)).reduce((s, a) => s + a.accumulatedDepreciation, 0),
        },
      ],
    },
  };
};
