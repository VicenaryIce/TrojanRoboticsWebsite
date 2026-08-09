import { lazy, Suspense, useState } from 'react';
import { robots } from '../config/robots';
import { useInView } from '../hooks/useInView';
import './Robots.css';

// Code-split the whole @react-three/fiber + drei + three.js stack away from
// the main bundle — it's only pulled in once this section is in view.
const ModelViewer = lazy(() => import('./ModelViewer'));

export default function Robots() {
  const [selectedId, setSelectedId] = useState(robots[0]?.id ?? '');
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '300px' });

  const selected = robots.find((r) => r.id === selectedId) ?? robots[0];

  if (!selected) return null;

  return (
    <section id="robots" className="section robots" ref={ref}>
      <div className="container">
        <p className="eyebrow">The Robots</p>
        <h2 className="section-title">
          Meet <span className="glow-text">Sunspot</span>
        </h2>
        <p className="section-lede">
          Drag to spin, scroll or pinch to zoom. Switch between builds using the selector below.
        </p>

        <div className="robots__switcher" role="tablist" aria-label="Select robot">
          {robots.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={r.id === selectedId}
              className={`robots__tab ${r.id === selectedId ? 'robots__tab--active' : ''}`}
              onClick={() => setSelectedId(r.id)}
            >
              <span className="robots__tab-thumb">{r.thumbnailLabel}</span>
              <span className="robots__tab-text">
                <span className="robots__tab-name">{r.name}</span>
                <span className="robots__tab-tagline">{r.tagline}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="robots__layout">
          <div className="robots__viewer">
            {inView ? (
              <Suspense fallback={<div className="robots__viewer-fallback">Loading viewer…</div>}>
                <ModelViewer url={selected.glbUrl} className="robots__canvas" />
              </Suspense>
            ) : (
              <div className="robots__viewer-fallback">Scroll to load 3D viewer</div>
            )}
          </div>

          <div className="robots__panel">
            <div className="robots__panel-header">
              <h3 className="robots__panel-name">{selected.name}</h3>
              <span className="pill">{selected.version}</span>
            </div>
            <p className="robots__panel-tagline">{selected.tagline}</p>

            {selected.description ? (
              <p className="robots__panel-desc">{selected.description}</p>
            ) : (
              <div className="robots__panel-desc robots__panel-desc--placeholder">
                {/* TODO: robot description */}
                Description coming soon.
              </div>
            )}

            <div className="robots__stats">
              {selected.stats.map((s) => (
                <div key={s.label} className="robots__stat-chip">
                  <span className="robots__stat-label">{s.label}</span>
                  <span
                    className={`robots__stat-value ${s.value === 'TODO' ? 'robots__stat-value--todo' : ''}`}
                  >
                    {s.value === 'TODO' ? 'TBD' : s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
