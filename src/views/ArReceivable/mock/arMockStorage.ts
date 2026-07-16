import {
  ARInvoice, ARInvoiceLine, ARReceipt, ARReceivableApplication, ARAdjustment,
  ARTransactionSource, ARTransactionType, ARPaymentTerm, ARPaymentTermLine,
  ARReceiptClass, ARReceiptMethod, ARReceiptMethodBankAcct, ARReceivableActivity,
  ARDistributionSet, ARDistributionSetLine, ARPaymentSchedule, ARTransactionDistribution,
  ARTransactionInterfaceHdr, ARTransactionInterfaceLine, ARAutoInvoiceRequest,
  ARTransactionCopyBatch, ARTransactionCopyLine, ARMiscReceiptDistribution,
  ARReceiptReversal, ARReceiptHistory, ARCreditMemoApplication, ARAutoAdjustmentBatch,
  ARAutoAdjustmentLine, ARDocumentActionLog, ARVoidTransaction, ARAccountingEvent,
  ARJournalLine, ARGlTransferBatch, ARApNettingAgreement, ARApNettingPartner,
  ARApNettingBatch, ARApNettingBatchLine, ARPromotion, ARPromotionProduct, ARInvoicePromotion
} from '../types/arTypes';

import {
  MOCK_CUSTOMERS, MOCK_TRANSACTION_SOURCES, MOCK_TRANSACTION_TYPES, MOCK_PAYMENT_TERMS,
  MOCK_PAYMENT_TERM_LINES, MOCK_RECEIPT_CLASSES, MOCK_RECEIPT_METHODS, MOCK_RECEIPT_METHOD_BANK_ACCTS,
  MOCK_RECEIVABLE_ACTIVITIES, MOCK_DISTRIBUTION_SETS, MOCK_DISTRIBUTION_SET_LINES,
  MOCK_PROMOTIONS, MOCK_PROMOTION_PRODUCTS, MOCK_INVOICES, MOCK_INVOICE_LINES,
  MOCK_INVOICE_PROMOTIONS, MOCK_TRANSACTION_DISTRIBUTIONS, MOCK_PAYMENT_SCHEDULES,
  MOCK_RECEIPTS, MOCK_RECEIPT_HISTORY, MOCK_RECEIPT_REVERSALS, MOCK_MISC_RECEIPT_DISTRIBUTIONS,
  MOCK_RECEIVABLE_APPLICATIONS, MOCK_CREDIT_MEMO_APPLICATIONS, MOCK_ADJUSTMENTS,
  MOCK_AUTO_ADJUSTMENT_BATCHES, MOCK_AUTO_ADJUSTMENT_LINES, MOCK_AUTOINVOICE_REQUESTS,
  MOCK_TRANSACTION_INTERFACE_HDRS, MOCK_TRANSACTION_INTERFACE_LINES,
  MOCK_TRANSACTION_COPY_BATCHES, MOCK_TRANSACTION_COPY_LINES, MOCK_DOCUMENT_ACTION_LOG,
  MOCK_VOID_TRANSACTIONS, MOCK_ACCOUNTING_EVENTS, MOCK_JOURNAL_LINES, MOCK_GL_TRANSFER_BATCHES,
  MOCK_AP_NETTING_AGREEMENTS, MOCK_AP_NETTING_PARTNERS, MOCK_AP_NETTING_BATCHES,
  MOCK_AP_NETTING_BATCH_LINES
} from './arMockData';

// Storage Helper
function getStorage<T>(key: string, initial: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  const parsed = JSON.parse(data);
  // Tự động cập nhật nếu Mock Data trong code nhiều hơn dữ liệu lưu trong local (dùng để reset dữ liệu mẫu mới)
  if (Array.isArray(parsed) && parsed.length < initial.length) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return parsed;
}

function setStorage<T>(key: string, val: T[]): void {
  localStorage.setItem(key, JSON.stringify(val));
}

