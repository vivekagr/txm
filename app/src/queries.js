import { gql } from '@apollo/client';

const ACCOUNT_FRAGMENT = gql`
  fragment AccountParts on Account {
    id
    bank
    number
    accountType {
      id
      name
    }
    currency {
      id
      code
      name
    }
  }
`

const TRANSACTION_FRAGMENT = gql`
  fragment TransactionParts on Transaction {
    id
    amount
    date
    fxAmount
    fxCurrency {
      id
      code
      name
    }
    isCredit
    referenceText
    narrationText
    notes
    transactionCategory {
      id
      name
    }
  }
`

const QUERIES = {
  AUTHENTICATE: gql`
    mutation Authenticate($username: String!, $password: String!) {
      authenticate(input: {username: $username, password: $password}) {
        jwtToken
      }
    }
  `,

  ACCOUNT_TYPES: {
    ALL: gql`
      query AccountTypes {
        accountTypes {
          nodes {
            id
            name
          }
        }
      }
    `
  },

  CURRENCIES: {
    ALL: gql`
      query Currencies {
        currencies {
          totalCount
          nodes {
            id
            code
            name
          }
        }
      }
    `
  },

  ACCOUNTS: {
    ALL: gql`
      query Accounts {
        accounts(orderBy: ID_DESC) {
          totalCount
          nodes {
            ...AccountParts
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    CREATE: gql`
      mutation CreateAccount($bank: String!, $number: String!, $accountTypeId: Int!, $currencyId: Int!) {
        createAccount(input: { bank: $bank, number: $number, accountTypeId: $accountTypeId, currencyId: $currencyId }) {
          account {
            ...AccountParts
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    UPDATE: gql`
      mutation UpdateAccount($id: Int!, $bank: String, $number: String, $accountTypeId: Int, $currencyId: Int) {
        updateAccount(input: { id: $id, patch: { bank: $bank, number: $number, accountTypeId: $accountTypeId, currencyId: $currencyId } }) {
          account {
            ...AccountParts
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    ONE: gql`
      query Account($id: Int!) {
        account(id: $id) {
          ...AccountParts
        }
      }
      ${ACCOUNT_FRAGMENT}
    `
  },

  TRANSACTION: {
    SEARCH: gql`
      query TransactionsSearch($accountId: Int, $searchQuery: String) {
        transactionsSearch(accountId: $accountId, searchQuery: $searchQuery) {
          totalCount
          nodes {
            ...TransactionParts
          }
        }
      }
      ${TRANSACTION_FRAGMENT}
    `
  },

  TRANSACTION_IMPORTS: {
    ALL: gql`
      query TransactionImports {
        transactionImports(orderBy: ID_DESC) {
          nodes {
            id
            ts
            account {
              ...AccountParts
            }
            transactions {
              totalCount
            }
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    ONE: gql`
      query TransactionImport($id: Int!) {
        transactionImport(id: $id) {
          id
          ts
          account {
            ...AccountParts
          }
          transactions {
            totalCount
            nodes {
              ...TransactionParts
            }
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
      ${TRANSACTION_FRAGMENT}
    `,
    ADD: gql`
      mutation ImportTransactions($accountId: Int!, $transactions: [TransactionTypeInput!]!) {
        importTransactions(input: {accountId: $accountId, transactions: $transactions}) {
          transactionImport {
            id
          }
        }
      }
    `
  }
}

export default QUERIES;
