import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
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
  /** Whole-wall base rotateX, in degrees. */
  tilt?: number;
  /** Whole-wall base rotateZ, in degrees. */
  turn?: number;
  perspective?: number;
  /** Per-column depth stagger (translateZ), in px. */
  depth?: number;
  /** Drift speed in px/second. */
  speed?: number;
  direction?: 'up' | 'down';
  /** Fractional per-column speed jitter (0-1). */
  variance?: number;
  /** Max additional pointer-tracked tilt, in degrees (0 disables the effect). */
  parallax?: number;
  /** Hover-lift distance for the active tile, in px (translateZ via --dw-lift). */
  lift?: number;
  /** Edge fade strength (0 = off). */
  fade?: number;
  /** Ambient tint overlay strength (0-1), blends the wall into the page background. */
  dim?: number;
  overlayColor?: string;
  radius?: number;
  /** Continuous slow tile hue roll in degrees/loop (0 = off). */
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
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const target = useRef({ rx: 0, ry: 0 });
  const current = useRef({ rx: 0, ry: 0 });
  const rafId = useRef<number | null>(null);

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

  // Whole-plane pointer-parallax tilt: eased toward the pointer position every
  // rAF tick and written straight to the DOM via ref, same no-per-event-state
  // pattern as CursorGlow — a CSS transition here would fight the per-frame
  // updates and read as laggy, so the plane is intentionally left untransitioned.
  useEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane || parallax <= 0 || prefersReduced) return;

    const handleMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.current = { rx: -ny * parallax, ry: nx * parallax };
    };
    const handleLeave = () => {
      target.current = { rx: 0, ry: 0 };
    };

    root.addEventListener('pointermove', handleMove);
    root.addEventListener('pointerleave', handleLeave);

    const tick = () => {
      current.current.rx += (target.current.rx - current.current.rx) * 0.08;
      current.current.ry += (target.current.ry - current.current.ry) * 0.08;
      plane.style.transform = `rotateX(${tilt + current.current.rx}deg) rotateY(${current.current.ry}deg) rotateZ(${turn}deg)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener('pointermove', handleMove);
      root.removeEventListener('pointerleave', handleLeave);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [tilt, turn, parallax, prefersReduced]);

  return (
    <div
      ref={rootRef}
      className={`driftwall ${className}`}
      style={
        {
          '--dw-radius': `${radius}px`,
          '--dw-lift': `${lift}px`,
          perspective: `${perspective}px`,
        } as CSSProperties
      }
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        ref={planeRef}
        className="driftwall__grid"
        style={{
          transform: `rotateX(${tilt}deg) rotateY(0deg) rotateZ(${turn}deg)`,
          gap: `${gap}px`,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        {columnData.map((colItems, i) => {
          const contentHeight = colItems.length * tileHeight + (colItems.length - 1) * gap;
          const jitter = 1 + variance * (seeded(i) * 2 - 1);
          const durationSeconds = Math.max(6, (contentHeight / Math.max(speed, 1)) * jitter);
          const z = (depth * (i - (columns - 1) / 2)) / Math.max(columns, 1);

          return (
            <div
              key={i}
              className="driftwall__column"
              style={{ width: `${tileWidth}px`, transform: `translateZ(${z}px)` }}
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
                {(prefersReduced ? colItems : [...colItems, ...colItems]).map((item, ti) => {
                  const key = `${i}-${ti}`;
                  return (
                    <Tile
                      key={ti}
                      item={item}
                      width={tileWidth}
                      height={tileHeight}
                      grayscale={grayscale}
                      roll={roll}
                      active={activeKey === key}
                      onActivate={() => setActiveKey(key)}
                      onDeactivate={() => setActiveKey((k) => (k === key ? null : k))}
                    />
                  );
                })}
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
  active,
  onActivate,
  onDeactivate,
}: {
  item: DriftWallItem;
  width: number;
  height: number;
  grayscale: boolean;
  roll: number;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
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

  const cls = `driftwall__tile ${roll > 0 ? 'driftwall__tile--roll' : ''} ${active ? 'is-active' : ''}`;
  const handlers = {
    onMouseEnter: onActivate,
    onMouseLeave: onDeactivate,
    onFocus: onActivate,
    onBlur: onDeactivate,
  };

  return item.href ? (
    <a href={item.href} className={cls} style={style} target="_blank" rel="noreferrer" {...handlers}>
      {content}
    </a>
  ) : (
    <div className={cls} style={style} tabIndex={0} {...handlers}>
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
