/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Currencies
// ====================================================

export interface Currencies_currencies_nodes {
  __typename: "Currency";
  id: number;
  code: string;
  name: string;
}

export interface Currencies_currencies {
  __typename: "CurrenciesConnection";
  /**
   * The count of *all* `Currency` you could get from the connection.
   */
  totalCount: number;
  /**
   * A list of `Currency` objects.
   */
  nodes: Currencies_currencies_nodes[];
}

export interface Currencies {
  /**
   * Reads and enables pagination through a set of `Currency`.
   */
  currencies: Currencies_currencies | null;
}
