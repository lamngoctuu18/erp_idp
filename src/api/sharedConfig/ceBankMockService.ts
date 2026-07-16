import { CeBank, CeBankBranch, CeBankAccount } from "../../model/CeBankModel";
import { ServiceResponse } from "./sharedConfigMockService";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  BANKS: "ce_banks",
  BRANCHES: "ce_bank_branches",
  ACCOUNTS: "ce_bank_accounts",
  INITIALIZED: "ce_bank_db_initialized"
};

export const initializeCeBankDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  const defaultBanks: CeBank[] = [
    {
      bankId: 1,
      countryCode: "VN",
      bankName: "Ngân hàng TMCP Ngoại thương Việt Nam",
      alternateBankName: "Vietcombank",
      shortBankName: "VCB",
      bankNumber: "001",
      taxRegistrationNumber: "0100112437",
      description: "Hệ thống ngân hàng chính của IDP",
      status: "ACTIVE"
    },
    {
      bankId: 2,
      countryCode: "VN",
      bankName: "Ngân hàng TMCP Công thương Việt Nam",
      alternateBankName: "VietinBank",
      shortBankName: "CTG",
      bankNumber: "002",
      taxRegistrationNumber: "0100111948",
      description: "Hỗ trợ thanh toán lương",
      status: "ACTIVE"
    },
    {
      bankId: 3,
      countryCode: "VN",
      bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      alternateBankName: "BIDV",
      shortBankName: "BID",
      bankNumber: "003",
      taxRegistrationNumber: "0100111955",
      description: "Nhận tiền thanh toán dự án",
      status: "ACTIVE"
    },
    {
      bankId: 4,
      countryCode: "VN",
      bankName: "Ngân hàng TMCP Kỹ thương Việt Nam",
      alternateBankName: "Techcombank",
      shortBankName: "TCB",
      bankNumber: "004",
      taxRegistrationNumber: "0100236467",
      description: "Thanh toán công nợ nhà cung cấp",
      status: "ACTIVE"
    },
    {
      bankId: 5,
      countryCode: "VN",
      bankName: "Ngân hàng Ngoại thương Quốc tế",
      alternateBankName: "Standard Chartered VN",
      shortBankName: "SCB",
      bankNumber: "005",
      taxRegistrationNumber: "0104273294",
      description: "Giao dịch ngoại tệ",
      status: "ACTIVE"
    }
  ];

  const defaultBranches: CeBankBranch[] = [
    {
      branchId: 101,
      bankId: 1,
      branchName: "Chi nhánh Sở giao dịch",
      alternateBranchName: "SGD Vietcombank",
      branchNumber: "VCB001",
      branchType: "MAIN",
      addressLine1: "198 Trần Quang Khải",
      city: "Hà Nội",
      description: "Trụ sở giao dịch chính",
      status: "ACTIVE"
    },
    {
      branchId: 102,
      bankId: 1,
      branchName: "Chi nhánh Hồ Chí Minh",
      alternateBranchName: "Vietcombank HCM",
      branchNumber: "VCB002",
      branchType: "BRANCH",
      addressLine1: "29 Bến Chương Dương",
      city: "Hồ Chí Minh",
      description: "Chi nhánh chính miền Nam",
      status: "ACTIVE"
    },
    {
      branchId: 201,
      bankId: 2,
      branchName: "Chi nhánh Ba Đình",
      alternateBranchName: "VietinBank Ba Đình",
      branchNumber: "CTG001",
      branchType: "BRANCH",
      addressLine1: "126 Đội Cấn",
      city: "Hà Nội",
      description: "Giao dịch chi lương miền Bắc",
      status: "ACTIVE"
    },
    {
      branchId: 301,
      bankId: 3,
      branchName: "Chi nhánh Đà Nẵng",
      alternateBranchName: "BIDV Đà Nẵng",
      branchNumber: "BID001",
      branchType: "BRANCH",
      addressLine1: "90 Nguyễn Chí Thanh",
      city: "Đà Nẵng",
      description: "Nhận tiền thanh toán dự án miền Trung",
      status: "ACTIVE"
    },
    {
      branchId: 401,
      bankId: 4,
      branchName: "Chi nhánh Đông Sài Gòn",
      alternateBranchName: "Techcombank ESG",
      branchNumber: "TCB001",
      branchType: "BRANCH",
      addressLine1: "24-26 Lê Văn Việt",
      city: "Hồ Chí Minh",
      description: "Giao dịch thanh toán nhà cung cấp HCM",
      status: "ACTIVE"
    }
  ];

  const defaultAccounts: CeBankAccount[] = [
    {
      bankAccountId: 1001,
      bankId: 1,
      branchId: 101,
      legalEntityId: 10,
      accountName: "Công ty Cổ phần IDP - VND",
      alternateAccountName: "IDP VND main account",
      accountNumber: "0011001234567",
      currencyCode: "VND",
      multiCurrencyAllowedFlag: "N",
      accountType: "CHECKING",
      startDate: "2026-01-01",
      status: "ACTIVE"
    },
    {
      bankAccountId: 1002,
      bankId: 1,
      branchId: 102,
      legalEntityId: 10,
      accountName: "Công ty Cổ phần IDP - USD",
      alternateAccountName: "IDP USD foreign currency account",
      accountNumber: "0011379876543",
      currencyCode: "USD",
      multiCurrencyAllowedFlag: "Y",
      accountType: "CHECKING",
      startDate: "2026-01-01",
      status: "ACTIVE"
    },
    {
      bankAccountId: 1003,
      bankId: 2,
      branchId: 201,
      legalEntityId: 10,
      accountName: "IDP - Vietinbank Chi lương",
      alternateAccountName: "IDP Payroll account",
      accountNumber: "102010000342938",
      currencyCode: "VND",
      multiCurrencyAllowedFlag: "N",
      accountType: "OTHER",
      startDate: "2026-01-02",
      status: "ACTIVE"
    },
    {
      bankAccountId: 1004,
      bankId: 3,
      branchId: 301,
      legalEntityId: 11,
      accountName: "IDP Đà Nẵng - TK Dự án",
      alternateAccountName: "IDP DN Project account",
      accountNumber: "56110000049283",
      currencyCode: "VND",
      multiCurrencyAllowedFlag: "N",
      accountType: "CHECKING",
      startDate: "2026-01-03",
      status: "ACTIVE"
    },
    {
      bankAccountId: 1005,
      bankId: 4,
      branchId: 401,
      legalEntityId: 10,
      accountName: "IDP TCB - TK Chi trả NCC",
      alternateAccountName: "IDP Techcombank Supplier payment",
      accountNumber: "19032098765432",
      currencyCode: "VND",
      multiCurrencyAllowedFlag: "N",
      accountType: "CHECKING",
      startDate: "2026-01-04",
      status: "ACTIVE"
    }
  ];

  localStorage.setItem(KEYS.BANKS, JSON.stringify(defaultBanks));
  localStorage.setItem(KEYS.BRANCHES, JSON.stringify(defaultBranches));
  localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaultAccounts));
  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// 1. Service Ngân Hàng (CeBank)
