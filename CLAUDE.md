# Spark POS — Demo Project (context for Claude Code)

## What this is
Two self-contained HTML demos used to pitch **Spark POS** — a white-label restaurant
point-of-sale platform — to a **US-based reseller / distribution partner**. The goal of the
demos is to convince that partner to resell Spark POS under their own brand to their existing
restaurant clients.

There is a separate real product (`pda-front`, an Angular 21 / TypeScript / Tailwind v4 app,
"production-ready, waiting for backend integration"). **These two HTML files are standalone
demo artifacts, not part of that Angular repo.** They are meant to be opened directly in a
browser (double-click) with zero build step.

### Hard rules
- **Never name any specific individual** anywhere in the demos. Address the audience by role
  only ("partners", "your clients", "resellers").
- **Keep both files single-file and dependency-free** (only Google Fonts via CDN). No bundler,
  no npm packages, no framework. Anyone must be able to open the `.html` by double-clicking.
- **No `localStorage`/`sessionStorage` is currently used.** (It's fine to add when running
  locally via Claude Code; just don't assume the claude.ai artifact sandbox.)
- Don't invent customer logos, testimonials, or hard pricing. Competitor figures are
  "industry-reported"; the ROI calculator is clearly labelled illustrative.

## Files
| File | What it is |
|------|------------|
| `spark-pos.html` | **Marketing / partner landing page.** Hero → live white-label "make it yours" brand-swap → 13 device surfaces → interactive POS test-drive → 13 AI services → partner-activation pipeline → ROI/residual calculator → competitor comparison table → partner economics → "production-ready" tech block → FAQ → CTA. |
| `spark-system.html` | **Interactive product demo app.** One page, three surfaces switched by a top segmented control: **Order**, **Kitchen (KDS)**, **Reports**. The three are wired together (see Data flow). |
| `docs/RESEARCH_SUMMARY.md` | Distilled strategy/research behind the demo (Heartland benchmark, reseller decision criteria, competitive landscape, landing-page best practices). The "why". |
| `scripts/test.js` | Node harness that syntax-checks the embedded JS and renders every report against a DOM stub. Run after editing `spark-system.html`. |

## Design system (shared by both files, via CSS variables)
```
--bg:#000        --surface:#0f0f10   --surface-2:#161618  --surface-3:#1d1d20
--border:rgba(255,255,255,.08)       --primary:#FF9500    --primary-2:#FF6B00
--grad:linear-gradient(135deg,#FF9500,#FF6B00)
--success:#34C759  --warn:#FFD60A  --error:#FF453A  --blue:#0A84FF  --purple:#BF5AF2
radii: 14px inputs / 16–20px cards
fonts: 'Sora' (display+body), 'JetBrains Mono' (labels, numbers, code)
```
Aesthetic: dark-first, single orange accent. Real product screenshots are NOT used —
UI is rendered in CSS. Keep that consistent.

## `spark-system.html` architecture (the important one)
Vanilla JS, one `<script>`. Key globals:

- **`MENU`** — categories → items. Each item:
  `{id, nm, base, st(station), prep, ds, groups:[...], notes}`.
  A **modifier group** is `{n(name), req(bool), min, max, kind?, opts:[[name,'',priceDelta], ...]}`.
  `kind` may be `'temp'` (cooking temperature) or `'remove'` (shows red on the check/KDS).
  Required groups must hit `min` before the item can be added; `max` caps multi-select.
  Price deltas are upcharges (e.g. `['Smoked bacon','',2.5]`).
- **`STATIONS`** / `STATION_COLORS` — grill, sauté, cold, bar, dessert (KDS routing).
- **`state`** — `{check[], guests, table, orderType, orderSeq, tickets[], recallStack[], rep{}, activeReport}`.
- **`state.rep`** — every reporting dataset (seeded with a realistic day): `netSales, covers,
  checks, voids/comps/discounts, laborCost/laborHours, hourly[]/hourlyLW[], payMix, svcMix,
  mix{}, servers[], exc[], catSales, daypart, laborPctByHour, laborByRole, modifiers[],
  timeclock[], cash{}, ticketTimes{}, inventory[], cogs{}, loyalty{}, loyaltyTop[], promos[],
  locations[], tax fields`.
- **`REPORTS`** — the report catalog: 9 groups, **24 reports**, each `{id, ic, name, desc, fn}`
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
  "Reports OK 24/24" and a working `payAndClose`).

## Backlog (suggested next steps, roughly prioritized)
1. **Link the two files**: landing "Test-drive the POS" button → open `spark-system.html`.
2. **Make the date-range real**: Yesterday / WTD / MTD / Custom should swap `state.rep` datasets
   (seed a few alternate days) instead of being cosmetic.
3. **Menu & Modifier admin surface** (CRUD) that feeds the Order menu — mirrors a real back office.
4. **Custom report builder**: pick metrics × dimensions, render via existing helpers.
5. **Persist demo state** across view switches/reload (sessionStorage) when running locally.
6. **Landing polish**: testimonials/logos slot (leave empty until real), Core Web Vitals pass,
   WCAG AA pass.
7. **(Bigger)** Port the proven demo flows into the real Angular `pda-front` app.

See `docs/RESEARCH_SUMMARY.md` for the strategic reasoning before changing messaging or structure.
