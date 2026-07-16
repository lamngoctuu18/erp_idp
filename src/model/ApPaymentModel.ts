export interface ApPayment {
  orgId: number;
  vendorId: number;
  vendorName: string;
  vendorSiteId: number;
  vendorSiteCode: string;
  bankAccountId: number | null;
  bankAccountNum: number | null;
  bankAccountName: string | null;
  bankAccountType: string | null;
  bankFt: string | null;
  paymentId: number;
  paymentNumber: number;
  checkDate: string;
  currencyCode: string;
  paymentTypeFlag: string | null;
  paymentMethodLookupCode: string;
  statusLookupCode: string;
  description: string | null;
  exchangeRate: number | null;
  amount: number | null;
  baseAmount: number | null;
  ccidCr: number | null;
  ccidDr: number | null;
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
  paymentType: string | null;
  rateType: string | null;
  rateDate: string | null;
  clearStatus: string | null;
  voidStatus: string | null;
  voidDate: string | null;
  voidGlDate: string | null;
}

export interface ApPaymentBatch {
  batchId: number;
  batchName: string;
  paymentMethod: string;
  bankAccountId: number | null;
  paymentDate: string | null;
  totalAmount: number | null;
  status: string | null;       // "PENDING" | "APPROVED" | "VOID"
  createdBy: number;
}

export interface ApPaymentSchedule {
  id: number;
  orgId: number;
  invoiceId: number;
  dueDate: string | null;
  amountRemaining: number | null;
  grossAmount: number | null;
  holdFlag: string | null;
  discountDate: string | null;
  paymentMethod: string | null;
  paymentNum: number | null;
  paymentStatusFlag: string | null;
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
  discountAmount: number | null;
  paymentStatus: string | null;
  invoiceNum?: string; // Join property
}

export interface ApPaymentTerm {
  paymentTermId: number;
  termName: string;
  description: string | null;
  cutoffDay: number | null;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  rankNo: number | null;
  status: string | null;
}

export interface ApPaymentTermDiscount {
  discountId: number;
  paymentTermId: number;
  discountLevel: number;
  discountPercent: number | null;
  days: number | null;
  dayOfMonth: number | null;
  monthsAhead: number | null;
  termName?: string; // Join property
}

export interface ApPaymentTermLine {
  termLineId: number;
  paymentTermId: number;
  lineNum: number;
  duePercent: number | null;
  dueAmount: number | null;
  fixedDate: string | null;
  days: number | null;
  dayOfMonth: number | null;
  monthAhead: number | null;
  termName?: string; // Join property
}

export interface ApInvoicePayment {
  setOfBooksId: number;
  orgId: number;
  invoiceId: number;
  paymentId: number;
  invoicePaymentId: number;
  accountingEventId: number | null;
  accountingDate: string | null;
  periodName: string;
  amount: number | null;
  ccidDr: number | null;
  ccidCr: number | null;
  reversalFlag: string | null;
  currencyCode: string;
  exchangeRate: number | null;
  invoiceAmount: number | null;
  invoiceBaseAmount: number | null;
  paymentAmount: number | null;
  paymentBaseAmount: number | null;
  paymentNum: number | null;
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
  paymentNumber?: number; // Join property
  invoiceNum?: string;     // Join property
}
