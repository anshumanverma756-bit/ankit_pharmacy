import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="shell">
      <div className="empty" style={{ padding: '120px 20px' }}>
        <p className="eyebrow">404</p>
        <h3 style={{ fontSize: '2.4rem', margin: '14px 0' }}>That shelf is empty</h3>
        <p style={{ marginBottom: 24 }}>The page you asked for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">Back to the counter</Link>
      </div>
    </div>
  );
}
