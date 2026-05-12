import 'dotenv/config'

import cors from '@fastify/cors'
import Fastify from 'fastify'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportCsvRoute } from './routes/export-csv'
import { getOriginalUrlRoute } from './routes/get-original-url'
import { incrementAccessRoute } from './routes/increment-access'
import { listLinksRoute } from './routes/list-links'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: '*',
})

// Routes
await app.register(createLinkRoute)
await app.register(listLinksRoute)
await app.register(getOriginalUrlRoute)
await app.register(deleteLinkRoute)
await app.register(incrementAccessRoute)
await app.register(exportCsvRoute)

const port = Number(process.env.PORT) || 3333

try {
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`🚀 Server running on http://localhost:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
