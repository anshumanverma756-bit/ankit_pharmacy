# Ankit Pharmacy

A React e-pharmacy interface with a searchable medicine catalogue, full product detail
pages, a dark/light theme, an on-device prescription scanner, and a swap-in point for
your own medicine API.

> **Demo project.** It does not sell or dispense medicine, take payments, verify
> prescriptions or give medical advice.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview
```

Node 18+ required.

### Deploying
`vercel.json` is included with the SPA rewrite already configured. Push to GitHub and
import into Vercel/Netlify — build command `npm run build`, output directory `dist`.

---

## What's here

| Route | What it does |
|---|---|
| `/` | Hero, bento feature grid, category shelves, featured products |
| `/catalog` | Offline catalogue: search, 7 category filters, 5 sorts, Rx-only toggle |
| `/medicine/:id` | **Medicine detail page** — gallery, tabbed info, generic substitutes, related products |
| `/prescription` | **Upload a prescription photo → OCR → matched medicines + prices** |
| `/account` | **User account** — profile, chronic refill manager, order history with 1-click re-order, address book |
| `/saved` | Wishlist |
| `/checkout` | Order review, downloads a JSON summary |
| `/about`, `/contact`, `/policy/:slug` | Supporting pages |

### Features the reference site doesn't have
- **Dark + light mode** — full dual token set, follows your OS on first visit, remembers your choice after.
- **Full medicine detail pages** — tabbed uses/dosage/side effects/safety, generic substitute comparison table, related products.
- **User account** — profile, chronic care refill manager, order history, 1-click re-order, saved addresses.
- **Prescription scanner** — OCR in the browser, drug-name extraction, catalogue matching, basket total.
- **⌘K command palette** — keyboard-navigable search from anywhere.
- **Motion throughout** — page transitions, staggered scroll reveals, layout animation on filtering, spring-animated cart.

---

## Connecting your medicine API

Everything currently reads from the bundled catalogue in `src/data/catalog.js`.
**`src/api/medicines.js` is the only file you need to change** — all four screens
(catalogue, detail page, command palette, prescription scanner) already go through it.

It exposes four functions:

```js
normalise(record)                 // map ONE of your API records -> app shape
searchMedicines(query, { limit }) // catalogue + palette + scanner
getMedicine(id)                   // medicine detail page
matchToken(token)                 // OCR token -> best product match
```

Each has the `fetch` call written out and commented, so wiring up is uncommenting
and adjusting field names:

```js
export async function searchMedicines(query = '', { limit = 40 } = {}) {
  const res  = await fetch(`${import.meta.env.VITE_MEDICINE_API}/search?q=${query}&limit=${limit}`);
  const json = await res.json();
  return (json.data ?? json.results ?? json).map(normalise);
}
```

The shape every screen expects:

```js
{
  id, name, salt, manufacturer, category,
  price, mrp, rx, pack,
  image,            // <- your product photograph URL
  detail: { uses[], how, directions, sideEffects[], warnings },
  storage, country
}
```

`normalise()` already accepts common alternate key names (`product_name`,
`salt_composition`, `product_price`, `product_manufactured`, `image_url`,
`prescription_required`), so many feeds map with no edits at all.

### Product images
Real photographs live in `public/assets/` and are referenced by path in the catalogue
(`/assets/mitex-500.jpg`). Products without one fall back to `artFor()`, a deterministic
generated SVG, so nothing ever renders as a broken image. Once your API supplies
`image_url`, that takes over automatically.

## Prescription scanner

`src/pages/Prescription.jsx`

1. **Read** — `tesseract.js` (lazy-imported, so it isn't in the main bundle) runs WASM OCR in the browser.
2. **Clean** — strips list numbers, dosage patterns like `1-0-1`, and ~50 filler words (`tab`, `mg`, `daily`, `doctor`…).
3. **Resolve** — each token goes to `matchToken()`, the same swappable lookup the rest of the app uses.
4. **Price** — matches are totalled, then added to the bag in one action.

The image never leaves the device. To improve accuracy on your own prescriptions, extend
the `NOISE` set and the token-pairing heuristic at the top of that file.

---

## Project structure

```
src/
  api/medicines.js        THE SWAP POINT — plug your medicine API in here
  context/AppContext.jsx  theme, cart, wishlist, addresses, refills, toasts, Cmd-K
  data/catalog.js         29-product seed catalogue, detail copy, SVG artwork fallback
  ../public/assets/       real product photographs
  components/             Navbar, Footer, MedCard, CartDrawer, CommandPalette, Toast, Reveal
  pages/                  11 route components
  styles.css              design tokens + all styling (no CSS framework)
```

## Theming

Both themes are defined as CSS custom properties under `[data-theme='dark']` and
`[data-theme='light']` at the top of `styles.css`. Change `--mint`, `--amber` and the
background/surface ramp to rebrand the whole app.
