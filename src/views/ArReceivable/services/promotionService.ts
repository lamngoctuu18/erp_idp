import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse } from '../types/arDtos';
import { ARPromotion } from '../types/arTypes';

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms));

export const promotionService = {
  getPromotions: async (): Promise<ApiResponse<ARPromotion[]>> => {
    await delay();
    return { success: true, data: ARMockStorage.getPromotions(), message: "Success" };
  }
};
