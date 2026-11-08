import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { sportEventListSchema } from '@joj/shared';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Database } from '../src/core/database/database';
import { DATABASE } from '../src/core/database/database.module';
import { sportEventEntries, sportEvents } from '../src/modules/results/infra/results.schema';
import { createTestApp } from './create-test-app';

const finalId = randomUUID();
const scheduledId = randomUUID();

describe('/api/results (e2e)', () => {
  let app: INestApplication;
  const api = () => request(app.getHttpServer());

  beforeAll(async () => {
    app = await createTestApp();
    const db = app.get<Database>(DATABASE);
    await db.insert(sportEvents).values([
      {
        id: finalId,
        sport: 'athletisme',
        name: '100 m hommes, finale',
        status: 'finished',
        startsAt: new Date('2026-11-08T18:32:00.000Z'),
      },
      {
        id: scheduledId,
        sport: 'futsal',
        name: 'Demi-finale',
        status: 'scheduled',
        startsAt: new Date('2026-11-08T20:00:00.000Z'),
      },
    ]);
    await db.insert(sportEventEntries).values({
      id: randomUUID(),
      eventId: finalId,
      nationCode: 'ke',
      nationName: 'Kenya',
      competitor: 'Gift Bright',
      rank: 1,
      performance: '10,28 s',
    });
  });

  afterAll(() => app?.close());

  it('001-AS2: applies the sport filter', async () => {
    const response = await api()
      .get('/api/results')
      .query({ date: '2026-11-08', sport: 'futsal' })
      .expect(200);

    expect(sportEventListSchema.parse(response.body).map((event) => event.id)).toEqual([
      scheduledId,
    ]);
  });

  it('001-AS2: rejects an unknown sport (400, RFC 9457)', async () => {
    const response = await api()
      .get('/api/results')
      .query({ date: '2026-11-08', sport: 'quidditch' })
      .expect(400);

    expect(response.body).toMatchObject({ status: 400, code: 'VALIDATION_FAILED' });
  });

  it('001-AS3: returns the rank, nation, competitor and performance of a finished event', async () => {
    const response = await api().get('/api/results').query({ date: '2026-11-08' }).expect(200);

    expect(sportEventListSchema.parse(response.body)[0]).toEqual({
      id: finalId,
      sport: 'athletisme',
      name: '100 m hommes, finale',
      startsAt: '2026-11-08T18:32:00.000Z',
      status: 'finished',
      ranking: [
        {
          rank: 1,
          nationCode: 'ke',
          nationName: 'Kenya',
          competitor: 'Gift Bright',
          performance: '10,28 s',
          mention: null,
        },
      ],
    });
  });
});
