import { 
  InventoryItemModel, 
  SubinventoryModel, 
  LocatorModel, 
  OnhandModel, 
  MaterialTransactionModel, 
  MoveOrderHeaderModel, 
  MoveOrderLineModel, 
  PeriodModel, 
  TransactionAccountModel,
  AccountAliasModel,
  UomModel,
  MiscSlipModel,
  TransferSlipModel,
  NxtReportModel,
  InventoryInterfaceBatchModel,
  InventoryInterfaceKind,
  InventoryInterfaceRecordModel
} from "../../model/InventoryModel";

// Helper get/set localStorage
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

// Initial Data
const initialUoms: UomModel[] = [
  { uomCode: "M3", unitOfMeasure: "Mét khối", uomClass: "Volume", baseUomFlag: "Y", description: "Mét khối thể tích" },
  { uomCode: "Tam", unitOfMeasure: "Tấm", uomClass: "Volume", baseUomFlag: "N", description: "Tấm ván" },
  { uomCode: "KG", unitOfMeasure: "Kilôgam", uomClass: "Weight", baseUomFlag: "Y", description: "Khối lượng chuẩn" }
];

const initialItems: InventoryItemModel[] = [
  {
    inventoryItemId: 1000,
    organizationId: 125,
    organizationCode: "PUR",
    itemNumber: "ITEM-MDF",
    description: "Ván MDF tiêu chuẩn",
    longDescription: "Ván gỗ ép công nghiệp MDF chất lượng cao",
    primaryUnitOfMeasure: "Mét khối",
    primaryUomCode: "M3",
    unitLength: 2.4,
    unitWidth: 1.2,
    unitHeight: 0.018,
    enabledFlag: "Y",
    categoryName: "Gỗ Công Nghiệp",
    createdDate: "2026-07-01T08:00:00",
    itemType: "RAW_MATERIAL",
    secondaryUomCode: "Tam",
    locatorControlCode: 2,
    lotControlCode: 1,
    serialControlCode: 1,
    purchasableFlag: "Y",
    customerOrderEnabledFlag: "N",
    listPrice: 1000000,
    receiptRoutingId: 2,
    costingEnabledFlag: "Y",
    costingMethod: "AVERAGE",
    valuationAccount: "152000",
    cogsAccount: "632000",
    salesAccount: "511100"
  },
  {
    inventoryItemId: 551,
    organizationId: 125,
    organizationCode: "PUR",
    itemNumber: "ITEM-KEO",
    description: "Keo dán gỗ chuyên dụng",
    longDescription: "Keo dán liên kết các chi tiết gỗ công nghiệp",
    primaryUnitOfMeasure: "Kilôgam",
    primaryUomCode: "KG",
    enabledFlag: "Y",
    categoryName: "Hóa Chất",
    createdDate: "2026-07-02T09:30:00",
    itemType: "RAW_MATERIAL",
    locatorControlCode: 1,
    lotControlCode: 2,
    serialControlCode: 1,
    purchasableFlag: "Y",
    customerOrderEnabledFlag: "N",
    listPrice: 150000,
    receiptRoutingId: 1,
    costingEnabledFlag: "Y",
    costingMethod: "STANDARD",
    valuationAccount: "152000",
    cogsAccount: "632000",
    salesAccount: "511100"
  }
];

const initialSubinventories: SubinventoryModel[] = [
  {
    organizationId: 125,
    secondaryInventoryName: "01",
    description: "Kho Vật tư chính",
    locatorControlCode: 2, // Pre-defined
    materialAccount: 1110,
    assetInventory: 1,
    trackedQuantity: 1,
    address: "Lô A2-CN8, Đường số 4, KCN Từ Liêm, Bắc Từ Liêm, Hà Nội",
    contactPerson: "Nguyễn Văn Hùng",
    phone: "0901 234 567",
    capacityVolume: 1200
  },
  {
    organizationId: 125,
    secondaryInventoryName: "02",
    description: "Kho Vật tư phụ",
    locatorControlCode: 2, // Pre-defined
    materialAccount: 1110,
    assetInventory: 1,
    trackedQuantity: 1,
    address: "Lô A2-CN8, Đường số 4, KCN Từ Liêm, Bắc Từ Liêm, Hà Nội",
    contactPerson: "Trần Thị Lan",
    phone: "0908 765 432",
    capacityVolume: 800
  },
  {
    organizationId: 126,
    secondaryInventoryName: "X01",
    description: "Kho Xưởng sản xuất",
    locatorControlCode: 1, // None
    materialAccount: 1110,
    assetInventory: 1,
    trackedQuantity: 1,
    address: "Nhà xưởng số 3, KCN Từ Liêm, Nam Từ Liêm, Hà Nội",
    contactPerson: "Lê Minh Tuấn",
    phone: "0912 345 678",
    capacityVolume: 350
  }
];

const initialLocators: LocatorModel[] = [
  { organizationId: 125, subinventoryCode: "01", inventoryLocatorId: 1, locatorCode: "LOC-01-A", description: "Khu vực kệ A - Kho 01" },
  { organizationId: 125, subinventoryCode: "01", inventoryLocatorId: 2, locatorCode: "LOC-01-B", description: "Khu vực kệ B - Kho 01" },
  { organizationId: 125, subinventoryCode: "02", inventoryLocatorId: 3, locatorCode: "LOC-02-A", description: "Kệ A - Kho 02" }
];

const initialOnhand: OnhandModel[] = [
  {
    organizationId: 125,
    inventoryItemId: 1000,
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionQuantity: 15, // 15 Tấm
    primaryTransactionQuantity: 1.5, // 1.5 M3
    transactionUomCode: "Tam",
    allocatedQuantity: 5,
    availableToTransact: 10,
    unitCost: 100000,
    totalValue: 1500000
  },
  {
    organizationId: 125,
    inventoryItemId: 551,
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    lotNumber: "LOT-01",
    lotExpirationDate: "2026-12-31",
    transactionQuantity: 7,
    primaryTransactionQuantity: 7,
    transactionUomCode: "KG",
    allocatedQuantity: 0,
    availableToTransact: 7,
    unitCost: 150000,
    totalValue: 1050000
  },
  {
    organizationId: 125,
    inventoryItemId: 551,
    subinventoryCode: "01",
    locatorId: 2,
    locatorCode: "LOC-01-B",
    lotNumber: "LOT-02",
    lotExpirationDate: "2027-06-30",
    transactionQuantity: 3,
    primaryTransactionQuantity: 3,
    transactionUomCode: "KG",
    allocatedQuantity: 0,
    availableToTransact: 3,
    unitCost: 150000,
    totalValue: 450000
  }
];

