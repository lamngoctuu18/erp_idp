import { ApVendorModel, ApVendorAddressModel, ApVendorSiteModel, ApVendorSiteAccountModel } from "../../model/ApVendorModel";
import {
  ApInvoiceModel,
  ApInvoiceLineModel,
  ApInvoiceDistributionModel,
  ApInvoiceMatchModel,
  ApPrepaymentApplicationModel,
  ApHoldDefinitionModel,
  ApInvoiceHoldModel,
  ApPaymentScheduleModel,
  ApPaymentModel,
  ApInvoicePaymentModel,
  ApDocumentActionLogModel,
  ApDocumentAttachmentModel,
  ApActEventModel,
  ApActEventHeaderModel,
  ApActEventLineModel,
  MockPurchaseOrderModel
} from "../../model/ApInvoiceModel";

// Helper delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage Keys
const KEYS = {
  VENDORS: "ap_vendors",
  ADDRESSES: "ap_addresses",
  SITES: "ap_sites",
  SITE_ACCOUNTS: "ap_site_accounts",
  INVOICES: "ap_invoices",
  INVOICE_LINES: "ap_invoice_lines",
  INVOICE_DISTRIBUTIONS: "ap_invoice_distributions",
  MATCHES: "ap_invoice_matches",
  PREPAYMENT_APPLICATIONS: "ap_prepayment_applications",
  HOLD_DEFINITIONS: "ap_hold_definitions",
  INVOICE_HOLDS: "ap_invoice_holds",
  PAYMENT_SCHEDULES: "ap_payment_schedules",
  PAYMENTS: "ap_payments",
  INVOICE_PAYMENTS: "ap_invoice_payments",
  ACTION_LOGS: "ap_action_logs",
  ATTACHMENTS: "ap_attachments",
  ACT_EVENTS: "ap_act_events",
  ACT_EVENT_HEADERS: "ap_act_event_headers",
  ACT_EVENT_LINES: "ap_act_event_lines",
  MOCK_POS: "ap_mock_pos",
  INITIALIZED: "ap_db_initialized"
};

