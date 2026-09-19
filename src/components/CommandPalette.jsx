import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { CATALOG, inr } from '../data/catalog.js';

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, addToCart } = useApp();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (paletteOpen) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [paletteOpen]);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return CATALOG.slice(0, 7);
    return CATALOG.filter((m) =>
      `${m.name} ${m.salt} ${m.manufacturer} ${m.category}`.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [q]);

  useEffect(() => setSel(0), [q]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => (s + 1) % Math.max(results.length, 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s - 1 + results.length) % Math.max(results.length, 1)); }
    if (e.key === 'Enter' && results[sel]) {
      navigate(`/catalog?q=${encodeURIComponent(results[sel].name)}`);
      setPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setPaletteOpen(false)}
          role="dialog" aria-modal="true" aria-label="Search medicines"
        >
          <motion.div
            className="palette"
            initial={{ y: -22, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-input">
              <Search size={19} style={{ color: 'var(--mint)' }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search by brand, salt or condition…"
                aria-label="Search medicines"
              />
              <kbd className="kbd">ESC</kbd>
            </div>

            <div className="palette-list">
              {results.length === 0 && (
                <p className="muted" style={{ padding: '26px 16px', textAlign: 'center', fontSize: '.9rem' }}>
                  No match in the catalogue. Try a different spelling or the salt name.
                </p>
              )}
              {results.map((m, i) => (
                <button
                  key={m.id}
                  className={`palette-row ${i === sel ? 'sel' : ''}`}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => { navigate(`/catalog?q=${encodeURIComponent(m.name)}`); setPaletteOpen(false); }}
                >
                  <span className="palette-thumb"><img src={m.image} alt="" /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '.92rem' }}>{m.name}</span>
                    <span className="muted" style={{ fontSize: '.76rem' }}>{m.salt}</span>
                  </span>
                  <span className="mono" style={{ fontSize: '.84rem' }}>{inr(m.price)}</span>
                  <span
                    className="icon-btn"
                    style={{ width: 30, height: 30, borderRadius: 8 }}
                    onClick={(e) => { e.stopPropagation(); addToCart(m); }}
                    role="button"
                    aria-label={`Add ${m.name} to bag`}
                  >
                    <Plus size={14} />
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, padding: '12px 20px', borderTop: '1px solid var(--line-soft)', fontSize: '.7rem', color: 'var(--text-3)' }} className="mono">
              <span>↑↓ NAVIGATE</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><CornerDownLeft size={11} /> OPEN</span>
              <span style={{ marginLeft: 'auto' }}>{results.length} RESULTS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
