import { ApiResponse, ReferenceOption } from '../types/arDtos';
import { MOCK_CUSTOMERS } from '../mock/arMockData';

const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

export const customerReferenceService = {
  getCustomers: async (): Promise<ApiResponse<ReferenceOption[]>> => {
    await delay();
    return { success: true, data: MOCK_CUSTOMERS, message: "Success" };
  }
};
