/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateAccount
// ====================================================

export interface UpdateAccount_updateAccount_account_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface UpdateAccount_updateAccount_account_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface UpdateAccount_updateAccount_account {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: UpdateAccount_updateAccount_account_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: UpdateAccount_updateAccount_account_currency | null;
}

export interface UpdateAccount_updateAccount {
  __typename: "UpdateAccountPayload";
  /**
   * The `Account` that was updated by this mutation.
   */
  account: UpdateAccount_updateAccount_account | null;
}

export interface UpdateAccount {
  /**
   * Updates a single `Account` using a unique key and a patch.
   */
  updateAccount: UpdateAccount_updateAccount | null;
}

export interface UpdateAccountVariables {
  id: number;
  bank?: string | null;
  number?: string | null;
  accountTypeId?: number | null;
  currencyId?: number | null;
}
