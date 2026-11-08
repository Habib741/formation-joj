import type { SportSlug } from '@joj/shared';
import type { SportEvent } from '../../domain/sport-event';
import { SportEventRepository } from '../sport-event.repository';

/** Fake fidèle au contrat du port (filtres et tri), pour tester l'application sans base. */
export class InMemorySportEventRepository extends SportEventRepository {
  constructor(private readonly events: SportEvent[] = []) {
    super();
  }

  async listByDay(day: string, sport?: SportSlug): Promise<SportEvent[]> {
    return this.events
      .filter((event) => event.startsAt.toISOString().startsWith(day))
      .filter((event) => sport === undefined || event.sport === sport)
      .toSorted(
        (a, b) => a.sport.localeCompare(b.sport) || a.startsAt.getTime() - b.startsAt.getTime(),
      );
  }
}
