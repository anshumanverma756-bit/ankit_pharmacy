import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ScanLine, AlertTriangle, RotateCcw, ShoppingBag, FileImage, Lock } from 'lucide-react';
import Reveal from '../components/Reveal.jsx';
import MedCard from '../components/MedCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { matchToken } from '../api/medicines.js';
import { inr } from '../data/catalog.js';

/** Words that appear on every prescription and are never drug names. */
const NOISE = new Set([
  'tab', 'tabs', 'tablet', 'tablets', 'cap', 'caps', 'capsule', 'capsules', 'syp', 'syrup',
  'inj', 'injection', 'mg', 'ml', 'mcg', 'gm', 'dose', 'doses', 'daily', 'twice', 'thrice',
  'morning', 'night', 'evening', 'after', 'before', 'food', 'meals', 'days', 'day', 'week',
  'weeks', 'month', 'months', 'patient', 'name', 'age', 'sex', 'date', 'doctor', 'dr', 'md',
  'mbbs', 'clinic', 'hospital', 'address', 'phone', 'signature', 'rx', 'sig', 'take', 'qty',
  'male', 'female', 'years', 'diagnosis', 'advice', 'review', 'follow', 'total', 'prescription',
]);

function extractTokens(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const found = new Map();

  for (const line of lines) {
    // A drug line usually looks like: "1. Telma 40 Tablet  1-0-1"
    const stripped = line.replace(/^\s*\d+[.)]\s*/, '').replace(/\d+\s*-\s*\d+\s*-\s*\d+/g, '');
    const words = stripped.split(/[\s,;:/|]+/).filter(Boolean);

    for (let i = 0; i < words.length; i++) {
      const w = words[i].replace(/[^A-Za-z0-9-]/g, '');
      if (w.length < 4) continue;
      if (NOISE.has(w.toLowerCase())) continue;
      if (/^\d+$/.test(w)) continue;

      // Pair the word with a following strength if there is one ("Telma 40")
      const next = words[i + 1]?.replace(/[^A-Za-z0-9]/g, '');
      const candidate = next && /^\d{1,4}$/.test(next) ? `${w} ${next}` : w;
      const key = candidate.toLowerCase();
      if (!found.has(key)) found.set(key, candidate);
    }
  }
  return [...found.values()].slice(0, 18);
}

