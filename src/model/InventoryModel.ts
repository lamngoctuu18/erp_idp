export interface UomModel {
  uomCode: string;
  unitOfMeasure: string;
  uomClass: string;
  baseUomFlag: "Y" | "N";
  description: string;
}

export interface UomClassModel {
  uomClass: string;
  uomClassTL: string;
  description: string;
  disableDate?: string;
}

export interface UomConversionModel {
  inventoryItemId: number;
  uomCode: string;
  uomClass: string;
  conversionRate: number;
  disableDate?: string;
}

export interface UomClassConversionModel {
  inventoryItemId: number;
  fromUomCode: string;
  fromUomClass: string;
  toUomCode: string;
  toUomClass: string;
  conversionRate: number;
  disableDate?: string;
}

export interface InventoryItemModel {
  inventoryItemId: number;
  organizationId: number;
  organizationCode: string;
  itemNumber: string;
  description: string;
  longDescription?: string;
  primaryUnitOfMeasure: string;
  primaryUomCode: string;
  unitLength?: number;
  unitWidth?: number;
  unitHeight?: number;
  enabledFlag: "Y" | "N";
  categoryName?: string;
  createdDate?: string;
  // Các thuộc tính mở rộng chuẩn Enterprise ERP
  itemType?: string; // RAW_MATERIAL, FINISHED_GOOD, SEMI_FINISHED, EXPENSE
  secondaryUomCode?: string;
  locatorControlCode?: number; // 1: None, 2: Predefined, 3: Dynamic
  lotControlCode?: number; // 1: No, 2: Yes
  serialControlCode?: number; // 1: No, 2: Yes
  purchasableFlag?: "Y" | "N";
  customerOrderEnabledFlag?: "Y" | "N";
  listPrice?: number;
  receiptRoutingId?: number; // 1: Direct Deliver, 2: Standard Receipt, 3: Inspection Required
  costingEnabledFlag?: "Y" | "N";
  costingMethod?: string; // AVERAGE, STANDARD, FIFO
  valuationAccount?: string;
  cogsAccount?: string;
  salesAccount?: string;
}

export interface SubinventoryModel {
  organizationId: number;
  secondaryInventoryName: string;
  description: string;
  locatorControlCode: number; // 1: None, 2: Pre-defined, 3: Dynamic
  materialAccount?: number;
  assetInventory: number; // 1: Asset, 2: Expense
  trackedQuantity: number; // 1: Yes, 2: No
  disableDate?: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  capacityVolume?: number;
}

export interface LocatorModel {
  organizationId: number;
  subinventoryCode: string;
  inventoryLocatorId: number;
  locatorCode: string;
  description: string;
  disableDate?: string;
}

export interface OnhandModel {
  organizationId: number;
  inventoryItemId: number;
  subinventoryCode: string;
  locatorId?: number;
  locatorCode?: string;
  lotNumber?: string;
  transactionQuantity: number;
  primaryTransactionQuantity: number;
  transactionUomCode: string;
  // Bổ sung thuộc tính báo cáo chuẩn Enterprise
  itemNumber?: string;
  description?: string;
  categoryName?: string;
  subinventoryDescription?: string;
  locatorDescription?: string;
  lotExpirationDate?: string;
  allocatedQuantity?: number;
  availableToTransact?: number;
  unitCost?: number;
  totalValue?: number;
}

export interface MaterialTransactionModel {
  transactionId: number;
  organizationId: number;
  organizationCode: string;
  inventoryItemId: number;
  itemNumber: string;
  subinventoryCode: string;
  locatorId?: number;
  locatorCode?: string;
  transactionTypeId: number;
  transactionTypeName: string;
  transactionActionId: number; // 1: Issue, 2: Subinv Transfer, 3: Direct Org Transfer, etc.
  transactionSourceTypeId?: number;
  transactionSourceId?: number;
  transactionSourceName?: string;
  transactionQuantity: number;
  transactionUom: string;
  primaryQuantity: number;
  transactionDate: string;
  acctPeriodId: number;
  costedFlag: "Y" | "N" | "E";
  actualCost: number;
  transactionCost: number;
  transferTransactionId?: number;
  transferOrganizationId?: number;
  transferOrganizationCode?: string;
  transferSubinventory?: string;
  transferLocatorId?: number;
  transferLocatorCode?: string;
  shipmentNumber?: string;
  waybillAirbill?: string;
  freightCode?: string;
  lotNumber?: string;
  documentNumber?: string; // attribute15
  receivedBy?: string; // attribute14
  reason?: string; // attribute13
  errorCode?: string;
  errorExplanation?: string;
}

