import { ApPayment, ApPaymentBatch, ApPaymentSchedule, ApPaymentTerm, ApPaymentTermDiscount, ApPaymentTermLine, ApInvoicePayment } from "../../model/ApPaymentModel";
import { ServiceResponse } from "../sharedConfig/sharedConfigMockService";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  PAYMENTS: "ap_payments_v2",
  BATCHES: "ap_payment_batches_v2",
  SCHEDULES: "ap_payment_schedules_v2",
  TERMS: "ap_payment_terms_v2",
  DISCOUNTS: "ap_payment_term_discounts_v2",
  LINES: "ap_payment_term_lines_v2",
  INVOICE_PAYMENTS: "ap_invoice_payments_v2",
  INITIALIZED: "ap_payment_db_initialized_v2"
};

export const initializeApPaymentDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  const defaultPayments: ApPayment[] = [
    { orgId: 10, vendorId: 1, vendorName: "Vinamilk", vendorSiteId: 201, vendorSiteCode: "VNM-HCM-OFFICE", bankAccountId: 1001, bankAccountNum: 19020492839201, bankAccountName: "TECHCOMBANK IDP VND", bankAccountType: "CHECKING", bankFt: "FT26071501", paymentId: 1, paymentNumber: 80001, checkDate: "2026-07-01T00:00:00.000Z", currencyCode: "VND", paymentTypeFlag: "Q", paymentMethodLookupCode: "WIRE", statusLookupCode: "NEGOTIABLE", description: "Thanh toán tiền sữa đợt 1 tháng 7", exchangeRate: 1, amount: 150000000, baseAmount: 150000000, ccidCr: 112101, ccidDr: 33101, lastUpdateBy: 1, lastUpdateDate: "2026-07-01T00:00:00.000Z", createBy: 1, createDate: "2026-07-01T00:00:00.000Z", paymentType: "SUPPLIER", rateType: null, rateDate: null, clearStatus: "CLEARED", voidStatus: null, voidDate: null, voidGlDate: null },
    { orgId: 10, vendorId: 2, vendorName: "Petrolimex", vendorSiteId: 202, vendorSiteCode: "PLX-HN-DEPOT", bankAccountId: 1003, bankAccountNum: 10201000029384, bankAccountName: "VIETINBANK PAYROLL", bankAccountType: "CHECKING", bankFt: "FT26071502", paymentId: 2, paymentNumber: 80002, checkDate: "2026-07-05T00:00:00.000Z", currencyCode: "VND", paymentTypeFlag: "Q", paymentMethodLookupCode: "WIRE", statusLookupCode: "NEGOTIABLE", description: "Thanh toán xăng dầu đội xe vận chuyển", exchangeRate: 1, amount: 450000000, baseAmount: 450000000, ccidCr: 112102, ccidDr: 33101, lastUpdateBy: 1, lastUpdateDate: "2026-07-05T00:00:00.000Z", createBy: 1, createDate: "2026-07-05T00:00:00.000Z", paymentType: "SUPPLIER", rateType: null, rateDate: null, clearStatus: "CLEARED", voidStatus: null, voidDate: null, voidGlDate: null },
    { orgId: 10, vendorId: 3, vendorName: "Coca-Cola VN", vendorSiteId: 203, vendorSiteCode: "KO-TD-PLANT", bankAccountId: 1001, bankAccountNum: 19020492839201, bankAccountName: "TECHCOMBANK IDP VND", bankAccountType: "CHECKING", bankFt: "FT26071503", paymentId: 3, paymentNumber: 80003, checkDate: "2026-07-10T00:00:00.000Z", currencyCode: "VND", paymentTypeFlag: "Q", paymentMethodLookupCode: "WIRE", statusLookupCode: "NEGOTIABLE", description: "Thanh toán đơn hàng số 49283", exchangeRate: 1, amount: 80000000, baseAmount: 80000000, ccidCr: 112101, ccidDr: 33102, lastUpdateBy: 1, lastUpdateDate: "2026-07-10T00:00:00.000Z", createBy: 1, createDate: "2026-07-10T00:00:00.000Z", paymentType: "SUPPLIER", rateType: null, rateDate: null, clearStatus: "CLEARED", voidStatus: null, voidDate: null, voidGlDate: null },
    { orgId: 10, vendorId: 4, vendorName: "Vingroup", vendorSiteId: 204, vendorSiteCode: "VIC-LB-HQ", bankAccountId: 1005, bankAccountNum: 11110000492839, bankAccountName: "BIDV TẠM ỨNG", bankAccountType: "OTHER", bankFt: "FT26071504", paymentId: 4, paymentNumber: 80004, checkDate: "2026-07-12T00:00:00.000Z", currencyCode: "VND", paymentTypeFlag: "Q", paymentMethodLookupCode: "WIRE", statusLookupCode: "NEGOTIABLE", description: "Thanh toán tiền thuê mặt bằng quý 3", exchangeRate: 1, amount: 350000000, baseAmount: 350000000, ccidCr: 112105, ccidDr: 33101, lastUpdateBy: 1, lastUpdateDate: "2026-07-12T00:00:00.000Z", createBy: 1, createDate: "2026-07-12T00:00:00.000Z", paymentType: "SUPPLIER", rateType: null, rateDate: null, clearStatus: "CLEARED", voidStatus: null, voidDate: null, voidGlDate: null },
    { orgId: 10, vendorId: 1, vendorName: "Vinamilk", vendorSiteId: 201, vendorSiteCode: "VNM-HCM-OFFICE", bankAccountId: 1002, bankAccountNum: 19020492839202, bankAccountName: "TECHCOMBANK USD", bankAccountType: "CHECKING", bankFt: "FT26071505", paymentId: 5, paymentNumber: 80005, checkDate: "2026-07-15T00:00:00.000Z", currencyCode: "USD", paymentTypeFlag: "Q", paymentMethodLookupCode: "WIRE", statusLookupCode: "NEGOTIABLE", description: "Thanh toán nhập khẩu nguyên liệu sữa bột", exchangeRate: 25000, amount: 10000, baseAmount: 250000000, ccidCr: 112201, ccidDr: 33101, lastUpdateBy: 1, lastUpdateDate: "2026-07-15T00:00:00.000Z", createBy: 1, createDate: "2026-07-15T00:00:00.000Z", paymentType: "SUPPLIER", rateType: "SPOT", rateDate: "2026-07-15T00:00:00.000Z", clearStatus: "PENDING", voidStatus: null, voidDate: null, voidGlDate: null }
  ];

  const defaultBatches: ApPaymentBatch[] = [
    { batchId: 1, batchName: "Lô chi lương tháng 6/2026", paymentMethod: "WIRE", bankAccountId: 1003, paymentDate: "2026-06-30", totalAmount: 4500000000, status: "APPROVED", createdBy: 1 },
    { batchId: 2, batchName: "Lô thanh toán hóa đơn sữa ngoại", paymentMethod: "WIRE", bankAccountId: 1002, paymentDate: "2026-07-02", totalAmount: 1250000000, status: "APPROVED", createdBy: 1 },
    { batchId: 3, batchName: "Lô trả nợ Petrolimex khẩn cấp", paymentMethod: "WIRE", bankAccountId: 1003, paymentDate: "2026-07-05", totalAmount: 450000000, status: "APPROVED", createdBy: 1 },
    { batchId: 4, batchName: "Lô thanh toán điện nước tháng 6", paymentMethod: "WIRE", bankAccountId: 1001, paymentDate: "2026-07-08", totalAmount: 180000000, status: "PENDING", createdBy: 1 },
    { batchId: 5, batchName: "Lô chi hoa hồng đại lý miền Nam", paymentMethod: "WIRE", bankAccountId: 1001, paymentDate: "2026-07-12", totalAmount: 320000000, status: "PENDING", createdBy: 1 }
  ];

  const defaultSchedules: ApPaymentSchedule[] = [
    { id: 1, orgId: 10, invoiceId: 1001, dueDate: "2026-07-15", amountRemaining: 50000000, grossAmount: 150000000, holdFlag: "N", discountDate: "2026-07-05", paymentMethod: "WIRE", paymentNum: 1, paymentStatusFlag: "P", lastUpdateBy: 1, lastUpdateDate: "2026-07-01T00:00:00.000Z", createBy: 1, createDate: "2026-07-01T00:00:00.000Z", discountAmount: 3000000, paymentStatus: "PARTIALLY_PAID" },
    { id: 2, orgId: 10, invoiceId: 1002, dueDate: "2026-07-20", amountRemaining: 0, grossAmount: 450000000, holdFlag: "N", discountDate: "2026-07-10", paymentMethod: "WIRE", paymentNum: 2, paymentStatusFlag: "Y", lastUpdateBy: 1, lastUpdateDate: "2026-07-05T00:00:00.000Z", createBy: 1, createDate: "2026-07-05T00:00:00.000Z", discountAmount: 9000000, paymentStatus: "PAID" },
    { id: 3, orgId: 10, invoiceId: 1003, dueDate: "2026-07-25", amountRemaining: 80000000, grossAmount: 160000000, holdFlag: "Y", discountDate: "2026-07-15", paymentMethod: "WIRE", paymentNum: 1, paymentStatusFlag: "N", lastUpdateBy: 1, lastUpdateDate: "2026-07-10T00:00:00.000Z", createBy: 1, createDate: "2026-07-10T00:00:00.000Z", discountAmount: 3200000, paymentStatus: "UNPAID" },
    { id: 4, orgId: 10, invoiceId: 1004, dueDate: "2026-07-30", amountRemaining: 350000000, grossAmount: 350000000, holdFlag: "N", discountDate: null, paymentMethod: "WIRE", paymentNum: 1, paymentStatusFlag: "N", lastUpdateBy: 1, lastUpdateDate: "2026-07-12T00:00:00.000Z", createBy: 1, createDate: "2026-07-12T00:00:00.000Z", discountAmount: null, paymentStatus: "UNPAID" },
    { id: 5, orgId: 10, invoiceId: 1005, dueDate: "2026-08-05", amountRemaining: 250000000, grossAmount: 250000000, holdFlag: "N", discountDate: null, paymentMethod: "WIRE", paymentNum: 1, paymentStatusFlag: "N", lastUpdateBy: 1, lastUpdateDate: "2026-07-15T00:00:00.000Z", createBy: 1, createDate: "2026-07-15T00:00:00.000Z", discountAmount: null, paymentStatus: "UNPAID" }
  ];

  const defaultTerms: ApPaymentTerm[] = [
    { paymentTermId: 1, termName: "30 Net", description: "Thanh toán trong vòng 30 ngày kể từ ngày nhận hóa đơn", cutoffDay: 30, effectiveFrom: "2026-01-01", effectiveTo: "2029-12-31", rankNo: 1, status: "ACTIVE" },
    { paymentTermId: 2, termName: "2% 10, Net 30", description: "Chiết khấu 2% nếu thanh toán trong 10 ngày, quá hạn thanh toán trong 30 ngày", cutoffDay: 30, effectiveFrom: "2026-01-01", effectiveTo: "2029-12-31", rankNo: 2, status: "ACTIVE" },
    { paymentTermId: 3, termName: "Immediate", description: "Thanh toán ngay lập tức khi nhận hóa đơn", cutoffDay: 0, effectiveFrom: "2026-01-01", effectiveTo: "2029-12-31", rankNo: 3, status: "ACTIVE" },
    { paymentTermId: 4, termName: "45 Net", description: "Thanh toán trong vòng 45 ngày", cutoffDay: 45, effectiveFrom: "2026-01-01", effectiveTo: "2029-12-31", rankNo: 4, status: "ACTIVE" },
    { paymentTermId: 5, termName: "60 Net", description: "Thanh toán trong vòng 60 ngày", cutoffDay: 60, effectiveFrom: "2026-01-01", effectiveTo: "2029-12-31", rankNo: 5, status: "INACTIVE" }
  ];

  const defaultTermLines: ApPaymentTermLine[] = [
    { termLineId: 101, paymentTermId: 1, lineNum: 1, duePercent: 100, dueAmount: null, fixedDate: null, days: 30, dayOfMonth: null, monthAhead: null },
    { termLineId: 102, paymentTermId: 2, lineNum: 1, duePercent: 100, dueAmount: null, fixedDate: null, days: 30, dayOfMonth: null, monthAhead: null },
    { termLineId: 103, paymentTermId: 3, lineNum: 1, duePercent: 100, dueAmount: null, fixedDate: null, days: 0, dayOfMonth: null, monthAhead: null },
    { termLineId: 104, paymentTermId: 4, lineNum: 1, duePercent: 100, dueAmount: null, fixedDate: null, days: 45, dayOfMonth: null, monthAhead: null },
    { termLineId: 105, paymentTermId: 5, lineNum: 1, duePercent: 50, dueAmount: null, fixedDate: null, days: 30, dayOfMonth: null, monthAhead: null }
  ];

  const defaultDiscounts: ApPaymentTermDiscount[] = [
    { discountId: 201, paymentTermId: 2, discountLevel: 1, discountPercent: 2, days: 10, dayOfMonth: null, monthsAhead: null },
    { discountId: 202, paymentTermId: 2, discountLevel: 2, discountPercent: 1, days: 15, dayOfMonth: null, monthsAhead: null },
    { discountId: 203, paymentTermId: 4, discountLevel: 1, discountPercent: 3, days: 10, dayOfMonth: null, monthsAhead: null },
    { discountId: 204, paymentTermId: 5, discountLevel: 1, discountPercent: 5, days: 15, dayOfMonth: null, monthsAhead: null },
    { discountId: 205, paymentTermId: 1, discountLevel: 1, discountPercent: 0, days: 0, dayOfMonth: null, monthsAhead: null }
  ];

  const defaultInvoicePayments: ApInvoicePayment[] = [
    { setOfBooksId: 1, orgId: 10, invoiceId: 1001, paymentId: 1, invoicePaymentId: 501, accountingEventId: 9001, accountingDate: "2026-07-01", periodName: "JUL-26", amount: 100000000, ccidDr: 33101, ccidCr: 112101, reversalFlag: "N", currencyCode: "VND", exchangeRate: 1, invoiceAmount: 150000000, invoiceBaseAmount: 150000000, paymentAmount: 100000000, paymentBaseAmount: 100000000, paymentNum: 1, lastUpdateBy: 1, lastUpdateDate: "2026-07-01", createBy: 1, createDate: "2026-07-01" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 1002, paymentId: 2, invoicePaymentId: 502, accountingEventId: 9002, accountingDate: "2026-07-05", periodName: "JUL-26", amount: 450000000, ccidDr: 33101, ccidCr: 112102, reversalFlag: "N", currencyCode: "VND", exchangeRate: 1, invoiceAmount: 450000000, invoiceBaseAmount: 450000000, paymentAmount: 450000000, paymentBaseAmount: 450000000, paymentNum: 1, lastUpdateBy: 1, lastUpdateDate: "2026-07-05", createBy: 1, createDate: "2026-07-05" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 1003, paymentId: 3, invoicePaymentId: 503, accountingEventId: 9003, accountingDate: "2026-07-10", periodName: "JUL-26", amount: 80000000, ccidDr: 33102, ccidCr: 112101, reversalFlag: "N", currencyCode: "VND", exchangeRate: 1, invoiceAmount: 160000000, invoiceBaseAmount: 160000000, paymentAmount: 80000000, paymentBaseAmount: 80000000, paymentNum: 1, lastUpdateBy: 1, lastUpdateDate: "2026-07-10", createBy: 1, createDate: "2026-07-10" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 1004, paymentId: 4, invoicePaymentId: 504, accountingEventId: 9004, accountingDate: "2026-07-12", periodName: "JUL-26", amount: 350000000, ccidDr: 33101, ccidCr: 112105, reversalFlag: "N", currencyCode: "VND", exchangeRate: 1, invoiceAmount: 350000000, invoiceBaseAmount: 350000000, paymentAmount: 350000000, paymentBaseAmount: 350000000, paymentNum: 1, lastUpdateBy: 1, lastUpdateDate: "2026-07-12", createBy: 1, createDate: "2026-07-12" },
    { setOfBooksId: 1, orgId: 10, invoiceId: 1005, paymentId: 5, invoicePaymentId: 505, accountingEventId: 9005, accountingDate: "2026-07-15", periodName: "JUL-26", amount: 10000, ccidDr: 33101, ccidCr: 112201, reversalFlag: "N", currencyCode: "USD", exchangeRate: 25000, invoiceAmount: 250000000, invoiceBaseAmount: 250000000, paymentAmount: 10000, paymentBaseAmount: 250000000, paymentNum: 1, lastUpdateBy: 1, lastUpdateDate: "2026-07-15", createBy: 1, createDate: "2026-07-15" }
  ];

  localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(defaultPayments));
  localStorage.setItem(KEYS.BATCHES, JSON.stringify(defaultBatches));
  localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(defaultSchedules));
  localStorage.setItem(KEYS.TERMS, JSON.stringify(defaultTerms));
  localStorage.setItem(KEYS.LINES, JSON.stringify(defaultTermLines));
  localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(defaultDiscounts));
  localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify(defaultInvoicePayments));
  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// 1. Service Phiếu chi (ApPayment)
