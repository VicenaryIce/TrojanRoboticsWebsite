import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import './DriftWall.css';

export interface DriftWallItem {
  /** Photo URL — omit to render a styled placeholder tile instead. */
  image?: string;
  title: string;
  href?: string;
}

interface DriftWallProps {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  /** Whole-wall rotateX, in degrees. */
  tilt?: number;
  /** Whole-wall rotateZ, in degrees. */
  turn?: number;
  perspective?: number;
  /** Per-column depth stagger (translateZ), in px. */
  depth?: number;
  /** Drift speed in px/second. */
  speed?: number;
  direction?: 'up' | 'down';
  /** Fractional per-column speed jitter (0-1). */
  variance?: number;
  /** Extra speed differential between center and edge columns (0-1). */
  parallax?: number;
  /** Alternating per-column vertical stagger, in px. */
  lift?: number;
  /** Edge fade strength (0 = off). */
  fade?: number;
  /** Dark tint overlay strength (0-1). */
  dim?: number;
  overlayColor?: string;
  radius?: number;
  /** Continuous slow tile rotation in degrees/loop (0 = off). */
  roll?: number;
  pauseOnHover?: boolean;
  grayscale?: boolean;
  className?: string;
}

function useResponsiveColumns(desired: number) {
  const [columns, setColumns] = useState(desired);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 560) setColumns(Math.min(desired, 2));
      else if (w < 900) setColumns(Math.min(desired, 3));
      else setColumns(desired);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [desired]);

  return columns;
}

// Deterministic pseudo-random in [0, 1), seeded by index — stable across
// re-renders, no hydration/SSR mismatch concerns.
function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function DriftWall({
  items,
  columns: desiredColumns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -3,
  perspective = 2400,
  depth = 20,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0,
  dim = 1,
  overlayColor = '#0a0a0a',
  radius = 14,
  roll = 0,
  pauseOnHover = true,
  grayscale = false,
  className = '',
}: DriftWallProps) {
  const columns = useResponsiveColumns(desiredColumns);
  const [paused, setPaused] = useState(false);
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const columnData = useMemo(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.filter((c) => c.length > 0);
  }, [items, columns]);

  const maskImage =
    fade > 0
      ? `linear-gradient(to bottom, transparent 0%, black ${fade * 20}%, black ${100 - fade * 20}%, transparent 100%)`
      : undefined;

  return (
    <div
      className={`driftwall ${className}`}
      style={{ '--dw-radius': `${radius}px`, perspective: `${perspective}px` } as CSSProperties}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        className="driftwall__grid"
        style={{
          transform: `rotateX(${tilt}deg) rotateZ(${turn}deg)`,
          gap: `${gap}px`,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {columnData.map((colItems, i) => {
          const contentHeight = colItems.length * tileHeight + (colItems.length - 1) * gap;
          const centerDist = columns > 1 ? Math.abs(i / (columns - 1) - 0.5) * 2 : 0;
          const parallaxMultiplier = 1 + parallax * (0.5 - centerDist);
          const jitter = 1 + variance * (seeded(i) * 2 - 1);
          const durationSeconds = Math.max(6, (contentHeight / Math.max(speed, 1)) * jitter / parallaxMultiplier);
          const z = depth * (i - (columns - 1) / 2) / Math.max(columns, 1);
          const yStagger = i % 2 === 1 ? lift : 0;

          return (
            <div
              key={i}
              className="driftwall__column"
              style={{ width: `${tileWidth}px`, transform: `translateZ(${z}px) translateY(${yStagger}px)` }}
            >
              <div
                className={`driftwall__track ${prefersReduced ? 'driftwall__track--static' : ''} ${
                  paused ? 'driftwall__track--paused' : ''
                }`}
                style={{
                  gap: `${gap}px`,
                  animationDuration: `${durationSeconds}s`,
                  animationDirection: direction === 'down' ? 'reverse' : 'normal',
                }}
              >
                {(prefersReduced ? colItems : [...colItems, ...colItems]).map((item, ti) => (
                  <Tile
                    key={ti}
                    item={item}
                    width={tileWidth}
                    height={tileHeight}
                    grayscale={grayscale}
                    roll={roll}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {dim > 0 && (
        <div
          className="driftwall__overlay"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, ${overlayColor} 100%)`,
            opacity: dim,
          }}
        />
      )}
    </div>
  );
}

function Tile({
  item,
  width,
  height,
  grayscale,
  roll,
}: {
  item: DriftWallItem;
  width: number;
  height: number;
  grayscale: boolean;
  roll: number;
}) {
  const content = (
    <>
      {item.image ? (
        <img src={item.image} alt="" draggable={false} className={grayscale ? 'driftwall__img--gray' : ''} />
      ) : (
        <span className="driftwall__placeholder">
          {/* TODO: swap in a real event photo */}
          <PhotoIcon />
        </span>
      )}
      <span className="driftwall__caption">{item.title}</span>
    </>
  );

  const style: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    animationDuration: roll > 0 ? `${Math.max(20, 3600 / roll)}s` : undefined,
  };

  return item.href ? (
    <a
      href={item.href}
      className={`driftwall__tile ${roll > 0 ? 'driftwall__tile--roll' : ''}`}
      style={style}
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div className={`driftwall__tile ${roll > 0 ? 'driftwall__tile--roll' : ''}`} style={style}>
      {content}
    </div>
  );
}

function PhotoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16l5-4 4 3 3-2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
