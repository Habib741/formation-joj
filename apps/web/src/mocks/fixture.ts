import type { SportEventResponse } from '@joj/shared';

/**
 * Les données de la fausse API, en mémoire. Les handlers les lisent et les modifient comme la
 * vraie base ; `resetFixture()` (appelé après chaque test par `mockControl.reset()`) les remet
 * dans cet état, pour qu'un test ne dépende jamais de ce qu'un autre a créé ou supprimé.
 * Chaque ressource de l'API y ajoute sa liste, avec ses valeurs de départ.
 */
export const sprintFinal: SportEventResponse = {
  id: '0199f5c2-0000-7000-8000-000000000001',
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
    {
      rank: 2,
      nationCode: 'cn',
      nationName: 'Chine',
      competitor: 'Hangyu Zhang',
      performance: '10,31 s',
      mention: null,
    },
    {
      rank: null,
      nationCode: 'fr',
      nationName: 'France',
      competitor: 'Athlète Disqualifié',
      performance: null,
      mention: 'disqualified',
    },
    {
      rank: null,
      nationCode: 'br',
      nationName: 'Brésil',
      competitor: 'Athlète Abandon',
      performance: null,
      mention: 'did-not-finish',
    },
  ],
};

export const longJump: SportEventResponse = {
  id: '0199f5c2-0000-7000-8000-000000000002',
  sport: 'athletisme',
  name: 'Saut en longueur femmes, finale',
  startsAt: '2026-11-08T19:00:00.000Z',
  status: 'in-progress',
  ranking: [],
};

export const futsalSemiFinal: SportEventResponse = {
  id: '0199f5c2-0000-7000-8000-000000000003',
  sport: 'futsal',
  name: 'Hommes, demi-finale',
  startsAt: '2026-11-08T20:30:00.000Z',
  status: 'scheduled',
  ranking: [],
};

export const judoFinal: SportEventResponse = {
  id: '0199f5c2-0000-7000-8000-000000000004',
  sport: 'judo',
  name: '-60 kg hommes, finale',
  startsAt: '2026-11-07T17:00:00.000Z',
  status: 'scheduled',
  ranking: [],
};

const initial = (): { sportEvents: SportEventResponse[] } => ({
  sportEvents: [{ ...futsalSemiFinal }, { ...longJump }, { ...sprintFinal }, { ...judoFinal }],
});

export const fixture = initial();

export function resetFixture(): void {
  Object.assign(fixture, initial());
}
