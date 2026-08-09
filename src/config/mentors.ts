export interface Mentor {
  id: string;
  name: string;
  specialty: string;
}

export const mentors: Mentor[] = [
  { id: 'jim-heigle', name: 'Jim Heigle', specialty: 'Risk Management Specialist' },
  { id: 'corrine-kohlmeyer', name: 'Corrine Kohlmeyer', specialty: 'Marketing Specialist' },
  { id: 'anish-jadoenathmisier', name: 'Anish Jadoenathmisier', specialty: 'Programming Specialist' },
  { id: 'jm-geertman', name: 'J.M. Geertman', specialty: 'Innovation Specialist' },
  { id: 'andrew-herring', name: 'Andrew Herring', specialty: 'Engagement Specialist' },
  { id: 'albert-ismail', name: 'Albert & Ismail', specialty: 'Autonomous Specialists' },
  { id: 'junko-ray', name: 'Junko Ray', specialty: 'Communication & Education Specialist' },
  { id: 'chris-stephens', name: 'Chris Stephens', specialty: 'Data Analyst' },
  { id: 'tu-delft-brunel', name: 'TU Delft', specialty: 'Brunel Solar Team' },
];
