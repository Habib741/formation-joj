import { rankingMentionSchema, sportEventStatusSchema, sportSlugSchema } from '@joj/shared';
import { type RankingEntry, SportEvent } from '../domain/sport-event';
import type { SportEventEntryRow, SportEventRow } from './results.schema';

/** Lignes des tables → entité. Une valeur inconnue en base est un bug : on échoue tôt. */
export function toDomain(row: SportEventRow, entryRows: SportEventEntryRow[]): SportEvent {
  return SportEvent.restore({
    id: row.id,
    sport: sportSlugSchema.parse(row.sport),
    name: row.name,
    startsAt: row.startsAt,
    status: sportEventStatusSchema.parse(row.status),
    awardsMedals: row.awardsMedals,
    entries: entryRows.map(toEntry),
  });
}

function toEntry(row: SportEventEntryRow): RankingEntry {
  return {
    rank: row.rank,
    nationCode: row.nationCode,
    nationName: row.nationName,
    competitor: row.competitor,
    performance: row.performance,
    mention: rankingMentionSchema.nullable().parse(row.mention),
  };
}
