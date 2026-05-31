# Win your POS — Demo Project (context for Claude Code)

## What this is
Self-contained HTML demos used to pitch **Win your POS** — a white-label, processor-agnostic
restaurant point-of-sale platform — to a **US payments + POS reseller / distribution partner**.
The goal of the demos is to convince that partner to resell **Win your POS** under **their own
brand**, to **their own restaurant clients**, on **their own contract** — while keeping their
merchant-processing revenue. The platform powers it; the partner owns the relationship.

There is a separate real product (`PDA-front`, an Angular / TypeScript app, plus `PDA` /
`PDA-deployment` in the **WinYourPos** GitHub org). **These HTML files are standalone demo
artifacts, not part of that Angular repo.** They are meant to be opened directly in a browser
(double-click) with zero build step. The Angular app is aligned **to** these demos (the demo is
the design source of truth), not the reverse.

### What the real product actually is (ground every claim in this — do not invent features)
- **Front of house:** POS register (order → modifiers → ticket → pay, server-authoritative
  money), KDS kitchen display (stations, live routing, colour-coded timers, bump/recall,
  all-day), CFD customer-facing display, self-order Kiosk, Drive-thru, Online ordering, guest
  app, delivery.
- **Payments:** **processor-agnostic** gateway — the processor is a pluggable seam, the partner
  is not locked in. Today: Stripe Terminal (card-present EMV) + Stripe Connect direct charges
  where **each store is the merchant of record** (funds settle to the store; the platform/partner
  earns a configurable application fee). The card PAN never touches the server.
- **White-label multi-tenant:** each store is its own isolated tenant (own identity org +
  Postgres row-level security). One platform, many independently branded stores.
- **Reliability & security:** offline-first sync (replay-safe idempotent writes + change-log),
  real identity/auth (Zitadel, HttpOnly-cookie BFF, MFA, fail-closed tenant isolation),
  PCI-conscious (card data tokenised to the processor; secrets/PAN never logged).
- **AI Guru:** one Claude-backed AI service over read-only store data (forecasting, smart 86 /
  out-of-stock, upsell, anomaly detection), RBAC + tenant scoped, opt-in and graceful-off.
- **Admin:** multi-store switcher, owner portal, user management + RBAC, store-setup wizard,
  24+ live reports. 100+ screens; bilingual (EN/EL) capable. Production-grade, deployable.

### The pitch (what the demos must land, in the reseller's language)
1. **Keep your processing revenue** — processor-agnostic; bring your own processor; you are not
   disintermediated.
2. **Your brand, your client, your contract** — true white-label; you own the relationship, we
   power the platform.
3. **Always-current** — modern cloud stack + AI included (not an upsell), continuous updates.
4. **Migrate legacy** (e.g. MICROS) to a modern multi-unit, multi-location cloud POS.
5. **Reliable + local** — offline-first so the floor never stops; the partner provides local
   support, the platform is dependable and secure.

Tone: confident, concrete, respectful of a veteran operator. No hype.

### Hard rules
- **Never name any specific individual** anywhere in the demos. Address the audience by role
  only ("partners", "resellers", "your clients"). **Never insert the partner company name.**
- **Keep every file single-file and dependency-free** (only Google Fonts via CDN). No bundler,
  no npm packages, no framework. Anyone must be able to open the `.html` by double-clicking.
- **Don't invent customer logos, testimonials, or hard pricing.** Competitor figures are
  "industry-reported"; any ROI/residual calculator is clearly labelled illustrative.
- **Brand:** the product is **"Win your POS"**. Standalone "Spark" → "Win your" (word boundary;
  never touch "Sparkling"); "Spark POS" → "Win your POS". The wordmark/title reads "Win your POS".
- Preserve the section-comment banners in each file.

## Files
| File | What it is |
|------|------------|
| `spark-pos.html` | **Marketing / partner landing page.** Hero → live white-label "make it yours" brand-swap → device surfaces → Ask Guru AI advisor → partner-activation pipeline → ROI/residual calculator → competitor comparison table → partner economics → "production-ready" tech block → FAQ → CTA. |
| `spark-system.html` | **Interactive product demo app.** One page, three surfaces switched by a top segmented control: **Order**, **Kitchen (KDS)**, **Reports**. The three are wired together (see Data flow). |
| `guru.html` | **Ask Guru full chat page**, opened from both the landing AI teaser and the POS Reports → Insights → Ask Guru entry. One AI advisor over the store's data. |
| `try.html` | Branded welcome splash (the QR landing target) → "Try the live system" CTA into `spark-system.html`. |
| `docs/RESEARCH_SUMMARY.md` | Distilled strategy/research behind the demo (reseller decision criteria, competitive landscape, landing-page best practices). The "why". |
| `scripts/test.js` | Node harness that syntax-checks the embedded JS and renders every report against a DOM stub. Run after editing `spark-system.html`. |