const initialTransactions: MaterialTransactionModel[] = [
  {
    transactionId: 151,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionTypeId: 1,
    transactionTypeName: "Nhập kho Misc (Mẫu)",
    transactionActionId: 27, // Receipt
    transactionQuantity: 15,
    transactionUom: "Tam",
    primaryQuantity: 1.5,
    transactionDate: "2026-07-05T10:00:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 1000000,
    transactionCost: 1000000,
    documentNumber: "MISC-REC-01",
    reason: "Nhập tồn đầu kỳ cho dự án"
  },
  {
    transactionId: 152,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 551,
    itemNumber: "ITEM-KEO",
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionTypeId: 1,
    transactionTypeName: "Nhập kho Misc (Mẫu)",
    transactionActionId: 27, // Receipt
    transactionQuantity: 10,
    transactionUom: "KG",
    primaryQuantity: 10,
    transactionDate: "2026-07-06T11:00:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 150000,
    transactionCost: 150000,
    lotNumber: "LOT-01",
    documentNumber: "MISC-REC-02",
    reason: "Nhập kho mua thêm"
  },
  // Dữ liệu mẫu Chuyển kho nội bộ (Subinv Transfer SHIP-2026-001)
  {
    transactionId: 10001,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionTypeId: 3,
    transactionTypeName: "Chuyển kho nội bộ",
    transactionActionId: 2,
    transactionQuantity: -5,
    transactionUom: "Tam",
    primaryQuantity: -0.5,
    transactionDate: "2026-07-08T14:30:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 1000000,
    transactionCost: 1000000,
    transferTransactionId: 10002,
    transferSubinventory: "02",
    transferLocatorId: 3,
    transferLocatorCode: "LOC-02-A",
    shipmentNumber: "SHIP-2026-001",
    reason: "Cấp phát cho sản xuất thử nghiệm"
  },
  {
    transactionId: 10002,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    subinventoryCode: "02",
    locatorId: 3,
    locatorCode: "LOC-02-A",
    transactionTypeId: 3,
    transactionTypeName: "Nhập chuyển kho",
    transactionActionId: 2,
    transactionQuantity: 5,
    transactionUom: "Tam",
    primaryQuantity: 0.5,
    transactionDate: "2026-07-08T14:30:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 1000000,
    transactionCost: 1000000,
    transferTransactionId: 10001,
    transferSubinventory: "01",
    transferLocatorId: 1,
    transferLocatorCode: "LOC-01-A",
    shipmentNumber: "SHIP-2026-001",
    reason: "Cấp phát cho sản xuất thử nghiệm"
  },
  {
    transactionId: 10003,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 551,
    itemNumber: "ITEM-KEO",
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionTypeId: 3,
    transactionTypeName: "Chuyển kho nội bộ",
    transactionActionId: 2,
    transactionQuantity: -2,
    transactionUom: "KG",
    primaryQuantity: -2,
    transactionDate: "2026-07-08T14:30:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 150000,
    transactionCost: 150000,
    transferTransactionId: 10004,
    transferSubinventory: "02",
    transferLocatorId: 3,
    transferLocatorCode: "LOC-02-A",
    shipmentNumber: "SHIP-2026-001",
    reason: "Cấp phát cho sản xuất thử nghiệm",
    lotNumber: "LOT-01"
  },
  {
    transactionId: 10004,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 551,
    itemNumber: "ITEM-KEO",
    subinventoryCode: "02",
    locatorId: 3,
    locatorCode: "LOC-02-A",
    transactionTypeId: 3,
    transactionTypeName: "Nhập chuyển kho",
    transactionActionId: 2,
    transactionQuantity: 2,
    transactionUom: "KG",
    primaryQuantity: 2,
    transactionDate: "2026-07-08T14:30:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 150000,
    transactionCost: 150000,
    transferTransactionId: 10003,
    transferSubinventory: "01",
    transferLocatorId: 1,
    transferLocatorCode: "LOC-01-A",
    shipmentNumber: "SHIP-2026-001",
    reason: "Cấp phát cho sản xuất thử nghiệm",
    lotNumber: "LOT-01"
  },
  // Dữ liệu mẫu Chuyển kho liên đơn vị (Inter-Org SHIP-2026-002)
  {
    transactionId: 10005,
    organizationId: 125,
    organizationCode: "PUR",
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    subinventoryCode: "01",
    locatorId: 1,
    locatorCode: "LOC-01-A",
    transactionTypeId: 4,
    transactionTypeName: "Chuyển kho liên đơn vị (Xuất)",
    transactionActionId: 21,
    transactionQuantity: -3,
    transactionUom: "Tam",
    primaryQuantity: -0.3,
    transactionDate: "2026-07-09T09:15:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 1000000,
    transactionCost: 1000000,
    transferTransactionId: 10006,
    transferSubinventory: "X01",
    transferOrganizationId: 126,
    transferOrganizationCode: "MFG",
    shipmentNumber: "SHIP-2026-002",
    waybillAirbill: "WB-EMS-7782",
    freightCode: "EMS",
    reason: "Chuyển gỗ bán thành phẩm sang xưởng chế biến"
  },
  {
    transactionId: 10006,
    organizationId: 126,
    organizationCode: "MFG",
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    subinventoryCode: "X01",
    transactionTypeId: 5,
    transactionTypeName: "Chuyển kho liên đơn vị (Nhập)",
    transactionActionId: 12,
    transactionQuantity: 3,
    transactionUom: "Tam",
    primaryQuantity: 0.3,
    transactionDate: "2026-07-09T09:15:00",
    acctPeriodId: 202607,
    costedFlag: "Y",
    actualCost: 1000000,
    transactionCost: 1000000,
    transferTransactionId: 10005,
    transferSubinventory: "01",
    transferLocatorId: 1,
    transferLocatorCode: "LOC-01-A",
    transferOrganizationId: 125,
    transferOrganizationCode: "PUR",
    shipmentNumber: "SHIP-2026-002",
    waybillAirbill: "WB-EMS-7782",
    freightCode: "EMS",
    reason: "Chuyển gỗ bán thành phẩm sang xưởng chế biến"
  }
];

const initialAccounts: TransactionAccountModel[] = [
  {
    organizationId: 125,
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    transactionId: 151,
    transactionDate: "2026-07-05T10:00:00",
    baseTransactionValue: 1500000, // Debit
    referenceAccount: 1110,
    accountNumber: "152000",
    accountDescription: "Tài khoản nguyên vật liệu gỗ",
    primaryQuantity: 1.5,
    accountingLineType: 1
  },
  {
    organizationId: 125,
    inventoryItemId: 1000,
    itemNumber: "ITEM-MDF",
    transactionId: 151,
    transactionDate: "2026-07-05T10:00:00",
    baseTransactionValue: -1500000, // Credit
    referenceAccount: 1124,
    accountNumber: "111000",
    accountDescription: "Tài khoản tiền mặt đối ứng",
    primaryQuantity: 1.5,
    accountingLineType: 2
  },
  {
    organizationId: 125,
    inventoryItemId: 551,
    itemNumber: "ITEM-KEO",
    transactionId: 152,
    transactionDate: "2026-07-06T11:00:00",
    baseTransactionValue: 1500000, // Debit
    referenceAccount: 1110,
    accountNumber: "152000",
    accountDescription: "Tài khoản nguyên vật liệu hóa chất",
    primaryQuantity: 10,
    accountingLineType: 1
  },
  {
    organizationId: 125,
    inventoryItemId: 551,
    itemNumber: "ITEM-KEO",
    transactionId: 152,
    transactionDate: "2026-07-06T11:00:00",
    baseTransactionValue: -1500000, // Credit
    referenceAccount: 1124,
    accountNumber: "111000",
    accountDescription: "Tài khoản tiền mặt đối ứng",
    primaryQuantity: 10,
    accountingLineType: 2
  }
];

