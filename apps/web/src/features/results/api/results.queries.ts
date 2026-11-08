import type { DayResultsQuery, NationAthletesQuery } from '@joj/shared';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { resultsApi } from './results.api';

/** Clés du cache TanStack Query pour cette fonctionnalité. */
export const resultKeys = {
  all: ['results'] as const,
  day: (query: DayResultsQuery) => [...resultKeys.all, 'day', query] as const,
  athletes: (query: NationAthletesQuery) => [...resultKeys.all, 'athletes', query] as const,
};

export const dayResultsQueryOptions = (query: DayResultsQuery) =>
  queryOptions({
    queryKey: resultKeys.day(query),
    queryFn: ({ signal }) => resultsApi.listDay(query, signal),
  });

export const nationAthletesQueryOptions = (query: NationAthletesQuery) =>
  queryOptions({
    queryKey: resultKeys.athletes(query),
    queryFn: ({ signal }) => resultsApi.listAthletes(query, signal),
  });

export const useDayResults = (query: DayResultsQuery) => useQuery(dayResultsQueryOptions(query));

export const useNationAthletes = (query: NationAthletesQuery) =>
  useQuery(nationAthletesQueryOptions(query));
