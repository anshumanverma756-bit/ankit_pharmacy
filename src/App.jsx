import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import Toast from './components/Toast.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import MedicineDetail from './pages/MedicineDetail.jsx';
import Prescription from './pages/Prescription.jsx';
import Account from './pages/Account.jsx';
import Saved from './pages/Saved.jsx';
import Checkout from './pages/Checkout.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Policy from './pages/Policy.jsx';
import NotFound from './pages/NotFound.jsx';

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/catalog" element={<Page><Catalog /></Page>} />
          <Route path="/medicine/:id" element={<Page><MedicineDetail /></Page>} />
          <Route path="/prescription" element={<Page><Prescription /></Page>} />
          <Route path="/account" element={<Page><Account /></Page>} />
          <Route path="/saved" element={<Page><Saved /></Page>} />
          <Route path="/checkout" element={<Page><Checkout /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/policy/:slug" element={<Page><Policy /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <CommandPalette />
      <Toast />
    </>
  );
}
