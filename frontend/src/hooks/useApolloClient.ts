import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
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
    link: from([
      onError(({ graphQLErrors, networkError }) => {
        if (
          graphQLErrors?.some((err) =>
            err.message.includes(
              'You must be logged in to access this resource.'
            )
          )
        ) {
          setToken('')
        }
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`)
        }
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