export interface MoveOrderHeaderModel {
  organizationId: number;
  headerId: number;
  requestNumber: string;
  moveOrderType: number; // 1: Requisition, 2: Replenishment, 3: Pick Wave
  description: string;
  dateRequired: string;
  headerStatus: number; // 1: Incomplete, 2: Pending Approval, 3: Approved, 4: Rejected, 5: Closed, 6: Canceled
  creationDate: string;
}

export interface MoveOrderLineModel {
  organizationId: number;
  headerId: number;
  lineId: number;
  lineNumber: number;
  inventoryItemId: number;
  itemNumber: string;
  uomCode: string;
  quantity: number;
  quantityDelivered: number;
  lineStatus: number;
  fromSubinventoryCode?: string;
  toSubinventoryCode?: string;
  primaryQuantity: number;
}

export interface PeriodModel {
  organizationId: number;
  acctPeriodId: number;
  periodYear: number;
  periodNum: number;
  periodName: string;
  description: string;
  periodStartDate: string;
  scheduleCloseDate: string;
  periodCloseDate?: string;
  openFlag: "Y" | "N";
}

export interface TransactionAccountModel {
  organizationId: number;
  inventoryItemId: number;
  itemNumber: string;
  transactionId: number;
  transactionDate: string;
  baseTransactionValue: number; // >0 is Debit, <0 is Credit
  referenceAccount: number;
  accountNumber: string;
  accountDescription: string;
  primaryQuantity: number;
  accountingLineType: number; // 1: Material, 2: Offset, etc.
}

export interface AccountAliasModel {
  organizationId: number;
  dispositionId: number;
  description: string;
  distributionAccount: number;
  accountNumber: string;
  enabledFlag: "Y" | "N";
}

export interface MiscSlipModel {
  documentNumber: string;
  transactionDate: string;
  transactionTypeName: string;
  receivedBy?: string;
  lineCount: number;
  totalQuantity: number;
  itemsSummary: string;
}

export interface TransferSlipModel {
  shipmentNumber: string;
  waybillAirbill?: string;
  freightCode?: string;
  transactionDate: string;
  transferType: "SUBINVENTORY" | "ORGANIZATION";
  fromSubinventory: string;
  toSubinventory: string;
  toOrgCode?: string;
  lineCount: number;
  totalQuantity: number;
  itemsSummary: string;
}

// Báo cáo Nhập-Xuất-Tồn
export interface NxtReportModel {
  inventoryItemId: number;
  itemNumber: string;
  description: string;
  primaryUomCode: string;
  beginQty: number;
  beginValue: number;
  inQty: number;
  inValue: number;
  outQty: number;
  outValue: number;
  endQty: number;
  endValue: number;
}

export type InventoryInterfaceKind = "ITEM" | "TRANSACTION";

export type InventoryInterfaceStatus = "PENDING" | "PROCESSED" | "ERROR";

export interface InventoryInterfaceBatchModel {
  batchId: string;
  interfaceKind: InventoryInterfaceKind;
  sourceCode: string;
  setProcessId?: number;
  transactionMode?: 2 | 3;
  processFlag: 1 | 2 | 3;
  status: InventoryInterfaceStatus;
  recordCount: number;
  errorCount: number;
  createdDate: string;
  processedDate?: string;
  owner: string;
  description: string;
}

export interface InventoryInterfaceRecordModel {
  batchId: string;
  interfaceName: string;
  interfaceId: number;
  sourceHeaderId?: number;
  sourceLineId?: number;
  organizationCode: string;
  itemNumber?: string;
  subinventoryCode?: string;
  transactionType?: string;
  transactionQuantity?: number;
  transactionUom?: string;
  lotNumber?: string;
  processFlag: 1 | 2 | 3;
  status: InventoryInterfaceStatus;
  errorMessage?: string;
}