## Design system (shared by all files, via CSS variables)
The identity is **light / blue** (Win your POS). Keep the CSS variable **names**; these are the
intended **values**:
```
--bg:#FFFFFF       --surface:#FFFFFF   --surface-2:#F4F6F8  --surface-3:#E8EBEF
--border:rgba(17,24,39,.10)            (stronger border: rgba(17,24,39,.16))
--primary:#1B6FF3  --primary-2:#0A5FE0
--grad:linear-gradient(135deg,#2F86FF,#1366EC)
--text:#0B0D12     dimmed: rgba(13,17,23,.58) / rgba(13,17,23,.40)
--success:#16A34A  --warn:#D97706  --error:#DC2626  --blue:#1B6FF3  --purple:#7C3AED
on-primary: text/icons that sit on the blue accent are #FFFFFF
shadows: soft rgba(17,24,39,.10–.14) (KEEP modal/overlay scrims + chart tooltips dark w/ white text)
radii: 14px inputs / 16–20px cards
fonts: 'Sora' (display+body), 'JetBrains Mono' (labels, numbers, code)
```
Aesthetic: light-first, single blue accent. Real product screenshots are NOT used —
UI is rendered in CSS. Keep that consistent.

## `spark-system.html` architecture (the important one)
Vanilla JS, one `<script>`. Key globals:

- **`MENU`** — categories → items. Each item:
  `{id, nm, base, st(station), prep, ds, groups:[...], notes}`.
  A **modifier group** is `{n(name), req(bool), min, max, kind?, opts:[[name,'',priceDelta], ...]}`.
  `kind` may be `'temp'` (cooking temperature) or `'remove'` (shows red on the check/KDS).
  Required groups must hit `min` before the item can be added; `max` caps multi-select.
  Price deltas are upcharges (e.g. `['Smoked bacon','',2.5]`).
- **`STATIONS`** / `STATION_COLORS` — grill, sauté, cold, bar, dessert/pastry (KDS routing).
- **`state`** — `{check[], guests, table, orderType, orderSeq, tickets[], recallStack[], rep{}, activeReport}`.
- **`state.rep`** — every reporting dataset (seeded with a realistic day): `netSales, covers,
  checks, voids/comps/discounts, laborCost/laborHours, hourly[]/hourlyLW[], payMix, svcMix,
  mix{}, servers[], exc[], catSales, daypart, laborPctByHour, laborByRole, modifiers[],
  timeclock[], cash{}, ticketTimes{}, inventory[], cogs{}, loyalty{}, loyaltyTop[], promos[],
  locations[], tax fields`.
- **`REPORTS`** — the report catalog: **10 groups, 36 reports**, each `{id, ic, name, desc, fn}`
  where `fn()` returns an HTML string rendered into `#repContent`. Sidebar is built from this.
- Render helpers (all return HTML strings): `kpiGrid`, `bars`, `tbl`, `panel`, `donutWrap`,
  `gauge`, `miniMixTable`, `mixArr`. SVG charts are hand-rolled (no chart library).

### Data flow (the demo's "wow" — keep it working)
1. **Order**: tap item → modifier sheet → `Add to order` pushes a line into `state.check`.
2. **Send to kitchen** (`fireToKitchen`) → creates a ticket in `state.tickets` → appears live in
   **Kitchen** with a colour-coded count-up timer (green <6min, yellow 6–10, red >10) and station
   routing, bump/recall, all-day view.
3. **Pay & close** (`payAndClose`) → books revenue into `state.rep` (net sales, covers, menu mix,
   payment mix, hourly) → **Reports** update live; a toast confirms.
The top "Kitchen" tab shows a badge with the active ticket count.

## Conventions
- Money: `money()` (rounded) and `money2()` (2dp). Don't reformat ad hoc.
- New report = add an entry to `REPORTS` + a `repXxx()` function returning HTML. Reuse helpers.
- New menu item with options = extend `MENU` using the group/opts shape above; station must be a
  key of `STATIONS` so KDS routes it.
- Keep edits inside the single file; preserve the section-comment banners.

## How to run / verify
- Preview: just open the file in a browser, or `python3 -m http.server` then visit the file.
- After any JS change to `spark-system.html`: `node scripts/test.js` (expects
  "JS parses OK", "Reports OK 36/36", and a working `payAndClose`).

## Backlog (suggested next steps, roughly prioritized)
1. **Make the date-range real**: Yesterday / WTD / MTD / Custom swap `state.rep` datasets.
2. **Menu & Modifier admin surface** (CRUD) that feeds the Order menu — mirrors a real back office.
3. **Custom report builder**: pick metrics × dimensions, render via existing helpers.
4. **Persist demo state** across view switches/reload (sessionStorage) when running locally.
5. **Landing polish**: testimonials/logos slot (leave empty until real), Core Web Vitals pass,
   WCAG AA pass.
6. **(Bigger)** Port the proven demo flows into the real Angular `PDA-front` app.

See `docs/RESEARCH_SUMMARY.md` for the strategic reasoning before changing messaging or structure.