export default function Prescription() {
  const { addManyToCart, setCartOpen } = useApp();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [stage, setStage] = useState('idle'); // idle | reading | matching | done
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState('');
  const [tokens, setTokens] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { document.title = 'Scan a prescription — ANKIT PHARMACY'; }, []);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const reset = () => {
    setFile(null); setPreview(''); setStage('idle'); setProgress(0);
    setRawText(''); setTokens([]); setMatches([]); setError('');
  };

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) { setError('Please choose an image file (JPG, PNG, WEBP or HEIC).'); return; }
    if (f.size > 12 * 1024 * 1024) { setError('That image is over 12 MB. Try a smaller photo.'); return; }

    reset();
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStage('reading');
    setError('');

    try {
      const { default: Tesseract } = await import('tesseract.js');
      const { data } = await Tesseract.recognize(f, 'eng', {
        logger: (m) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)); },
      });

      setRawText(data.text || '');
      const toks = extractTokens(data.text || '');
      setTokens(toks);

      if (!toks.length) {
        setStage('done');
        setError('No readable drug names were found. A sharper, straight-on photo in good light usually fixes this.');
        return;
      }

      setStage('matching');
      const results = [];
      for (const t of toks) {
        const hit = await matchToken(t);
        if (hit && !results.some((r) => r.id === hit.id)) results.push({ ...hit, token: t });
      }
      setMatches(results);
      setStage('done');
      if (!results.length) setError('Names were read, but none matched the catalogue. Try a clearer photo, or search the catalogue by hand.');
    } catch (err) {
      setStage('done');
      setError(`Could not read that image: ${err.message}`);
    }
  }, []);

  const total = matches.reduce((a, m) => a + m.price, 0);
  const busy = stage === 'reading' || stage === 'matching';

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">Prescription scanner</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 10px' }}>
          Photograph it. <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>We'll price it.</em>
        </h1>
        <p className="muted" style={{ maxWidth: '60ch', marginBottom: 24 }}>
          Upload a picture of your prescription. The text is read on your own device, drug names are
          pulled out, and each one is matched to a priced product.
        </p>
      </Reveal>

      <div className="note mint" style={{ marginBottom: 26 }}>
        <Lock size={17} />
        <span>
          <strong style={{ color: 'var(--text)' }}>Nothing leaves your browser.</strong> OCR runs locally
          via Tesseract.js — the image is never uploaded to a server. This is a demo: it doesn't verify
          your prescription, and it isn't a substitute for a pharmacist checking the real thing.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: preview ? 'minmax(0,1fr) minmax(0,1.25fr)' : '1fr', gap: 22, alignItems: 'start' }}>
        {/* ---- Upload / preview ---- */}
        <div>
          {!preview ? (
            <div
              className={`dropzone ${dragging ? 'over' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
              role="button" tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            >
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
                <Upload size={40} style={{ color: 'var(--mint)', margin: '0 auto 18px' }} />
              </motion.div>
              <h3 style={{ font: '600 1.3rem var(--font-display)', marginBottom: 9 }}>Drop your prescription here</h3>
              <p className="muted" style={{ fontSize: '.9rem' }}>or click to choose a photo · JPG, PNG, WEBP · max 12 MB</p>
            </div>
          ) : (
            <div>
              <div className="rx-preview">
                <img src={preview} alt="Your uploaded prescription" style={{ width: '100%' }} />
                {busy && <div className="rx-scanline" />}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <button className="btn btn-ghost btn-sm" onClick={reset}><RotateCcw size={14} /> Start over</button>
                <span className="token" style={{ marginLeft: 'auto' }}>
                  <FileImage size={13} /> {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          <input
            ref={inputRef} type="file" accept="image/*" capture="environment" hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {busy && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: '.8rem' }} className="mono">
                <span style={{ color: 'var(--mint)' }}>
                  {stage === 'reading' ? 'READING TEXT…' : 'MATCHING MEDICINES…'}
                </span>
                <span className="muted">{stage === 'reading' ? `${progress}%` : ''}</span>
              </div>
              <div className="scanbar"><div style={{ width: stage === 'reading' ? `${progress}%` : '100%' }} /></div>
            </div>
          )}

          {error && (
            <div className="note" style={{ marginTop: 20 }}>
              <AlertTriangle size={17} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* ---- Results ---- */}
        <AnimatePresence>
          {preview && (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {tokens.length > 0 && (
                <div className="panel" style={{ marginBottom: 16 }}>
                  <div className="panel-head">
                    <ScanLine size={18} style={{ color: 'var(--mint)' }} />
                    <h3>Names read from the image</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {tokens.map((t) => (
                      <span key={t} className={`token ${matches.some((m) => m.token === t) ? 'hit' : ''}`}>{t}</span>
                    ))}
                  </div>
                  <p className="muted" style={{ fontSize: '.8rem', marginTop: 14 }}>
                    Highlighted names were matched to a product. Always check this list against the paper before ordering.
                  </p>
                </div>
              )}

              {matches.length > 0 && (
                <div className="panel">
                  <div className="panel-head">
                    <ShoppingBag size={18} style={{ color: 'var(--mint)' }} />
                    <h3 style={{ marginRight: 'auto' }}>{matches.length} medicine{matches.length === 1 ? '' : 's'} matched</h3>
                  </div>

                  <table className="tbl" style={{ marginBottom: 18 }}>
                    <thead>
                      <tr><th>Read as</th><th>Matched product</th><th style={{ textAlign: 'right' }}>Price</th></tr>
                    </thead>
                    <tbody>
                      {matches.map((m) => (
                        <tr key={m.id}>
                          <td className="mono" style={{ fontSize: '.78rem' }}>{m.token}</td>
                          <td style={{ color: 'var(--text)' }}>
                            {m.name}
                            {m.rx && <span className="med-badge rx" style={{ position: 'static', marginLeft: 8, display: 'inline-block' }}>Rx</span>}
                          </td>
                          <td style={{ textAlign: 'right', color: 'var(--text)', fontWeight: 600 }}>{inr(m.price)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={2} style={{ color: 'var(--text)', fontWeight: 600 }}>Estimated basket</td>
                        <td style={{ textAlign: 'right', font: '600 1.15rem var(--font-display)', color: 'var(--mint)' }}>{inr(total)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => { addManyToCart(matches); setCartOpen(true); }}
                  >
                    <ShoppingBag size={16} /> Add all {matches.length} to bag
                  </button>
                </div>
              )}

              {rawText && (
                <details className="panel" style={{ marginTop: 16 }}>
                  <summary style={{ cursor: 'pointer', font: '600 .9rem var(--font-body)' }}>View raw OCR output</summary>
                  <pre className="code" style={{ marginTop: 14, whiteSpace: 'pre-wrap' }}>{rawText}</pre>
                </details>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- How it works ---- */}
      <section className="block">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Under the hood</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.5rem)' }}>Four steps, <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>zero uploads.</em></h2>
          </div>
        </div>
        <div className="bento">
          {[
            ['01', 'Read', 'Tesseract.js runs a WebAssembly OCR pass over the image inside your browser tab.'],
            ['02', 'Clean', 'Line numbers, dosage patterns like 1-0-1 and ~50 filler words are stripped out.'],
            ['03', 'Resolve', 'Each remaining token is resolved against the catalogue through one swappable lookup function.'],
            ['04', 'Price', 'Matches are totalled so you see the basket cost before anything is added.'],
          ].map(([n, t, b], i) => (
            <Reveal key={n} delay={i * 0.07} className="tile-sm">
              <div className="tile" style={{ height: '100%' }}>
                <span className="mono" style={{ color: 'var(--mint)', fontSize: '.8rem', letterSpacing: '.1em' }}>{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