export const ceBankService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; status?: string | null }): Promise<ServiceResponse<{ items: CeBank[]; totalItems: number }>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    let list: CeBank[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.bankName.toLowerCase().includes(q) ||
          (x.alternateBankName && x.alternateBankName.toLowerCase().includes(q)) ||
          (x.shortBankName && x.shortBankName.toLowerCase().includes(q)) ||
          (x.bankNumber && x.bankNumber.includes(q))
      );
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

  getAll: async (): Promise<CeBank[]> => {
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<CeBank>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const list: CeBank[] = JSON.parse(listStr);
    const item = list.find((x) => x.bankId === id);
    if (!item) return { success: false, message: "Không tìm thấy thông tin ngân hàng" };
    return { success: true, data: item };
  },

  create: async (data: Omit<CeBank, "bankId">): Promise<ServiceResponse<CeBank>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const list: CeBank[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.bankId)) + 1 : 1;
    const newItem: CeBank = { ...data, bankId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.BANKS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<CeBank>): Promise<ServiceResponse<CeBank>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    let list: CeBank[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.bankId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy thông tin ngân hàng" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.BANKS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BANKS) || "[]";
    let list: CeBank[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.bankId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy ngân hàng" };

    // Kiểm tra chi nhánh
    const branchStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    const branches: CeBankBranch[] = JSON.parse(branchStr);
    const hasBranch = branches.some((x) => x.bankId === id);
    if (hasBranch) {
      return { success: false, message: "Không thể xóa ngân hàng này vì đang tồn tại chi nhánh trực thuộc." };
    }

    // Kiểm tra tài khoản
    const accountStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    const accounts: CeBankAccount[] = JSON.parse(accountStr);
    const hasAccount = accounts.some((x) => x.bankId === id);
    if (hasAccount) {
      return { success: false, message: "Không thể xóa ngân hàng này vì đang tồn tại tài khoản ngân hàng liên kết." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.BANKS, JSON.stringify(list));

    return { success: true };
  }
};

// 2. Service Chi Nhánh (CeBankBranch)
export const ceBankBranchService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; bankId?: number | null; status?: string | null }): Promise<ServiceResponse<{ items: CeBankBranch[]; totalItems: number }>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    let list: CeBankBranch[] = JSON.parse(listStr);

    // Join bankName
    const banksStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const banks: CeBank[] = JSON.parse(banksStr);

    list = list.map((item) => {
      const bank = banks.find((b) => b.bankId === item.bankId);
      return { ...item, bankName: bank ? bank.bankName : "N/A" };
    });

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.branchName.toLowerCase().includes(q) ||
          (x.alternateBranchName && x.alternateBranchName.toLowerCase().includes(q)) ||
          (x.branchNumber && x.branchNumber.includes(q)) ||
          (x.city && x.city.toLowerCase().includes(q))
      );
    }

    if (params.bankId) {
      list = list.filter((x) => x.bankId === params.bankId);
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

  getAll: async (): Promise<CeBankBranch[]> => {
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    return JSON.parse(listStr);
  },

  getById: async (id: number): Promise<ServiceResponse<CeBankBranch>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    const list: CeBankBranch[] = JSON.parse(listStr);
    const item = list.find((x) => x.branchId === id);
    if (!item) return { success: false, message: "Không tìm thấy chi nhánh ngân hàng" };

    // Join bankName
    const banksStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const banks: CeBank[] = JSON.parse(banksStr);
    const bank = banks.find((b) => b.bankId === item.bankId);
    item.bankName = bank ? bank.bankName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<CeBankBranch, "branchId">): Promise<ServiceResponse<CeBankBranch>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    const list: CeBankBranch[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.branchId)) + 1 : 1;
    const newItem: CeBankBranch = { ...data, branchId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<CeBankBranch>): Promise<ServiceResponse<CeBankBranch>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    let list: CeBankBranch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.branchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chi nhánh ngân hàng" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    let list: CeBankBranch[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.branchId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy chi nhánh ngân hàng" };

    // Kiểm tra tài khoản
    const accountStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    const accounts: CeBankAccount[] = JSON.parse(accountStr);
    const hasAccount = accounts.some((x) => x.branchId === id);
    if (hasAccount) {
      return { success: false, message: "Không thể xóa chi nhánh này vì đã gán vào tài khoản ngân hàng." };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(list));

    return { success: true };
  }
};

