import type { Continent, MedalType } from '@joj/shared';
import { describe, expect, it } from 'vitest';
import { Medal, medalTypeForRank } from './medal';
import { buildNationStandings, type Nation } from './nation-standings';

function nation(code: string, name: string, continent: Continent = 'afrique'): Nation {
  return { code, name, continent };
}

function medal(nationCode: string, type: MedalType, competitor = `Athlète ${nationCode}`): Medal {
  return Medal.restore({
    id: `${nationCode}-${type}-${competitor}`,
    type,
    sport: 'athletisme',
    eventId: 'event-1',
    eventName: '100 m hommes',
    competitor,
    nationCode,
    nationName: nationCode,
  });
}

/** Les médailles d'une nation, données par leur nombre d'or, d'argent et de bronze. */
function medals(nationCode: string, gold: number, silver: number, bronze: number): Medal[] {
  return [
    ...Array.from({ length: gold }, (_, i) => medal(nationCode, 'gold', `Or ${i}`)),
    ...Array.from({ length: silver }, (_, i) => medal(nationCode, 'silver', `Argent ${i}`)),
    ...Array.from({ length: bronze }, (_, i) => medal(nationCode, 'bronze', `Bronze ${i}`)),
  ];
}

describe('buildNationStandings', () => {
  it('002-AS1: ranks the nations by gold, then silver, then bronze, with their total', () => {
    const standings = buildNationStandings(
      [
        nation('ma', 'Maroc'),
        nation('sn', 'Sénégal'),
        nation('ke', 'Kenya'),
        nation('cn', 'Chine', 'asie'),
      ],
      [
        ...medals('ma', 3, 1, 1),
        ...medals('sn', 3, 1, 2),
        ...medals('ke', 3, 2, 0),
        ...medals('cn', 4, 0, 0),
      ],
    );

    expect(standings).toEqual([
      {
        rank: 1,
        nationCode: 'cn',
        nationName: 'Chine',
        continent: 'asie',
        gold: 4,
        silver: 0,
        bronze: 0,
        total: 4,
      },
      {
        rank: 2,
        nationCode: 'ke',
        nationName: 'Kenya',
        continent: 'afrique',
        gold: 3,
        silver: 2,
        bronze: 0,
        total: 5,
      },
      {
        rank: 3,
        nationCode: 'sn',
        nationName: 'Sénégal',
        continent: 'afrique',
        gold: 3,
        silver: 1,
        bronze: 2,
        total: 6,
      },
      {
        rank: 4,
        nationCode: 'ma',
        nationName: 'Maroc',
        continent: 'afrique',
        gold: 3,
        silver: 1,
        bronze: 1,
        total: 5,
      },
    ]);
  });

  it('002-AS1: turns the ranks 1, 2 and 3 into gold, silver and bronze', () => {
    expect([1, 2, 3].map(medalTypeForRank)).toEqual(['gold', 'silver', 'bronze']);
  });

  it('002-AS2: gives the same rank to perfectly tied nations and skips the shared places', () => {
    const standings = buildNationStandings(
      [
        nation('tv', 'Tuvalu', 'oceanie'),
        nation('hr', 'Croatie', 'europe'),
        nation('fr', 'France', 'europe'),
        nation('eg', 'Égypte'),
      ],
      [...medals('fr', 3, 3, 2), ...medals('eg', 3, 3, 2), ...medals('hr', 3, 3, 0)],
    );

    expect(standings.map(({ rank, nationName, total }) => [rank, nationName, total])).toEqual([
      [1, 'Égypte', 8],
      [1, 'France', 8],
      [3, 'Croatie', 6],
      [4, 'Tuvalu', 0],
    ]);
  });

  it('002-AS6: counts a medalist team as a single medal', () => {
    const [brazil] = buildNationStandings(
      [nation('br', 'Brésil', 'ameriques')],
      [medal('br', 'gold', 'Équipe du Brésil')],
    );

    expect(brazil).toMatchObject({ gold: 1, silver: 0, bronze: 0, total: 1 });
  });
});
