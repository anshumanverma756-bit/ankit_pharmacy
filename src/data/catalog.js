// Local seed catalogue. Acts as the offline fallback and price book.
// Products with a real photograph use `photo`; everything else falls back
// to a deterministic generated SVG so nothing renders broken.

export const CATEGORIES = [
  { id: 'prescription', label: 'Prescription (Rx)' },
  { id: 'cardiac-diabetes', label: 'Cardiac & Diabetes' },
  { id: 'antibiotics', label: 'Antibiotics' },
  { id: 'vitamins', label: 'Vitamins & Immunity' },
  { id: 'devices', label: 'Monitors & Devices' },
  { id: 'ayurveda', label: 'Ayurveda & Wellness' },
  { id: 'skin-care', label: 'Derma & Skin' },
];

/** Deterministic SVG artwork so every product has a picture with zero network calls. */
export function artFor(seed = '', kind = 'tablet') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  const a = `hsl(${h} 55% 42%)`;
  const b = `hsl(${(h + 48) % 360} 62% 26%)`;
  const c = `hsl(${(h + 20) % 360} 70% 72%)`;

  const shapes = {
    tablet: `<ellipse cx="150" cy="115" rx="62" ry="42" fill="${c}" opacity=".95"/><path d="M88 115h124" stroke="${b}" stroke-width="4" stroke-linecap="round"/>`,
    capsule: `<rect x="86" y="88" width="128" height="56" rx="28" fill="${c}"/><path d="M150 88v56" stroke="${b}" stroke-width="4"/><rect x="86" y="88" width="64" height="56" rx="28" fill="${b}" opacity=".55"/>`,
    syrup: `<rect x="116" y="58" width="68" height="106" rx="14" fill="${c}"/><rect x="132" y="42" width="36" height="22" rx="6" fill="${b}"/><rect x="124" y="104" width="52" height="52" rx="8" fill="${b}" opacity=".5"/>`,
    device: `<rect x="92" y="70" width="116" height="84" rx="16" fill="${c}"/><rect x="110" y="90" width="80" height="34" rx="6" fill="${b}"/><circle cx="150" cy="140" r="7" fill="${b}"/>`,
    drops: `<path d="M150 56c26 34 40 52 40 70a40 40 0 1 1-80 0c0-18 14-36 40-70z" fill="${c}"/>`,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 230">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="300" height="230" fill="url(#g)"/>
<circle cx="252" cy="34" r="66" fill="#fff" opacity=".07"/>
<circle cx="42" cy="200" r="52" fill="#fff" opacity=".05"/>
${shapes[kind] || shapes.tablet}
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/* Reusable clinical copy blocks, kept deliberately general. */
const METFORMIN = {
  uses: ['Type 2 diabetes mellitus', 'Improving blood sugar control alongside diet and exercise', 'Sometimes prescribed for insulin resistance'],
  how: 'Metformin lowers the amount of glucose the liver releases and helps the body respond better to its own insulin.',
  directions: 'Swallow whole with water, with or just after food, at the times your doctor has specified. Do not crush or chew.',
  sideEffects: ['Nausea or an upset stomach', 'Loose stools, especially in the first weeks', 'A metallic taste', 'Reduced appetite'],
  warnings: 'Tell your doctor about any kidney or liver problems, and before any scan involving contrast dye. Alcohol increases the risk of a rare but serious complication.',
};
const PARACETAMOL = {
  uses: ['Fever', 'Mild to moderate pain \u2014 headache, body ache, toothache', 'Post-vaccination discomfort'],
  how: 'Paracetamol raises the body\u2019s pain threshold and acts on the part of the brain that regulates temperature.',
  directions: 'Take with water. Leave at least 4\u20136 hours between doses and never exceed the daily limit printed on the pack.',
  sideEffects: ['Generally well tolerated at recommended doses', 'Rash in rare cases'],
  warnings: 'Exceeding the stated dose can cause serious liver damage. Check other medicines you are taking \u2014 many combination products already contain paracetamol.',
};
const GENERIC = {
  uses: ['As directed by your prescribing doctor'],
  how: 'Ask your pharmacist for the mechanism relevant to your condition.',
  directions: 'Follow the dosage printed on your prescription or the pack insert.',
  sideEffects: ['Refer to the patient information leaflet supplied with the pack'],
  warnings: 'Tell your doctor about other medicines, supplements and existing conditions before starting.',
};

const raw = [
  // id, name, salt, manufacturer, category, price, mrp, rx, kind, pack, photo, detail
  ['mitex-500', 'Mitex-500 Tablet', 'Metformin Hydrochloride IP 500mg', 'Mitex Healthcare', 'cardiac-diabetes', 96, 118, true, 'tablet', '10 x 10 tablets', '/assets/mitex-500.jpg', METFORMIN],
  ['okamet-500', 'Okamet-500 Tablet', 'Metformin Hydrochloride IP 500mg', 'Cipla Limited', 'cardiac-diabetes', 132, 158, true, 'tablet', '30 x 20 tablets', '/assets/okamet-500.jpg', METFORMIN],
  ['jentadueto', 'Jentadueto 2.5mg/1000mg', 'Linagliptin 2.5mg + Metformin 1000mg', 'Boehringer Ingelheim', 'cardiac-diabetes', 1284, 1465, true, 'tablet', '56 film-coated tablets', '/assets/jentadueto.jpg', {
    ...METFORMIN,
    uses: ['Type 2 diabetes where metformin alone is not enough', 'Dual-action blood sugar control in one tablet'],
    how: 'Combines metformin with linagliptin, which helps the body release more insulin after meals and less glucose between them.',
  }],
  ['dolo-650', 'Dolo-650 Tablet', 'Paracetamol IP 650mg', 'Micro Labs Limited', 'prescription', 33, 38, false, 'tablet', '15 tablets', '/assets/dolo-650.webp', PARACETAMOL],

  ['telma-40', 'Telma 40 Tablet', 'Telmisartan 40mg', 'Glenmark Pharmaceuticals', 'cardiac-diabetes', 186, 215, true, 'tablet', '10 x 15 tablets', '/assets/telma-40.webp', {
    uses: ['High blood pressure (hypertension)', 'Protecting the heart and kidneys in at-risk patients'],
    how: 'Telmisartan relaxes blood vessels so the heart does not have to work as hard to push blood through them.',
    directions: 'Usually once daily, at the same time each day, with or without food.',
    sideEffects: ['Dizziness, particularly on standing up quickly', 'Back or joint ache', 'Tiredness'],
    warnings: 'Not for use in pregnancy. Have your blood pressure and kidney function checked as advised.',
  }],
  ['glycomet-gp2', 'Glycomet-GP 2 Forte', 'Metformin Hydrochloride SR 1000mg + Glimepiride 2mg', 'USV Private Limited', 'cardiac-diabetes', 142, 168, true, 'tablet', '10 x 10 tablets', '/assets/glycomet-gp2.jpg', {
    ...METFORMIN,
    uses: ['Type 2 diabetes needing two-drug control'],
    warnings: 'Glimepiride can lower blood sugar too far. Learn the signs of hypoglycaemia and keep a fast-acting sugar source with you.',
  }],
  ['rosuvas-10', 'Rosuvas 10 Tablet', 'Rosuvastatin IP 10mg', 'Sun Pharmaceutical', 'cardiac-diabetes', 224, 260, true, 'tablet', '15 tablets', '/assets/rosuvas-10.jpg', {
    uses: ['Lowering LDL cholesterol', 'Reducing cardiovascular risk'],
    how: 'Rosuvastatin blocks an enzyme the liver uses to make cholesterol.',
    directions: 'Once daily, usually in the evening, with or without food.',
    sideEffects: ['Muscle ache', 'Headache', 'Stomach upset'],
    warnings: 'Report unexplained muscle pain or weakness to your doctor promptly.',
  }],
  ['ecosprin-75', 'Ecosprin-75 Tablet', 'Aspirin Gastro-resistant IP 75mg', 'USV Private Limited', 'cardiac-diabetes', 12, 15, false, 'tablet', '25 x 14 tablets', '/assets/ecosprin-75.jpg', {
    uses: ['Long-term prevention of heart attack and stroke in at-risk patients', 'Prescribed after certain cardiac procedures'],
    how: 'Low-dose aspirin makes platelets less likely to clump together and form a clot.',
    directions: 'Swallow the gastro-resistant tablet whole after food \u2014 do not crush or chew, as the coating protects your stomach.',
    sideEffects: ['Stomach irritation or heartburn', 'Bruising more easily than usual', 'Nausea'],
    warnings: 'Tell any doctor or dentist that you take this before a procedure. Report black stools or unusual bleeding straight away.',
  }],
  ['pan-d', 'Pan-D Capsule', 'Pantoprazole Gastro-resistant 40mg + Domperidone PR 30mg', 'Alkem Laboratories', 'prescription', 196, 228, true, 'capsule', '15 capsules', '/assets/pan-d.jpg', {
    uses: ['Acid reflux and heartburn', 'Gastric discomfort with bloating'],
    how: 'Pantoprazole reduces stomach acid; domperidone helps the stomach empty more readily.',
    directions: 'Usually one capsule before breakfast, swallowed whole.',
    sideEffects: ['Headache', 'Dry mouth', 'Loose stools'],
    warnings: 'Long-term acid suppression should be reviewed periodically by your doctor.',
  }],
  ['augmentin-625', 'Augmentin 625 Duo', 'Amoxycillin 500mg + Potassium Clavulanate 125mg', 'GlaxoSmithKline', 'antibiotics', 218, 245, true, 'tablet', '10 tablets', '/assets/augmentin-625.jpg', {
    uses: ['Bacterial infections of the chest, throat, urinary tract, skin or teeth'],
    how: 'Amoxycillin stops bacteria building their cell walls; clavulanic acid stops them defending against it.',
    directions: 'Take at evenly spaced intervals, ideally at the start of a meal.',
    sideEffects: ['Nausea', 'Diarrhoea', 'Rash'],
    warnings: 'Finish the full course even once you feel better. Tell your doctor about any penicillin allergy.',
  }],
  ['azithral-500', 'Azithral-500 Tablet', 'Azithromycin IP 500mg', 'Alembic Pharmaceuticals', 'antibiotics', 128, 148, true, 'tablet', '5 tablets', '/assets/azithral-500.jpg', {
    uses: ['Respiratory tract infections', 'Throat, sinus and ear infections', 'Certain skin and soft tissue infections'],
    how: 'Azithromycin stops bacteria from making the proteins they need to grow and multiply.',
    directions: 'Usually one tablet daily for a short course, at the same time each day. Can be taken with or without food.',
    sideEffects: ['Nausea or stomach pain', 'Diarrhoea', 'Headache'],
    warnings: 'Complete the full course even if you feel better early. Tell your doctor about any heart rhythm problems.',
  }],
  ['taxim-o-200', 'Taxim-O 200 Tablet', 'Cefixime IP 200mg', 'Alkem Laboratories', 'antibiotics', 172, 196, true, 'tablet', '10 x 10 tablets', '/assets/taxim-o-200.jpg', {
    uses: ['Urinary tract infections', 'Throat and chest infections', 'Some ear infections'],
    how: 'Cefixime breaks down the protective wall bacteria need to survive.',
    directions: 'Take at evenly spaced intervals, with food to reduce stomach upset.',
    sideEffects: ['Loose stools', 'Nausea', 'Stomach discomfort'],
    warnings: 'Tell your doctor about any allergy to penicillin or cephalosporin antibiotics before starting.',
  }],
  ['combiflam', 'Combiflam Tablet', 'Ibuprofen IP 400mg + Paracetamol IP 325mg', 'Sanofi India', 'prescription', 44, 52, false, 'tablet', '20 tablets', '/assets/combiflam.jpg', {
    ...PARACETAMOL,
    uses: ['Pain with inflammation \u2014 sprains, dental pain, period pain', 'Fever'],
    warnings: 'Take with food. Not suitable if you have stomach ulcers, kidney disease or are in late pregnancy.',
  }],
  ['montair-lc', 'Montair-LC Tablet', 'Montelukast 10mg + Levocetirizine 5mg', 'Cipla Limited', 'prescription', 198, 226, true, 'tablet', '15 tablets', null, {
    uses: ['Allergic rhinitis', 'Allergy-linked asthma symptoms'],
    how: 'Blocks two different chemical messengers the body releases during an allergic reaction.',
    directions: 'Usually one tablet in the evening.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Headache'],
    warnings: 'May cause drowsiness \u2014 be careful driving. Report any mood or sleep changes.',
  }],
  ['zincovit', 'Zincovit Tablet', 'Multivitamin + Multimineral + Zinc', 'Apex Laboratories', 'vitamins', 106, 125, false, 'tablet', '15 tablets', null, GENERIC],
  ['shelcal-500', 'Shelcal 500 Tablet', 'Calcium Carbonate 500mg + Vitamin D3', 'Torrent Pharmaceuticals', 'vitamins', 118, 138, false, 'tablet', '15 tablets', null, GENERIC],
  ['limcee-500', 'Limcee 500 Chewable', 'Vitamin C 500mg', 'Abbott India', 'vitamins', 28, 34, false, 'tablet', '15 tablets', null, GENERIC],
  ['neurobion-forte', 'Neurobion Forte', 'Vitamin B-Complex with B12', 'Procter & Gamble', 'vitamins', 38, 45, false, 'tablet', '30 tablets', null, GENERIC],
  ['omega-3', 'Seven Seas Omega-3', 'Fish Oil 1000mg + EPA/DHA', 'Merck Consumer Health', 'vitamins', 452, 520, false, 'capsule', '60 capsules', null, GENERIC],
  ['omron-hem7120', 'Omron HEM-7120 BP Monitor', 'Digital automatic upper-arm monitor', 'Omron Healthcare', 'devices', 1899, 2350, false, 'device', '1 unit', null, {
    uses: ['Measuring blood pressure at home', 'Tracking readings between clinic visits'],
    how: 'An inflatable cuff measures the pressure at which blood flow returns to the arm.',
    directions: 'Sit still for five minutes first, feet flat, arm supported at heart height. Take two readings a minute apart.',
    sideEffects: ['None \u2014 this is a device, not a medicine'],
    warnings: 'Home readings supplement, not replace, clinical assessment. Bring your log to appointments.',
  }],
  ['accu-chek-active', 'Accu-Chek Active Glucometer', 'Blood glucose monitoring system', 'Roche Diagnostics', 'devices', 1099, 1450, false, 'device', 'Kit + 10 strips', null, GENERIC],
  ['dr-trust-oximeter', 'Dr Trust Pulse Oximeter 210', 'SpO2 & pulse rate monitor', 'Dr Trust', 'devices', 949, 1299, false, 'device', '1 unit', null, GENERIC],
  ['chyawanprash', 'Dabur Chyawanprash Awaleha', 'Ayurvedic immunity rasayana', 'Dabur India', 'ayurveda', 285, 330, false, 'syrup', '500 g', null, GENERIC],
  ['ashwagandha', 'Himalaya Ashwagandha', 'Withania somnifera 250mg', 'Himalaya Wellness', 'ayurveda', 168, 195, false, 'tablet', '60 tablets', null, GENERIC],
  ['liv-52-ds', 'Liv.52 DS Tablet', 'Hepatoprotective herbal blend', 'Himalaya Wellness', 'ayurveda', 189, 215, false, 'tablet', '60 tablets', null, GENERIC],
  ['cetaphil-cleanser', 'Cetaphil Gentle Skin Cleanser', 'Non-comedogenic daily cleanser', 'Galderma India', 'skin-care', 399, 469, false, 'syrup', '250 ml', null, GENERIC],
  ['candid-b', 'Candid-B Cream', 'Clotrimazole 1% + Beclometasone 0.025%', 'Glenmark Pharmaceuticals', 'skin-care', 92, 108, true, 'drops', '20 g', null, GENERIC],
  ['refresh-tears', 'Refresh Tears Eye Drops', 'Carboxymethylcellulose 0.5%', 'Allergan India', 'prescription', 168, 192, false, 'drops', '10 ml', null, GENERIC],
  ['thyronorm-50', 'Thyronorm 50mcg Tablet', 'Thyroxine Sodium 50mcg', 'Abbott India', 'prescription', 152, 176, true, 'tablet', '120 tablets', null, {
    uses: ['Underactive thyroid (hypothyroidism)'],
    how: 'Replaces the thyroid hormone your body is not producing in sufficient quantity.',
    directions: 'On an empty stomach, first thing in the morning, at least 30 minutes before food or tea.',
    sideEffects: ['Palpitations or tremor if the dose is too high', 'Difficulty sleeping'],
    warnings: 'Dose is adjusted from blood tests. Never change it yourself.',
  }],
];

export const CATALOG = raw.map(
  ([id, name, salt, mfr, category, price, mrp, rx, kind, pack, photo, detail]) => ({
    id,
    name,
    salt,
    manufacturer: mfr,
    category,
    price,
    mrp,
    rx,
    pack,
    kind,
    image: photo || artFor(id, kind),
    hasPhoto: Boolean(photo),
    source: 'seed',
    detail: detail || GENERIC,
    storage: 'Store below 30\u00b0C in a cool, dry place, away from direct sunlight. Keep out of reach of children.',
    country: 'India',
  })
);

export const bySlug = new Map(CATALOG.map((m) => [m.id, m]));
export const inr = (n) => '\u20b9' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

/** Same salt, different brand \u2014 powers the "substitutes" strip on the detail page. */
export function substitutesFor(med) {
  const key = (s) => (s || '').toLowerCase().split(/[+,]/)[0].replace(/[^a-z]/g, '');
  return CATALOG.filter((m) => m.id !== med.id && key(m.salt) === key(med.salt));
}

export function relatedTo(med, n = 4) {
  return CATALOG.filter((m) => m.id !== med.id && m.category === med.category).slice(0, n);
}
