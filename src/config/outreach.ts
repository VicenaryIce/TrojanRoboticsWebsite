import type { SeasonId } from './seasons';
import { formatImageLabel } from '../utils/formatImageLabel';

export interface CourseTrack {
  id: string;
  name: string;
  points: string[];
}

export interface ReachBreakdown {
  medium: string;
  people: string;
}

export interface HighImpactEvent {
  id: string;
  name: string;
  description: string;
}

export interface GalleryItem {
  image: string;
  text: string;
}

export interface OutreachSeasonContent {
  goals: string[];
  courseTracks: CourseTrack[];
  reachBreakdown: ReachBreakdown[];
  totalReach: { value: string; label: string; note: string };
  highImpactEvents: HighImpactEvent[];
  /** Feeds CircularGallery's `items` prop under "From the Field". */
  galleryItems: GalleryItem[];
}

// Real outreach event photos live in src/assets/images (see scripts/convert-heic.js
// for the HEIC → JPG conversion step). _originals/ holds the pre-conversion HEIC
// files and is excluded by this single-level glob.
const outreachImageModules = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{jpg,jpeg,png}',
  { eager: true }
);

const outreachGalleryItems: GalleryItem[] = Object.entries(outreachImageModules).map(
  ([filePath, mod]) => {
    const filename = filePath.split('/').pop() ?? filePath;
    return { image: mod.default, text: formatImageLabel(filename) };
  }
);

export const outreachBySeason: Record<SeasonId, OutreachSeasonContent | null> = {
  decode: {
    goals: [
      'Get people involved and inspired by robotics',
      'Increase community exposure to FIRST and make it loud',
      'Teach people robotics & engineering skills',
    ],
    courseTracks: [
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
    ],
    reachBreakdown: [
      { medium: 'Instagram', people: '22,096' },
      { medium: 'Makerdays Eindhoven', people: '5,000+' },
      { medium: 'bASH', people: '50+' },
      { medium: 'Elementary Robotics Program', people: '25' },
      { medium: 'TikTok', people: '2,909' },
      { medium: 'Techfest', people: '700+' },
      { medium: 'Maker Faire Delft', people: '2,000+' },
    ],
    totalReach: {
      value: '30,000+',
      label: 'People Reached',
      note: '300%+ increase from last year',
    },
    highImpactEvents: [
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
    ],
    galleryItems: outreachGalleryItems,
  },
  biobuzz: null,
};
