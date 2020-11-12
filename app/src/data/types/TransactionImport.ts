/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TransactionImport
// ====================================================

export interface TransactionImport_transactionImport_account_accountType {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface TransactionImport_transactionImport_account_currency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface TransactionImport_transactionImport_account {
  __typename: "Account";
  id: number;
  bank: string;
  number: string | null;
  /**
   * Reads a single `AccountType` that is related to this `Account`.
   */
  accountType: TransactionImport_transactionImport_account_accountType | null;
  /**
   * Reads a single `Currency` that is related to this `Account`.
   */
  currency: TransactionImport_transactionImport_account_currency | null;
}

export interface TransactionImport_transactionImport_transactions_nodes_fxCurrency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface TransactionImport_transactionImport_transactions_nodes_transactionCategory {
  __typename: "TransactionCategory";
  id: number;
  name: string;
}

export interface TransactionImport_transactionImport_transactions_nodes {
  __typename: "Transaction";
  id: number;
  amount: number;
  date: any;
  fxAmount: number | null;
  /**
   * Reads a single `Currency` that is related to this `Transaction`.
   */
  fxCurrency: TransactionImport_transactionImport_transactions_nodes_fxCurrency | null;
  isCredit: boolean;
  referenceText: string | null;
  narrationText: string;
  notes: string | null;
  /**
   * Reads a single `TransactionCategory` that is related to this `Transaction`.
   */
  transactionCategory: TransactionImport_transactionImport_transactions_nodes_transactionCategory | null;
}

export interface TransactionImport_transactionImport_transactions {
  __typename: "TransactionsConnection";
  /**
   * The count of *all* `Transaction` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Transaction` objects.
   */
  nodes: TransactionImport_transactionImport_transactions_nodes[];
}

export interface TransactionImport_transactionImport {
  __typename: "TransactionImport";
  id: number;
  ts: any;
  /**
   * Reads a single `Account` that is related to this `TransactionImport`.
   */
  account: TransactionImport_transactionImport_account | null;
  /**
   * Reads and enables pagination through a set of `Transaction`.
   */
  transactions: TransactionImport_transactionImport_transactions;
}

export interface TransactionImport {
  transactionImport: TransactionImport_transactionImport | null;
}

export interface TransactionImportVariables {
  id: number;
}
