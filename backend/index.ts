import { ApolloServer } from 'apollo-server'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'

const server = new ApolloServer({ resolvers, typeDefs })

const port = process.env.PORT ?? 4000

server
  .listen({ port })
  .then(() => {
    console.log(`Server listening on port ${port}`)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
