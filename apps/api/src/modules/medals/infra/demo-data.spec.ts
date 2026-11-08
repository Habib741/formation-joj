import { readFileSync } from 'node:fs';
import { CONTINENTS } from '@joj/shared';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const nationCodesSchema = z.array(z.object({ nation_code: z.string() }));
const nationsSchema = z.array(
  z.object({ code: z.string(), name: z.string(), continent: z.enum(CONTINENTS) }),
);

const sportEventsSchema = z.array(
  z.object({ sport: z.string(), name: z.string(), awards_medals: z.boolean() }),
);

function readDemoData(fileName: string): unknown {
  const url = new URL(`../../../../data/${fileName}`, import.meta.url);
  return JSON.parse(readFileSync(url, 'utf8'));
}

describe('demonstration data', () => {
  it('002-AS1: lists every nation that has a result, so no medal is lost from the standings', () => {
    const entries = nationCodesSchema.parse(readDemoData('02-sport_event_entries.json'));
    const nations = nationsSchema.parse(readDemoData('03-nations.json'));

    const known = new Set(nations.map((nation) => nation.code));
    expect(entries.map((entry) => entry.nation_code).filter((code) => !known.has(code))).toEqual(
      [],
    );
  });

  it('002-AS7: the demonstration sailing heat awards no medal', () => {
    const events = sportEventsSchema.parse(readDemoData('01-sport_events.json'));

    expect(events.filter((event) => event.sport === 'voile')).toEqual([
      expect.objectContaining({ name: 'Planche à voile, première manche', awards_medals: false }),
    ]);
  });
});