export class ARMockStorage {
  // Setup Parameters
  static getTransactionSources = () => getStorage<ARTransactionSource>("ar_transaction_sources", MOCK_TRANSACTION_SOURCES);
  static saveTransactionSource = (src: ARTransactionSource) => {
    const list = this.getTransactionSources();
    const idx = list.findIndex(x => x.transactionSourceId === src.transactionSourceId);
    if (idx >= 0) {
      list[idx] = src;
    } else {
      src.transactionSourceId = list.length + 1;
      list.push(src);
    }
    setStorage("ar_transaction_sources", list);
  };
  static deleteTransactionSource = (id: number) => {
    setStorage("ar_transaction_sources", this.getTransactionSources().filter(x => x.transactionSourceId !== id));
  };

  static getTransactionTypes = () => getStorage<ARTransactionType>("ar_transaction_types", MOCK_TRANSACTION_TYPES);
  static saveTransactionType = (type: ARTransactionType) => {
    const list = this.getTransactionTypes();
    const idx = list.findIndex(x => x.transactionTypeId === type.transactionTypeId);
    if (idx >= 0) {
      list[idx] = type;
    } else {
      type.transactionTypeId = list.length + 1;
      list.push(type);
    }
    setStorage("ar_transaction_types", list);
  };
  static deleteTransactionType = (id: number) => {
    setStorage("ar_transaction_types", this.getTransactionTypes().filter(x => x.transactionTypeId !== id));
  };

  static getPaymentTerms = () => getStorage<ARPaymentTerm>("ar_payment_terms", MOCK_PAYMENT_TERMS);
  static savePaymentTerm = (term: ARPaymentTerm) => {
    const list = this.getPaymentTerms();
    const idx = list.findIndex(x => x.termId === term.termId);
    if (idx >= 0) {
      list[idx] = term;
    } else {
      term.termId = list.length + 1;
      list.push(term);
    }
    setStorage("ar_payment_terms", list);
  };
  static deletePaymentTerm = (id: number) => {
    setStorage("ar_payment_terms", this.getPaymentTerms().filter(x => x.termId !== id));
  };

  static getPaymentTermLines = () => getStorage<ARPaymentTermLine>("ar_payment_term_lines", MOCK_PAYMENT_TERM_LINES);
  static savePaymentTermLine = (line: ARPaymentTermLine) => {
    const list = this.getPaymentTermLines();
    const idx = list.findIndex(x => x.termLineId === line.termLineId);
    if (idx >= 0) {
      list[idx] = line;
    } else {
      line.termLineId = list.length + 1;
      list.push(line);
    }
    setStorage("ar_payment_term_lines", list);
  };

  static getReceiptClasses = () => getStorage<ARReceiptClass>("ar_receipt_classes", MOCK_RECEIPT_CLASSES);
  static saveReceiptClass = (cls: ARReceiptClass) => {
    const list = this.getReceiptClasses();
    const idx = list.findIndex(x => x.receiptClassId === cls.receiptClassId);
    if (idx >= 0) {
      list[idx] = cls;
    } else {
      cls.receiptClassId = list.length + 1;
      list.push(cls);
    }
    setStorage("ar_receipt_classes", list);
  };

  static getReceiptMethods = () => getStorage<ARReceiptMethod>("ar_receipt_methods", MOCK_RECEIPT_METHODS);
  static saveReceiptMethod = (method: ARReceiptMethod) => {
    const list = this.getReceiptMethods();
    const idx = list.findIndex(x => x.receiptMethodId === method.receiptMethodId);
    if (idx >= 0) {
      list[idx] = method;
    } else {
      method.receiptMethodId = list.length + 1;
      list.push(method);
    }
    setStorage("ar_receipt_methods", list);
  };

  static getReceiptMethodBankAccts = () => getStorage<ARReceiptMethodBankAcct>("ar_receipt_method_bank_accts", MOCK_RECEIPT_METHOD_BANK_ACCTS);
  static getReceivableActivities = () => getStorage<ARReceivableActivity>("ar_receivable_activities", MOCK_RECEIVABLE_ACTIVITIES);
  static saveReceivableActivity = (act: ARReceivableActivity) => {
    const list = this.getReceivableActivities();
    const idx = list.findIndex(x => x.receivableActivityId === act.receivableActivityId);
    if (idx >= 0) {
      list[idx] = act;
    } else {
      act.receivableActivityId = list.length + 1;
      list.push(act);
    }
    setStorage("ar_receivable_activities", list);
  };

