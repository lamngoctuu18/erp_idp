export interface ApInvoiceModel {
  invoiceId: number;
  invoiceNum: string; // Số hóa đơn đỏ
  invoiceDate: string;
  glDate: string;
  vendorId: number;
  vendorSiteId: number;
  invoiceAmount: number;
  currencyCode: string;
  paymentTermId: number;
  paymentMethodCode: string;
  bankAccountId?: number;
  status: "DRAFT" | "NEEDS_REVALIDATION" | "APPROVED" | "PAID" | "PARTIALLY_PAID" | "CANCELLED";
  invoiceType?: "STANDARD" | "CREDIT_MEMO" | "PREPAYMENT" | "MIXED";
  description?: string;
  creationDate: string;
  createdBy: number;
}

export interface ApInvoiceLineModel {
  invoiceLineId: number;
  invoiceId: number;
  lineNum: number;
  lineType: "ITEM" | "FREIGHT" | "TAX" | "MISCELLANEOUS";
  amount: number;
  quantityInvoiced?: number;
  unitPrice?: number;
  description?: string;
  poHeaderId?: number;
  poNumber?: string;
  poLineId?: number;
  receiptId?: number;
  receiptNum?: string;
  receiptLineId?: number;
}

export interface ApInvoiceDistributionModel {
  invoiceDistributionId: number;
  invoiceLineId: number;
  invoiceId: number;
  distributionLineNumber: number;
  amount: number;
  accountCcid: number;
  description?: string;
}

export interface ApInvoiceMatchModel {
  matchId: number;
  invoiceId: number;
  invoiceLineId: number;
  matchingType: "ITEM" | "FREIGHT" | "MISC" | "TAX";
  poHeaderId?: number;
  poNumber?: string;
  poLineId?: number;
  receiptId?: number;
  receiptNum?: string;
  receiptLineId?: number;
  qtyInvoiced?: number;
  unitPrice?: number;
  matchAmount: number;
  matchDate: string;
  matchStatus: string; // 'MATCHED'
}

export interface ApPrepaymentApplicationModel {
  applicationId: number;
  invoiceId: number; // Hóa đơn Standard
  prepaymentInvoiceId: number; // Hóa đơn Prepayment
  amountApplied: number;
  taxAmountApplied?: number;
  glDate: string;
  prepaymentOnInvoiceFlag: "Y" | "N";
  applicationType: "APPLY" | "UNAPPLY";
  applicationDate: string;
  status: string; // 'ACTIVE'
}

export interface ApHoldDefinitionModel {
  holdCode: string;
  holdName: string;
  holdReason?: string;
  systemFlag: "Y" | "N";
  manualReleaseAllowedFlag: "Y" | "N";
  activeFlag: "Y" | "N";
}

export interface ApInvoiceHoldModel {
  invoiceHoldId: number;
  invoiceId: number;
  holdCode: string;
  holdDate: string;
  heldBy: number;
  releaseCode?: string;
  releaseDate?: string;
  releasedBy?: number;
  status: "HELD" | "RELEASED";
}

export interface ApPaymentScheduleModel {
  paymentScheduleId: number;
  invoiceId: number;
  dueDate: string;
  amountDue: number;
  amountRemaining: number;
  discountDate?: string;
  discountAmountAvailable?: number;
  status: "UNPAID" | "PARTIALLY_PAID" | "PAID";
}

export interface ApPaymentModel {
  paymentId: number;
  paymentNum: string; // Số chứng từ chi
  paymentDate: string;
  glDate: string;
  vendorId: number;
  vendorSiteId: number;
  bankAccountId: number;
  paymentMethodCode: string;
  amount: number;
  currencyCode: string;
  status: "CONFIRMED" | "CANCELLED";
  createdBy: number;
}

export interface ApInvoicePaymentModel {
  invoicePaymentId: number;
  paymentId: number;
  invoiceId: number;
  paymentScheduleId: number;
  amountApplied: number;
  discountTaken?: number;
  exchangeRateGainLoss?: number;
}

export interface ApDocumentActionLogModel {
  actionId: number;
  documentType: "INVOICE" | "PAYMENT";
  documentId: number;
  actionCode: "VALIDATE" | "APPROVE" | "HOLD" | "RELEASE" | "PAY" | "CANCEL";
  actionDate: string;
  glDate?: string;
  actionBy: number;
  oldStatus?: string;
  newStatus?: string;
  reason?: string;
  note?: string;
}

export interface ApDocumentAttachmentModel {
  attachmentId: number;
  documentType: "SUPPLIER" | "INVOICE" | "PAYMENT";
  documentId: number;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  fileSize?: number;
  uploadedBy?: number;
  uploadedAt: string;
  description?: string;
}

export interface ApActEventModel {
  eventId: number;
  eventTypeCode: string;
  eventStatus: string;
  sourceId: number;
  sourceTable: "AP_INVOICES" | "AP_PAYMENTS";
}

export interface ApActEventHeaderModel {
  accountingHeaderId: number;
  eventId: number;
  ledgerId: number;
  glDate: string;
  description?: string;
  postedFlag: "Y" | "N";
}

export interface ApActEventLineModel {
  accountingLineId: number;
  accountingHeaderId: number;
  lineNum: number;
  accountCcid: number;
  debitAmount?: number;
  creditAmount?: number;
  description?: string;
}

// Model ảo cho Đơn mua hàng PO và Phiếu nhập kho phục vụ So khớp
export interface MockPurchaseOrderModel {
  poHeaderId: number;
  poNumber: string;
  vendorId: number;
  vendorSiteId: number;
  poDate: string;
  description: string;
  lines: MockPurchaseOrderLineModel[];
}

export interface MockPurchaseOrderLineModel {
  poLineId: number;
  poHeaderId: number;
  lineNum: number;
  itemName: string;
  qtyOrdered: number;
  qtyReceived: number;
  qtyBilled: number;
  unitPrice: number;
  amount: number;
}
