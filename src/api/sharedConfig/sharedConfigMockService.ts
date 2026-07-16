import { GlSetOfBook, HrOperatingUnit } from "../../model/SharedConfigModel";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const KEYS = {
  SET_OF_BOOKS: "gl_set_of_books",
  OPERATING_UNITS: "hr_operating_units",
  INITIALIZED: "gl_hr_db_initialized"
};

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const initializeSharedConfigDB = () => {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  const defaultSetOfBooks: GlSetOfBook[] = [
    {
      setOfBooksId: 1,
      name: "Sổ cái Tổng công ty IDP",
      shortName: "IDP_MAIN",
      currencyCode: "VND",
      chartOfAccountsId: 101,
      periodSetName: "Kỳ Tháng",
      enabledFlag: "Y",
      creationDate: "2026-01-01T00:00:00.000Z",
      createdBy: 1
    },
    {
      setOfBooksId: 2,
      name: "Sổ cái Chi nhánh Miền Nam",
      shortName: "IDP_SOUTH",
      currencyCode: "VND",
      chartOfAccountsId: 101,
      periodSetName: "Kỳ Tháng",
      enabledFlag: "Y",
      creationDate: "2026-01-02T00:00:00.000Z",
      createdBy: 1
    },
    {
      setOfBooksId: 3,
      name: "Sổ cái Chi nhánh Miền Bắc",
      shortName: "IDP_NORTH",
      currencyCode: "VND",
      chartOfAccountsId: 101,
      periodSetName: "Kỳ Tháng",
      enabledFlag: "Y",
      creationDate: "2026-01-03T00:00:00.000Z",
      createdBy: 1
    },
    {
      setOfBooksId: 4,
      name: "Sổ cái Dự án Nước ngoài",
      shortName: "IDP_GLOBAL",
      currencyCode: "USD",
      chartOfAccountsId: 102,
      periodSetName: "Kỳ Quý",
      enabledFlag: "Y",
      creationDate: "2026-01-04T00:00:00.000Z",
      createdBy: 1
    },
    {
      setOfBooksId: 5,
      name: "Sổ cái Thử nghiệm ERP",
      shortName: "IDP_TEST",
      currencyCode: "VND",
      chartOfAccountsId: 103,
      periodSetName: "Kỳ Tháng",
      enabledFlag: "N",
      creationDate: "2026-01-05T00:00:00.000Z",
      createdBy: 1
    }
  ];

  const defaultOperatingUnits: HrOperatingUnit[] = [
    {
      orgId: 1,
      name: "Văn phòng Hồ Chí Minh",
      setOfBooksId: 1,
      taxCode: "0312456789",
      address: "123 Nguyễn Du, Quận 1, TP. HCM",
      enabledFlag: "Y",
      creationDate: "2026-01-01T08:00:00.000Z",
      createdBy: 1
    },
    {
      orgId: 2,
      name: "Văn phòng Hà Nội",
      setOfBooksId: 1,
      taxCode: "0312456789-001",
      address: "456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội",
      enabledFlag: "Y",
      creationDate: "2026-01-02T08:00:00.000Z",
      createdBy: 1
    },
    {
      orgId: 3,
      name: "Chi nhánh Cần Thơ",
      setOfBooksId: 2,
      taxCode: "0312456789-002",
      address: "789 Đường 30/4, Quận Ninh Kiều, Cần Thơ",
      enabledFlag: "Y",
      creationDate: "2026-01-03T08:00:00.000Z",
      createdBy: 1
    },
    {
      orgId: 4,
      name: "Chi nhánh Đà Nẵng",
      setOfBooksId: 3,
      taxCode: "0312456789-003",
      address: "101 Lê Duẩn, Quận Hải Châu, Đà Nẵng",
      enabledFlag: "Y",
      creationDate: "2026-01-04T08:00:00.000Z",
      createdBy: 1
    },
    {
      orgId: 5,
      name: "Văn phòng Đại diện Singapore",
      setOfBooksId: 4,
      taxCode: "SG998877",
      address: "Marina Bay Sands, Singapore",
      enabledFlag: "Y",
      creationDate: "2026-01-05T08:00:00.000Z",
      createdBy: 1
    }
  ];

  localStorage.setItem(KEYS.SET_OF_BOOKS, JSON.stringify(defaultSetOfBooks));
  localStorage.setItem(KEYS.OPERATING_UNITS, JSON.stringify(defaultOperatingUnits));
  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// Sổ Cái Chính API Mock
export const glSetOfBookService = {
  getList: async (params: { skip?: number; take?: number; keySearch?: string; enabledFlag?: string | null }): Promise<ServiceResponse<{ items: GlSetOfBook[]; totalItems: number }>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    let list: GlSetOfBook[] = JSON.parse(listStr);

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          (x.shortName && x.shortName.toLowerCase().includes(q)) ||
          x.currencyCode.toLowerCase().includes(q)
      );
    }

    if (params.enabledFlag) {
      list = list.filter((x) => x.enabledFlag === params.enabledFlag);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return {
      success: true,
      data: {
        items,
        totalItems
      }
    };
  },

  getAll: async (): Promise<GlSetOfBook[]> => {
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    const list: GlSetOfBook[] = JSON.parse(listStr);
    return list;
  },

  getById: async (id: number): Promise<ServiceResponse<GlSetOfBook>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    const list: GlSetOfBook[] = JSON.parse(listStr);
    const item = list.find((x) => x.setOfBooksId === id);
    if (!item) {
      return { success: false, message: "Không tìm thấy bộ sổ kế toán" };
    }
    return { success: true, data: item };
  },

  create: async (data: Omit<GlSetOfBook, "setOfBooksId" | "creationDate" | "createdBy">): Promise<ServiceResponse<GlSetOfBook>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    const list: GlSetOfBook[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.setOfBooksId)) + 1 : 1;
    const newItem: GlSetOfBook = {
      ...data,
      setOfBooksId: newId,
      creationDate: new Date().toISOString(),
      createdBy: 1
    };

    list.unshift(newItem); // Thêm lên đầu danh sách
    localStorage.setItem(KEYS.SET_OF_BOOKS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<GlSetOfBook>): Promise<ServiceResponse<GlSetOfBook>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    let list: GlSetOfBook[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.setOfBooksId === id);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy bộ sổ kế toán" };
    }

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.SET_OF_BOOKS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    let list: GlSetOfBook[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.setOfBooksId === id);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy bộ sổ kế toán" };
    }

    // Kiểm tra xem có đơn vị hoạt động nào đang dùng sổ cái này không
    const ouStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    const ous: HrOperatingUnit[] = JSON.parse(ouStr);
    const hasOU = ous.some((x) => x.setOfBooksId === id);

    if (hasOU) {
      return {
        success: false,
        message: "Không thể xóa Sổ cái này vì đã có Đơn vị hoạt động liên kết trực tiếp."
      };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.SET_OF_BOOKS, JSON.stringify(list));

    return { success: true };
  }
};

