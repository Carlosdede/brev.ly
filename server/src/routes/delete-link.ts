import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { db } from '../db/connection.js'
import { links } from '../db/schema.js'

export async function deleteLinkRoute(app: FastifyInstance) {
  app.delete('/links/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const [deleted] = await db
      .delete(links)
      .where(eq(links.id, id))
      .returning()

    if (!deleted) {
      return reply.status(404).send({ message: 'Link não encontrado' })
    }

    return reply.status(204).send()
  })
}
