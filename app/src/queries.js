import { gql } from 'apollo-boost';

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
    {
      accounts(orderBy: ID_DESC) {
        totalCount
        nodes {
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
      }
    }
    `,
    ADD: gql`
    mutation addAccount($bank: String!, $number: String!, $accountTypeId: Int!, $currencyId: Int!) {
      createAccount(input: { account: {
        bank: $bank, number: $number, accountTypeId: $accountTypeId, currencyId: $currencyId
      } }) {
        account {
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
              name
            }
          }
        }
      }
    }
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
