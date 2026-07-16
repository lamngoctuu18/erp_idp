import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse } from '../types/arDtos';
import { ARApNettingAgreement, ARApNettingBatch, ARApNettingBatchLine } from '../types/arTypes';

const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

export const arNettingService = {
  getAgreements: async (): Promise<ApiResponse<ARApNettingAgreement[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getNettingAgreements(), message: "Success" };
  },
  createAgreement: async (agr: ARApNettingAgreement): Promise<ApiResponse<ARApNettingAgreement>> => {
    await delay();
    const data = ARMockStorage.createNettingAgreement(agr);
    return { success: true, data, message: "Tạo thỏa thuận netting thành công" };
  },
  getBatches: async (): Promise<ApiResponse<ARApNettingBatch[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getNettingBatches(), message: "Success" };
  },
  createBatch: async (batch: ARApNettingBatch): Promise<ApiResponse<ARApNettingBatch>> => {
    await delay();
    const data = ARMockStorage.createNettingBatch(batch);
    return { success: true, data, message: "Tạo đợt netting thành công" };
  },
  getBatchLines: async (batchId: number): Promise<ApiResponse<ARApNettingBatchLine[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getNettingBatchLines().filter(x => x.nettingBatchId === batchId), message: "Success" };
  },
  submitNetting: async (id: number): Promise<ApiResponse<null>> => {
    await delay(500);
    const list = ARMockStorage.getNettingBatches();
    const batch = list.find(x => x.nettingBatchId === id);
    if (batch) {
      batch.status = "COMPLETE";
      localStorage.setItem("ar_ap_netting_batches", JSON.stringify(list));
    }
    return { success: true, data: null, message: "Phê duyệt bù trừ netting thành công" };
  }
};
