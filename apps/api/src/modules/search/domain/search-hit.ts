import { SPORT_LABELS, SPORT_SLUGS, type SearchHitResponse, type SportSlug } from '@joj/shared';

/** Ce dans quoi l'on cherche : les nations, et les épreuves avec leurs participants. */
export interface SearchCatalog {
  nations: { code: string; name: string }[];
  events: {
    sport: SportSlug;
    name: string;
    startsAt: Date;
    participants: { competitor: string; nationCode: string }[];
  }[];
}

/** Sans accent, sans majuscule et sans espace autour : « Sénégal » devient « senegal ». */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Les éléments trouvés, dans l'ordre : nations, sports, épreuves, puis athlètes. */
export function findSearchHits(term: string, catalog: SearchCatalog): SearchHitResponse[] {
  const wanted = normalizeSearchText(term);
  const matches = (text: string) => normalizeSearchText(text).includes(wanted);

  const nations = catalog.nations
    .filter((nation) => matches(nation.name))
    .map((nation): SearchHitResponse => ({
      kind: 'nation',
      label: nation.name,
      date: null,
      sport: null,
      nation: nation.code,
    }));
  const sports = SPORT_SLUGS.filter((sport) => matches(SPORT_LABELS[sport])).map(
    (sport): SearchHitResponse => ({
      kind: 'sport',
      label: SPORT_LABELS[sport],
      date: null,
      sport,
      nation: null,
    }),
  );
  const events = catalog.events
    .filter((event) => matches(event.name))
    .map((event): SearchHitResponse => ({
      kind: 'event',
      label: event.name,
      date: dakarDay(event.startsAt),
      sport: event.sport,
      nation: null,
    }));
  const athletes = catalog.events.flatMap((event) =>
    event.participants
      .filter((participant) => matches(participant.competitor))
      .map((participant): SearchHitResponse => ({
        kind: 'athlete',
        label: participant.competitor,
        date: dakarDay(event.startsAt),
        sport: event.sport,
        nation: participant.nationCode,
      })),
  );
  return [...nations, ...sports, ...events, ...athletes];
}

/** Dakar est à UTC toute l'année : le jour de Dakar est celui de la date UTC. */
function dakarDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
