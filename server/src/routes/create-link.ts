import { eq } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '../db/connection'
import { links } from '../db/schema'

export async function createLinkRoute(app: FastifyInstance) {
  app.post('/links', async (request, reply) => {
    const bodySchema = z.object({
      originalUrl: z.string().url({ message: 'URL original inválida' }),
      shortUrl: z
        .string()
        .min(3, 'URL encurtada deve ter pelo menos 3 caracteres')
        .max(20, 'URL encurtada deve ter no máximo 20 caracteres')
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          'URL encurtada deve conter apenas letras, números, hífens ou underscores'
        ),
    })

    const result = bodySchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({
        message: 'Dados inválidos',
        errors: result.error.flatten().fieldErrors,
      })
    }

    const { originalUrl, shortUrl } = result.data

    const existing = await db
      .select()
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .limit(1)

    if (existing.length > 0) {
      return reply.status(409).send({ message: 'URL encurtada já existe' })
    }

    const [link] = await db
      .insert(links)
      .values({
        id: randomUUID(),
        originalUrl,
        shortUrl,
      })
      .returning()

    return reply.status(201).send({ link })
  })
}
