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

const QUERIES = {
  ACCOUNT_TYPES: {
    ALL: gql`
      {
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
      {
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
      query allAccounts {
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
      mutation createAccount($bank: String!, $number: String!, $accountTypeId: Int!, $currencyId: Int!) {
        createAccount(input: { bank: $bank, number: $number, accountTypeId: $accountTypeId, currencyId: $currencyId }) {
          account {
            ...AccountParts
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    UPDATE: gql`
      mutation updateAccount($id: Int!, $bank: String, $number: String, $accountTypeId: Int, $currencyId: Int) {
        updateAccount(input: { id: $id, patch: { bank: $bank, number: $number, accountTypeId: $accountTypeId, currencyId: $currencyId } }) {
          account {
            ...AccountParts
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    ONE: gql`
      query accountById($id: Int!) {
        account(id: $id) {
          ...AccountParts
        }
      }
      ${ACCOUNT_FRAGMENT}
    `
  },

  TRANSACTION: {
    SEARCH: gql`
      query transactionsSearch($accountId: Int, $searchQuery: String) {
        transactionsSearch(accountId: $accountId, searchQuery: $searchQuery) {
          totalCount
          nodes {
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
            narrationText
            notes
            referenceText
            transactionCategory {
              name
              id
            }
          }
        }
      }
    `
  },

  TRANSACTION_IMPORTS: {
    ALL: gql`
      query allTransactionImports {
        transactionImports(orderBy: ID_DESC) {
          nodes {
            id
            ts
            transactions {
              totalCount
            }
            account {
              id
              bank
              number
              accountType {
                id
                name
              }
            }
          }
        }
      }
    `,
    ONE: gql`
      query transactionById($id: Int!) {
        transactionImport(id: $id) {
          id
          account {
            ...AccountParts
          }
          transactions {
            totalCount
            nodes {
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
          }
        }
      }
      ${ACCOUNT_FRAGMENT}
    `,
    ADD: gql`
      mutation importTransactions($accountId: Int!, $transactions: [TransactionTypeInput!]!) {
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
