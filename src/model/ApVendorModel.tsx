export interface ApVendorModel {
  vendorId: number;
  vendorName: string;
  segment1: string; // Mã nhà cung cấp (Vendor Code)
  taxRegistrationNum: string | null;
  enabledFlag: "Y" | "N";
  vendorType: "ORGANIZATION" | "PERSONAL" | "EMPLOYEE";
  dunsNumber: string | null;
  employeeNumber: string | null;
  creationDate: string;
  createdBy: number;
  used?: boolean;
}

export interface ApVendorAddressModel {
  addressId: number;
  vendorId: number;
  countryCode: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  addressName?: string;
  phone?: string;
  email?: string;
  purchasingFlag: "Y" | "N";
  paymentFlag: "Y" | "N";
  status: string; // 'ACTIVE' | 'INACTIVE'
}

export interface ApVendorSiteModel {
  vendorSiteId: number;
  vendorId: number;
  vendorSiteCode: string;
  addressLine1?: string;
  phone?: string;
  email?: string;
  enabledFlag: "Y" | "N";
  addressId?: number;
  operatingUnitId?: number;
  purchasingFlag?: "Y" | "N";
  paymentFlag?: "Y" | "N";
  rfqOnlyFlag?: "Y" | "N";
  primaryPayFlag?: "Y" | "N";
  inactiveDate?: string;
  bankAccountId?: number;
  distributionSetId?: number;
}

export interface ApVendorSiteAccountModel {
  siteAccountId: number;
  vendorSiteId: number;
  ledgerId?: number;
  legalEntityId?: number;
  liabilityCcid?: number;
  prepaymentCcid?: number;
  billsPayableCcid?: number;
  distributionSetId?: number;
  status?: string;
}
