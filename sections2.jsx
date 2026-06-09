// sections2.jsx — impact, dashboard section, pricing (3 variants), proof, pilot CTA, footer
const { useState: useS2 } = React;

function Impact() {
  return (
    <section className="section impact-sec">
      <div className="wrap">
        <div className="sec-head reveal" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Value & impact</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Cheaper compute that also<br />cuts carbon. Not a trade-off.</h2>
        </div>
        <div className="impact-grid">
          <div className="impact-big reveal">
            <span className="impact-big-v mono">~45%</span>
            <span className="impact-big-l">lower cost per GPU-hour</span>
            <p className="impact-big-b">$1.65/hr against a $3.00–$4.00 hyperscaler market rate — because the fuel is otherwise-wasted gas and there's no grid markup.</p>
          </div>
          <div className="impact-big green reveal" style={{ transitionDelay: "90ms" }}>
            <span className="impact-big-v mono">97%+</span>
            <span className="impact-big-l">CO₂-equivalent emissions avoided</span>
            <p className="impact-big-b">Combustion for power destroys methane far more completely than flaring — independently measured and verified per deployment.</p>
          </div>
        </div>
        <div className="impact-eqs reveal">
          {[
            ["18,640 t", "CO₂e avoided to date"],
            ["≈ 4,050", "cars off the road for a year"],
            ["0", "new grid capacity required"],
            ["100%", "of deposits credited or refunded"],
          ].map(([v, l]) => (
            <div key={l} className="impact-eq">
              <span className="impact-eq-v mono">{v}</span>
              <span className="impact-eq-l">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection({ DashEl }) {
  return (
    <section className="section dash-sec" id="dashboard">
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 620 }}>
          <span className="eyebrow">Live operations</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Every watt and tonne,<br />accounted for in real time.</h2>
          <p className="lead" style={{ marginTop: 16 }}>Pilot customers get a live operations view: fleet status, realized cost savings, GPU-hours served, and verified CO₂ avoided — updating by the second. Toggle a metric or hover a site.</p>
        </div>
        <div className="reveal" style={{ marginTop: 36 }}>{DashEl}</div>
      </div>
    </section>
  );
}

/* ---------- PRICING (3 variants) ---------- */
function PriceBars() {
  const rows = [
    { name: "Hyperscaler on-demand", v: 3.5, pct: 100, muted: true, tag: "$3.00–4.00" },
    { name: "Reserved / committed", v: 2.4, pct: 69, muted: true, tag: "~$2.40" },
    { name: "Unblock pilot rate", v: 1.65, pct: 47, muted: false, tag: "$1.65" },
  ];
  return (
    <div className="price-bars">
      {rows.map((r) => (
        <div key={r.name} className={"price-bar-row" + (r.muted ? " muted" : "")}>
          <span className="price-bar-name">{r.name}</span>
          <div className="price-bar-track">
            <span className="price-bar-fill" style={{ width: r.pct + "%" }} />
          </div>
          <span className="price-bar-tag mono">{r.tag}</span>
        </div>
      ))}
      <p className="price-foot mono">PER GPU-HOUR · H100-CLASS · INTRODUCTORY PILOT PRICING</p>
    </div>
  );
}

function PriceCalc() {
  const [gpus, setGpus] = useS2(512);
  const hours = 24 * 30;
  const unblock = gpus * 1.65 * hours;
  const market = gpus * 3.5 * hours;
  const saved = market - unblock;
  return (
    <div className="price-calc">
      <div className="price-calc-head">
        <span className="fld-lbl">Fleet size</span>
        <span className="mono price-calc-gpus">{gpus.toLocaleString()} GPUs</span>
      </div>
      <input className="price-range" type="range" min="64" max="2048" step="64" value={gpus} onChange={(e) => setGpus(+e.target.value)} />
      <div className="price-calc-grid">
        <div><span className="mono loi-est-lbl">UNBLOCK / MO</span><span className="mono price-calc-v" style={{ color: "var(--accent)" }}>${Math.round(unblock).toLocaleString()}</span></div>
        <div><span className="mono loi-est-lbl">HYPERSCALER / MO</span><span className="mono price-calc-v" style={{ color: "var(--ink-3)", textDecoration: "line-through" }}>${Math.round(market).toLocaleString()}</span></div>
        <div><span className="mono loi-est-lbl">YOU SAVE / MO</span><span className="mono price-calc-v" style={{ color: "var(--green)" }}>${Math.round(saved).toLocaleString()}</span></div>
      </div>
      <p className="price-foot mono">ESTIMATE · 24×7 UTILIZATION · $1.65 vs $3.50 BLENDED</p>
    </div>
  );
}

function PriceTable() {
  const rows = [
    ["Rate / GPU-hour", "$1.65", "$3.00–4.00"],
    ["Upfront capital", "$0", "Reserved commits"],
    ["Time to first compute", "<90 days", "Quarters–years"],
    ["Grid interconnect", "Not required", "Required"],
    ["Verified CO₂ reduction", "97%+", "Grid-dependent"],
  ];
  return (
    <div className="price-table">
      <div className="price-table-row price-table-hd">
        <span></span><span className="price-table-us mono">UNBLOCK</span><span className="mono">HYPERSCALER</span>
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="price-table-row">
          <span className="price-table-k">{r[0]}</span>
          <span className="price-table-us mono">{r[1]}</span>
          <span className="price-table-them mono">{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function Pricing({ variant, openLOI }) {
  return (
    <section className="section pricing-sec" id="pricing">
      <div className="wrap">
        <div className="pricing-grid">
          <div className="pricing-copy reveal">
            <span className="eyebrow">Pricing</span>
            <h2 className="h-section" style={{ marginTop: 14 }}>$1.65 per GPU-hour.<br />Held for your pilot.</h2>
            <p className="lead" style={{ marginTop: 16, maxWidth: 440 }}>No reserved-capacity lock-in, no upfront capital, no grid markup. The introductory rate is fixed for the 60-day pilot term.</p>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 26 }} onClick={openLOI}>Lock in $1.65/hr <span className="btn-arrow">→</span></button>
          </div>
          <div className="card pricing-card reveal" style={{ transitionDelay: "80ms" }}>
            {variant === "calculator" && <PriceCalc />}
            {variant === "table" && <PriceTable />}
            {(!variant || variant === "bars") && <PriceBars />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PROOF ---------- */
const QUOTES = [
  { q: "We went from a six-month GPU waitlist to live capacity in under three months. The unit economics are simply not available anywhere else.", n: "Maya Sorensen · Head of Infrastructure", c: "Cortexa AI" },
  { q: "The behind-the-meter model removed our biggest constraint — grid interconnect. And the carbon story writes itself with our investors.", n: "Daniel Okafor · VP Engineering", c: "Lumora Labs" },
  { q: "A refundable deposit to reserve real capacity at this price was a no-brainer. Finance signed off in a day.", n: "Priya Nair · Capacity Manager", c: "Helix Cloud" },
];
const BADGES = [
  ["97.4%", "Methane destruction · third-party verified"],
  ["SOC 2", "Type II controls in progress"],
  ["ISO 14064", "GHG accounting aligned"],
  ["EPA", "Flare-capture methodology"],
];

function Proof() {
  return (
    <section className="section proof-sec">
      <div className="wrap">
        <div className="sec-head reveal" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>Validation</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Built with the buyers<br />who feel the squeeze.</h2>
        </div>
        <div className="quotes-grid">
          {QUOTES.map((x, i) => (
            <figure key={i} className="card quote-card reveal" style={{ transitionDelay: i * 80 + "ms" }}>
              <span className="quote-mark">"</span>
              <blockquote className="quote-q">{x.q}</blockquote>
              <figcaption className="quote-cap">
                <span className="quote-n">{x.n}</span>
                <span className="quote-c mono">{x.c}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="badges reveal">
          {BADGES.map(([v, l]) => (
            <div key={v} className="badge">
              <span className="badge-v mono">{v}</span>
              <span className="badge-l">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- PILOT CTA ---------- */
function PilotCTA({ openLOI }) {
  const incs = [
    "Modular deployment sized to your workload",
    "$1.65/GPU-hour locked for the pilot term",
    "Live operations & verified-carbon dashboard",
    "Fully refundable $5,000 deposit — credited to invoice 1",
  ];
  return (
    <section className="section cta-sec" id="pilot">
      <div className="wrap">
        <div className="cta-card reveal">
          <div className="cta-glow" />
          <div className="cta-inner">
            <span className="chip cta-chip"><span className="nav-chip-dot" />12 PILOT SLOTS · 60-DAY PROGRAM</span>
            <h2 className="cta-h">Reserve compute at the<br />wellhead before it's gone.</h2>
            <p className="cta-sub">Sign a one-page, non-binding Letter of Intent and place a fully refundable $5,000 deposit to hold one of twelve pilot slots. The deposit is credited in full against your first compute invoice.</p>
            <ul className="cta-list">
              {incs.map((i) => <li key={i}><span className="cta-tick">✓</span>{i}</li>)}
            </ul>
            <div className="cta-actions">
              <button className="btn btn-primary btn-lg" onClick={openLOI}>Reserve my pilot slot <span className="btn-arrow">→</span></button>
              <span className="cta-fine mono">Non-binding · refundable anytime before deployment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div>
          <a href="#top" className="brand"><span className="brand-mark">◆</span><span className="brand-name">Unblock<span className="brand-sub"> Energy</span></span></a>
          <p className="footer-tag mono">FLARE GAS → CLEAN POWER → AI COMPUTE</p>
        </div>
        <p className="footer-fine mono">Pre-seed validation experiment · ESCP Business School · {new Date().getFullYear()} · Figures are illustrative pilot targets.</p>
      </div>
    </footer>
  );
}

Object.assign(window, { Impact, DashboardSection, Pricing, Proof, PilotCTA, Footer });
