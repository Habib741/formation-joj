/**
 * La fausse API tient le même contrat que apps/api : si elle s'en écarte, les tests du front
 * passent contre une API qui n'existe pas. Ces tests l'appellent avec `fetch`, sans React.
 */
import {
  medalListSchema,
  nationAthleteListSchema,
  nationStandingListSchema,
  sportEventListSchema,
} from '@joj/shared';
import { describe, expect, it } from 'vitest';

const results = async (query: string) => {
  const response = await fetch(`http://localhost/api/results?${query}`);
  return { status: response.status, body: (await response.json()) as unknown };
};

describe('mock results API', () => {
  it('001-AS1: lists only the events of the day, by sport then by time', async () => {
    const { status, body } = await results('date=2026-11-08');

    expect(status).toBe(200);
    expect(sportEventListSchema.parse(body).map((event) => event.name)).toEqual([
      '100 m hommes, finale',
      'Saut en longueur femmes, finale',
      'Hommes, demi-finale',
    ]);
  });

  it('001-AS1: rejects a day outside the Games with a 400 VALIDATION_FAILED problem', async () => {
    const { status, body } = await results('date=9999-12-31');

    expect(status).toBe(400);
    expect(body).toMatchObject({ status: 400, code: 'VALIDATION_FAILED' });
  });

  it('001-AS2: keeps only the requested sport', async () => {
    const { body } = await results('date=2026-11-08&sport=futsal');

    expect(sportEventListSchema.parse(body).map((event) => event.sport)).toEqual(['futsal']);
  });

  it('001-AS2: rejects an unknown sport with a 400 VALIDATION_FAILED problem', async () => {
    const { status, body } = await results('date=2026-11-08&sport=quidditch');

    expect(status).toBe(400);
    expect(body).toMatchObject({ status: 400, code: 'VALIDATION_FAILED' });
  });
});

const medalsApi = async (path: string) => {
  const response = await fetch(`http://localhost/api/medals${path}`);
  return { status: response.status, body: (await response.json()) as unknown };
};

describe('mock medals API', () => {
  it('002-AS1: returns the nations in the order of the standings, with their medals', async () => {
    const { status, body } = await medalsApi('/standings');

    expect(status).toBe(200);
    expect(nationStandingListSchema.parse(body).slice(0, 2)).toMatchObject([
      { rank: 1, nationName: 'Chine', gold: 4, silver: 0, bronze: 0, total: 4 },
      { rank: 2, nationName: 'Kenya', gold: 3, silver: 2, bronze: 0, total: 5 },
    ]);
  });

  it('002-AS3: keeps the overall rank of the nations of the chosen continent', async () => {
    const { body } = await medalsApi('/standings?continent=afrique');

    expect(
      nationStandingListSchema.parse(body).map(({ rank, nationName }) => [rank, nationName]),
    ).toEqual([
      [2, 'Kenya'],
      [3, 'Sénégal'],
      [4, 'Maroc'],
    ]);
  });

  it('002-AS3: rejects an unknown continent with a 400 VALIDATION_FAILED problem', async () => {
    const { status, body } = await medalsApi('/standings?continent=atlantide');

    expect(status).toBe(400);
    expect(body).toMatchObject({ status: 400, code: 'VALIDATION_FAILED' });
  });

  it('002-AS5: lists the medals by sport, event then rank', async () => {
    const { status, body } = await medalsApi('');

    expect(status).toBe(200);
    expect(
      medalListSchema.parse(body).map(({ sport, eventName, type }) => [sport, eventName, type]),
    ).toEqual([
      ['athletisme', '100 m hommes', 'gold'],
      ['athletisme', '100 m hommes', 'silver'],
      ['athletisme', '100 m hommes', 'bronze'],
      ['beach-handball', 'Femmes, finale', 'gold'],
    ]);
  });

  it('002-AS7: keeps only the medals of the chosen sport and type', async () => {
    const { body } = await medalsApi('?sport=athletisme&type=gold');

    expect(medalListSchema.parse(body).map((medal) => medal.competitor)).toEqual(['Gift Bright']);
  });

  it('002-AS7: returns an empty list for a sport without medals', async () => {
    const { status, body } = await medalsApi('?sport=voile');

    expect(status).toBe(200);
    expect(body).toEqual([]);
  });
});

const resultsPath = async (path: string) => {
  const response = await fetch(`http://localhost/api/results${path}`);
  return { status: response.status, body: (await response.json()) as unknown };
};

describe('mock calendar and delegation API', () => {
  it('003-AS1: the calendar returns only the scheduled events of the day', async () => {
    const { status, body } = await resultsPath('/calendar?date=2026-11-08');

    expect(status).toBe(200);
    expect(sportEventListSchema.parse(body).map((event) => event.name)).toEqual([
      'Hommes, demi-finale',
    ]);
  });

  it('003-AS2: the calendar keeps only the chosen sport', async () => {
    const { body } = await resultsPath('/calendar?date=2026-11-09&sport=natation');

    expect(sportEventListSchema.parse(body).map((event) => event.sport)).toEqual(['natation']);
  });

  it('003-AS5: the results keep only the events of the chosen nation', async () => {
    const { status, body } = await resultsPath('?date=2026-11-10&nation=sn');

    expect(status).toBe(200);
    expect(sportEventListSchema.parse(body).map((event) => event.name)).toEqual([
      '100 m hommes, finale',
      'Hommes, finale',
    ]);
  });

  it('003-AS6: returns the athletes of the nation for the day', async () => {
    const { status, body } = await resultsPath('/athletes?date=2026-11-10&nation=sn');

    expect(status).toBe(200);
    expect(
      nationAthleteListSchema
        .parse(body)
        .map(({ competitor, status: eventStatus }) => [competitor, eventStatus]),
    ).toEqual([
      ['Awa Diop', 'finished'],
      ['Équipe du Sénégal', 'scheduled'],
    ]);
  });

  it('003-AS6: rejects a badly written nation with a 400 VALIDATION_FAILED problem', async () => {
    const { status, body } = await resultsPath('/athletes?date=2026-11-10&nation=senegal');

    expect(status).toBe(400);
    expect(body).toMatchObject({ status: 400, code: 'VALIDATION_FAILED' });
  });
});
