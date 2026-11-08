import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { dayResultsQuerySchema, type SportEventResponse, sportEventSchema } from '@joj/shared';
import { createZodDto, ZodSerializerDto } from 'nestjs-zod';
import { ListDayResults } from '../application/use-cases/list-day-results';
import type { SportEvent } from '../domain/sport-event';

class DayResultsQueryDto extends createZodDto(dayResultsQuerySchema) {}
class SportEventDto extends createZodDto(sportEventSchema) {}

/** Couche fine : valider (DTO zod), appeler un cas d'usage, sérialiser. Aucune règle métier ici. */
@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly listDayResults: ListDayResults) {}

  @Get()
  @ZodSerializerDto([SportEventDto])
  async list(@Query() query: DayResultsQueryDto): Promise<SportEventResponse[]> {
    return (await this.listDayResults.execute(query)).map(toResponse);
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