  static getDistributionSets = () => getStorage<ARDistributionSet>("ar_distribution_sets", MOCK_DISTRIBUTION_SETS);
  static getDistributionSetLines = () => getStorage<ARDistributionSetLine>("ar_distribution_set_lines", MOCK_DISTRIBUTION_SET_LINES);
  static getPromotions = () => getStorage<ARPromotion>("ar_promotions", MOCK_PROMOTIONS);
  static getPromotionProducts = () => getStorage<ARPromotionProduct>("ar_promotion_products", MOCK_PROMOTION_PRODUCTS);

  // Invoices & Billing
  static getInvoices = () => getStorage<ARInvoice>("ar_invoices", MOCK_INVOICES);
  static getInvoiceLines = () => getStorage<ARInvoiceLine>("ar_invoice_lines", MOCK_INVOICE_LINES);
  static getInvoicePromotions = () => getStorage<ARInvoicePromotion>("ar_invoice_promotions", MOCK_INVOICE_PROMOTIONS);
  static getTransactionDistributions = () => getStorage<ARTransactionDistribution>("ar_transaction_distributions", MOCK_TRANSACTION_DISTRIBUTIONS);
  static getPaymentSchedules = () => getStorage<ARPaymentSchedule>("ar_payment_schedules", MOCK_PAYMENT_SCHEDULES);
  static getDocumentActionLogs = () => getStorage<ARDocumentActionLog>("ar_document_action_logs", MOCK_DOCUMENT_ACTION_LOG);
  static getVoidTransactions = () => getStorage<ARVoidTransaction>("ar_void_transactions", MOCK_VOID_TRANSACTIONS);

  static getInvoiceById = (id: number) => {
    const header = this.getInvoices().find(x => x.invoiceId === id);
    const lines = this.getInvoiceLines().filter(x => x.invoiceId === id);
    return header ? { header, lines } : null;
  };

  static createInvoice = (inv: ARInvoice, lines: ARInvoiceLine[]) => {
    const list = this.getInvoices();
    const lineList = this.getInvoiceLines();
    const scheduleList = this.getPaymentSchedules();
    const actionLogs = this.getDocumentActionLogs();

    inv.invoiceId = list.length > 0 ? Math.max(...list.map(x => x.invoiceId)) + 1 : 1;
    inv.invoiceNumber = `INV-2026-${inv.invoiceId.toString().padStart(4, "0")}`;
    inv.status = inv.status || "DRAFT";
    inv.versionNo = 1;

    // Calculate amounts
    let revenueAmount = 0;
    let taxAmount = 0;
    let discountAmount = 0;
    lines.forEach((line, idx) => {
      line.lineId = lineList.length + idx + 1;
      line.invoiceId = inv.invoiceId;
      line.lineNumber = idx + 1;
      line.lineAmount = (line.quantityOrdered || 0) * (line.unitStandardPrice || 0);
      line.amountTax = Math.round((line.lineAmount || 0) * ((line.taxRate || 0) / 100));
      line.amountDiscount = line.amountDiscount || 0;
      revenueAmount += line.lineAmount;
      taxAmount += line.amountTax;
      discountAmount += (line.amountDiscount || 0);
      lineList.push(line);
    });

    inv.totalAmount = revenueAmount + taxAmount - discountAmount;
    list.push(inv);

    // Create Payment Schedule
    const sched: ARPaymentSchedule = {
      paymentScheduleId: scheduleList.length > 0 ? Math.max(...scheduleList.map(x => x.paymentScheduleId)) + 1 : 1,
      invoiceId: inv.invoiceId,
      customerId: inv.soldToCustomerId || 0,
      orgId: inv.orgId,
      installmentNum: 0,
      dueDate: inv.dueDate || new Date().toISOString().split("T")[0],
      originalAmount: inv.totalAmount || 0,
      amountDueOriginal: inv.totalAmount || 0,
      amountDueRemaining: inv.totalAmount || 0,
      amountApplied: 0,
      amountAdjusted: 0,
      amountCredited: 0,
      discountTaken: 0,
      exchangeGainLossAmount: null,
      status: "OPEN",
      createdBy: 1,
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdateBy: 1,
      lastUpdateDate: new Date().toISOString().split("T")[0],
      versionNo: 1,
      attribute1: "", attribute2: "", attribute3: "", attribute4: "", attribute5: "",
      attribute6: "", attribute7: "", attribute8: "", attribute9: "", attribute10: "",
      attribute11: "", attribute12: "", attribute13: "", attribute14: "", attribute15: ""
    };
    scheduleList.push(sched);

    // Log Action
    actionLogs.push({
      actionId: actionLogs.length + 1,
      documentType: "INVOICE",
      documentId: inv.invoiceId,
      actionCode: "CREATE",
      actionDate: new Date().toISOString().split("T")[0],
      actionBy: 1,
      oldStatus: null,
      newStatus: "DRAFT",
      note: "Hóa đơn được tạo mới làm nháp",
      createdBy: 1,
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdateBy: 1,
      lastUpdateDate: new Date().toISOString().split("T")[0]
    } as ARDocumentActionLog);

    setStorage("ar_invoices", list);
    setStorage("ar_invoice_lines", lineList);
    setStorage("ar_payment_schedules", scheduleList);
    setStorage("ar_document_action_logs", actionLogs);
    return inv;
  };

