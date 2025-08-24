import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ErrorLink } from '@apollo/client/link/error'
import useAuth from './useAuth'

export default function useApolloClient() {
  const [token, setToken] = useAuth()

  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only',
      },
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      mutate: {
        fetchPolicy: 'network-only',
      },
    },
    link: ApolloLink.from([
      new ErrorLink(({ error }) => {
        if (
          CombinedGraphQLErrors.is(error) &&
          error.errors?.some((err) =>
            err.message.includes(
              'You must be logged in to access this resource.'
            )
          )
        ) {
          setToken('')
        }
        console.error(error)
      }),
      new HttpLink({
        uri: '/graphql',
        headers: {
          'x-token': token,
        },
      }),
    ]),
  })
}
