import type { RankingMention, SportEventStatus, SportSlug } from '@joj/shared';

/** Une participation : soit un rang et une performance, soit une mention. */
export interface RankingEntry {
  rank: number | null;
  nationCode: string;
  nationName: string;
  competitor: string;
  performance: string | null;
  mention: RankingMention | null;
}

export interface SportEventProps {
  id: string;
  sport: SportSlug;
  name: string;
  startsAt: Date;
  status: SportEventStatus;
  entries: RankingEntry[];
}

/** Une épreuve des Jeux, en lecture seule : son classement n'existe qu'une fois terminée. */
export class SportEvent {
  private constructor(private readonly props: SportEventProps) {}

  /** Reconstruit une épreuve depuis la persistance. */
  static restore(props: SportEventProps): SportEvent {
    return new SportEvent({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get sport(): SportSlug {
    return this.props.sport;
  }

  get name(): string {
    return this.props.name;
  }

  get startsAt(): Date {
    return this.props.startsAt;
  }

  get status(): SportEventStatus {
    return this.props.status;
  }

  /** Les classés par rang, puis les participants avec une mention. Vide avant la fin de l'épreuve. */
  get ranking(): RankingEntry[] {
    if (this.props.status !== 'finished') return [];
    return this.props.entries.toSorted(byRankThenMention);
  }
}

function byRankThenMention(a: RankingEntry, b: RankingEntry): number {
  return (a.rank ?? Number.POSITIVE_INFINITY) - (b.rank ?? Number.POSITIVE_INFINITY);
}
