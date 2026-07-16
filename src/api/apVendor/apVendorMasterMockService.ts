import { ApVendor, ApVendorAddress, ApVendorSite, ApVendorSiteAccount, ApVendorMergeHistory } from "../../model/ApVendorMasterModel";
import { ServiceResponse } from "../sharedConfig/sharedConfigMockService";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  VENDORS: "ap_vendors_master",
  ADDRESSES: "ap_addresses_master",
  SITES: "ap_sites_master",
  SITE_ACCOUNTS: "ap_site_accounts_master",
  MERGE_HISTORY: "ap_vendor_merge_histories",
  INITIALIZED: "ap_vendor_master_db_initialized"
};

export const initializeApVendorMasterDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  const defaultVendors: ApVendor[] = [
    { vendorId: 1, vendorName: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)", segment1: "VND001", taxRegistrationNum: "0300588556", enabledFlag: "Y", creationDate: "2026-01-01T00:00:00.000Z", createdBy: 1 },
    { vendorId: 2, vendorName: "Tập đoàn Xăng dầu Việt Nam (Petrolimex)", segment1: "VND002", taxRegistrationNum: "0100107383", enabledFlag: "Y", creationDate: "2026-01-02T00:00:00.000Z", createdBy: 1 },
    { vendorId: 3, vendorName: "Công ty TNHH Nước giải khát Coca-Cola VN", segment1: "VND003", taxRegistrationNum: "0300768393", enabledFlag: "Y", creationDate: "2026-01-03T00:00:00.000Z", createdBy: 1 },
    { vendorId: 4, vendorName: "Tập đoàn Vingroup - Công ty CP", segment1: "VND004", taxRegistrationNum: "0102016262", enabledFlag: "Y", creationDate: "2026-01-04T00:00:00.000Z", createdBy: 1 },
    { vendorId: 5, vendorName: "Tổng công ty Cổ phần Thiết bị điện VN (GELEX)", segment1: "VND005", taxRegistrationNum: "0100101373", enabledFlag: "N", creationDate: "2026-01-05T00:00:00.000Z", createdBy: 1 }
  ];

  const defaultAddresses: ApVendorAddress[] = [
    { addressId: 101, vendorId: 1, addressType: "PRIMARY", addressLine1: "10 Tân Trào, Tân Phú", addressLine2: "Tòa nhà Vinamilk", addressLine3: null, city: "Hồ Chí Minh", state: "Quận 7", postalCode: "700000", country: "VN", phone: "02854155555", fax: "02854161226", email: "vinamilk@vinamilk.com.vn", isPrimary: "Y", enabledFlag: "Y", creationDate: "2026-01-01T00:00:00.000Z", createdBy: 1 },
    { addressId: 102, vendorId: 2, addressType: "BILLING", addressLine1: "1 Khâm Thiên, Khâm Thiên", addressLine2: "Tòa nhà Petrolimex", addressLine3: null, city: "Hà Nội", state: "Đống Đa", postalCode: "100000", country: "VN", phone: "02438512603", fax: "02438519203", email: "contact@petrolimex.com.vn", isPrimary: "Y", enabledFlag: "Y", creationDate: "2026-01-02T00:00:00.000Z", createdBy: 1 },
    { addressId: 103, vendorId: 3, addressType: "SHIPPING", addressLine1: "485 Xa lộ Hà Nội, Linh Trung", addressLine2: "Nhà máy Coca-Cola", addressLine3: null, city: "Hồ Chí Minh", state: "Thủ Đức", postalCode: "700000", country: "VN", phone: "02838961000", fax: null, email: "supplychain@coca-cola.com.vn", isPrimary: "Y", enabledFlag: "Y", creationDate: "2026-01-03T00:00:00.000Z", createdBy: 1 },
    { addressId: 104, vendorId: 4, addressType: "BILLING", addressLine1: "7 Đường Bằng Lăng 1, Việt Hưng", addressLine2: "Vinhomes Riverside", addressLine3: null, city: "Hà Nội", state: "Long Biên", postalCode: "100000", country: "VN", phone: "02439749999", fax: null, email: "info@vingroup.net", isPrimary: "Y", enabledFlag: "Y", creationDate: "2026-01-04T00:00:00.000Z", createdBy: 1 },
    { addressId: 105, vendorId: 5, addressType: "PRIMARY", addressLine1: "52 Lê Đại Hành, Lê Đại Hành", addressLine2: "Tòa nhà GELEX", addressLine3: null, city: "Hà Nội", state: "Hai Bà Trưng", postalCode: "100000", country: "VN", phone: "02439726245", fax: null, email: "gelex@gelex.vn", isPrimary: "Y", enabledFlag: "N", creationDate: "2026-01-05T00:00:00.000Z", createdBy: 1 }
  ];

  const defaultSites: ApVendorSite[] = [
    { vendorSiteId: 201, vendorId: 1, vendorSiteCode: "VNM-HCM-OFFICE", addressLine1: "10 Tân Trào, Tân Phú, Quận 7, TP. HCM", phone: "02854155555", email: "sales-hcm@vinamilk.com", bankAccountNum: "19020492839201", bankName: "Techcombank", defaultTermsId: 1, defaultPayablesCcid: 33101, enabledFlag: "Y" },
    { vendorSiteId: 202, vendorId: 2, vendorSiteCode: "PLX-HN-DEPOT", addressLine1: "1 Khâm Thiên, Đống Đa, Hà Nội", phone: "02438512603", email: "billing-hn@petrolimex.com", bankAccountNum: "0011004928374", bankName: "Vietcombank", defaultTermsId: 2, defaultPayablesCcid: 33101, enabledFlag: "Y" },
    { vendorSiteId: 203, vendorId: 3, vendorSiteCode: "KO-TD-PLANT", addressLine1: "485 Xa lộ Hà Nội, Thủ Đức, TP. HCM", phone: "02838961000", email: "ap-vietnam@coca-cola.com", bankAccountNum: "10201000029384", bankName: "VietinBank", defaultTermsId: 1, defaultPayablesCcid: 33102, enabledFlag: "Y" },
    { vendorSiteId: 204, vendorId: 4, vendorSiteCode: "VIC-LB-HQ", addressLine1: "7 Đường Bằng Lăng 1, Long Biên, Hà Nội", phone: "02439749999", email: "accounting@vingroup.net", bankAccountNum: "11110000492839", bankName: "BIDV", defaultTermsId: 2, defaultPayablesCcid: 33101, enabledFlag: "Y" },
    { vendorSiteId: 205, vendorId: 5, vendorSiteCode: "GEX-HBT-OFFICE", addressLine1: "52 Lê Đại Hành, Hai Bà Trưng, Hà Nội", phone: "02439726245", email: "finance@gelex.vn", bankAccountNum: "0021003829384", bankName: "Vietcombank", defaultTermsId: 1, defaultPayablesCcid: 33103, enabledFlag: "N" }
  ];

  const defaultSiteAccounts: ApVendorSiteAccount[] = [
    { siteAccountId: 301, vendorSiteId: 201, ledgerId: 1, legalEntityId: 10, liabilityCcid: 331101, prepaymentCcid: 141101, billsPayableCcid: 331301, distributionSetId: 1, status: "ACTIVE" },
    { siteAccountId: 302, vendorSiteId: 202, ledgerId: 1, legalEntityId: 10, liabilityCcid: 331101, prepaymentCcid: 141101, billsPayableCcid: 331301, distributionSetId: 2, status: "ACTIVE" },
    { siteAccountId: 303, vendorSiteId: 203, ledgerId: 1, legalEntityId: 10, liabilityCcid: 331102, prepaymentCcid: 141102, billsPayableCcid: 331302, distributionSetId: 1, status: "ACTIVE" },
    { siteAccountId: 304, vendorSiteId: 204, ledgerId: 1, legalEntityId: 10, liabilityCcid: 331101, prepaymentCcid: 141101, billsPayableCcid: 331301, distributionSetId: 2, status: "ACTIVE" },
    { siteAccountId: 305, vendorSiteId: 205, ledgerId: 1, legalEntityId: 10, liabilityCcid: 331103, prepaymentCcid: 141103, billsPayableCcid: 331303, distributionSetId: 1, status: "INACTIVE" }
  ];

  const defaultMergeHistory: ApVendorMergeHistory[] = [
    { mergeId: 401, fromVendorId: 5, fromVendorSiteId: 205, toVendorId: 4, toVendorSiteId: 204, invoiceScope: "ALL", poMergeFlag: "Y", mergeDate: "2026-06-01T12:00:00.000Z" },
    { mergeId: 402, fromVendorId: 3, fromVendorSiteId: null, toVendorId: 1, toVendorSiteId: null, invoiceScope: "UNPAID", poMergeFlag: "N", mergeDate: "2026-06-10T12:00:00.000Z" },
    { mergeId: 403, fromVendorId: 2, fromVendorSiteId: 202, toVendorId: 1, toVendorSiteId: 201, invoiceScope: "ALL", poMergeFlag: "Y", mergeDate: "2026-06-15T12:00:00.000Z" },
    { mergeId: 404, fromVendorId: 5, fromVendorSiteId: null, toVendorId: 2, toVendorSiteId: null, invoiceScope: "UNPAID", poMergeFlag: "Y", mergeDate: "2026-06-20T12:00:00.000Z" },
    { mergeId: 405, fromVendorId: 4, fromVendorSiteId: 204, toVendorId: 1, toVendorSiteId: 201, invoiceScope: "ALL", poMergeFlag: "N", mergeDate: "2026-06-25T12:00:00.000Z" }
  ];

  localStorage.setItem(KEYS.VENDORS, JSON.stringify(defaultVendors));
  localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(defaultAddresses));
  localStorage.setItem(KEYS.SITES, JSON.stringify(defaultSites));
  localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(defaultSiteAccounts));
  localStorage.setItem(KEYS.MERGE_HISTORY, JSON.stringify(defaultMergeHistory));
  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// 1. Service Nhà Cung Cấp Master (reused/synced)
