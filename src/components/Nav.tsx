import { useEffect, useState } from 'react';
import { navSections } from '../config/nav';
import { useActiveSection } from '../hooks/useActiveSection';
import './Nav.css';

export default function Nav() {
  const activeId = useActiveSection(navSections.map((s) => s.id));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#hero" className="nav__brand" onClick={(e) => handleClick(e, 'hero')}>
          <span className="nav__brand-number">24090</span>
          <span className="nav__brand-name">TROJAN ROBOTICS</span>
        </a>

        <button
          className={`nav__toggle ${menuOpen ? 'nav__toggle--open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
          {navSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`nav__link ${activeId === s.id ? 'nav__link--active' : ''}`}
              onClick={(e) => handleClick(e, s.id)}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