const initialPeriods: PeriodModel[] = [
  {
    organizationId: 125,
    acctPeriodId: 202606,
    periodYear: 2026,
    periodNum: 6,
    periodName: "06-2026",
    description: "Kỳ kế toán tháng 6/2026",
    periodStartDate: "2026-06-01",
    scheduleCloseDate: "2026-06-30",
    periodCloseDate: "2026-06-30T17:00:00",
    openFlag: "N"
  },
  {
    organizationId: 125,
    acctPeriodId: 202607,
    periodYear: 2026,
    periodNum: 7,
    periodName: "07-2026",
    description: "Kỳ kế toán tháng 7/2026",
    periodStartDate: "2026-07-01",
    scheduleCloseDate: "2026-07-31",
    openFlag: "Y"
  }
];

const initialAliases: AccountAliasModel[] = [
  { organizationId: 125, dispositionId: 10, description: "NHAP_MISC - Nhập kho điều chỉnh", distributionAccount: 1124, accountNumber: "111000", enabledFlag: "Y" },
  { organizationId: 125, dispositionId: 11, description: "XUAT_MISC - Xuất kho dự án nội bộ", distributionAccount: 1125, accountNumber: "632000", enabledFlag: "Y" }
];

const initialMoveOrders: { headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] } = {
  headers: [
    {
      organizationId: 125,
      headerId: 201,
      requestNumber: "MO-202607-0001",
      moveOrderType: 1, // Requisition
      description: "Yêu cầu cấp phát Ván MDF cho sản xuất kệ tủ",
      dateRequired: "2026-07-20",
      headerStatus: 3, // Approved
      creationDate: "2026-07-10T14:00:00"
    }
  ],
  lines: [
    {
      organizationId: 125,
      headerId: 201,
      lineId: 20101,
      lineNumber: 1,
      inventoryItemId: 1000,
      itemNumber: "ITEM-MDF",
      uomCode: "Tam",
      quantity: 5,
      quantityDelivered: 0,
      lineStatus: 3, // Approved
      fromSubinventoryCode: "01",
      toSubinventoryCode: "X01",
      primaryQuantity: 0.5
    }
  ]
};

const initialInterfaceBatches: InventoryInterfaceBatchModel[] = [
  {
    batchId: "ITEM-IMP-202607-001",
    interfaceKind: "ITEM",
    sourceCode: "ITEM_MASTER_SYNC",
    setProcessId: 20260701,
    processFlag: 2,
    status: "PROCESSED",
    recordCount: 24,
    errorCount: 0,
    createdDate: "2026-07-10T08:20:00",
    processedDate: "2026-07-10T08:26:00",
    owner: "MASTER_DATA",
    description: "Import danh mục vật tư và category từ file chuẩn"
  },
  {
    batchId: "ITEM-IMP-202607-002",
    interfaceKind: "ITEM",
    sourceCode: "ITEM_MASTER_SYNC",
    setProcessId: 20260702,
    processFlag: 3,
    status: "ERROR",
    recordCount: 8,
    errorCount: 2,
    createdDate: "2026-07-12T10:15:00",
    owner: "MASTER_DATA",
    description: "Import revision và kho giới hạn cho vật tư mới"
  },
  {
    batchId: "MTL-TXN-202607-001",
    interfaceKind: "TRANSACTION",
    sourceCode: "Inventory",
    setProcessId: 20260711,
    transactionMode: 3,
    processFlag: 1,
    status: "PENDING",
    recordCount: 12,
    errorCount: 0,
    createdDate: "2026-07-13T14:05:00",
    owner: "WAREHOUSE",
    description: "Giao dịch nhập xuất Misc chờ Material Transaction Manager"
  },
  {
    batchId: "MTL-TXN-202607-002",
    interfaceKind: "TRANSACTION",
    sourceCode: "WIP",
    setProcessId: 20260712,
    transactionMode: 2,
    processFlag: 3,
    status: "ERROR",
    recordCount: 5,
    errorCount: 1,
    createdDate: "2026-07-13T16:45:00",
    owner: "PRODUCTION",
    description: "Xuất nguyên vật liệu sản xuất có lỗi locator"
  }
];

const initialInterfaceRecords: InventoryInterfaceRecordModel[] = [
  {
    batchId: "ITEM-IMP-202607-001",
    interfaceName: "MTL_SYSTEM_ITEMS_INTERFACE",
    interfaceId: 700001,
    organizationCode: "PUR",
    itemNumber: "ITEM-MDF",
    processFlag: 2,
    status: "PROCESSED"
  },
  {
    batchId: "ITEM-IMP-202607-001",
    interfaceName: "MTL_ITEM_CATEGORIES_INTERFACE",
    interfaceId: 700002,
    organizationCode: "PUR",
    itemNumber: "ITEM-MDF",
    processFlag: 2,
    status: "PROCESSED"
  },
  {
    batchId: "ITEM-IMP-202607-002",
    interfaceName: "MTL_ITEM_REVISIONS_INTERFACE",
    interfaceId: 700101,
    organizationCode: "PUR",
    itemNumber: "ITEM-PLYWOOD",
    processFlag: 3,
    status: "ERROR",
    errorMessage: "Revision không hợp lệ hoặc trùng effectivity date"
  },
  {
    batchId: "ITEM-IMP-202607-002",
    interfaceName: "MTL_ITEM_SUB_INVS_INTERFACE",
    interfaceId: 700102,
    organizationCode: "PUR",
    itemNumber: "ITEM-EDGE",
    subinventoryCode: "03",
    processFlag: 3,
    status: "ERROR",
    errorMessage: "Secondary inventory chưa được khai báo"
  },
  {
    batchId: "MTL-TXN-202607-001",
    interfaceName: "MTL_TRANSACTIONS_INTERFACE",
    interfaceId: 800001,
    sourceHeaderId: 92001,
    sourceLineId: 1,
    organizationCode: "PUR",
    itemNumber: "ITEM-MDF",
    subinventoryCode: "01",
    transactionType: "Misc Receipt",
    transactionQuantity: 5,
    transactionUom: "Tam",
    processFlag: 1,
    status: "PENDING"
  },
  {
    batchId: "MTL-TXN-202607-001",
    interfaceName: "MTL_TRANSACTION_LOT_INTERFACE",
    interfaceId: 800002,
    sourceHeaderId: 92001,
    sourceLineId: 2,
    organizationCode: "PUR",
    itemNumber: "ITEM-KEO",
    subinventoryCode: "01",
    transactionType: "Misc Receipt",
    transactionQuantity: 3,
    transactionUom: "KG",
    lotNumber: "LOT-03",
    processFlag: 1,
    status: "PENDING"
  },
  {
    batchId: "MTL-TXN-202607-002",
    interfaceName: "MTL_TRANSACTIONS_INTERFACE",
    interfaceId: 800101,
    sourceHeaderId: 93001,
    sourceLineId: 1,
    organizationCode: "MFG",
    itemNumber: "ITEM-MDF",
    subinventoryCode: "X01",
    transactionType: "WIP Issue",
    transactionQuantity: -2,
    transactionUom: "Tam",
    processFlag: 3,
    status: "ERROR",
    errorMessage: "Locator bắt buộc theo cấu hình kho nhưng chưa truyền locator"
  }
];

// -------------------------------------------------------------
// Core API Calls
// -------------------------------------------------------------

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. ITEMS API
export const getInventoryItemList = async (p: { skip: number; take: number; keySearch?: string }) => {
  await delay(100);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  let filtered = items;
  if (p.keySearch) {
    const key = p.keySearch.toLowerCase();
    filtered = items.filter(
      (i) => i.itemNumber.toLowerCase().includes(key) || i.description.toLowerCase().includes(key)
    );
  }
  return {
    success: true,
    data: {
      lists: filtered.slice(p.skip, p.skip + p.take),
      totalCount: filtered.length
    }
  };
};

