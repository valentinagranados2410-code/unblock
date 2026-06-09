// sections1.jsx — nav, hero, logo bar, video, bottleneck, how it works
const { useState: useS1, useEffect: useE1, useRef: useR1 } = React;

/* ---- scroll reveal hook ---- */
function useReveal() {
  useE1(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function Nav({ openLOI }) {
  const [scrolled, setScrolled] = useS1(false);
  useE1(() => {
    const on = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", on); on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-in">
        <a href="#top" className="brand">
          <span className="brand-mark">◆</span>
          <span className="brand-name">Unblock<span className="brand-sub"> Energy</span></span>
        </a>
        <div className="nav-links">
          <a href="#problem">The bottleneck</a>
          <a href="#how">How it works</a>
          <a href="#dashboard">Live ops</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="nav-cta">
          <span className="chip nav-chip"><span className="nav-chip-dot" />12 pilot slots</span>
          <button className="btn btn-primary" onClick={openLOI}>Reserve a slot <span className="btn-arrow">→</span></button>
        </div>
      </div>
    </nav>
  );
}

function HeroStats() {
  const items = [
    { v: "$1.65", l: "per GPU-hour", c: "var(--accent)" },
    { v: "~45%", l: "below hyperscalers", c: "var(--ink)" },
    { v: "97%+", l: "CO₂ reduction", c: "var(--green)" },
    { v: "<90d", l: "to first compute", c: "var(--ink)" },
  ];
  return (
    <div className="hero-stats">
      {items.map((s) => (
        <div key={s.l} className="hero-stat">
          <span className="hero-stat-v mono" style={{ color: s.c }}>{s.v}</span>
          <span className="hero-stat-l">{s.l}</span>
        </div>
      ))}
    </div>
  );
}

const HERO_EYEBROW = "Flare-gas powered AI compute";
const HERO_H1 = "Stranded gas. Online GPUs. Right at the wellhead.";
const HERO_SUB = "Unblock deploys modular, mobile edge data centers to oil fields — converting wasted flare gas into clean, low-cost electricity that powers GPU compute on-site. Immediate capacity, zero upfront capital, verified emissions cuts.";

function Hero({ openLOI, layout, DashEl }) {
  if (layout === "statement") {
    return (
      <header className="hero hero-statement" id="top">
        <div className="wrap">
          <span className="eyebrow reveal in">{HERO_EYEBROW}</span>
          <h1 className="hero-statement-h reveal in">Stranded gas.<br /><span className="ink-accent">Online GPUs.</span><br />Right at the wellhead.</h1>
          <p className="lead reveal in" style={{ maxWidth: 620, margin: "8px auto 0" }}>{HERO_SUB}</p>
          <div className="hero-actions reveal in" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary btn-lg" onClick={openLOI}>Reserve a pilot slot <span className="btn-arrow">→</span></button>
            <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
          </div>
          <HeroStats />
          <div className="reveal in" style={{ marginTop: 56, maxWidth: 980, marginInline: "auto" }}>{DashEl}</div>
        </div>
      </header>
    );
  }
  if (layout === "centered") {
    return (
      <header className="hero hero-centered" id="top">
        <div className="wrap">
          <span className="eyebrow reveal in">{HERO_EYEBROW}</span>
          <h1 className="h-display reveal in" style={{ maxWidth: 900, margin: "16px auto 0" }}>{HERO_H1}</h1>
          <p className="lead reveal in" style={{ maxWidth: 600, margin: "20px auto 0" }}>{HERO_SUB}</p>
          <div className="hero-actions reveal in" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary btn-lg" onClick={openLOI}>Reserve a pilot slot <span className="btn-arrow">→</span></button>
            <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
          </div>
          <HeroStats />
          <div className="reveal in" style={{ marginTop: 48, maxWidth: 1000, marginInline: "auto" }}>{DashEl}</div>
        </div>
      </header>
    );
  }
  // split (default)
  return (
    <header className="hero hero-split" id="top">
      <div className="wrap hero-split-grid">
        <div className="hero-copy">
          <span className="eyebrow reveal in">{HERO_EYEBROW}</span>
          <h1 className="h-display reveal in" style={{ marginTop: 16 }}>{HERO_H1}</h1>
          <p className="lead reveal in" style={{ maxWidth: 520, marginTop: 20 }}>{HERO_SUB}</p>
          <div className="hero-actions reveal in">
            <button className="btn btn-primary btn-lg" onClick={openLOI}>Reserve a pilot slot <span className="btn-arrow">→</span></button>
            <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
          </div>
          <HeroStats />
        </div>
        <div className="hero-vis reveal in">{DashEl}</div>
      </div>
    </header>
  );
}

function LogoBar() {
  const names = ["PERMIAN COMPUTE", "FLAREWORKS", "BASIN ENERGY", "MERIDIAN AI", "NORTHWIND CLOUD"];
  return (
    <div className="logobar reveal">
      <div className="wrap">
        <p className="logobar-lbl mono">PILOT OPERATORS & DESIGN PARTNERS</p>
        <div className="logobar-row">
          {names.map((n) => <span key={n} className="logobar-logo mono">{n}</span>)}
        </div>
      </div>
    </div>
  );
}

function VideoSection() {
  const [play, setPlay] = useS1(false);
  const vidRef = useR1(null);
  const start = () => {
    setPlay(true);
    requestAnimationFrame(() => { if (vidRef.current) vidRef.current.play(); });
  };
  return (
    <section className="section video-sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="video-frame reveal">
          <div className="video-stage">
            <video
              ref={vidRef}
              className="video-el"
              src="media/explainer.mp4"
              controls={play}
              playsInline
              preload="metadata"
            ></video>
            {!play && (
              <button className="video-cover" onClick={start} aria-label="Play 90-second explainer">
                <span className="video-play"><span>▶</span></span>
                <span className="video-cap mono">90-SEC EXPLAINER · FLARE → POWER → COMPUTE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const BOTTLENECKS = [
  { tag: "COST", h: "Compute is priced like a scarce commodity", b: "Hyperscaler on-demand GPUs run $3.00–$4.00 per hour, and volatile grid electricity makes every training run a budgeting gamble.", stat: "$3–4", statl: "/ GPU-hr market rate" },
  { tag: "CAPACITY", h: "Waitlists measured in quarters, not days", b: "New data centers take years to permit and build. Demand for accelerated compute is outrunning every grid interconnect queue in the country.", stat: "2–4 yrs", statl: "to bring a site online" },
  { tag: "WASTE", h: "Billions of cubic feet of gas, burned for nothing", b: "Oil fields flare enormous volumes of natural gas daily — energy vented straight into the atmosphere as CO₂, with zero economic return.", stat: "140B m³", statl: "gas flared globally / yr" },
];

function Bottleneck() {
  return (
    <section className="section" id="problem">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">The bottleneck</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Two enormous problems,<br />sitting right next to each other.</h2>
          <p className="lead" style={{ maxWidth: 560, marginTop: 16 }}>AI is starved for power and compute. Oil fields are throwing away the exact energy that could supply it. Unblock closes the gap.</p>
        </div>
        <div className="bottleneck-grid">
          {BOTTLENECKS.map((c, i) => (
            <div key={c.tag} className="card bottleneck-card reveal" style={{ transitionDelay: i * 80 + "ms" }}>
              <span className="bottleneck-tag mono">{c.tag}</span>
              <h3 className="bottleneck-h">{c.h}</h3>
              <p className="bottleneck-b">{c.b}</p>
              <div className="bottleneck-stat">
                <span className="bottleneck-stat-v mono">{c.stat}</span>
                <span className="bottleneck-stat-l">{c.statl}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS_HOW = [
  { n: "01", t: "Capture", h: "Tap the flare", b: "We connect modular gensets to flare stacks at the wellhead, capturing gas that would otherwise be burned off and vented.", chip: "97%+ methane destruction", img: "media/capture-flare.jpeg" },
  { n: "02", t: "Convert", h: "Power on-site", b: "On-site generation turns that gas into clean, behind-the-meter electricity — no grid interconnect, no transmission losses, no queue.", chip: "Behind-the-meter · 0 grid draw", img: "media/convert-power.jpeg" },
  { n: "03", t: "Compute", h: "GPUs online", b: "Containerized, liquid-cooled GPU clusters spin up next to the power source. Capacity goes live in weeks, not years.", chip: "H100-class · live in <90 days", img: "media/compute-gpus.jpeg" },
];

function HowItWorks() {
  return (
    <section className="section how-sec" id="how">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">How it works</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>Wasted gas to working GPUs,<br />in three moves.</h2>
        </div>
        <div className="how-grid">
          {STEPS_HOW.map((s, i) => (
            <div key={s.n} className="how-step reveal" style={{ transitionDelay: i * 90 + "ms" }}>
              <div className="how-step-top">
                <span className="how-n mono">{s.n}</span>
                {i < 2 && <span className="how-arrow mono">→</span>}
              </div>
              {s.img ? (
                <div className="how-ph how-img"><img src={s.img} alt={s.h} loading="lazy" /></div>
              ) : (
                <div className="ph how-ph"><span>{s.t.toUpperCase()} · PHOTO</span></div>
              )}
              <span className="how-kicker mono">{s.t}</span>
              <h3 className="how-h">{s.h}</h3>
              <p className="how-b">{s.b}</p>
              <span className="chip how-chip">{s.chip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { useReveal, Nav, Hero, LogoBar, VideoSection, Bottleneck, HowItWorks });
