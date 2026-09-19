import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { inr } from '../data/catalog.js';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeFromCart, clearCart, totals } = useApp();

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="Your bag">
          <motion.div
            className="drawer-scrim"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="drawer-head">
              <ShoppingBag size={19} style={{ color: 'var(--mint)' }} />
              <h3 style={{ font: '600 1.2rem var(--font-display)', marginRight: 'auto' }}>
                Your bag {totals.items > 0 && <span className="mono muted" style={{ fontSize: '.8rem' }}>({totals.items})</span>}
              </h3>
              {cart.length > 0 && (
                <button className="btn btn-sm btn-ghost" onClick={clearCart}>Clear</button>
              )}
              <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag">
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              {cart.length === 0 ? (
                <div className="empty">
                  <h3>Nothing here yet</h3>
                  <p className="muted" style={{ marginBottom: 22 }}>
                    Browse the catalogue or scan a prescription to fill your bag automatically.
                  </p>
                  <Link to="/catalog" className="btn btn-primary" onClick={() => setCartOpen(false)}>
                    Browse medicines
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cart-item"
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                    >
                      <div className="cart-thumb"><img src={item.image} alt="" /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '.92rem', fontWeight: 600, lineHeight: 1.35 }}>{item.name}</h4>
                        <p className="muted" style={{ fontSize: '.76rem', margin: '3px 0 9px' }}>{item.pack}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="qty">
                            <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity"><Minus size={13} /></button>
                            <span>{item.qty}</span>
                            <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity"><Plus size={13} /></button>
                          </div>
                          <strong style={{ marginLeft: 'auto', font: '600 .98rem var(--font-display)' }}>
                            {inr(item.price * item.qty)}
                          </strong>
                          <button className="icon-btn" style={{ width: 32, height: 32, borderRadius: 9 }} onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-foot">
                <div className="line-row"><span>Subtotal</span><span>{inr(totals.subtotal)}</span></div>
                {totals.saved > 0 && (
                  <div className="line-row" style={{ color: 'var(--mint)' }}>
                    <span>You save</span><span>-{inr(totals.saved)}</span>
                  </div>
                )}
                <div className="line-row">
                  <span>Delivery</span>
                  <span>{totals.delivery === 0 ? 'Free' : inr(totals.delivery)}</span>
                </div>
                <div className="line-row total"><span>Total</span><span>{inr(totals.grand)}</span></div>
                <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setCartOpen(false)}>
                  Review order
                </Link>
                <p className="mono" style={{ fontSize: '.66rem', color: 'var(--text-3)', textAlign: 'center', marginTop: 11 }}>
                  DEMO ONLY — NO PAYMENT IS TAKEN
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
