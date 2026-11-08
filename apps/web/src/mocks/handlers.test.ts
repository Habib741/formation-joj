/**
 * La fausse API tient le même contrat que apps/api : si elle s'en écarte, les tests du front
 * passent contre une API qui n'existe pas. Ces tests l'appellent avec `fetch`, sans React.
 */
import { sportEventListSchema } from '@joj/shared';
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
