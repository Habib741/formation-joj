import { gamesDaySchema, sportSlugSchema } from '@joj/shared';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ResultsPage } from '@/features/results/components/results-page';

/** Le jour et le sport vivent dans l'adresse ; une valeur invalide est simplement ignorée. */
const resultsSearchSchema = z.object({
  date: gamesDaySchema.optional().catch(undefined),
  sport: sportSlugSchema.optional().catch(undefined),
});

export const Route = createFileRoute('/resultats')({
  validateSearch: resultsSearchSchema,
  component: ResultsPage,
});
