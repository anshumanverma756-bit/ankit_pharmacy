import { CATALOG } from '../data/catalog.js';
import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';

const Ctx = createContext(null);
const K = 'ankit-pharmacy:';

const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(K + key));
    return v ?? fallback;
  } catch { return fallback; }
};
const save = (key, value) => {
  try { localStorage.setItem(K + key, JSON.stringify(value)); } catch { /* quota / private mode */ }
};

function initialTheme() {
  const stored = load('theme', null);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [cart, setCart] = useState(() => load('cart', []));
  const [wishlist, setWishlist] = useState(() => load('wishlist', []));
  const [addresses, setAddresses] = useState(() => load('addresses', []));
  const [refills, setRefills] = useState(() => load('refills', []));
  const [profile, setProfile] = useState(() =>
    load('profile', { name: 'Ankit Singh', email: 'ankit4908singh@gmail.com', phone: '+91 93348 14337' })
  );
  const [orders, setOrders] = useState(() =>
    load('orders', [
      { id: 'AV-89234', date: '2026-08-15 14:30', status: 'Out for Delivery', total: 484,
        items: [{ id: 'telma-40', qty: 2 }, { id: 'glycomet-gp2', qty: 1 }] },
      { id: 'AV-88117', date: '2026-07-02 09:05', status: 'Delivered', total: 261,
        items: [{ id: 'okamet-500', qty: 1 }, { id: 'dolo-650', qty: 2 }] },
    ])
  );
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const timer = useRef();

  /* ---- theme ---- */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.remove();
    const m = document.createElement('meta');
    m.name = 'theme-color';
    m.content = theme === 'dark' ? '#080f0e' : '#f6f4ee';
    document.head.appendChild(m);
    save('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  /* ---- persistence ---- */
  useEffect(() => save('cart', cart), [cart]);
  useEffect(() => save('wishlist', wishlist), [wishlist]);
  useEffect(() => save('addresses', addresses), [addresses]);
  useEffect(() => save('refills', refills), [refills]);
  useEffect(() => save('profile', profile), [profile]);
  useEffect(() => save('orders', orders), [orders]);

  /* ---- toast ---- */
  const notify = useCallback((message, tone = 'mint') => {
    setToast({ message, tone, at: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3400);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  /* ---- cart ---- */
  const addToCart = useCallback((med, qty = 1) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === med.id);
      if (i > -1) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(10, next[i].qty + qty) };
        return next;
      }
      return [...prev, { ...med, qty: Math.min(10, qty) }];
    });
    notify(`${med.name} added to bag`);
  }, [notify]);

  const addManyToCart = useCallback((meds) => {
    setCart((prev) => {
      const next = [...prev];
      for (const med of meds) {
        const i = next.findIndex((x) => x.id === med.id);
        if (i > -1) next[i] = { ...next[i], qty: Math.min(10, next[i].qty + 1) };
        else next.push({ ...med, qty: 1 });
      }
      return next;
    });
    notify(`${meds.length} medicine${meds.length === 1 ? '' : 's'} added from your prescription`);
  }, [notify]);

  const setQty = useCallback((id, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((x) => x.id !== id) : prev.map((x) => (x.id === id ? { ...x, qty: Math.min(10, qty) } : x))
    );
  }, []);

  const removeFromCart = useCallback((id) => setCart((p) => p.filter((x) => x.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((med) => {
    setWishlist((prev) => {
      const exists = prev.some((x) => x.id === med.id);
      notify(exists ? 'Removed from saved' : 'Saved for later');
      return exists ? prev.filter((x) => x.id !== med.id) : [...prev, med];
    });
  }, [notify]);

  const addAddress = useCallback((addr) => {
    setAddresses((p) => [...p, { ...addr, id: crypto.randomUUID() }]);
    notify('Delivery address saved');
  }, [notify]);
  const removeAddress = useCallback((id) => setAddresses((p) => p.filter((a) => a.id !== id)), []);

  const addRefill = useCallback((r) => {
    setRefills((p) => [...p, { ...r, id: crypto.randomUUID(), createdAt: Date.now() }]);
    notify('Refill reminder activated');
  }, [notify]);
  const removeRefill = useCallback((id) => setRefills((p) => p.filter((r) => r.id !== id)), []);

  const updateProfile = useCallback((next) => {
    setProfile((p) => ({ ...p, ...next }));
    notify('Profile updated');
  }, [notify]);

  /** Push a past order (or a refill) back into the bag. */
  const reorder = useCallback((items) => {
    setCart((prev) => {
      const next = [...prev];
      for (const it of items) {
        const med = CATALOG.find((m) => m.id === it.id);
        if (!med) continue;
        const i = next.findIndex((x) => x.id === med.id);
        if (i > -1) next[i] = { ...next[i], qty: Math.min(10, next[i].qty + (it.qty || 1)) };
        else next.push({ ...med, qty: Math.min(10, it.qty || 1) });
      }
      return next;
    });
    notify('Added to your bag');
    setCartOpen(true);
  }, [notify]);

  /* ---- totals ---- */
  const totals = useMemo(() => {
    const items = cart.reduce((a, x) => a + x.qty, 0);
    const subtotal = cart.reduce((a, x) => a + x.price * x.qty, 0);
    const mrpTotal = cart.reduce((a, x) => a + (x.mrp || x.price) * x.qty, 0);
    const saved = mrpTotal - subtotal;
    const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 49;
    return { items, subtotal, saved, delivery, grand: subtotal + delivery };
  }, [cart]);

  /* ---- ⌘K ---- */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === 'Escape') { setPaletteOpen(false); setCartOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = {
    theme, toggleTheme,
    cart, addToCart, addManyToCart, setQty, removeFromCart, clearCart, totals,
    wishlist, toggleWish,
    addresses, addAddress, removeAddress,
    refills, addRefill, removeRefill,
    profile, updateProfile,
    orders, reorder,
    toast, notify,
    cartOpen, setCartOpen,
    paletteOpen, setPaletteOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
};
