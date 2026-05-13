import { eq, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/connection.js'
import { links } from '../db/schema.js'

export async function getOriginalUrlRoute(app: FastifyInstance) {
  app.get('/links/:shortUrl', async (request, reply) => {
    const paramsSchema = z.object({
      shortUrl: z.string(),
    })

    const { shortUrl } = paramsSchema.parse(request.params)

    const [link] = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1)

    if (!link) {
      return reply.status(404).send({ message: 'Link não encontrado' })
    }

    return reply.send({ link })
  })
}
