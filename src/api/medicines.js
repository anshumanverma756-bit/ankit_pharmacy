/**
 * ============================================================
 *  ANKIT PHARMACY — medicine data layer
 * ============================================================
 * Right now everything is served from the bundled catalogue in
 * src/data/catalog.js. When you wire in your external medicine API,
 * this is the only file you need to touch — every screen in the app
 * already reads through these two functions.
 *
 * Normalised product shape the whole UI expects:
 *
 *   {
 *     id, name, salt, manufacturer, category,
 *     price, mrp, rx, pack, image, source,
 *     detail: { uses[], how, directions, sideEffects[], warnings },
 *     storage, country
 *   }
 */

import { CATALOG, artFor } from '../data/catalog.js';

/* ------------------------------------------------------------------
 * 1. Map one record from YOUR API into the shape above.
 *    Adjust the field names on the right to match your response.
 * ---------------------------------------------------------------- */
export function normalise(r = {}, i = 0) {
  const id = String(r.id ?? r._id ?? r.sku ?? `api-${i}`);
  return {
    id,
    name: r.name ?? r.product_name ?? 'Unnamed product',
    salt: r.salt ?? r.salt_composition ?? r.composition ?? '',
    manufacturer: r.manufacturer ?? r.product_manufactured ?? r.marketer ?? 'Unknown',
    category: r.category ?? r.sub_category ?? 'prescription',
    price: Number(r.price ?? r.product_price ?? 0),
    mrp: Number(r.mrp ?? r.product_price ?? r.price ?? 0),
    rx: Boolean(r.rx ?? r.prescription_required ?? r.is_prescription),
    pack: r.pack ?? r.packaging ?? r.pack_size ?? '1 pack',
    // Your API's product photograph goes here. artFor() is only the fallback.
    image: r.image ?? r.image_url ?? r.photo ?? artFor(id, r.type),
    source: 'api',
    detail: {
      uses: r.uses ?? r.indications ?? ['As directed by your prescribing doctor'],
      how: r.how_it_works ?? r.mechanism ?? '',
      directions: r.directions ?? r.how_to_use ?? 'Follow the dosage on your prescription or pack insert.',
      sideEffects: r.side_effects ?? r.sideEffects ?? [],
      warnings: r.warnings ?? r.safety_advice ?? '',
    },
    storage: r.storage ?? 'Store below 30\u00b0C in a cool, dry place.',
    country: r.country ?? 'India',
  };
}

/* ------------------------------------------------------------------
 * 2. Search. Replace the body with your fetch call.
 * ---------------------------------------------------------------- */
export async function searchMedicines(query = '', { limit = 40 } = {}) {
  // ---- EXTERNAL API GOES HERE -------------------------------------
  // const res  = await fetch(`${import.meta.env.VITE_MEDICINE_API}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  // const json = await res.json();
  // return (json.data ?? json.results ?? json).map(normalise);
  // -----------------------------------------------------------------

  const q = query.toLowerCase().trim();
  const rows = !q
    ? CATALOG
    : CATALOG.filter((m) =>
        `${m.name} ${m.salt} ${m.manufacturer} ${m.category}`.toLowerCase().includes(q)
      );
  return rows.slice(0, limit);
}

/* ------------------------------------------------------------------
 * 3. Fetch one product by id — used by the medicine detail page.
 * ---------------------------------------------------------------- */
export async function getMedicine(id) {
  // const res = await fetch(`${import.meta.env.VITE_MEDICINE_API}/medicines/${id}`);
  // return normalise(await res.json());
  return CATALOG.find((m) => m.id === id) || null;
}

/* ------------------------------------------------------------------
 * 4. Resolve a free-text token from prescription OCR to a product.
 * ---------------------------------------------------------------- */
export async function matchToken(token) {
  const clean = token.replace(/[^a-z0-9\s-]/gi, ' ').trim();
  if (clean.length < 3) return null;
  const hits = await searchMedicines(clean, { limit: 1 });
  return hits[0] || null;
}
