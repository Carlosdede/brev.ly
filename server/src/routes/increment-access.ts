import { eq, sql } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/connection'
import { links } from '../db/schema'

export async function incrementAccessRoute(app: FastifyInstance) {
  app.patch('/links/:id/access', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const [updated] = await db
      .update(links)
      .set({
        accessCount: sql`${links.accessCount} + 1`,
      })
      .where(eq(links.id, id))
      .returning()

    if (!updated) {
      return reply.status(404).send({ message: 'Link não encontrado' })
    }

    return reply.send({ link: updated })
  })
}
