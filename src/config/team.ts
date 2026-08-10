import type { SeasonId } from './seasons';

export interface Award {
  year: string;
  title: string;
  event: string;
}

// Most recent first, keyed by season.
export const awardsBySeason: Record<SeasonId, Award[]> = {
  decode: [
    { year: '2026', title: '14th Division Placement', event: 'FIRST World Championship' },
    { year: '2026', title: 'Winner', event: 'Benelux Championship' },
    { year: '2026', title: '3rd Inspire Award', event: 'Benelux Championship' },
    { year: '2025', title: 'Finalist Alliance Captain', event: 'Benelux Qualifier' },
    { year: '2025', title: '2nd Inspire Award', event: 'Benelux Qualifier' },
    { year: '2025', title: '3rd Think Award', event: 'European Premier Event' },
    { year: '2025', title: '1st Think Award', event: 'Benelux Championships' },
    { year: '2024', title: '1st Inspire Award', event: 'Benelux Qualifier' },
  ],
  biobuzz: [],
};

export interface DemographicStat {
  value: string;
  label: string;
}

export const demographics: DemographicStat[] = [
  { value: '3', label: 'Girls' },
  { value: '10', label: 'Boys' },
  { value: '15', label: 'Nationalities' },
  { value: '5', label: 'Continents' },
];

export const mission = {
  slogan: 'Simple by design. Stronger together.',
  subline:
    'From the American School of The Hague, NL · Rookie year 2023 · Student-led and organized · Driven by collaboration and equal voice',
};

export interface SponsorLogo {
  id: string;
  name: string;
}

// Placeholder slots — drop real logo files in /public/sponsors/ and swap the
// placeholder box in <SponsorStrip> for an <img> once assets are ready.
export const sponsors: SponsorLogo[] = [
  { id: 'sponsor-1', name: 'Sponsor 1' },
  { id: 'sponsor-2', name: 'Sponsor 2' },
  { id: 'sponsor-3', name: 'Sponsor 3' },
  { id: 'sponsor-4', name: 'Sponsor 4' },
  { id: 'sponsor-5', name: 'Sponsor 5' },
  { id: 'sponsor-6', name: 'Sponsor 6' },
];
