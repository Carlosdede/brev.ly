import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { asc } from 'drizzle-orm'
import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { db } from '../db/connection'
import { links } from '../db/schema'

function buildCsv(rows: typeof links.$inferSelect[]): string {
  const header = 'URL Original,URL Encurtada,Acessos,Data de Criação\n'
  const body = rows
    .map(
      (r) =>
        `"${r.originalUrl}","${r.shortUrl}",${r.accessCount},"${r.createdAt.toISOString()}"`
    )
    .join('\n')
  return header + body
}

export async function exportCsvRoute(app: FastifyInstance) {
  app.post('/links/export', async (_request, reply) => {
    const allLinks = await db
      .select()
      .from(links)
      .orderBy(asc(links.createdAt))

    const csv = buildCsv(allLinks)
    const fileName = `links-${randomUUID()}.csv`

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    })

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET!,
        Key: fileName,
        Body: csv,
        ContentType: 'text/csv',
      })
    )

    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`

    return reply.send({ url: publicUrl })
  })
}
