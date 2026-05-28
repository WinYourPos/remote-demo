# Spark POS — Demo

> 🚀 **Live demo:** **<https://winyourpos.github.io/remote-demo/spark-pos.html>**
> Open the **Test-drive the POS ↗** button or the **Try it yourself 📱** QR (scan from any phone — mobile-optimised UI).

Two standalone, zero-build HTML demos for pitching **Spark POS** — a white-label
restaurant point-of-sale platform — to a US reseller partner.

| File | What it is | Live |
|------|------------|------|
| **`try.html`** | Branded welcome splash partners see after scanning the QR. New POS + lightning-bolt logo (120 / 84 / 90px depending on viewport), eyebrow "● LIVE DEMO", "Next-gen restaurant POS" headline, 5 capability chips, one big "Try the live system →" CTA → `spark-system.html`. Portrait + landscape layouts. | [open ↗](https://winyourpos.github.io/remote-demo/try.html) |
| **`spark-pos.html`** | Partner-facing landing/marketing page. Hero → live white-label brand-swap → **13 device-surface mockups** → **Ask Guru AI advisor** → partner-activation pipeline → ROI/residual calculator → competitor comparison → partner economics → "production-ready" tech block → FAQ → CTA. | [open ↗](https://winyourpos.github.io/remote-demo/spark-pos.html) |
| **`spark-system.html`** | Interactive product demo. **Order + Kitchen (KDS) + Reports**, wired together: ring an item with modifiers → fire to the kitchen → close the check → reporting updates live. Mobile + landscape optimised — works on phone via the in-hero QR scan (lands on `try.html` first). | [open ↗](https://winyourpos.github.io/remote-demo/spark-system.html) |

## Open the demos

Just visit the live URL above, no install needed.

Or run locally — double-click either file, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/spark-pos.html
```

> Both hero CTAs are absolute-linked to the public Pages URL above, so
> **Test-drive the POS ↗** (desktop click) and **Try it yourself 📱**
> (QR scan) always land on the same public deployment — no localhost
> split-brain when presenting from a laptop.

## What's in the interactive demo

**Order screen** — full-service catalog with realistic upcharges
- 16 categories: Brunch · Burgers · Sandwiches · Mains · Pasta · Pizza · Tacos & Bowls · Seafood · Starters · Sides · Kids · Bar · Wine · Beer · Non-Alcoholic · Dessert
- 72 menu items
- Modifier groups with required min/max, temperature, remove kinds and priced add-ons (e.g. truffle fries `+$3`, lobster on tagliatelle `+$14`, big-rock-ice prep on the Old Fashioned, dry/wet/extra-dry on the Martini, size + crust on pizzas)
- Guest count, table number, dine-in / takeout / delivery / bar — all live; split check, void, manager actions

**Pay & close** — tender · tip · split modal (Heartland-equivalent)
- Tip pills: No tip · 15 · 18 · **20% ★** · 25 · **Custom $** — live grand-total update
- Six tender methods: 💳 Credit / Debit · 💵 Cash · 📱 Apple Pay · 📲 Google Pay · 🎁 Gift card · ⭐ Loyalty points
- Live **Balance** card (flips green at $0.00); type a smaller amount than the balance to split — tap a method to apply
- Applied tenders list with **✕** to remove each
- **Complete payment** enables only at $0.00 balance; receipt subtitle itemises every tender + tip; reporting (`payMix`, `tips`, `taxCollected`, `svcMix`, `hourly`, menu mix) updates live

**Kitchen (KDS)** — what the line sees
- Station filter (Grill · Sauté · Cold · Bar · Pastry) with a live ticket count per station
- Color-coded age timer (green < 6 min · yellow 6–10 · red > 10), bump · recall · rush
- Modifiers colored on the card: green for add, red for remove, accent for temperature
- All-Day view: total of every item working across active tickets

**Reports** — 36 reports across 10 sidebar groups, every pill on the header bar is live
- **Date range** — Yesterday · Today · **WTD** · **MTD** · **Custom…** all rebind `state.rep` to their own seeded dataset and re-render the active report. Custom… opens a date picker; the chosen window auto-scales (e.g. "12 days").
- **Insights** — AI Watchlist (anomaly feed)
- **Overview** — Dashboard
- **Sales** — Summary · Hourly · Daypart · Category · Service Type · Payment · Tax · Refunds · Channels (net of marketplace fees)
- **Menu** — Mix · Modifiers · Engineering
- **Labor** — Summary · Time Clock · Sales vs Labor · Tips · Tip Declaration (Form 8027)
- **Staff** — Server performance · Sales exceptions · Discount / Comp reasons · Audit log
- **Guests** — Loyalty · Promo effectiveness · Guest cohort · Gift cards
- **Operations** — Cash · Speed of service · Station throughput · Open tickets · Sales heatmap (hour × DOW) · End-of-day Z-report
- **Inventory** — On-hand · Cost of goods (food / bev / prime)
- **Multi-Unit** — Location comparison

Every report icon in the sidebar drawer now renders through the same Lucide stroke-currentColor SVG path — three previously stray emojis (⭐ / ↩️ / 🎟) were swapped to mapped equivalents (🏅 award / 🔁 repeat-2 / 🎁 gift) so the rendered drawer is fully consistent.

## Ask Guru (replaces the old "13 AI services" grid)

The AI section on the landing is no longer a feature catalogue — it's a single interactive advisor with one job: read the data and give a starting point.

- **Input + Ask Guru →** for free-form questions; tiny keyword router maps to the closest canned answer (`camp/promo` → campaign, `dish/menu/add` → dish, `margin/cogs/cost` → margin, otherwise → biggest opportunity).
- **Four chip starters**: *What campaign should I run this week?* · *What new dish should I add to the menu?* · *What's my biggest opportunity right now?* · *How's my margin trending?*
- Each answer is structured as **Read of your data → Recommendation → Why it'll work → Expected outcome**, with JetBrains Mono section labels, mixed-bullet lists, brand-orange highlighted figures.
- Built-in **disclaimer** in every answer: "Starting point only. Guru reads what's in your data — for pricing, supplier or staffing calls, please consult a restaurant industry specialist before acting."
- The four canned answers cover business tips, campaign suggestions, menu ideas and margin diagnostics — the four pitches a restaurateur actually wants AI to help with.

**Mobile** (≤720px viewport — the QR target)
- Order screen stacks menu + check vertically; modifier sheet goes full-screen
- KDS becomes single-column with bigger bump / rush tap targets
- Reports sidebar collapses behind a Lucide-style three-line button → slide-in drawer with all 36 reports grouped, backdrop blur, Esc / tap-outside / ✕ to close, auto-close after pick

**Landscape** (orientation:landscape and max-height ≤ 520px)
- Topbar slimmed down, Order side-by-side preserved, KDS reflows at 240px minimum
- Reports sidebar collapses to 200px; modifier sheet caps at 96vh with a 3-column options grid; Pay modal lays out all 6 tender methods inline

## Brand & design

- **Logo:** new "POS terminal with lightning bolt emerging from the screen" mark. Defined once as `<symbol id="brand-spark-pos">` + two `<linearGradient>` defs inside the Lucide sprite, then referenced via `<svg class="brand-logo"><use href="#brand-spark-pos"/></svg>` from every consumer (sm 24 / default 32 / lg 96). `try.html` inlines the same artwork.
- **Palette:** dark-first, single orange accent (`#FF9500 → #FF6B00`).
- **Typography:** **Sora** display + body + **JetBrains Mono** for labels and numerals.
- **Icons:** Lucide SVG sprite (ISC, bundled — no CDN).
- **Buttons:** the reports header bar (date range pills, Export, ☰ drawer toggle) shares one consistent pill spec — 34px height (40px for the toggle), 10px radius, Sora 12.5/600, surface-2 default, hover lifts to surface-3 with brighter border, active scales to .97.

Production frontend (separate repo `WinYourPos/PDA-front`, Angular 21 + Tailwind v4) is aligned to the same tokens and icon system so what a partner sees here is what their restaurant clients will see in the real app.

## Verify edits

`spark-system.html` ships with a Node test harness that syntax-checks the embedded JS and renders every report against a DOM stub:

```bash
node scripts/test.js
# expect: "JS parses OK", "Reports OK 36/36", "payAndClose OK …"
```

## Files

```
remote-demo/
├── CLAUDE.md                 # project context for AI assistants
├── README.md                 # this file
├── try.html                  # branded welcome splash (QR landing target)
├── spark-pos.html            # landing / partner pitch page
├── spark-system.html         # Order + KDS + Reports interactive demo
├── index.html                # redirects → spark-pos.html
├── docs/RESEARCH_SUMMARY.md  # strategy & competitive research (the "why")
└── scripts/test.js           # syntax + render harness for spark-system.html
```

## Ground rules

- Never name a specific individual in the demos — use roles only ("partners", "your clients", "resellers").
- Keep both HTML files **single-file and dependency-free** (Google Fonts only — Lucide is inlined as an SVG sprite).
- No fabricated logos / testimonials / hard pricing. Competitor figures are labelled industry-reported; the ROI calculator is clearly illustrative.

## Continuing with Claude Code

Full project context for an AI assistant lives in **`CLAUDE.md`** (read automatically by Claude Code). To iterate further:

```bash
curl -fsSL https://claude.ai/install.sh | bash   # macOS / Linux / WSL
cd demo-repository
claude
```

See https://code.claude.com/docs/en/setup for other install paths.
