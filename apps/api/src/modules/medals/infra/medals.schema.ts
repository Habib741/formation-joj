// Lu par drizzle-kit pour générer les migrations : ce fichier n'importe que drizzle-orm.
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const nations = pgTable('nations', {
  code: varchar('code', { length: 2 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  // Le continent est vérifié par le schéma partagé à la lecture (mapper).
  continent: varchar('continent', { length: 20 }).notNull(),
});

export type NationRow = typeof nations.$inferSelect;
