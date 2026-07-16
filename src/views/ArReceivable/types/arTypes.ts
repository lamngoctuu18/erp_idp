/**
 * Auto-generated domain types mapping 100% of the AR Data Dictionary.
 * Generated on: 2026-07-12
 */

/**
 * Sheet Name: AR_INVOICES
 * Table Name: AR_INVOICES
 * Role: Lưu đầu giao dịch AR: hóa đơn, credit memo, debit memo, deposit; quản lý khách hàng, loại giao dịch, tiền tệ, số tiền, trạng thái complete/accounting/GL và số dư phải thu.
 * Business Group: Invoice/Transaction
 */
export interface ARInvoice {
  /** PK: ID giao dịch/hóa đơn AR */
  invoiceId: number;
  /** FK: Sổ cái/Set of Books hoặc Ledger */
  sobId?: number | null;
  /** FK: Operating Unit/đơn vị phát sinh giao dịch */
  orgId: number;
  /** FK: Pháp nhân tương ứng với OU */
  legalEntityId?: number | null;
  /** FK: Phòng ban/bộ phận ghi nhận doanh thu */
  deptId?: number | null;
  /** FK: Nguồn giao dịch AR, dùng cho AutoInvoice/Manual */
  transactionSourceId?: number | null;
  /** FK: Loại giao dịch AR; quyết định class, sign, tài khoản hạch toán */
  transactionTypeId: number;
  /** Mã giao dịch hệ thống tự sinh; unique theo ORG_ID */
  invoiceNumber: string;
  /** Số hóa đơn/chứng từ thực tế */
  invoiceNum?: string | null;
  /** Số tham chiếu nguồn: Sales Order, hợp đồng, chứng từ gốc */
  referenceNumber?: string | null;
  /** Nguồn tạo: MANUAL, SALES_ORDER, SQL_LOADER, INTERCOMPANY */
  sourceSystem?: string | null;
  /** ID hoặc mã chứng từ ở hệ thống nguồn */
  sourceRefId?: string | null;
  /** Ngày chứng từ/transaction date */
  invoiceDate: string;
  /** Ngày hạch toán vào sổ cái */
  glDate: string;
  /** Ngày đến hạn thanh toán chính của giao dịch */
  dueDate?: string | null;
  /** Loại chứng từ: INVOICE, CREDIT_MEMO, DEBIT_MEMO, DEPOSIT */
  type?: string | null;
  /** Class theo AR: Invoice/Credit/Debit/Deposit; không thay thế Transaction Type */
  transactionClass?: string | null;
  /** Loại tiền giao dịch */
  invoiceCurrencyCode: string;
  /** Tỷ giá quy đổi về tiền hạch toán */
  exchangeRate: number;
  /** Ngày tỷ giá */
  rateDate?: string | null;
  /** Loại tỷ giá: Spot/User/Corporate */
  rateType?: string | null;
  /** FK: Điều khoản thanh toán */
  termsId?: number | null;
  /** Ngày tính hạn thanh toán */
  termsDate?: string | null;
  /** FK: Receipt Method mặc định nếu có */
  receiptMethodId?: number | null;
  /** Phương thức thanh toán snapshot nếu cần tương thích dữ liệu cũ */
  paymentMethod?: string | null;
  /** FK: Khách hàng mua hàng */
  soldToCustomerId: number;
  /** FK: Liên hệ khách hàng mua */
  soldToContactId?: number | null;
  /** FK: Khách hàng xuất hóa đơn */
  billToCustomerId?: number | null;
  /** FK: Liên hệ xuất hóa đơn */
  billToContactId?: number | null;
  /** FK: Khách hàng nhận hàng */
  shipToCustomerId?: number | null;
  /** FK: Liên hệ nhận hàng */
  shipToContactId?: number | null;
  /** FK: Địa chỉ nhận hóa đơn */
  billToAddressId?: number | null;
  /** FK: Địa chỉ giao hàng */
  shipToAddressId?: number | null;
  /** FK: Tài khoản ngân hàng khách hàng */
  customerBankAccountId?: number | null;
  /** FK: Nhân viên bán hàng chính */
  saleId?: number | null;
  /** FK: Nhân viên bán hàng phụ */
  saleId1?: number | null;
  /** Tên người mua; chuẩn hóa từ BYER */
  buyerName?: string | null;
  /** Số điện thoại người mua; chuẩn hóa từ BYER_PHONE */
  buyerPhone?: string | null;
  /** Số hóa đơn cũ khi chuyển đổi/migrate dữ liệu */
  oldInvNumber?: string | null;
  /** Số đơn hàng bán */
  orderNumber?: string | null;
  /** FK: Chứng từ gốc khi Copy Transaction */
  copiedFromInvoiceId?: number | null;
  /** FK: Hóa đơn gốc bị Credit Transaction */
  creditedInvoiceId?: number | null;
  /** FK: Transaction Type dùng cho Void Transaction */
  voidTransactionTypeId?: number | null;
  /** Y/N: giao dịch đã Complete hay chưa */
  completeFlag: string;
  /** Trạng thái: DRAFT, INCOMPLETE, COMPLETE, OPEN, CLOSED, PAID, VOID */
  status: string;
  /** Trạng thái định khoản: NONE, DRAFT, FINAL, FINAL_POSTED */
  accountingStatus?: string | null;
  /** Trạng thái chuyển GL: NOT_TRANSFERRED, TRANSFERRED, ERROR */
  transferToGlStatus?: string | null;
  /** Y/N: đã post lên GL */
  postedFlag?: string | null;
  /** Y/N: chứng từ đã void */
  voidedFlag?: string | null;
  /** Y/N: chứng từ đảo/được đảo */
  reversedFlag?: string | null;
  /** Y/N: chứng từ hủy mềm */
  cancelledFlag?: string | null;
  /** Tổng doanh thu chưa thuế */
  totalAmountRev?: number | null;
  /** Tổng thuế VAT */
  totalAmountTax?: number | null;
  /** Tổng chiết khấu */
  totalAmountDiscount?: number | null;
  /** Tổng phí/freight/charges */
  totalAmountFee?: number | null;
  /** Tổng voucher giảm trừ */
  totalAmountVoucher?: number | null;
  /** Tổng tiền đã thu/apply */
  totalAmountPaid?: number | null;
  /** Số dư công nợ còn lại */
  totalAmountRemaining?: number | null;
  /** Tổng tiền phải thu */
  totalAmount?: number | null;
  /** Payload UI để tương thích giai đoạn chuyển đổi, không dùng thay dữ liệu chuẩn hóa */
  uiPayload?: string | null;
  /** Ghi chú hóa đơn */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_INVOICE_LINES
 * Table Name: AR_INVOICE_LINES
 * Role: Lưu chi tiết dòng hóa đơn: hàng hóa/dịch vụ, số lượng, đơn giá, thuế, phí, chiết khấu/voucher và số tiền theo từng dòng.
 * Business Group: Invoice/Transaction
 */
export interface ARInvoiceLine {
  /** PK: ID dòng hóa đơn */
  lineId: number;
  /** FK: AR_INVOICES.INVOICE_ID; chuẩn hóa từ HEADER_ID */
  invoiceId: number;
  /** Cột tương thích dữ liệu cũ; nên mapping sang INVOICE_ID */
  headerId?: number | null;
  /** Số thứ tự dòng, unique theo INVOICE_ID */
  lineNumber: number;
  /** FK: Ledger/Set of Books */
  sobId?: number | null;
  /** FK: Operating Unit */
  orgId: number;
  /** FK: Phòng ban */
  deptId?: number | null;
  /** FK: Loại giao dịch, snapshot từ header nếu cần */
  transactionTypeId?: number | null;
  /** FK: MDM/Inventory item */
  inventoryItemId?: number | null;
  /** Đơn vị tính */
  uomCode?: string | null;
  /** Diễn giải hàng hóa/dịch vụ */
  description?: string | null;
  /** Số lượng đặt hàng; chuẩn hóa từ QUANTITY_ORDERRED */
  quantityOrdered?: number | null;
  /** Số lượng đã giảm nợ */
  quantityCredited?: number | null;
  /** Số lượng đã xuất hóa đơn */
  quantityInvoiced?: number | null;
  /** Đơn giá chuẩn */
  unitStandardPrice?: number | null;
  /** Đơn giá bán thực tế */
  unitSellingPrice?: number | null;
  /** Thành tiền dòng = quantity * unit price */
  lineAmount?: number | null;
  /** PRODUCT, SERVICE, FREIGHT, CHARGES, TAX */
  lineType?: string | null;
  /** Mã thuế suất theo tài liệu AR */
  taxClassificationCode?: string | null;
  /** Thuế suất VAT */
  taxRate?: number | null;
  /** FK: Danh mục thuế VAT */
  vatTaxId?: number | null;
  /** Giá trị tính thuế */
  taxableAmount?: number | null;
  /** FK: Kho hàng */
  warehouseId?: number | null;
  /** Số đơn hàng bán gốc */
  salesOrder?: string | null;
  /** Dòng đơn hàng bán gốc */
  salesOrderLine?: string | null;
  /** Ngày đơn hàng bán gốc */
  salesOrderDate?: string | null;
  /** FK: Tài khoản doanh thu */
  revenueCcid?: number | null;
  /** FK: Tài khoản thuế GTGT đầu ra */
  taxCcid?: number | null;
  /** FK: Tài khoản phải thu snapshot nếu cần */
  receivableCcid?: number | null;
  /** Tiền freight/phí vận chuyển */
  freightAmount?: number | null;
  /** Tiền charge/late charge */
  chargeAmount?: number | null;
  /** Doanh thu dòng chưa VAT */
  amountRev?: number | null;
  /** Tiền thuế dòng */
  amountTax?: number | null;
  /** Chiết khấu phân bổ dòng */
  amountDiscount?: number | null;
  /** Phí phân bổ dòng */
  amountFee?: number | null;
  /** Voucher phân bổ dòng */
  amountVoucher?: number | null;
  /** Số tiền gốc ban đầu của dòng */
  originalLineAmount?: number | null;
  /** Số dư còn lại của dòng */
  balanceLineAmount?: number | null;
  /** Số tiền đã credit */
  creditedAmount?: number | null;
  /** Số tiền đã adjustment */
  adjustedAmount?: number | null;
  /** Số tiền receipt đã apply vào dòng */
  receiptAppliedAmount?: number | null;
  /** Trạng thái định khoản của dòng */
  accountingStatus?: string | null;
  /** Ghi chú dòng hàng */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPTS
 * Table Name: AR_RECEIPTS
 * Role: Lưu đầu chứng từ thu tiền của khách hàng: số phiếu thu, ngày thu, GL date, phương thức thu, loại receipt, số tiền, trạng thái apply/unapply/reverse/clear/accounting.
 * Business Group: Receipt/Cash
 */
export interface ARReceipt {
  /** PK: ID chứng từ thu/chi */
  receiptId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** FK: Pháp nhân */
  legalEntityId?: number | null;
  /** Số chứng từ thu, unique theo ORG_ID */
  receiptNumber: string;
  /** FK: Khách hàng thanh toán; có thể null với Miscellaneous Receipt */
  customerId?: number | null;
  /** FK: Customer location/site */
  customerSiteId?: number | null;
  /** FK: Receipt Class */
  receiptClassId?: number | null;
  /** FK: Receipt Method */
  receiptMethodId: number;
  /** STANDARD, MISCELLANEOUS, NETTING */
  receiptType: string;
  /** Ngày chứng từ thu */
  receiptDate: string;
  /** Ngày hạch toán receipt */
  glDate: string;
  /** Ngày đáo hạn/tiền về tài khoản remittance */
  maturityDate?: string | null;
  /** Cột tương thích dữ liệu cũ; nên mapping sang RECEIPT_METHOD_ID */
  paymentMethod?: string | null;
  /** Tổng tiền thu/chi theo currency */
  totalAmount: number;
  /** Loại tiền receipt */
  currencyCode: string;
  /** Tỷ giá */
  exchangeRate: number;
  /** Ngày tỷ giá */
  rateDate?: string | null;
  /** Loại tỷ giá: Spot/User/Corporate */
  rateType?: string | null;
  /** Số tiền quy đổi về tiền chức năng */
  functionalAmount?: number | null;
  /** Số tiền đã apply vào hóa đơn */
  appliedAmount?: number | null;
  /** Số tiền chưa apply */
  unappliedAmount?: number | null;
  /** Số tiền chưa xác định khách hàng */
  unidentifiedAmount?: number | null;
  /** Số tiền nhận trước/on-account */
  onAccountAmount?: number | null;
  /** FK: Tài khoản ngân hàng khách hàng */
  customerBankAccountId?: number | null;
  /** FK: Tài khoản ngân hàng nhận tiền */
  remitBankAccountId?: number | null;
  /** DRAFT, APPROVED, UNAPPLIED, APPLIED, REVERSED, CLEARED */
  status: string;
  /** Trạng thái nghiệp vụ hiển thị trên màn hình receipt */
  state?: string | null;
  /** UNCLEARED, CLEARED */
  clearingStatus?: string | null;
  /** NONE, DRAFT, FINAL, FINAL_POSTED */
  accountingStatus?: string | null;
  /** NOT_TRANSFERRED, TRANSFERRED, ERROR */
  transferToGlStatus?: string | null;
  /** Y/N: đã reverse */
  reversedFlag?: string | null;
  /** FK: chứng từ đảo nếu có */
  reversedByReceiptId?: number | null;
  /** Ghi chú chứng từ thu */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_RECEIPT_ALLOCATIONS
 * Table Name: AR_RECEIPT_ALLOCATIONS
 * Role: Bảng phân bổ tiền thu hiện có; nên chuẩn hóa thành AR_RECEIVABLE_APPLICATIONS để quản lý apply/unapply, discount, exchange gain/loss và số dư sau apply.
 * Business Group: Receipt Application
 */
export interface ARReceiptAllocation {
  /** PK: ID phân bổ cũ; giữ để tương thích */
  allocationId: number;
  /** FK: AR_RECEIPTS; có thể null với giảm trừ trực tiếp */
  receiptId?: number | null;
  /** FK: AR_INVOICES được phân bổ giảm công nợ */
  invoiceId: number;
  /** FK: AR_RECEIVABLE_APPLICATIONS sau khi nâng cấp */
  applicationId?: number | null;
  /** PAYMENT, VOUCHER, DISCOUNT; nên mapping sang APPLICATION_TYPE */
  allocationType: string;
  /** Số tiền phân bổ cũ */
  amount: number;
  /** Ngày phân bổ */
  allocationDate: string;
  /** Ngày hạch toán phân bổ sau nâng cấp */
  glDate?: string | null;
  /** Mã voucher nếu áp dụng */
  voucherCode?: string | null;
  /** Lý do chiết khấu công nợ */
  discountReason?: string | null;
  /** ACTIVE, REVERSED, MIGRATED */
  status?: string | null;
  /** Ghi chú */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_PROMOTIONS
 * Table Name: AR_PROMOTIONS
 * Role: Lưu chương trình khuyến mại, voucher, discount; kiểm soát loại chương trình, cách tính, giá trị, thời hạn và trạng thái hiệu lực.
 * Business Group: Promotion/Voucher
 */
export interface ARPromotion {
  /** PK: ID chương trình khuyến mại */
  promotionId: number;
  /** Mã chương trình/voucher; unique */
  code: string;
  /** Tên chương trình khuyến mại */
  name: string;
  /** PRODUCT, INVOICE */
  promotionType: string;
  /** VOUCHER, DISCOUNT */
  promotionCategory: string;
  /** PERCENTAGE, FIXED_AMOUNT */
  calculationType: string;
  /** Giá trị giảm */
  value: number;
  /** Giá trị đơn hàng tối thiểu */
  minOrderValue?: number | null;
  /** Mức giảm tối đa */
  maxDiscountLimit?: number | null;
  /** Ngày bắt đầu hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** ACTIVE, INACTIVE, EXPIRED */
  status: string;
  /** DRAFT, APPROVED, REJECTED nếu cần phê duyệt */
  approvalStatus?: string | null;
  /** Mô tả chương trình */
  description?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_PROMOTION_PRODUCTS
 * Table Name: AR_PROMOTION_PRODUCTS
 * Role: Lưu phạm vi sản phẩm được áp dụng cho từng chương trình khuyến mại cấp sản phẩm.
 * Business Group: Promotion/Voucher
 */
export interface ARPromotionProduct {
  /** PK: ID liên kết chương trình với sản phẩm */
  promotionProductId: number;
  /** FK: AR_PROMOTIONS */
  promotionId: number;
  /** FK: Sản phẩm được áp dụng */
  inventoryItemId: number;
  /** Ngày bắt đầu áp dụng cho sản phẩm */
  startDate?: string | null;
  /** Ngày hết hiệu lực cho sản phẩm */
  endDate?: string | null;
  /** ACTIVE, INACTIVE */
  status?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_INVOICE_PROMOTIONS
 * Table Name: AR_INVOICE_PROMOTIONS
 * Role: Lưu lịch sử voucher/discount đã áp dụng cho hóa đơn hoặc dòng hóa đơn để audit và tính số tiền giảm trừ.
 * Business Group: Promotion/Voucher
 */
export interface ARInvoicePromotion {
  /** PK: ID nhật ký khuyến mại áp dụng */
  invoicePromotionId: number;
  /** FK: AR_INVOICES */
  invoiceId: number;
  /** FK: AR_INVOICE_LINES; null nếu áp dụng cấp hóa đơn */
  invoiceLineId?: number | null;
  /** FK: AR_PROMOTIONS */
  promotionId: number;
  /** Mã voucher/discount đã dùng */
  code: string;
  /** Số tiền thực tế đã giảm */
  appliedAmount: number;
  /** APPLIED, REVERSED */
  applicationStatus?: string | null;
  /** Y/N: đã đảo áp dụng hay chưa */
  reversedFlag?: string | null;
  /** Ngày đảo áp dụng khuyến mại */
  reversalDate?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_SOURCES
 * Table Name: AR_TRANSACTION_SOURCES
 * Role: Định nghĩa nguồn tạo hóa đơn: nhập tay, Sales Order, SQL Loader, Intercompany; phục vụ AutoInvoice và kiểm soát nguồn dữ liệu.
 * Business Group: Setup AR
 */
export interface ARTransactionSource {
  /** PK: ID nguồn giao dịch AR */
  transactionSourceId: number;
  /** FK: OU áp dụng nguồn giao dịch */
  orgId?: number | null;
  /** Mã nguồn giao dịch; unique theo OU */
  sourceCode: string;
  /** Tên nguồn: MANUAL, AUTOINVOICE, SALES_ORDER, INTERCOMPANY */
  sourceName: string;
  /** MANUAL, IMPORT, SYSTEM */
  sourceType: string;
  /** Y/N: tự sinh số chứng từ */
  autoNumberFlag?: string | null;
  /** Y/N: cho phép giữ interface line lỗi để xử lý */
  allowInvalidLinesFlag?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Ngày bắt đầu hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_TYPES
 * Table Name: AR_TRANSACTION_TYPES
 * Role: Định nghĩa loại giao dịch AR và logic hạch toán: Invoice/Credit/Debit, creation sign, open receivable, post GL, tài khoản Receivable/Revenue/Tax.
 * Business Group: Setup AR
 */
export interface ARTransactionType {
  /** PK: ID Transaction Type */
  transactionTypeId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** FK: Legal Entity */
  legalEntityId?: number | null;
  /** Mã loại giao dịch */
  typeCode: string;
  /** Tên loại giao dịch */
  typeName: string;
  /** Diễn giải */
  description?: string | null;
  /** INVOICE, CREDIT_MEMO, DEBIT_MEMO, DEPOSIT */
  typeClass: string;
  /** POSITIVE, NEGATIVE, ANY */
  creationSign: string;
  /** OPEN, CLOSED */
  transactionStatus: string;
  /** PRINT, DO_NOT_PRINT */
  printingOption?: string | null;
  /** Y/N: có mở công nợ phải thu */
  openReceivableFlag?: string | null;
  /** Y/N: có post GL */
  postToGlFlag?: string | null;
  /** Y/N: chỉ cho apply tự nhiên */
  naturalApplicationOnlyFlag?: string | null;
  /** Y/N: cho phép adjustment posting */
  allowAdjustmentPostingFlag?: string | null;
  /** Y/N: cho phép freight */
  allowFreightFlag?: string | null;
  /** Y/N: cho phép apply vượt */
  allowOverapplicationFlag?: string | null;
  /** FK: TK công nợ phải thu */
  receivableCcid?: number | null;
  /** FK: TK doanh thu */
  revenueCcid?: number | null;
  /** FK: TK thuế GTGT đầu ra */
  taxCcid?: number | null;
  /** FK: TK freight */
  freightCcid?: number | null;
  /** FK: TK clearing */
  clearingCcid?: number | null;
  /** FK: TK doanh thu chưa thực hiện */
  unearnedRevenueCcid?: number | null;
  /** Ngày hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_PAYMENT_TERMS
 * Table Name: AR_PAYMENT_TERMS
 * Role: Định nghĩa điều khoản thanh toán, ngày hiệu lực và quy tắc sinh hạn thanh toán cho hóa đơn.
 * Business Group: Setup AR
 */
export interface ARPaymentTerm {
  /** PK: ID điều khoản thanh toán */
  termId: number;
  /** Mã điều khoản thanh toán; unique */
  termCode: string;
  /** Tên điều khoản thanh toán */
  termName: string;
  /** Diễn giải */
  description?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Ngày bắt đầu hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_PAYMENT_TERM_LINES
 * Table Name: AR_PAYMENT_TERM_LINES
 * Role: Lưu chi tiết kỳ hạn thanh toán theo payment term để sinh installment/due date/payment schedule.
 * Business Group: Setup AR
 */
export interface ARPaymentTermLine {
  /** PK: ID dòng điều khoản */
  termLineId: number;
  /** FK: AR_PAYMENT_TERMS */
  termId: number;
  /** Số thứ tự kỳ hạn */
  lineNum: number;
  /** Tỷ lệ đến hạn */
  duePercent?: number | null;
  /** Số ngày cộng từ Terms Date */
  dueDays?: number | null;
  /** Ngày cố định trong tháng */
  dayOfMonth?: number | null;
  /** Số tháng cộng thêm */
  monthsAhead?: number | null;
  /** Ngày đến hạn cố định nếu có */
  fixedDate?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPT_CLASSES
 * Table Name: AR_RECEIPT_CLASSES
 * Role: Định nghĩa lớp receipt: creation method, remittance method, clearance method, xác nhận và các tùy chọn nhận tiền.
 * Business Group: Receipt Setup
 */
export interface ARReceiptClass {
  /** PK: ID Receipt Class */
  receiptClassId: number;
  /** Mã Receipt Class; unique */
  classCode: string;
  /** Tên Receipt Class */
  className: string;
  /** MANUAL, AUTOMATIC */
  creationMethod: string;
  /** NO_REMITTANCE, STANDARD, FACTORING */
  remittanceMethod: string;
  /** DIRECTLY, BY_MATCHING, NONE */
  clearanceMethod: string;
  /** Y/N: yêu cầu confirm receipt */
  requireConfirmationFlag?: string | null;
  /** Y/N: Notes Receivable */
  notesReceivableFlag?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPT_METHODS
 * Table Name: AR_RECEIPT_METHODS
 * Role: Định nghĩa phương thức thu tiền như tiền mặt, chuyển khoản, netting; gắn với receipt class và hiệu lực sử dụng.
 * Business Group: Receipt Setup
 */
export interface ARReceiptMethod {
  /** PK: ID Receipt Method */
  receiptMethodId: number;
  /** FK: AR_RECEIPT_CLASSES */
  receiptClassId: number;
  /** Mã phương thức thu; unique theo class */
  methodCode: string;
  /** Tên Receipt Method */
  methodName: string;
  /** Tên in trên chứng từ */
  printedName?: string | null;
  /** Ngày bắt đầu hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPT_METHOD_BANK_ACCTS
 * Table Name: AR_RECEIPT_METHOD_BANK_ACCTS
 * Role: Gắn receipt method với tài khoản ngân hàng nhận tiền, OU, loại tiền và các tài khoản Cash/Unapplied/Unidentified/On-account/Earned Discount.
 * Business Group: Receipt Setup
 */
export interface ARReceiptMethodBankAcct {
  /** PK: ID mapping Receipt Method - Bank Account */
  methodBankAccountId: number;
  /** FK: AR_RECEIPT_METHODS */
  receiptMethodId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** FK: CE_BANK_ACCOUNTS */
  bankAccountId: number;
  /** Loại tiền tài khoản */
  currencyCode: string;
  /** FK: TK tiền */
  cashCcid?: number | null;
  /** FK: TK Unapplied Receipts */
  unappliedCcid?: number | null;
  /** FK: TK Unidentified Receipts */
  unidentifiedCcid?: number | null;
  /** FK: TK On Account Receipts */
  onAccountCcid?: number | null;
  /** FK: TK Unearned Discount */
  unearnedDiscountCcid?: number | null;
  /** FK: TK Earned Discount */
  earnedDiscountCcid?: number | null;
  /** FK: TK phí ngân hàng */
  bankChargesCcid?: number | null;
  /** Số tiền thu tối thiểu */
  minReceiptAmount?: number | null;
  /** Y/N: tài khoản chính cho OU/method */
  primaryFlag?: string | null;
  /** Ngày bắt đầu hiệu lực */
  startDate?: string | null;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIVABLE_ACTIVITIES
 * Table Name: AR_RECEIVABLE_ACTIVITIES
 * Role: Định nghĩa hoạt động phải thu cho Miscellaneous Receipt, Adjustment, write-off và tài khoản hạch toán tương ứng.
 * Business Group: Receipt/Adjustment Setup
 */
export interface ARReceivableActivity {
  /** PK: ID Receivable Activity */
  receivableActivityId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Mã hoạt động */
  activityCode: string;
  /** Tên hoạt động thu/chi/điều chỉnh */
  activityName: string;
  /** Diễn giải */
  description?: string | null;
  /** MISCELLANEOUS_CASH, ADJUSTMENT, FINANCE_CHARGE */
  activityType: string;
  /** ACTIVITY_GL_ACCOUNT, DISTRIBUTION_SET */
  glAccountSource?: string | null;
  /** NONE, ACTIVITY, USER */
  taxRateCodeSource?: string | null;
  /** FK: Tài khoản hạch toán hoạt động */
  activityCcid?: number | null;
  /** FK: AR_DISTRIBUTION_SETS */
  distributionSetId?: number | null;
  /** Y/N: trạng thái hoạt động */
  activeFlag: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_DISTRIBUTION_SETS
 * Table Name: AR_DISTRIBUTION_SETS
 * Role: Định nghĩa bộ phân bổ tài khoản để dùng cho receipt miscellaneous hoặc các nghiệp vụ phân bổ định khoản.
 * Business Group: Accounting Setup
 */
export interface ARDistributionSet {
  /** PK: ID bộ phân bổ */
  distributionSetId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Mã bộ phân bổ; unique theo OU */
  setCode: string;
  /** Tên bộ phân bổ */
  setName: string;
  /** Diễn giải */
  description?: string | null;
  /** Y/N: trạng thái hiệu lực */
  activeFlag: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_DISTRIBUTION_SET_LINES
 * Table Name: AR_DISTRIBUTION_SET_LINES
 * Role: Lưu chi tiết dòng phân bổ theo distribution set, tỷ lệ/số tiền và tài khoản GL.
 * Business Group: Accounting Setup
 */
export interface ARDistributionSetLine {
  /** PK: ID dòng phân bổ */
  distributionSetLineId: number;
  /** FK: AR_DISTRIBUTION_SETS */
  distributionSetId: number;
  /** Số thứ tự dòng */
  lineNum: number;
  /** Tỷ lệ phân bổ; tổng nên bằng 100% */
  percentRate?: number | null;
  /** Số tiền cố định nếu không phân bổ theo tỷ lệ */
  amount?: number | null;
  /** FK: Tài khoản hạch toán */
  accountCcid: number;
  /** Diễn giải dòng phân bổ */
  description?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_PAYMENT_SCHEDULES
 * Table Name: AR_PAYMENT_SCHEDULES
 * Role: Theo dõi lịch công nợ phải thu theo invoice/installment: số gốc, số đã thu, đã credit, đã adjustment, còn phải thu, hạn thanh toán và trạng thái.
 * Business Group: Receivable Balance
 */
export interface ARPaymentSchedule {
  /** PK: ID lịch công nợ/kỳ hạn */
  paymentScheduleId: number;
  /** FK: AR_INVOICES */
  invoiceId: number;
  /** FK: Khách hàng */
  customerId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Số kỳ thanh toán */
  installmentNum: number;
  /** Ngày đến hạn */
  dueDate: string;
  /** Số tiền gốc ban đầu */
  originalAmount: number;
  /** Số phải thu ban đầu */
  amountDueOriginal: number;
  /** Số dư còn phải thu */
  amountDueRemaining: number;
  /** Số tiền đã thu/apply */
  amountApplied?: number | null;
  /** Số tiền đã adjustment */
  amountAdjusted?: number | null;
  /** Số tiền đã credit */
  amountCredited?: number | null;
  /** Chiết khấu đã hưởng */
  discountTaken?: number | null;
  /** Lãi/lỗ tỷ giá phát sinh khi apply */
  exchangeGainLossAmount?: number | null;
  /** OPEN, CLOSED, PARTIALLY_APPLIED, OVERDUE */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_TRANSACTION_DISTRIBUTIONS
 * Table Name: AR_TRANSACTION_DISTRIBUTIONS
 * Role: Lưu phân bổ định khoản của giao dịch AR theo line/header: Receivable, Revenue, Tax, Freight, Charge và số Nợ/Có.
 * Business Group: Accounting Distribution
 */
export interface ARTransactionDistribution {
  /** PK: ID dòng định khoản giao dịch */
  distributionId: number;
  /** FK: AR_INVOICES */
  invoiceId: number;
  /** FK: AR_INVOICE_LINES; null nếu phân bổ cấp header */
  lineId?: number | null;
  /** RECEIVABLE, REVENUE, TAX, FREIGHT, CHARGE */
  accountClass: string;
  /** FK: GL_CODE_COMBINATIONS */
  accountCcid: number;
  /** Tỷ lệ phân bổ */
  percentRate?: number | null;
  /** Phát sinh Nợ nguyên tệ */
  enteredDr?: number | null;
  /** Phát sinh Có nguyên tệ */
  enteredCr?: number | null;
  /** Phát sinh Nợ quy đổi */
  accountedDr?: number | null;
  /** Phát sinh Có quy đổi */
  accountedCr?: number | null;
  /** Ngày hạch toán */
  glDate: string;
  /** Trạng thái định khoản */
  accountingStatus?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_INTERFACE_HDRS
 * Table Name: AR_TRANSACTION_INTERFACE_HDRS
 * Role: Lưu header dữ liệu interface trước khi AutoInvoice import thành hóa đơn chính thức; có nguồn, khách hàng, reference và trạng thái xử lý.
 * Business Group: AutoInvoice
 */
export interface ARTransactionInterfaceHdr {
  /** PK: ID header interface AutoInvoice */
  interfaceHeaderId: number;
  /** Nguồn dữ liệu: SO, SQL_LOADER, INTERCOMPANY */
  sourceSystem: string;
  /** FK: AR_TRANSACTION_SOURCES */
  transactionSourceId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** FK: Khách hàng */
  customerId: number;
  /** FK: Khách hàng xuất hóa đơn */
  billToCustomerId?: number | null;
  /** FK: Khách hàng giao hàng */
  shipToCustomerId?: number | null;
  /** Số tham chiếu nguồn/Sales Order */
  referenceNumber?: string | null;
  /** Ngày mặc định khi import */
  defaultDate?: string | null;
  /** NEW, VALIDATED, ERROR, PROCESSED */
  interfaceStatus: string;
  /** Thông báo lỗi header nếu có */
  errorMessage?: string | null;
  /** FK: AR_AUTOINVOICE_REQUESTS */
  requestId?: number | null;
  /** FK: AR_INVOICES sau khi import thành công */
  processedInvoiceId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_INTERFACE_LINES
 * Table Name: AR_TRANSACTION_INTERFACE_LINES
 * Role: Lưu dòng dữ liệu interface, lỗi import, trạng thái xử lý và invoice/line sau khi AutoInvoice thành công.
 * Business Group: AutoInvoice
 */
export interface ARTransactionInterfaceLine {
  /** PK: ID dòng interface AutoInvoice */
  interfaceLineId: number;
  /** FK: AR_TRANSACTION_INTERFACE_HDRS */
  interfaceHeaderId: number;
  /** Số dòng interface */
  lineNum: number;
  /** FK: Mặt hàng/dịch vụ */
  inventoryItemId?: number | null;
  /** Diễn giải dòng */
  description?: string | null;
  /** Số lượng */
  quantity?: number | null;
  /** Đơn giá */
  unitPrice?: number | null;
  /** Thành tiền */
  lineAmount?: number | null;
  /** Mã thuế suất */
  taxClassificationCode?: string | null;
  /** NEW, ERROR, PROCESSED */
  interfaceStatus: string;
  /** Mã lỗi interface */
  errorCode?: string | null;
  /** Thông báo lỗi dòng */
  errorMessage?: string | null;
  /** FK: AR_INVOICES sau xử lý */
  processedInvoiceId?: number | null;
  /** FK: AR_INVOICE_LINES sau xử lý */
  processedLineId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_AUTOINVOICE_REQUESTS
 * Table Name: AR_AUTOINVOICE_REQUESTS
 * Role: Lưu lịch sử chạy AutoInvoice Master/Import Program, tham số chạy, trạng thái và lỗi để truy vết import hóa đơn.
 * Business Group: AutoInvoice
 */
export interface ARAutoInvoiceRequest {
  /** PK: ID request AutoInvoice */
  requestId: number;
  /** Tên request: Autoinvoice Master/Import */
  requestName: string;
  /** FK: Transaction Source */
  transactionSourceId?: number | null;
  /** Ngày mặc định tạo hóa đơn */
  defaultDate?: string | null;
  /** Từ mã khách hàng */
  lowCustomerNumber?: string | null;
  /** Đến mã khách hàng */
  highCustomerNumber?: string | null;
  /** Từ số sales order */
  lowSalesOrderNumber?: string | null;
  /** Đến số sales order */
  highSalesOrderNumber?: string | null;
  /** SUBMITTED, RUNNING, COMPLETED, ERROR */
  status: string;
  /** Thời điểm bắt đầu chạy */
  startedAt?: string | null;
  /** Thời điểm hoàn thành */
  completedAt?: string | null;
  /** Thông báo lỗi tổng hợp */
  errorMessage?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_COPY_BATCHES
 * Table Name: AR_TRANSACTION_COPY_BATCHES
 * Role: Lưu cấu hình sao chép giao dịch theo rule: single, daily, weekly, monthly, quarterly, annually; số lần và ngày bắt đầu.
 * Business Group: Copy Transaction
 */
export interface ARTransactionCopyBatch {
  /** PK: ID batch copy transaction */
  copyBatchId: number;
  /** FK: hóa đơn gốc được copy */
  sourceInvoiceId: number;
  /** ANNUALLY, SEMI_ANNUALLY, QUARTERLY, MONTHLY, WEEKLY, SINGLE_COPY, DAYS */
  copyRule: string;
  /** Số lần sao chép */
  numberOfTimes?: number | null;
  /** Số ngày lặp nếu rule = DAYS */
  numberOfDays?: number | null;
  /** Ngày giao dịch của chứng từ copy đầu tiên */
  firstTransactionDate: string;
  /** Ngày hạch toán của chứng từ copy đầu tiên */
  firstGlDate: string;
  /** DRAFT, GENERATED, ERROR */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_TRANSACTION_COPY_LINES
 * Table Name: AR_TRANSACTION_COPY_LINES
 * Role: Lưu từng chứng từ mới được tạo ra từ copy transaction và liên kết về chứng từ gốc.
 * Business Group: Copy Transaction
 */
export interface ARTransactionCopyLine {
  /** PK: ID dòng copy transaction */
  copyLineId: number;
  /** FK: AR_TRANSACTION_COPY_BATCHES */
  copyBatchId: number;
  /** FK: hóa đơn gốc */
  sourceInvoiceId: number;
  /** FK: hóa đơn mới được tạo */
  newInvoiceId?: number | null;
  /** Ngày giao dịch của hóa đơn mới */
  transactionDate: string;
  /** Ngày hạch toán của hóa đơn mới */
  glDate: string;
  /** PENDING, CREATED, ERROR */
  status: string;
  /** Lỗi khi tạo bản copy */
  errorMessage?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIVABLE_APPLICATIONS
 * Table Name: AR_RECEIVABLE_APPLICATIONS
 * Role: Lưu nghiệp vụ apply/unapply tiền thu, credit memo, discount, voucher hoặc netting vào hóa đơn/payment schedule; quyết định số dư công nợ thực tế.
 * Business Group: Receipt Application
 */
export interface ARReceivableApplication {
  /** PK: ID apply/cấn trừ */
  applicationId: number;
  /** FK: AR_RECEIPTS; null với Credit/Adjustment không qua receipt */
  receiptId?: number | null;
  /** FK: hóa đơn được apply/giảm công nợ */
  appliedInvoiceId: number;
  /** FK: kỳ hạn/schedule được apply */
  appliedPaymentScheduleId?: number | null;
  /** RECEIPT, CREDIT_MEMO, ADJUSTMENT, DISCOUNT, VOUCHER, NETTING */
  applicationType: string;
  /** Ngày apply */
  applyDate: string;
  /** Ngày hạch toán apply */
  glDate: string;
  /** Số tiền apply theo tiền invoice */
  amountApplied: number;
  /** Chiết khấu được hưởng */
  discountTaken?: number | null;
  /** Số tiền receipt tương ứng với amount applied */
  allocatedReceiptAmount?: number | null;
  /** Loại tiền invoice */
  invoiceCurrencyCode?: string | null;
  /** Loại tiền receipt */
  receiptCurrencyCode?: string | null;
  /** Tỷ giá khi apply */
  exchangeRate?: number | null;
  /** Lãi/lỗ tỷ giá tự động tính */
  exchangeGainLossAmount?: number | null;
  /** APPLIED, UNAPPLIED, REVERSED */
  status: string;
  /** Y/N: đã đảo application */
  reversedFlag?: string | null;
  /** FK: application đảo */
  reversalApplicationId?: number | null;
  /** FK: AR_ACCOUNTING_EVENTS */
  accountingEventId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_MISC_RECEIPT_DISTRIBUTIONS
 * Table Name: AR_MISC_RECEIPT_DISTRIBUTIONS
 * Role: Lưu định khoản chi tiết cho receipt thu/chi không theo dõi công nợ, gồm activity, distribution set, tax, amount và GL account.
 * Business Group: Miscellaneous Receipt
 */
export interface ARMiscReceiptDistribution {
  /** PK: ID dòng phân bổ miscellaneous receipt */
  miscDistributionId: number;
  /** FK: AR_RECEIPTS loại MISCELLANEOUS */
  receiptId: number;
  /** FK: AR_RECEIVABLE_ACTIVITIES */
  receivableActivityId: number;
  /** FK: AR_DISTRIBUTION_SETS nếu dùng bộ phân bổ */
  distributionSetId?: number | null;
  /** Số thứ tự dòng phân bổ */
  lineNum: number;
  /** Tỷ lệ phân bổ; tổng phải bằng 100% */
  percentRate?: number | null;
  /** Số tiền phân bổ */
  amount: number;
  /** Số tiền thuế */
  taxAmount?: number | null;
  /** Tổng tiền gồm thuế */
  totalAmount?: number | null;
  /** FK: GL account hạch toán */
  accountCcid: number;
  /** FK: TK thuế */
  taxCcid?: number | null;
  /** Diễn giải dòng phân bổ */
  comments?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPT_REVERSALS
 * Table Name: AR_RECEIPT_REVERSALS
 * Role: Lưu nghiệp vụ đảo/hủy receipt bằng reversal, gồm ngày reverse, GL date, category, reason và event kế toán.
 * Business Group: Receipt Reverse
 */
export interface ARReceiptReversal {
  /** PK: ID reverse receipt */
  reversalId: number;
  /** FK: receipt bị reverse */
  receiptId: number;
  /** Ngày thực hiện reverse */
  reversalDate: string;
  /** Ngày hạch toán reverse */
  glDate: string;
  /** Loại reverse */
  reversalCategory: string;
  /** Lý do reverse */
  reversalReason?: string | null;
  /** Người reverse */
  reversedBy?: number | null;
  /** DRAFT, REVERSED, ACCOUNTED */
  status: string;
  /** FK: AR_ACCOUNTING_EVENTS */
  accountingEventId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_RECEIPT_HISTORY
 * Table Name: AR_RECEIPT_HISTORY
 * Role: Lưu lịch sử trạng thái receipt: created, applied, unapplied, remitted, cleared, reversed, accounting để audit.
 * Business Group: Receipt Audit
 */
export interface ARReceiptHistory {
  /** PK: ID lịch sử trạng thái receipt */
  receiptHistoryId: number;
  /** FK: AR_RECEIPTS */
  receiptId: number;
  /** Trạng thái cũ */
  oldStatus?: string | null;
  /** Trạng thái mới */
  newStatus: string;
  /** CREATE, APPLY, UNAPPLY, REVERSE, CLEAR, UNCLEAR */
  actionCode: string;
  /** Thời điểm phát sinh hành động */
  actionDate: string;
  /** Người thực hiện */
  actionBy?: number | null;
  /** Ngày hạch toán nếu có */
  glDate?: string | null;
  /** Ghi chú */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_CREDIT_MEMO_APPLICATIONS
 * Table Name: AR_CREDIT_MEMO_APPLICATIONS
 * Role: Lưu việc credit memo được áp vào invoice gốc, bao gồm line/tax/freight/total amount, ngày apply và trạng thái.
 * Business Group: Credit Memo
 */
export interface ARCreditMemoApplication {
  /** PK: ID apply Credit Memo */
  creditApplicationId: number;
  /** FK: AR_INVOICES loại CREDIT_MEMO */
  creditMemoId: number;
  /** FK: hóa đơn gốc bị credit */
  invoiceId: number;
  /** Ngày cấn trừ credit */
  applicationDate: string;
  /** Ngày hạch toán */
  glDate: string;
  /** Số tiền hàng được credit */
  lineAmount?: number | null;
  /** Số tiền thuế được credit */
  taxAmount?: number | null;
  /** Số tiền freight được credit */
  freightAmount?: number | null;
  /** Tổng tiền credit */
  totalAmount: number;
  /** LINES_ONLY, LINES_AND_TAX, TAX_ONLY */
  creditAllocation?: string | null;
  /** APPLIED, REVERSED */
  status: string;
  /** FK: AR_ACCOUNTING_EVENTS */
  accountingEventId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_ADJUSTMENTS
 * Table Name: AR_ADJUSTMENTS
 * Role: Lưu chứng từ điều chỉnh công nợ: loại adjustment, activity, amount, includes tax, GL date, reason, approval và accounting event.
 * Business Group: Adjustment
 */
export interface ARAdjustment {
  /** PK: ID adjustment */
  adjustmentId: number;
  /** FK: hóa đơn được điều chỉnh */
  invoiceId: number;
  /** FK: kỳ hạn công nợ được điều chỉnh */
  paymentScheduleId?: number | null;
  /** FK: Activity quyết định tài khoản adjustment */
  receivableActivityId: number;
  /** Số chứng từ điều chỉnh; unique theo ORG_ID */
  adjustmentNumber: string;
  /** INVOICE, LINE, TAX, FREIGHT, CHARGES */
  adjustmentType: string;
  /** Số tiền điều chỉnh */
  adjustmentAmount: number;
  /** Y/N: điều chỉnh có bao gồm thuế */
  includesTaxFlag?: string | null;
  /** Ngày hạch toán adjustment */
  glDate: string;
  /** Ngày thực hiện adjustment */
  adjustmentDate: string;
  /** Mã lý do điều chỉnh */
  reasonCode?: string | null;
  /** DRAFT, APPROVED, ACCOUNTED, REVERSED */
  status: string;
  /** PENDING, APPROVED, REJECTED */
  approvalStatus?: string | null;
  /** FK: AR_ACCOUNTING_EVENTS */
  accountingEventId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_AUTO_ADJUSTMENT_BATCHES
 * Table Name: AR_AUTO_ADJUSTMENT_BATCHES
 * Role: Lưu batch điều chỉnh hàng loạt theo điều kiện OU, khách hàng, currency, due date, remaining amount, transaction type và reason.
 * Business Group: Auto Adjustment
 */
export interface ARAutoAdjustmentBatch {
  /** PK: ID batch Auto Adjustment */
  autoAdjustmentBatchId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Lọc theo loại tiền invoice */
  invoiceCurrencyCode?: string | null;
  /** Số dư từ */
  remainingAmountFrom?: number | null;
  /** Số dư đến */
  remainingAmountTo?: number | null;
  /** Tỷ lệ còn lại từ */
  remainingPercentFrom?: number | null;
  /** Tỷ lệ còn lại đến */
  remainingPercentTo?: number | null;
  /** Due date từ */
  dueDateFrom?: string | null;
  /** Due date đến */
  dueDateTo?: string | null;
  /** FK: lọc theo loại giao dịch */
  transactionTypeId?: number | null;
  /** FK: lọc theo khách hàng */
  customerId?: number | null;
  /** FK: Activity adjustment */
  receivableActivityId: number;
  /** CHARGES, FREIGHT, INVOICE, LINE, TAX */
  adjustmentType: string;
  /** Ngày hạch toán adjustment */
  glDate: string;
  /** Lý do điều chỉnh */
  reasonCode?: string | null;
  /** Y/N: chỉ tạo báo cáo */
  generateReportOnlyFlag?: string | null;
  /** Y/N: tạo adjustment thật */
  createAdjustmentsFlag?: string | null;
  /** SUBMITTED, COMPLETED, ERROR */
  status: string;
  /** ID request batch */
  requestId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_AUTO_ADJUSTMENT_LINES
 * Table Name: AR_AUTO_ADJUSTMENT_LINES
 * Role: Lưu từng invoice được chọn trong batch auto adjustment và kết quả tạo adjustment.
 * Business Group: Auto Adjustment
 */
export interface ARAutoAdjustmentLine {
  /** PK: ID dòng Auto Adjustment */
  autoAdjustmentLineId: number;
  /** FK: AR_AUTO_ADJUSTMENT_BATCHES */
  autoAdjustmentBatchId: number;
  /** FK: hóa đơn được chọn */
  invoiceId: number;
  /** FK: adjustment được tạo */
  adjustmentId?: number | null;
  /** Số dư trước khi điều chỉnh */
  originalBalance?: number | null;
  /** Số tiền điều chỉnh */
  adjustmentAmount?: number | null;
  /** SELECTED, CREATED, SKIPPED, ERROR */
  status: string;
  /** Lỗi xử lý dòng */
  errorMessage?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_DOCUMENT_ACTION_LOG
 * Table Name: AR_DOCUMENT_ACTION_LOG
 * Role: Lưu audit trail mọi thao tác nghiệp vụ: complete, incomplete, delete, void, apply, unapply, reverse, accounting, transfer GL.
 * Business Group: Audit/Control
 */
export interface ARDocumentActionLog {
  /** PK: ID nhật ký hành động chứng từ */
  actionId: number;
  /** INVOICE, RECEIPT, ADJUSTMENT, APPLICATION, NETTING */
  documentType: string;
  /** ID chứng từ nguồn */
  documentId: number;
  /** COMPLETE, INCOMPLETE, DELETE, VOID, REVERSE, APPLY, UNAPPLY, CREATE_ACCOUNTING, TRANSFER_GL */
  actionCode: string;
  /** Thời điểm hành động */
  actionDate: string;
  /** Người thực hiện */
  actionBy?: number | null;
  /** Trạng thái trước */
  oldStatus?: string | null;
  /** Trạng thái sau */
  newStatus?: string | null;
  /** Mã lý do */
  reasonCode?: string | null;
  /** Ghi chú/audit note */
  note?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_VOID_TRANSACTIONS
 * Table Name: AR_VOID_TRANSACTIONS
 * Role: Lưu nghiệp vụ void transaction, lý do hủy, transaction type hủy, số tiền gốc và trạng thái sau void.
 * Business Group: Void/Delete Control
 */
export interface ARVoidTransaction {
  /** PK: ID void transaction */
  voidId: number;
  /** FK: chứng từ bị void */
  invoiceId: number;
  /** Ngày void */
  voidDate: string;
  /** Ngày hạch toán void */
  voidGlDate: string;
  /** FK: Transaction Type dùng để void */
  voidTransactionTypeId?: number | null;
  /** Lý do void */
  voidReason?: string | null;
  /** Số tiền gốc trước void */
  originalAmount?: number | null;
  /** Số tiền sau void/thường đưa về 0 */
  voidAmount?: number | null;
  /** VOIDED, ACCOUNTED */
  status: string;
  /** FK: AR_ACCOUNTING_EVENTS */
  accountingEventId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_ACCOUNTING_EVENTS
 * Table Name: AR_ACCOUNTING_EVENTS
 * Role: Lưu sự kiện hạch toán AR cho invoice, receipt, application, credit, adjustment, reverse, netting trước khi sinh journal.
 * Business Group: Subledger Accounting
 */
export interface ARAccountingEvent {
  /** PK: ID sự kiện kế toán AR */
  eventId: number;
  /** INVOICE, RECEIPT, ADJUSTMENT, APPLICATION, REVERSAL, NETTING */
  sourceDocumentType: string;
  /** ID chứng từ nguồn */
  sourceDocumentId: number;
  /** Class sự kiện kế toán */
  eventClass: string;
  /** Loại sự kiện: CREATE, APPLY, REVERSE, ADJUST, TRANSFER */
  eventType: string;
  /** Ngày sự kiện */
  eventDate: string;
  /** Ngày hạch toán */
  glDate: string;
  /** DRAFT, FINAL, FINAL_POST_TO_GL */
  accountingMode: string;
  /** DRAFT, FINAL, ERROR */
  accountingStatus: string;
  /** NOT_TRANSFERRED, TRANSFERRED, ERROR */
  transferToGlStatus?: string | null;
  /** ID request Create Accounting/Transfer GL */
  requestId?: number | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_JOURNAL_LINES
 * Table Name: AR_JOURNAL_LINES
 * Role: Lưu các dòng bút toán Nợ/Có phát sinh từ accounting event, phục vụ đối soát và chuyển GL.
 * Business Group: Subledger Accounting
 */
export interface ARJournalLine {
  /** PK: ID dòng bút toán */
  journalLineId: number;
  /** FK: AR_ACCOUNTING_EVENTS */
  eventId: number;
  /** FK: GL_LEDGERS */
  ledgerId: number;
  /** FK: GL_CODE_COMBINATIONS */
  accountCcid: number;
  /** RECEIVABLE, REVENUE, TAX, CASH, UNAPPLIED, UNIDENTIFIED, ADJUSTMENT */
  accountingClass: string;
  /** Nợ nguyên tệ */
  enteredDr?: number | null;
  /** Có nguyên tệ */
  enteredCr?: number | null;
  /** Nợ quy đổi */
  accountedDr?: number | null;
  /** Có quy đổi */
  accountedCr?: number | null;
  /** Loại tiền */
  currencyCode: string;
  /** Ngày hạch toán */
  glDate: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_GL_TRANSFER_BATCHES
 * Table Name: AR_GL_TRANSFER_BATCHES
 * Role: Lưu batch chuyển bút toán AR sang General Ledger, trạng thái, request id, ngày chạy và lỗi nếu có.
 * Business Group: GL Transfer
 */
export interface ARGlTransferBatch {
  /** PK: ID batch chuyển GL */
  transferBatchId: number;
  /** ID request Transfer Journal Entries to GL */
  requestId?: number | null;
  /** FK: GL_LEDGERS */
  ledgerId: number;
  /** Từ ngày hạch toán */
  glDateFrom?: string | null;
  /** Đến ngày hạch toán */
  glDateTo?: string | null;
  /** SUBMITTED, COMPLETED, ERROR */
  transferStatus: string;
  /** Bắt đầu chạy */
  startedAt?: string | null;
  /** Hoàn thành */
  completedAt?: string | null;
  /** Thông báo lỗi nếu có */
  errorMessage?: string | null;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_AP_NETTING_AGREEMENTS
 * Table Name: AR_AP_NETTING_AGREEMENTS
 * Role: Lưu thỏa thuận cấn trừ công nợ giữa khách hàng và nhà cung cấp, OU, bank account và điều kiện hiệu lực.
 * Business Group: AR/AP Netting
 */
export interface ARApNettingAgreement {
  /** PK: ID thỏa thuận netting */
  nettingAgreementId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Tên Netting Agreement */
  agreementName: string;
  /** Ngày hiệu lực */
  startDate: string;
  /** Ngày hết hiệu lực */
  endDate?: string | null;
  /** Y/N: yêu cầu đối tác xác nhận */
  tradingPartnerApprovalFlag?: string | null;
  /** FK: Bank Account dùng netting */
  nettingBankAccountId?: number | null;
  /** FK: AR Transaction Type dùng netting */
  arTransactionTypeId?: number | null;
  /** DRAFT, ACTIVE, INACTIVE */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_AP_NETTING_PARTNERS
 * Table Name: AR_AP_NETTING_PARTNERS
 * Role: Lưu mapping đối tác cấn trừ: supplier/site với customer/location và thứ tự ưu tiên.
 * Business Group: AR/AP Netting
 */
export interface ARApNettingPartner {
  /** PK: ID đối tác netting */
  nettingPartnerId: number;
  /** FK: AR_AP_NETTING_AGREEMENTS */
  nettingAgreementId: number;
  /** FK: AP_SUPPLIERS */
  supplierId: number;
  /** FK: AP_SUPPLIER_SITES */
  supplierSiteId?: number | null;
  /** FK: CUSTOMERS/HZ_CUSTOMERS */
  customerId: number;
  /** FK: CUSTOMER_SITES/HZ_CUSTOMER_SITES */
  customerSiteId?: number | null;
  /** Thứ tự ưu tiên */
  priority?: number | null;
  /** ACTIVE, INACTIVE */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}

/**
 * Sheet Name: AR_AP_NETTING_BATCHES
 * Table Name: AR_AP_NETTING_BATCHES
 * Role: Lưu batch thực hiện netting: due date, settlement date, GL date, exchange rate type, status và agreement.
 * Business Group: AR/AP Netting
 */
export interface ARApNettingBatch {
  /** PK: ID Netting Batch */
  nettingBatchId: number;
  /** FK: Operating Unit */
  orgId: number;
  /** Số batch netting; unique theo OU */
  batchNumber: string;
  /** Tên batch netting */
  batchName: string;
  /** FK: Netting Agreement */
  nettingAgreementId: number;
  /** Hạn thanh toán để lọc chứng từ */
  transactionDueDate?: string | null;
  /** Ngày thực hiện netting */
  settlementDate: string;
  /** Ngày hạch toán netting */
  glDate: string;
  /** Loại tỷ giá netting */
  exchangeRateType?: string | null;
  /** Y/N: submit không cần review */
  submitWithoutReviewFlag?: string | null;
  /** DRAFT, REVIEWED, SUBMITTED, COMPLETE, ERROR */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
  /** Optimistic locking version number */
  versionNo: number;
}

/**
 * Sheet Name: AR_AP_NETTING_BATCH_LINES
 * Table Name: AR_AP_NETTING_BATCH_LINES
 * Role: Lưu từng chứng từ AR/AP được đưa vào netting batch, số tiền, loại chứng từ, trạng thái add/remove/recalculate/settle.
 * Business Group: AR/AP Netting
 */
export interface ARApNettingBatchLine {
  /** PK: ID dòng Netting Batch */
  nettingBatchLineId: number;
  /** FK: AR_AP_NETTING_BATCHES */
  nettingBatchId: number;
  /** AR hoặc AP */
  documentSource: string;
  /** INVOICE, CREDIT_MEMO, PAYMENT, RECEIPT */
  documentType: string;
  /** ID chứng từ nguồn */
  documentId: number;
  /** Số chứng từ nguồn */
  documentNumber?: string | null;
  /** FK: Khách hàng nếu là AR */
  customerId?: number | null;
  /** FK: Nhà cung cấp nếu là AP */
  supplierId?: number | null;
  /** Số tiền đưa vào netting */
  amount: number;
  /** Loại tiền */
  currencyCode: string;
  /** SELECTED, REMOVED, SETTLED */
  status: string;
  /** Người tạo bản ghi */
  createdBy?: number | null;
  /** Ngày tạo bản ghi */
  createdDate: string;
  /** Người cập nhật cuối cùng */
  lastUpdateBy?: number | null;
  /** Ngày cập nhật cuối cùng */
  lastUpdateDate: string;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute1?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute2?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute3?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute4?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute5?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute6?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute7?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute8?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute9?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute10?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute11?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute12?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute13?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute14?: string | null;
  /** TRƯỜNG BỔ SUNG CÓ THỂ DÙNG KHI CẦN MỞ RỘNG */
  attribute15?: string | null;
}