export const apVendorMasterService = {
  getAll: async (): Promise<ApVendor[]> => {
    initializeApVendorMasterDB();
    return JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
  }
};

// 2. Service Địa Chỉ (ApVendorAddress)
export const apVendorAddressService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; vendorId?: number | null; enabledFlag?: string | null }): Promise<ServiceResponse<{ items: ApVendorAddress[]; totalItems: number }>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.ADDRESSES) || "[]";
    let list: ApVendorAddress[] = JSON.parse(listStr);

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    list = list.map((item) => {
      const vendor = vendors.find((v) => v.vendorId === item.vendorId);
      return { ...item, vendorName: vendor ? vendor.vendorName : "N/A" };
    });

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          (x.addressLine1 && x.addressLine1.toLowerCase().includes(q)) ||
          (x.city && x.city.toLowerCase().includes(q)) ||
          (x.phone && x.phone.includes(q)) ||
          (x.email && x.email.toLowerCase().includes(q))
      );
    }

    if (params.vendorId) {
      list = list.filter((x) => x.vendorId === params.vendorId);
    }

    if (params.enabledFlag) {
      list = list.filter((x) => x.enabledFlag === params.enabledFlag);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApVendorAddress>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.ADDRESSES) || "[]";
    const list: ApVendorAddress[] = JSON.parse(listStr);
    const item = list.find((x) => x.addressId === id);
    if (!item) return { success: false, message: "Không tìm thấy địa chỉ" };

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const vendor = vendors.find((v) => v.vendorId === item.vendorId);
    item.vendorName = vendor ? vendor.vendorName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApVendorAddress, "addressId" | "creationDate" | "createdBy">): Promise<ServiceResponse<ApVendorAddress>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.ADDRESSES) || "[]";
    const list: ApVendorAddress[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.addressId)) + 1 : 101;
    const newItem: ApVendorAddress = {
      ...data,
      addressId: newId,
      creationDate: new Date().toISOString(),
      createdBy: 1
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApVendorAddress>): Promise<ServiceResponse<ApVendorAddress>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.ADDRESSES) || "[]";
    let list: ApVendorAddress[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.addressId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy địa chỉ" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.ADDRESSES) || "[]";
    let list: ApVendorAddress[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.addressId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy địa chỉ" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(list));

    return { success: true };
  }
};

