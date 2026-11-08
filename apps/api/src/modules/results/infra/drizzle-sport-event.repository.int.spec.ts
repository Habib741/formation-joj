import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type DatabaseConnection, openDatabase } from '../../../core/database/database';
import { DrizzleSportEventRepository } from './drizzle-sport-event.repository';
import { sportEventEntries, sportEvents } from './results.schema';

const finalId = randomUUID();
const scheduledId = randomUUID();

const events = [
  ['futsal', 'Demi-finale', '2026-11-08T09:00:00.000Z', scheduledId],
  ['athletisme', '100 m hommes, finale', '2026-11-08T18:32:00.000Z', finalId],
  ['athletisme', '3 000 m', '2026-11-08T00:00:00.000Z', randomUUID()],
  ['athletisme', 'Veille', '2026-11-07T23:59:59.999Z', randomUUID()],
  ['athletisme', 'Lendemain', '2026-11-09T00:00:00.000Z', randomUUID()],
] as const;

describe('DrizzleSportEventRepository (in-memory PGlite, migrations applied)', () => {
  let connection: DatabaseConnection;
  let repository: DrizzleSportEventRepository;

  beforeAll(async () => {
    connection = openDatabase({ pgliteDataDir: 'memory://' });
    await connection.migrate();
    repository = new DrizzleSportEventRepository(connection.db);

    await connection.db.insert(sportEvents).values(
      events.map(([sport, name, startsAt, id]) => ({
        id,
        sport,
        name,
        status: 'finished',
        startsAt: new Date(startsAt),
      })),
    );
    await connection.db.insert(sportEventEntries).values({
      id: randomUUID(),
      eventId: finalId,
      nationCode: 'ke',
      nationName: 'Kenya',
      competitor: 'Gift Bright',
      rank: 1,
      performance: '10,28 s',
    });
  });

  afterAll(() => connection?.close());

  it('001-AS1: returns only the events of that day, by sport then by time, with their ranking', async () => {
    const found = await repository.listByDay('2026-11-08');

    expect(found.map((event) => event.name)).toEqual([
      '3 000 m',
      '100 m hommes, finale',
      'Demi-finale',
    ]);
    expect(found[1]?.ranking).toEqual([
      {
        rank: 1,
        nationCode: 'ke',
        nationName: 'Kenya',
        competitor: 'Gift Bright',
        performance: '10,28 s',
        mention: null,
      },
    ]);
  });

  it('001-AS2: keeps only the requested sport', async () => {
    const found = await repository.listByDay('2026-11-08', 'athletisme');

    expect(found.map((event) => event.sport)).toEqual(['athletisme', 'athletisme']);
  });

  it('003-AS6: saves and reads a participant registered without a result', async () => {
    await connection.db.insert(sportEventEntries).values({
      id: randomUUID(),
      eventId: scheduledId,
      nationCode: 'sn',
      nationName: 'Sénégal',
      competitor: 'Équipe du Sénégal',
    });

    const found = await repository.listByDay('2026-11-08', 'futsal');

    expect(found[0]?.athletesOf('sn').map((athlete) => athlete.competitor)).toEqual([
      'Équipe du Sénégal',
    ]);
  });

  it('003-AS6: still refuses a rank without a performance', async () => {
    await expect(
      connection.db.insert(sportEventEntries).values({
        id: randomUUID(),
        eventId: scheduledId,
        nationCode: 'br',
        nationName: 'Brésil',
        competitor: 'Équipe du Brésil',
        rank: 1,
      }),
    ).rejects.toThrow('Failed query');
  });
});
