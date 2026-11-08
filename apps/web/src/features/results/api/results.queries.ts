import type { DayResultsQuery } from '@joj/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { resultsApi } from './results.api';

/** Clés du cache TanStack Query pour cette fonctionnalité. */
export const resultKeys = {
  all: ['results'] as const,
  day: (query: DayResultsQuery) => [...resultKeys.all, 'day', query] as const,
};

export const dayResultsQueryOptions = (query: DayResultsQuery) =>
  queryOptions({
    queryKey: resultKeys.day(query),
    queryFn: ({ signal }) => resultsApi.listDay(query, signal),
  });

export const useDayResults = (query: DayResultsQuery) => useQuery(dayResultsQueryOptions(query));
