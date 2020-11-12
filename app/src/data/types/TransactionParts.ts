/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TransactionParts
// ====================================================

export interface TransactionParts_fxCurrency {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface TransactionParts_transactionCategory {
  __typename: "TransactionCategory";
  id: number;
  name: string;
}

export interface TransactionParts {
  __typename: "Transaction";
  id: number;
  amount: number;
  date: any;
  fxAmount: number | null;
  /**
   * Reads a single `Currency` that is related to this `Transaction`.
   */
  fxCurrency: TransactionParts_fxCurrency | null;
  isCredit: boolean;
  referenceText: string | null;
  narrationText: string;
  notes: string | null;
  /**
   * Reads a single `TransactionCategory` that is related to this `Transaction`.
   */
  transactionCategory: TransactionParts_transactionCategory | null;
}
