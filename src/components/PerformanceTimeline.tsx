import { useEffect, useMemo, useRef, useState } from 'react';
import type { Award } from '../config/team';
import './PerformanceTimeline.css';

interface PerformanceTimelineProps {
  awards: Award[];
}

// "Inspire Award", "Think Award", etc. are FTC's judged-category awards;
// everything else here (Winner, Division Placement, Alliance Captain) is a
// competition placement — the node fill (solid vs outlined) distinguishes them.
function isJudgedAward(title: string) {
  return /award/i.test(title);
}

type TimelineRow = { kind: 'year'; year: string } | { kind: 'entry'; year: string; award: Award };

const STAGGER_STEP_MS = 60;
const STAGGER_CAP = 10;

export default function PerformanceTimeline({ awards }: PerformanceTimelineProps) {
  // Source data is newest-first (the natural "recent achievements" read
  // order); the timeline itself reads chronologically, oldest to newest.
  const chronological = useMemo(() => [...awards].reverse(), [awards]);

  const rows = useMemo<TimelineRow[]>(() => {
    const out: TimelineRow[] = [];
    let lastYear: string | null = null;
    for (const award of chronological) {
      if (award.year !== lastYear) {
        out.push({ kind: 'year', year: award.year });
        lastYear = award.year;
      }
      out.push({ kind: 'entry', year: award.year, award });
    }
    return out;
  }, [chronological]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<Set<number>>(new Set());

  useEffect(() => {
    setVisible(new Set());
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-reveal-index]'));
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.revealIndex);
          setVisible((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rows]);

  return (
    <div className="perf-timeline" ref={containerRef}>
      {rows.map((row, i) => {
        const delay = `${Math.min(i, STAGGER_CAP) * STAGGER_STEP_MS}ms`;

        if (row.kind === 'year') {
          return (
            <div
              key={`year-${row.year}`}
              className={`perf-timeline__row perf-timeline__row--year ${visible.has(i) ? 'is-visible' : ''}`}
              data-reveal-index={i}
              style={{ transitionDelay: delay }}
            >
              <div className="perf-timeline__spine-col">
                <span className="perf-timeline__year-tick" />
              </div>
              <div className="perf-timeline__year-label">{row.year}</div>
            </div>
          );
        }

        const { award } = row;
        const judged = isJudgedAward(award.title);

        return (
          <div
            key={`${award.year}-${award.title}-${i}`}
            className={`perf-timeline__row ${visible.has(i) ? 'is-visible' : ''}`}
            data-reveal-index={i}
            style={{ transitionDelay: delay }}
          >
            <div className="perf-timeline__spine-col">
              <span
                className={`perf-timeline__node ${
                  judged ? 'perf-timeline__node--award' : 'perf-timeline__node--placement'
                }`}
              />
            </div>
            <div className="perf-timeline__card card">
              <div className="perf-timeline__card-head">
                <span className="perf-timeline__card-year glow-text">{award.year}</span>
                <span
                  className={`perf-timeline__badge ${
                    judged ? 'perf-timeline__badge--award' : 'perf-timeline__badge--placement'
                  }`}
                >
                  {judged ? 'Judged Award' : 'Placement'}
                </span>
              </div>
              <span className="perf-timeline__card-title">{award.title}</span>
              <span className="perf-timeline__card-event">{award.event}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
