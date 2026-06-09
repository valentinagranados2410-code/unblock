// app.jsx — compose the page + Tweaks
const { useState: useApp, useEffect: useAppE } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "heroLayout": "split",
  "pricing": "bars"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [loi, setLoi] = useApp(false);
  const openLOI = () => setLoi(true);

  useReveal();
  useAppE(() => { document.documentElement.setAttribute("data-theme", t.theme); }, [t.theme]);

  const dash = <LiveDashboard />;

  return (
    <div>
      <Nav openLOI={openLOI} />
      <Hero openLOI={openLOI} layout={t.heroLayout} DashEl={t.heroLayout === "split" ? dash : <LiveDashboard />} />
      <LogoBar />
      <VideoSection />
      <Bottleneck />
      <HowItWorks />
      <Impact />
      <DashboardSection DashEl={<LiveDashboard />} />
      <Pricing variant={t.pricing} openLOI={openLOI} />
      <Proof />
      <PilotCTA openLOI={openLOI} />
      <Footer />

      <LOIFlow open={loi} onClose={() => setLoi(false)} />

      <TweaksPanel>
        <TweakSection label="Color theme" />
        <TweakRadio label="Palette" value={t.theme}
          options={["warm", "slate", "ink"]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Hero" />
        <TweakRadio label="Layout" value={t.heroLayout}
          options={["split", "centered", "statement"]}
          onChange={(v) => setTweak("heroLayout", v)} />
        <TweakSection label="Pricing module" />
        <TweakSelect label="Display" value={t.pricing}
          options={[
            { value: "bars", label: "Comparison bars" },
            { value: "table", label: "Spec table" },
            { value: "calculator", label: "Savings calculator" },
          ]}
          onChange={(v) => setTweak("pricing", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
