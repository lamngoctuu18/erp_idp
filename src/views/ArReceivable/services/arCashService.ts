import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse, PagedResponse, ARReceiptSearchRequest, ARReceiptListItem } from '../types/arDtos';
import { ARReceipt, ARReceivableApplication } from '../types/arTypes';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const arCashService = {
  getList: async (req: ARReceiptSearchRequest): Promise<ApiResponse<PagedResponse<ARReceiptListItem>>> => {
    await delay();
    let items = ARMockStorage.getReceipts();

    if (req.keySearch) {
      const ks = req.keySearch.toLowerCase();
      items = items.filter(x => x.receiptNumber && x.receiptNumber.toLowerCase().includes(ks));
    }
    if (req.customerId) {
      items = items.filter(x => x.customerId === req.customerId);
    }
    if (req.balanceView === "unapplied") {
      items = items.filter(x => (x.unappliedAmount || 0) > 0);
    }
    if (req.balanceView === "on-account") {
      items = items.filter(x => (x.onAccountAmount || 0) > 0);
    }

    const skip = req.skip || 0;
    const take = req.take || 20;
    const paged = items.slice(skip, skip + take);

    return {
      success: true,
      data: {
        items: paged,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalItems: items.length,
        totalPages: Math.ceil(items.length / take)
      },
      message: "Success"
    };
  },

  getById: async (id: number): Promise<ApiResponse<ARReceipt>> => {
    await delay();
    const item = ARMockStorage.getReceipts().find(x => x.receiptId === id);
    if (!item) return { success: false, data: null, message: "Không tìm thấy phiếu thu" };
    return { success: true, data: item, message: "Success" };
  },

  create: async (receipt: ARReceipt): Promise<ApiResponse<ARReceipt>> => {
    await delay();
    const data = ARMockStorage.createReceipt(receipt);
    return { success: true, data, message: "Tạo phiếu thu thành công" };
  },

  update: async (id: number, receipt: Partial<ARReceipt>): Promise<ApiResponse<ARReceipt>> => {
    await delay();
    try {
      const data = ARMockStorage.updateReceipt(id, receipt);
      return { success: true, data, message: "Cập nhật phiếu thu thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  },

  reverseReceipt: async (id: number, reason: string): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.reverseReceipt(id, reason);
    return { success: true, data: null, message: "Hoàn trả phiếu thu thành công" };
  },

  getApplications: async (receiptId: number): Promise<ApiResponse<ARReceivableApplication[]>> => {
    await delay();
    const list = ARMockStorage.getReceivableApplications().filter(x => x.receiptId === receiptId && x.status === "APPLIED");
    return { success: true, data: list, message: "Success" };
  },

  applyReceipt: async (receiptId: number, invoiceId: number, amount: number): Promise<ApiResponse<null>> => {
    await delay();
    try {
      ARMockStorage.applyReceipt(receiptId, invoiceId, amount);
      return { success: true, data: null, message: "Apply công nợ thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  },

  unapplyReceipt: async (applicationId: number): Promise<ApiResponse<null>> => {
    await delay();
    try {
      ARMockStorage.unapplyReceipt(applicationId);
      return { success: true, data: null, message: "Unapply công nợ thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  }
};
