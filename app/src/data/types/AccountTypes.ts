/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AccountTypes
// ====================================================

export interface AccountTypes_accountTypes_nodes {
  __typename: "AccountType";
  id: number;
  name: string;
}

export interface AccountTypes_accountTypes {
  __typename: "AccountTypesConnection";
  /**
   * A list of `AccountType` objects.
   */
  nodes: AccountTypes_accountTypes_nodes[];
}

export interface AccountTypes {
  /**
   * Reads and enables pagination through a set of `AccountType`.
   */
  accountTypes: AccountTypes_accountTypes | null;
}
