import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  strict: process.env.cypress_test ? false : true,
  schema: './src/lib/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
})