// Khởi tạo database ảo trong localStorage nếu chưa tồn tại
export const initializeMockDB = () => {
  const hasOldData = localStorage.getItem(KEYS.VENDORS)?.includes("HACOM01");
  if (hasOldData) {
    localStorage.removeItem(KEYS.INITIALIZED);
  }
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  // 1. Danh sách Nhà cung cấp (AP_VENDORS)
  const defaultVendors: ApVendorModel[] = [
    {
      vendorId: 1,
      vendorName: "Công ty cổ phần lắp ráp",
      segment1: "V001",
      taxRegistrationNum: "22244",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 0, 1).toISOString(),
      createdBy: 1
    },
    {
      vendorId: 2,
      vendorName: "Công ty TNHH Nam Tiến",
      segment1: "CP002",
      taxRegistrationNum: "3374512",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 0, 5).toISOString(),
      createdBy: 1
    },
    {
      vendorId: 3,
      vendorName: "Công ty TNHH Sao Việt",
      segment1: "CP003",
      taxRegistrationNum: "324327",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 1, 10).toISOString(),
      createdBy: 1
    },
    {
      vendorId: 4,
      vendorName: "Công ty TNHH IDP",
      segment1: "CP005",
      taxRegistrationNum: "883345",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 1, 12).toISOString(),
      createdBy: 1
    },
    {
      vendorId: 5,
      vendorName: "Công ty Jisulife",
      segment1: "SP006",
      taxRegistrationNum: "33902",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 1, 15).toISOString(),
      createdBy: 1
    },
    {
      vendorId: 6,
      vendorName: "IDPS",
      segment1: "CC004",
      taxRegistrationNum: "321383",
      enabledFlag: "Y",
      vendorType: "ORGANIZATION",
      dunsNumber: null,
      employeeNumber: null,
      creationDate: new Date(2026, 1, 20).toISOString(),
      createdBy: 1
    }
  ];

  // 2. Địa chỉ Nhà cung cấp (AP_VENDOR_ADDRESSES)
  const defaultAddresses: ApVendorAddressModel[] = [
    {
      addressId: 101,
      vendorId: 1,
      countryCode: "VN",
      addressLine1: "Số 131 Lê Thanh Nghị, Hai Bà Trưng",
      city: "Hà Nội",
      province: "Hà Nội",
      addressName: "Văn phòng Hà Nội",
      phone: "19001903",
      email: "hanoi@hacom.vn",
      purchasingFlag: "Y",
      paymentFlag: "Y",
      status: "ACTIVE"
    },
    {
      addressId: 102,
      vendorId: 1,
      countryCode: "VN",
      addressLine1: "Số 520 Cách Mạng Tháng Tám, Quận 3",
      city: "Hồ Chí Minh",
      province: "Hồ Chí Minh",
      addressName: "Chi nhánh miền Nam",
      phone: "19001903",
      email: "hcm@hacom.vn",
      purchasingFlag: "Y",
      paymentFlag: "Y",
      status: "ACTIVE"
    },
    {
      addressId: 201,
      vendorId: 2,
      countryCode: "VN",
      addressLine1: "Tầng 25, Tòa nhà Vietcombank, Quận 1",
      city: "Hồ Chí Minh",
      province: "Hồ Chí Minh",
      addressName: "Trụ sở Dell VN",
      phone: "02838243888",
      email: "vietnam_support@dell.com",
      purchasingFlag: "Y",
      paymentFlag: "Y",
      status: "ACTIVE"
    }
  ];

  // 3. Chi nhánh Nhà cung cấp (AP_VENDOR_SITES)
  const defaultSites: ApVendorSiteModel[] = [
    {
      vendorSiteId: 301,
      vendorId: 1,
      vendorSiteCode: "HN-OFFICE",
      addressLine1: "Số 131 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội",
      phone: "19001903",
      email: "accounting_hn@hacom.vn",
      enabledFlag: "Y",
      addressId: 101,
      operatingUnitId: 1, // Hà Nội Headquarters
      purchasingFlag: "Y",
      paymentFlag: "Y",
      rfqOnlyFlag: "N",
      primaryPayFlag: "Y",
      bankAccountId: 501,
      distributionSetId: 1
    },
    {
      vendorSiteId: 302,
      vendorId: 1,
      vendorSiteCode: "HCM-OFFICE",
      addressLine1: "Số 520 Cách Mạng Tháng Tám, Quận 3, TP.HCM",
      phone: "19001903",
      email: "accounting_hcm@hacom.vn",
      enabledFlag: "Y",
      addressId: 102,
      operatingUnitId: 2, // HCM Branch
      purchasingFlag: "Y",
      paymentFlag: "Y",
      rfqOnlyFlag: "N",
      primaryPayFlag: "N",
      bankAccountId: 501,
      distributionSetId: 1
    },
    {
      vendorSiteId: 303,
      vendorId: 2,
      vendorSiteCode: "DELL-MAIN",
      addressLine1: "Tầng 25, Tòa nhà Vietcombank, Quận 1, TP.HCM",
      phone: "02838243888",
      email: "ap_vietnam@dell.com",
      enabledFlag: "Y",
      addressId: 201,
      operatingUnitId: 1,
      purchasingFlag: "Y",
      paymentFlag: "Y",
      rfqOnlyFlag: "N",
      primaryPayFlag: "Y",
      bankAccountId: 502
    }
  ];

  // 4. Tài khoản hạch toán mặc định theo Chi nhánh (AP_VENDOR_SITE_ACCOUNTS)
  const defaultSiteAccounts: ApVendorSiteAccountModel[] = [
    {
      siteAccountId: 401,
      vendorSiteId: 301,
      ledgerId: 1,
      legalEntityId: 1,
      liabilityCcid: 331001, // 331 - Phải trả cho người bán (HN)
      prepaymentCcid: 331002, // 331 - Trả trước cho người bán (HN)
      billsPayableCcid: 331003,
      distributionSetId: 1,
      status: "ACTIVE"
    },
    {
      siteAccountId: 402,
      vendorSiteId: 302,
      ledgerId: 1,
      legalEntityId: 1,
      liabilityCcid: 331004, // 331 - Phải trả cho người bán (HCM)
      prepaymentCcid: 331005,
      billsPayableCcid: 331003,
      distributionSetId: 1,
      status: "ACTIVE"
    },
    {
      siteAccountId: 403,
      vendorSiteId: 303,
      ledgerId: 1,
      legalEntityId: 1,
      liabilityCcid: 331001,
      prepaymentCcid: 331002,
      status: "ACTIVE"
    }
  ];

  // 5. Quy tắc Giữ nợ (AP_HOLD_DEFINITIONS)
  const defaultHoldDefinitions: ApHoldDefinitionModel[] = [
    {
      holdCode: "QTY_ORD",
      holdName: "Sai lệch Số lượng Đặt hàng",
      holdReason: "Số lượng trên hóa đơn vượt quá số lượng còn lại trên Đơn mua hàng (PO).",
      systemFlag: "Y",
      manualReleaseAllowedFlag: "Y",
      activeFlag: "Y"
    },
    {
      holdCode: "PRICE_ERR",
      holdName: "Sai lệch Đơn giá",
      holdReason: "Đơn giá trên hóa đơn cao hơn đơn giá đã thỏa thuận trên Đơn mua hàng (PO).",
      systemFlag: "Y",
      manualReleaseAllowedFlag: "Y",
      activeFlag: "Y"
    },
    {
      holdCode: "AMT_DIST",
      holdName: "Không cân bằng phân bổ",
      holdReason: "Tổng số tiền các dòng phân bổ chi phí không bằng số tiền ghi trên Header hóa đơn.",
      systemFlag: "Y",
      manualReleaseAllowedFlag: "Y",
      activeFlag: "Y"
    }
  ];

  // 6. Đơn mua hàng PO ảo để so khớp (Mock POs)
  const defaultMockPOs: MockPurchaseOrderModel[] = [
    {
      poHeaderId: 1001,
      poNumber: "PO-2026-0001",
      vendorId: 1,
      vendorSiteId: 301,
      poDate: new Date(2026, 5, 20).toISOString(),
      description: "Đơn mua sắm trang thiết bị Laptop văn phòng",
      lines: [
        {
          poLineId: 10011,
          poHeaderId: 1001,
          lineNum: 1,
          itemName: "Laptop Dell Latitude 5440 Core i5",
          qtyOrdered: 10,
          qtyReceived: 10,
          qtyBilled: 2, // Đã lập hóa đơn 2 chiếc
          unitPrice: 18500000,
          amount: 185000000
        },
        {
          poLineId: 10012,
          poHeaderId: 1001,
          lineNum: 2,
          itemName: "Bàn phím không dây Dell Premier KM7321W",
          qtyOrdered: 10,
          qtyReceived: 10,
          qtyBilled: 0,
          unitPrice: 1200000,
          amount: 12000000
        }
      ]
    },
    {
      poHeaderId: 1002,
      poNumber: "PO-2026-0002",
      vendorId: 2,
      vendorSiteId: 303,
      poDate: new Date(2026, 5, 25).toISOString(),
      description: "Đơn nhập hàng Laptop Dell số lượng lớn cho kho kinh doanh",
      lines: [
        {
          poLineId: 10021,
          poHeaderId: 1002,
          lineNum: 1,
          itemName: "Laptop Dell Inspiron 15 3520",
          qtyOrdered: 50,
          qtyReceived: 50,
          qtyBilled: 0,
          unitPrice: 13900000,
          amount: 695000000
        }
      ]
    }
  ];

  // 7. Tạo sẵn 1 Hóa đơn Tạm ứng ảo đã thanh toán để cấn trừ (Prepayment)
  const defaultInvoices: ApInvoiceModel[] = [
    {
      invoiceId: 99,
      invoiceNum: "PREPAY-HACOM-01",
      invoiceDate: new Date(2026, 5, 1).toISOString(),
      glDate: new Date(2026, 5, 1).toISOString(),
      vendorId: 1,
      vendorSiteId: 301,
      invoiceAmount: 50000000,
      currencyCode: "VND",
      paymentTermId: 1, // Immediate
      paymentMethodCode: "WIRE",
      bankAccountId: 501,
      status: "PAID",
      invoiceType: "PREPAYMENT",
      description: "Tạm ứng tiền mua máy tính đợt 1",
      creationDate: new Date(2026, 5, 1).toISOString(),
      createdBy: 1
    }
  ];

  const defaultInvoiceLines: ApInvoiceLineModel[] = [
    {
      invoiceLineId: 991,
      invoiceId: 99,
      lineNum: 1,
      lineType: "ITEM",
      amount: 50000000,
      description: "Tạm ứng hợp đồng Laptop"
    }
  ];

  const defaultInvoiceDistributions: ApInvoiceDistributionModel[] = [
    {
      invoiceDistributionId: 9911,
      invoiceLineId: 991,
      invoiceId: 99,
      distributionLineNumber: 1,
      amount: 50000000,
      accountCcid: 331002 // Trả trước NCC
    }
  ];

  const defaultPaymentSchedules: ApPaymentScheduleModel[] = [
    {
      paymentScheduleId: 991,
      invoiceId: 99,
      dueDate: new Date(2026, 5, 1).toISOString(),
      amountDue: 50000000,
      amountRemaining: 0, // Đã thanh toán hết
      status: "PAID"
    }
  ];

  // Đẩy toàn bộ vào localStorage
  localStorage.setItem(KEYS.VENDORS, JSON.stringify(defaultVendors));
  localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(defaultAddresses));
  localStorage.setItem(KEYS.SITES, JSON.stringify(defaultSites));
  localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(defaultSiteAccounts));
  localStorage.setItem(KEYS.HOLD_DEFINITIONS, JSON.stringify(defaultHoldDefinitions));
  localStorage.setItem(KEYS.MOCK_POS, JSON.stringify(defaultMockPOs));
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(defaultInvoices));
  localStorage.setItem(KEYS.INVOICE_LINES, JSON.stringify(defaultInvoiceLines));
  localStorage.setItem(KEYS.INVOICE_DISTRIBUTIONS, JSON.stringify(defaultInvoiceDistributions));
  localStorage.setItem(KEYS.PAYMENT_SCHEDULES, JSON.stringify(defaultPaymentSchedules));

  // Khởi tạo các bảng rỗng khác
  localStorage.setItem(KEYS.MATCHES, JSON.stringify([]));
  localStorage.setItem(KEYS.PREPAYMENT_APPLICATIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.INVOICE_HOLDS, JSON.stringify([]));
  localStorage.setItem(KEYS.PAYMENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.ACTION_LOGS, JSON.stringify([]));
  localStorage.setItem(KEYS.ATTACHMENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.ACT_EVENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.ACT_EVENT_HEADERS, JSON.stringify([]));
  localStorage.setItem(KEYS.ACT_EVENT_LINES, JSON.stringify([]));

  localStorage.setItem(KEYS.INITIALIZED, "true");
};

