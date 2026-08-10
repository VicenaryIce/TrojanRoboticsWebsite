import AccordionGallery from './AccordionGallery';
import CircularGallery from './CircularGallery';
import EmptySeasonState from './EmptySeasonState';
import SeasonTabs from './SeasonTabs';
import { outreachBySeason } from '../config/outreach';
import { seasonList } from '../config/seasons';
import { useSeason } from '../context/SeasonContext';
import './Outreach.css';

export default function Outreach() {
  const { season } = useSeason();
  const content = outreachBySeason[season];
  const seasonLabel = seasonList.find((s) => s.id === season)?.label ?? season;

  const courseGalleryItems =
    content?.courseTracks.map((track) => ({
      id: track.id,
      label: track.name,
      points: track.points,
    })) ?? [];

  return (
    <section id="outreach" className="section outreach">
      <div className="container">
        <p className="eyebrow">Outreach</p>
        <h2 className="section-title">
          Reaching <span className="glow-text">Beyond the Field</span>
        </h2>

        <SeasonTabs />

        {!content ? (
          <EmptySeasonState seasonLabel={seasonLabel} />
        ) : (
          <>
            <ul className="outreach__goals">
              {content.goals.map((goal, i) => (
                <li key={i} className="outreach__goal">
                  <span className="outreach__goal-index">{String(i + 1).padStart(2, '0')}</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>

            <div className="outreach__stat-block">
              <div className="outreach__stat-headline">
                <span className="outreach__stat-value glow-text">{content.totalReach.value}</span>
                <span className="outreach__stat-label">{content.totalReach.label}</span>
                <span className="outreach__stat-note">{content.totalReach.note}</span>
              </div>
              <div className="outreach__breakdown">
                {content.reachBreakdown.map((b) => (
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
                {content.highImpactEvents.map((e) => (
                  <div key={e.id} className="outreach__event-card card">
                    <h4>{e.name}</h4>
                    <p>{e.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="outreach__photos">
              <h3 className="outreach__subtitle">From the Field</h3>
              <div className="outreach__gallery">
                <CircularGallery
                  items={content.galleryItems}
                  bend={3}
                  textColor="#ffffff"
                  borderRadius={0.05}
                  scrollEase={0.06}
                  font="bold 30px Poppins, sans-serif"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