export const getInventoryItemDetail = async (id: number) => {
  await delay(100);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const item = items.find((i) => i.inventoryItemId === id);
  if (!item) return { success: false, message: "Không tìm thấy vật tư" };
  return { success: true, data: item };
};

export const createInventoryItem = async (data: Partial<InventoryItemModel>) => {
  await delay(150);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const newItem: InventoryItemModel = {
    inventoryItemId: Date.now(),
    organizationId: 125,
    organizationCode: "PUR",
    itemNumber: data.itemNumber || `ITEM-${Date.now()}`,
    description: data.description || "",
    longDescription: data.longDescription || "",
    primaryUnitOfMeasure: data.primaryUnitOfMeasure || "Mét khối",
    primaryUomCode: data.primaryUomCode || "M3",
    unitLength: data.unitLength,
    unitWidth: data.unitWidth,
    unitHeight: data.unitHeight,
    enabledFlag: data.enabledFlag || "Y",
    categoryName: data.categoryName || "Chưa phân loại",
    createdDate: new Date().toISOString()
  };
  items.push(newItem);
  setStorage("inv_items", items);
  return { success: true, data: newItem };
};

export const updateInventoryItem = async (id: number, data: Partial<InventoryItemModel>) => {
  await delay(150);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const idx = items.findIndex((i) => i.inventoryItemId === id);
  if (idx === -1) return { success: false, message: "Không tìm thấy vật tư để cập nhật" };
  items[idx] = { ...items[idx], ...data };
  setStorage("inv_items", items);
  return { success: true, data: items[idx] };
};

export const deleteInventoryItem = async (id: number) => {
  await delay(100);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const filtered = items.filter((i) => i.inventoryItemId !== id);
  setStorage("inv_items", filtered);
  return { success: true };
};

// 2. SUBINVENTORY & LOCATOR API
export const getSubinventories = async () => {
  await delay(100);
  const data = getStorage<SubinventoryModel[]>("inv_subinventories", initialSubinventories);
  if (data.length > 0 && !data[0].address) {
    setStorage("inv_subinventories", initialSubinventories);
    return { success: true, data: initialSubinventories };
  }
  return { success: true, data };
};

export const createSubinventory = async (data: Partial<SubinventoryModel>) => {
  await delay(100);
  const subinvs = getStorage<SubinventoryModel[]>("inv_subinventories", initialSubinventories);
  const newSub: SubinventoryModel = {
    organizationId: data.organizationId || 125,
    secondaryInventoryName: data.secondaryInventoryName || `SUB-${Date.now()}`,
    description: data.description || "",
    locatorControlCode: data.locatorControlCode || 1,
    materialAccount: data.materialAccount || 1110,
    assetInventory: data.assetInventory || 1,
    trackedQuantity: data.trackedQuantity || 1,
    address: data.address,
    contactPerson: data.contactPerson,
    phone: data.phone,
    capacityVolume: data.capacityVolume
  };
  subinvs.push(newSub);
  setStorage("inv_subinventories", subinvs);
  return { success: true, data: newSub };
};

export const getLocatorsBySubinventory = async (subCode: string) => {
  await delay(100);
  const locators = getStorage<LocatorModel[]>("inv_locators", initialLocators);
  const filtered = locators.filter((l) => l.subinventoryCode === subCode);
  return { success: true, data: filtered };
};

export const createLocator = async (data: Partial<LocatorModel>) => {
  await delay(100);
  const locators = getStorage<LocatorModel[]>("inv_locators", initialLocators);
  const newLoc: LocatorModel = {
    organizationId: 125,
    subinventoryCode: data.subinventoryCode || "",
    inventoryLocatorId: Date.now(),
    locatorCode: data.locatorCode || `LOC-${Date.now()}`,
    description: data.description || ""
  };
  locators.push(newLoc);
  setStorage("inv_locators", locators);
  return { success: true, data: newLoc };
};

// 3. ONHAND INVENTORY
export const getOnhandList = async (filters?: { subCode?: string; itemNumber?: string }) => {
  await delay(100);
  const onhands = getStorage<OnhandModel[]>("inv_onhand", initialOnhand);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const subinvs = getStorage<SubinventoryModel[]>("inv_subinventories", initialSubinventories);
  const locators = getStorage<LocatorModel[]>("inv_locators", initialLocators);
  
  let res = onhands.map((o) => {
    const item = items.find((i) => i.inventoryItemId === o.inventoryItemId);
    const sub = subinvs.find((s) => s.secondaryInventoryName === o.subinventoryCode);
    const loc = locators.find((l) => l.inventoryLocatorId === o.locatorId);
    
    const cost = o.unitCost || item?.listPrice || 100000;
    const allocated = o.allocatedQuantity || 0;
    const att = o.transactionQuantity - allocated;
    
    return {
      ...o,
      itemNumber: item?.itemNumber || "UNKNOWN",
      description: item?.description || "UNKNOWN",
      categoryName: item?.categoryName || "Gỗ Công Nghiệp",
      subinventoryDescription: sub?.description || "Kho con",
      locatorDescription: loc?.description || "Vị trí",
      allocatedQuantity: allocated,
      availableToTransact: att,
      unitCost: cost,
      totalValue: o.transactionQuantity * cost
    };
  });

  if (filters?.subCode) {
    res = res.filter((o) => o.subinventoryCode === filters.subCode);
  }
  if (filters?.itemNumber) {
    const key = filters.itemNumber.toLowerCase();
    res = res.filter((o) => o.itemNumber.toLowerCase().includes(key) || o.description.toLowerCase().includes(key));
  }

  return { success: true, data: res };
};

// 4. TRANSACTIONS & BOOKING
export const getTransactionHistory = async () => {
  await delay(100);
  return { success: true, data: getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions) };
};

export const getMiscSlips = async () => {
  await delay(100);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  // Filter for Nhập Misc (transactionTypeId: 1) or Xuất Misc (transactionTypeId: 2)
  const miscTxns = txns.filter(t => t.transactionTypeId === 1 || t.transactionTypeId === 2);
  
  // Group by documentNumber
  const groups: { [key: string]: MaterialTransactionModel[] } = {};
  miscTxns.forEach(t => {
    const docNum = t.documentNumber || `MISC-UNKNOWN`;
    if (!groups[docNum]) groups[docNum] = [];
    groups[docNum].push(t);
  });

  const slips: MiscSlipModel[] = Object.keys(groups).map(docNum => {
    const lines = groups[docNum];
    const first = lines[0];
    const totalQty = lines.reduce((sum, l) => sum + Math.abs(l.transactionQuantity), 0);
    const itemsSummary = lines.map(l => `${l.itemNumber} (${Math.abs(l.transactionQuantity)})`).join(", ");
    return {
      documentNumber: docNum,
      transactionDate: first.transactionDate,
      transactionTypeName: first.transactionTypeName,
      receivedBy: first.receivedBy,
      lineCount: lines.length,
      totalQuantity: totalQty,
      itemsSummary
    };
  });

  // Sort by date descending
  slips.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  return { success: true, data: slips };
};