  static updateInvoice = (id: number, inv: Partial<ARInvoice>, lines?: Partial<ARInvoiceLine>[]) => {
    const list = this.getInvoices();
    const idx = list.findIndex(x => x.invoiceId === id);
    if (idx < 0) throw new Error("Invoice not found");

    const current = list[idx];
    // Optimistic Locking Check
    if (inv.versionNo !== undefined && current.versionNo !== inv.versionNo) {
      throw new Error("CONFLICT_ERROR: Dữ liệu đã được người dùng khác cập nhật. Vui lòng tải lại trước khi tiếp tục.");
    }

    list[idx] = { ...current, ...inv, versionNo: current.versionNo + 1 };
    setStorage("ar_invoices", list);

    if (lines) {
      const lineList = this.getInvoiceLines().filter(x => x.invoiceId !== id);
      lines.forEach((l, i) => {
        const newLine = {
          invoiceId: id,
          lineId: l.lineId || Math.random(),
          lineNumber: i + 1,
          ...l
        } as ARInvoiceLine;
        lineList.push(newLine);
      });
      setStorage("ar_invoice_lines", lineList);
    }
    return list[idx];
  };

  static deleteInvoice = (id: number) => {
    const inv = this.getInvoices().find(x => x.invoiceId === id);
    if (!inv) throw new Error("Invoice not found");
    if (inv.status === "COMPLETE") {
      throw new Error("Không thể xóa hóa đơn đã hoàn tất (COMPLETE).");
    }
    
    // Check applications
    const apps = this.getReceivableApplications().filter(x => x.appliedInvoiceId === id && x.status === "APPLIED");
    if (apps.length > 0) {
      throw new Error("Không thể xóa hóa đơn đã có phiếu thu/phân bổ thanh toán.");
    }

    setStorage("ar_invoices", this.getInvoices().filter(x => x.invoiceId !== id));
    setStorage("ar_invoice_lines", this.getInvoiceLines().filter(x => x.invoiceId !== id));
    setStorage("ar_payment_schedules", this.getPaymentSchedules().filter(x => x.invoiceId !== id));
  };

  static completeInvoice = (id: number) => {
    const inv = this.getInvoices().find(x => x.invoiceId === id);
    if (!inv) throw new Error("Invoice not found");
    inv.status = "COMPLETE";
    this.updateInvoice(id, inv);
  };

