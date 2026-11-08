import { type DayResultsQuery, type SportEventResponse, sportEventListSchema } from '@joj/shared';
import { api } from '@/lib/api';

/**
 * Les appels HTTP de la fonctionnalité, sans React ni cache : un appel par route de l'API,
 * réponse validée par le schéma partagé. Le cache et les hooks sont dans `results.queries.ts`.
 */
export const resultsApi = {
  listDay: ({ date, sport }: DayResultsQuery, signal?: AbortSignal) => {
    const params = new URLSearchParams({ date });
    if (sport !== undefined) params.set('sport', sport);
    return api.request<SportEventResponse[]>(`/results?${params.toString()}`, {
      schema: sportEventListSchema,
      signal,
    });
  },
};
