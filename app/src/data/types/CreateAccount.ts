/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount_createAccount_account_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface CreateAccount_createAccount_account_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface CreateAccount_createAccount_account {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: CreateAccount_createAccount_account_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: CreateAccount_createAccount_account_currency | null;
}

export interface CreateAccount_createAccount {
  __typename: "CreateAccountPayload";
  account: CreateAccount_createAccount_account | null;
}

export interface CreateAccount {
  createAccount: CreateAccount_createAccount | null;
}

export interface CreateAccountVariables {
  bank: string;
  number: string;
  accountTypeId: number;
  currencyId: number;
}
