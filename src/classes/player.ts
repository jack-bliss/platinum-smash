export interface Player {
  id: number;
  tag: string;
  tier: number;
  rank: number;
  maxRank: number;
  tierName: string;
  tierColor: string;
  wins?: number[];
  losses?: number[];
}
