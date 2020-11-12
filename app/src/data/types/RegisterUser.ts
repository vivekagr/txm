/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_registerUser_user {
  __typename: "User";
  id: number;
}

export interface RegisterUser_registerUser {
  __typename: "RegisterUserPayload";
  user: RegisterUser_registerUser_user | null;
}

export interface RegisterUser {
  /**
   * User registration function, returns user object.
   */
  registerUser: RegisterUser_registerUser | null;
}

export interface RegisterUserVariables {
  username: string;
  name: string;
  password: string;
}
