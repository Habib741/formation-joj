import { z } from 'zod';

/** Liste fermée des 25 sports des Jeux ; les libellés français sont côté front. */
export const SPORT_SLUGS = [
  'athletisme',
  'aviron-de-mer',
  'badminton',
  'baseball5',
  'basketball-3x3',
  'beach-handball',
  'beach-volley',
  'boxe',
  'breaking',
  'cyclisme-sur-route',
  'escrime',
  'futsal',
  'gymnastique-artistique',
  'judo',
  'lutte-de-plage',
  'natation',
  'rugby-a-7',
  'skateboard',
  'sports-equestres',
  'taekwondo',
  'tennis-de-table',
  'tir-a-l-arc',
  'triathlon',
  'voile',
  'wushu-taolu',
] as const;

export const sportSlugSchema = z.enum(SPORT_SLUGS);
export type SportSlug = z.infer<typeof sportSlugSchema>;

export const SPORT_EVENT_STATUSES = ['scheduled', 'in-progress', 'finished'] as const;
export const sportEventStatusSchema = z.enum(SPORT_EVENT_STATUSES);
export type SportEventStatus = z.infer<typeof sportEventStatusSchema>;

export const RANKING_MENTIONS = ['disqualified', 'did-not-finish'] as const;
export const rankingMentionSchema = z.enum(RANKING_MENTIONS);
export type RankingMention = z.infer<typeof rankingMentionSchema>;

/** Premier et dernier jour des Jeux. */
export const GAMES_FIRST_DAY = '2026-10-31';
export const GAMES_LAST_DAY = '2026-11-13';

/** Un jour des Jeux, au format AAAA-MM-JJ, qui se compare donc comme du texte. */
export const gamesDaySchema = z.iso
  .date()
  .refine((day) => day >= GAMES_FIRST_DAY && day <= GAMES_LAST_DAY, {
    error: 'The day must be within the Games.',
  });

/** Le fuseau des Jeux, utilisé par défaut pour afficher les horaires. */
export const DAKAR_TIME_ZONE = 'Africa/Dakar';

/** Le code à deux lettres d'une nation, comme `sn`. */
export const nationCodeSchema = z.string().regex(/^[a-z]{2}$/);

/** Paramètres de `GET /api/results`. */
export const dayResultsQuerySchema = z.object({
  date: gamesDaySchema,
  sport: sportSlugSchema.optional(),
  nation: nationCodeSchema.optional(),
});
export type DayResultsQuery = z.infer<typeof dayResultsQuerySchema>;

/** Paramètres de `GET /api/results/calendar`. */
export const calendarQuerySchema = z.object({
  date: gamesDaySchema,
  sport: sportSlugSchema.optional(),
});
export type CalendarQuery = z.infer<typeof calendarQuerySchema>;

/** Paramètres de `GET /api/results/athletes`. */
export const nationAthletesQuerySchema = z.object({
  date: gamesDaySchema,
  nation: nationCodeSchema,
});
export type NationAthletesQuery = z.infer<typeof nationAthletesQuerySchema>;

/** Une ligne du classement d'une épreuve : soit un rang et une performance, soit une mention. */
export const rankingEntrySchema = z.object({
  rank: z.number().int().positive().nullable(),
  nationCode: z.string(),
  nationName: z.string(),
  competitor: z.string(),
  performance: z.string().nullable(),
  mention: rankingMentionSchema.nullable(),
});
export type RankingEntryResponse = z.infer<typeof rankingEntrySchema>;

/** Une épreuve telle que l'API la renvoie ; `ranking` est vide tant qu'elle n'est pas terminée. */
export const sportEventSchema = z.object({
  id: z.uuid(),
  sport: sportSlugSchema,
  name: z.string(),
  startsAt: z.iso.datetime(),
  status: sportEventStatusSchema,
  ranking: z.array(rankingEntrySchema),
});
export type SportEventResponse = z.infer<typeof sportEventSchema>;

export const sportEventListSchema = z.array(sportEventSchema);

/** Un athlète du jour d'une nation, avec son épreuve, son heure et son statut. */
export const nationAthleteSchema = z.object({
  competitor: z.string(),
  eventId: z.uuid(),
  eventName: z.string(),
  sport: sportSlugSchema,
  startsAt: z.iso.datetime(),
  status: sportEventStatusSchema,
});
export type NationAthleteResponse = z.infer<typeof nationAthleteSchema>;

export const nationAthleteListSchema = z.array(nationAthleteSchema);
