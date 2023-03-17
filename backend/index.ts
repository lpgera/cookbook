import path from 'path'
import http from 'http'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import schema from './graphql/schema'
import context, { Context } from './graphql/context'

const app = express()
const httpServer = http.createServer(app)
const port = process.env.PORT ?? 4000

app.use(
  express.static(path.join(__dirname, 'frontend'), {
    maxAge: '30 days',
  })
)

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'))
})

const apolloServer = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

apolloServer
  .start()
  .then(() => {
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware(apolloServer, {
        context,
      })
    )

    httpServer.listen({ port }, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
