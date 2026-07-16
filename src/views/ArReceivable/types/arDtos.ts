import {
  ARInvoice, ARInvoiceLine, ARReceipt, ARReceivableApplication, ARAdjustment,
  ARTransactionSource, ARTransactionType, ARPaymentTerm, ARReceiptClass,
  ARReceiptMethod, ARReceivableActivity, ARDistributionSet, ARApNettingAgreement,
  ARApNettingBatch, ARPromotion
} from './arTypes';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: ApiError[];
  traceId?: string;
}

export interface ApiError {
  field: string;
  message: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Reference object used for external tables
export interface ReferenceOption {
  id: string | number;
  code: string;
  name: string;
}

// --- ARInvoice DTOs ---
export interface ARInvoiceListItem extends ARInvoice {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARInvoiceDetailResponse {
  header: ARInvoice;
  lines: ARInvoiceLine[];
}

export interface ARInvoiceCreateRequest extends Omit<ARInvoice, 'arinvoiceId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
  lines: Omit<ARInvoiceLine, 'arinvoicelineId' | 'arinvoiceId' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'>[];
}

export interface ARInvoiceUpdateRequest extends Partial<ARInvoice> {
  versionNo: number;
  lines?: Partial<ARInvoiceLine>[];
}

export interface ARInvoiceSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARInvoiceStatusRequest {
  status: string;
  reason?: string;
}

// --- ARReceipt DTOs ---
export interface ARReceiptListItem extends ARReceipt {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARReceiptDetailResponse {
  header: ARReceipt;
}

export interface ARReceiptCreateRequest extends Omit<ARReceipt, 'arreceiptId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARReceiptUpdateRequest extends Partial<ARReceipt> {
  versionNo: number;
}

export interface ARReceiptSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  balanceView?: "unapplied" | "on-account";
}

export interface ARReceiptStatusRequest {
  status: string;
  reason?: string;
}

// --- ARReceivableApplication DTOs ---
export interface ARReceivableApplicationListItem extends ARReceivableApplication {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARReceivableApplicationDetailResponse {
  header: ARReceivableApplication;
}

export interface ARReceivableApplicationCreateRequest extends Omit<ARReceivableApplication, 'arreceivableapplicationId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARReceivableApplicationUpdateRequest extends Partial<ARReceivableApplication> {
  versionNo: number;
}

export interface ARReceivableApplicationSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARReceivableApplicationStatusRequest {
  status: string;
  reason?: string;
}

// --- ARAdjustment DTOs ---
export interface ARAdjustmentListItem extends ARAdjustment {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARAdjustmentDetailResponse {
  header: ARAdjustment;
}

export interface ARAdjustmentCreateRequest extends Omit<ARAdjustment, 'aradjustmentId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARAdjustmentUpdateRequest extends Partial<ARAdjustment> {
  versionNo: number;
}

export interface ARAdjustmentSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARAdjustmentStatusRequest {
  status: string;
  reason?: string;
}

// --- ARTransactionSource DTOs ---
export interface ARTransactionSourceListItem extends ARTransactionSource {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARTransactionSourceDetailResponse {
  header: ARTransactionSource;
}

export interface ARTransactionSourceCreateRequest extends Omit<ARTransactionSource, 'artransactionsourceId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARTransactionSourceUpdateRequest extends Partial<ARTransactionSource> {
  versionNo: number;
}

export interface ARTransactionSourceSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARTransactionSourceStatusRequest {
  status: string;
  reason?: string;
}

// --- ARTransactionType DTOs ---
export interface ARTransactionTypeListItem extends ARTransactionType {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARTransactionTypeDetailResponse {
  header: ARTransactionType;
}

export interface ARTransactionTypeCreateRequest extends Omit<ARTransactionType, 'artransactiontypeId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARTransactionTypeUpdateRequest extends Partial<ARTransactionType> {
  versionNo: number;
}

export interface ARTransactionTypeSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARTransactionTypeStatusRequest {
  status: string;
  reason?: string;
}

// --- ARPaymentTerm DTOs ---
export interface ARPaymentTermListItem extends ARPaymentTerm {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARPaymentTermDetailResponse {
  header: ARPaymentTerm;
}

export interface ARPaymentTermCreateRequest extends Omit<ARPaymentTerm, 'arpaymenttermId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARPaymentTermUpdateRequest extends Partial<ARPaymentTerm> {
  versionNo: number;
}

