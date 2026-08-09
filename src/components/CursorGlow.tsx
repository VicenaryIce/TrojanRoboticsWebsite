import { useEffect, useRef } from 'react';
import './CursorGlow.css';

interface CursorGlowProps {
  /** Diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Ambient radial glow that trails the cursor within its nearest positioned
 * ancestor. Position is tracked via a single window pointermove listener and
 * eased toward on every rAF tick by mutating the blob's style directly —
 * no React state per move event, so this never triggers a re-render.
 */
export default function CursorGlow({ size = 380, className = '' }: CursorGlowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const handleMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.1;
      current.current.y += (target.current.y - current.current.y) * 0.1;
      const glow = glowRef.current;
      if (glow) {
        glow.style.left = `${current.current.x}%`;
        glow.style.top = `${current.current.y}%`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={rootRef} className={`cursor-glow ${className}`} aria-hidden="true">
      <div ref={glowRef} className="cursor-glow__blob" style={{ width: size, height: size }} />
    </div>
  );
}
