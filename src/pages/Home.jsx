import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ScanLine, Activity, Repeat, Truck, Moon, Database, ShieldCheck } from 'lucide-react';
import Reveal, { Stagger, Item } from '../components/Reveal.jsx';
import MedCard from '../components/MedCard.jsx';
import { CATALOG, CATEGORIES } from '../data/catalog.js';

const STATS = [
  ['2 hr', 'Express delivery window'],
  ['30s', 'Prescription to basket'],
  ['24/7', 'Pharmacist desk'],
  ['100%', 'Client-side, no tracking'],
];

const TILES = [
  { icon: ScanLine, title: 'Scan a prescription', body: 'Upload a photo of your Rx. On-device OCR reads it and matches each drug to a priced product — no server sees your document.', to: '/prescription', big: true, accent: true },
  { icon: Database, title: 'Every medicine, detailed', body: 'Tap any product for uses, dosage, side effects, safety advice and cheaper generic substitutes on the same salt.', to: '/catalog', big: true },
  { icon: Repeat, title: 'Chronic refills', body: 'Schedule 30/60/90-day reminders and re-order in one tap.', to: '/account' },
  { icon: Moon, title: 'Dark & light', body: 'A true dual-theme interface that remembers your choice.', to: '/catalog' },
  { icon: Truck, title: 'Cold chain', body: 'Temperature-controlled handling for sensitive products.', to: '/policy/cold-chain' },
  { icon: ShieldCheck, title: 'Rx verification', body: 'Prescription-only items are flagged before checkout.', to: '/policy/rx' },
];

export default function Home() {
  const featured = CATALOG.slice(0, 8);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="shell">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Apothecary · reimagined for the browser
          </motion.p>

          <motion.h1
            className="display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
          >
            Your pharmacy,<br />
            <em>read from the source.</em>
          </motion.h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            A complete pharmacy front-end: a searchable catalogue with full product detail pages,
            on-device prescription scanning, chronic-care refill management and an order history —
            all ready for your medicine API to drop straight in.
          </motion.p>

          <motion.div className="hero-cta" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}>
            <Link to="/prescription" className="btn btn-primary"><ScanLine size={17} /> Scan a prescription</Link>
            <Link to="/catalog" className="btn btn-ghost"><Activity size={17} /> Browse medicines</Link>
          </motion.div>

          <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}>
            {STATS.map(([n, l]) => (
              <div key={l}>
                <div className="stat-n display">{n}</div>
                <div className="stat-l">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- Bento ---------- */}
      <div className="shell">
        <Stagger className="bento">
          {TILES.map((t, i) => (
            <Item key={t.title} className={t.big ? 'tile-lg' : 'tile-sm'}>
              <Link to={t.to} className={`tile ${t.accent ? 'tile-accent' : ''}`} style={{ display: 'block', height: '100%' }}>
                <span className="tile-icon"><t.icon size={22} /></span>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--mint)', fontSize: '.82rem', fontWeight: 600 }}>
                  Open <ArrowRight size={14} />
                </span>
              </Link>
            </Item>
          ))}
        </Stagger>
      </div>

      {/* ---------- Categories ---------- */}
      <section className="block" style={{ background: 'var(--bg-2)', borderBlock: '1px solid var(--line-soft)' }}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Browse by shelf</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.8rem)', margin: '12px 0 28px' }}>
              Seven shelves, <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>one counter.</em>
            </h2>
          </Reveal>
          <Stagger className="filters" gap={0.04}>
            {CATEGORIES.map((c) => (
              <Item key={c.id}>
                <Link to={`/catalog?c=${c.id}`} className="chip">{c.label}</Link>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="block">
        <div className="shell">
          <div className="sec-head">
            <div>
              <p className="eyebrow">From the counter</p>
              <h2 className="display">Frequently <em>dispensed.</em></h2>
            </div>
            <Link to="/catalog" className="btn btn-ghost">View all medicines <ArrowRight size={15} /></Link>
          </div>

          <Stagger className="grid-meds" gap={0.05}>
            {featured.map((m) => (
              <Item key={m.id}><MedCard med={m} /></Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="block">
        <div className="shell">
          <Reveal>
            <div className="tile tile-accent" style={{ padding: '54px 42px', textAlign: 'center' }}>
              <p className="eyebrow">The feature the original didn't have</p>
              <h2 className="display" style={{ fontSize: 'clamp(1.9rem,4vw,3.2rem)', margin: '14px 0 16px' }}>
                Photograph the paper.<br />Get the whole basket.
              </h2>
              <p className="muted" style={{ maxWidth: '56ch', margin: '0 auto 28px' }}>
                Tesseract runs entirely in your browser, extracts every drug name it can read,
                resolves each one against the catalogue and shows you the running total before you commit.
              </p>
              <Link to="/prescription" className="btn btn-primary"><ScanLine size={17} /> Try the scanner</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
