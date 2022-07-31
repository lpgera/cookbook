import path from 'path'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'

const app = express()
const port = process.env.PORT ?? 4000

app.use(
  express.static(path.join(__dirname, 'frontend'), {
    maxAge: '30 days',
  })
)
app.get('/', function (_, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
})

const apolloServer = new ApolloServer({ resolvers, typeDefs })

apolloServer
  .start()
  .then(() => {
    apolloServer.applyMiddleware({ app })

    app.listen({ port }, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
