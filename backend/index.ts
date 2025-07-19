import path from 'path'
import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import schema from './graphql/schema.ts'
import context, { type Context } from './graphql/context.ts'

const app = express()
const httpServer = http.createServer(app)
const port = process.env.PORT ?? 4000

app.use(compression())

app.use(
  express.static(path.join(import.meta.dirname, 'frontend'), {
    maxAge: '30 days',
  })
)

app.get('/', (_, res) => {
  res.sendFile(path.join(import.meta.dirname, 'frontend', 'index.html'))
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
      bodyParser.json(),
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
