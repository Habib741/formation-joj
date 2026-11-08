import { continentSchema, sportSlugSchema } from '@joj/shared';
import type { SportEventEntryRow, SportEventRow } from '../../results/infra/results.schema';
import { Medal, medalTypeForRank } from '../domain/medal';
import type { Nation } from '../domain/nation-standings';
import type { NationRow } from './medals.schema';

/** Lignes des tables → domaine. Une valeur inconnue en base est un bug : on échoue tôt. */
export function toMedal(entry: SportEventEntryRow, event: SportEventRow): Medal {
  if (entry.rank === null) throw new RangeError(`La participation ${entry.id} n'a pas de rang.`);
  return Medal.restore({
    id: entry.id,
    type: medalTypeForRank(entry.rank),
    sport: sportSlugSchema.parse(event.sport),
    eventId: event.id,
    eventName: event.name,
    competitor: entry.competitor,
    nationCode: entry.nationCode,
    nationName: entry.nationName,
  });
}

export function toNation(row: NationRow): Nation {
  return { code: row.code, name: row.name, continent: continentSchema.parse(row.continent) };
}
