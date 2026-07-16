import { ApInvoice, ApInvoiceLine, ApInvoiceDistribution, ApInvoiceMatch, ApInvoiceBatch, ApInvoiceChargeAllocation, ApInvoiceHold, ApHoldDefinition, ApPrepaymentApplication } from "../../model/ApInvoiceMasterModel";
import { ServiceResponse } from "../sharedConfig/sharedConfigMockService";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  INVOICES: "ap_invoices_v3",
  LINES: "ap_invoice_lines_v3",
  DISTRIBUTIONS: "ap_invoice_distributions_v3",
  MATCHES: "ap_invoice_matches_v3",
  BATCHES: "ap_invoice_batches_v3",
  CHARGES: "ap_invoice_charges_v3",
  HOLDS: "ap_invoice_holds_v3",
  HOLD_DEFS: "ap_hold_definitions_v3",
  PREPAY_APPS: "ap_prepayment_applications_v3",
  INITIALIZED: "ap_invoice_db_initialized_v3"
};

export const initializeApInvoiceDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  const defaultHoldDefs: ApHoldDefinition[] = [
    { holdCode: "QTY REC", holdName: "Sai lệch số lượng nhận", holdReason: "Số lượng trên hóa đơn vượt quá số lượng thực tế nhập kho trên phiếu Receipt", systemFlag: "Y", manualReleaseAllowedFlag: "Y", activeFlag: "Y", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" },
    { holdCode: "PRICE", holdName: "Sai lệch đơn giá", holdReason: "Đơn giá trên hóa đơn cao hơn đơn giá thỏa thuận trên đơn mua hàng PO", systemFlag: "Y", manualReleaseAllowedFlag: "Y", activeFlag: "Y", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" },
    { holdCode: "CURRENCY", holdName: "Lỗi đồng tiền", holdReason: "Đồng tiền thanh toán khác với đồng tiền đã ký kết hợp đồng", systemFlag: "Y", manualReleaseAllowedFlag: "N", activeFlag: "Y", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" },
    { holdCode: "MANUAL HOLD", holdName: "Khóa giữ thủ công", holdReason: "Chặn thanh toán tạm thời do đang tranh chấp chất lượng hàng hóa", systemFlag: "N", manualReleaseAllowedFlag: "Y", activeFlag: "Y", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" },
    { holdCode: "PENDING TAX", holdName: "Chờ thẩm định hóa đơn VAT", holdReason: "Đang chờ nhà cung cấp xuất lại hóa đơn thay thế do sai thông tin thuế", systemFlag: "N", manualReleaseAllowedFlag: "Y", activeFlag: "Y", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" }
  ];

  const defaultBatches: ApInvoiceBatch[] = [
    { batchId: 101, batchName: "Lô hóa đơn mua sữa tươi tháng 7", batchStatus: "APPROVED", estimatedAmount: 1500000000, actualAmount: 1500000000, invoiceCount: 5, actualInvoiceCount: 5, creationDate: "2026-07-01T00:00:00.000Z", createdBy: 1, invoiceCurrencyCode: "VND", paymentTermId: 1, payGroup: "DOMESTIC SUPPLIER" },
    { batchId: 102, batchName: "Lô hóa đơn vận chuyển kho miền Nam", batchStatus: "PENDING", estimatedAmount: 450000000, actualAmount: 380000000, invoiceCount: 3, actualInvoiceCount: 2, creationDate: "2026-07-05T00:00:00.000Z", createdBy: 1, invoiceCurrencyCode: "VND", paymentTermId: 2, payGroup: "DOMESTIC SERVICE" },
    { batchId: 103, batchName: "Lô hóa đơn nguyên liệu nhập khẩu", batchStatus: "PENDING", estimatedAmount: 50000, actualAmount: 10000, invoiceCount: 2, actualInvoiceCount: 1, creationDate: "2026-07-10T00:00:00.000Z", createdBy: 1, invoiceCurrencyCode: "USD", paymentTermId: 3, payGroup: "FOREIGN SUPPLIER" },
    { batchId: 104, batchName: "Lô hóa đơn điện nước văn phòng", batchStatus: "PENDING", estimatedAmount: 85000000, actualAmount: 85000000, invoiceCount: 2, actualInvoiceCount: 2, creationDate: "2026-07-12T00:00:00.000Z", createdBy: 1, invoiceCurrencyCode: "VND", paymentTermId: 1, payGroup: "UTILITIES" },
    { batchId: 105, batchName: "Lô hóa đơn hoa hồng đại lý Q2/2026", batchStatus: "CLOSED", estimatedAmount: 650000000, actualAmount: 650000000, invoiceCount: 4, actualInvoiceCount: 4, creationDate: "2026-07-15T00:00:00.000Z", createdBy: 1, invoiceCurrencyCode: "VND", paymentTermId: 2, payGroup: "COMMISSION" }
  ];

  const defaultInvoices: ApInvoice[] = [
    { setOfBooksId: 1, orgId: 10, batchId: 101, vendorId: 1, vendorSiteId: 201, invoiceId: 10001, invoiceNum: "VNM-2607-001", invoiceDate: "2026-07-01", invoiceCurrencyCode: "VND", exchangeRate: 1, invoiceAmount: 500000000, baseAmount: 500000000, invoiceTypeLookupCode: "STANDARD", description: "Hóa đơn sữa tươi TH true Milk đợt 1", termsId: 1, termsDate: "2026-07-01", paymentCurrencyCode: "VND", paymentMethodLookupCode: "WIRE", prepayFlag: "N", amountPaid: 150000000, cancelledAmount: 0, discountAmountTaken: 0, taxAmount: 50000000, acctsPayCodeCombinationId: 33101, status: "VALIDATED", lastUpdatedBy: 1, lastUpdateDate: "2026-07-01", createdBy: 1, creationDate: "2026-07-01", poNumber: "PO-2026-0091", validationStatus: "Y", accountingStatus: "Y", cancelledFlag: "N", cancelDate: null, cancelGlDate: null, remainingAmount: 350000000 },
    { setOfBooksId: 1, orgId: 10, batchId: 101, vendorId: 2, vendorSiteId: 202, invoiceId: 10002, invoiceNum: "PLX-2607-482", invoiceDate: "2026-07-03", invoiceCurrencyCode: "VND", exchangeRate: 1, invoiceAmount: 450000000, baseAmount: 450000000, invoiceTypeLookupCode: "STANDARD", description: "Hóa đơn xăng dầu vận tải nội bộ", termsId: 2, termsDate: "2026-07-03", paymentCurrencyCode: "VND", paymentMethodLookupCode: "WIRE", prepayFlag: "N", amountPaid: 450000000, cancelledAmount: 0, discountAmountTaken: 9000000, taxAmount: 45000000, acctsPayCodeCombinationId: 33101, status: "VALIDATED", lastUpdatedBy: 1, lastUpdateDate: "2026-07-03", createdBy: 1, creationDate: "2026-07-03", poNumber: "PO-2026-0092", validationStatus: "Y", accountingStatus: "Y", cancelledFlag: "N", cancelDate: null, cancelGlDate: null, remainingAmount: 0 },
    { setOfBooksId: 1, orgId: 10, batchId: 102, vendorId: 3, vendorSiteId: 203, invoiceId: 10003, invoiceNum: "KO-2607-009", invoiceDate: "2026-07-06", invoiceCurrencyCode: "VND", exchangeRate: 1, invoiceAmount: 180000000, baseAmount: 180000000, invoiceTypeLookupCode: "STANDARD", description: "Hóa đơn nguyên liệu hương liệu Coca", termsId: 1, termsDate: "2026-07-06", paymentCurrencyCode: "VND", paymentMethodLookupCode: "WIRE", prepayFlag: "N", amountPaid: 80000000, cancelledAmount: 0, discountAmountTaken: 0, taxAmount: 18000000, acctsPayCodeCombinationId: 33102, status: "VALIDATED", lastUpdatedBy: 1, lastUpdateDate: "2026-07-06", createdBy: 1, creationDate: "2026-07-06", poNumber: null, validationStatus: "Y", accountingStatus: "Y", cancelledFlag: "N", cancelDate: null, cancelGlDate: null, remainingAmount: 100000000 },
    { setOfBooksId: 1, orgId: 10, batchId: 102, vendorId: 4, vendorSiteId: 204, invoiceId: 10004, invoiceNum: "VIC-2607-112", invoiceDate: "2026-07-09", invoiceCurrencyCode: "VND", exchangeRate: 1, invoiceAmount: 200000000, baseAmount: 200000000, invoiceTypeLookupCode: "STANDARD", description: "Hóa đơn thuê văn phòng Landmark", termsId: 3, termsDate: "2026-07-09", paymentCurrencyCode: "VND", paymentMethodLookupCode: "CASH", prepayFlag: "N", amountPaid: 0, cancelledAmount: 0, discountAmountTaken: 0, taxAmount: 20000000, acctsPayCodeCombinationId: 33101, status: "NEEDS_REVALIDATION", lastUpdatedBy: 1, lastUpdateDate: "2026-07-09", createdBy: 1, creationDate: "2026-07-09", poNumber: null, validationStatus: "N", accountingStatus: "N", cancelledFlag: "N", cancelDate: null, cancelGlDate: null, remainingAmount: 200000000 },
    { setOfBooksId: 1, orgId: 10, batchId: null, vendorId: 1, vendorSiteId: 201, invoiceId: 10005, invoiceNum: "TẠM-ỨNG-VNM-01", invoiceDate: "2026-07-12", invoiceCurrencyCode: "USD", exchangeRate: 25000, invoiceAmount: 12000, baseAmount: 300000000, invoiceTypeLookupCode: "PREPAYMENT", description: "Tạm ứng mua bột sữa nhập khẩu", termsId: 3, termsDate: "2026-07-12", paymentCurrencyCode: "USD", paymentMethodLookupCode: "WIRE", prepayFlag: "Y", amountPaid: 10000, cancelledAmount: 0, discountAmountTaken: 0, taxAmount: 0, acctsPayCodeCombinationId: 33101, status: "VALIDATED", lastUpdatedBy: 1, lastUpdateDate: "2026-07-12", createdBy: 1, creationDate: "2026-07-12", poNumber: "PO-2026-0099", validationStatus: "Y", accountingStatus: "Y", cancelledFlag: "N", cancelDate: null, cancelGlDate: null, remainingAmount: 2000 }
  ];

  const defaultLines: ApInvoiceLine[] = [
    { setOfBooksId: 1, orgId: 10, invoiceId: 10001, invoiceLineId: 20001, rcvTransactionId: 7001, poLineId: 8001, itemId: 301, itemCode: "MILK-RAW", itemName: "Sữa tươi nguyên chất", uomId: 5, quantity: 20000, price: 22500, amount: 450000000, baseAmount: 450000000, periodName: null, accountingDate: null, accountingEventId: null, lineLineNumber: 1, distCodeCombinationId: 62701, lineTypeLookupCode: "ITEM", prepayLineId: null, prepayAmountRemaining: null, discountProgram: null, discountAmount: null, vatTaxCode: "VAT10", vatTaxAmount: 45000000, feeAmount: null, importTaxCode: null, importAmount: null, specialConsumptionTaxCode: null, specialConsumptionTaxAmount: null, description: "Chi tiết dòng sữa tươi", lastUpdatedBy: 1, lastUpdateDate: "2026-07-01", createdBy: 1, creationDate: "2026-07-01", poNumber: "PO-2026-0091", receiptNum: "REC-99201", matchStatus: "MATCHED" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10001, invoiceLineId: 20002, rcvTransactionId: null, poLineId: null, itemId: null, itemCode: "TAX-VAT", itemName: "Thuế giá trị gia tăng 10%", uomId: null, quantity: null, price: null, amount: 50000000, baseAmount: 50000000, periodName: null, accountingDate: null, accountingEventId: null, lineLineNumber: 2, distCodeCombinationId: 13301, lineTypeLookupCode: "TAX", prepayLineId: null, prepayAmountRemaining: null, discountProgram: null, discountAmount: null, vatTaxCode: null, vatTaxAmount: null, feeAmount: null, importTaxCode: null, importAmount: null, specialConsumptionTaxCode: null, specialConsumptionTaxAmount: null, description: "Thuế VAT phân bổ", lastUpdatedBy: 1, lastUpdateDate: "2026-07-01", createdBy: 1, creationDate: "2026-07-01", poNumber: null, receiptNum: null, matchStatus: null },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10002, invoiceLineId: 20003, rcvTransactionId: 7002, poLineId: 8002, itemId: 302, itemCode: "GAS-RON95", itemName: "Xăng RON 95", uomId: 6, quantity: 20000, price: 20250, amount: 405000000, baseAmount: 405000000, periodName: null, accountingDate: null, accountingEventId: null, lineLineNumber: 1, distCodeCombinationId: 64101, lineTypeLookupCode: "ITEM", prepayLineId: null, prepayAmountRemaining: null, discountProgram: null, discountAmount: null, vatTaxCode: "VAT10", vatTaxAmount: 40500000, feeAmount: null, importTaxCode: null, importAmount: null, specialConsumptionTaxCode: null, specialConsumptionTaxAmount: null, description: "Xăng dầu cho đội xe", lastUpdatedBy: 1, lastUpdateDate: "2026-07-03", createdBy: 1, creationDate: "2026-07-03", poNumber: "PO-2026-0092", receiptNum: "REC-99202", matchStatus: "MATCHED" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10003, invoiceLineId: 20004, rcvTransactionId: null, poLineId: null, itemId: 303, itemCode: "FLAVOR-COCA", itemName: "Hương liệu Coca tự nhiên", uomId: 7, quantity: 100, price: 1620000, amount: 162000000, baseAmount: 162000000, periodName: null, accountingDate: null, accountingEventId: null, lineLineNumber: 1, distCodeCombinationId: 62702, lineTypeLookupCode: "ITEM", prepayLineId: null, prepayAmountRemaining: null, discountProgram: null, discountAmount: null, vatTaxCode: "VAT10", vatTaxAmount: 16200000, feeAmount: null, importTaxCode: null, importAmount: null, specialConsumptionTaxCode: null, specialConsumptionTaxAmount: null, description: "Nguyên liệu pha chế", lastUpdatedBy: 1, lastUpdateDate: "2026-07-06", createdBy: 1, creationDate: "2026-07-06", poNumber: null, receiptNum: null, matchStatus: null },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10005, invoiceLineId: 20005, rcvTransactionId: null, poLineId: null, itemId: null, itemCode: "PREPAY-RAW", itemName: "Bột sữa nhập khẩu (Tạm ứng)", uomId: null, quantity: null, price: null, amount: 12000, baseAmount: 300000000, periodName: null, accountingDate: null, accountingEventId: null, lineLineNumber: 1, distCodeCombinationId: 33103, lineTypeLookupCode: "ITEM", prepayLineId: null, prepayAmountRemaining: 2000, discountProgram: null, discountAmount: null, vatTaxCode: null, vatTaxAmount: null, feeAmount: null, importTaxCode: null, importAmount: null, specialConsumptionTaxCode: null, specialConsumptionTaxAmount: null, description: "Dòng tạm ứng nhà cung cấp", lastUpdatedBy: 1, lastUpdateDate: "2026-07-12", createdBy: 1, creationDate: "2026-07-12", poNumber: "PO-2026-0099", receiptNum: null, matchStatus: null }
  ];

  const defaultDistributions: ApInvoiceDistribution[] = [
    { setOfBooksId: 1, orgId: 10, invoiceId: 10001, id: 30001, rcvTransactionId: 7001, poDistributionId: 9001, periodName: "JUL-26", accountingDate: "2026-07-01", accountingEventId: 901, distributionLineNumber: 1, drCcid: 62701, crCcid: 33101, lineType: "ITEM", amount: 450000000, baseAmount: 450000000, prepayDistributionId: null, prepayAmountRemaining: null, description: "Phân bổ tiền sữa tươi", lastUpdateBy: 1, lastUpdateDate: "2026-07-01", createBy: 1, createDate: "2026-07-01", invoiceLineId: 20001, taxType: null, voucherNumber: "PC-00928", vendorTaxCode: null },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10001, id: 30002, rcvTransactionId: null, poDistributionId: null, periodName: "JUL-26", accountingDate: "2026-07-01", accountingEventId: 901, distributionLineNumber: 2, drCcid: 13301, crCcid: 33101, lineType: "TAX", amount: 50000000, baseAmount: 50000000, prepayDistributionId: null, prepayAmountRemaining: null, description: "Phân bổ thuế VAT sữa tươi", lastUpdateBy: 1, lastUpdateDate: "2026-07-01", createBy: 1, createDate: "2026-07-01", invoiceLineId: 20002, taxType: "VAT", voucherNumber: "PC-00928", vendorTaxCode: "0101243546" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10002, id: 30003, rcvTransactionId: 7002, poDistributionId: 9002, periodName: "JUL-26", accountingDate: "2026-07-03", accountingEventId: 902, distributionLineNumber: 1, drCcid: 64101, crCcid: 33101, lineType: "ITEM", amount: 405000000, baseAmount: 405000000, prepayDistributionId: null, prepayAmountRemaining: null, description: "Phân bổ xăng dầu vận tải", lastUpdateBy: 1, lastUpdateDate: "2026-07-03", createBy: 1, createDate: "2026-07-03", invoiceLineId: 20003, taxType: null, voucherNumber: "PC-00929", vendorTaxCode: null },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10003, id: 30004, rcvTransactionId: null, poDistributionId: null, periodName: "JUL-26", accountingDate: "2026-07-06", accountingEventId: 903, distributionLineNumber: 1, drCcid: 62702, crCcid: 33102, lineType: "ITEM", amount: 162000000, baseAmount: 162000000, prepayDistributionId: null, prepayAmountRemaining: null, description: "Phân bổ hương liệu Coca", lastUpdateBy: 1, lastUpdateDate: "2026-07-06", createBy: 1, createDate: "2026-07-06", invoiceLineId: 20004, taxType: null, voucherNumber: "PC-00930", vendorTaxCode: null },
    { setOfBooksId: 1, orgId: 10, invoiceId: 10005, id: 30005, rcvTransactionId: null, poDistributionId: null, periodName: "JUL-26", accountingDate: "2026-07-12", accountingEventId: 905, distributionLineNumber: 1, drCcid: 33103, crCcid: 33101, lineType: "ITEM", amount: 12000, baseAmount: 300000000, prepayDistributionId: null, prepayAmountRemaining: 2000, description: "Phân bổ tạm ứng sữa ngoại", lastUpdateBy: 1, lastUpdateDate: "2026-07-12", createBy: 1, createDate: "2026-07-12", invoiceLineId: 20005, taxType: null, voucherNumber: "PC-00932", vendorTaxCode: null }
  ];

  const defaultMatches: ApInvoiceMatch[] = [
    { matchId: 401, invoiceId: 10001, invoiceLineId: 20001, matchingType: "THREE_WAY", poHeaderId: 5001, poNumber: "PO-2026-0091", poLineId: 8001, receiptId: 6001, receiptNum: "REC-99201", receiptLineId: 6101, qtyInvoiced: 20000, unitPrice: 22500, matchAmount: 450000000, matchDate: "2026-07-01", matchStatus: "MATCHED", createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" },
    { matchId: 402, invoiceId: 10002, invoiceLineId: 20003, matchingType: "THREE_WAY", poHeaderId: 5002, poNumber: "PO-2026-0092", poLineId: 8002, receiptId: 6002, receiptNum: "REC-99202", receiptLineId: 6102, qtyInvoiced: 20000, unitPrice: 20250, matchAmount: 405000000, matchDate: "2026-07-03", matchStatus: "MATCHED", createdBy: 1, createdDate: "2026-07-03", lastUpdateBy: 1, lastUpdateDate: "2026-07-03" }
  ];

  const defaultCharges: ApInvoiceChargeAllocation[] = [
    { allocationId: 501, invoiceId: 10001, invoiceLineId: 20001, chargeType: "FREIGHT", prorateFlag: "Y", accountCcid: 62701, amount: 15000000, receiptId: null, receiptLineId: null, chargeAmount: 15000000, createdBy: 1, createdDate: "2026-07-01", lastUpdateBy: 1, lastUpdateDate: "2026-07-01" }
  ];

  const defaultHolds: ApInvoiceHold[] = [
    { holdId: 601, invoiceId: 10004, holdLookupCode: "MANUAL HOLD", holdDate: "2026-07-09T00:00:00.000Z", heldBy: 1, releaseLookupCode: null, releaseDate: null, releasedBy: null, holdReason: "Chặn thanh toán chờ kiểm nghiệm sữa chua hư hại", releaseReason: null }
  ];

  const defaultPrepayApps: ApPrepaymentApplication[] = [
    { applicationId: 701, invoiceId: 10001, prepaymentInvoiceId: 10005, amountApplied: 10000, taxAmountApplied: 0, glDate: "2026-07-12", prepaymentOnInvoiceFlag: "Y", applicationType: "APPLY", applicationDate: "2026-07-12", status: "POSTED", createdBy: 1, createdDate: "2026-07-12", lastUpdateBy: 1, lastUpdateDate: "2026-07-12" }
  ];

  localStorage.setItem(KEYS.HOLD_DEFS, JSON.stringify(defaultHoldDefs));
  localStorage.setItem(KEYS.BATCHES, JSON.stringify(defaultBatches));
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(defaultInvoices));
  localStorage.setItem(KEYS.LINES, JSON.stringify(defaultLines));
  localStorage.setItem(KEYS.DISTRIBUTIONS, JSON.stringify(defaultDistributions));
  localStorage.setItem(KEYS.MATCHES, JSON.stringify(defaultMatches));
  localStorage.setItem(KEYS.CHARGES, JSON.stringify(defaultCharges));
  localStorage.setItem(KEYS.HOLDS, JSON.stringify(defaultHolds));
  localStorage.setItem(KEYS.PREPAY_APPS, JSON.stringify(defaultPrepayApps));
  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// 1. Service Danh mục Hold Code (ApHoldDefinition)
export const apHoldDefinitionService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string }): Promise<ServiceResponse<{ items: ApHoldDefinition[]; totalItems: number }>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    let list: ApHoldDefinition[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter((x) => x.holdCode.toLowerCase().includes(q) || x.holdName.toLowerCase().includes(q));
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getAll: async (): Promise<ApHoldDefinition[]> => {
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (code: string): Promise<ServiceResponse<ApHoldDefinition>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    const list: ApHoldDefinition[] = JSON.parse(listStr);
    const item = list.find((x) => x.holdCode === code);
    if (!item) return { success: false, message: "Không tìm thấy định nghĩa hold này" };
    return { success: true, data: item };
  },

  create: async (data: ApHoldDefinition): Promise<ServiceResponse<ApHoldDefinition>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    const list: ApHoldDefinition[] = JSON.parse(listStr);

    if (list.some((x) => x.holdCode === data.holdCode)) {
      return { success: false, message: "Mã hold code đã tồn tại trong danh mục." };
    }

    list.unshift(data);
    localStorage.setItem(KEYS.HOLD_DEFS, JSON.stringify(list));

    return { success: true, data };
  },

  update: async (code: string, data: Partial<ApHoldDefinition>): Promise<ServiceResponse<ApHoldDefinition>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    let list: ApHoldDefinition[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.holdCode === code);
    if (index === -1) return { success: false, message: "Không tìm thấy cấu hình mã hold" };

    list[index] = { ...list[index], ...data, lastUpdateDate: new Date().toISOString().substring(0, 10) };
    localStorage.setItem(KEYS.HOLD_DEFS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (code: string): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.HOLD_DEFS) || "[]";
    let list: ApHoldDefinition[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.holdCode === code);
    if (index === -1) return { success: false, message: "Không tìm thấy cấu hình mã hold" };

    // Chặn xóa nếu có hóa đơn đang sử dụng hold code này
    const holdStr = localStorage.getItem(KEYS.HOLDS) || "[]";
    const holds: ApInvoiceHold[] = JSON.parse(holdStr);
    const isUsed = holds.some((x) => x.holdLookupCode === code && !x.releaseLookupCode);
    if (isUsed) {
      return { success: false, message: "Mã khóa giữ đang được áp dụng chặn thanh toán cho hóa đơn hoạt động. Không thể xóa." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.HOLD_DEFS, JSON.stringify(list));

    return { success: true };
  }
};