// --- DATA ACCESS METHODS ---

// 1. VENDORS SERVICE
export const apVendorService = {
  getAll: async (keySearch = ""): Promise<ApVendorModel[]> => {
    await delay();
    initializeMockDB();
    const list: ApVendorModel[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const invoices: any[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const pos: any[] = JSON.parse(localStorage.getItem(KEYS.MOCK_POS) || "[]");

    const mapped = list.map((v) => {
      const hasInvoices = invoices.some((x) => x.vendorId === v.vendorId);
      const hasPos = pos.some((x) => x.vendorId === v.vendorId);
      return {
        ...v,
        used: hasInvoices || hasPos,
      };
    });

    if (!keySearch) return mapped;
    const q = keySearch.toLowerCase();
    return mapped.filter(
      (x) =>
        x.vendorName.toLowerCase().includes(q) ||
        x.segment1.toLowerCase().includes(q) ||
        (x.taxRegistrationNum && x.taxRegistrationNum.includes(q))
    );
  },

  getById: async (id: number): Promise<ApVendorModel | null> => {
    await delay();
    initializeMockDB();
    const list: ApVendorModel[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const found = list.find((x) => x.vendorId === id) || null;
    if (!found) return null;
    const invoices: any[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const pos: any[] = JSON.parse(localStorage.getItem(KEYS.MOCK_POS) || "[]");
    return {
      ...found,
      used: invoices.some((x) => x.vendorId === id) || pos.some((x) => x.vendorId === id),
    };
  },

  save: async (data: Partial<ApVendorModel>): Promise<ApVendorModel> => {
    await delay();
    initializeMockDB();
    const list: ApVendorModel[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    if (data.vendorId) {
      // Update
      const idx = list.findIndex((x) => x.vendorId === data.vendorId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data } as ApVendorModel;
      }
    } else {
      // Insert
      const newId = list.length > 0 ? Math.max(...list.map((x) => x.vendorId)) + 1 : 1;
      const newVendor: ApVendorModel = {
        vendorId: newId,
        vendorName: data.vendorName || "NCC Chưa đặt tên",
        segment1: data.segment1 || `NCC${String(newId).padStart(4, "0")}`,
        taxRegistrationNum: data.taxRegistrationNum || null,
        enabledFlag: data.enabledFlag || "Y",
        vendorType: data.vendorType || "ORGANIZATION",
        dunsNumber: data.dunsNumber || null,
        employeeNumber: data.employeeNumber || null,
        creationDate: new Date().toISOString(),
        createdBy: 1
      };
      list.push(newVendor);
      data.vendorId = newId;
    }
    localStorage.setItem(KEYS.VENDORS, JSON.stringify(list));
    return (data.vendorId ? list.find((x) => x.vendorId === data.vendorId) : list[list.length - 1]) as ApVendorModel;
  },

  delete: async (id: number): Promise<boolean> => {
    await delay();
    initializeMockDB();
    let list: ApVendorModel[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");
    const exists = list.some((x) => x.vendorId === id);
    if (exists) {
      list = list.filter((x) => x.vendorId !== id);
      localStorage.setItem(KEYS.VENDORS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  // ADDRESSES SUB-SERVICE
  getAddresses: async (vendorId: number): Promise<ApVendorAddressModel[]> => {
    initializeMockDB();
    const list: ApVendorAddressModel[] = JSON.parse(localStorage.getItem(KEYS.ADDRESSES) || "[]");
    return list.filter((x) => x.vendorId === vendorId);
  },

  saveAddress: async (data: Partial<ApVendorAddressModel>): Promise<ApVendorAddressModel> => {
    initializeMockDB();
    const list: ApVendorAddressModel[] = JSON.parse(localStorage.getItem(KEYS.ADDRESSES) || "[]");
    if (data.addressId) {
      const idx = list.findIndex((x) => x.addressId === data.addressId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data } as ApVendorAddressModel;
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((x) => x.addressId)) + 1 : 101;
      const newAddr: ApVendorAddressModel = {
        addressId: newId,
        vendorId: data.vendorId || 0,
        countryCode: data.countryCode || "VN",
        addressLine1: data.addressLine1 || "",
        addressLine2: data.addressLine2,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
        addressName: data.addressName,
        phone: data.phone,
        email: data.email,
        purchasingFlag: data.purchasingFlag || "Y",
        paymentFlag: data.paymentFlag || "Y",
        status: data.status || "ACTIVE"
      };
      list.push(newAddr);
      data.addressId = newId;
    }
    localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(list));
    return list.find((x) => x.addressId === data.addressId) as ApVendorAddressModel;
  },

  deleteAddress: async (id: number): Promise<boolean> => {
    initializeMockDB();
    let list: ApVendorAddressModel[] = JSON.parse(localStorage.getItem(KEYS.ADDRESSES) || "[]");
    const initialLen = list.length;
    list = list.filter((x) => x.addressId !== id);
    localStorage.setItem(KEYS.ADDRESSES, JSON.stringify(list));
    return list.length < initialLen;
  },

  // SITES SUB-SERVICE
  getSites: async (vendorId: number): Promise<ApVendorSiteModel[]> => {
    initializeMockDB();
    const list: ApVendorSiteModel[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");
    return list.filter((x) => x.vendorId === vendorId);
  },

  saveSite: async (data: Partial<ApVendorSiteModel>): Promise<ApVendorSiteModel> => {
    initializeMockDB();
    const list: ApVendorSiteModel[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");
    if (data.vendorSiteId) {
      const idx = list.findIndex((x) => x.vendorSiteId === data.vendorSiteId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data } as ApVendorSiteModel;
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((x) => x.vendorSiteId)) + 1 : 301;
      const newSite: ApVendorSiteModel = {
        vendorSiteId: newId,
        vendorId: data.vendorId || 0,
        vendorSiteCode: data.vendorSiteCode || "NEW-SITE",
        addressLine1: data.addressLine1,
        phone: data.phone,
        email: data.email,
        enabledFlag: data.enabledFlag || "Y",
        addressId: data.addressId,
        operatingUnitId: data.operatingUnitId || 1,
        purchasingFlag: data.purchasingFlag || "Y",
        paymentFlag: data.paymentFlag || "Y",
        rfqOnlyFlag: data.rfqOnlyFlag || "N",
        primaryPayFlag: data.primaryPayFlag || "N"
      };
      list.push(newSite);
      data.vendorSiteId = newId;

      // Sinh kèm bản ghi Site Account mặc định
      const accountsList: ApVendorSiteAccountModel[] = JSON.parse(localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]");
      const newActId = accountsList.length > 0 ? Math.max(...accountsList.map((x) => x.siteAccountId)) + 1 : 401;
      accountsList.push({
        siteAccountId: newActId,
        vendorSiteId: newId,
        ledgerId: 1,
        legalEntityId: 1,
        liabilityCcid: 331001,
        prepaymentCcid: 331002,
        status: "ACTIVE"
      });
      localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(accountsList));
    }
    localStorage.setItem(KEYS.SITES, JSON.stringify(list));
    return list.find((x) => x.vendorSiteId === data.vendorSiteId) as ApVendorSiteModel;
  },

  deleteSite: async (id: number): Promise<boolean> => {
    initializeMockDB();
    let list: ApVendorSiteModel[] = JSON.parse(localStorage.getItem(KEYS.SITES) || "[]");
    const initialLen = list.length;
    list = list.filter((x) => x.vendorSiteId !== id);
    localStorage.setItem(KEYS.SITES, JSON.stringify(list));

    // Xóa Site Accounts đi kèm
    let accountsList: ApVendorSiteAccountModel[] = JSON.parse(localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]");
    accountsList = accountsList.filter((x) => x.vendorSiteId !== id);
    localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(accountsList));

    return list.length < initialLen;
  },

  getSiteAccounts: async (vendorSiteId: number): Promise<ApVendorSiteAccountModel | null> => {
    initializeMockDB();
    const list: ApVendorSiteAccountModel[] = JSON.parse(localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]");
    return list.find((x) => x.vendorSiteId === vendorSiteId) || null;
  },

  saveSiteAccounts: async (data: Partial<ApVendorSiteAccountModel>): Promise<ApVendorSiteAccountModel> => {
    initializeMockDB();
    const list: ApVendorSiteAccountModel[] = JSON.parse(localStorage.getItem(KEYS.SITE_ACCOUNTS) || "[]");
    const idx = list.findIndex((x) => x.vendorSiteId === data.vendorSiteId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data } as ApVendorSiteAccountModel;
    } else {
      const newId = list.length > 0 ? Math.max(...list.map((x) => x.siteAccountId)) + 1 : 401;
      const newAct = {
        siteAccountId: newId,
        vendorSiteId: data.vendorSiteId || 0,
        ...data
      } as ApVendorSiteAccountModel;
      list.push(newAct);
    }
    localStorage.setItem(KEYS.SITE_ACCOUNTS, JSON.stringify(list));
    return list.find((x) => x.vendorSiteId === data.vendorSiteId) as ApVendorSiteAccountModel;
  }
};

// 2. INVOICE SERVICE
export const apInvoiceService = {
  getAll: async (keySearch = ""): Promise<ApInvoiceModel[]> => {
    await delay();
    initializeMockDB();
    const list: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const mapped = list.map(inv => ({
      ...inv,
      invoiceType: inv.invoiceType || (inv.invoiceNum.startsWith("PREPAY") ? "PREPAYMENT" : "STANDARD")
    }));
    if (!keySearch) return mapped;
    const q = keySearch.toLowerCase();
    return mapped.filter((x) => x.invoiceNum.toLowerCase().includes(q) || (x.description && x.description.toLowerCase().includes(q)));
  },

  getById: async (id: number): Promise<ApInvoiceModel | null> => {
    await delay();
    initializeMockDB();
    const list: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const found = list.find((x) => x.invoiceId === id) || null;
    if (!found) return null;
    return {
      ...found,
      invoiceType: found.invoiceType || (found.invoiceNum.startsWith("PREPAY") ? "PREPAYMENT" : "STANDARD")
    };
  },

  getLines: async (invoiceId: number): Promise<ApInvoiceLineModel[]> => {
    initializeMockDB();
    const list: ApInvoiceLineModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_LINES) || "[]");
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  getDistributions: async (invoiceId: number): Promise<ApInvoiceDistributionModel[]> => {
    initializeMockDB();
    const list: ApInvoiceDistributionModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_DISTRIBUTIONS) || "[]");
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  save: async (
    invoice: Partial<ApInvoiceModel>,
    lines: ApInvoiceLineModel[],
    distributions: ApInvoiceDistributionModel[]
  ): Promise<ApInvoiceModel> => {
    await delay();
    initializeMockDB();
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const allLines: ApInvoiceLineModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_LINES) || "[]");
    const allDistributions: ApInvoiceDistributionModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_DISTRIBUTIONS) || "[]");
    const schedules: ApPaymentScheduleModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENT_SCHEDULES) || "[]");

    let isNew = false;
    let invId = invoice.invoiceId || 0;

    if (invoice.invoiceId) {
      // Update
      const idx = invoices.findIndex((x) => x.invoiceId === invoice.invoiceId);
      if (idx !== -1) {
        invoices[idx] = { ...invoices[idx], ...invoice } as ApInvoiceModel;
      }
    } else {
      isNew = true;
      invId = invoices.length > 0 ? Math.max(...invoices.map((x) => x.invoiceId)) + 1 : 100;
      const newInv: ApInvoiceModel = {
        invoiceId: invId,
        invoiceNum: invoice.invoiceNum || `INV-${String(invId).padStart(4, "0")}`,
        invoiceDate: invoice.invoiceDate || new Date().toISOString(),
        glDate: invoice.glDate || new Date().toISOString(),
        vendorId: invoice.vendorId || 0,
        vendorSiteId: invoice.vendorSiteId || 0,
        invoiceAmount: invoice.invoiceAmount || 0,
        currencyCode: invoice.currencyCode || "VND",
        paymentTermId: invoice.paymentTermId || 1, // Mặc định Immediate
        paymentMethodCode: invoice.paymentMethodCode || "WIRE",
        bankAccountId: invoice.bankAccountId,
        status: "DRAFT",
        invoiceType: invoice.invoiceType || "STANDARD",
        description: invoice.description,
        creationDate: new Date().toISOString(),
        createdBy: 1
      };
      invoices.push(newInv);
      invoice.invoiceId = invId;
    }

    // Cập nhật Lines
    // Xóa Lines cũ của Invoice này trước
    const linesFiltered = allLines.filter((x) => x.invoiceId !== invId);
    let currentLineId = allLines.length > 0 ? Math.max(...allLines.map((x) => x.invoiceLineId)) + 1 : 1000;
    const linesWithIds = lines.map((l, i) => ({
      ...l,
      invoiceLineId: l.invoiceLineId || currentLineId++,
      invoiceId: invId,
      lineNum: i + 1
    }));
    localStorage.setItem(KEYS.INVOICE_LINES, JSON.stringify([...linesFiltered, ...linesWithIds]));

    // Cập nhật Distributions
    const distsFiltered = allDistributions.filter((x) => x.invoiceId !== invId);
    let currentDistId = allDistributions.length > 0 ? Math.max(...allDistributions.map((x) => x.invoiceDistributionId)) + 1 : 10000;
    const distsWithIds = distributions.map((d, i) => ({
      ...d,
      invoiceDistributionId: d.invoiceDistributionId || currentDistId++,
      invoiceId: invId,
      invoiceLineId: linesWithIds[d.invoiceLineId - 1]?.invoiceLineId || d.invoiceLineId, // map to correct real line id
      distributionLineNumber: i + 1
    }));
    localStorage.setItem(KEYS.INVOICE_DISTRIBUTIONS, JSON.stringify([...distsFiltered, ...distsWithIds]));

    // Tạo lịch thanh toán (Payment Schedules) nếu là hóa đơn mới
    if (isNew) {
      const schedId = schedules.length > 0 ? Math.max(...schedules.map((x) => x.paymentScheduleId)) + 1 : 1000;
      
      // Mặc định tính ngày đáo hạn = Ngày hóa đơn + 30 ngày (nếu là điều khoản Net 30)
      const dueDays = invoice.paymentTermId === 2 ? 30 : 0;
      const dueDate = new Date(new Date(invoice.invoiceDate || "").getTime() + dueDays * 24 * 60 * 60 * 1000).toISOString();

      schedules.push({
        paymentScheduleId: schedId,
        invoiceId: invId,
        dueDate,
        amountDue: invoice.invoiceAmount || 0,
        amountRemaining: invoice.invoiceAmount || 0,
        discountDate: dueDays === 30 ? new Date(new Date(invoice.invoiceDate || "").getTime() + 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        discountAmountAvailable: dueDays === 30 ? (invoice.invoiceAmount || 0) * 0.02 : 0, // 2% chiết khấu trả sớm
        status: "UNPAID"
      });
      localStorage.setItem(KEYS.PAYMENT_SCHEDULES, JSON.stringify(schedules));

      // Tạo nhật ký kiểm toán khởi tạo
      apInvoiceService.logAction(invId, "INVOICE", "VALIDATE", 1, "DRAFT", "DRAFT", "Lập hóa đơn bản nháp.");
    }

    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
    return invoices.find((x) => x.invoiceId === invId) as ApInvoiceModel;
  },

  delete: async (id: number): Promise<boolean> => {
    await delay();
    initializeMockDB();
    let invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const initialLen = invoices.length;
    invoices = invoices.filter((x) => x.invoiceId !== id);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // Dọn dẹp các bảng con đi kèm
    let lines = JSON.parse(localStorage.getItem(KEYS.INVOICE_LINES) || "[]");
    lines = lines.filter((x: any) => x.invoiceId !== id);
    localStorage.setItem(KEYS.INVOICE_LINES, JSON.stringify(lines));

    let dists = JSON.parse(localStorage.getItem(KEYS.INVOICE_DISTRIBUTIONS) || "[]");
    dists = dists.filter((x: any) => x.invoiceId !== id);
    localStorage.setItem(KEYS.INVOICE_DISTRIBUTIONS, JSON.stringify(dists));

    let schedules = JSON.parse(localStorage.getItem(KEYS.PAYMENT_SCHEDULES) || "[]");
    schedules = schedules.filter((x: any) => x.invoiceId !== id);
    localStorage.setItem(KEYS.PAYMENT_SCHEDULES, JSON.stringify(schedules));

    return invoices.length < initialLen;
  },

  // ACTIONS & VALIDATIONS
  validate: async (invoiceId: number): Promise<ApInvoiceModel> => {
    await delay();
    initializeMockDB();
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const lines: ApInvoiceLineModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_LINES) || "[]").filter((x: any) => x.invoiceId === invoiceId);
    const distributions: ApInvoiceDistributionModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_DISTRIBUTIONS) || "[]").filter((x: any) => x.invoiceId === invoiceId);
    const matches: ApInvoiceMatchModel[] = JSON.parse(localStorage.getItem(KEYS.MATCHES) || "[]").filter((x: any) => x.invoiceId === invoiceId);
    const mockPOs: MockPurchaseOrderModel[] = JSON.parse(localStorage.getItem(KEYS.MOCK_POS) || "[]");

    const inv = invoices.find((x) => x.invoiceId === invoiceId);
    if (!inv) throw new Error("Invoice not found");

    const oldStatus = inv.status;
    let holds: string[] = [];

    // Rule 1: Tổng tiền các dòng phân bổ phải bằng tổng tiền Invoice Amount
    const distTotal = distributions.reduce((sum, x) => sum + x.amount, 0);
    if (distTotal !== inv.invoiceAmount) {
      holds.push("AMT_DIST");
    }

    // Rule 2: Kiểm tra chênh lệch So khớp PO (nếu có)
    for (const match of matches) {
      // Tìm dòng PO để đối chiếu
      const po = mockPOs.find((p) => p.poHeaderId === match.poHeaderId);
      const poLine = po?.lines.find((pl) => pl.poLineId === match.poLineId);

      if (poLine) {
        // Kiểm tra số lượng đặt
        const remainingQtyToBill = poLine.qtyReceived - poLine.qtyBilled;
        if (match.qtyInvoiced && match.qtyInvoiced > remainingQtyToBill) {
          holds.push("QTY_ORD");
        }
        // Kiểm tra đơn giá
        if (match.unitPrice && poLine.unitPrice && match.unitPrice > poLine.unitPrice) {
          holds.push("PRICE_ERR");
        }
      }
    }

    // Ghi nhận holds
    let currentHolds: ApInvoiceHoldModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_HOLDS) || "[]");
    // Xóa các holds của invoice này trước khi quét lại
    currentHolds = currentHolds.filter((x) => x.invoiceId !== invoiceId || x.status === "RELEASED");

    if (holds.length > 0) {
      let holdId = currentHolds.length > 0 ? Math.max(...currentHolds.map((x) => x.invoiceHoldId)) + 1 : 1;
      holds.forEach((code) => {
        // Tránh tạo hold trùng lặp nếu chưa được giải tỏa
        if (!currentHolds.some((h) => h.invoiceId === invoiceId && h.holdCode === code && h.status === "HELD")) {
          currentHolds.push({
            invoiceHoldId: holdId++,
            invoiceId,
            holdCode: code,
            holdDate: new Date().toISOString(),
            heldBy: 1,
            status: "HELD"
          });
        }
      });
      inv.status = "NEEDS_REVALIDATION";
      localStorage.setItem(KEYS.INVOICE_HOLDS, JSON.stringify(currentHolds));

      apInvoiceService.logAction(
        invoiceId,
        "INVOICE",
        "HOLD",
        1,
        oldStatus,
        "NEEDS_REVALIDATION",
        `Hóa đơn bị giữ nợ do các lỗi: ${holds.join(", ")}`
      );
    } else {
      inv.status = "APPROVED";
      apInvoiceService.logAction(invoiceId, "INVOICE", "APPROVE", 1, oldStatus, "APPROVED", "Hóa đơn được kiểm tra hợp lệ thành công.");

      // Sinh bút toán kế toán tự động (AP Accounting Event)
      apInvoiceService.postToLedger(inv, lines, distributions);
    }

    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
    return inv;
  },

  getHolds: async (invoiceId: number): Promise<(ApInvoiceHoldModel & ApHoldDefinitionModel)[]> => {
    initializeMockDB();
    const invoiceHolds: ApInvoiceHoldModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_HOLDS) || "[]");
    const holdDefs: ApHoldDefinitionModel[] = JSON.parse(localStorage.getItem(KEYS.HOLD_DEFINITIONS) || "[]");

    return invoiceHolds
      .filter((x) => x.invoiceId === invoiceId)
      .map((h) => {
        const def = holdDefs.find((d) => d.holdCode === h.holdCode) || {
          holdName: "Lỗi giữ nợ không xác định",
          systemFlag: "Y",
          manualReleaseAllowedFlag: "Y",
          activeFlag: "Y"
        };
        return { ...h, ...def };
      });
  },

  releaseHold: async (invoiceHoldId: number, releaseReason: string): Promise<boolean> => {
    await delay();
    initializeMockDB();
    const invoiceHolds: ApInvoiceHoldModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_HOLDS) || "[]");
    const hold = invoiceHolds.find((x) => x.invoiceHoldId === invoiceHoldId);

    if (hold) {
      hold.status = "RELEASED";
      hold.releaseCode = "MANUAL";
      hold.releaseDate = new Date().toISOString();
      hold.releasedBy = 1;
      localStorage.setItem(KEYS.INVOICE_HOLDS, JSON.stringify(invoiceHolds));

      apInvoiceService.logAction(
        hold.invoiceId,
        "INVOICE",
        "RELEASE",
        1,
        "HELD",
        "RELEASED",
        `Giải tỏa giữ nợ thủ công mã lỗi ${hold.holdCode}. Lý do: ${releaseReason}`
      );

      // Thử validate lại xem còn hold nào khác đang HELD không
      const activeHolds = invoiceHolds.filter((x) => x.invoiceId === hold.invoiceId && x.status === "HELD");
      if (activeHolds.length === 0) {
        const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
        const inv = invoices.find((x) => x.invoiceId === hold.invoiceId);
        if (inv) {
          inv.status = "APPROVED";
          localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
          apInvoiceService.logAction(hold.invoiceId, "INVOICE", "APPROVE", 1, "NEEDS_REVALIDATION", "APPROVED", "Tất cả giữ nợ đã được giải tỏa.");
          
          // Sinh hạch toán
          const lines = await apInvoiceService.getLines(inv.invoiceId);
          const dists = await apInvoiceService.getDistributions(inv.invoiceId);
          apInvoiceService.postToLedger(inv, lines, dists);
        }
      }
      return true;
    }
    return false;
  },

  // AUDIT LOG SERVICE
  logAction: (
    documentId: number,
    documentType: "INVOICE" | "PAYMENT",
    actionCode: ApDocumentActionLogModel["actionCode"],
    userId: number,
    oldStatus?: string,
    newStatus?: string,
    note?: string
  ) => {
    const logs: ApDocumentActionLogModel[] = JSON.parse(localStorage.getItem(KEYS.ACTION_LOGS) || "[]");
    const newId = logs.length > 0 ? Math.max(...logs.map((x) => x.actionId)) + 1 : 1;
    logs.push({
      actionId: newId,
      documentType,
      documentId,
      actionCode,
      actionDate: new Date().toISOString(),
      actionBy: userId,
      oldStatus,
      newStatus,
      note
    });
    localStorage.setItem(KEYS.ACTION_LOGS, JSON.stringify(logs));
  },

  getLogs: async (documentId: number, documentType: "INVOICE" | "PAYMENT"): Promise<ApDocumentActionLogModel[]> => {
    initializeMockDB();
    const logs: ApDocumentActionLogModel[] = JSON.parse(localStorage.getItem(KEYS.ACTION_LOGS) || "[]");
    return logs
      .filter((x) => x.documentId === documentId && x.documentType === documentType)
      .sort((a, b) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime());
  },

  // PO MATCH SERVICE
  getMatches: async (invoiceId: number): Promise<ApInvoiceMatchModel[]> => {
    initializeMockDB();
    const list: ApInvoiceMatchModel[] = JSON.parse(localStorage.getItem(KEYS.MATCHES) || "[]");
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  saveMatches: async (invoiceId: number, matchItems: Omit<ApInvoiceMatchModel, "matchId" | "matchDate" | "matchStatus">[]): Promise<void> => {
    await delay();
    initializeMockDB();
    const allMatches: ApInvoiceMatchModel[] = JSON.parse(localStorage.getItem(KEYS.MATCHES) || "[]");
    const mockPOs: MockPurchaseOrderModel[] = JSON.parse(localStorage.getItem(KEYS.MOCK_POS) || "[]");

    // Xóa các matches cũ của invoice này
    const filteredMatches = allMatches.filter((x) => x.invoiceId !== invoiceId);

    let matchId = allMatches.length > 0 ? Math.max(...allMatches.map((x) => x.matchId)) + 1 : 1;
    const newMatches: ApInvoiceMatchModel[] = matchItems.map((item) => {
      // Cập nhật số lượng đã lập hóa đơn (qtyBilled) trong PO ảo
      const po = mockPOs.find((p) => p.poHeaderId === item.poHeaderId);
      const line = po?.lines.find((l) => l.poLineId === item.poLineId);
      if (line && item.qtyInvoiced) {
        line.qtyBilled += item.qtyInvoiced;
      }

      return {
        ...item,
        matchId: matchId++,
        matchDate: new Date().toISOString(),
        matchStatus: "MATCHED"
      };
    });

    localStorage.setItem(KEYS.MATCHES, JSON.stringify([...filteredMatches, ...newMatches]));
    localStorage.setItem(KEYS.MOCK_POS, JSON.stringify(mockPOs));
  },

  getMockPOsForVendor: async (vendorId: number): Promise<MockPurchaseOrderModel[]> => {
    await delay(100);
    initializeMockDB();
    const allPOs: MockPurchaseOrderModel[] = JSON.parse(localStorage.getItem(KEYS.MOCK_POS) || "[]");
    return allPOs.filter((x) => x.vendorId === vendorId);
  },

  // PREPAYMENT APPLICATIONS
  getPrepaymentApplications: async (invoiceId: number): Promise<ApPrepaymentApplicationModel[]> => {
    initializeMockDB();
    const list: ApPrepaymentApplicationModel[] = JSON.parse(localStorage.getItem(KEYS.PREPAYMENT_APPLICATIONS) || "[]");
    return list.filter((x) => x.invoiceId === invoiceId);
  },

  applyPrepayment: async (invoiceId: number, prepaymentInvoiceId: number, amount: number): Promise<boolean> => {
    await delay();
    initializeMockDB();
    const applications: ApPrepaymentApplicationModel[] = JSON.parse(localStorage.getItem(KEYS.PREPAYMENT_APPLICATIONS) || "[]");
    const schedules: ApPaymentScheduleModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENT_SCHEDULES) || "[]");
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");

    const newId = applications.length > 0 ? Math.max(...applications.map((x) => x.applicationId)) + 1 : 1;

    // Trừ số tiền công nợ còn lại trong lịch trả nợ của Hóa đơn Standard
    const sched = schedules.find((x) => x.invoiceId === invoiceId);
    if (sched) {
      sched.amountRemaining = Math.max(0, sched.amountRemaining - amount);
      if (sched.amountRemaining <= 0) {
        sched.status = "PAID";
        const inv = invoices.find((x) => x.invoiceId === invoiceId);
        if (inv) inv.status = "PAID";
      } else {
        sched.status = "PARTIALLY_PAID";
        const inv = invoices.find((x) => x.invoiceId === invoiceId);
        if (inv) inv.status = "PARTIALLY_PAID";
      }
    }

    applications.push({
      applicationId: newId,
      invoiceId,
      prepaymentInvoiceId,
      amountApplied: amount,
      glDate: new Date().toISOString(),
      prepaymentOnInvoiceFlag: "Y",
      applicationType: "APPLY",
      applicationDate: new Date().toISOString(),
      status: "ACTIVE"
    });

    localStorage.setItem(KEYS.PREPAYMENT_APPLICATIONS, JSON.stringify(applications));
    localStorage.setItem(KEYS.PAYMENT_SCHEDULES, JSON.stringify(schedules));
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    apInvoiceService.logAction(invoiceId, "INVOICE", "VALIDATE", 1, "APPROVED", "APPROVED", `Đã cấn trừ tạm ứng số tiền ${amount.toLocaleString()}đ từ Prepay Invoice ID: ${prepaymentInvoiceId}.`);

    return true;
  },

  // SUBLEDGER ACCOUNTING GENERATOR
  postToLedger: (inv: ApInvoiceModel, lines: ApInvoiceLineModel[], dists: ApInvoiceDistributionModel[]) => {
    const events: ApActEventModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENTS) || "[]");
    const headers: ApActEventHeaderModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_HEADERS) || "[]");
    const eventLines: ApActEventLineModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_LINES) || "[]");

    const eventId = events.length > 0 ? Math.max(...events.map((x) => x.eventId)) + 1 : 1;
    const headerId = headers.length > 0 ? Math.max(...headers.map((x) => x.accountingHeaderId)) + 1 : 1;
    let lineId = eventLines.length > 0 ? Math.max(...eventLines.map((x) => x.accountingLineId)) + 1 : 1;

    // 1. Tạo sự kiện hạch toán (AP_ACT_EVENTS)
    events.push({
      eventId,
      eventTypeCode: "INVOICE_APPROVED",
      eventStatus: "ACCOUNTED",
      sourceId: inv.invoiceId,
      sourceTable: "AP_INVOICES"
    });

    // 2. Tạo Header bút toán (AP_ACT_EVENT_HEADERS)
    headers.push({
      accountingHeaderId: headerId,
      eventId,
      ledgerId: 1,
      glDate: inv.glDate,
      description: `Bút toán ghi nhận công nợ hóa đơn ${inv.invoiceNum}`,
      postedFlag: "Y"
    });

    // 3. Tạo các dòng bút toán chi tiết (Debit - Credit)
    // Dòng Credit: Ghi nhận công nợ phải trả (Tài khoản 331)
    eventLines.push({
      accountingLineId: lineId++,
      accountingHeaderId: headerId,
      lineNum: 1,
      accountCcid: 331001, // Phải trả người bán
      creditAmount: inv.invoiceAmount,
      description: `Ghi nhận Phải trả NCC cho Hóa đơn ${inv.invoiceNum}`
    });

    // Dòng Debit: Ghi nhận chi phí mua hàng hoặc hàng hóa tồn kho dựa trên phân bổ
    dists.forEach((dist, idx) => {
      eventLines.push({
        accountingLineId: lineId++,
        accountingHeaderId: headerId,
        lineNum: idx + 2,
        accountCcid: dist.accountCcid, // Tài khoản chi phí đối ứng
        debitAmount: dist.amount,
        description: dist.description || `Phân bổ chi phí hóa đơn dòng ${dist.distributionLineNumber}`
      });
    });

    localStorage.setItem(KEYS.ACT_EVENTS, JSON.stringify(events));
    localStorage.setItem(KEYS.ACT_EVENT_HEADERS, JSON.stringify(headers));
    localStorage.setItem(KEYS.ACT_EVENT_LINES, JSON.stringify(eventLines));
  },

  getAccounting: async (sourceId: number, sourceTable: "AP_INVOICES" | "AP_PAYMENTS"): Promise<{
    event: ApActEventModel;
    header: ApActEventHeaderModel;
    lines: ApActEventLineModel[];
  } | null> => {
    initializeMockDB();
    const events: ApActEventModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENTS) || "[]");
    const headers: ApActEventHeaderModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_HEADERS) || "[]");
    const lines: ApActEventLineModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_LINES) || "[]");

    const event = events.find((x) => x.sourceId === sourceId && x.sourceTable === sourceTable);
    if (!event) return null;

    const header = headers.find((x) => x.eventId === event.eventId);
    if (!header) return null;

    const matchedLines = lines.filter((x) => x.accountingHeaderId === header.accountingHeaderId);

    return { event, header, lines: matchedLines };
  }
};

