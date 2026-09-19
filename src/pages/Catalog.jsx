import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import MedCard from '../components/MedCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { CATALOG, CATEGORIES } from '../data/catalog.js';

const SORTS = [
  ['relevance', 'Featured'],
  ['price-asc', 'Price: low → high'],
  ['price-desc', 'Price: high → low'],
  ['name', 'Name A–Z'],
  ['discount', 'Biggest saving'],
];

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [cat, setCat] = useState(params.get('c') || '');
  const [sort, setSort] = useState('relevance');
  const [rxOnly, setRxOnly] = useState(false);

  useEffect(() => { document.title = 'Medicines — ANKIT PHARMACY'; }, []);
  useEffect(() => { setQ(params.get('q') || ''); setCat(params.get('c') || ''); }, [params]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    let list = CATALOG.filter((m) => {
      const hay = `${m.name} ${m.salt} ${m.manufacturer} ${m.category}`.toLowerCase();
      return (!term || hay.includes(term)) && (!cat || m.category === cat) && (!rxOnly || m.rx);
    });
    const by = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
      discount: (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp,
    };
    return by[sort] ? [...list].sort(by[sort]) : list;
  }, [q, cat, sort, rxOnly]);

  const update = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    setParams(p, { replace: true });
  };

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">The catalogue</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 10px' }}>
          Every shelf, <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>searchable.</em>
        </h1>
        <p className="muted" style={{ maxWidth: '58ch', marginBottom: 32 }}>
          This view queries the bundled catalogue so it always works offline. For records pulled
          live from public drug registries, open the <strong>Live Data</strong> page.
        </p>
      </Reveal>

      {/* Search + sort */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <label className="search-trigger" style={{ flex: 1, minWidth: 250, cursor: 'text' }}>
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); update({ q: e.target.value }); }}
            placeholder="Search brand, salt or manufacturer…"
            style={{ flex: 1, background: 'none', border: 0, outline: 'none', color: 'var(--text)' }}
            aria-label="Search the catalogue"
          />
        </label>
        <label className="search-trigger" style={{ minWidth: 190, paddingRight: 6 }}>
          <SlidersHorizontal size={16} />
          <select
            value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ flex: 1, background: 'none', border: 0, outline: 'none', color: 'var(--text)', cursor: 'pointer' }}
            aria-label="Sort results"
          >
            {SORTS.map(([v, l]) => <option key={v} value={v} style={{ background: 'var(--bg-2)' }}>{l}</option>)}
          </select>
        </label>
      </div>

      {/* Category chips */}
      <div className="filters">
        <button className={`chip ${!cat ? 'on' : ''}`} onClick={() => { setCat(''); update({ c: '' }); }}>
          All ({CATALOG.length})
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => { setCat(c.id); update({ c: c.id }); }}>
            {c.label}
          </button>
        ))}
        <button className={`chip ${rxOnly ? 'on' : ''}`} onClick={() => setRxOnly((v) => !v)}>
          Rx only
        </button>
      </div>

      <p className="mono muted" style={{ fontSize: '.74rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20 }}>
        {results.length} product{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <div className="empty">
          <h3>No match in the local catalogue</h3>
          <p>Try a different spelling, clear the filters, or search the live registries instead.</p>
        </div>
      ) : (
        <motion.div className="grid-meds" layout>
          <AnimatePresence mode="popLayout">
            {results.map((m) => (
              <motion.div
                key={m.id} layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
              >
                <MedCard med={m} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
