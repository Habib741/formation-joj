import { Module } from '@nestjs/common';
import { SportEventRepository } from './application/sport-event.repository';
import { ListDayCalendar } from './application/use-cases/list-day-calendar';
import { ListDayResults } from './application/use-cases/list-day-results';
import { ListNationAthletes } from './application/use-cases/list-nation-athletes';
import { ResultsController } from './http/results.controller';
import { DrizzleSportEventRepository } from './infra/drizzle-sport-event.repository';

@Module({
  controllers: [ResultsController],
  providers: [
    // Le port (classe abstraite) est relié ici à son implémentation Drizzle.
    { provide: SportEventRepository, useClass: DrizzleSportEventRepository },
    ListDayResults,
    ListDayCalendar,
    ListNationAthletes,
  ],
})
export class ResultsModule {}
