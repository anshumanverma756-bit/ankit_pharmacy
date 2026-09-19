import { NavLink, Link } from 'react-router-dom';
import { Search, ShoppingBag, Sun, Moon, Heart, Home, Pill, ScanLine, User, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

const LINKS = [
  ['/catalog', 'Medicines'],
  ['/prescription', 'Scan Rx'],
  ['/account', 'My Account'],
  ['/about', 'About'],
];

export default function Navbar() {
  const { theme, toggleTheme, totals, setCartOpen, setPaletteOpen, wishlist } = useApp();

  return (
    <>
      <header className="nav">
        <div className="shell nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Activity size={20} strokeWidth={2.6} />
            </span>
            <span>
              <div className="brand-name">ANKIT</div>
              <div className="brand-sub">PHARMACY</div>
            </span>
          </Link>

          <nav className="nav-links">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="search-trigger" onClick={() => setPaletteOpen(true)} aria-label="Search medicines">
              <Search size={16} />
              <span>Search medicines, salts…</span>
              <kbd className="kbd">⌘K</kbd>
            </button>

            <button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.28 }}
                  style={{ display: 'grid' }}
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link to="/saved" className="icon-btn" aria-label={`Saved medicines (${wishlist.length})`} style={{ position: 'relative' }}>
              <Heart size={18} />
              {wishlist.length > 0 && <span className="cart-pip" style={{ background: 'var(--rose)', color: '#fff' }}>{wishlist.length}</span>}
            </Link>

            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Bag (${totals.items} items)`} style={{ position: 'relative' }}>
              <ShoppingBag size={18} />
              {totals.items > 0 && (
                <motion.span key={totals.items} className="cart-pip" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}>
                  {totals.items}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      <nav className="tabbar" aria-label="Mobile navigation">
        {[
          ['/', 'Home', Home],
          ['/catalog', 'Shop', Pill],
          ['/prescription', 'Scan Rx', ScanLine],
          ['/saved', 'Saved', Heart],
          ['/account', 'Account', User],
        ].map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