// 3. PAYMENTS & SETTLEMENTS SERVICE
export const apPaymentService = {
  getAll: async (): Promise<ApPaymentModel[]> => {
    await delay();
    initializeMockDB();
    return JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || "[]");
  },

  getById: async (id: number): Promise<ApPaymentModel | null> => {
    await delay();
    initializeMockDB();
    const list: ApPaymentModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || "[]");
    return list.find((x) => x.paymentId === id) || null;
  },

  getSchedules: async (): Promise<(ApPaymentScheduleModel & { invoiceNum: string; vendorName: string })[]> => {
    await delay(100);
    initializeMockDB();
    const schedules: ApPaymentScheduleModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENT_SCHEDULES) || "[]");
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");
    const vendors: ApVendorModel[] = JSON.parse(localStorage.getItem(KEYS.VENDORS) || "[]");

    return schedules.map((s) => {
      const inv = invoices.find((x) => x.invoiceId === s.invoiceId) || { invoiceNum: "N/A", vendorId: 0 };
      const vendor = vendors.find((x) => x.vendorId === inv.vendorId) || { vendorName: "Không xác định" };
      return {
        ...s,
        invoiceNum: inv.invoiceNum,
        vendorName: vendor.vendorName
      };
    });
  },

  createPayment: async (
    payment: Omit<ApPaymentModel, "paymentId" | "status" | "createdBy">,
    appliedSchedules: { scheduleId: number; amountPaid: number; discountTaken: number }[]
  ): Promise<ApPaymentModel> => {
    await delay();
    initializeMockDB();
    const payments: ApPaymentModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENTS) || "[]");
    const ipLinks: ApInvoicePaymentModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]");
    const schedules: ApPaymentScheduleModel[] = JSON.parse(localStorage.getItem(KEYS.PAYMENT_SCHEDULES) || "[]");
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");

    const paymentId = payments.length > 0 ? Math.max(...payments.map((x) => x.paymentId)) + 1 : 500;
    const newPayment: ApPaymentModel = {
      ...payment,
      paymentId,
      status: "CONFIRMED",
      createdBy: 1
    };
    payments.push(newPayment);

    let ipLinkId = ipLinks.length > 0 ? Math.max(...ipLinks.map((x) => x.invoicePaymentId)) + 1 : 1;

    appliedSchedules.forEach((item) => {
      const sched = schedules.find((x) => x.paymentScheduleId === item.scheduleId);
      if (sched) {
        // Trừ công nợ còn lại trong lịch trả nợ
        sched.amountRemaining = Math.max(0, sched.amountRemaining - (item.amountPaid + item.discountTaken));
        if (sched.amountRemaining <= 0) {
          sched.status = "PAID";
        } else {
          sched.status = "PARTIALLY_PAID";
        }

        // Cập nhật trạng thái Hóa đơn tương ứng
        const inv = invoices.find((x) => x.invoiceId === sched.invoiceId);
        if (inv) {
          // Tính tổng số dư còn lại của tất cả schedules của hóa đơn này
          const allInvScheds = schedules.filter((x) => x.invoiceId === inv.invoiceId);
          const totalRemaining = allInvScheds.reduce((sum, s) => sum + s.amountRemaining, 0);
          if (totalRemaining <= 0) {
            inv.status = "PAID";
          } else {
            inv.status = "PARTIALLY_PAID";
          }
        }

        // Tạo liên kết đối trừ hóa đơn - thanh toán (AP_INVOICE_PAYMENTS)
        ipLinks.push({
          invoicePaymentId: ipLinkId++,
          paymentId,
          invoiceId: sched.invoiceId,
          paymentScheduleId: item.scheduleId,
          amountApplied: item.amountPaid,
          discountTaken: item.discountTaken
        });

        // Ghi nhật ký kiểm toán cho hóa đơn đó
        apInvoiceService.logAction(
          sched.invoiceId,
          "INVOICE",
          "PAY",
          1,
          "APPROVED",
          inv?.status || "APPROVED",
          `Thanh toán hóa đơn. Phiếu chi: ${newPayment.paymentNum}. Số tiền: ${item.amountPaid.toLocaleString()}đ.`
        );
      }
    });

    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
    localStorage.setItem(KEYS.INVOICE_PAYMENTS, JSON.stringify(ipLinks));
    localStorage.setItem(KEYS.PAYMENT_SCHEDULES, JSON.stringify(schedules));
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));

    // Sinh hạch toán chi tiền kế toán (Debit 331, Credit 1121)
    apPaymentService.postPaymentToLedger(newPayment);

    // Ghi nhật ký kiểm toán cho phiếu chi
    apInvoiceService.logAction(paymentId, "PAYMENT", "APPROVE", 1, "DRAFT", "CONFIRMED", `Lập phiếu chi ngân hàng thành công.`);

    return newPayment;
  },

  postPaymentToLedger: (pmt: ApPaymentModel) => {
    const events: ApActEventModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENTS) || "[]");
    const headers: ApActEventHeaderModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_HEADERS) || "[]");
    const eventLines: ApActEventLineModel[] = JSON.parse(localStorage.getItem(KEYS.ACT_EVENT_LINES) || "[]");

    const eventId = events.length > 0 ? Math.max(...events.map((x) => x.eventId)) + 1 : 1;
    const headerId = headers.length > 0 ? Math.max(...headers.map((x) => x.accountingHeaderId)) + 1 : 1;
    let lineId = eventLines.length > 0 ? Math.max(...eventLines.map((x) => x.accountingLineId)) + 1 : 1;

    events.push({
      eventId,
      eventTypeCode: "PAYMENT_CONFIRMED",
      eventStatus: "ACCOUNTED",
      sourceId: pmt.paymentId,
      sourceTable: "AP_PAYMENTS"
    });

    headers.push({
      accountingHeaderId: headerId,
      eventId,
      ledgerId: 1,
      glDate: pmt.glDate,
      description: `Bút toán ghi nhận chi trả nợ phiếu chi ${pmt.paymentNum}`,
      postedFlag: "Y"
    });

    // Bút toán Debit: Nợ Phải trả cho người bán (Tài khoản 331)
    eventLines.push({
      accountingLineId: lineId++,
      accountingHeaderId: headerId,
      lineNum: 1,
      accountCcid: 331001,
      debitAmount: pmt.amount,
      description: `Thanh toán công nợ phải trả NCC cho phiếu chi ${pmt.paymentNum}`
    });

    // Bút toán Credit: Có tài khoản tiền gửi ngân hàng (Tài khoản 112)
    eventLines.push({
      accountingLineId: lineId++,
      accountingHeaderId: headerId,
      lineNum: 2,
      accountCcid: 112001, // Tiền gửi Vietcombank
      creditAmount: pmt.amount,
      description: `Chi tài khoản Vietcombank cho phiếu chi ${pmt.paymentNum}`
    });

    localStorage.setItem(KEYS.ACT_EVENTS, JSON.stringify(events));
    localStorage.setItem(KEYS.ACT_EVENT_HEADERS, JSON.stringify(headers));
    localStorage.setItem(KEYS.ACT_EVENT_LINES, JSON.stringify(eventLines));
  },

  getInvoicePayments: async (paymentId: number): Promise<(ApInvoicePaymentModel & { invoiceNum: string })[]> => {
    initializeMockDB();
    const list: ApInvoicePaymentModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICE_PAYMENTS) || "[]");
    const invoices: ApInvoiceModel[] = JSON.parse(localStorage.getItem(KEYS.INVOICES) || "[]");

    return list
      .filter((x) => x.paymentId === paymentId)
      .map((item) => {
        const inv = invoices.find((x) => x.invoiceId === item.invoiceId) || { invoiceNum: "N/A" };
        return {
          ...item,
          invoiceNum: inv.invoiceNum
        };
      });
  }
};
