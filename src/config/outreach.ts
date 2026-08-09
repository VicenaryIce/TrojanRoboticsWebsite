export const outreachGoals: string[] = [
  'Get people involved and inspired by robotics',
  'Increase community exposure to FIRST and make it loud',
  'Teach people robotics & engineering skills',
];

export interface CourseTrack {
  id: string;
  name: string;
  points: string[];
}

export const courseTracks: CourseTrack[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    points: [
      'Servo wiring with SG90 servo motors',
      'Scratch programming using control loops',
      'Using the design cycle to finish a project',
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    points: [
      'Advanced methods in Scratch programming',
      'Using TinkerCAD to model custom parts and robots',
      'Utilizing DC motors and servo motors in one circuit',
    ],
  },
  {
    id: 'programming',
    name: 'Programming',
    points: [
      'Basic Python',
      'Wiring digital sensors and DC motor drivers',
      'Algorithmic thinking and using sensor inputs for line following',
    ],
  },
];

export interface ReachBreakdown {
  medium: string;
  people: string;
}

export const reachBreakdown: ReachBreakdown[] = [
  { medium: 'Instagram', people: '22,096' },
  { medium: 'Makerdays Eindhoven', people: '5,000+' },
  { medium: 'bASH', people: '50+' },
  { medium: 'Elementary Robotics Program', people: '25' },
  { medium: 'TikTok', people: '2,909' },
  { medium: 'Techfest', people: '700+' },
  { medium: 'Maker Faire Delft', people: '2,000+' },
];

export const totalReach = {
  value: '30,000+',
  label: 'People Reached',
  note: '300%+ increase from last year',
};

export interface HighImpactEvent {
  id: string;
  name: string;
  description: string;
}

export const highImpactEvents: HighImpactEvent[] = [
  {
    id: 'hague-techfest',
    name: 'The Hague TechFest',
    description:
      'Served as ambassadors for FIRST to 700+ professionals at this annual STEM conference, connecting with passionate robotics founders.',
  },
  {
    id: 'dutch-student-workshop',
    name: 'Dutch Student Workshop',
    description:
      'Invited Dutch highschoolers, taught them robotics skills for this year’s FTC game, and built our single-shooter design together.',
  },
  {
    id: 'green-impact-initiative',
    name: 'Green Impact Initiative',
    description:
      'Collaborated with Team 23014 to install a bike-powered shredder that converts old plastic into 3D printing filament, reducing carbon footprint.',
  },
  {
    id: 'new-ftc-teams',
    name: 'New FTC Teams at ISH & ESH',
    description:
      'Inspired the International School of The Hague to launch an FTC team by showcasing our robot and hands-on driving, and worked with the European School of The Hague to explore starting theirs.',
  },
];

export interface TimelineEvent {
  id: string;
  date: string;
  name: string;
  points: string[];
}

export const outreachTimeline: TimelineEvent[] = [
  { id: 'stem-expo', date: 'Jan 2025', name: 'STEM Expo', points: ['Gave kids STEM opportunities during our Qualifiers', 'Let them drive a Mars Rover and robotics cars'] },
  { id: 'taalkaas', date: 'Feb 2025', name: 'Taalkaas Lessons', points: ['Taught STEM principles to refugee children, sparking curiosity for STEM'] },
  { id: 'frostbite', date: 'Apr 2025', name: 'Frostbite Call', points: ['Call with rookie FTC team Frostbite Robotics', 'Helped them kickstart their robot building process'] },
  { id: 'pto-bazaar', date: 'May 2025', name: 'PTO Bazaar', points: ['Networked with people from ESA and Pam Technik', 'Showcased our robot to young STEM students'] },
  { id: 'ash-activities-fair', date: 'Aug 2025', name: 'ASH Activities Fair', points: ['Brought 32 members into FIRST', 'Created a new FTC team at our school'] },
  { id: 'mentorship-sessions', date: 'Aug–Sep 2025', name: 'Mentorship Sessions', points: ['Developed new member skills using experts in their respective field'] },
  { id: 'robot-in-24-hours', date: 'Sep 2025', name: 'Robot in 24 Hours', points: ['Rapid ideation for season kickoff', 'Taught our new builders robotics and FTC principles'] },
  { id: 'trick-or-trunk', date: 'Oct 2025', name: 'Trick or Trunk', points: ['Rookie members designed a candy-shooting robot for a Halloween festival to generate interest in STEM'] },
  { id: 'crowdsourcing-logo', date: 'Sep 2025', name: 'Crowdsourcing Logo Design', points: ['Asked art students for new logo ideas'] },
  { id: 'back-to-ash', date: 'Sep 2025', name: 'Back to ASH', points: ['Let kids drive our robot', 'Inspired an interest in robotics in 50+ kids'] },
  { id: 'es-robotics-beginner', date: 'Oct–Dec 2025', name: 'ES Robotics: Beginner', points: ['10-week program', 'Taught robotics & engineering skills to elementary students'] },
  { id: 'ish-visit', date: 'Dec 2025', name: 'ISH Visit', points: ['Invited ISH’s engineering team to inspire them to start an FTC team by letting them drive two robots in matches'] },
  { id: 'the-hague-techfest', date: 'Jan 2026', name: 'The Hague Techfest', points: ['Presented FIRST to 700+ professionals', 'Connected with passionate robotics founders'] },
  { id: 'hosted-scrimmage', date: 'Jan 2026', name: 'Hosted Scrimmage', points: ['Hosted an FTC scrimmage at our school', '7 FTC teams attended'] },
  { id: 'es-robotics-advanced', date: 'Feb–Mar 2026', name: 'ES Robotics: Advanced', points: ['10-week program', 'Taught modeling & programming to elementary students'] },
  { id: 'es-robotics-programming', date: 'Apr–Jun 2026', name: 'ES Robotics: Programming', points: ['10-week program', 'Taught Python through projects during each lesson'] },
  { id: 'robotics-showcase', date: 'Jun 2026', name: 'Robotics Showcase', points: ['Showcased our robot at the Microsoft Dreamspace hackathon at ASH', 'Inspired 35 Dutch middle school kids'] },
];

export interface PhotoPlaceholder {
  id: string;
  caption: string;
}

export const outreachPhotos: PhotoPlaceholder[] = [
  { id: 'photo-1', caption: 'The Hague TechFest' },
  { id: 'photo-2', caption: 'Dutch Student Workshop' },
  { id: 'photo-3', caption: 'Green Impact Initiative — Bike Shredder' },
  { id: 'photo-4', caption: 'ASH Activities Fair' },
  { id: 'photo-5', caption: 'ES Robotics Program' },
  { id: 'photo-6', caption: 'Makerdays Eindhoven' },
  { id: 'photo-7', caption: 'Hosted Scrimmage' },
  { id: 'photo-8', caption: 'STEM Expo' },
  { id: 'photo-9', caption: 'Robotics Showcase' },
  { id: 'photo-10', caption: 'Back to ASH' },
  { id: 'photo-11', caption: 'ISH Visit' },
  { id: 'photo-12', caption: 'Trick or Trunk' },
];
