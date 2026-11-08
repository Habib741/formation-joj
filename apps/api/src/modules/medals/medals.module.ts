import { Module } from '@nestjs/common';
import { MedalRepository } from './application/medal.repository';
import { ListMedals } from './application/use-cases/list-medals';
import { ListNationStandings } from './application/use-cases/list-nation-standings';
import { MedalsController } from './http/medals.controller';
import { DrizzleMedalRepository } from './infra/drizzle-medal.repository';

@Module({
  controllers: [MedalsController],
  providers: [
    // Le port (classe abstraite) est relié ici à son implémentation Drizzle.
    { provide: MedalRepository, useClass: DrizzleMedalRepository },
    ListMedals,
    ListNationStandings,
  ],
})
export class MedalsModule {}