export interface ARPaymentTermSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARPaymentTermStatusRequest {
  status: string;
  reason?: string;
}

// --- ARReceiptClass DTOs ---
export interface ARReceiptClassListItem extends ARReceiptClass {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARReceiptClassDetailResponse {
  header: ARReceiptClass;
}

export interface ARReceiptClassCreateRequest extends Omit<ARReceiptClass, 'arreceiptclassId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARReceiptClassUpdateRequest extends Partial<ARReceiptClass> {
  versionNo: number;
}

export interface ARReceiptClassSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARReceiptClassStatusRequest {
  status: string;
  reason?: string;
}

// --- ARReceiptMethod DTOs ---
export interface ARReceiptMethodListItem extends ARReceiptMethod {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARReceiptMethodDetailResponse {
  header: ARReceiptMethod;
}

export interface ARReceiptMethodCreateRequest extends Omit<ARReceiptMethod, 'arreceiptmethodId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARReceiptMethodUpdateRequest extends Partial<ARReceiptMethod> {
  versionNo: number;
}

export interface ARReceiptMethodSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARReceiptMethodStatusRequest {
  status: string;
  reason?: string;
}

// --- ARReceivableActivity DTOs ---
export interface ARReceivableActivityListItem extends ARReceivableActivity {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARReceivableActivityDetailResponse {
  header: ARReceivableActivity;
}

export interface ARReceivableActivityCreateRequest extends Omit<ARReceivableActivity, 'arreceivableactivityId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARReceivableActivityUpdateRequest extends Partial<ARReceivableActivity> {
  versionNo: number;
}

export interface ARReceivableActivitySearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARReceivableActivityStatusRequest {
  status: string;
  reason?: string;
}

// --- ARDistributionSet DTOs ---
export interface ARDistributionSetListItem extends ARDistributionSet {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARDistributionSetDetailResponse {
  header: ARDistributionSet;
}

export interface ARDistributionSetCreateRequest extends Omit<ARDistributionSet, 'ardistributionsetId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARDistributionSetUpdateRequest extends Partial<ARDistributionSet> {
  versionNo: number;
}

export interface ARDistributionSetSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARDistributionSetStatusRequest {
  status: string;
  reason?: string;
}

// --- ARApNettingAgreement DTOs ---
export interface ARApNettingAgreementListItem extends ARApNettingAgreement {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARApNettingAgreementDetailResponse {
  header: ARApNettingAgreement;
}

export interface ARApNettingAgreementCreateRequest extends Omit<ARApNettingAgreement, 'arapnettingagreementId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARApNettingAgreementUpdateRequest extends Partial<ARApNettingAgreement> {
  versionNo: number;
}

export interface ARApNettingAgreementSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARApNettingAgreementStatusRequest {
  status: string;
  reason?: string;
}

// --- ARApNettingBatch DTOs ---
export interface ARApNettingBatchListItem extends ARApNettingBatch {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARApNettingBatchDetailResponse {
  header: ARApNettingBatch;
}

export interface ARApNettingBatchCreateRequest extends Omit<ARApNettingBatch, 'arapnettingbatchId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARApNettingBatchUpdateRequest extends Partial<ARApNettingBatch> {
  versionNo: number;
}

export interface ARApNettingBatchSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARApNettingBatchStatusRequest {
  status: string;
  reason?: string;
}

// --- ARPromotion DTOs ---
export interface ARPromotionListItem extends ARPromotion {
  customerCodeSnapshot?: string;
  customerNameSnapshot?: string;
}

export interface ARPromotionDetailResponse {
  header: ARPromotion;
}

export interface ARPromotionCreateRequest extends Omit<ARPromotion, 'arpromotionId' | 'versionNo' | 'createdDate' | 'createdBy' | 'lastUpdateDate' | 'lastUpdatedBy'> {
}

export interface ARPromotionUpdateRequest extends Partial<ARPromotion> {
  versionNo: number;
}

export interface ARPromotionSearchRequest {
  skip?: number;
  take?: number;
  keySearch?: string;
  orgId?: number;
  customerId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ARPromotionStatusRequest {
  status: string;
  reason?: string;
}