// Đơn Vị Hoạt Động API Mock
export const hrOperatingUnitService = {
  getList: async (params: {
    skip?: number;
    take?: number;
    keySearch?: string;
    setOfBooksId?: number | null;
    enabledFlag?: string | null;
  }): Promise<ServiceResponse<{ items: HrOperatingUnit[]; totalItems: number }>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    let list: HrOperatingUnit[] = JSON.parse(listStr);

    // Join để lấy tên sổ cái
    const booksStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    const books: GlSetOfBook[] = JSON.parse(booksStr);

    list = list.map((item) => {
      const book = books.find((b) => b.setOfBooksId === item.setOfBooksId);
      return {
        ...item,
        setOfBooksName: book ? book.name : "N/A"
      };
    });

    if (params.keySearch) {
      const q = params.keySearch.toLowerCase();
      list = list.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          (x.taxCode && x.taxCode.toLowerCase().includes(q)) ||
          (x.address && x.address.toLowerCase().includes(q))
      );
    }

    if (params.setOfBooksId) {
      list = list.filter((x) => x.setOfBooksId === params.setOfBooksId);
    }

    if (params.enabledFlag) {
      list = list.filter((x) => x.enabledFlag === params.enabledFlag);
    }

    const totalItems = list.length;
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const items = list.slice(skip, skip + take);

    return {
      success: true,
      data: {
        items,
        totalItems
      }
    };
  },

  getById: async (id: number): Promise<ServiceResponse<HrOperatingUnit>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    const list: HrOperatingUnit[] = JSON.parse(listStr);
    const item = list.find((x) => x.orgId === id);
    if (!item) {
      return { success: false, message: "Không tìm thấy đơn vị hoạt động" };
    }

    // Join lấy tên sổ cái
    const booksStr = localStorage.getItem(KEYS.SET_OF_BOOKS) || "[]";
    const books: GlSetOfBook[] = JSON.parse(booksStr);
    const book = books.find((b) => b.setOfBooksId === item.setOfBooksId);
    item.setOfBooksName = book ? book.name : "N/A";

    return { success: true, data: item };
  },

  create: async (data: Omit<HrOperatingUnit, "orgId" | "creationDate" | "createdBy">): Promise<ServiceResponse<HrOperatingUnit>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    const list: HrOperatingUnit[] = JSON.parse(listStr);

    const newId = list.length > 0 ? Math.max(...list.map((x) => x.orgId)) + 1 : 1;
    const newItem: HrOperatingUnit = {
      ...data,
      orgId: newId,
      creationDate: new Date().toISOString(),
      createdBy: 1
    };

    list.unshift(newItem);
    localStorage.setItem(KEYS.OPERATING_UNITS, JSON.stringify(list));

    return { success: true, data: newItem };
  },

  update: async (id: number, data: Partial<HrOperatingUnit>): Promise<ServiceResponse<HrOperatingUnit>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    let list: HrOperatingUnit[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.orgId === id);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy đơn vị hoạt động" };
    }

    list[index] = { ...list[index], ...data };
    localStorage.setItem(KEYS.OPERATING_UNITS, JSON.stringify(list));

    return { success: true, data: list[index] };
  },

  delete: async (id: number): Promise<ServiceResponse<void>> => {
    await delay();
    initializeSharedConfigDB();
    const listStr = localStorage.getItem(KEYS.OPERATING_UNITS) || "[]";
    let list: HrOperatingUnit[] = JSON.parse(listStr);

    const index = list.findIndex((x) => x.orgId === id);
    if (index === -1) {
      return { success: false, message: "Không tìm thấy đơn vị hoạt động" };
    }

    list.splice(index, 1);
    localStorage.setItem(KEYS.OPERATING_UNITS, JSON.stringify(list));

    return { success: true };
  }
};
