import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse } from '../types/arDtos';
import { ARAccountingEvent, ARJournalLine, ARGlTransferBatch } from '../types/arTypes';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const arAccountingService = {
  getEvents: async (): Promise<ApiResponse<ARAccountingEvent[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getAccountingEvents(), message: "Success" };
  },
  getJournalLines: async (eventId: number): Promise<ApiResponse<ARJournalLine[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getJournalLines().filter(x => x.eventId === eventId), message: "Success" };
  },
  getGlTransferBatches: async (): Promise<ApiResponse<ARGlTransferBatch[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getGlTransferBatches(), message: "Success" };
  },
  runAccounting: async (eventId: number, mode: "DRAFT" | "FINAL"): Promise<ApiResponse<null>> => {
    await delay(500);
    ARMockStorage.runAccountingEvent(eventId, mode);
    return { success: true, data: null, message: `Hạch toán thành công chế độ ${mode}` };
  },
  transferToGL: async (batchId: number): Promise<ApiResponse<null>> => {
    await delay(600);
    return { success: true, data: null, message: "Đã chuyển định khoản sang Sổ cái (GL)" };
  }
};
