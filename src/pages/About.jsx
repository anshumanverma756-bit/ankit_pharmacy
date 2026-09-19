import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';

const STACK = [
  ['React 19 + Vite', 'Fast dev server, tiny production build.'],
  ['React Router', 'Client-side routing across 12 routes.'],
  ['Framer Motion', 'Page transitions, staggered reveals, layout animation.'],
  ['Tesseract.js', 'WebAssembly OCR running entirely in the browser.'],
  ['Context + localStorage', 'Cart, saved items, addresses and theme persist with no backend.'],
  ['Plain CSS variables', 'One token set drives both themes — no utility framework.'],
];

export default function About() {
  useEffect(() => { document.title = 'About — ANKIT PHARMACY'; }, []);
  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">About</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 10px' }}>
          A pharmacy front-end, <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>built in the open.</em>
        </h1>
      </Reveal>

      <div className="prose" style={{ maxWidth: '68ch', marginTop: 24 }}>
        <p>
          ANKIT PHARMACY is a demonstration e-pharmacy interface. It exists to show three things that most
          storefront templates skip: live product data instead of a hard-coded array, a genuinely
          useful input method (photograph your prescription), and a dual-theme design system that
          isn't an afterthought.
        </p>
        <h3>What it does not do</h3>
        <ul>
          <li>It does not sell, dispense or deliver medicine.</li>
          <li>It does not take payments — the checkout downloads a JSON summary.</li>
          <li>It does not verify prescriptions, and it gives no medical advice.</li>
          <li>Catalogue prices are illustrative until a real medicine API is connected.</li>
        </ul>
        <p>
          Always speak to a registered pharmacist or your doctor before taking, changing or stopping
          any medication.
        </p>
        <h3>Built with</h3>
      </div>

      <div className="bento" style={{ marginTop: 18 }}>
        {STACK.map(([t, b], i) => (
          <Reveal key={t} delay={i * 0.05} className="tile-md">
            <div className="tile" style={{ height: '100%' }}>
              <h3 style={{ marginTop: 0 }}>{t}</h3>
              <p>{b}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="tile tile-accent" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ font: '600 1.8rem var(--font-display)', marginBottom: 12 }}>Browse the catalogue</h3>
          <p className="muted" style={{ marginBottom: 22 }}>Full detail pages, substitutes and refill scheduling.</p>
          <Link to="/catalog" className="btn btn-primary">Open catalogue</Link>
        </div>
      </Reveal>
    </div>
  );
}
