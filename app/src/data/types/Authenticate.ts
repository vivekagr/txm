/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Authenticate
// ====================================================

export interface Authenticate_authenticate {
  __typename: "AuthenticatePayload";
  jwtToken: any | null;
}

export interface Authenticate {
  /**
   * User authentication function that returns JWT token, given valid credentials.
   */
  authenticate: Authenticate_authenticate | null;
}

export interface AuthenticateVariables {
  username: string;
  password: string;
}
