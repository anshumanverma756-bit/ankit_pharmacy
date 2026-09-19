import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.at}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            position: 'fixed', left: '50%', bottom: 26, transform: 'translateX(-50%)',
            zIndex: 300, display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 20px', borderRadius: 999, background: 'var(--mint)',
            color: '#05100d', fontWeight: 600, fontSize: '.88rem',
            boxShadow: '0 18px 44px -18px #000', maxWidth: '92vw',
          }}
        >
          <Check size={16} strokeWidth={3} />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
