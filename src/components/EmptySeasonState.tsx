import './EmptySeasonState.css';

interface EmptySeasonStateProps {
  seasonLabel: string;
  title?: string;
  message?: string;
  className?: string;
}

export default function EmptySeasonState({
  seasonLabel,
  title,
  message,
  className = '',
}: EmptySeasonStateProps) {
  return (
    <div className={`empty-season-state placeholder-box ${className}`}>
      <ClockIcon />
      <h3 className="empty-season-state__title">{title ?? `${seasonLabel} hasn't kicked off yet`}</h3>
      <p className="empty-season-state__message">
        {message ?? `Check back once the ${seasonLabel} season is underway.`}
      </p>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
