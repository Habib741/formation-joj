import { SPORT_SLUGS, type SportEventResponse, type SportSlug, sportSlugSchema } from '@joj/shared';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useId, useState } from 'react';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { cn } from '@/lib/utils';
import { useDayResults } from '../api/results.queries';
import { DaySelector } from './day-selector';
import { defaultDay } from './default-day';
import { SPORT_LABELS } from './result-labels';
import { SportEventCard } from './sport-event-card';

const routeApi = getRouteApi('/resultats');

const LONG_DAY = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' });

/** Les couleurs des pastilles de sport, reprises des pictogrammes de la maquette. */
const BADGE_STYLES = ['bg-joj-pale-red', 'bg-accent', 'bg-joj-pale-yellow'];

export function ResultsPage() {
  const search = routeApi.useSearch();
  // Le jour par défaut est fixé à l'ouverture de la page, pas à chaque rendu.
  const [openingDay] = useState(() => defaultDay(new Date()));
  const day = search.date ?? openingDay;
  const results = useDayResults({ date: day, sport: search.sport });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Résultats du {LONG_DAY.format(new Date(day))}</h1>
      <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm md:p-6">
        <DaySelector selectedDay={day} sport={search.sport} />
        <SportFilter day={day} sport={search.sport} />
      </div>
      {results.isPending && <p className="text-muted-foreground">Chargement…</p>}
      {results.isError && (
        <p role="alert" className="text-destructive">
          Impossible de charger les résultats.
        </p>
      )}
      {results.isSuccess && <SportGroups events={results.data} />}
    </div>
  );
}

function SportFilter({ day, sport }: { day: string; sport: SportSlug | undefined }) {
  const navigate = useNavigate({ from: '/resultats' });
  const selectId = useId();
  return (
    <div className="flex flex-col gap-1.5 sm:max-w-xs">
      <Label htmlFor={selectId}>Sport</Label>
      <NativeSelect
        id={selectId}
        value={sport ?? ''}
        onChange={(event) => {
          const parsed = sportSlugSchema.safeParse(event.target.value);
          void navigate({
            search: { date: day, sport: parsed.success ? parsed.data : undefined },
          });
        }}
      >
        <option value="">Tous les sports</option>
        {SPORT_SLUGS.map((slug) => (
          <option key={slug} value={slug}>
            {SPORT_LABELS[slug]}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}

function SportGroups({ events }: { events: SportEventResponse[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-2xl border bg-card p-6 text-center text-muted-foreground">
        Aucune épreuve pour ce jour et ce sport
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {SPORT_SLUGS.filter((slug) => events.some((event) => event.sport === slug)).map((slug) => (
        <SportGroup
          key={slug}
          sport={slug}
          events={events.filter((event) => event.sport === slug)}
        />
      ))}
    </div>
  );
}

function SportGroup({ sport, events }: { sport: SportSlug; events: SportEventResponse[] }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
      <div className="mb-2 flex items-center gap-3">
        <SportBadge sport={sport} />
        <h2 id={titleId} className="text-lg font-bold">
          {SPORT_LABELS[sport]}
        </h2>
      </div>
      {events.map((event) => (
        <SportEventCard key={event.id} event={event} />
      ))}
    </section>
  );
}

function SportBadge({ sport }: { sport: SportSlug }) {
  const color = BADGE_STYLES[SPORT_SLUGS.indexOf(sport) % BADGE_STYLES.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        color,
      )}
    >
      {SPORT_LABELS[sport].slice(0, 2).toUpperCase()}
    </span>
  );
}