// 2. Service Lô Hóa đơn (ApInvoiceBatch)
export const apInvoiceBatchService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string }): Promise<ServiceResponse<{ items: ApInvoiceBatch[]; totalItems: number }>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApInvoiceBatch[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter((x) => x.batchName.toLowerCase().includes(q));
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getAll: async (): Promise<ApInvoiceBatch[]> => {
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<ApInvoiceBatch>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    const list: ApInvoiceBatch[] = JSON.parse(listStr);
    const item = list.find((x) => x.batchId === id);
    if (!item) return { success: false, message: "Không tìm thấy lô hóa đơn" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApInvoiceBatch, "batchId" | "creationDate">): Promise<ServiceResponse<ApInvoiceBatch>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    const list: ApInvoiceBatch[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.batchId)) + 1 : 101;
    const newItem: ApInvoiceBatch = {
      ...data,
      batchId: newId,
      creationDate: new Date().toISOString()
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApInvoiceBatch>): Promise<ServiceResponse<ApInvoiceBatch>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApInvoiceBatch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.batchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lô hóa đơn" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApInvoiceBatch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.batchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lô hóa đơn" };

    // Chặn xóa nếu có hóa đơn liên kết
    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    const invList: ApInvoice[] = JSON.parse(invStr);
    const hasInvoices = invList.some((x) => x.batchId === id);
    if (hasInvoices) {
      return { success: false, message: "Không thể xóa lô này vì đang chứa các Hóa đơn mua hàng bên trong." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true };
  }
};