export const getMiscSlipDetails = async (docNum: string) => {
  await delay(50);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const details = txns.filter(t => t.documentNumber === docNum);
  return { success: true, data: details };
};

export const getTransferSlips = async () => {
  await delay(100);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  
  // Filter for transfer types outbound records (transactionQuantity < 0) so we only count once
  const trfTxns = txns.filter(t => (t.transactionActionId === 2 || t.transactionActionId === 21) && t.transactionQuantity < 0);
  
  const groups: { [key: string]: MaterialTransactionModel[] } = {};
  trfTxns.forEach(t => {
    const shipNum = t.shipmentNumber || t.documentNumber || `TRF-UNKNOWN`;
    if (!groups[shipNum]) groups[shipNum] = [];
    groups[shipNum].push(t);
  });

  const slips: TransferSlipModel[] = Object.keys(groups).map(shipNum => {
    const lines = groups[shipNum];
    const first = lines[0];
    const totalQty = lines.reduce((sum, l) => sum + Math.abs(l.transactionQuantity), 0);
    const itemsSummary = lines.map(l => `${l.itemNumber} (${Math.abs(l.transactionQuantity)})`).join(", ");
    return {
      shipmentNumber: shipNum,
      waybillAirbill: first.waybillAirbill,
      freightCode: first.freightCode,
      transactionDate: first.transactionDate,
      transferType: first.transactionActionId === 2 ? "SUBINVENTORY" : "ORGANIZATION",
      fromSubinventory: first.subinventoryCode,
      toSubinventory: first.transferSubinventory || "",
      toOrgCode: first.transferOrganizationCode,
      lineCount: lines.length,
      totalQuantity: totalQty,
      itemsSummary
    };
  });

  slips.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  return { success: true, data: slips };
};

export const getTransferSlipDetails = async (shipmentNum: string) => {
  await delay(50);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const details = txns.filter(t => t.shipmentNumber === shipmentNum || t.documentNumber === shipmentNum);
  return { success: true, data: details };
};

export const getAccountAliases = async () => {
  await delay(50);
  return { success: true, data: getStorage<AccountAliasModel[]>("inv_aliases", initialAliases) };
};

// Luồng Nghiệp vụ 1: Lập Phiếu Nhập/Xuất Misc
export const getInventoryInterfaceBatches = async (kind?: InventoryInterfaceKind | "ALL") => {
  await delay(100);
  const batches = getStorage<InventoryInterfaceBatchModel[]>(
    "inv_interface_batches",
    initialInterfaceBatches
  );
  const filtered = kind && kind !== "ALL"
    ? batches.filter((batch) => batch.interfaceKind === kind)
    : batches;
  return { success: true, data: filtered };
};

export const getInventoryInterfaceRecords = async (batchId: string) => {
  await delay(100);
  const records = getStorage<InventoryInterfaceRecordModel[]>(
    "inv_interface_records",
    initialInterfaceRecords
  );
  return {
    success: true,
    data: records.filter((record) => record.batchId === batchId)
  };
};

export const reprocessInventoryInterfaceBatch = async (batchId: string) => {
  await delay(150);
  const batches = getStorage<InventoryInterfaceBatchModel[]>(
    "inv_interface_batches",
    initialInterfaceBatches
  );
  const records = getStorage<InventoryInterfaceRecordModel[]>(
    "inv_interface_records",
    initialInterfaceRecords
  );

  const batchIndex = batches.findIndex((batch) => batch.batchId === batchId);
  if (batchIndex === -1) {
    return { success: false, message: "Không tìm thấy batch interface." };
  }

  batches[batchIndex] = {
    ...batches[batchIndex],
    processFlag: 2,
    status: "PROCESSED",
    errorCount: 0,
    processedDate: new Date().toISOString()
  };

  const updatedRecords = records.map((record) =>
    record.batchId === batchId
      ? {
          ...record,
          processFlag: 2 as const,
          status: "PROCESSED" as const,
          errorMessage: undefined
        }
      : record
  );

  setStorage("inv_interface_batches", batches);
  setStorage("inv_interface_records", updatedRecords);
  return { success: true, data: batches[batchIndex] };
};

export const createMiscTransaction = async (data: {
  transactionType: "RECEIPT" | "ISSUE";
  aliasId: number;
  items: Array<{
    inventoryItemId: number;
    subinventoryCode: string;
    locatorId?: number;
    locatorCode?: string;
    lotNumber?: string;
    quantity: number;
    cost: number;
    reason?: string;
  }>;
  documentNumber?: string;
  receivedBy?: string;
  orgId?: number;
  transactionDate?: string;
  description?: string;
}) => {
  await delay(200);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const onhands = getStorage<OnhandModel[]>("inv_onhand", initialOnhand);
  const accounts = getStorage<TransactionAccountModel[]>("inv_accounts", initialAccounts);
  const itemsList = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const aliases = getStorage<AccountAliasModel[]>("inv_aliases", initialAliases);
  
  const alias = aliases.find((a) => a.dispositionId === data.aliasId);
  const activePeriod = 202607; // Kỳ mở mặc định
  const transactionDate = data.transactionDate || new Date().toISOString();
  const organizationId = data.orgId || 125;
  const organizationCode = organizationId === 126 ? "MFG" : "PUR";

  for (const tItem of data.items) {
    const item = itemsList.find((i) => i.inventoryItemId === tItem.inventoryItemId);
    if (!item) continue;

    // Tính toán Primary Quantity
    let primaryQty = tItem.quantity;
    if (item.primaryUomCode === "M3" && tItem.subinventoryCode === "01") {
      // Giả lập MDF quy đổi: 1 M3 = 10 Tấm.
      // Nếu đơn vị giao dịch là Tấm, lưu kho là M3.
      primaryQty = tItem.quantity / 10;
    }

    const directionMultiplier = data.transactionType === "RECEIPT" ? 1 : -1;
    const finalQuantity = tItem.quantity * directionMultiplier;
    const finalPrimaryQuantity = primaryQty * directionMultiplier;

    // 1. Thêm Material Transaction
    const newTxnId = Date.now() + Math.floor(Math.random() * 1000);
    const newTxn: MaterialTransactionModel = {
      transactionId: newTxnId,
      organizationId,
      organizationCode,
      inventoryItemId: tItem.inventoryItemId,
      itemNumber: item.itemNumber,
      subinventoryCode: tItem.subinventoryCode,
      locatorId: tItem.locatorId,
      locatorCode: tItem.locatorCode,
      transactionTypeId: data.transactionType === "RECEIPT" ? 1 : 2,
      transactionTypeName: data.transactionType === "RECEIPT" ? "Nhập kho Misc" : "Xuất kho Misc",
      transactionActionId: data.transactionType === "RECEIPT" ? 27 : 1,
      transactionQuantity: finalQuantity,
      transactionUom: data.transactionType === "RECEIPT" ? "Tam" : "Tam", // UOM demo
      primaryQuantity: finalPrimaryQuantity,
      transactionDate,
      acctPeriodId: activePeriod,
      costedFlag: "Y",
      actualCost: tItem.cost,
      transactionCost: tItem.cost,
      documentNumber: data.documentNumber,
      receivedBy: data.receivedBy,
      reason: tItem.reason || data.description,
      lotNumber: tItem.lotNumber
    };
    txns.push(newTxn);

    // 2. Cập nhật tồn kho Onhand
    const onhandIdx = onhands.findIndex(
      (o) =>
        o.inventoryItemId === tItem.inventoryItemId &&
        o.subinventoryCode === tItem.subinventoryCode &&
        (!tItem.locatorId || o.locatorId === tItem.locatorId) &&
        (!tItem.lotNumber || o.lotNumber === tItem.lotNumber)
    );

    if (onhandIdx !== -1) {
      onhands[onhandIdx].transactionQuantity += finalQuantity;
      onhands[onhandIdx].primaryTransactionQuantity += finalPrimaryQuantity;
      if (onhands[onhandIdx].transactionQuantity <= 0) {
        // Xóa khỏi onhand nếu hết tồn kho (như tài liệu mô tả)
        onhands.splice(onhandIdx, 1);
      }
    } else if (data.transactionType === "RECEIPT") {
      onhands.push({
        organizationId,
        inventoryItemId: tItem.inventoryItemId,
        subinventoryCode: tItem.subinventoryCode,
        locatorId: tItem.locatorId,
        locatorCode: tItem.locatorCode,
        lotNumber: tItem.lotNumber,
        transactionQuantity: finalQuantity,
        primaryTransactionQuantity: finalPrimaryQuantity,
        transactionUomCode: "Tam"
      });
    } else {
      // Cho phép xuất âm kho nếu नेगेटिव cấu hình (Negative_Inv_Receipt_Code = 1)
      onhands.push({
        organizationId,
        inventoryItemId: tItem.inventoryItemId,
        subinventoryCode: tItem.subinventoryCode,
        locatorId: tItem.locatorId,
        locatorCode: tItem.locatorCode,
        lotNumber: tItem.lotNumber,
        transactionQuantity: finalQuantity,
        primaryQuantity: finalPrimaryQuantity,
        transactionUomCode: "Tam"
      } as any);
    }

    // 3. Định khoản Tự động (Nợ / Có)
    const transactionValue = Math.abs(finalPrimaryQuantity * tItem.cost);
    // Bút toán Nợ (Debit)
    accounts.push({
      organizationId,
      inventoryItemId: tItem.inventoryItemId,
      itemNumber: item.itemNumber,
      transactionId: newTxnId,
      transactionDate,
      baseTransactionValue: data.transactionType === "RECEIPT" ? transactionValue : -transactionValue,
      referenceAccount: 1110,
      accountNumber: "152000",
      accountDescription: "Tài khoản nguyên vật liệu kho",
      primaryQuantity: finalPrimaryQuantity,
      accountingLineType: 1
    });
    // Bút toán Có đối ứng (Credit)
    accounts.push({
      organizationId,
      inventoryItemId: tItem.inventoryItemId,
      itemNumber: item.itemNumber,
      transactionId: newTxnId,
      transactionDate,
      baseTransactionValue: data.transactionType === "RECEIPT" ? -transactionValue : transactionValue,
      referenceAccount: alias?.distributionAccount || 1124,
      accountNumber: alias?.accountNumber || "111000",
      accountDescription: "Tài khoản đối ứng giao dịch",
      primaryQuantity: finalPrimaryQuantity,
      accountingLineType: 2
    });
  }

  setStorage("inv_transactions", txns);
  setStorage("inv_onhand", onhands);
  setStorage("inv_accounts", accounts);

  return { success: true };
};

