/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import type { TransactionTypeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ImportTransactions
// ====================================================

export interface ImportTransactions_importTransactions_transactionImport {
  __typename: "TransactionImport";
  id: number;
}

export interface ImportTransactions_importTransactions {
  __typename: "ImportTransactionsPayload";
  transactionImport: ImportTransactions_importTransactions_transactionImport | null;
}

export interface ImportTransactions {
  importTransactions: ImportTransactions_importTransactions | null;
}

export interface ImportTransactionsVariables {
  accountId: number;
  transactions: TransactionTypeInput[];
}
