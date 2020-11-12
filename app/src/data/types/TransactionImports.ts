/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TransactionImports
// ====================================================

export interface TransactionImports_transactionImports_nodes_account_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface TransactionImports_transactionImports_nodes_account_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface TransactionImports_transactionImports_nodes_account {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: TransactionImports_transactionImports_nodes_account_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: TransactionImports_transactionImports_nodes_account_currency | null;
}

export interface TransactionImports_transactionImports_nodes_transactions {
  __typename: "TransactionsConnection";
  /**
   * The count of *all* `Transaction` you could get from the connection.
   */
  totalCount: number;
}

export interface TransactionImports_transactionImports_nodes {
  __typename: "TransactionImport";
  id: number;
  ts: any;
  /**
   * Reads a single `Account` that is related to this `TransactionImport`.
   */
  account: TransactionImports_transactionImports_nodes_account | null;
  /**
   * Reads and enables pagination through a set of `Transaction`.
   */
  transactions: TransactionImports_transactionImports_nodes_transactions;
}

export interface TransactionImports_transactionImports {
  __typename: "TransactionImportsConnection";
  /**
   * A list of `TransactionImport` objects.
   */
  nodes: TransactionImports_transactionImports_nodes[];
}

export interface TransactionImports {
  /**
   * Reads and enables pagination through a set of `TransactionImport`.
   */
  transactionImports: TransactionImports_transactionImports | null;
}
