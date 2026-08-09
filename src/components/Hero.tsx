import { sponsors } from '../config/team';
import './Hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="container hero__content">
        <p className="hero__kicker">FIRST TECH CHALLENGE · TEAM 24090</p>
        <h1 className="hero__title">
          <span className="hero__title-line hero__title-line--team">TEAM 24090</span>
          <span className="hero__title-line hero__title-line--name glow-text">TROJAN ROBOTICS</span>
        </h1>
        <div className="hero__tag pill">Sunspot V3</div>
        <p className="hero__subtext">
          Simple by design. Stronger together. Student-led robotics from the American School of The Hague.
        </p>
        <div className="hero__actions">
          <a
            href="#robots"
            className="btn btn-solid"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('robots')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Meet the Robots
          </a>
          <a
            href="#about"
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            About the Team
          </a>
        </div>
      </div>

      <div className="hero__sponsors">
        <div className="container">
          <p className="hero__sponsors-label">Sponsors &amp; Partners</p>
          <div className="hero__sponsors-strip">
            {sponsors.map((s) => (
              <div key={s.id} className="hero__sponsor-logo" title={s.name}>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
