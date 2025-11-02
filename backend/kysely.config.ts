import { defineConfig } from 'kysely-ctl'
import kysely from './kysely/db.ts'
import path from 'path'

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: path.join(import.meta.dirname, 'kysely', 'migrations'),
  },
  seeds: {
    seedFolder: path.join(import.meta.dirname, 'kysely', 'seeds'),
  },
})
