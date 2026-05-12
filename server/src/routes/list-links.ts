import { asc } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { db } from '../db/connection'
import { links } from '../db/schema'

export async function listLinksRoute(app: FastifyInstance) {
  app.get('/links', async (_request, reply) => {
    const allLinks = await db
      .select()
      .from(links)
      .orderBy(asc(links.createdAt))

    return reply.send({ links: allLinks })
  })
}
