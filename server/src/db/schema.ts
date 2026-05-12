import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortUrl: varchar('short_url', { length: 100 }).notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