// 3. Service Hóa đơn & Phân bổ (ApInvoice - Tích hợp Lines, Distributions, Holds, Prepayments)
export const apInvoiceMasterService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; batchId?: number | null }): Promise<ServiceResponse<{ items: ApInvoice[]; totalItems: number }>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    let list: ApInvoice[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter((x) => (x.invoiceNum && x.invoiceNum.toLowerCase().includes(q)) || (x.description && x.description.toLowerCase().includes(q)));
    }

    if (params.batchId) {
      list = list.filter((x) => x.batchId === params.batchId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApInvoice>> => {
    await delay();
    initializeApInvoiceDB();
    const listStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    const list: ApInvoice[] = JSON.parse(listStr);
    const item = list.find((x) => x.invoiceId === id);
    if (!item) return { success: false, message: "Không tìm thấy hóa đơn" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApInvoice, "invoiceId" | "lastUpdateDate" | "creationDate">, lines: Omit<ApInvoiceLine, "invoiceLineId" | "invoiceId" | "lastUpdateDate" | "creationDate">[]): Promise<ServiceResponse<ApInvoice>> => {
    await delay();
    initializeApInvoiceDB();

    // 1. Tạo Invoice Header
    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    const invoices: ApInvoice[] = JSON.parse(invStr);
    const newInvoiceId = invoices.length > 0 ? Math.max(...invoices.map((x) => x.invoiceId)) + 1 : 10001;

    const newInvoice: ApInvoice = {
      ...data,
      invoiceId: newInvoiceId,
      lastUpdateDate: new Date().toISOString(),
      creationDate: new Date().toISOString(),
      remainingAmount: data.invoiceAmount // Ban đầu dư nợ bằng tổng tiền hóa đơn
    };

    invoices.unshift(newInvoice);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // 2. Tạo Invoice Lines
    const linesStr = localStorage.getItem(KEYS.LINES) || "[]";
    const dbLines: ApInvoiceLine[] = JSON.parse(linesStr);

    let startLineId = dbLines.length > 0 ? Math.max(...dbLines.map((x) => x.invoiceLineId)) + 1 : 20001;

    lines.forEach((line) => {
      const newLine: ApInvoiceLine = {
        ...line,
        invoiceId: newInvoiceId,
        invoiceLineId: startLineId++,
        lastUpdateDate: new Date().toISOString(),
        creationDate: new Date().toISOString()
      };
      dbLines.push(newLine);
    });

    localStorage.setItem(KEYS.LINES, JSON.stringify(dbLines));

    return { success: true, data: newInvoice };
  },

  update: async (id: number, data: Partial<ApInvoice>, lines: (Partial<ApInvoiceLine> & { invoiceLineId?: number })[]): Promise<ServiceResponse<ApInvoice>> => {
    await delay();
    initializeApInvoiceDB();

    // 1. Cập nhật Invoice Header
    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    let invoices: ApInvoice[] = JSON.parse(invStr);
    const index = invoices.findIndex((x) => x.invoiceId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy hóa đơn" };

    invoices[index] = { ...invoices[index], ...data, lastUpdateDate: new Date().toISOString() };
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // 2. Cập nhật / Thêm mới các dòng
    const linesStr = localStorage.getItem(KEYS.LINES) || "[]";
    let dbLines: ApInvoiceLine[] = JSON.parse(linesStr);

    let startLineId = dbLines.length > 0 ? Math.max(...dbLines.map((x) => x.invoiceLineId)) + 1 : 20001;

    lines.forEach((line) => {
      if (line.invoiceLineId) {
        // Edit dòng cũ
        const lineIdx = dbLines.findIndex((x) => x.invoiceLineId === line.invoiceLineId);
        if (lineIdx !== -1) {
          dbLines[lineIdx] = { ...dbLines[lineIdx], ...line, lastUpdateDate: new Date().toISOString() } as ApInvoiceLine;
        }
      } else {
        // Thêm dòng mới
        const newLine: ApInvoiceLine = {
          ...line,
          invoiceId: id,
          invoiceLineId: startLineId++,
          lastUpdateDate: new Date().toISOString(),
          creationDate: new Date().toISOString()
        } as ApInvoiceLine;
        dbLines.push(newLine);
      }
    });

    localStorage.setItem(KEYS.LINES, JSON.stringify(dbLines));

    return { success: true, data: invoices[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApInvoiceDB();

    // 1. Xóa Invoice Header
    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    let invoices: ApInvoice[] = JSON.parse(invStr);
    const index = invoices.findIndex((x) => x.invoiceId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy hóa đơn" };

    // Kiểm tra chặn xóa nếu hóa đơn đã thanh toán hoặc đã cấn trừ
    if ((invoices[index].amountPaid || 0) > 0) {
      return { success: false, message: "Không thể xóa hóa đơn đã thực hiện thanh toán chi trả." };
    }

    invoices.splice(index, 1);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // 2. Xóa các dòng hóa đơn ApInvoiceLine liên kết
    const linesStr = localStorage.getItem(KEYS.LINES) || "[]";
    let dbLines: ApInvoiceLine[] = JSON.parse(linesStr);
    dbLines = dbLines.filter((x) => x.invoiceId !== id);
    localStorage.setItem(KEYS.LINES, JSON.stringify(dbLines));

    // 3. Xóa các dòng phân bổ hạch toán ApInvoiceDistribution liên kết
    const distsStr = localStorage.getItem(KEYS.DISTRIBUTIONS) || "[]";
    let dbDists: ApInvoiceDistribution[] = JSON.parse(distsStr);
    dbDists = dbDists.filter((x) => x.invoiceId !== id);
    localStorage.setItem(KEYS.DISTRIBUTIONS, JSON.stringify(dbDists));

    return { success: true };
  },

  // Lấy dòng chi tiết thuộc hóa đơn
  getLines: async (invoiceId: number): Promise<ApInvoiceLine[]> => {
    initializeApInvoiceDB();
    const linesStr = localStorage.getItem(KEYS.LINES) || "[]";
    const list: ApInvoiceLine[] = JSON.parse(linesStr);
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  // Lấy phân bổ hạch toán thuộc hóa đơn
  getDistributions: async (invoiceId: number): Promise<ApInvoiceDistribution[]> => {
    initializeApInvoiceDB();
    const distsStr = localStorage.getItem(KEYS.DISTRIBUTIONS) || "[]";
    const list: ApInvoiceDistribution[] = JSON.parse(distsStr);
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  // Thêm mới/cập nhật dòng phân bổ hạch toán
  saveDistribution: async (data: ApInvoiceDistribution): Promise<ServiceResponse<ApInvoiceDistribution>> => {
    await delay();
    initializeApInvoiceDB();
    const distsStr = localStorage.getItem(KEYS.DISTRIBUTIONS) || "[]";
    let list: ApInvoiceDistribution[] = JSON.parse(distsStr);

    if (data.id) {
      const idx = list.findIndex((x) => x.id === data.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data, lastUpdateDate: new Date().toISOString() };
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((x) => x.id)) + 1 : 30001;
      const newItem = {
        ...data,
        id: newId,
        createDate: new Date().toISOString().substring(0, 10),
        lastUpdateDate: new Date().toISOString().substring(0, 10)
      };
      list.push(newItem);
      data.id = newId;
    }

    localStorage.setItem(KEYS.DISTRIBUTIONS, JSON.stringify(list));
    return { success: true, data };
  },

  // Lấy danh sách khóa giữ (holds) thuộc hóa đơn
  getHolds: async (invoiceId: number): Promise<ApInvoiceHold[]> => {
    initializeApInvoiceDB();
    const holdsStr = localStorage.getItem(KEYS.HOLDS) || "[]";
    const holds: ApInvoiceHold[] = JSON.parse(holdsStr);
    const holdDefs: ApHoldDefinition[] = JSON.parse(localStorage.getItem(KEYS.HOLD_DEFS) || "[]");

    return holds
      .filter((x) => x.invoiceId === invoiceId)
      .map((h) => {
        const def = holdDefs.find((d) => d.holdCode === h.holdLookupCode);
        return { ...h, holdName: def ? def.holdName : "N/A" };
      });
  },

  // Áp dụng khóa giữ hóa đơn
  applyHold: async (invoiceId: number, holdCode: string, reason: string): Promise<ServiceResponse<ApInvoiceHold>> => {
    await delay();
    initializeApInvoiceDB();
    const holdsStr = localStorage.getItem(KEYS.HOLDS) || "[]";
    const holds: ApInvoiceHold[] = JSON.parse(holdsStr);

    const newId = holds.length > 0 ? Math.max(...holds.map((x) => x.holdId)) + 1 : 601;
    const newHold: ApInvoiceHold = {
      holdId: newId,
      invoiceId,
      holdLookupCode: holdCode,
      holdDate: new Date().toISOString(),
      heldBy: 1,
      releaseLookupCode: null,
      releaseDate: null,
      releasedBy: null,
      holdReason: reason,
      releaseReason: null
    };

    holds.push(newHold);
    localStorage.setItem(KEYS.HOLDS, JSON.stringify(holds));

    // Cập nhật trạng thái ValidationStatus trong Hóa đơn về "N"
    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    let invoices: ApInvoice[] = JSON.parse(invStr);
    const idx = invoices.findIndex((x) => x.invoiceId === invoiceId);
    if (idx !== -1) {
      invoices[idx].validationStatus = "N";
      invoices[idx].status = "NEEDS_REVALIDATION";
      localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
    }

    return { success: true, data: newHold };
  },

  // Giải tỏa khóa giữ hóa đơn (Release Hold)
  releaseHold: async (holdId: number, releaseCode: string, reason: string): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApInvoiceDB();
    const holdsStr = localStorage.getItem(KEYS.HOLDS) || "[]";
    let holds: ApInvoiceHold[] = JSON.parse(holdsStr);

    const idx = holds.findIndex((x) => x.holdId === holdId);
    if (idx === -1) return { success: false, message: "Không tìm thấy bản ghi khóa giữ." };

    holds[idx].releaseLookupCode = releaseCode;
    holds[idx].releaseDate = new Date().toISOString();
    holds[idx].releasedBy = 1;
    holds[idx].releaseReason = reason;

    localStorage.setItem(KEYS.HOLDS, JSON.stringify(holds));

    // Nếu không còn khóa giữ nào chưa giải tỏa, chuyển validationStatus sang "Y"
    const invId = holds[idx].invoiceId;
    const hasActiveHolds = holds.some((x) => x.invoiceId === invId && !x.releaseLookupCode);
    if (!hasActiveHolds) {
      const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
      let invoices: ApInvoice[] = JSON.parse(invStr);
      const invIdx = invoices.findIndex((x) => x.invoiceId === invId);
      if (invIdx !== -1) {
        invoices[invIdx].validationStatus = "Y";
        invoices[invIdx].status = "VALIDATED";
        localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
      }
    }

    return { success: true };
  },

  // Lấy danh sách cấn trừ tạm ứng (prepayment applications) của hóa đơn
  getPrepayments: async (invoiceId: number): Promise<ApPrepaymentApplication[]> => {
    initializeApInvoiceDB();
    const prepayAppsStr = localStorage.getItem(KEYS.PREPAY_APPS) || "[]";
    const prepayApps: ApPrepaymentApplication[] = JSON.parse(prepayAppsStr);

    const invoices: ApInvoice[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");

    return prepayApps
      .filter((x) => x.invoiceId === invoiceId)
      .map((app) => {
        const prepayInv = invoices.find((i) => i.invoiceId === app.prepaymentInvoiceId);
        return {
          ...app,
          prepaymentInvoiceNum: prepayInv ? prepayInv.invoiceNum || "Prepay ID: " + prepayInv.invoiceId : "N/A"
        };
      });
  },

  // Lập cấn trừ tạm ứng (Apply Prepayment)
  applyPrepayment: async (invoiceId: number, prepaymentInvoiceId: number, amount: number): Promise<ServiceResponse<ApPrepaymentApplication>> => {
    await delay();
    initializeApInvoiceDB();

    const invStr = localStorage.getItem(KEYS.INVOICES) || "[]";
    let invoices: ApInvoice[] = JSON.parse(invStr);

    const standardIdx = invoices.findIndex((x) => x.invoiceId === invoiceId);
    const prepayIdx = invoices.findIndex((x) => x.invoiceId === prepaymentInvoiceId);

    if (standardIdx === -1 || prepayIdx === -1) {
      return { success: false, message: "Không tìm thấy hóa đơn chuẩn hoặc hóa đơn tạm ứng." };
    }

    const standard = invoices[standardIdx];
    const prepayment = invoices[prepayIdx];

    // Kiểm tra số dư khả dụng cấn trừ của hóa đơn tạm ứng
    const currentPrepayRemaining = prepayment.remainingAmount || 0;
    if (amount > currentPrepayRemaining) {
      return { success: false, message: `Số tiền cấn trừ (${amount.toLocaleString()}đ) vượt quá số dư tạm ứng còn lại của hóa đơn (${currentPrepayRemaining.toLocaleString()}đ)` };
    }

    // Kiểm tra số dư nợ còn lại của hóa đơn chuẩn
    const currentStandardRemaining = standard.remainingAmount || 0;
    if (amount > currentStandardRemaining) {
      return { success: false, message: `Số tiền cấn trừ (${amount.toLocaleString()}đ) vượt quá số nợ còn lại của hóa đơn chuẩn (${currentStandardRemaining.toLocaleString()}đ)` };
    }

    // Cập nhật số dư nợ
    invoices[standardIdx].remainingAmount = currentStandardRemaining - amount;
    invoices[standardIdx].amountPaid = (standard.amountPaid || 0) + amount;

    invoices[prepayIdx].remainingAmount = currentPrepayRemaining - amount;

    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // Lưu thông tin cấn trừ
    const prepayAppsStr = localStorage.getItem(KEYS.PREPAY_APPS) || "[]";
    const prepayApps: ApPrepaymentApplication[] = JSON.parse(prepayAppsStr);

    const newId = prepayApps.length > 0 ? Math.max(...prepayApps.map((x) => x.applicationId)) + 1 : 701;
    const newApp: ApPrepaymentApplication = {
      applicationId: newId,
      invoiceId,
      prepaymentInvoiceId,
      amountApplied: amount,
      taxAmountApplied: 0,
      glDate: new Date().toISOString().substring(0, 10),
      prepaymentOnInvoiceFlag: "Y",
      applicationType: "APPLY",
      applicationDate: new Date().toISOString().substring(0, 10),
      status: "POSTED",
      createdBy: 1,
      createdDate: new Date().toISOString().substring(0, 10),
      lastUpdateBy: 1,
      lastUpdateDate: new Date().toISOString().substring(0, 10)
    };

    prepayApps.push(newApp);
    localStorage.setItem(KEYS.PREPAY_APPS, JSON.stringify(prepayApps));

    return { success: true, data: newApp };
  }
};
