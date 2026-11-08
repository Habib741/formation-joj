import { Inject, Injectable } from '@nestjs/common';
import type { SportSlug } from '@joj/shared';
import { and, asc, eq, gte, inArray, lt } from 'drizzle-orm';
import type { Database } from '../../../core/database/database';
import { DATABASE } from '../../../core/database/database.module';
import { SportEventRepository } from '../application/sport-event.repository';
import type { SportEvent } from '../domain/sport-event';
import { sportEventEntries, sportEvents } from './results.schema';
import { toDomain } from './sport-event.mapper';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class DrizzleSportEventRepository extends SportEventRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {
    super();
  }

  async listByDay(day: string, sport?: SportSlug): Promise<SportEvent[]> {
    // Dakar est à UTC toute l'année : le jour de Dakar va de minuit à minuit UTC.
    const dayStart = new Date(`${day}T00:00:00.000Z`);
    const nextDayStart = new Date(dayStart.getTime() + ONE_DAY_IN_MS);
    const rows = await this.db
      .select()
      .from(sportEvents)
      .where(
        and(
          gte(sportEvents.startsAt, dayStart),
          lt(sportEvents.startsAt, nextDayStart),
          sport === undefined ? undefined : eq(sportEvents.sport, sport),
        ),
      )
      .orderBy(asc(sportEvents.sport), asc(sportEvents.startsAt));
    if (rows.length === 0) return [];

    const entryRows = await this.db
      .select()
      .from(sportEventEntries)
      .where(
        inArray(
          sportEventEntries.eventId,
          rows.map((row) => row.id),
        ),
      );
    return rows.map((row) =>
      toDomain(
        row,
        entryRows.filter((entry) => entry.eventId === row.id),
      ),
    );
  }
}
