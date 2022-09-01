import { paymentCardItems } from '@/lib/gql/fragments/paymentCardItems'

const createCustomerAccountContact = /* GraphQL */ `
  mutation createCustomerAccountCard($accountId: Int!, $cardInput: CardInput) {
    createCustomerAccountCard(accountId: $accountId, cardInput: $cardInput) {
      ...customerAccountCardItems
    }
  }
  ${paymentCardItems}
`

export default createCustomerAccountContact
