CREATE TABLE IF NOT EXISTS "links" (
  "id" text PRIMARY KEY NOT NULL,
  "original_url" text NOT NULL,
  "short_url" varchar(100) NOT NULL UNIQUE,
  "access_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now()
);
