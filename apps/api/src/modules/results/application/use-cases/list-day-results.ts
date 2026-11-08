import { Injectable } from '@nestjs/common';
import type { DayResultsQuery } from '@joj/shared';
import type { SportEvent } from '../../domain/sport-event';
import { SportEventRepository } from '../sport-event.repository';

@Injectable()
export class ListDayResults {
  constructor(private readonly sportEvents: SportEventRepository) {}

  execute({ date, sport }: DayResultsQuery): Promise<SportEvent[]> {
    return this.sportEvents.listByDay(date, sport);
  }
}
