// loiflow.jsx — multi-step Pilot reservation: application → LOI preview → deposit → confirmed
const { useState: useStateL, useEffect: useEffectL } = React;

const STEPS = ["Application", "Letter of Intent", "Refundable deposit", "Confirmed"];

function Field({ label, children, hint }) {
  return (
    <label className="fld">
      <span className="fld-lbl">{label}</span>
      {children}
      {hint && <span className="fld-hint mono">{hint}</span>}
    </label>
  );
}

function LOIFlow({ open, onClose }) {
  const [step, setStep] = useStateL(0);
  const [form, setForm] = useStateL({
    company: "", name: "", role: "Head of Infrastructure", email: "",
    gpus: "512", start: "Q3 2026", region: "US — Permian", agree: false,
    card: "", exp: "", cvc: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffectL(() => {
    if (open) { setStep(0); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffectL(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const estMonthly = (parseInt(form.gpus || 0, 10) * 1.65 * 24 * 30);
  const estSaved = (parseInt(form.gpus || 0, 10) * (3.5 - 1.65) * 24 * 30);

  const valid0 = form.company && form.name && /\S+@\S+\.\S+/.test(form.email);
  const valid2 = form.card.replace(/\s/g, "").length >= 12 && form.exp && form.cvc.length >= 3;

  return (
    <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>

        {/* progress */}
        <div className="loi-prog">
          {STEPS.map((s, i) => (
            <div key={s} className={"loi-prog-step" + (i === step ? " on" : "") + (i < step ? " done" : "")}>
              <span className="loi-prog-dot mono">{i < step ? "✓" : i + 1}</span>
              <span className="loi-prog-lbl">{s}</span>
            </div>
          ))}
        </div>

        <div className="loi-body">
          {/* STEP 0 — application */}
          {step === 0 && (
            <div className="loi-pane">
              <span className="eyebrow">Pilot application · 60-day program</span>
              <h2 className="h-section" style={{ fontSize: 30, margin: "12px 0 6px" }}>Reserve a pilot slot</h2>
              <p className="lead" style={{ fontSize: 16, marginBottom: 22 }}>Tell us about your workload. We size a deployment and prepare your Letter of Intent — no commitment yet.</p>
              <div className="fld-grid">
                <Field label="Company"><input className="inp" value={form.company} onChange={set("company")} placeholder="Acme AI" /></Field>
                <Field label="Your name"><input className="inp" value={form.name} onChange={set("name")} placeholder="Jordan Reyes" /></Field>
                <Field label="Role">
                  <select className="inp" value={form.role} onChange={set("role")}>
                    <option>Head of Infrastructure</option><option>DevOps Lead</option>
                    <option>Capacity Manager</option><option>CTO / VP Eng</option><option>Other</option>
                  </select>
                </Field>
                <Field label="Work email"><input className="inp" value={form.email} onChange={set("email")} placeholder="jordan@acme.ai" /></Field>
                <Field label="GPUs needed" hint="H100-class">
                  <select className="inp" value={form.gpus} onChange={set("gpus")}>
                    <option value="256">256</option><option value="512">512</option>
                    <option value="1024">1,024</option><option value="2048">2,048+</option>
                  </select>
                </Field>
                <Field label="Target start">
                  <select className="inp" value={form.start} onChange={set("start")}>
                    <option>Q3 2026</option><option>Q4 2026</option><option>Q1 2027</option>
                  </select>
                </Field>
              </div>
              <div className="loi-est">
                <div><span className="mono loi-est-lbl">EST. RATE</span><span className="mono loi-est-val">$1.65<small>/GPU-hr</small></span></div>
                <div><span className="mono loi-est-lbl">EST. MONTHLY</span><span className="mono loi-est-val">${Math.round(estMonthly).toLocaleString()}</span></div>
                <div><span className="mono loi-est-lbl">EST. SAVED / MO</span><span className="mono loi-est-val" style={{ color: "var(--green)" }}>${Math.round(estSaved).toLocaleString()}</span></div>
              </div>
            </div>
          )}

          {/* STEP 1 — LOI preview */}
          {step === 1 && (
            <div className="loi-pane">
              <span className="eyebrow">One-page Letter of Intent · non-binding</span>
              <h2 className="h-section" style={{ fontSize: 30, margin: "12px 0 16px" }}>Review your Letter of Intent</h2>
              <div className="loi-doc">
                <div className="loi-doc-hd mono">
                  <span>◆ UNBLOCK ENERGY — LETTER OF INTENT</span><span>DRAFT</span>
                </div>
                <p>This non-binding Letter of Intent records the interest of <b>{form.company || "[Company]"}</b> ("Participant"), represented by <b>{form.name || "[Name]"}</b>, in joining the Unblock Energy 60-day Pilot Program.</p>
                <ol>
                  <li>Unblock will provision approximately <b>{parseInt(form.gpus, 10).toLocaleString()} GPUs</b> of flare-gas-powered compute, targeting availability in <b>{form.start}</b>.</li>
                  <li>Introductory rate of <b>$1.65 / GPU-hour</b>, held for the pilot term.</li>
                  <li>This LOI is <b>non-binding</b> and creates no obligation to purchase. Either party may withdraw in writing at any time.</li>
                  <li>A <b>fully refundable $5,000 deposit</b> reserves the slot and is credited in full against the first compute invoice — or returned on request.</li>
                </ol>
                <div className="loi-doc-sign">
                  <div><span className="mono">PARTICIPANT</span><div className="loi-sign-line">{form.name || "\u00A0"}</div></div>
                  <div><span className="mono">DATE</span><div className="loi-sign-line">{new Date().toLocaleDateString()}</div></div>
                </div>
              </div>
              <label className="loi-agree">
                <input type="checkbox" checked={form.agree} onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))} />
                <span>I have read the Letter of Intent and understand it is non-binding and the deposit is fully refundable.</span>
              </label>
            </div>
          )}

          {/* STEP 2 — deposit */}
          {step === 2 && (
            <div className="loi-pane">
              <span className="eyebrow">Refundable deposit · secures your slot</span>
              <h2 className="h-section" style={{ fontSize: 30, margin: "12px 0 6px" }}>$5,000 fully refundable deposit</h2>
              <p className="lead" style={{ fontSize: 16, marginBottom: 22 }}>Credited against your first invoice, or returned in full on request. This is a credible-commitment hold — not a purchase.</p>
              <div className="fld-grid">
                <Field label="Card number" hint="test mode — no real charge">
                  <input className="inp" value={form.card} onChange={set("card")} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                </Field>
                <div className="fld-grid two">
                  <Field label="Expiry"><input className="inp" value={form.exp} onChange={set("exp")} placeholder="09 / 27" /></Field>
                  <Field label="CVC"><input className="inp" value={form.cvc} onChange={set("cvc")} placeholder="123" inputMode="numeric" /></Field>
                </div>
              </div>
              <div className="loi-secure mono">
                <span>🔒 256-bit encrypted · refundable anytime before deployment</span>
              </div>
            </div>
          )}

          {/* STEP 3 — confirmed */}
          {step === 3 && (
            <div className="loi-pane loi-done">
              <div className="loi-check">✓</div>
              <h2 className="h-section" style={{ fontSize: 32, margin: "18px 0 8px" }}>Pilot slot reserved</h2>
              <p className="lead" style={{ fontSize: 17, maxWidth: 460 }}>Thank you, {form.name || "there"}. We've emailed your signed LOI and deposit receipt to <b>{form.email || "your inbox"}</b>. Our infrastructure team will reach out within 48 hours to schedule your deployment.</p>
              <div className="loi-done-meta mono">
                <span>SLOT&nbsp;#{String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")} / 12</span>
                <span>{parseInt(form.gpus, 10).toLocaleString()} GPUs</span>
                <span>{form.start}</span>
              </div>
            </div>
          )}
        </div>

        {/* footer nav */}
        {step < 3 && (
          <div className="loi-foot">
            <button className="btn btn-ghost" onClick={() => (step === 0 ? onClose() : setStep(step - 1))}>
              {step === 0 ? "Cancel" : "Back"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="mono loi-foot-note">Step {step + 1} of 3</span>
              <button
                className="btn btn-primary"
                disabled={(step === 0 && !valid0) || (step === 1 && !form.agree) || (step === 2 && !valid2)}
                onClick={() => setStep(step + 1)}
              >
                {step === 0 && "Continue to LOI"}
                {step === 1 && "Sign & continue"}
                {step === 2 && "Pay $5,000 deposit"}
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="loi-foot" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary btn-lg" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

window.LOIFlow = LOIFlow;
