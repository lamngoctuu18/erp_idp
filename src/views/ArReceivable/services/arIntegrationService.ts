import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse } from '../types/arDtos';
import { ARAutoInvoiceRequest, ARTransactionInterfaceHdr, ARTransactionCopyBatch } from '../types/arTypes';

const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

export const arIntegrationService = {
  getRequests: async (): Promise<ApiResponse<ARAutoInvoiceRequest[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getAutoInvoiceRequests(), message: "Success" };
  },
  getInterfaceHeaders: async (requestId?: number): Promise<ApiResponse<ARTransactionInterfaceHdr[]>> => {
    await delay();
    let hdrs = ARMockStorage.getInterfaceHeaders();
    if (requestId) {
      hdrs = hdrs.filter(x => x.requestId === requestId);
    }
    return { success: true, data: hdrs, message: "Success" };
  },
  getInterfaceLines: async (headerId: number): Promise<ApiResponse<any[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getInterfaceLines().filter((x: any) => x.transactionInterfaceHdrId === headerId), message: "Success" };
  },
  getInterfaceErrors: async (): Promise<ApiResponse<any[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getInterfaceErrors(), message: "Success" };
  },
  retryLine: async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    return { success: true, data: null, message: "Đã gửi yêu cầu xử lý lại giao dịch" };
  },
  getTransactionCopyBatches: async (): Promise<ApiResponse<ARTransactionCopyBatch[]>> => {
    await delay();
    return { success: true, data: getStorage_copy_batches(), message: "Success" };
  }
};

function getStorage_copy_batches() {
  // Fallback direct reference
  return ARMockStorage.getAutoInvoiceRequests() as any; // mock
}
