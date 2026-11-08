// Lu par drizzle-kit pour générer les migrations : ce fichier n'importe que drizzle-orm.
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const sportEvents = pgTable(
  'sport_events',
  {
    id: uuid('id').primaryKey(),
    // Le sport et le statut sont vérifiés par les schémas partagés à la lecture (mapper).
    sport: varchar('sport', { length: 50 }).notNull(),
    name: varchar('name', { length: 150 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    // Une finale attribue des médailles ; une manche ou une demi-finale, non.
    awardsMedals: boolean('awards_medals').notNull().default(false),
    startsAt: timestamp('starts_at', { withTimezone: true, precision: 3 }).notNull(),
  },
  (table) => [uniqueIndex('sport_events_identity_key').on(table.sport, table.name, table.startsAt)],
);

export const sportEventEntries = pgTable(
  'sport_event_entries',
  {
    id: uuid('id').primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => sportEvents.id, { onDelete: 'cascade' }),
    nationCode: varchar('nation_code', { length: 2 }).notNull(),
    nationName: varchar('nation_name', { length: 100 }).notNull(),
    competitor: varchar('competitor', { length: 150 }).notNull(),
    rank: integer('rank'),
    performance: varchar('performance', { length: 50 }),
    mention: varchar('mention', { length: 20 }),
  },
  (table) => [
    uniqueIndex('sport_event_entries_competitor_key').on(table.eventId, table.competitor),
    // Une participation a soit un rang et une performance, soit une mention seule.
    check(
      'sport_event_entries_rank_or_mention',
      sql`(${table.rank} IS NOT NULL AND ${table.performance} IS NOT NULL AND ${table.mention} IS NULL)
        OR (${table.rank} IS NULL AND ${table.performance} IS NULL AND ${table.mention} IS NOT NULL)`,
    ),
  ],
);

export type SportEventRow = typeof sportEvents.$inferSelect;
export type SportEventEntryRow = typeof sportEventEntries.$inferSelect;
