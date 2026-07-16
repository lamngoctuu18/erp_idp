import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse } from '../types/arDtos';
import { ARPaymentSchedule, ARAdjustment, ARAutoAdjustmentBatch, ARAutoAdjustmentLine } from '../types/arTypes';

const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

export const arLedgerService = {
  getPaymentSchedules: async (invoiceId?: number): Promise<ApiResponse<ARPaymentSchedule[]>> => {
    await delay();
    let scheds = ARMockStorage.getPaymentSchedules();
    if (invoiceId) {
      scheds = scheds.filter(x => x.invoiceId === invoiceId);
    }
    return { success: true, data: scheds, message: "Success" };
  },

  getAdjustments: async (invoiceId?: number): Promise<ApiResponse<ARAdjustment[]>> => {
    await delay();
    let list = ARMockStorage.getAdjustments();
    if (invoiceId) {
      list = list.filter(x => x.invoiceId === invoiceId);
    }
    return { success: true, data: list, message: "Success" };
  },

  createAdjustment: async (adj: ARAdjustment): Promise<ApiResponse<ARAdjustment>> => {
    await delay();
    const data = ARMockStorage.createAdjustment(adj);
    return { success: true, data, message: "Tạo điều chỉnh thành công" };
  },

  approveAdjustment: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.approveAdjustment(id);
    return { success: true, data: null, message: "Phê duyệt điều chỉnh thành công" };
  },

  getAutoAdjustmentBatches: async (): Promise<ApiResponse<ARAutoAdjustmentBatch[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getAutoAdjustmentBatches(), message: "Success" };
  },

  getAutoAdjustmentLines: async (batchId: number): Promise<ApiResponse<ARAutoAdjustmentLine[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getAutoAdjustmentLines().filter(x => x.autoAdjustmentBatchId === batchId), message: "Success" };
  }
};
