import { useEffect, useState } from 'react';
import { Search, AlertTriangle, Database, ExternalLink, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import MedCard from '../components/MedCard.jsx';
import MedCardSkeleton from '../components/MedCardSkeleton.jsx';
import Reveal from '../components/Reveal.jsx';
import { searchMedicines, PROVIDERS } from '../api/medicines.js';

const SOURCES = [
  {
    name: 'openFDA — Drug NDC & Label',
    url: 'https://open.fda.gov/apis/drug/ndc/',
    key: 'No key needed (optional key raises limits)',
    what: 'US National Drug Code directory: brand + generic names, active ingredients with strengths, dosage form, labeler, marketing category. This is the provider wired up by default.',
    images: 'No product photos.',
  },
  {
    name: 'RxNorm / RxNav (US NLM)',
    url: 'https://lhncbc.nlm.nih.gov/RxNav/APIs/',
    key: 'Free, no key',
    what: 'The drug-naming standard. Best for normalising a messy OCR token into a real drug concept, and for brand ↔ generic mapping. Use it as the resolver in front of any other source.',
    images: 'No product photos.',
  },
  {
    name: 'DailyMed (US NLM)',
    url: 'https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm',
    key: 'Free, no key',
    what: 'Full structured product labels in XML/JSON. Deeper than openFDA for indications, warnings and packaging.',
    images: 'Has some label images submitted by manufacturers. Note the separate RxImage pill-photo API was retired at the end of 2021.',
  },
  {
    name: 'Kaggle — A-Z Medicine Dataset of India',
    url: 'https://www.kaggle.com/datasets/shudhanshusingh/az-medicine-dataset-of-india',
    key: 'Free download (CSV)',
    what: '250k+ Indian allopathy medicines with brand name, salt composition, manufacturer, pack size, MRP and discontinued status. This is the closest free match to an Indian pharmacy catalogue — load it into Postgres/Supabase and serve it yourself.',
    images: 'No photos — pair with your own product shots.',
  },
  {
    name: 'Kaggle — Indian Medicine Data (195k rows)',
    url: 'https://www.kaggle.com/datasets/mohneesh7/indian-medicine-data',
    key: 'Free download (CSV)',
    what: 'Sub-category, product name, salt composition, price, manufacturer, description, side effects and drug interactions. Good for a richer product detail page.',
    images: 'No photos.',
  },
  {
    name: 'Commercial: DrugBank / First Databank / 1mg scrapers',
    url: 'https://docs.drugbank.com/',
    key: 'Paid licence',
    what: 'If you need Indian retail pricing with real product photography, this is realistically the only compliant route — licensed clinical data, or a commercial marketplace feed. Scraping a live pharmacy site is against their terms.',
    images: 'Yes, under licence.',
  },
];

export default function LiveData() {
  const [provider, setProvider] = useState('openfda');
  const [query, setQuery] = useState('metformin');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ms, setMs] = useState(null);

  useEffect(() => { document.title = 'Live medicine data — AROVIA'; }, []);

  const run = async (e) => {
    e?.preventDefault();
    setLoading(true); setError(''); setMs(null);
    const t0 = performance.now();
    try {
      const data = await searchMedicines(query, { provider, limit: 24 });
      setRows(data);
      setMs(Math.round(performance.now() - t0));
      if (!data.length) setError('That query returned no records. Try a generic name like "amoxicillin".');
    } catch (err) {
      setError(`${err.message}. Falling back to the local catalogue.`);
      setRows(await searchMedicines(query, { provider: 'seed', limit: 12 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="shell" style={{ padding: '46px 0 20px' }}>
      <Reveal>
        <p className="eyebrow">Live registry</p>
        <h1 className="display" style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '14px 0 10px' }}>
          Pull medicines <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>from the source.</em>
        </h1>
        <p className="muted" style={{ maxWidth: '62ch', marginBottom: 26 }}>
          Pick a provider and search. Every adapter normalises into the same product shape, so the
          same card component renders results from any of them.
        </p>
      </Reveal>

      {/* Provider picker */}
      <div className="filters">
        {PROVIDERS.map((p) => (
          <button key={p.id} className={`chip ${provider === p.id ? 'on' : ''}`} onClick={() => setProvider(p.id)} title={p.note}>
            {p.label}
          </button>
        ))}
      </div>
      <p className="mono muted" style={{ fontSize: '.72rem', marginBottom: 20 }}>
        {PROVIDERS.find((p) => p.id === provider)?.note}
      </p>

      {/* Query */}
      <form onSubmit={run} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
        <label className="search-trigger" style={{ flex: 1, minWidth: 250, cursor: 'text' }}>
          <Search size={16} />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. metformin, amoxicillin, atorvastatin"
            style={{ flex: 1, background: 'none', border: 0, outline: 'none', color: 'var(--text)' }}
            aria-label="Query the medicine registry"
          />
        </label>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : <Zap size={16} />} {loading ? 'Querying…' : 'Query'}
        </button>
      </form>

      {ms !== null && !loading && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mono muted" style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 18 }}>
          {rows.length} records · {ms} ms · provider: {provider}
        </motion.p>
      )}

      {error && (
        <div className="note" style={{ marginBottom: 22 }}>
          <AlertTriangle size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="note mint" style={{ marginBottom: 26 }}>
        <Database size={17} />
        <span>
          <strong style={{ color: 'var(--text)' }}>About the prices.</strong> Public drug registries publish
          clinical data, not retail prices. The figures on API-sourced cards are generated deterministically
          from the record ID purely so the storefront is usable — they are <em>not</em> real prices. Swap
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '.85em' }}> indicativePrice() </code>
          in <code style={{ fontFamily: 'var(--font-mono)', fontSize: '.85em' }}>src/api/medicines.js</code> for your own price table.
        </span>
      </div>

      <div className="grid-meds" style={{ marginBottom: 60 }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <MedCardSkeleton key={i} />)
          : rows.map((m) => <MedCard key={m.id} med={m} />)}
      </div>

      {/* ---------- Where to find APIs ---------- */}
      <Reveal>
        <div className="sec-head">
          <div>
            <p className="eyebrow">Reference</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.5rem)' }}>
              Where to get <em style={{ fontStyle: 'italic', color: 'var(--mint)' }}>medicine data.</em>
            </h2>
          </div>
        </div>
      </Reveal>

      <div style={{ display: 'grid', gap: 14, marginBottom: 46 }}>
        {SOURCES.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <div className="panel">
              <div className="panel-head">
                <h3 style={{ marginRight: 'auto' }}>{s.name}</h3>
                <a className="btn btn-sm btn-ghost" href={s.url} target="_blank" rel="noopener noreferrer">
                  Docs <ExternalLink size={13} />
                </a>
              </div>
              <p className="muted" style={{ fontSize: '.92rem', marginBottom: 12 }}>{s.what}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="token">{s.key}</span>
                <span className="token">Images: {s.images}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="panel">
          <div className="panel-head"><h3>Wiring in your own API</h3></div>
          <p className="muted" style={{ fontSize: '.92rem', marginBottom: 16 }}>
            Create a <code className="mono">.env</code> file in the project root, then pick the
            “Your API” provider above. Your endpoint just has to return an array of objects.
          </p>
          <pre className="code">{`# .env
VITE_MEDICINE_API=https://your-backend.com/api/medicines
VITE_OPENFDA_KEY=optional_openfda_key

# Expected response shape (any of these keys work):
[
  {
    "id": "telma-40",
    "name": "Telma 40 Tablet",
    "salt_composition": "Telmisartan 40mg",
    "product_manufactured": "Glenmark",
    "product_price": 186,
    "mrp": 215,
    "prescription_required": true,
    "packaging": "30 tablets",
    "image_url": "https://cdn.example.com/telma40.jpg"
  }
]`}</pre>
          <p className="muted" style={{ fontSize: '.86rem', marginTop: 16 }}>
            The mapping lives in the <code className="mono">custom()</code> function in
            <code className="mono"> src/api/medicines.js</code> — adjust the field names there if yours differ.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
