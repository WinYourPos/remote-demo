# Spark POS — Demo

> 🚀 **Live demo:** **<https://winyourpos.github.io/remote-demo/spark-pos.html>**
> Open the **Test-drive the POS ↗** button or the **Try it yourself 📱** QR (scan from any phone — mobile-optimised UI).

Two standalone, zero-build HTML demos for pitching **Spark POS** — a white-label
restaurant point-of-sale platform — to a US reseller partner.

| File | What it is | Live |
|------|------------|------|
| **`spark-pos.html`** | Partner-facing landing/marketing page. Hero → live white-label brand-swap → **13 device-surface mockups** → 13 AI services → partner-activation pipeline → ROI/residual calculator → competitor comparison → partner economics → "production-ready" tech block → FAQ → CTA. | [open ↗](https://winyourpos.github.io/remote-demo/spark-pos.html) |
| **`spark-system.html`** | Interactive product demo. **Order + Kitchen (KDS) + Reports**, wired together: ring an item with modifiers → fire to the kitchen → close the check → reporting updates live. Mobile-optimised — works on phone via the in-hero QR scan. | [open ↗](https://winyourpos.github.io/remote-demo/spark-system.html) |

## Open the demos

Just visit the live URL above, no install needed.

Or run locally — double-click either file, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/spark-pos.html
```

> The **Try it yourself 📱** button always points at the live Pages URL above, so partners scanning from any device land on the public deployment regardless of how the presenter opened the page.

The hero on `spark-pos.html` has a single CTA — **Test-drive the POS ↗** — that opens `spark-system.html` in a new tab.

## What's in the interactive demo

**Order screen** — full-service catalog with realistic upcharges
- 16 categories: Brunch · Burgers · Sandwiches · Mains · Pasta · Pizza · Tacos & Bowls · Seafood · Starters · Sides · Kids · Bar · Wine · Beer · Non-Alcoholic · Dessert
- 72 menu items
- Modifier groups with required min/max, temperature, remove kinds and priced add-ons (e.g. truffle fries `+$3`, lobster on tagliatelle `+$14`, big-rock-ice prep on the Old Fashioned, dry/wet/extra-dry on the Martini, size + crust on pizzas)
- Guest count, table number, dine-in / takeout / delivery / bar — all live; split check, void, manager actions

**Kitchen (KDS)** — what the line sees
- Station filter (Grill · Sauté · Cold · Bar · Pastry) with a live ticket count per station
- Color-coded age timer (green < 6 min · yellow 6–10 · red > 10), bump · recall · rush
- Modifiers colored on the card: green for add, red for remove, accent for temperature
- All-Day view: total of every item working across active tickets

**Reports** — 36 reports across 10 sidebar groups
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

## Design

Dark-first iOS-style interface, single orange accent (`#FF9500 → #FF6B00`).
Typography: **Sora** (display + body) + **JetBrains Mono** (labels, numerals).
Icons: inline Lucide SVG sprite (ISC, bundled — no CDN).

Production frontend (separate repo `WinYourPos/PDA-front`, Angular 21 + Tailwind v4) is aligned to the same tokens so what a partner sees here is what their restaurant clients will see in the real app.

## Verify edits

`spark-system.html` ships with a Node test harness that syntax-checks the embedded JS and renders every report against a DOM stub:

```bash
node scripts/test.js
# expect: "JS parses OK", "Reports OK 36/36", "payAndClose OK …"
```

## Files

```
demo-repository/
├── CLAUDE.md                 # project context for AI assistants
├── README.md                 # this file
├── spark-pos.html            # landing / partner pitch page
├── spark-system.html         # Order + KDS + Reports interactive demo
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
