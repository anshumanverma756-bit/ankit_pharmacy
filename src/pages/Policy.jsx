import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';

const DOCS = {
  privacy: {
    title: 'Privacy & data security',
    intro: 'What this demo stores, and where.',
    body: [
      ['Everything is local', 'Your bag, saved medicines, delivery addresses, refill reminders and theme choice are written to this browser\u2019s localStorage. There is no account, no database and no server that receives them.'],
      ['Prescription images', 'Images you upload to the scanner are read by Tesseract.js inside the page. The file is never sent anywhere. Clearing the page clears it.'],
      ['Third-party requests', 'The Live Data page makes direct requests to public registries (api.fda.gov, rxnav.nlm.nih.gov). Those services see your IP address, as with any website you visit. Google Fonts is used for typefaces.'],
      ['Clearing data', 'Clear your browser\u2019s site data for this origin to remove everything this app has stored.'],
    ],
  },
  rx: {
    title: 'Prescription (Rx) policy',
    intro: 'How prescription-only items are treated here.',
    body: [
      ['Flagged, not verified', 'Items marked Rx are labelled from registry metadata. This demo does not verify, validate or approve any prescription.'],
      ['What a real pharmacy does', 'A licensed pharmacy would require a legible, valid prescription from a registered practitioner, check it against the order, and keep a dispensing record.'],
      ['Never self-prescribe', 'Do not use the scanner output as a reason to buy, substitute or change a medicine. Talk to your prescriber or a pharmacist.'],
    ],
  },
  terms: {
    title: 'Terms of service',
    intro: 'The short version: this is a portfolio build.',
    body: [
      ['No commercial service', 'Nothing on this site constitutes an offer to sell. No contract is formed, no stock is held and no order is fulfilled.'],
      ['No medical advice', 'Content is illustrative. It is not medical, pharmaceutical or diagnostic advice and must not be relied on as such.'],
      ['Data accuracy', 'Records shown may be incomplete or out of date. Prices attached to API-sourced records are generated for demonstration and are not real.'],
      ['Use at your own risk', 'The software is provided as-is, without warranty.'],
    ],
  },
  returns: {
    title: 'Returns & refunds',
    intro: 'What the policy would cover in a live build.',
    body: [
      ['Not applicable here', 'No sale takes place, so there is nothing to return or refund.'],
      ['In a real pharmacy', 'Most jurisdictions restrict returns of medicines once they leave the premises, for safety reasons. Damaged, wrong or expired items are typically replaced.'],
      ['Cold-chain items', 'Temperature-sensitive products are usually non-returnable unless the chain was broken in transit.'],
    ],
  },
  'cold-chain': {
    title: 'Cold-chain shipping',
    intro: 'Handling temperature-sensitive medicine.',
    body: [
      ['Why it matters', 'Insulins, some biologics and certain vaccines lose potency outside a narrow temperature band. Handling is as important as the product itself.'],
      ['Typical controls', 'Validated insulated packaging, gel packs or dry ice, temperature loggers in the box, and a short delivery window with a signature on receipt.'],
      ['On arrival', 'A real pharmacy would ask you to check the logger and refrigerate immediately. If packaging arrives warm or damaged, do not use the contents \u2014 report it.'],
      ['Demo status', 'No physical shipping happens here.'],
    ],
  },
};

export default function Policy() {
  const { slug } = useParams();
  const doc = DOCS[slug];
  useEffect(() => { if (doc) document.title = `${doc.title} \u2014 ANKIT PHARMACY`; }, [doc]);
  if (!doc) return <Navigate to="/" replace />;

  return (
    <div className="shell" style={{ padding: '46px 0 20px', maxWidth: 820 }}>
      <Reveal>
        <p className="eyebrow">Policy</p>
        <h1 className="display" style={{ fontSize: 'clamp(2rem,4.4vw,3.2rem)', margin: '14px 0 10px' }}>{doc.title}</h1>
        <p className="muted" style={{ marginBottom: 34 }}>{doc.intro}</p>
      </Reveal>
      <div style={{ display: 'grid', gap: 14 }}>
        {doc.body.map(([h, p], i) => (
          <Reveal key={h} delay={i * 0.06}>
            <div className="panel">
              <h3 style={{ font: '600 1.15rem var(--font-display)', marginBottom: 10 }}>{h}</h3>
              <p className="muted" style={{ fontSize: '.93rem', lineHeight: 1.8 }}>{p}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
