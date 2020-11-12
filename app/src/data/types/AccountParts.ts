/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AccountParts
// ====================================================

export interface AccountParts_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface AccountParts_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface AccountParts {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: AccountParts_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: AccountParts_currency | null;
}
