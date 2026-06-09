// dashboard.jsx — interactive Live Operations Dashboard
// Hover sites to highlight; click a metric to make it the focal readout.
const { useState, useEffect, useRef } = React;

const SITES = [
  { id: "PB-04", name: "Permian Basin · TX",   gpus: 1280, util: 0.94, mw: 4.2, status: "online" },
  { id: "BK-11", name: "Bakken · ND",          gpus: 768,  util: 0.88, mw: 2.6, status: "online" },
  { id: "EF-02", name: "Eagle Ford · TX",      gpus: 512,  util: 0.91, mw: 1.8, status: "online" },
  { id: "DJ-07", name: "DJ Basin · CO",        gpus: 384,  util: 0.62, mw: 1.3, status: "spinning" },
];

const METRICS = [
  { key: "cost",  label: "Cost saved",     unit: "$",  suffix: "",     base: 412_880, rate: 0.9,  color: "var(--accent)", fmt: (n) => "$" + Math.round(n).toLocaleString() },
  { key: "co2",   label: "CO₂ avoided",    unit: "t",  suffix: " t",   base: 18_640,  rate: 0.05, color: "var(--green)",  fmt: (n) => Math.round(n).toLocaleString() + " t" },
  { key: "gpuh",  label: "GPU-hours served", unit: "", suffix: "",     base: 3_204_500, rate: 7,  color: "var(--ink)",    fmt: (n) => Math.round(n).toLocaleString() },
  { key: "power", label: "Power online",   unit: "MW", suffix: " MW",  base: 9.9,     rate: 0,    color: "var(--accent)", fmt: (n) => n.toFixed(1) + " MW" },
];

function Sparkline({ color, seed = 1 }) {
  const pts = useRef(Array.from({ length: 28 }, (_, i) => {
    const base = 30 + Math.sin((i + seed) * 0.55) * 9 + Math.sin((i + seed) * 0.17) * 6;
    return Math.max(8, Math.min(52, base + (Math.random() * 6 - 3)));
  })).current;
  const d = pts.map((y, i) => `${(i / (pts.length - 1)) * 100},${60 - y}`).join(" ");
  return (
    <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ width: "100%", height: 64, display: "block" }}>
      <defs>
        <linearGradient id={"sg" + seed} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,60 ${d} 100,60`} fill={`url(#sg${seed})`} />
      <polyline points={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function LiveDashboard({ variant = "cards" }) {
  const [active, setActive] = useState("cost");
  const [hover, setHover] = useState(null);
  const [vals, setVals] = useState(() => Object.fromEntries(METRICS.map((m) => [m.key, m.base])));
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setVals((v) => {
        const next = { ...v };
        for (const m of METRICS) next[m.key] = v[m.key] + m.rate * (0.6 + Math.random() * 0.8);
        return next;
      });
    }, 1000);
    const c = setInterval(() => setClock(new Date()), 1000);
    return () => { clearInterval(t); clearInterval(c); };
  }, []);

  const m = METRICS.find((x) => x.key === active);
  const totalGpus = SITES.reduce((a, s) => a + s.gpus, 0);

  return (
    <div className="dash" data-variant={variant}>
      {/* header */}
      <div className="dash-head">
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span className="dash-logo">◆</span>
          <span style={{ fontWeight: 700, letterSpacing: "-0.01em", fontSize: 15 }}>Unblock Live Operations</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono dash-clock">{clock.toLocaleTimeString("en-US", { hour12: false })} UTC</span>
          <span className="dash-live"><span className="pulse" />LIVE</span>
        </div>
      </div>

      {/* metric selector */}
      <div className="dash-tabs">
        {METRICS.map((x) => (
          <button key={x.key} className={"dash-tab" + (x.key === active ? " on" : "")} onClick={() => setActive(x.key)}>
            <span className="mono dash-tab-lbl">{x.label}</span>
            <span className="dash-tab-val mono" style={{ color: x.key === active ? x.color : "var(--ink-2)" }}>{x.fmt(vals[x.key])}</span>
          </button>
        ))}
      </div>

      {/* focal readout */}
      <div className="dash-focal">
        <div>
          <div className="mono dash-focal-lbl">{m.label} · last 90 days</div>
          <div className="dash-focal-num mono" style={{ color: m.color }}>{m.fmt(vals[m.key])}</div>
          <div className="mono dash-focal-sub">
            {active === "cost" && "vs. hyperscaler on-demand pricing"}
            {active === "co2" && "97.4% reduction vs. continued flaring"}
            {active === "gpuh" && "across " + totalGpus.toLocaleString() + " deployed GPUs"}
            {active === "power" && "behind-the-meter, zero grid draw"}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, alignSelf: "flex-end" }}>
          <Sparkline color={m.color} seed={active.length + 2} />
        </div>
      </div>

      {/* sites */}
      <div className="dash-sites-hd mono">
        <span>FLEET · {SITES.length} SITES</span>
        <span>{totalGpus.toLocaleString()} GPUs · {SITES.reduce((a, s) => a + s.mw, 0).toFixed(1)} MW</span>
      </div>
      <div className="dash-sites">
        {SITES.map((s) => (
          <div
            key={s.id}
            className={"dash-site" + (hover === s.id ? " hover" : "") + (s.status === "spinning" ? " spinning" : "")}
            onMouseEnter={() => setHover(s.id)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="dash-site-top">
              <span className="mono dash-site-id">{s.id}</span>
              <span className={"dash-dot " + s.status} />
            </div>
            <div className="dash-site-name">{s.name}</div>
            <div className="dash-site-bar"><span style={{ width: (s.util * 100) + "%" }} /></div>
            <div className="dash-site-meta mono">
              <span>{s.gpus} GPU</span>
              <span>{Math.round(s.util * 100)}%</span>
              <span>{s.mw} MW</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.LiveDashboard = LiveDashboard;