  static voidInvoice = (id: number, reason: string) => {
    const inv = this.getInvoices().find(x => x.invoiceId === id);
    if (!inv) throw new Error("Invoice not found");
    inv.status = "VOIDED";
    this.updateInvoice(id, inv);

    const voids = this.getVoidTransactions();
    voids.push({
      voidId: voids.length + 1,
      invoiceId: id,
      voidDate: new Date().toISOString().split("T")[0],
      voidGlDate: new Date().toISOString().split("T")[0],
      voidReason: reason,
      status: "VOIDED",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdateDate: new Date().toISOString().split("T")[0]
    } as ARVoidTransaction);
    setStorage("ar_void_transactions", voids);
  };

  // Receipts & Cash
  static getReceipts = () => getStorage<ARReceipt>("ar_receipts", MOCK_RECEIPTS);
  static getReceiptHistory = () => getStorage<ARReceiptHistory>("ar_receipt_history", MOCK_RECEIPT_HISTORY);
  static getReceiptReversals = () => getStorage<ARReceiptReversal>("ar_receipt_reversals", MOCK_RECEIPT_REVERSALS);
  static getMiscReceiptDistributions = () => getStorage<ARMiscReceiptDistribution>("ar_misc_receipt_distributions", MOCK_MISC_RECEIPT_DISTRIBUTIONS);

  static createReceipt = (receipt: ARReceipt) => {
    const list = this.getReceipts();
    receipt.receiptId = list.length > 0 ? Math.max(...list.map(x => x.receiptId)) + 1 : 1;
    receipt.receiptNumber = `RCT-2026-${receipt.receiptId.toString().padStart(4, "0")}`;
    receipt.status = receipt.status || "UNAPPLIED";
    receipt.versionNo = 1;
    list.push(receipt);
    setStorage("ar_receipts", list);
    return receipt;
  };

  static updateReceipt = (id: number, receipt: Partial<ARReceipt>) => {
    const list = this.getReceipts();
    const idx = list.findIndex(x => x.receiptId === id);
    if (idx < 0) throw new Error("Receipt not found");
    const current = list[idx];
    if (receipt.versionNo !== undefined && current.versionNo !== receipt.versionNo) {
      throw new Error("CONFLICT_ERROR: Dữ liệu đã được người dùng khác cập nhật.");
    }
    list[idx] = { ...current, ...receipt, versionNo: current.versionNo + 1 };
    setStorage("ar_receipts", list);
    return list[idx];
  };

  static reverseReceipt = (id: number, reason: string) => {
    const rec = this.getReceipts().find(x => x.receiptId === id);
    if (!rec) throw new Error("Receipt not found");
    rec.status = "REVERSED";
    this.updateReceipt(id, rec);

    const revs = this.getReceiptReversals();
    revs.push({
      reversalId: revs.length + 1,
      receiptId: id,
      reversalDate: new Date().toISOString().split("T")[0],
      glDate: new Date().toISOString().split("T")[0],
      reversalCategory: "REVERSAL",
      reversalReason: reason,
      status: "REVERSED",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdateDate: new Date().toISOString().split("T")[0]
    } as ARReceiptReversal);
    setStorage("ar_receipt_reversals", revs);
  };

  // Receivable Applications
  static getReceivableApplications = () => getStorage<ARReceivableApplication>("ar_receivable_applications", MOCK_RECEIVABLE_APPLICATIONS);
  
