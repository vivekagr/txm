/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Account
// ====================================================

export interface Account_account_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface Account_account_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface Account_account {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: Account_account_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: Account_account_currency | null;
}

export interface Account {
  account: Account_account | null;
}

export interface AccountVariables {
  id: number;
}
