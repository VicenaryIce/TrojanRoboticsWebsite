export type SeasonId = 'decode' | 'biobuzz';

export interface SeasonMeta {
  id: SeasonId;
  label: string;
  year: string;
}

// Add new seasons here as they're announced — the season switcher and all
// gated sections (Robots, Performance History, Outreach) render from this
// list directly.
export const seasonList: SeasonMeta[] = [
  { id: 'decode', label: 'Decode', year: '2025–26' },
  { id: 'biobuzz', label: 'BioBuzz', year: 'Upcoming' },
];

export const defaultSeasonId: SeasonId = 'decode';
