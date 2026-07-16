export interface GlSetOfBook {
  setOfBooksId: number;
  name: string;
  shortName: string | null;
  currencyCode: string;
  chartOfAccountsId: number | null;
  periodSetName: string | null;
  enabledFlag: string;
  creationDate: string;
  createdBy: number;
}

export interface HrOperatingUnit {
  orgId: number;
  name: string;
  setOfBooksId: number;
  taxCode: string | null;
  address: string | null;
  enabledFlag: string;
  creationDate: string;
  createdBy: number;
  setOfBooksName?: string; // Tên bộ sổ (navigation property)
}
