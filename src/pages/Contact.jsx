import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Contact() {
  const { notify } = useApp();
  const [form, setForm] = useState({ name: '', email: '', topic: 'General', message: '' });
  const [sent, setSent] = useState(false);
  useEffect(() => { document.title = 'Contact — ANKIT PHARMACY'; }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    notify('Message captured locally — demo only');
  };

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 28px' }}>
          Talk to the <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>counter.</em>
        </h1>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18 }}>
        <Reveal>
          <div className="panel">
            <div className="panel-head"><h3>Demo contact details</h3></div>
            {[
              [Phone, 'Pharmacist helpline', '+91 93348 14337'],
              [Mail, 'Email', 'ankit4908singh@gmail.com'],
              [MapPin, 'Registered address', 'This is a portfolio project — no physical store.'],
            ].map(([Icon, label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 14, padding: '15px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <span className="tile-icon" style={{ width: 38, height: 38, borderRadius: 11 }}><Icon size={16} /></span>
                <div>
                  <p className="mono" style={{ fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{label}</p>
                  <p style={{ fontSize: '.92rem', marginTop: 4 }}>{value}</p>
                </div>
              </div>
            ))}
            <div className="note" style={{ marginTop: 20 }}>
              <Phone size={16} />
              <span>For a real medical emergency, contact your local emergency number or nearest hospital — not this form.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form className="panel" onSubmit={submit}>
            <div className="panel-head"><h3>Send a message</h3></div>
            {sent && <div className="note mint" style={{ marginBottom: 18 }}><Send size={16} /><span>Captured in this browser. Nothing was transmitted.</span></div>}
            <label className="field"><span>Your name</span><input className="input" required value={form.name} onChange={set('name')} /></label>
            <label className="field"><span>Email</span><input className="input" type="email" required value={form.email} onChange={set('email')} /></label>
            <label className="field"><span>Topic</span>
              <select className="input" value={form.topic} onChange={set('topic')}>
                <option>General</option><option>Prescription question</option><option>Order support</option><option>Feedback on the build</option>
              </select>
            </label>
            <label className="field"><span>Message</span><textarea className="input" required value={form.message} onChange={set('message')} /></label>
            <button className="btn btn-primary btn-block"><Send size={16} /> Send message</button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
