import type { Medal } from '../domain/medal';
import type { Nation } from '../domain/nation-standings';

/**
 * Port de persistance : ce dont les cas d'usage ont besoin, rien de plus.
 * Implémenté par DrizzleMedalRepository (infra) et InMemoryMedalRepository (tests).
 */
export abstract class MedalRepository {
  /** Toutes les médailles, triées par sport, puis par heure d'épreuve, puis par rang. */
  abstract listMedals(): Promise<Medal[]>;

  /** Toutes les nations des Jeux, médaillées ou non. */
  abstract listNations(): Promise<Nation[]>;
}
