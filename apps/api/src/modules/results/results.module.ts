import { Module } from '@nestjs/common';
import { SportEventRepository } from './application/sport-event.repository';
import { ListDayResults } from './application/use-cases/list-day-results';
import { ResultsController } from './http/results.controller';
import { DrizzleSportEventRepository } from './infra/drizzle-sport-event.repository';

@Module({
  controllers: [ResultsController],
  providers: [
    // Le port (classe abstraite) est relié ici à son implémentation Drizzle.
    { provide: SportEventRepository, useClass: DrizzleSportEventRepository },
    ListDayResults,
  ],
})
export class ResultsModule {}
