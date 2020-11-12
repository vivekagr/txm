/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Accounts
// ====================================================

export interface Accounts_accounts_nodes_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface Accounts_accounts_nodes_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface Accounts_accounts_nodes {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: Accounts_accounts_nodes_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: Accounts_accounts_nodes_currency | null;
}

export interface Accounts_accounts {
  __typename: "AccountsConnection";
  /**
   * The count of *all* `Account` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Account` objects.
   */
  nodes: Accounts_accounts_nodes[];
}

export interface Accounts {
  /**
   * Reads and enables pagination through a set of `Account`.
   */
  accounts: Accounts_accounts | null;
}
