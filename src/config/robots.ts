export interface RobotStat {
  label: string;
  value: string;
}

export interface Robot {
  id: string;
  name: string;
  version: string;
  tagline: string;
  /** Path under /public, or null if the model hasn't been exported/uploaded yet. */
  glbUrl: string | null;
  thumbnailLabel: string;
  /** Corrective rotation in degrees for GLBs whose source up-axis doesn't land Y-up in three.js. */
  rotationCorrection?: [number, number, number];
  description?: string;
  stats: RobotStat[];
}

// Add new robots here as they're built — the Robots section renders this
// list directly, no other code changes needed. Chronological, oldest to
// newest. Robots without an exported GLB yet use glbUrl: null and the
// viewer shows a "Model coming soon" placeholder instead of trying to load
// anything.
export const robots: Robot[] = [
  {
    id: 'sunspot-qualifier',
    name: 'SUNSPOT',
    version: 'QUALIFIER',
    tagline: 'Qualifier Robot',
    glbUrl: null,
    thumbnailLabel: 'Q',
    stats: [
      { label: 'Drivetrain', value: 'TODO' },
      { label: 'Intake', value: 'TODO' },
      { label: 'Outtake', value: 'TODO' },
      { label: 'Weight', value: 'TODO' },
    ],
  },
  {
    id: 'sunspot-benelux',
    name: 'SUNSPOT',
    version: 'BENELUX',
    tagline: 'Benelux Championship Robot',
    glbUrl: null,
    thumbnailLabel: 'B',
    stats: [
      { label: 'Drivetrain', value: 'TODO' },
      { label: 'Intake', value: 'TODO' },
      { label: 'Outtake', value: 'TODO' },
      { label: 'Weight', value: 'TODO' },
    ],
  },
  {
    id: 'sunspot-v3',
    name: 'SUNSPOT',
    version: 'VERSION 3',
    tagline: 'European Championships Robot',
    glbUrl: '/models/sunspotv3.glb',
    thumbnailLabel: 'V3',
    stats: [
      { label: 'Drivetrain', value: 'TODO' },
      { label: 'Intake', value: 'TODO' },
      { label: 'Outtake', value: 'TODO' },
      { label: 'Weight', value: 'TODO' },
    ],
  },
  {
    id: 'sunspot-v2',
    name: 'SUNSPOT',
    version: 'WORLDS',
    tagline: 'Houston Worlds Robot',
    glbUrl: '/models/sunspotv2.glb',
    thumbnailLabel: 'V2',
    stats: [
      { label: 'Drivetrain', value: 'TODO' },
      { label: 'Intake', value: 'TODO' },
      { label: 'Outtake', value: 'TODO' },
      { label: 'Weight', value: 'TODO' },
    ],
  },
];