// 3. Service Chi Nhánh (ApVendorSite)
export const apVendorSiteMasterService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; vendorId?: number | null; enabledFlag?: string | null }): Promise<ServiceResponse<{ items: ApVendorSite[]; totalItems: number }>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    let list: ApVendorSite[] = JSON.parse(listStr);

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    list = list.map((item) => {
      const vendor = vendors.find((v) => v.vendorId === item.vendorId);
      return { ...item, vendorName: vendor ? vendor.vendorName : "N/A" };
    });

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.vendorSiteCode.toLowerCase().includes(q) ||
          (x.addressLine1 && x.addressLine1.toLowerCase().includes(q)) ||
          (x.bankAccountNum && x.bankAccountNum.includes(q)) ||
          (x.bankName && x.bankName.toLowerCase().includes(q))
      );
    }

    if (params.vendorId) {
      list = list.filter((x) => x.vendorId === params.vendorId);
    }

    if (params.enabledFlag) {
      list = list.filter((x) => x.enabledFlag === params.enabledFlag);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getAll: async (): Promise<ApVendorSite[]> => {
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<ApVendorSite>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    const list: ApVendorSite[] = JSON.parse(listStr);
    const item = list.find((x) => x.vendorSiteId === id);
    if (!item) return { success: false, message: "Không tìm thấy chi nhánh giao dịch" };

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const vendor = vendors.find((v) => v.vendorId === item.vendorId);
    item.vendorName = vendor ? vendor.vendorName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApVendorSite, "vendorSiteId">): Promise<ServiceResponse<ApVendorSite>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    const list: ApVendorSite[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.vendorSiteId)) + 1 : 201;
    const newItem: ApVendorSite = { ...data, vendorSiteId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.SITES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApVendorSite>): Promise<ServiceResponse<ApVendorSite>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    let list: ApVendorSite[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.vendorSiteId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chi nhánh giao dịch" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.SITES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITES) || "[]";
    let list: ApVendorSite[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.vendorSiteId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chi nhánh giao dịch" };

    // Kiểm tra xem có tài khoản hạch toán nào gán vào chi nhánh này không
    const accountsList: ApVendorSiteAccount[] = JSON.parse(localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]");
    const hasAccount = accountsList.some((x) => x.vendorSiteId === id);
    if (hasAccount) {
      return { success: false, message: "Không thể xóa chi nhánh này vì vẫn tồn tại Tài khoản hạch toán liên kết." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.SITES, JSON.stringify(list));

    return { success: true };
  }
};

// 4. Service Tài Khoản Chi Nhánh (ApVendorSiteAccount)
export const apVendorSiteAccountService = {
  getList: async (params: { skip?: number; take?: number; vendorSiteId?: number | null; status?: string | null }): Promise<ServiceResponse<{ items: ApVendorSiteAccount[]; totalItems: number }>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]";
    let list: ApVendorSiteAccount[] = JSON.parse(listStr);

    const sites: ApVendorSite[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");
    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");

    list = list.map((item) => {
      const site = sites.find((s) => s.vendorSiteId === item.vendorSiteId);
      const vendor = site ? vendors.find((v) => v.vendorId === site.vendorId) : null;
      return {
        ...item,
        vendorSiteCode: site ? site.vendorSiteCode : "N/A",
        vendorName: vendor ? vendor.vendorName : "N/A"
      };
    });

    if (params.vendorSiteId) {
      list = list.filter((x) => x.vendorSiteId === params.vendorSiteId);
    }

    if (params.status) {
      list = list.filter((x) => x.status === params.status);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApVendorSiteAccount>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]";
    const list: ApVendorSiteAccount[] = JSON.parse(listStr);
    const item = list.find((x) => x.siteAccountId === id);
    if (!item) return { success: false, message: "Không tìm thấy tài khoản hạch toán chi nhánh" };

    const sites: ApVendorSite[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");
    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const site = sites.find((s) => s.vendorSiteId === item.vendorSiteId);
    const vendor = site ? vendors.find((v) => v.vendorId === site.vendorId) : null;

    item.vendorSiteCode = site ? site.vendorSiteCode : "N/A";
    item.vendorName = vendor ? vendor.vendorName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApVendorSiteAccount, "siteAccountId">): Promise<ServiceResponse<ApVendorSiteAccount>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]";
    const list: ApVendorSiteAccount[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.siteAccountId)) + 1 : 301;
    const newItem: ApVendorSiteAccount = { ...data, siteAccountId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApVendorSiteAccount>): Promise<ServiceResponse<ApVendorSiteAccount>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]";
    let list: ApVendorSiteAccount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.siteAccountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy tài khoản hạch toán chi nhánh" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]";
    let list: ApVendorSiteAccount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.siteAccountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy tài khoản hạch toán chi nhánh" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(list));

    return { success: true };
  }
};

