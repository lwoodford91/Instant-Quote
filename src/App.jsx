import React, { useState } from "react";

const PACKAGES = {
  "Sing Karaoke": 129,
  "Spotlight Karaoke": 179,
  "Superstar Karaoke": 225,
  "Movie Night": 179,
};

const ADDONS = {
  "Two Wireless Mics": 30,
  "Four Wireless Mics": 60,
  "TV Rental": 30,
  "Wired Mic 30' Cable": 5,
  "Wired Mic 50' Cable": 7,
};

const DELIVERY_TIERS = [
  { max: 10, fee: 25 },
  { max: 20, fee: 40 },
  { max: 30, fee: 55 },
  { max: 40, fee: 70 },
  { max: 50, fee: 85 },
  { max: 75, fee: 85 },
  { max: Infinity, fee: 110 },
];

const PACKAGE_ICONS = {
  "Sing Karaoke": "🎤",
  "Spotlight Karaoke": "🌟",
  "Superstar Karaoke": "👑",
  "Movie Night": "🎬",
};

const ADDON_ICONS = {
  "Two Wireless Mics": "🎙️",
  "Four Wireless Mics": "🎙️",
  "TV Rental": "📺",
  "Wired Mic 30' Cable": "🎤",
  "Wired Mic 50' Cable": "🎤",
};

function getDeliveryFee(miles) {
  for (const tier of DELIVERY_TIERS) {
    if (miles <= tier.max) return tier.fee;
  }
  return 110;
}

const STEPS = ["Package", "Add-Ons", "Delivery", "Discount", "Quote"];



function applyDiscount(amount, code) {
  if (code === "50off") return amount * 0.5;
  if (code === "75off") return amount * 0.25;
  return amount;
}

function discountLabel(code) {
  if (code === "50off") return "50% off";
  if (code === "75off") return "75% off";
  return null;
}

