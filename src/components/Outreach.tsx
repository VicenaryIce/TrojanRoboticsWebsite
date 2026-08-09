import AccordionGallery from './AccordionGallery';
import DriftWall from './DriftWall';
import {
  courseTracks,
  highImpactEvents,
  outreachGoals,
  outreachPhotos,
  reachBreakdown,
  totalReach,
} from '../config/outreach';
import './Outreach.css';

const courseGalleryItems = courseTracks.map((track) => ({
  id: track.id,
  label: track.name,
  points: track.points,
}));

// TODO: swap in real event photos — outreachPhotos currently only carries
// captions, no image URLs, so DriftWall falls back to styled placeholders.
const driftWallItems = outreachPhotos.map((p) => ({ title: p.caption }));

export default function Outreach() {
  return (
    <section id="outreach" className="section outreach">
      <div className="container">
        <p className="eyebrow">Outreach</p>
        <h2 className="section-title">
          Reaching <span className="glow-text">Beyond the Field</span>
        </h2>

        <ul className="outreach__goals">
          {outreachGoals.map((goal, i) => (
            <li key={i} className="outreach__goal">
              <span className="outreach__goal-index">{String(i + 1).padStart(2, '0')}</span>
              <span>{goal}</span>
            </li>
          ))}
        </ul>

        <div className="outreach__stat-block">
          <div className="outreach__stat-headline">
            <span className="outreach__stat-value glow-text">{totalReach.value}</span>
            <span className="outreach__stat-label">{totalReach.label}</span>
            <span className="outreach__stat-note">{totalReach.note}</span>
          </div>
          <div className="outreach__breakdown">
            {reachBreakdown.map((b) => (
              <div key={b.medium} className="outreach__breakdown-item">
                <span className="outreach__breakdown-value">{b.people}</span>
                <span className="outreach__breakdown-label">{b.medium}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="outreach__courses">
          <h3 className="outreach__subtitle">Elementary School Robotics Courses</h3>
          <AccordionGallery items={courseGalleryItems} defaultIndex={0} height={420} />
        </div>

        <div className="outreach__events">
          <h3 className="outreach__subtitle">High-Impact Events</h3>
          <div className="outreach__event-grid">
            {highImpactEvents.map((e) => (
              <div key={e.id} className="outreach__event-card card">
                <h4>{e.name}</h4>
                <p>{e.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="outreach__photos">
          <h3 className="outreach__subtitle">From the Field</h3>
          <div className="outreach__driftwall">
            <DriftWall
              items={driftWallItems}
              columns={5}
              tileWidth={180}
              tileHeight={120}
              gap={16}
              tilt={14}
              turn={-2}
              perspective={2200}
              depth={18}
              speed={30}
              direction="up"
              variance={0.45}
              parallax={0.5}
              lift={50}
              fade={1}
              dim={0.55}
              overlayColor="#0a0a0a"
              radius={12}
              pauseOnHover
              grayscale
            />
          </div>
        </div>
      </div>
    </section>
  );
}
