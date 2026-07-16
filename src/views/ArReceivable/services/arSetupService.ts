import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse, PagedResponse } from '../types/arDtos';
import { ARTransactionSource, ARTransactionType, ARPaymentTerm, ARReceiptClass, ARReceiptMethod, ARReceivableActivity, ARDistributionSet, ARPaymentTermLine, ARDistributionSetLine } from '../types/arTypes';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

export const arSetupService = {
  getTransactionSources: async (): Promise<ApiResponse<ARTransactionSource[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getTransactionSources(), message: "Success" };
  },
  saveTransactionSource: async (src: ARTransactionSource): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.saveTransactionSource(src);
    return { success: true, data: null, message: "Lưu nguồn giao dịch thành công" };
  },
  deleteTransactionSource: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.deleteTransactionSource(id);
    return { success: true, data: null, message: "Xóa nguồn giao dịch thành công" };
  },

  getTransactionTypes: async (): Promise<ApiResponse<ARTransactionType[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getTransactionTypes(), message: "Success" };
  },
  saveTransactionType: async (type: ARTransactionType): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.saveTransactionType(type);
    return { success: true, data: null, message: "Lưu loại giao dịch thành công" };
  },
  deleteTransactionType: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.deleteTransactionType(id);
    return { success: true, data: null, message: "Xóa loại giao dịch thành công" };
  },

  getPaymentTerms: async (): Promise<ApiResponse<ARPaymentTerm[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getPaymentTerms(), message: "Success" };
  },
  savePaymentTerm: async (term: ARPaymentTerm): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.savePaymentTerm(term);
    return { success: true, data: null, message: "Lưu điều khoản thanh toán thành công" };
  },
  deletePaymentTerm: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.deletePaymentTerm(id);
    return { success: true, data: null, message: "Xóa điều khoản thanh toán thành công" };
  },

  getPaymentTermLines: async (termId: number): Promise<ApiResponse<ARPaymentTermLine[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getPaymentTermLines().filter(x => x.termId === termId), message: "Success" };
  },

  getReceiptClasses: async (): Promise<ApiResponse<ARReceiptClass[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getReceiptClasses(), message: "Success" };
  },

  getReceiptMethods: async (): Promise<ApiResponse<ARReceiptMethod[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getReceiptMethods(), message: "Success" };
  },

  getReceivableActivities: async (): Promise<ApiResponse<ARReceivableActivity[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getReceivableActivities(), message: "Success" };
  },
  saveReceivableActivity: async (act: ARReceivableActivity): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.saveReceivableActivity(act);
    return { success: true, data: null, message: "Lưu hoạt động công nợ thành công" };
  },

  getDistributionSets: async (): Promise<ApiResponse<ARDistributionSet[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getDistributionSets(), message: "Success" };
  },
  getDistributionSetLines: async (setId: number): Promise<ApiResponse<ARDistributionSetLine[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getDistributionSetLines().filter(x => x.distributionSetId === setId), message: "Success" };
  }
};
