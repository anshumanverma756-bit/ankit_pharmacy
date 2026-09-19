import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck, Repeat, Trash2, Plus, Clock, Package, RefreshCw, MapPin,
  Printer, Truck, Pencil, X, Heart, ShoppingBag, CalendarDays,
} from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { CATALOG, bySlug, inr } from '../data/catalog.js';

const FREQ = [['30', 'Every 30 days'], ['60', 'Every 60 days'], ['90', 'Every 90 days']];
const TIMES = ['1 tablet morning', '1 tablet after breakfast', '1 tablet night', '1 tablet morning & night'];
const chronic = CATALOG.filter((m) => m.category === 'cardiac-diabetes' || m.rx);

const fmt = (d) => new Date(d).toISOString().slice(0, 10);
const nextRefill = (createdAt, days) => fmt(new Date(createdAt + Number(days) * 86400000));

const ORDER_STATUS = {
  'Out for Delivery': 'var(--amber)',
  Delivered: 'var(--mint)',
  Processing: 'var(--text-3)',
};

export default function Account() {
  const {
    profile, updateProfile,
    addresses, addAddress, removeAddress,
    refills, addRefill, removeRefill,
    orders, reorder,
    wishlist, totals,
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [showRefillForm, setShowRefillForm] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [refill, setRefill] = useState({ medId: chronic[0]?.id || '', freq: '30', time: TIMES[0] });
  const [addr, setAddr] = useState({ name: '', phone: '', street: '', city: '', pin: '', tag: 'Home' });

  useEffect(() => { document.title = 'My account — ANKIT PHARMACY'; }, []);
  useEffect(() => setDraft(profile), [profile]);

  const initials = useMemo(
    () => (profile.name || 'U').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
    [profile.name]
  );

  const submitRefill = (e) => {
    e.preventDefault();
    const med = bySlug.get(refill.medId);
    addRefill({ ...refill, medName: med?.name || 'Medicine', salt: med?.salt || '', price: med?.price || 0 });
    setShowRefillForm(false);
  };

  const submitAddr = (e) => {
    e.preventDefault();
    addAddress(addr);
    setAddr({ name: '', phone: '', street: '', city: '', pin: '', tag: 'Home' });
    setShowAddrForm(false);
  };

  const setA = (k) => (e) => setAddr((a) => ({ ...a, [k]: e.target.value }));
  const setD = (k) => (e) => setDraft((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="shell" style={{ padding: '40px 0 20px' }}>
      {/* ---------------- Profile header ---------------- */}
      <Reveal>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
          <div
            style={{
              width: 92, height: 92, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(145deg, var(--mint), var(--mint-dim))',
              display: 'grid', placeItems: 'center',
              font: '600 2rem var(--font-display)', color: '#05100d',
              border: '3px solid var(--amber)',
            }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <span className="token hit" style={{ marginBottom: 10, display: 'inline-flex' }}>
              <BadgeCheck size={13} /> Verified patient account
            </span>

            {editing ? (
              <form
                onSubmit={(e) => { e.preventDefault(); updateProfile(draft); setEditing(false); }}
                style={{ display: 'grid', gap: 10, maxWidth: 420, marginTop: 10 }}
              >
                <input className="input" value={draft.name} onChange={setD('name')} placeholder="Full name" required />
                <input className="input" type="email" value={draft.email} onChange={setD('email')} placeholder="Email" required />
                <input className="input" value={draft.phone} onChange={setD('phone')} placeholder="Phone" />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary btn-sm">Save</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setDraft(profile); setEditing(false); }}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h1 className="display" style={{ fontSize: 'clamp(1.9rem,4vw,2.9rem)', margin: '4px 0 8px' }}>
                  {profile.name}
                </h1>
                <p className="muted" style={{ fontSize: '.92rem' }}>
                  {profile.email} · {profile.phone}
                </p>
              </>
            )}
          </div>

          {!editing && (
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
              <Pencil size={14} /> Edit profile
            </button>
          )}
        </div>
      </Reveal>

      {/* ---------------- Quick stats ---------------- */}
      <Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 14, marginBottom: 30 }}>
          {[
            [Repeat, refills.length, 'Active refills', '/account'],
            [Package, orders.length, 'Past orders', '/account'],
            [Heart, wishlist.length, 'Saved items', '/saved'],
            [ShoppingBag, totals.items, 'In your bag', '/checkout'],
          ].map(([Icon, n, label, to]) => (
            <Link key={label} to={to} className="tile" style={{ padding: 20 }}>
              <Icon size={19} style={{ color: 'var(--mint)', marginBottom: 12 }} />
              <div className="display" style={{ fontSize: '1.8rem' }}>{n}</div>
              <p className="mono" style={{ fontSize: '.64rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 5 }}>
                {label}
              </p>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* ---------------- Chronic care manager ---------------- */}
      <Reveal>
        <section className="panel" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <span className="token" style={{ borderColor: 'var(--rose)', color: 'var(--rose)', marginBottom: 12, display: 'inline-flex' }}>
                <CalendarDays size={13} /> Chronic care manager
              </span>
              <h2 style={{ font: '600 1.5rem var(--font-display)', letterSpacing: '-.02em', marginBottom: 8 }}>
                Monthly maintenance refill reminders
              </h2>
              <p className="muted" style={{ fontSize: '.9rem', maxWidth: '62ch' }}>
                Never run out of daily blood pressure, cardiac or diabetic medication. Set an interval
                and re-order in one tap before your strip runs out.
              </p>
            </div>
            <button className="btn btn-amber btn-sm" onClick={() => setShowRefillForm((v) => !v)}>
              {showRefillForm ? <X size={14} /> : <Plus size={14} />}
              {showRefillForm ? 'Close' : 'Schedule new refill'}
            </button>
          </div>

          <AnimatePresence>
            {showRefillForm && (
              <motion.form
                onSubmit={submitRefill}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: 18 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, paddingTop: 18, borderTop: '1px solid var(--line-soft)' }}>
                  <label className="field" style={{ margin: 0 }}><span>Medicine</span>
                    <select className="input" value={refill.medId} onChange={(e) => setRefill((r) => ({ ...r, medId: e.target.value }))}>
                      {chronic.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </label>
                  <label className="field" style={{ margin: 0 }}><span>Frequency</span>
                    <select className="input" value={refill.freq} onChange={(e) => setRefill((r) => ({ ...r, freq: e.target.value }))}>
                      {FREQ.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </label>
                  <label className="field" style={{ margin: 0 }}><span>Dosage</span>
                    <select className="input" value={refill.time} onChange={(e) => setRefill((r) => ({ ...r, time: e.target.value }))}>
                      {TIMES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Activate reminder</button>
              </motion.form>
            )}
          </AnimatePresence>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 22 }}>
            <AnimatePresence>
              {refills.map((r) => (
                <motion.div
                  key={r.id} layout
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)', padding: 20, background: 'var(--bg-2)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginRight: 'auto' }}>{r.medName}</h3>
                    <span className="token hit" style={{ padding: '4px 10px', fontSize: '.64rem' }}>Active</span>
                  </div>
                  <p className="muted" style={{ fontSize: '.84rem', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Clock size={13} /> {r.time}
                  </p>
                  <p style={{ color: 'var(--amber)', fontWeight: 600, fontSize: '.84rem', marginBottom: 16 }}>
                    Next refill: {nextRefill(r.createdAt, r.freq)} (every {r.freq} days)
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => reorder([{ id: r.medId, qty: 1 }])}>
                      <RefreshCw size={14} /> Refill now
                    </button>
                    <button className="icon-btn" style={{ width: 36, height: 36, borderRadius: 10, color: 'var(--rose)', borderColor: 'var(--line)' }} onClick={() => removeRefill(r.id)} aria-label={`Cancel reminder for ${r.medName}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {refills.length === 0 && !showRefillForm && (
              <p className="muted" style={{ fontSize: '.9rem', padding: '22px 0' }}>
                No reminders yet. Schedule one above to see it here.
              </p>
            )}
          </div>
        </section>
      </Reveal>

      {/* ---------------- Order history ---------------- */}
      <Reveal>
        <section className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-head">
            <Package size={19} style={{ color: 'var(--mint)' }} />
            <h3 style={{ marginRight: 'auto' }}>Past medicine orders</h3>
          </div>

          {orders.length === 0 ? (
            <p className="muted" style={{ fontSize: '.9rem' }}>No orders yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: 14 }}>
              {orders.map((o) => (
                <div key={o.id} style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)', padding: 20, background: 'var(--bg-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <h4 style={{ font: '600 1.05rem var(--font-display)' }}>Order #{o.id}</h4>
                    <span className="token" style={{ padding: '4px 11px', fontSize: '.64rem', borderColor: ORDER_STATUS[o.status], color: ORDER_STATUS[o.status] }}>
                      {o.status}
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                      <button className="btn btn-amber btn-sm" onClick={() => reorder(o.items)}>
                        <RefreshCw size={13} /> 1-click re-order
                      </button>
                      <button className="btn btn-ghost btn-sm"><Truck size={13} /> Track live</button>
                      <button className="icon-btn" style={{ width: 34, height: 34, borderRadius: 9 }} onClick={() => window.print()} aria-label="Print invoice">
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="muted" style={{ fontSize: '.84rem', marginBottom: 8 }}>
                    Placed {o.date} · Total <strong style={{ color: 'var(--text)' }}>{inr(o.total)}</strong>
                  </p>
                  <p style={{ fontSize: '.88rem' }}>
                    {o.items.map((it, i) => {
                      const m = bySlug.get(it.id);
                      return (
                        <span key={it.id}>
                          {i > 0 && ', '}
                          {m ? <Link to={`/medicine/${m.id}`} style={{ color: 'var(--mint)' }}>{m.name}</Link> : it.id}
                          <span className="muted"> (Qty: {it.qty})</span>
                        </span>
                      );
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* ---------------- Addresses ---------------- */}
      <Reveal>
        <section className="panel">
          <div className="panel-head">
            <MapPin size={19} style={{ color: 'var(--mint)' }} />
            <h3 style={{ marginRight: 'auto' }}>Delivery addresses</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddrForm((v) => !v)}>
              {showAddrForm ? <X size={14} /> : <Plus size={14} />} {showAddrForm ? 'Close' : 'Add address'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            <AnimatePresence>
              {addresses.map((a) => (
                <motion.div
                  key={a.id} layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--r-md)', padding: 18, background: 'var(--bg-2)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                    <strong style={{ fontSize: '.94rem', marginRight: 'auto' }}>{a.name}</strong>
                    <span className="token" style={{ padding: '3px 9px', fontSize: '.62rem' }}>{a.tag}</span>
                    <button className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8 }} onClick={() => removeAddress(a.id)} aria-label={`Remove address for ${a.name}`}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="muted" style={{ fontSize: '.84rem', lineHeight: 1.7 }}>
                    {a.street}, {a.city} — {a.pin}<br />{a.phone}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showAddrForm && (
              <motion.form
                onSubmit={submitAddr}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginTop: addresses.length ? 20 : 4 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
                  <label className="field" style={{ margin: 0 }}><span>Recipient name</span><input className="input" required value={addr.name} onChange={setA('name')} /></label>
                  <label className="field" style={{ margin: 0 }}><span>Mobile</span><input className="input" required type="tel" value={addr.phone} onChange={setA('phone')} /></label>
                  <label className="field" style={{ margin: 0 }}><span>Flat / street</span><input className="input" required value={addr.street} onChange={setA('street')} /></label>
                  <label className="field" style={{ margin: 0 }}><span>City</span><input className="input" required value={addr.city} onChange={setA('city')} /></label>
                  <label className="field" style={{ margin: 0 }}><span>PIN</span><input className="input" required pattern="[0-9]{6}" value={addr.pin} onChange={setA('pin')} /></label>
                  <label className="field" style={{ margin: 0 }}><span>Tag</span>
                    <select className="input" value={addr.tag} onChange={setA('tag')}>
                      <option>Home</option><option>Work / Office</option><option>Other</option>
                    </select>
                  </label>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Save address</button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </Reveal>

      <p className="muted" style={{ fontSize: '.8rem', marginTop: 22 }}>
        This is a demo account. Everything on this page is stored in your browser only — there is no
        sign-in, no server and no real order.
      </p>
    </div>
  );
}