// Luồng Nghiệp vụ 2: Chuyển kho (Nội bộ hoặc Liên đơn vị)
export const createTransferTransaction = async (data: {
  transferType: "SUBINVENTORY" | "ORGANIZATION";
  fromSubCode: string;
  toSubCode: string;
  toOrgId?: number;
  toOrgCode?: string;
  items: Array<{
    inventoryItemId: number;
    fromLocatorId?: number;
    fromLocatorCode?: string;
    toLocatorId?: number;
    toLocatorCode?: string;
    lotNumber?: string;
    quantity: number;
  }>;
  shipmentNumber?: string;
  waybill?: string;
  freightCode?: string;
  transactionDate?: string;
  description?: string;
}) => {
  await delay(200);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const onhands = getStorage<OnhandModel[]>("inv_onhand", initialOnhand);
  const accounts = getStorage<TransactionAccountModel[]>("inv_accounts", initialAccounts);
  const itemsList = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  const activePeriod = 202607;
  const transactionDate = data.transactionDate || new Date().toISOString();

  for (const tItem of data.items) {
    const item = itemsList.find((i) => i.inventoryItemId === tItem.inventoryItemId);
    if (!item) continue;

    let primaryQty = tItem.quantity;
    if (item.primaryUomCode === "M3") {
      primaryQty = tItem.quantity / 10;
    }

    const txIdOut = Date.now() + Math.floor(Math.random() * 1000);
    const txIdIn = txIdOut + 1;

    // Giao dịch Xuất (Outbound)
    const outboundTxn: MaterialTransactionModel = {
      transactionId: txIdOut,
      organizationId: 125,
      organizationCode: "PUR",
      inventoryItemId: tItem.inventoryItemId,
      itemNumber: item.itemNumber,
      subinventoryCode: data.fromSubCode,
      locatorId: tItem.fromLocatorId,
      locatorCode: tItem.fromLocatorCode,
      transactionTypeId: data.transferType === "SUBINVENTORY" ? 3 : 4,
      transactionTypeName: data.transferType === "SUBINVENTORY" ? "Chuyển kho nội bộ" : "Chuyển kho liên đơn vị (Xuất)",
      transactionActionId: data.transferType === "SUBINVENTORY" ? 2 : 21,
      transactionQuantity: -tItem.quantity,
      transactionUom: "Tam",
      primaryQuantity: -primaryQty,
      transactionDate,
      acctPeriodId: activePeriod,
      costedFlag: "Y",
      actualCost: 1000000,
      transactionCost: 1000000,
      transferTransactionId: txIdIn,
      transferSubinventory: data.toSubCode,
      transferLocatorId: tItem.toLocatorId,
      transferLocatorCode: tItem.toLocatorCode,
      transferOrganizationId: data.toOrgId,
      transferOrganizationCode: data.toOrgCode,
      shipmentNumber: data.shipmentNumber,
      waybillAirbill: data.waybill,
      freightCode: data.freightCode,
      lotNumber: tItem.lotNumber,
      reason: data.description
    };
    txns.push(outboundTxn);

    // Giao dịch Nhập (Inbound)
    const inboundTxn: MaterialTransactionModel = {
      transactionId: txIdIn,
      organizationId: data.toOrgId || 125,
      organizationCode: data.toOrgCode || "PUR",
      inventoryItemId: tItem.inventoryItemId,
      itemNumber: item.itemNumber,
      subinventoryCode: data.toSubCode,
      locatorId: tItem.toLocatorId,
      locatorCode: tItem.toLocatorCode,
      transactionTypeId: data.transferType === "SUBINVENTORY" ? 3 : 5,
      transactionTypeName: data.transferType === "SUBINVENTORY" ? "Nhập chuyển kho" : "Chuyển kho liên đơn vị (Nhập)",
      transactionActionId: data.transferType === "SUBINVENTORY" ? 2 : 12,
      transactionQuantity: tItem.quantity,
      transactionUom: "Tam",
      primaryQuantity: primaryQty,
      transactionDate,
      acctPeriodId: activePeriod,
      costedFlag: "Y",
      actualCost: 1000000,
      transactionCost: 1000000,
      transferTransactionId: txIdOut,
      transferSubinventory: data.fromSubCode,
      transferLocatorId: tItem.fromLocatorId,
      transferLocatorCode: tItem.fromLocatorCode,
      transferOrganizationId: 125,
      transferOrganizationCode: "PUR",
      shipmentNumber: data.shipmentNumber,
      waybillAirbill: data.waybill,
      freightCode: data.freightCode,
      lotNumber: tItem.lotNumber,
      reason: data.description
    };
    txns.push(inboundTxn);

    // Cập nhật Onhand xuất
    const idxOut = onhands.findIndex(
      (o) => o.inventoryItemId === tItem.inventoryItemId && o.subinventoryCode === data.fromSubCode
    );
    if (idxOut !== -1) {
      onhands[idxOut].transactionQuantity -= tItem.quantity;
      onhands[idxOut].primaryTransactionQuantity -= primaryQty;
      if (onhands[idxOut].transactionQuantity <= 0) onhands.splice(idxOut, 1);
    }

    // Cập nhật Onhand nhập
    const idxIn = onhands.findIndex(
      (o) => o.inventoryItemId === tItem.inventoryItemId && o.subinventoryCode === data.toSubCode && o.organizationId === (data.toOrgId || 125)
    );
    if (idxIn !== -1) {
      onhands[idxIn].transactionQuantity += tItem.quantity;
      onhands[idxIn].primaryTransactionQuantity += primaryQty;
    } else {
      onhands.push({
        organizationId: data.toOrgId || 125,
        inventoryItemId: tItem.inventoryItemId,
        subinventoryCode: data.toSubCode,
        locatorId: tItem.toLocatorId,
        locatorCode: tItem.toLocatorCode,
        lotNumber: tItem.lotNumber,
        transactionQuantity: tItem.quantity,
        primaryTransactionQuantity: primaryQty,
        transactionUomCode: "Tam"
      });
    }

    // Bút toán chuyển kho nội bộ
    if (data.transferType === "SUBINVENTORY") {
      const val = primaryQty * 1000000;
      accounts.push({
        organizationId: 125,
        inventoryItemId: tItem.inventoryItemId,
        itemNumber: item.itemNumber,
        transactionId: txIdOut,
        transactionDate,
        baseTransactionValue: -val,
        referenceAccount: 1110,
        accountNumber: "152000",
        accountDescription: "Xuất kho nguyên vật liệu chính",
        primaryQuantity: -primaryQty,
        accountingLineType: 1
      });
      accounts.push({
        organizationId: 125,
        inventoryItemId: tItem.inventoryItemId,
        itemNumber: item.itemNumber,
        transactionId: txIdOut,
        transactionDate,
        baseTransactionValue: val,
        referenceAccount: 1110,
        accountNumber: "152000",
        accountDescription: "Nhập kho nguyên vật liệu phụ",
        primaryQuantity: primaryQty,
        accountingLineType: 1
      });
    }
  }

  setStorage("inv_transactions", txns);
  setStorage("inv_onhand", onhands);
  setStorage("inv_accounts", accounts);

  return { success: true };
};

