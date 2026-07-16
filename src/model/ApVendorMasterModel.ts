export interface ApVendor {
  vendorId: number;
  vendorName: string;
  segment1: string;
  taxRegistrationNum: string | null;
  enabledFlag: string;
  creationDate: string;
  createdBy: number;
}

export interface ApVendorAddress {
  addressId: number;
  vendorId: number;
  addressType: string | null;    // "BILLING" | "SHIPPING" | "PRIMARY"
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  isPrimary: string;             // "Y" | "N"
  enabledFlag: string;           // "Y" | "N"
  creationDate: string;
  createdBy: number;
  vendorName?: string;           // Navigation property
}

export interface ApVendorSite {
  vendorSiteId: number;
  vendorId: number;
  vendorSiteCode: string;
  addressLine1: string | null;
  phone: string | null;
  email: string | null;
  bankAccountNum: string | null;
  bankName: string | null;
  defaultTermsId: number | null;
  defaultPayablesCcid: number | null;
  enabledFlag: string;           // "Y" | "N"
  vendorName?: string;           // Navigation property
}

export interface ApVendorSiteAccount {
  siteAccountId: number;
  vendorSiteId: number;
  ledgerId: number | null;
  legalEntityId: number | null;
  liabilityCcid: number | null;
  prepaymentCcid: number | null;
  billsPayableCcid: number | null;
  distributionSetId: number | null;
  status: string | null;
  vendorSiteCode?: string;       // Navigation property
  vendorName?: string;           // Navigation property
}

export interface ApVendorMergeHistory {
  mergeId: number;
  fromVendorId: number;
  fromVendorSiteId: number | null;
  toVendorId: number;
  toVendorSiteId: number | null;
  invoiceScope: string | null;    // "ALL" | "UNPAID"
  poMergeFlag: string | null;     // "Y" | "N"
  mergeDate: string | null;
  fromVendorName?: string;        // Navigation property
  fromVendorSiteCode?: string;    // Navigation property
  toVendorName?: string;          // Navigation property
  toVendorSiteCode?: string;      // Navigation property
}
