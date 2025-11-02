import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { parseIntoClientConfig } from 'pg-connection-string'
import type { DB } from './db.types.gen.ts'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

const dialect = new PostgresDialect({
  pool: new Pool({
    ...parseIntoClientConfig(databaseUrl),
    max: 10,
  }),
})

const db = new Kysely<DB>({
  dialect,
})

export default db
