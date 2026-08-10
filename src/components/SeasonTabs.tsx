import { seasonList } from '../config/seasons';
import { useSeason } from '../context/SeasonContext';
import './SeasonTabs.css';

export default function SeasonTabs() {
  const { season, setSeason } = useSeason();

  return (
    <div className="season-tabs" role="tablist" aria-label="Select season">
      {seasonList.map((s) => (
        <button
          key={s.id}
          role="tab"
          aria-selected={s.id === season}
          className={`season-tab ${s.id === season ? 'season-tab--active' : ''}`}
          onClick={() => setSeason(s.id)}
        >
          <span className="season-tab-label">{s.label}</span>
          <span className="season-tab-year">{s.year}</span>
        </button>
      ))}
    </div>
  );
}