// 5. Service Gộp Nhà Cung Cấp (ApVendorMergeHistory)
export const apVendorMergeHistoryService = {
  getList: async (params: { skip?: number; take?: number; fromVendorId?: number | null; toVendorId?: number | null }): Promise<ServiceResponse<{ items: ApVendorMergeHistory[]; totalItems: number }>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.MERGE_HISTORY) || "[]";
    let list: ApVendorMergeHistory[] = JSON.parse(listStr);

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const sites: ApVendorSite[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");

    list = list.map((item) => {
      const fromV = vendors.find((v) => v.vendorId === item.fromVendorId);
      const toV = vendors.find((v) => v.vendorId === item.toVendorId);
      const fromS = sites.find((s) => s.vendorSiteId === item.fromVendorSiteId);
      const toS = sites.find((s) => s.vendorSiteId === item.toVendorSiteId);

      return {
        ...item,
        fromVendorName: fromV ? fromV.vendorName : "N/A",
        toVendorName: toV ? toV.vendorName : "N/A",
        fromVendorSiteCode: fromS ? fromS.vendorSiteCode : "Tất cả chi nhánh",
        toVendorSiteCode: toS ? toS.vendorSiteCode : "Tất cả chi nhánh"
      };
    });

    if (params.fromVendorId) {
      list = list.filter((x) => x.fromVendorId === params.fromVendorId);
    }

    if (params.toVendorId) {
      list = list.filter((x) => x.toVendorId === params.toVendorId);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return { success: true, data: { items, totalItems } };
  },

  getById: async (id: number): Promise<ServiceResponse<ApVendorMergeHistory>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.MERGE_HISTORY) || "[]";
    const list: ApVendorMergeHistory[] = JSON.parse(listStr);
    const item = list.find((x) => x.mergeId === id);
    if (!item) return { success: false, message: "Không tìm thấy lịch sử gộp" };

    const vendors: ApVendor[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const sites: ApVendorSite[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");

    const fromV = vendors.find((v) => v.vendorId === item.fromVendorId);
    const toV = vendors.find((v) => v.vendorId === item.toVendorId);
    const fromS = sites.find((s) => s.vendorSiteId === item.fromVendorSiteId);
    const toS = sites.find((s) => s.vendorSiteId === item.toVendorSiteId);

    item.fromVendorName = fromV ? fromV.vendorName : "N/A";
    item.toVendorName = toV ? toV.vendorName : "N/A";
    item.fromVendorSiteCode = fromS ? fromS.vendorSiteCode : "Tất cả chi nhánh";
    item.toVendorSiteCode = toS ? toS.vendorSiteCode : "Tất cả chi nhánh";

    return { success: true, data: item };
  },

  create: async (data: Omit<ApVendorMergeHistory, "mergeId">): Promise<ServiceResponse<ApVendorMergeHistory>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.MERGE_HISTORY) || "[]";
    const list: ApVendorMergeHistory[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.mergeId)) + 1 : 401;
    const newItem: ApVendorMergeHistory = { ...data, mergeId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.MERGE_HISTORY, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<ApVendorMergeHistory>): Promise<ServiceResponse<ApVendorMergeHistory>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.MERGE_HISTORY) || "[]";
    let list: ApVendorMergeHistory[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.mergeId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lịch sử gộp" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.MERGE_HISTORY, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeApVendorMasterDB();
    const listStr = localStorage.getItem(KEYS.MERGE_HISTORY) || "[]";
    let list: ApVendorMergeHistory[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.mergeId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy lịch sử gộp" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.MERGE_HISTORY, JSON.stringify(list));

    return { success: true };
  }
};
