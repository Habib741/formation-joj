import type { RankingMention, SportEventStatus, SportSlug } from '@joj/shared';

export const SPORT_LABELS: Record<SportSlug, string> = {
  athletisme: 'Athlétisme',
  'aviron-de-mer': 'Aviron de mer',
  badminton: 'Badminton',
  baseball5: 'Baseball5',
  'basketball-3x3': 'Basketball 3x3',
  'beach-handball': 'Beach handball',
  'beach-volley': 'Beach-volley',
  boxe: 'Boxe',
  breaking: 'Breaking',
  'cyclisme-sur-route': 'Cyclisme sur route',
  escrime: 'Escrime',
  futsal: 'Futsal',
  'gymnastique-artistique': 'Gymnastique artistique',
  judo: 'Judo',
  'lutte-de-plage': 'Lutte de plage',
  natation: 'Natation',
  'rugby-a-7': 'Rugby à 7',
  skateboard: 'Skateboard',
  'sports-equestres': 'Sports équestres',
  taekwondo: 'Taekwondo',
  'tennis-de-table': 'Tennis de table',
  'tir-a-l-arc': "Tir à l'arc",
  triathlon: 'Triathlon',
  voile: 'Voile',
  'wushu-taolu': 'Wushu taolu',
};

export const STATUS_LABELS: Record<SportEventStatus, string> = {
  scheduled: 'Programmé',
  'in-progress': 'En cours',
  finished: 'Terminé',
};

export const MENTION_LABELS: Record<RankingMention, string> = {
  disqualified: 'Disqualifié',
  'did-not-finish': "N'a pas terminé",
};
