import { ARMockStorage } from '../mock/arMockStorage';
import { ApiResponse, PagedResponse, ARInvoiceListItem, ARInvoiceDetailResponse, ARInvoiceCreateRequest, ARInvoiceUpdateRequest, ARInvoiceSearchRequest } from '../types/arDtos';
import { ARInvoice, ARInvoiceLine } from '../types/arTypes';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const arBillingService = {
  getList: async (req: ARInvoiceSearchRequest): Promise<ApiResponse<PagedResponse<ARInvoiceListItem>>> => {
    await delay();
    let items = ARMockStorage.getInvoices();

    // Filters
    if (req.keySearch) {
      const ks = req.keySearch.toLowerCase();
      items = items.filter(x => 
        (x.invoiceNumber && x.invoiceNumber.toLowerCase().includes(ks)) || 
        (x.invoiceNum && x.invoiceNum.toLowerCase().includes(ks))
      );
    }
    if (req.customerId) {
      items = items.filter(x => x.soldToCustomerId === req.customerId);
    }
    if (req.status === "OVERDUE") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      items = items.filter(x => {
        const dueDate = x.dueDate ? new Date(x.dueDate) : null;
        const remaining = x.totalAmountRemaining ?? x.totalAmount ?? 0;
        return Boolean(dueDate && dueDate < today && remaining > 0 && x.status !== "VOIDED" && x.status !== "VOID");
      });
    } else if (req.status) {
      items = items.filter(x => x.status === req.status);
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

  getById: async (id: number): Promise<ApiResponse<ARInvoiceDetailResponse>> => {
    await delay();
    const data = ARMockStorage.getInvoiceById(id);
    if (!data) return { success: false, data: null, message: "Không tìm thấy hóa đơn" };
    return { success: true, data, message: "Success" };
  },

  create: async (req: ARInvoiceCreateRequest): Promise<ApiResponse<ARInvoice>> => {
    await delay();
    try {
      const inv = ARMockStorage.createInvoice(req as any, (req.lines || []) as any);
      return { success: true, data: inv, message: "Tạo hóa đơn thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  },

  update: async (id: number, req: ARInvoiceUpdateRequest): Promise<ApiResponse<ARInvoice>> => {
    await delay();
    try {
      const inv = ARMockStorage.updateInvoice(id, req as any, req.lines as any);
      return { success: true, data: inv, message: "Cập nhật hóa đơn thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    try {
      ARMockStorage.deleteInvoice(id);
      return { success: true, data: null, message: "Xóa hóa đơn thành công" };
    } catch (e: any) {
      return { success: false, data: null, message: e.message };
    }
  },

  completeInvoice: async (id: number): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.completeInvoice(id);
    return { success: true, data: null, message: "Hoàn tất hóa đơn thành công" };
  },

  voidInvoice: async (id: number, reason: string): Promise<ApiResponse<null>> => {
    await delay();
    ARMockStorage.voidInvoice(id, reason);
    return { success: true, data: null, message: "Vô hiệu hóa đơn thành công" };
  }
};