export default function PalmwoodApp() {
  const [step, setStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [attendantHours, setAttendantHours] = useState(1);
  const [includeAttendant, setIncludeAttendant] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryMiles, setDeliveryMiles] = useState(null);

  const [discountDelivery, setDiscountDelivery] = useState("none");
  const [discountLabor, setDiscountLabor] = useState("none");
  const [copied, setCopied] = useState(false);

  const basePrice = selectedPackage ? PACKAGES[selectedPackage] : 0;
  const addonTotal = selectedAddons.reduce((sum, a) => sum + ADDONS[a], 0);
  const attendantCost = includeAttendant ? attendantHours * 50 : 0;
  const rawDeliveryFee = (deliveryOption === "delivery") && deliveryMiles != null ? getDeliveryFee(deliveryMiles) : 0;
  const discountedDelivery = applyDiscount(rawDeliveryFee, discountDelivery);
  const discountedAttendant = applyDiscount(attendantCost, discountLabor);
  const subTotal = basePrice + addonTotal + discountedAttendant + discountedDelivery;
  const deposit = Math.round(subTotal * 0.25);
  const remaining = subTotal - deposit;



  function toggleAddon(addon) {
    setSelectedAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  }

  function goNext() { setStep(s => s + 1); }
  function goBack() { setStep(s => s - 1); }

  function buildQuoteText() {
    const addonLines = selectedAddons.length > 0
      ? selectedAddons.map(a => `  • ${a} — $${ADDONS[a]}`).join("\n") : "  • None";
    const attendantLine = includeAttendant
      ? `  • Attendant — $${discountedAttendant.toFixed(2)} (${attendantHours} hrs x $50/hr${discountLabor !== "none" ? ` — ${discountLabel(discountLabor)} applied` : ""})` : "";
    const delivLine = deliveryOption === "delivery-tbd"
      ? `  ⏳ Awaiting delivery address — delivery fee will be added to quote once address is provided`
      : deliveryOption === "delivery"
      ? deliveryMiles != null
        ? `  ${deliveryAddress}\n  ${deliveryMiles} miles — $${discountedDelivery.toFixed(2)}${discountDelivery !== "none" ? ` (${discountLabel(discountDelivery)} applied)` : ""}`
        : `  ⏳ Awaiting delivery address — fee will be added to quote once address is provided`
      : "  No Delivery / Self-Pickup";

    return `🎤 Palmwood Rentals Quote
━━━━━━━━━━━━━━━━━━━━━━━━━
Package: ${selectedPackage}
Base Price: $${basePrice}

Add-Ons:

${addonLines}${attendantLine ? "\n" + attendantLine : ""}
Add-On Total: $${(addonTotal + discountedAttendant).toFixed(2)}

Delivery & Setup:
${delivLine}

━━━━━━━━━━━━━━━━━━━━━━━━━

Total Balance: $${subTotal.toFixed(2)}
Deposit Due Today (25%): $${deposit}
Remaining Due Day of Event: $${remaining.toFixed(2)}
· · · · · · · · · · · · · · ·

If everything looks good and you're ready to book, click the link below!
https://www.palmwoodrentals.com/booking`;
  }

  function copyQuote() {
    navigator.clipboard.writeText(buildQuoteText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const canProceed = [
    !!selectedPackage,
    true,
    deliveryOption !== null && (
      deliveryOption !== "delivery" ||
      (deliveryAddress.length > 5 && deliveryMiles !== null && deliveryMiles > 0)
    ),
    true,
    true,
  ][step];

  const hasDiscountable = (deliveryOption === "delivery" && rawDeliveryFee > 0) || includeAttendant;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0d1020 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#f0ece4",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 640, padding: "max(36px, calc(env(safe-area-inset-top) + 16px)) 24px 0", textAlign: "center" }}>
        <div style={{ fontSize: 13, letterSpacing: "0.3em", color: "#c9a85c", textTransform: "uppercase", marginBottom: 6 }}>
          Palmwood Rentals
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 400, margin: "0 0 4px", letterSpacing: "-0.02em", color: "#f8f4ee" }}>
          Event Quote Builder
        </h1>
        <div style={{ fontSize: 13, color: "#7a7080", marginBottom: 28 }}>
          Build your custom karaoke & event package
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 32, justifyContent: "center" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: i <= step ? 36 : 28, height: 4, borderRadius: 2,
                background: i < step ? "#c9a85c" : i === step ? "#e8c87a" : "#2a2535",
                transition: "all 0.3s ease",
              }} />
              <div style={{
                fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                color: i === step ? "#c9a85c" : i < step ? "#7a6840" : "#3a3345",
                transition: "color 0.3s",
              }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        width: "100%", maxWidth: 600, padding: "0 16px 32px",

      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,168,92,0.15)",
          borderRadius: 20, padding: "28px 24px", backdropFilter: "blur(10px)",
        }}>

          {/* STEP 0: Package */}
          {step === 0 && (
            <div>
              <StepTitle icon="🎤" title="Choose Your Package" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {Object.entries(PACKAGES).map(([name, price]) => (
                  <button key={name} onClick={() => setSelectedPackage(name)} style={{
                    background: selectedPackage === name ? "linear-gradient(135deg, #c9a85c22, #e8c87a18)" : "rgba(255,255,255,0.03)",
                    border: selectedPackage === name ? "1.5px solid #c9a85c" : "1.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 14, padding: "18px 14px", cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s", transform: selectedPackage === name ? "scale(1.02)" : "scale(1)",
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{PACKAGE_ICONS[name]}</div>
                    <div style={{ fontSize: 14, color: "#f0ece4", fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>{name}</div>
                    <div style={{ fontSize: 20, color: "#c9a85c" }}>${price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Add-Ons */}
          {step === 1 && (
            <div>
              <StepTitle icon="✨" title="Select Add-Ons" subtitle="Choose all that apply" />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(ADDONS).map(([name, price]) => (
                  <ToggleRow key={name} icon={ADDON_ICONS[name] || "🎵"} label={name}
                    price={`$${price}`} active={selectedAddons.includes(name)} onClick={() => toggleAddon(name)} />
                ))}
                <ToggleRow icon="👤" label="Attendant" price="$50/hr"
                  active={includeAttendant} onClick={() => setIncludeAttendant(!includeAttendant)} />
                {includeAttendant && (
                  <div style={{
                    background: "rgba(201,168,92,0.06)", border: "1px solid rgba(201,168,92,0.2)",
                    borderRadius: 12, padding: "14px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 14, color: "#c9a85c" }}>Hours needed</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button onClick={() => setAttendantHours(h => Math.max(1, h - 1))} style={hourBtn}>−</button>
                      <span style={{ fontSize: 18, color: "#f0ece4", minWidth: 24, textAlign: "center" }}>{attendantHours}</span>
                      <button onClick={() => setAttendantHours(h => h + 1)} style={hourBtn}>+</button>
                      <span style={{ fontSize: 14, color: "#7a7080" }}>= ${attendantHours * 50}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Delivery */}
          {step === 2 && (
            <div>
              <StepTitle icon="🚚" title="Delivery & Setup" />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {[
                  { val: "delivery", icon: "🚚", label: "Delivery & Setup", desc: "We deliver and set up at your venue" },
                  { val: "delivery-tbd", icon: "📍", label: "Delivery — Address TBD", desc: "Address not yet available, fee added to quote later" },
                  { val: "none", icon: "🏠", label: "No Delivery (Self-Pickup)", desc: "Pick up from our location in Highland, CA" },
                ].map(({ val, icon, label, desc }) => (
                  <button key={val} onClick={() => setDeliveryOption(val)} style={{
                    background: deliveryOption === val ? "linear-gradient(135deg, #c9a85c18, #e8c87a10)" : "rgba(255,255,255,0.03)",
                    border: deliveryOption === val ? "1.5px solid #c9a85c" : "1.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "16px 18px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12, transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 15, color: "#f0ece4" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "#7a7080" }}>{desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {deliveryOption === "delivery" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Delivery Address</label>
                    <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="123 Main St, City, CA 90000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Distance from Highland, CA (miles)</label>
                    <input
                      type="number"
                      min="1"
                      value={deliveryMiles === null ? "" : deliveryMiles}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setDeliveryMiles(isNaN(val) ? null : val);
                      }}
                      placeholder="e.g. 12"
                      style={inputStyle}
                    />
                  </div>
                  {deliveryMiles !== null && deliveryMiles > 0 && (
                    <div style={{
                      background: "rgba(201,168,92,0.06)", border: "1px solid rgba(201,168,92,0.15)",
                      borderRadius: 10, padding: "14px 16px",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ fontSize: 13, color: "#7a7080" }}>Delivery Fee</span>
                      <span style={{ fontSize: 18, color: "#c9a85c", fontWeight: 600 }}>${getDeliveryFee(deliveryMiles)}</span>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "#3a3050", lineHeight: 1.8 }}>
                    Fee tiers: ≤10mi $25 · ≤20mi $40 · ≤30mi $55 · ≤40mi $70 · ≤50–75mi $85 · 86mi+ $110
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Discount */}
          {step === 3 && (
            <div>
              <StepTitle icon="🏷️" title="Apply Discounts" subtitle="Set discounts independently for Delivery and Labor" />

              {!hasDiscountable && (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#4a4055", fontSize: 14 }}>
                  No discountable items.<br />
                  <span style={{ fontSize: 12 }}>Add delivery or an attendant to apply discounts.</span>
                </div>
              )}

              {deliveryOption === "delivery" && rawDeliveryFee > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={sectionLabelStyle}>🚚 Delivery Fee Discount</div>
                  <div style={{ fontSize: 12, color: "#7a7080", marginBottom: 12 }}>
                    Base delivery fee: <span style={{ color: "#c9a85c", fontWeight: 600 }}>${rawDeliveryFee}</span>
                  </div>
                  <DiscountPicker value={discountDelivery} onChange={setDiscountDelivery} original={rawDeliveryFee} />
                </div>
              )}

              {includeAttendant && (
                <div>
                  <div style={sectionLabelStyle}>👤 Attendant / Labor Discount</div>
                  <div style={{ fontSize: 12, color: "#7a7080", marginBottom: 12 }}>
                    Base labor cost: <span style={{ color: "#c9a85c", fontWeight: 600 }}>${attendantCost}</span>
                  </div>
                  <DiscountPicker value={discountLabor} onChange={setDiscountLabor} original={attendantCost} />
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Quote */}
          {step === 4 && (
            <div>
              <StepTitle icon="📋" title="Your Quote" />
              <div style={{
                background: "rgba(0,0,0,0.3)", border: "1px solid rgba(201,168,92,0.2)",
                borderRadius: 14, padding: "20px", marginBottom: 16,
              }}>
                <QuoteLine label="Package" value={selectedPackage} />
                <QuoteLine label="Base Price" value={`$${basePrice}`} gold />
                <Divider />

                <SectionHeader>Add-Ons</SectionHeader>
                {selectedAddons.length === 0 && !includeAttendant
                  ? <div style={{ fontSize: 13, color: "#4a4055", marginBottom: 8 }}>None</div>
                  : null}
                {selectedAddons.map(a => <QuoteLine key={a} label={a} value={`$${ADDONS[a]}`} small />)}
                {includeAttendant && (
                  <QuoteLine
                    label={`Attendant — ${attendantHours} hr${attendantHours > 1 ? "s" : ""}${discountLabor !== "none" ? ` (${discountLabel(discountLabor)})` : ""}`}
                    value={`$${discountedAttendant.toFixed(2)}`} small />
                )}
                <QuoteLine label="Add-On Total" value={`$${(addonTotal + discountedAttendant).toFixed(2)}`} gold />
                <Divider />

                <SectionHeader>Delivery & Setup</SectionHeader>
                {deliveryOption === "none"
                  ? <div style={{ fontSize: 13, color: "#4a4055", marginBottom: 8 }}>No Delivery</div>
                  : (deliveryOption === "delivery-tbd" || deliveryMiles == null)
                  ? <div style={{
                      background: "rgba(201,168,92,0.06)",
                      border: "1px dashed rgba(201,168,92,0.3)",
                      borderRadius: 8, padding: "10px 12px", marginBottom: 8,
                    }}>
                      <div style={{ fontSize: 13, color: "#c9a85c", marginBottom: 2 }}>⏳ Awaiting delivery address</div>
                      <div style={{ fontSize: 11, color: "#7a6840" }}>Delivery fee will be added to quote once address is provided</div>
                    </div>
                  : <>
                    <QuoteLine label={deliveryAddress} value="" small />
                    <QuoteLine
                      label={`${deliveryMiles} miles${discountDelivery !== "none" ? ` (${discountLabel(discountDelivery)})` : ""}`}
                      value={`$${discountedDelivery.toFixed(2)}`} small />
                  </>
                }
                <Divider />

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 16, color: "#f0ece4" }}>Total Balance</span>
                  <span style={{ fontSize: 22, color: "#c9a85c" }}>${subTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#7a7080" }}>Deposit Due Today (25%)</span>
                  <span style={{ fontSize: 15, color: "#e8c87a" }}>${deposit}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#7a7080" }}>Remaining Due Day of Event</span>
                  <span style={{ fontSize: 15, color: "#e8c87a" }}>${remaining.toFixed(2)}</span>
                </div>
              </div>

              {/* Copy to clipboard */}
              <button onClick={copyQuote} style={{
                width: "100%",
                background: copied ? "linear-gradient(135deg, #2a5c2a, #1a4a1a)" : "linear-gradient(135deg, #c9a85c, #e8c87a)",
                border: "none", borderRadius: 12, padding: "15px",
                color: copied ? "#7adf7a" : "#0a0a0f",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                letterSpacing: "0.05em", transition: "all 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginBottom: 10,
              }}>
                {copied ? "✓ Copied to Clipboard!" : "📋 Copy Quote to Clipboard"}
              </button>

              {/* Share buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href={`sms:&body=${encodeURIComponent(buildQuoteText())}`}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "rgba(37,211,102,0.12)", border: "1.5px solid rgba(37,211,102,0.3)",
                    borderRadius: 12, padding: "13px", color: "#25d366",
                    fontSize: 14, fontWeight: 600, textDecoration: "none",
                    letterSpacing: "0.03em", transition: "all 0.2s",
                  }}
                >
                  💬 Send via iMessage
                </a>
                <a
                  href={`fb-messenger://share?link=${encodeURIComponent("https://www.palmwoodrentals.com/booking")}&app_id=966242223397117`}
                  onClick={(e) => {
                    // Copy quote to clipboard first so they can paste it
                    navigator.clipboard.writeText(buildQuoteText());
                  }}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "rgba(0,132,255,0.12)", border: "1.5px solid rgba(0,132,255,0.3)",
                    borderRadius: 12, padding: "13px", color: "#0084ff",
                    fontSize: 14, fontWeight: 600, textDecoration: "none",
                    letterSpacing: "0.03em", transition: "all 0.2s",
                  }}
                >
                  💙 Send via Messenger
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {step > 0 && (
            <button onClick={goBack} style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
              padding: "13px", color: "#7a7080", fontSize: 14, cursor: "pointer",
            }}>← Back</button>
          )}
          {step < STEPS.length - 1 && (
            <button onClick={goNext} disabled={!canProceed} style={{
              flex: 2,
              background: canProceed ? "linear-gradient(135deg, #c9a85c, #e8c87a)" : "rgba(255,255,255,0.06)",
              border: "none", borderRadius: 12, padding: "13px",
              color: canProceed ? "#0a0a0f" : "#3a3345",
              fontSize: 15, fontWeight: 700, cursor: canProceed ? "pointer" : "not-allowed",
              letterSpacing: "0.04em", transition: "all 0.2s",
            }}>Continue →</button>
          )}
        </div>
      </div>
    </div>
  );
}

function DiscountPicker({ value, onChange, original }) {
  const options = [
    { code: "none", label: "No Discount", saving: null },
    { code: "50off", label: "50% Off", saving: `save $${(original * 0.5).toFixed(2)}` },
    { code: "75off", label: "75% Off", saving: `save $${(original * 0.75).toFixed(2)}` },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {options.map(({ code, label, saving }) => (
        <button key={code} onClick={() => onChange(code)} style={{
          flex: 1,
          background: value === code ? "linear-gradient(135deg, #c9a85c22, #e8c87a18)" : "rgba(255,255,255,0.03)",
          border: value === code ? "1.5px solid #c9a85c" : "1.5px solid rgba(255,255,255,0.08)",
          borderRadius: 10, padding: "12px 8px", cursor: "pointer",
          textAlign: "center", transition: "all 0.2s",
        }}>
          <div style={{ fontSize: 13, color: value === code ? "#e8c87a" : "#c0bbb5", marginBottom: saving ? 4 : 0 }}>{label}</div>
          {saving && <div style={{ fontSize: 11, color: value === code ? "#c9a85c" : "#4a4055" }}>{saving}</div>}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ icon, label, price, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? "linear-gradient(135deg, #c9a85c18, #e8c87a10)" : "rgba(255,255,255,0.03)",
      border: active ? "1.5px solid #c9a85c" : "1.5px solid rgba(255,255,255,0.08)",
      borderRadius: 12, padding: "14px 16px", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 14, color: "#f0ece4" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, color: "#c9a85c" }}>{price}</span>
        <div style={{
          width: 20, height: 20, borderRadius: "50%",
          border: active ? "none" : "1.5px solid #3a3345",
          background: active ? "#c9a85c" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, color: "#0a0a0f", fontWeight: 700, transition: "all 0.2s",
        }}>{active ? "✓" : ""}</div>
      </div>
    </button>
  );
}

function StepTitle({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 20, color: "#f0ece4", fontWeight: 400, marginBottom: 2 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13, color: "#7a7080" }}>{subtitle}</div>}
    </div>
  );
}

function QuoteLine({ label, value, gold, small }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: small ? 5 : 8 }}>
      <span style={{ fontSize: small ? 12 : 14, color: small ? "#7a7080" : "#c0bbb5", maxWidth: "65%", lineHeight: 1.4 }}>{label}</span>
      <span style={{ fontSize: small ? 13 : 15, color: gold ? "#c9a85c" : "#f0ece4" }}>{value}</span>
    </div>
  );
}

function SectionHeader({ children }) {
  return <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "#7a6840", textTransform: "uppercase", marginBottom: 8 }}>{children}</div>;
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(201,168,92,0.12)", margin: "12px 0" }} />;
}



const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.05)",
  border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 10,
  padding: "12px 14px", color: "#f0ece4", fontSize: 14,
  outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: 12, color: "#c9a85c", letterSpacing: "0.1em",
  textTransform: "uppercase", display: "block", marginBottom: 6,
};

const sectionLabelStyle = {
  fontSize: 12, color: "#c9a85c", letterSpacing: "0.15em",
  textTransform: "uppercase", marginBottom: 8, fontWeight: 600,
};

const hourBtn = {
  width: 28, height: 28, borderRadius: 6,
  background: "rgba(201,168,92,0.15)", border: "1px solid rgba(201,168,92,0.3)",
  color: "#c9a85c", fontSize: 16, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
};