// 5. MOVE ORDERS (REQ & ALLOCATION)
export const getMoveOrders = async () => {
  await delay(100);
  const mo = getStorage<{ headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] }>(
    "inv_move_orders",
    initialMoveOrders
  );
  return { success: true, data: mo.headers };
};

export const getMoveOrderLines = async (headerId: number) => {
  await delay(100);
  const mo = getStorage<{ headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] }>(
    "inv_move_orders",
    initialMoveOrders
  );
  const lines = mo.lines.filter((l) => l.headerId === headerId);
  return { success: true, data: lines };
};

export const createMoveOrder = async (data: {
  description: string;
  dateRequired: string;
  items: Array<{ inventoryItemId: number; quantity: number; fromSub?: string; toSub?: string }>;
}) => {
  await delay(150);
  const mo = getStorage<{ headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] }>(
    "inv_move_orders",
    initialMoveOrders
  );
  const itemsList = getStorage<InventoryItemModel[]>("inv_items", initialItems);
  
  const headerId = Date.now();
  const reqNum = `MO-202607-${Math.floor(Math.random() * 9000 + 1000)}`;

  const newHeader: MoveOrderHeaderModel = {
    organizationId: 125,
    headerId,
    requestNumber: reqNum,
    moveOrderType: 1,
    description: data.description,
    dateRequired: data.dateRequired,
    headerStatus: 2, // Pending Approval
    creationDate: new Date().toISOString()
  };

  const newLines: MoveOrderLineModel[] = data.items.map((i, index) => {
    const item = itemsList.find((it) => it.inventoryItemId === i.inventoryItemId);
    let primaryQty = i.quantity;
    if (item?.primaryUomCode === "M3") primaryQty = i.quantity / 10;
    
    return {
      organizationId: 125,
      headerId,
      lineId: headerId * 10 + index,
      lineNumber: index + 1,
      inventoryItemId: i.inventoryItemId,
      itemNumber: item?.itemNumber || "UNKNOWN",
      uomCode: "Tam",
      quantity: i.quantity,
      quantityDelivered: 0,
      lineStatus: 2, // Pending
      fromSubinventoryCode: i.fromSub,
      toSubinventoryCode: i.toSub,
      primaryQuantity: primaryQty
    };
  });

  mo.headers.push(newHeader);
  mo.lines.push(...newLines);
  setStorage("inv_move_orders", mo);

  return { success: true, data: newHeader };
};

// Phê duyệt và cấp phát Move Order
export const approveMoveOrder = async (headerId: number) => {
  await delay(100);
  const mo = getStorage<{ headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] }>(
    "inv_move_orders",
    initialMoveOrders
  );
  
  const hIdx = mo.headers.findIndex((h) => h.headerId === headerId);
  if (hIdx !== -1) {
    mo.headers[hIdx].headerStatus = 3; // Approved
  }
  
  mo.lines.forEach((l, idx) => {
    if (l.headerId === headerId) {
      mo.lines[idx].lineStatus = 3; // Approved
    }
  });

  setStorage("inv_move_orders", mo);
  return { success: true };
};