// 3. Service Tài Khoản Ngân Hàng (CeBankAccount)
export const ceBankAccountService = {
  getList: async (params: {
    skip?: number;
    take?: number;
    keySearch?: string;
    bankId?: number | null;
    branchId?: number | null;
    status?: string | null;
  }): Promise<ServiceResponse<{ items: CeBankAccount[]; totalItems: number }>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    let list: CeBankAccount[] = JSON.parse(listStr);

    // Join bank & branch
    const banksStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const banks: CeBank[] = JSON.parse(banksStr);
    const branchesStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    const branches: CeBankBranch[] = JSON.parse(branchesStr);

    list = list.map((item) => {
      const bank = banks.find((b) => b.bankId === item.bankId);
      const branch = branches.find((br) => br.branchId === item.branchId);
      return {
        ...item,
        bankName: bank ? bank.bankName : "N/A",
        branchName: branch ? branch.branchName : "N/A"
      };
    });

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.accountName.toLowerCase().includes(q) ||
          (x.alternateAccountName && x.alternateAccountName.toLowerCase().includes(q)) ||
          x.accountNumber.includes(q)
      );
    }

    if (params.bankId) {
      list = list.filter((x) => x.bankId === params.bankId);
    }

    if (params.branchId) {
      list = list.filter((x) => x.branchId === params.branchId);
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

  getById: async (id: number): Promise<ServiceResponse<CeBankAccount>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    const list: CeBankAccount[] = JSON.parse(listStr);
    const item = list.find((x) => x.bankAccountId === id);
    if (!item) return { success: false, message: "Không tìm thấy tài khoản ngân hàng" };

    // Join bank & branch
    const banksStr = localStorage.getItem(KEYS.BANKS) || "[]";
    const banks: CeBank[] = JSON.parse(banksStr);
    const branchesStr = localStorage.getItem(KEYS.BRANCHES) || "[]";
    const branches: CeBankBranch[] = JSON.parse(branchesStr);

    const bank = banks.find((b) => b.bankId === item.bankId);
    const branch = branches.find((br) => br.branchId === item.branchId);
    item.bankName = bank ? bank.bankName : "N/A";
    item.branchName = branch ? branch.branchName : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<CeBankAccount, "bankAccountId">): Promise<ServiceResponse<CeBankAccount>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    const list: CeBankAccount[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.bankAccountId)) + 1 : 1;
    const newItem: CeBankAccount = { ...data, bankAccountId: newId };

    list.unshift(newItem);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<CeBankAccount>): Promise<ServiceResponse<CeBankAccount>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    let list: CeBankAccount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.bankAccountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy tài khoản ngân hàng" };

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeCeBankDB();
    const listStr = localStorage.getItem(KEYS.ACCOUNTS) || "[]";
    let list: CeBankAccount[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.bankAccountId === id);
    if (index === -1) return { success: false, message: "Không tìm thấy tài khoản ngân hàng" };

    list.splice(index, 1);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(list));

    return { success: true };
  }
};
