export interface CeBank {
  bankId: number;
  countryCode: string;
  bankName: string;
  alternateBankName?: string;
  shortBankName?: string;
  bankNumber?: string;
  taxRegistrationNumber?: string;
  description?: string;
  inactiveDate?: string;
  status: string; // ACTIVE / INACTIVE
}

export interface CeBankBranch {
  branchId: number;
  bankId: number;
  branchName: string;
  alternateBranchName?: string;
  branchNumber?: string;
  branchType?: string;
  addressLine1?: string;
  city?: string;
  description?: string;
  inactiveDate?: string;
  status: string; // ACTIVE / INACTIVE
  bankName?: string; // Navigation property
}

export interface CeBankAccount {
  bankAccountId: number;
  bankId: number;
  branchId?: number;
  legalEntityId: number;
  accountName: string;
  alternateAccountName?: string;
  accountNumber: string;
  currencyCode: string;
  multiCurrencyAllowedFlag?: string; // Y / N
  accountType?: string;
  startDate?: string;
  endDate?: string;
  status: string; // ACTIVE / INACTIVE
  bankName?: string; // Navigation property
  branchName?: string; // Navigation property
}
