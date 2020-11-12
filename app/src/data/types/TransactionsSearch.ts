/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TransactionsSearch
// ====================================================

export interface TransactionsSearch_transactionsSearch_nodes_fxCurrency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface TransactionsSearch_transactionsSearch_nodes_transactionCategory {
  __typename: "TransactionCategory";
  id: number;
  name: string;
}

export interface TransactionsSearch_transactionsSearch_nodes {
  __typename: "Transaction";
  id: number;
  amount: number;
  date: any;
  fxAmount: number | null;
  /**
   * Reads a single `Currency` that is related to this `Transaction`.
   */
  fxCurrency: TransactionsSearch_transactionsSearch_nodes_fxCurrency | null;
  isCredit: boolean;
  referenceText: string | null;
  narrationText: string;
  notes: string | null;
  /**
   * Reads a single `TransactionCategory` that is related to this `Transaction`.
   */
  transactionCategory: TransactionsSearch_transactionsSearch_nodes_transactionCategory | null;
}

export interface TransactionsSearch_transactionsSearch {
  __typename: "TransactionsConnection";
  /**
   * The count of *all* `Transaction` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Transaction` objects.
   */
  nodes: TransactionsSearch_transactionsSearch_nodes[];
}

export interface TransactionsSearch {
  /**
   * Reads and enables pagination through a set of `Transaction`.
   */
  transactionsSearch: TransactionsSearch_transactionsSearch | null;
}

export interface TransactionsSearchVariables {
  accountId?: number | null;
  searchQuery?: string | null;
}
