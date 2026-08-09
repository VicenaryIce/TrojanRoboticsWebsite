import { mentors } from '../config/mentors';
import './Mentors.css';

export default function Mentors() {
  return (
    <section id="mentors" className="section mentors">
      <div className="container">
        <p className="eyebrow">Mentors</p>
        <h2 className="section-title">
          Our <span className="glow-text">Mentors</span>
        </h2>
        <p className="section-lede">
          The experts and partners who help us think bigger, build smarter, and grow as a team.
        </p>

        <div className="mentors__grid">
          {mentors.map((m) => (
            <div key={m.id} className="mentors__card card">
              <div className="mentors__photo placeholder-box">
                <PersonIcon />
              </div>
              <h3 className="mentors__name">{m.name}</h3>
              <p className="mentors__specialty">{m.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4.5 20c1.4-3.7 4.3-5.5 7.5-5.5s6.1 1.8 7.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