// Thực hiện xuất kho Move Order (Transact)
export const transactMoveOrder = async (headerId: number) => {
  await delay(200);
  const mo = getStorage<{ headers: MoveOrderHeaderModel[]; lines: MoveOrderLineModel[] }>(
    "inv_move_orders",
    initialMoveOrders
  );
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const onhands = getStorage<OnhandModel[]>("inv_onhand", initialOnhand);
  const activePeriod = 202607;
  const transactionDate = new Date().toISOString();

  const lines = mo.lines.filter((l) => l.headerId === headerId && l.lineStatus === 3);

  for (const line of lines) {
    // Trừ kho xuất
    if (line.fromSubinventoryCode) {
      const idx = onhands.findIndex(
        (o) => o.inventoryItemId === line.inventoryItemId && o.subinventoryCode === line.fromSubinventoryCode
      );
      if (idx !== -1) {
        onhands[idx].transactionQuantity -= line.quantity;
        onhands[idx].primaryTransactionQuantity -= line.primaryQuantity;
        if (onhands[idx].transactionQuantity <= 0) onhands.splice(idx, 1);
      }
    }

    // Cộng kho nhập
    if (line.toSubinventoryCode) {
      const idx = onhands.findIndex(
        (o) => o.inventoryItemId === line.inventoryItemId && o.subinventoryCode === line.toSubinventoryCode
      );
      if (idx !== -1) {
        onhands[idx].transactionQuantity += line.quantity;
        onhands[idx].primaryTransactionQuantity += line.primaryQuantity;
      } else {
        onhands.push({
          organizationId: 125,
          inventoryItemId: line.inventoryItemId,
          subinventoryCode: line.toSubinventoryCode,
          transactionQuantity: line.quantity,
          primaryTransactionQuantity: line.primaryQuantity,
          transactionUomCode: line.uomCode
        });
      }
    }

    // Lưu giao dịch
    const txId = Date.now() + Math.floor(Math.random() * 1000);
    txns.push({
      transactionId: txId,
      organizationId: 125,
      organizationCode: "PUR",
      inventoryItemId: line.inventoryItemId,
      itemNumber: line.itemNumber,
      subinventoryCode: line.fromSubinventoryCode || "01",
      transactionTypeId: 12,
      transactionTypeName: "Xuất kho sản xuất (WIP Issue)",
      transactionActionId: 1, // Issue
      transactionQuantity: -line.quantity,
      transactionUom: line.uomCode,
      primaryQuantity: -line.primaryQuantity,
      transactionDate,
      acctPeriodId: activePeriod,
      costedFlag: "Y",
      actualCost: 1000000,
      transactionCost: 1000000,
      documentNumber: `MO-TXN-${headerId}`
    });

    // Cập nhật trạng thái line
    const lineIdx = mo.lines.findIndex((l) => l.lineId === line.lineId);
    if (lineIdx !== -1) {
      mo.lines[lineIdx].quantityDelivered = line.quantity;
      mo.lines[lineIdx].lineStatus = 5; // Closed
    }
  }

  // Cập nhật trạng thái header
  const hIdx = mo.headers.findIndex((h) => h.headerId === headerId);
  if (hIdx !== -1) {
    mo.headers[hIdx].headerStatus = 5; // Closed
  }

  setStorage("inv_move_orders", mo);
  setStorage("inv_onhand", onhands);
  setStorage("inv_transactions", txns);

  return { success: true };
};

// 6. ACCOUNTING PERIODS API
export const getAccountingPeriods = async () => {
  await delay(100);
  return { success: true, data: getStorage<PeriodModel[]>("inv_periods", initialPeriods) };
};

export const openAccountingPeriod = async (year: number, num: number, name: string) => {
  await delay(100);
  const periods = getStorage<PeriodModel[]>("inv_periods", initialPeriods);
  const newPeriod: PeriodModel = {
    organizationId: 125,
    acctPeriodId: year * 100 + num,
    periodYear: year,
    periodNum: num,
    periodName: name,
    description: `Kỳ kế toán tháng ${num}/${year}`,
    periodStartDate: `${year}-${num < 10 ? "0" + num : num}-01`,
    scheduleCloseDate: `${year}-${num < 10 ? "0" + num : num}-28`,
    openFlag: "Y"
  };
  periods.push(newPeriod);
  setStorage("inv_periods", periods);
  return { success: true, data: newPeriod };
};

export const closeAccountingPeriod = async (periodId: number) => {
  await delay(150);
  const periods = getStorage<PeriodModel[]>("inv_periods", initialPeriods);
  const pIdx = periods.findIndex((p) => p.acctPeriodId === periodId);
  if (pIdx === -1) return { success: false, message: "Kỳ kế toán không tồn tại" };
  
  // Giả lập check giao dịch chưa định khoản
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const pendingTx = txns.filter((t) => t.acctPeriodId === periodId && t.costedFlag !== "Y");
  if (pendingTx.length > 0) {
    return { 
      success: false, 
      message: `Không thể đóng kỳ. Còn ${pendingTx.length} giao dịch chưa hoàn tất định khoản.` 
    };
  }

  periods[pIdx].openFlag = "N";
  periods[pIdx].periodCloseDate = new Date().toISOString();
  setStorage("inv_periods", periods);
  return { success: true };
};

// 7. COST ACCOUNTING VIEWER
export const getTransactionAccounts = async () => {
  await delay(100);
  return { success: true, data: getStorage<TransactionAccountModel[]>("inv_accounts", initialAccounts) };
};

// 8. BÁO CÁO NHẬP - XUẤT - TỒN (NXT)
export const getNxtReport = async (filters?: { periodId?: number; subCode?: string }) => {
  await delay(100);
  const txns = getStorage<MaterialTransactionModel[]>("inv_transactions", initialTransactions);
  const items = getStorage<InventoryItemModel[]>("inv_items", initialItems);

  const activePeriod = filters?.periodId || 202607;

  const report: NxtReportModel[] = items.map((item) => {
    const prevTxns = txns.filter(
      (t) =>
        t.inventoryItemId === item.inventoryItemId &&
        t.acctPeriodId < activePeriod &&
        (!filters?.subCode || t.subinventoryCode === filters.subCode)
    );
    const beginQty = prevTxns.reduce((sum, t) => sum + t.transactionQuantity, 0);
    const beginValue = prevTxns.reduce((sum, t) => {
      const cost = t.transactionCost || item.listPrice || 100000;
      return sum + t.transactionQuantity * cost;
    }, 0);

    const periodTxns = txns.filter(
      (t) =>
        t.inventoryItemId === item.inventoryItemId &&
        t.acctPeriodId === activePeriod &&
        (!filters?.subCode || t.subinventoryCode === filters.subCode)
    );

    const inTxns = periodTxns.filter((t) => t.transactionQuantity > 0);
    const inQty = inTxns.reduce((sum, t) => sum + t.transactionQuantity, 0);
    const inValue = inTxns.reduce((sum, t) => {
      const cost = t.transactionCost || item.listPrice || 100000;
      return sum + t.transactionQuantity * cost;
    }, 0);

    const outTxns = periodTxns.filter((t) => t.transactionQuantity < 0);
    const outQty = Math.abs(outTxns.reduce((sum, t) => sum + t.transactionQuantity, 0));
    const outValue = Math.abs(
      outTxns.reduce((sum, t) => {
        const cost = t.transactionCost || item.listPrice || 100000;
        return sum + t.transactionQuantity * cost;
      }, 0)
    );

    return {
      inventoryItemId: item.inventoryItemId,
      itemNumber: item.itemNumber,
      description: item.description,
      primaryUomCode: item.primaryUomCode === "M3" ? "Tấm" : item.primaryUomCode,
      beginQty,
      beginValue,
      inQty,
      inValue,
      outQty,
      outValue,
      endQty: beginQty + inQty - outQty,
      endValue: beginValue + inValue - outValue,
    };
  });

  return { success: true, data: report };
};

// Migration check: Bổ sung dữ liệu mẫu chuyển kho nếu chưa có trong localStorage
try {
  const currentTxns = localStorage.getItem("inv_transactions");
  if (currentTxns) {
    const parsed = JSON.parse(currentTxns) as any[];
    if (Array.isArray(parsed) && !parsed.some(t => t.transactionActionId === 2 || t.transactionActionId === 21)) {
      const transfers = initialTransactions.filter(t => t.transactionActionId === 2 || t.transactionActionId === 21 || t.transactionActionId === 12);
      localStorage.setItem("inv_transactions", JSON.stringify([...parsed, ...transfers]));
    }
  }
} catch (e) {
  console.error("Migration error:", e);
}

