import { ApiResponse, ReferenceOption } from '../types/arDtos';

const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

export const glReferenceService = {
  getLedgers: async (): Promise<ApiResponse<ReferenceOption[]>> => {
    await delay();
    return {
      success: true,
      data: [
        { id: 1, code: "LEDGER_VN", name: "Sổ cái chính Hacom VN" },
        { id: 2, code: "LEDGER_US", name: "Sổ cái phụ USD" }
      ],
      message: "Success"
    };
  },
  getAccounts: async (): Promise<ApiResponse<ReferenceOption[]>> => {
    await delay();
    return {
      success: true,
      data: [
        { id: 131100, code: "131100", name: "Phải thu khách hàng ngắn hạn" },
        { id: 511100, code: "511100", name: "Doanh thu bán hàng thương mại" },
        { id: 333110, code: "333110", name: "Thuế GTGT đầu ra được khấu trừ" },
        { id: 112100, code: "112100", name: "Tiền gửi ngân hàng VND" }
      ],
      message: "Success"
    };
  }
};
