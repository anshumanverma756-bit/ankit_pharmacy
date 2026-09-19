import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import MedCard from '../components/MedCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Saved() {
  const { wishlist } = useApp();
  useEffect(() => { document.title = 'Saved medicines — ANKIT PHARMACY'; }, []);

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">Saved</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 28px' }}>
          Kept for <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>later.</em>
        </h1>
      </Reveal>

      {wishlist.length === 0 ? (
        <div className="empty">
          <Heart size={38} style={{ color: 'var(--line)', margin: '0 auto 18px' }} />
          <h3>Nothing saved yet</h3>
          <p style={{ marginBottom: 22 }}>Tap the heart on any medicine to keep it here.</p>
          <Link to="/catalog" className="btn btn-primary">Browse the catalogue</Link>
        </div>
      ) : (
        <div className="grid-meds">
          {wishlist.map((m) => <MedCard key={m.id} med={m} />)}
        </div>
      )}
    </div>
  );
}
