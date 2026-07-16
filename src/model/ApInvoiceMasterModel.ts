export interface ApInvoice {
  setOfBooksId: number;
  orgId: number;
  batchId: number | null;
  vendorId: number;
  vendorSiteId: number;
  invoiceId: number;
  invoiceNum: string | null;
  invoiceDate: string;
  invoiceCurrencyCode: string;
  exchangeRate: number | null;
  invoiceAmount: number | null;
  baseAmount: number | null;
  invoiceTypeLookupCode: string | null;
  description: string | null;
  termsId: number | null;
  termsDate: string | null;
  paymentCurrencyCode: string | null;
  paymentMethodLookupCode: string | null;
  prepayFlag: string | null;
  amountPaid: number | null;
  cancelledAmount: number | null;
  discountAmountTaken: number | null;
  taxAmount: number | null;
  acctsPayCodeCombinationId: number | null;
  status: string | null; // "NEEDS_REVALIDATION" | "VALIDATED" | "CANCELLED"
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  attribute10?: string | null;
  attribute11?: string | null;
  attribute12?: string | null;
  attribute13?: string | null;
  attribute14?: string | null;
  attribute15?: string | null;
  lastUpdatedBy: number | null;
  lastUpdateDate: string;
  createdBy: number;
  creationDate: string;
  poNumber: string | null;
  validationStatus: string | null;
  accountingStatus: string | null;
  cancelledFlag: string | null;
  cancelDate: string | null;
  cancelGlDate: string | null;
  remainingAmount: number | null;
  vendorName?: string; // Join property
  vendorSiteCode?: string; // Join property
  termName?: string; // Join property
}

export interface ApInvoiceLine {
  setOfBooksId: number;
  orgId: number;
  invoiceId: number;
  invoiceLineId: number;
  rcvTransactionId: number | null;
  poLineId: number | null;
  itemId: number | null;
  itemCode: string;
  itemName: string;
  uomId: number | null;
  quantity: number | null;
  price: number | null;
  amount: number | null;
  baseAmount: number | null;
  periodName: number | null;
  accountingDate: number | null;
  accountingEventId: number | null;
  lineLineNumber: number;
  distCodeCombinationId: number;
  lineTypeLookupCode: string; // "ITEM" | "TAX" | "FREIGHT" | "MISCELLANEOUS"
  prepayLineId: number | null;
  prepayAmountRemaining: number | null;
  discountProgram: number | null;
  discountAmount: number | null;
  vatTaxCode: string | null;
  vatTaxAmount: number | null;
  feeAmount: number | null;
  importTaxCode: string | null;
  importAmount: number | null;
  specialConsumptionTaxCode: string | null;
  specialConsumptionTaxAmount: number | null;
  description: string | null;
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  attribute10?: string | null;
  attribute11?: string | null;
  attribute12?: string | null;
  attribute13?: string | null;
  attribute14?: string | null;
  attribute15?: string | null;
  lastUpdatedBy: number | null;
  lastUpdateDate: string;
  createdBy: number;
  creationDate: string;
  poNumber: string | null;
  receiptNum: string | null;
  matchStatus: string | null;
}

export interface ApInvoiceDistribution {
  setOfBooksId: number;
  orgId: number;
  invoiceId: number;
  id: number;
  rcvTransactionId: number | null;
  poDistributionId: number | null;
  periodName: string | null;
  accountingDate: string | null;
  accountingEventId: number | null;
  distributionLineNumber: number | null;
  drCcid: number | null;
  crCcid: number | null;
  lineType: string | null;
  amount: number | null;
  baseAmount: number | null;
  prepayDistributionId: number | null;
  prepayAmountRemaining: number | null;
  description: string | null;
  attribute1?: string | null;
  attribute2?: string | null;
  attribute3?: string | null;
  attribute4?: string | null;
  attribute5?: string | null;
  attribute6?: string | null;
  attribute7?: string | null;
  attribute8?: string | null;
  attribute9?: string | null;
  attribute10?: string | null;
  attribute11?: string | null;
  attribute12?: string | null;
  attribute13?: string | null;
  attribute14?: string | null;
  attribute15?: string | null;
  lastUpdateBy: number | null;
  lastUpdateDate: string;
  createBy: number;
  createDate: string;
  invoiceLineId: number | null;
  taxType: string | null;
  voucherNumber: string | null;
  vendorTaxCode: string | null;
}

export interface ApInvoiceMatch {
  matchId: number;
  invoiceId: number;
  invoiceLineId: number;
  matchingType: string; // "TWO_WAY" | "THREE_WAY" | "FOUR_WAY"
  poHeaderId: number | null;
  poNumber: string | null;
  poLineId: number | null;
  receiptId: number | null;
  receiptNum: string | null;
  receiptLineId: number | null;
  qtyInvoiced: number | null;
  unitPrice: number | null;
  matchAmount: number;
  matchDate: string;
  matchStatus: string; // "MATCHED" | "UNMATCHED"
  createdBy: number;
  createdDate: string;
  lastUpdateBy: number;
  lastUpdateDate: string;
}

export interface ApInvoiceBatch {
  batchId: number;
  batchName: string;
  batchStatus: string; // "PENDING" | "APPROVED" | "CLOSED"
  estimatedAmount: number | null;
  actualAmount: number | null;
  invoiceCount: number | null;
  actualInvoiceCount: number | null;
  creationDate: string;
  createdBy: number;
  invoiceCurrencyCode: string | null;
  paymentTermId: number | null;
  payGroup: string | null;
  termName?: string; // Join property
}

export interface ApInvoiceChargeAllocation {
  allocationId: number;
  invoiceId: number;
  invoiceLineId: number;
  chargeType: string; // "FREIGHT" | "INSURANCE" | "DUTY" | "TAX"
  prorateFlag: string; // "Y" | "N"
  accountCcid: number | null;
  amount: number;
  receiptId: number | null;
  receiptLineId: number | null;
  chargeAmount: number;
  createdBy: number;
  createdDate: string;
  lastUpdateBy: number;
  lastUpdateDate: string;
}

export interface ApInvoiceHold {
  holdId: number;
  invoiceId: number;
  holdLookupCode: string | null;
  holdDate: string | null;
  heldBy: number | null;
  releaseLookupCode: string | null;
  releaseDate: string | null;
  releasedBy: number | null;
  holdReason: string | null;
  releaseReason: string | null;
  holdName?: string; // Join property
}

export interface ApHoldDefinition {
  holdCode: string;
  holdName: string;
  holdReason: string | null;
  systemFlag: string; // "Y" | "N"
  manualReleaseAllowedFlag: string; // "Y" | "N"
  activeFlag: string; // "Y" | "N"
  createdBy: number;
  createdDate: string;
  lastUpdateBy: number;
  lastUpdateDate: string;
}

export interface ApPrepaymentApplication {
  applicationId: number;
  invoiceId: number;
  prepaymentInvoiceId: number;
  amountApplied: number;
  taxAmountApplied: number | null;
  glDate: string;
  prepaymentOnInvoiceFlag: string; // "Y" | "N"
  applicationType: string; // "APPLY" | "UNAPPLY"
  applicationDate: string;
  status: string; // "POSTED" | "UNPOSTED"
  createdBy: number;
  createdDate: string;
  lastUpdateBy: number;
  lastUpdateDate: string;
  prepaymentInvoiceNum?: string; // Join property
}
