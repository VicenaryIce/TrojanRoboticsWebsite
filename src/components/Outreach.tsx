import {
  courseTracks,
  highImpactEvents,
  outreachGoals,
  outreachPhotos,
  reachBreakdown,
  totalReach,
} from '../config/outreach';
import './Outreach.css';

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
          <div className="outreach__course-grid">
            {courseTracks.map((track) => (
              <div key={track.id} className="outreach__course-card card">
                <span className="pill">{track.name}</span>
                <ul>
                  {track.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
          <div className="outreach__photo-grid">
            {outreachPhotos.map((p) => (
              <div key={p.id} className="outreach__photo placeholder-box">
                <PhotoIcon />
                <span>Photo</span>
                <span className="outreach__photo-caption">{p.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16l5-4 4 3 3-2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