  static applyReceipt = (receiptId: number, invoiceId: number, amount: number) => {
    const apps = this.getReceivableApplications();
    const scheds = this.getPaymentSchedules();
    const recs = this.getReceipts();

    const rec = recs.find(x => x.receiptId === receiptId);
    const sched = scheds.find(x => x.invoiceId === invoiceId);

    if (!rec || !sched) throw new Error("Receipt or Invoice Payment Schedule not found");
    if (sched.amountDueRemaining < amount) throw new Error("Số tiền phân bổ vượt quá số nợ còn lại của hóa đơn.");

    // Update Schedule
    sched.amountApplied = (sched.amountApplied || 0) + amount;
    sched.amountDueRemaining -= amount;
    if (sched.amountDueRemaining <= 0) {
      sched.status = "PAID";
      // Update invoice status as well
      const invs = this.getInvoices();
      const inv = invs.find(x => x.invoiceId === invoiceId);
      if (inv) inv.status = "PAID";
      setStorage("ar_invoices", invs);
    } else {
      const invs = this.getInvoices();
      const inv = invs.find(x => x.invoiceId === invoiceId);
      if (inv) inv.status = "PARTIALLY_PAID";
      setStorage("ar_invoices", invs);
    }

    // Add Application log
    const appId = apps.length > 0 ? Math.max(...apps.map(x => x.applicationId)) + 1 : 1;
    apps.push({
      applicationId: appId,
      receiptId: receiptId,
      appliedInvoiceId: invoiceId,
      appliedPaymentScheduleId: sched.paymentScheduleId,
      amountApplied: amount,
      applyDate: new Date().toISOString().split("T")[0],
      glDate: new Date().toISOString().split("T")[0],
      applicationType: "RECEIPT",
      status: "APPLIED",
      versionNo: 1,
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdateDate: new Date().toISOString().split("T")[0],
      attribute1: "", attribute2: "", attribute3: "", attribute4: "", attribute5: "",
      attribute6: "", attribute7: "", attribute8: "", attribute9: "", attribute10: "",
      attribute11: "", attribute12: "", attribute13: "", attribute14: "", attribute15: ""
    } as ARReceivableApplication);

    // Update Receipt Status
    rec.status = "APPLIED";

    setStorage("ar_receivable_applications", apps);
    setStorage("ar_payment_schedules", scheds);
    setStorage("ar_receipts", recs);
  };

  static unapplyReceipt = (applicationId: number) => {
    const apps = this.getReceivableApplications();
    const app = apps.find(x => x.applicationId === applicationId);
    if (!app) throw new Error("Application not found");

    const scheds = this.getPaymentSchedules();
    const sched = scheds.find(x => x.paymentScheduleId === app.appliedPaymentScheduleId);

    if (sched) {
      sched.amountApplied = Math.max(0, (sched.amountApplied || 0) - app.amountApplied);
      sched.amountDueRemaining += app.amountApplied;
      sched.status = "OP";

      const invs = this.getInvoices();
      const inv = invs.find(x => x.invoiceId === sched.invoiceId);
      if (inv) inv.status = "PARTIALLY_PAID";
      setStorage("ar_invoices", invs);
    }

    app.status = "UNAPPLIED";

    setStorage("ar_receivable_applications", apps);
    setStorage("ar_payment_schedules", scheds);
  };

  // Adjustments
  static getAdjustments = () => getStorage<ARAdjustment>("ar_adjustments", MOCK_ADJUSTMENTS);
  static getAutoAdjustmentBatches = () => getStorage<ARAutoAdjustmentBatch>("ar_auto_adjustment_batches", MOCK_AUTO_ADJUSTMENT_BATCHES);
  static getAutoAdjustmentLines = () => getStorage<ARAutoAdjustmentLine>("ar_auto_adjustment_lines", MOCK_AUTO_ADJUSTMENT_LINES);

  static createAdjustment = (adj: ARAdjustment) => {
    const list = this.getAdjustments();
    const scheds = this.getPaymentSchedules();
    const sched = scheds.find(x => x.invoiceId === adj.invoiceId);

    if (!sched) throw new Error("Invoice schedule not found");

    adj.adjustmentId = list.length > 0 ? Math.max(...list.map(x => x.adjustmentId)) + 1 : 1;
    adj.adjustmentNumber = `ADJ-2026-${adj.adjustmentId.toString().padStart(4, "0")}`;
    adj.status = adj.status || "PENDING_APPROVAL";
    list.push(adj);
    setStorage("ar_adjustments", list);
    return adj;
  };

  static approveAdjustment = (id: number) => {
    const list = this.getAdjustments();
    const adj = list.find(x => x.adjustmentId === id);
    if (!adj) throw new Error("Adjustment not found");

    adj.status = "APPROVED";

    // Recalculate invoice remaining debt
    const scheds = this.getPaymentSchedules();
    const sched = scheds.find(x => x.invoiceId === adj.invoiceId);
    if (sched) {
      sched.amountAdjusted = (sched.amountAdjusted || 0) + adj.adjustmentAmount;
      sched.amountDueRemaining -= adj.adjustmentAmount;
      setStorage("ar_payment_schedules", scheds);
    }

    setStorage("ar_adjustments", list);
  };