export const apPaymentService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; vendorId?: number | null }): Promise<ServiceResponse<{ items: ApPayment[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    let list: ApPayment[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter((x) => String(x.paymentNumber).includes(q) || x.vendorName.toLowerCase().includes(q) || (x.bankFt && x.bankFt.toLowerCase().includes(q)));
    }

    if (params.vendorId) {
      list = list.filter((x) => x.vendorId === params.vendorId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getAll: async (): Promise<ApPayment[]> => {
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<ApPayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    const list: ApPayment[] = JSON.parse(listStr);
    const item = list.find((x) => x.paymentId === id);
    if (!item) return { success: false, message: "Không tìm thấy thông tin phiếu chi" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApPayment, "paymentId" | "lastUpdateDate" | "createDate">): Promise<ServiceResponse<ApPayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    const list: ApPayment[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.paymentId)) + 1 : 1;
    const newNum = list.length > 0 ? Math.max(...list.map((x) => x.paymentNumber)) + 1 : 80001;

    const newItem: ApPayment = {
      ...data,
      paymentId: newId,
      paymentNumber: newNum,
      lastUpdateDate: new Date().toISOString(),
      createDate: new Date().toISOString()
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPayment>): Promise<ServiceResponse<ApPayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    let list: ApPayment[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.paymentId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy phiếu chi" };

    list[index] = { ...list[index], ...data, lastUpdateDate: new Date().toISOString() };
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.PAYMENTS) || "[]";
    let list: ApPayment[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.paymentId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy phiếu chi" };

    // Kiểm tra xem đã có hóa đơn nào phân bổ thanh toán từ phiếu chi này chưa
    const ipStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    const ipList: ApInvoicePayment[] = JSON.parse(ipStr);
    const isUsed = ipList.some((x) => x.paymentId === id);
    if (isUsed) {
      return { success: false, message: "Không thể xóa phiếu chi này vì đã thực hiện phân bổ thanh toán cho hóa đơn." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(list));

    return { success: true };
  }
};

// 2. Service Lô thanh toán (ApPaymentBatch)
export const apPaymentBatchService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string }): Promise<ServiceResponse<{ items: ApPaymentBatch[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApPaymentBatch[] = JSON.parse(listStr);

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

  getById: async (id: number): Promise<ServiceResponse<ApPaymentBatch>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    const list: ApPaymentBatch[] = JSON.parse(listStr);
    const item = list.find((x) => x.batchId === id);
    if (!item) return { success: false, message: "Không tìm thấy lô thanh toán" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApPaymentBatch, "batchId">): Promise<ServiceResponse<ApPaymentBatch>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    const list: ApPaymentBatch[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.batchId)) + 1 : 1;
    const newItem: ApPaymentBatch = { ...data, batchId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPaymentBatch>): Promise<ServiceResponse<ApPaymentBatch>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApPaymentBatch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.batchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lô thanh toán" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.BATCHES) || "[]";
    let list: ApPaymentBatch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.batchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lô thanh toán" };

    if (list[index].status === "APPROVED") {
      return { success: false, message: "Không thể xóa lô thanh toán đã được phê duyệt (APPROVED)." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.BATCHES, JSON.stringify(list));

    return { success: true };
  }
};

// 3. Service Lịch trả nợ dự kiến (ApPaymentSchedule)
export const apPaymentScheduleService = {
  getList: async (params: { skip?: number; take?: number; invoiceId?: number | null }): Promise<ServiceResponse<{ items: ApPaymentSchedule[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    let list: ApPaymentSchedule[] = JSON.parse(listStr);

    if (params.invoiceId) {
      list = list.filter((x) => x.invoiceId === params.invoiceId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApPaymentSchedule>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    const list: ApPaymentSchedule[] = JSON.parse(listStr);
    const item = list.find((x) => x.id === id);
    if (!item) return { success: false, message: "Không tìm thấy lịch trả nợ" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApPaymentSchedule, "id" | "lastUpdateDate" | "createDate">): Promise<ServiceResponse<ApPaymentSchedule>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    const list: ApPaymentSchedule[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.id)) + 1 : 1;
    const newItem: ApPaymentSchedule = {
      ...data,
      id: newId,
      lastUpdateDate: new Date().toISOString(),
      createDate: new Date().toISOString()
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPaymentSchedule>): Promise<ServiceResponse<ApPaymentSchedule>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    let list: ApPaymentSchedule[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.id === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lịch trả nợ" };

    list[index] = { ...list[index], ...data, lastUpdateDate: new Date().toISOString() };
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    let list: ApPaymentSchedule[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.id === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lịch trả nợ" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(list));

    return { success: true };
  }
};

// 4. Service Điều khoản thanh toán (ApPaymentTerm)
export const apPaymentTermService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string }): Promise<ServiceResponse<{ items: ApPaymentTerm[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    let list: ApPaymentTerm[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter((x) => x.termName.toLowerCase().includes(q) || (x.description && x.description.toLowerCase().includes(q)));
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getAll: async (): Promise<ApPaymentTerm[]> => {
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<ApPaymentTerm>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    const list: ApPaymentTerm[] = JSON.parse(listStr);
    const item = list.find((x) => x.paymentTermId === id);
    if (!item) return { success: false, message: "Không tìm thấy điều khoản thanh toán" };
    return { success: true, data: item };
  },

  create: async (data: Omit<ApPaymentTerm, "paymentTermId">): Promise<ServiceResponse<ApPaymentTerm>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    const list: ApPaymentTerm[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.paymentTermId)) + 1 : 1;
    const newItem: ApPaymentTerm = { ...data, paymentTermId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.TERMS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPaymentTerm>): Promise<ServiceResponse<ApPaymentTerm>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    let list: ApPaymentTerm[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.paymentTermId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy điều khoản thanh toán" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.TERMS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.TERMS) || "[]";
    let list: ApPaymentTerm[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.paymentTermId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy điều khoản thanh toán" };

    // Chặn xóa nếu có dòng chi tiết hoặc chiết khấu đang liên kết
    const lineStr = localStorage.getItem(KEYS.LINES) || "[]";
    const lines: ApPaymentTermLine[] = JSON.parse(lineStr);
    const hasLine = lines.some((x) => x.paymentTermId === id);
    if (hasLine) {
      return { success: false, message: "Không thể xóa điều khoản này vì đang tồn tại các Dòng chi tiết phụ thuộc." };
    }

    const discStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    const discounts: ApPaymentTermDiscount[] = JSON.parse(discStr);
    const hasDisc = discounts.some((x) => x.paymentTermId === id);
    if (hasDisc) {
      return { success: false, message: "Không thể xóa điều khoản này vì đang tồn tại cấu hình Chiết khấu phụ thuộc." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.TERMS, JSON.stringify(list));

    return { success: true };
  }
};

// 5. Service Dòng điều khoản (ApPaymentTermLine)
export const apPaymentTermLineService = {
  getList: async (params: { skip?: number; take?: number; paymentTermId?: number | null }): Promise<ServiceResponse<{ items: ApPaymentTermLine[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.LINES) || "[]";
    let list: ApPaymentTermLine[] = JSON.parse(listStr);

    const terms: ApPaymentTerm[] = JSON.parse(localStorage.getItem(KEYS.TERMS) || "[]");
    list = list.map((item) => {
      const term = terms.find((t) => t.paymentTermId === item.paymentTermId);
      return { ...item, termName: term ? term.termName : "N/A" };
    });

    if (params.paymentTermId) {
      list = list.filter((x) => x.paymentTermId === params.paymentTermId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApPaymentTermLine>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.LINES) || "[]";
    const list: ApPaymentTermLine[] = JSON.parse(listStr);
    const item = list.find((x) => x.termLineId === id);
    if (!item) return { success: false, message: "Không tìm thấy dòng điều khoản" };

    const terms: ApPaymentTerm[] = JSON.parse(localStorage.getItem(KEYS.TERMS) || "[]");
    const term = terms.find((t) => t.paymentTermId === item.paymentTermId);
    item.termName = term ? term.termName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApPaymentTermLine, "termLineId">): Promise<ServiceResponse<ApPaymentTermLine>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.LINES) || "[]";
    const list: ApPaymentTermLine[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.termLineId)) + 1 : 1;
    const newItem: ApPaymentTermLine = { ...data, termLineId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.LINES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPaymentTermLine>): Promise<ServiceResponse<ApPaymentTermLine>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.LINES) || "[]";
    let list: ApPaymentTermLine[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.termLineId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy dòng điều khoản" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.LINES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.LINES) || "[]";
    let list: ApPaymentTermLine[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.termLineId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy dòng điều khoản" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.LINES, JSON.stringify(list));

    return { success: true };
  }
};

// 6. Service Chiết khấu điều khoản (ApPaymentTermDiscount)
export const apPaymentTermDiscountService = {
  getList: async (params: { skip?: number; take?: number; paymentTermId?: number | null }): Promise<ServiceResponse<{ items: ApPaymentTermDiscount[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    let list: ApPaymentTermDiscount[] = JSON.parse(listStr);

    const terms: ApPaymentTerm[] = JSON.parse(localStorage.getItem(KEYS.TERMS) || "[]");
    list = list.map((item) => {
      const term = terms.find((t) => t.paymentTermId === item.paymentTermId);
      return { ...item, termName: term ? term.termName : "N/A" };
    });

    if (params.paymentTermId) {
      list = list.filter((x) => x.paymentTermId === params.paymentTermId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApPaymentTermDiscount>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    const list: ApPaymentTermDiscount[] = JSON.parse(listStr);
    const item = list.find((x) => x.discountId === id);
    if (!item) return { success: false, message: "Không tìm thấy chiết khấu điều khoản" };

    const terms: ApPaymentTerm[] = JSON.parse(localStorage.getItem(KEYS.TERMS) || "[]");
    const term = terms.find((t) => t.paymentTermId === item.paymentTermId);
    item.termName = term ? term.termName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApPaymentTermDiscount, "discountId">): Promise<ServiceResponse<ApPaymentTermDiscount>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    const list: ApPaymentTermDiscount[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.discountId)) + 1 : 1;
    const newItem: ApPaymentTermDiscount = { ...data, discountId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApPaymentTermDiscount>): Promise<ServiceResponse<ApPaymentTermDiscount>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    let list: ApPaymentTermDiscount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.discountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chiết khấu" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.DISCOUNTS) || "[]";
    let list: ApPaymentTermDiscount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.discountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chiết khấu" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.DISCOUNTS, JSON.stringify(list));

    return { success: true };
  }
};

// 7. Service Phân bổ số tiền thanh toán cho hóa đơn (ApInvoicePayment)
export const apInvoicePaymentService = {
  getList: async (params: { skip?: number; take?: number; paymentId?: number | null; invoiceId?: number | null }): Promise<ServiceResponse<{ items: ApInvoicePayment[]; totalItems: number }>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    let list: ApInvoicePayment[] = JSON.parse(listStr);

    const payments: ApPayment[] = JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || "[]");
    list = list.map((item) => {
      const pay = payments.find((p) => p.paymentId === item.paymentId);
      return {
        ...item,
        paymentNumber: pay ? pay.paymentNumber : undefined,
        invoiceNum: `INV-${item.invoiceId}` // Móc nối giả lập số hóa đơn
      };
    });

    if (params.paymentId) {
      list = list.filter((x) => x.paymentId === params.paymentId);
    }

    if (params.invoiceId) {
      list = list.filter((x) => x.invoiceId === params.invoiceId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApInvoicePayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    const list: ApInvoicePayment[] = JSON.parse(listStr);
    const item = list.find((x) => x.invoicePaymentId === id);
    if (!item) return { success: false, message: "Không tìm thấy phân bổ thanh toán" };

    const payments: ApPayment[] = JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || "[]");
    const pay = payments.find((p) => p.paymentId === item.paymentId);
    item.paymentNumber = pay ? pay.paymentNumber : undefined;
    item.invoiceNum = `INV-${item.invoiceId}`;

    return { success: true, data: item };
  },

  create: async (data: Omit<ApInvoicePayment, "invoicePaymentId" | "lastUpdateDate" | "createDate">): Promise<ServiceResponse<ApInvoicePayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    const list: ApInvoicePayment[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.invoicePaymentId)) + 1 : 1;
    const newItem: ApInvoicePayment = {
      ...data,
      invoicePaymentId: newId,
      lastUpdateDate: new Date().toISOString(),
      createDate: new Date().toISOString()
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify(list));

    // Cập nhật lại số tiền còn lại (amountRemaining) trong lịch thanh toán ApPaymentSchedule tương ứng
    const schedulesStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    const schedules: ApPaymentSchedule[] = JSON.parse(schedulesStr);
    const schedIndex = schedules.findIndex((x) => x.invoiceId === data.invoiceId);
    if (schedIndex !== -1) {
      const paidAmt = data.amount || 0;
      const oldRemaining = schedules[schedIndex].amountRemaining || 0;
      schedules[schedIndex].amountRemaining = Math.max(0, oldRemaining - paidAmt);
      schedules[schedIndex].paymentStatus = (schedules[schedIndex].amountRemaining || 0) === 0 ? "PAID" : "PARTIALLY_PAID";
      localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(schedules));
    }

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApInvoicePayment>): Promise<ServiceResponse<ApInvoicePayment>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    let list: ApInvoicePayment[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.invoicePaymentId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy phân bổ thanh toán" };

    list[index] = { ...list[index], ...data, lastUpdateDate: new Date().toISOString() };
    localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApPaymentDB();
    const listStr = localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]";
    let list: ApInvoicePayment[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.invoicePaymentId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy phân bổ thanh toán" };

    // Phục hồi lại số tiền còn lại trong ApPaymentSchedule trước khi xóa phân bổ
    const deletedPayment = list[index];
    const schedulesStr = localStorage.getItem(KEYS.SCHEDULES) || "[]";
    const schedules: ApPaymentSchedule[] = JSON.parse(schedulesStr);
    const schedIndex = schedules.findIndex((x) => x.invoiceId === deletedPayment.invoiceId);
    if (schedIndex !== -1) {
      const refundedAmt = deletedPayment.amount || 0;
      const currentRemaining = schedules[schedIndex].amountRemaining || 0;
      schedules[schedIndex].amountRemaining = currentRemaining + refundedAmt;
      schedules[schedIndex].paymentStatus = (schedules[schedIndex].amountRemaining || 0) >= (schedules[schedIndex].grossAmount || 0) ? "UNPAID" : "PARTIALLY_PAID";
      localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(schedules));
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify(list));

    return { success: true };
  }
};
