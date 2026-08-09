import { awards, demographics, mission } from '../config/team';
import './About.css';

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about__grid">
          <div className="about__intro">
            <p className="eyebrow">About / Mission</p>
            <h2 className="section-title">
              <span className="glow-text">{mission.slogan}</span>
            </h2>
            <p className="section-lede">{mission.subline}</p>

            <div className="about__demographics">
              {demographics.map((d) => (
                <div key={d.label} className="stat-card card">
                  <span className="stat-card__value glow-text">{d.value}</span>
                  <span className="stat-card__label">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about__photo placeholder-box">
            <PhotoIcon />
            <span>Team Photo</span>
            <span className="about__photo-hint">Drop team photo here</span>
          </div>
        </div>

        <div className="about__history">
          <p className="eyebrow">Performance History</p>
          <ol className="timeline">
            {awards.map((a, i) => (
              <li key={i} className="timeline__item">
                <div className="timeline__dot" />
                <div className="timeline__content">
                  <span className="timeline__year">{a.year}</span>
                  <span className="timeline__title">{a.title}</span>
                  <span className="timeline__event">{a.event}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function PhotoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16l5-4 4 3 3-2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
