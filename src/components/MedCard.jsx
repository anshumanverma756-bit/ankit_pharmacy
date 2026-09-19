import { Heart, Plus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { inr } from '../data/catalog.js';

export default function MedCard({ med }) {
  const { addToCart, toggleWish, wishlist } = useApp();
  const saved = wishlist.some((w) => w.id === med.id);
  const off = med.mrp > med.price ? Math.round(((med.mrp - med.price) / med.mrp) * 100) : 0;

  return (
    <motion.article className="med" layout>
      <div className="med-art">
        <Link to={`/medicine/${med.id}`} aria-label={med.name} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={med.image} alt="" loading="lazy" style={{ objectFit: med.hasPhoto ? 'contain' : 'cover', background: med.hasPhoto ? '#fff' : 'none', padding: med.hasPhoto ? 10 : 0 }} />
        </Link>
        <span className={`med-badge ${med.rx ? 'rx' : 'otc'}`}>{med.rx ? 'Rx only' : 'OTC'}</span>
        <button
          className={`med-fav ${saved ? 'on' : ''}`}
          onClick={() => toggleWish(med)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${med.name} from saved` : `Save ${med.name}`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="med-body">
        <p className="med-salt">{med.salt || '\u2014'}</p>
        <h3 className="med-name"><Link to={`/medicine/${med.id}`}>{med.name}</Link></h3>
        <p className="med-mfr">{med.manufacturer} &middot; {med.pack}</p>
        <div className="med-foot">
          <div>
            <span className="price">{inr(med.price)}</span>
            {off > 0 && <s>{inr(med.mrp)}</s>}
            {off > 0 && <div style={{ font: '600 .66rem var(--font-mono)', color: 'var(--mint)', marginTop: 3 }}>{off}% OFF</div>}
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(med)} aria-label={`Add ${med.name} to bag`}>
            <Plus size={15} /> Add
          </button>
        </div>
        {med.source !== 'seed' && (
          <p style={{ font: '500 .62rem var(--font-mono)', color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase', display: 'flex', gap: 5, alignItems: 'center' }}>
            <ShieldCheck size={11} /> via {med.source}
          </p>
        )}
      </div>
    </motion.article>
  );
}
