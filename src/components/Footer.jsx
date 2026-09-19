import { Link } from 'react-router-dom';
import { Activity, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark"><Activity size={20} strokeWidth={2.6} /></span>
              <span>
                <div className="brand-name">ANKIT</div>
                <div className="brand-sub">PHARMACY</div>
              </span>
            </div>
            <p className="muted" style={{ fontSize: '.9rem', maxWidth: '38ch', marginBottom: 18 }}>
              A demonstration e-pharmacy interface built with React. Live drug data, prescription
              scanning and chronic-care refill scheduling in one place.
            </p>
            <p className="mono" style={{ fontSize: '.72rem', color: 'var(--text-3)', lineHeight: 2 }}>
              DEMO LICENCE: DL-DEMO-0000<br />GSTIN: 00XXXXX0000X0X0
            </p>
          </div>

          <div>
            <h4>Store</h4>
            <Link to="/catalog?c=prescription">Prescription drugs</Link>
            <Link to="/catalog?c=cardiac-diabetes">Cardiac &amp; diabetes</Link>
            <Link to="/catalog?c=vitamins">Vitamins &amp; immunity</Link>
            <Link to="/catalog?c=devices">Monitors &amp; devices</Link>
            <Link to="/catalog?c=ayurveda">Ayurveda</Link>
          </div>

          <div>
            <h4>Features</h4>
            <Link to="/prescription">Prescription scanner</Link>
            <Link to="/account">My account &amp; refills</Link>
            <Link to="/saved">Saved medicines</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h4>Policy</h4>
            <Link to="/policy/privacy">Privacy &amp; data</Link>
            <Link to="/policy/rx">Prescription policy</Link>
            <Link to="/policy/terms">Terms of service</Link>
            <Link to="/policy/returns">Returns &amp; refunds</Link>
            <Link to="/policy/cold-chain">Cold-chain shipping</Link>
          </div>
        </div>

        <div className="note" style={{ marginTop: 40 }}>
          <Phone size={17} />
          <span>
            <strong style={{ color: 'var(--text)' }}>This is a portfolio / demo project.</strong> It does not
            dispense medicine, take payments or offer medical advice. Always consult a registered
            pharmacist or doctor before taking any medication.
          </span>
        </div>

        <div className="foot-bar">
          <span>&copy; {new Date().getFullYear()} Ankit Pharmacy &middot; Demo build</span>
          <span className="mono">UPI &bull; CARDS &bull; COD &mdash; not enabled in demo</span>
        </div>
      </div>
    </footer>
  );
}
