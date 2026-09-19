import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Heart, Minus, Plus, ShieldCheck, Truck, RotateCcw, Thermometer,
  ChevronLeft, AlertTriangle, Repeat, Check,
} from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import MedCard from '../components/MedCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { getMedicine } from '../api/medicines.js';
import { inr, substitutesFor, relatedTo, CATEGORIES } from '../data/catalog.js';

const TABS = [
  ['uses', 'Uses & benefits'],
  ['directions', 'How to take it'],
  ['side', 'Side effects'],
  ['safety', 'Safety advice'],
];

export default function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWish, wishlist, setCartOpen } = useApp();
  const [med, setMed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('uses');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getMedicine(id).then((m) => {
      if (!alive) return;
      setMed(m);
      setLoading(false);
      setQty(1);
      setTab('uses');
      if (m) document.title = `${m.name} — ANKIT PHARMACY`;
    });
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="shell" style={{ padding: '46px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 28 }}>
          <div className="skel" style={{ aspectRatio: '1', borderRadius: 'var(--r-lg)' }} />
          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <div className="skel" style={{ height: 14, width: '40%' }} />
            <div className="skel" style={{ height: 34, width: '80%' }} />
            <div className="skel" style={{ height: 14, width: '60%' }} />
            <div className="skel" style={{ height: 90 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!med) {
    return (
      <div className="shell">
        <div className="empty" style={{ padding: '110px 20px' }}>
          <h3>Medicine not found</h3>
          <p style={{ marginBottom: 22 }}>That product isn't in the catalogue.</p>
          <Link to="/catalog" className="btn btn-primary">Back to catalogue</Link>
        </div>
      </div>
    );
  }

  const saved = wishlist.some((w) => w.id === med.id);
  const off = med.mrp > med.price ? Math.round(((med.mrp - med.price) / med.mrp) * 100) : 0;
  const subs = substitutesFor(med);
  const related = relatedTo(med);
  const catLabel = CATEGORIES.find((c) => c.id === med.category)?.label || med.category;
  const d = med.detail || {};

  const tabBody = {
    uses: (
      <>
        <ul className="prose" style={{ marginBottom: 16 }}>
          {(d.uses || []).map((u) => <li key={u}>{u}</li>)}
        </ul>
        {d.how && <p className="muted" style={{ lineHeight: 1.8, fontSize: '.93rem' }}>{d.how}</p>}
      </>
    ),
    directions: <p className="muted" style={{ lineHeight: 1.85, fontSize: '.95rem' }}>{d.directions}</p>,
    side: (
      <>
        <p className="muted" style={{ fontSize: '.88rem', marginBottom: 14 }}>
          Most people get none of these. Tell your doctor if any persist or worsen.
        </p>
        <ul className="prose">{(d.sideEffects || []).map((s) => <li key={s}>{s}</li>)}</ul>
      </>
    ),
    safety: (
      <div className="note">
        <AlertTriangle size={17} />
        <span>{d.warnings || 'Speak to your doctor or pharmacist before starting this medicine.'}</span>
      </div>
    ),
  };

  return (
    <div className="shell" style={{ padding: '30px 0 20px' }}>
      {/* breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.82rem', marginBottom: 24 }} className="muted">
        <button onClick={() => navigate(-1)} className="icon-btn" style={{ width: 34, height: 34, borderRadius: 9 }} aria-label="Go back">
          <ChevronLeft size={16} />
        </button>
        <Link to="/catalog" style={{ color: 'var(--text-2)' }}>Medicines</Link>
        <span>/</span>
        <Link to={`/catalog?c=${med.category}`} style={{ color: 'var(--text-2)' }}>{catLabel}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>{med.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32, alignItems: 'start' }}>
        {/* ---------------- Gallery ---------------- */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <div
            style={{
              borderRadius: 'var(--r-lg)', border: '1px solid var(--line-soft)', overflow: 'hidden',
              background: med.hasPhoto ? '#fff' : 'var(--card)', position: 'relative',
            }}
          >
            <img
              src={med.image} alt={med.name}
              style={{ width: '100%', aspectRatio: '1', objectFit: med.hasPhoto ? 'contain' : 'cover', padding: med.hasPhoto ? 22 : 0 }}
            />
            <span className={`med-badge ${med.rx ? 'rx' : 'otc'}`} style={{ top: 14, left: 14 }}>
              {med.rx ? 'Rx only' : 'OTC'}
            </span>
            {off > 0 && (
              <span className="med-badge" style={{ top: 14, right: 14, left: 'auto', background: 'var(--amber)', color: '#201603' }}>
                {off}% OFF
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
            {[
              [ShieldCheck, 'Genuine'],
              [Truck, '2-hr delivery'],
              [RotateCcw, 'Easy returns'],
              [Thermometer, 'Cold chain'],
            ].map(([Icon, label]) => (
              <div key={label} style={{ textAlign: 'center', padding: '14px 6px', border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)' }}>
                <Icon size={17} style={{ color: 'var(--mint)', margin: '0 auto 7px' }} />
                <span className="mono" style={{ fontSize: '.6rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---------------- Buy box ---------------- */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
          <p className="eyebrow">{med.manufacturer}</p>
          <h1 className="display" style={{ fontSize: 'clamp(1.8rem,3.6vw,2.7rem)', margin: '12px 0 10px' }}>{med.name}</h1>
          <p className="med-salt" style={{ fontSize: '.8rem', marginBottom: 6 }}>{med.salt}</p>
          <p className="muted" style={{ fontSize: '.88rem', marginBottom: 22 }}>{med.pack} · Country of origin: {med.country}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
            <span className="display" style={{ fontSize: '2.2rem' }}>{inr(med.price)}</span>
            {off > 0 && <s className="muted" style={{ fontSize: '1rem' }}>{inr(med.mrp)}</s>}
            {off > 0 && <span style={{ color: 'var(--mint)', fontWeight: 600, fontSize: '.9rem' }}>Save {inr(med.mrp - med.price)}</span>}
          </div>
          <p className="mono muted" style={{ fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>
            Inclusive of all taxes
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <div className="qty" style={{ height: 46, borderRadius: 12 }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 42, height: 44 }} aria-label="Decrease quantity"><Minus size={15} /></button>
              <span style={{ minWidth: 40 }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} style={{ width: 42, height: 44 }} aria-label="Increase quantity"><Plus size={15} /></button>
            </div>
            <button className="btn btn-primary" style={{ flex: 1, minWidth: 170, height: 46 }} onClick={() => { addToCart(med, qty); setCartOpen(true); }}>
              <ShoppingBag size={17} /> Add to bag
            </button>
            <button
              className={`icon-btn ${saved ? 'on' : ''}`}
              style={{ width: 46, height: 46, color: saved ? 'var(--rose)' : undefined, borderColor: saved ? 'var(--rose)' : undefined }}
              onClick={() => toggleWish(med)} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save for later'}
            >
              <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link to="/account" className="btn btn-ghost btn-block" style={{ marginBottom: 20 }}>
            <Repeat size={16} /> Set up a monthly refill instead
          </Link>

          {med.rx && (
            <div className="note" style={{ marginBottom: 18 }}>
              <AlertTriangle size={17} />
              <span>Prescription required. A licensed pharmacy would verify a valid Rx from a registered practitioner before dispensing this.</span>
            </div>
          )}

          <div className="panel" style={{ padding: 20 }}>
            <p className="mono" style={{ fontSize: '.66rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Storage
            </p>
            <p className="muted" style={{ fontSize: '.88rem', lineHeight: 1.7 }}>{med.storage}</p>
          </div>
        </motion.div>
      </div>

      {/* ---------------- Tabs ---------------- */}
      <section className="block" style={{ paddingBottom: 30 }}>
        <div className="filters" style={{ marginBottom: 22 }}>
          {TABS.map(([k, label]) => (
            <button key={k} className={`chip ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
          ))}
        </div>
        <div className="panel" style={{ minHeight: 170 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {tabBody[tab]}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="muted" style={{ fontSize: '.8rem', marginTop: 14 }}>
          Informational only. This is a demo build and not a substitute for advice from your doctor or pharmacist.
        </p>
      </section>

      {/* ---------------- Substitutes ---------------- */}
      {subs.length > 0 && (
        <section className="block" style={{ paddingTop: 0 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Same salt, different brand</p>
              <h2 className="display" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                Generic <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>substitutes.</em>
              </h2>
            </div>
          </div>
          <div className="panel" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr><th>Brand</th><th>Manufacturer</th><th>Pack</th><th style={{ textAlign: 'right' }}>Price</th><th /></tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: 'var(--text)' }}><Link to={`/medicine/${s.id}`} style={{ fontWeight: 600 }}>{s.name}</Link></td>
                    <td>{s.manufacturer}</td>
                    <td>{s.pack}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text)', fontWeight: 600 }}>{inr(s.price)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {s.price < med.price ? (
                        <span style={{ color: 'var(--mint)', fontWeight: 600, fontSize: '.8rem', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <Check size={13} /> Save {inr(med.price - s.price)}
                        </span>
                      ) : <span className="muted" style={{ fontSize: '.8rem' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted" style={{ fontSize: '.82rem', marginTop: 14 }}>
            Substitutes share the same active ingredient. Check with your pharmacist before switching brands.
          </p>
        </section>
      )}

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section className="block" style={{ paddingTop: 0 }}>
          <Reveal>
            <div className="sec-head">
              <div>
                <p className="eyebrow">{catLabel}</p>
                <h2 className="display" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                  Often bought <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>together.</em>
                </h2>
              </div>
              <Link to={`/catalog?c=${med.category}`} className="btn btn-ghost btn-sm">View shelf</Link>
            </div>
          </Reveal>
          <div className="grid-meds">
            {related.map((m) => <MedCard key={m.id} med={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
