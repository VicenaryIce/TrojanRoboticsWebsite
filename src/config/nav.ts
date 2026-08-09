export interface NavSection {
  id: string;
  label: string;
}

export const navSections: NavSection[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'robots', label: 'Robots' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'mentors', label: 'Mentors' },
];
