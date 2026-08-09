export interface RobotStat {
  label: string;
  value: string;
}

export interface Robot {
  id: string;
  name: string;
  version: string;
  tagline: string;
  glbUrl: string;
  thumbnailLabel: string;
  description?: string;
  stats: RobotStat[];
}

// Add new robots here as they're built — the Robots section renders
// this list directly, no other code changes needed.
export const robots: Robot[] = [
  {
    id: 'sunspot-v3',
    name: 'SUNSPOT',
    version: 'VERSION 3',
    tagline: 'Houston Worlds Robot',
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
    version: 'VERSION 2',
    tagline: 'Regional Championship Robot',
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