  // Netting
  static getNettingAgreements = () => getStorage<ARApNettingAgreement>("ar_ap_netting_agreements", MOCK_AP_NETTING_AGREEMENTS);
  static getNettingPartners = () => getStorage<ARApNettingPartner>("ar_ap_netting_partners", MOCK_AP_NETTING_PARTNERS);
  static getNettingBatches = () => getStorage<ARApNettingBatch>("ar_ap_netting_batches", MOCK_AP_NETTING_BATCHES);
  static getNettingBatchLines = () => getStorage<ARApNettingBatchLine>("ar_ap_netting_batch_lines", MOCK_AP_NETTING_BATCH_LINES);

  static createNettingAgreement = (agr: ARApNettingAgreement) => {
    const list = this.getNettingAgreements();
    agr.nettingAgreementId = list.length + 1;
    list.push(agr);
    setStorage("ar_ap_netting_agreements", list);
    return agr;
  };

  static createNettingBatch = (batch: ARApNettingBatch) => {
    const list = this.getNettingBatches();
    batch.nettingBatchId = list.length + 1;
    batch.batchNumber = `NET-B-${batch.nettingBatchId.toString().padStart(3, "0")}`;
    batch.status = "DRAFT";
    list.push(batch);
    setStorage("ar_ap_netting_batches", list);
    return batch;
  };

  // AutoInvoice Interface
  static getAutoInvoiceRequests = () => getStorage<ARAutoInvoiceRequest>("ar_autoinvoice_requests", MOCK_AUTOINVOICE_REQUESTS);
  static getInterfaceHeaders = () => getStorage<ARTransactionInterfaceHdr>("ar_transaction_interface_hdrs", MOCK_TRANSACTION_INTERFACE_HDRS);
  static getInterfaceLines = () => getStorage<ARTransactionInterfaceLine>("ar_transaction_interface_lines", MOCK_TRANSACTION_INTERFACE_LINES);
  static getInterfaceErrors = () => {
    return [
      { transactionInterfaceHdrId: 1, errorMessage: "Mã khách hàng CUST_999 không tồn tại trong danh mục MDM." },
      { transactionInterfaceHdrId: 2, errorMessage: "Ngày hạch toán (GL Date) không nằm trong chu kỳ mở (Open Period) tài chính." },
      { transactionInterfaceHdrId: 3, errorMessage: "Thuế suất VAT (15%) không đúng luật thuế giá trị gia tăng Việt Nam (Chỉ cho phép 0%, 5%, 8%, 10%)." },
      { transactionInterfaceHdrId: 4, errorMessage: "Tỷ giá quy đổi ngoại tệ (USD/VND = 150) sai lệch vượt mức biên độ quy định của Ngân hàng Nhà nước (> 5%)." },
      { transactionInterfaceHdrId: 5, errorMessage: "Số tiền nguyên tệ nhân tỷ giá không khớp số tiền quy đổi VND tương đương vượt ngưỡng sai số làm tròn cho phép." }
    ];
  };

  // Accounting
  static getAccountingEvents = () => getStorage<ARAccountingEvent>("ar_accounting_events", MOCK_ACCOUNTING_EVENTS);
  static getJournalLines = () => getStorage<ARJournalLine>("ar_journal_lines", MOCK_JOURNAL_LINES);
  static getGlTransferBatches = () => getStorage<ARGlTransferBatch>("ar_gl_transfer_batches", MOCK_GL_TRANSFER_BATCHES);

  static runAccountingEvent = (eventId: number, mode: "DRAFT" | "FINAL") => {
    const events = this.getAccountingEvents();
    const ev = events.find(x => x.eventId === eventId);
    if (!ev) throw new Error("Event not found");

    ev.accountingStatus = mode === "FINAL" ? "FINAL" : "DRAFT";
    setStorage("ar_accounting_events", events);
  };
}
