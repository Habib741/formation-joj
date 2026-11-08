import { randomUUID } from 'node:crypto';
import type { SportSlug } from '@joj/shared';
import { describe, expect, it } from 'vitest';
import { SportEvent } from '../domain/sport-event';
import { InMemorySportEventRepository } from './testing/in-memory-sport-event.repository';
import { ListDayResults } from './use-cases/list-day-results';

function sportEvent(sport: SportSlug, name: string, startsAt: string): SportEvent {
  return SportEvent.restore({
    id: randomUUID(),
    sport,
    name,
    startsAt: new Date(startsAt),
    status: 'scheduled',
    entries: [],
  });
}

describe('results (application layer)', () => {
  it('001-AS1: lists only the events of the requested day, by sport then by time', async () => {
    const futsal = sportEvent('futsal', 'Demi-finale', '2026-11-08T09:00:00.000Z');
    const lateRace = sportEvent('athletisme', '100 m, finale', '2026-11-08T18:32:00.000Z');
    const earlyRace = sportEvent('athletisme', '3 000 m', '2026-11-08T10:00:00.000Z');
    const nextDay = sportEvent('athletisme', 'Relais', '2026-11-09T00:00:00.000Z');
    const repository = new InMemorySportEventRepository([futsal, lateRace, earlyRace, nextDay]);

    const events = await new ListDayResults(repository).execute({ date: '2026-11-08' });

    expect(events.map((event) => event.name)).toEqual(['3 000 m', '100 m, finale', 'Demi-finale']);
  });
});
