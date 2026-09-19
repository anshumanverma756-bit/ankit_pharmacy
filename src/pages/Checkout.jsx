import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Download, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useApp } from '../context/AppContext.jsx';
import { inr } from '../data/catalog.js';

export default function Checkout() {
  const { cart, totals, addresses, notify } = useApp();
  const [addressId, setAddressId] = useState(addresses[0]?.id || '');
  useEffect(() => { document.title = 'Review order — ANKIT PHARMACY'; }, []);

  const rxItems = cart.filter((c) => c.rx);

  const download = () => {
    const payload = {
      brand: 'Ankit Pharmacy',
      status: 'DEMO — not an order, no payment taken',
      generated: new Date().toISOString(),
      deliverTo: addresses.find((a) => a.id === addressId) || null,
      items: cart.map((c) => ({ name: c.name, salt: c.salt, qty: c.qty, unitINR: c.price, lineINR: c.price * c.qty, rx: c.rx })),
      totals,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'ankit-pharmacy-order-summary.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Order summary downloaded');
  };

  if (!cart.length) {
    return (
      <div className="shell" style={{ padding: '46px 0' }}>
        <div className="empty">
          <h3>Your bag is empty</h3>
          <p style={{ marginBottom: 22 }}>Add something before reviewing an order.</p>
          <Link to="/catalog" className="btn btn-primary">Browse medicines</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">Review</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 28px' }}>
          Check it <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>once more.</em>
        </h1>
      </Reveal>

      <div className="note" style={{ marginBottom: 24 }}>
        <ShieldAlert size={17} />
        <span>
          <strong style={{ color: 'var(--text)' }}>This is a demo checkout.</strong> No payment gateway is
          connected and no order is placed. You can download the summary as JSON instead.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 18 }}>
        <div className="panel">
          <div className="panel-head"><h3>Items ({totals.items})</h3></div>
          <table className="tbl">
            <thead><tr><th>Medicine</th><th>Qty</th><th style={{ textAlign: 'right' }}>Line</th></tr></thead>
            <tbody>
              {cart.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text)' }}>
                    {c.name}
                    {c.rx && <span className="med-badge rx" style={{ position: 'static', marginLeft: 7, display: 'inline-block' }}>Rx</span>}
                  </td>
                  <td className="mono">{c.qty}</td>
                  <td style={{ textAlign: 'right', color: 'var(--text)' }}>{inr(c.price * c.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel-head"><MapPin size={18} style={{ color: 'var(--mint)' }} /><h3>Deliver to</h3></div>
            {addresses.length === 0 ? (
              <p className="muted" style={{ fontSize: '.9rem' }}>
                No saved address. <Link to="/account" style={{ color: 'var(--mint)' }}>Add one →</Link>
              </p>
            ) : (
              <select className="input" value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                {addresses.map((a) => <option key={a.id} value={a.id}>{a.tag} — {a.name}, {a.city} {a.pin}</option>)}
              </select>
            )}
          </div>

          <div className="panel">
            <div className="line-row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
            {totals.saved > 0 && <div className="line-row" style={{ color: 'var(--mint)' }}><span>You save</span><span>-{inr(totals.saved)}</span></div>}
            <div className="line-row"><span>Delivery</span><span>{totals.delivery === 0 ? 'Free' : inr(totals.delivery)}</span></div>
            <div className="line-row total"><span>Total</span><span>{inr(totals.grand)}</span></div>

            {rxItems.length > 0 && (
              <div className="note" style={{ marginTop: 16 }}>
                <ShieldAlert size={16} />
                <span>{rxItems.length} item{rxItems.length === 1 ? ' is' : 's are'} prescription-only. A real pharmacy would verify your Rx before dispensing.</span>
              </div>
            )}

            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={download}>
              <Download size={16} /> Download summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
