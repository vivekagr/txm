import { gql } from 'apollo-boost';

export const ACCOUNT_TYPES = gql`
    {
        accountTypes {
            nodes {
            id
            name
            }
        }
    }
`

export const CURRENCIES = gql`
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
`;

export const ACCOUNTS = gql`
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
`;

export const ADD_ACCOUNT = gql`
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
`;
