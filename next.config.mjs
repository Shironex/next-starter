import { createJiti } from 'jiti'
import nextRoutes from 'nextjs-routes/config'
import { fileURLToPath } from 'node:url'

const withRoutes = nextRoutes()
const jiti = createJiti(fileURLToPath(import.meta.url))
await jiti.import('./src/env/server.ts', { default: true })
await jiti.import('./src/env/client.ts', { default: true })

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

export default withRoutes(nextConfig)
