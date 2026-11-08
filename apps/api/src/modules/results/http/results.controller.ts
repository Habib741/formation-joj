import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  calendarQuerySchema,
  dayResultsQuerySchema,
  type NationAthleteResponse,
  nationAthleteSchema,
  nationAthletesQuerySchema,
  type SportEventResponse,
  sportEventSchema,
} from '@joj/shared';
import { createZodDto, ZodSerializerDto } from 'nestjs-zod';
import { ListDayCalendar } from '../application/use-cases/list-day-calendar';
import { ListDayResults } from '../application/use-cases/list-day-results';
import { ListNationAthletes } from '../application/use-cases/list-nation-athletes';
import type { NationAthlete, SportEvent } from '../domain/sport-event';

class DayResultsQueryDto extends createZodDto(dayResultsQuerySchema) {}
class CalendarQueryDto extends createZodDto(calendarQuerySchema) {}
class NationAthletesQueryDto extends createZodDto(nationAthletesQuerySchema) {}
class SportEventDto extends createZodDto(sportEventSchema) {}
class NationAthleteDto extends createZodDto(nationAthleteSchema) {}

/** Couche fine : valider (DTO zod), appeler un cas d'usage, sérialiser. Aucune règle métier ici. */
@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(
    private readonly listDayResults: ListDayResults,
    private readonly listDayCalendar: ListDayCalendar,
    private readonly listNationAthletes: ListNationAthletes,
  ) {}

  @Get()
  @ZodSerializerDto([SportEventDto])
  async list(@Query() query: DayResultsQueryDto): Promise<SportEventResponse[]> {
    return (await this.listDayResults.execute(query)).map(toResponse);
  }

  @Get('calendar')
  @ZodSerializerDto([SportEventDto])
  async calendar(@Query() query: CalendarQueryDto): Promise<SportEventResponse[]> {
    return (await this.listDayCalendar.execute(query)).map(toResponse);
  }

  @Get('athletes')
  @ZodSerializerDto([NationAthleteDto])
  async athletes(@Query() query: NationAthletesQueryDto): Promise<NationAthleteResponse[]> {
    return (await this.listNationAthletes.execute(query)).map(toAthleteResponse);
  }
}

function toResponse(event: SportEvent): SportEventResponse {
  return {
    id: event.id,
    sport: event.sport,
    name: event.name,
    startsAt: event.startsAt.toISOString(),
    status: event.status,
    ranking: event.ranking,
  };
}

function toAthleteResponse(athlete: NationAthlete): NationAthleteResponse {
  return { ...athlete, startsAt: athlete.startsAt.toISOString() };
}
