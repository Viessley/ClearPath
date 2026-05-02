import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from "../components/layout/BottomBar";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api";

// Session key → human-readable label
const SESSION_LABELS = {
  P1Q1: {
    age18plus: null, // default, don't show
    age16to17: "Age: 16–17",
    underAge16: "Age: Under 16",
    notSure: "Age: Not sure",
  },
  P1Q2: {
    international_student: "International Student",
    work_permit: "Work Permit Holder",
    visitor: "Visitor",
    permanent_resident: "Permanent Resident",
    protected_person_refugee: "Protected Person / Refugee",
    canadian_citizen: "Canadian Citizen",
  },
  P1Q2_1IS: {
    validMoreThan6Months: "Study Permit: Valid 6+ months",
    validLessThan6Months: "Study Permit: Valid less than 6 months",
    expired: "Study Permit: Expired",
  },
  P1Q3: {
    Yes: "Has a foreign driver's licence",
    No: "No foreign driver's licence",
  },
};

function buildSituationLines(session) {
  const lines = [];

  // Status
  if (session.P1Q2) {
    const label = SESSION_LABELS.P1Q2[session.P1Q2];
    if (label) lines.push(label);
  }

  // Age (only if not default)
  if (session.P1Q1 && session.P1Q1 !== "age18plus") {
    const label = SESSION_LABELS.P1Q1[session.P1Q1];
    if (label) lines.push(label);
  }

  // Under 16 — when do you turn 16
  if (session["P1Q1.1Under16"]) {
    const ageMap = {
      "soon": "Turning 16: Within 6 months",
      "medium": "Turning 16: In 6 months to 1 year",
      "far": "Turning 16: More than 1 year away",
    };
    const label = ageMap[session["P1Q1.1Under16"]];
    if (label) lines.push(label);
  }

  // Study permit validity
  if (session["P1Q2.1IS"]) {
    const label = SESSION_LABELS.P1Q2_1IS[session["P1Q2.1IS"]];
    if (label) lines.push(label);
  }

  // Foreign licence
  if (session.P1Q3) {
    const label = SESSION_LABELS.P1Q3[session.P1Q3];
    if (label) lines.push(label);
  }

  // Experience
  if (session["P1Q3.2NotAgreement"]) {
    const expMap = {
      "Less1Year": "Driving experience: Less than 1 year",
      "1To2": "Driving experience: 1 to 2 years",
      "MoreThen2": "Driving experience: 2+ years"
    };
    const label = expMap[session["P1Q3.2NotAgreement"]];
    if (label) lines.push(label);
  }

  // Country
  if (session["P1Q3.1"]) {
    try {
      const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(session["P1Q3.1"]);
      lines.push(`Licence from: ${countryName}`);
    } catch (e) {
      lines.push(`Licence from: ${session["P1Q3.1"]}`);
    }
  }

  // Official driving record
  if (session["P1Q3.3NotAgreement"]) {
    const recMap = {
      "Yes": "Has official driving record",
      "No": "No official driving record"
    };
    const label = recMap[session["P1Q3.3NotAgreement"]];
    if (label) lines.push(label);
  }

  return lines;
}

// Section wrapper
function Section({ title, accent, children, icon }) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card)",
      border: `1.5px solid ${accent || "var(--border-color)"}`,
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
        <h3 style={{ fontSize: "13px", fontWeight: "700", color: accent || "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// Loading animation
function LoadingStages() {
  const [stage, setStage] = useState(0);
  const stages = ["Pulling your data...", "Checking official requirements...", "Building your cheatsheet..."];
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 2000);
    const t2 = setTimeout(() => setStage(2), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "48px 24px" }}>
      <div style={{
        width: "36px", height: "36px",
        border: "3px solid var(--border-color)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ fontSize: "13px", fontWeight: "500", color: "var(--accent)" }}>{stages[stage]}</p>
      <div style={{ display: "flex", gap: "6px" }}>
        {stages.map((_, i) => (
          <div key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: i <= stage ? "var(--accent)" : "var(--border-color)",
            transition: "background-color 0.3s"
          }} />
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function CheatsheetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};
  const scopeOutKey = location.state?.scopeOutKey || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [scopeOutReport, setScopeOutReport] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const situationLines = buildSituationLines(session);

  useEffect(() => {
    if (Object.keys(session).length === 0) {
      setError("We lost your answers. This usually happens when you refresh the page — we're working on a fix. For now, go back and answer the questions again. Takes 2 minutes.");
      setLoading(false);
      return;
    }
    const tasks = [fetchCheatsheet()];
    if (scopeOutKey) tasks.push(fetchScopeOutReport(scopeOutKey));
    Promise.all(tasks);
  }, []);

  async function fetchCheatsheet() {
    try {
      const res = await fetch(`${API_BASE}/cheatsheet/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });
      const json = await res.json();

      if (json.error) {
        setError(json.error);
      } else if (json.structured) {
        setData(json.structured);
      } else if (!json.cheatsheet || json.cheatsheet.includes("quota") || json.cheatsheet.includes("429")) {
        setError("Our AI is taking a break — the free API quota has been used up. Please try again in a few hours. (Yes, the developer is broke.)");
      } else {
        setData({ raw: json.cheatsheet });
      }
    } catch (err) {
      setError("Our server decided to take an unauthorized vacation. The developer has been notified and is not having a good time right now. Check back in a few minutes, or email clearpathwesley@gmail.com to make his day worse.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchScopeOutReport(key) {
    try {
      const res = await fetch(`${API_BASE}/scope-out/report?key=${encodeURIComponent(key)}`);
      const json = await res.json();
      setScopeOutReport(json);
    } catch {
      // Silent fail — cheatsheet still renders without scope-out block
    }
  }

  async function handleSave() {
    setSaveLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const res = await fetch(`${API_BASE}/kits/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          title: "Ontario Driver's Licence",
          serviceType: "drivers_license",
          content: data ? JSON.stringify(data) : ""
        }),
      });
      const result = await res.json();
      if (result.kitId) {
        setShowSaveModal(false);
        alert("Saved! Your Report ID is #CP" + result.kitId);
      }
    } catch (e) {
      alert("Save failed. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  }

  // Parse steps array — take first 3, strip description details
  function renderSteps(steps) {
    if (!steps) return null;
    let parsed = steps;
    if (typeof steps === "string") {
      try { parsed = JSON.parse(steps); } catch { return <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6 }}>{steps}</p>; }
    }
    const topSteps = parsed.slice(0, 3);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {topSteps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "50%",
              backgroundColor: "var(--accent)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: "700", flexShrink: 0
            }}>{i + 1}</div>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", margin: 0, paddingTop: "3px" }}>
              {step.title}
            </p>
          </div>
        ))}
      </div>
    );
  }

  // Parse documents
  function renderDocuments(docs) {
    if (!docs) return null;
    let parsed = docs;
    if (typeof docs === "string") {
      try { parsed = JSON.parse(docs); } catch { return <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{docs}</p>; }
    }
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {parsed.map((doc, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "10px 0",
            borderBottom: i < parsed.length - 1 ? "1px solid var(--border-light)" : "none",
            gap: "12px"
          }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", flexShrink: 0, maxWidth: "45%" }}>
              {doc.name}
            </span>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "right" }}>
              {doc.requirement}
              {doc.used_at && <span style={{ display: "block", color: "var(--accent)", marginTop: "2px", fontSize: "11px" }}>Used at: {doc.used_at}</span>}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Parse what_to_prepare
  function renderWhatToPrepare(items) {
    if (!items) return null;
    let parsed = items;
    if (typeof items === "string") {
      try { parsed = JSON.parse(items); } catch { return null; }
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {parsed.map((item, i) => (
          <div key={i} style={{
            backgroundColor: "var(--bg-accent-light)",
            borderRadius: "10px",
            padding: "12px 14px",
          }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)", margin: "0 0 4px 0" }}>
              {item.action}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              {item.why}
            </p>
            {item.action.includes("MTO Driver") && (
              <div style={{ marginTop: "6px" }}>
                <a href="https://www.ontario.ca/document/official-mto-drivers-handbook"
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "var(--accent-dark)", fontWeight: "600", textDecoration: "none" }}>
                  Open Handbook →
                </a>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Tip: Print → Save as PDF to save offline
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Parse cheatsheet_tips
  function renderTips(tips, session) {
    if (!tips) return null;
    let parsed = tips;
    if (typeof tips === "string") {
      try { parsed = JSON.parse(tips); } catch { return null; }
    }
    const isPermitShortly = session?.["P1Q2.1IS"] === "validLessThan6Months";
    const visible = parsed.filter(t => {
      if (!isPermitShortly && t.tip.includes("Study Permit expiry")) return false;
      if (t.tip.startsWith("TODO")) return false;
      return true;
    });

    const colors = [
      { bg: "var(--bg-accent)", border: "var(--accent)" },
      { bg: "var(--bg-accent-light)", border: "var(--accent-dark)" },
    ]

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {visible.map((item, i) => {
          const color = colors[i % colors.length]
          return (
            <div key={i} style={{
              backgroundColor: color.bg,
              borderLeft: `4px solid ${color.border}`,
              borderRadius: "8px",
              padding: "10px 14px",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0, lineHeight: 1.6 }}>
                {item.tip}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

  // Parse fees
  function renderFees(fees) {
    if (!fees) return null;

    let parsed = fees;
    if (typeof fees === "string") {
      try {
        parsed = JSON.parse(fees);
      } catch {
        return <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6, margin: 0 }}>{fees}</p>;
      }
    }

    if (!Array.isArray(parsed)) return null;

    const total = parsed.reduce((sum, f) => {
      const num = parseFloat(f.amount.replace("$", ""));
      return isNaN(num) ? sum : sum + num;
    }, 0);

    return (
      <div>
        {parsed.map((f, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            padding: "10px 0",
            borderBottom: "1px solid var(--border-light)",
            gap: "12px"
          }}>
            <div>
              <span style={{ fontSize: "13px", color: "var(--text-primary)", fontWeight: "500" }}>{f.item}</span>
              {f.note && <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>{f.note}</p>}
              {f.when && <p style={{ fontSize: "11px", color: "var(--accent)", margin: "2px 0 0 0" }}>{f.when}</p>}
            </div>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent-dark)", flexShrink: 0 }}>{f.amount}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0 0", marginTop: "4px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Total</span>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--accent-dark)" }}>${total.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  // Parse sources
  function renderSources(sources) {
    if (!sources) return null;
    let parsed = sources;
    if (typeof sources === "string") {
      try { parsed = JSON.parse(sources); } catch { return null; }
    }

    const official = parsed.filter(s => s.category === "official");
    const reference = parsed.filter(s => s.category === "reference");

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {official.length > 0 && (
          <div>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px 0" }}>Official Sources</p>
            {official.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "var(--bg-accent-light)", borderRadius: "10px", textDecoration: "none", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "var(--accent-dark)", fontWeight: "500", lineHeight: 1.4 }}>{src.title}</span>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        )}
        {reference.length > 0 && (
          <div>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px 0" }}>Additional References</p>
            {reference.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "10px", textDecoration: "none", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500", lineHeight: 1.4 }}>{src.title}</span>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)", fontFamily: "system-ui, sans-serif" }}>
      <TopBar />

      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "72px 16px 100px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 4px 0" }}>
            Your Cheatsheet
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
            Ontario Driver's Licence — personalized for your situation
          </p>
        </div>

        {loading && <LoadingStages />}

        {error && (
          <div style={{
            padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: "12px", marginBottom: "16px"
          }}>
            <p style={{ fontSize: "13px", color: "#dc2626", margin: "0 0 8px 0" }}>{error}</p>
            <button onClick={() => navigate("/decision-tree")}
              style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              ← Back to questions
            </button>
          </div>
        )}

        {/* SCOPE OUT BLOCKER — shown when user hits an eligibility wall */}
        {scopeOutReport && (
          <div style={{
            backgroundColor: "#fef2f2",
            border: "2px solid #fca5a5",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <span style={{ fontSize: "16px" }}>⚠️</span>
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#dc2626", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>
                One thing to sort out first
              </h3>
            </div>

            <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0 0 10px 0" }}>
              {scopeOutReport.situation}
            </p>

            {scopeOutReport.whyBlocked && (
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>Why you can't apply right now</p>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{scopeOutReport.whyBlocked}</p>
              </div>
            )}

            {scopeOutReport.consequences && (
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>What this affects</p>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{scopeOutReport.consequences}</p>
              </div>
            )}

            {scopeOutReport.nextStep && (
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>Your most important next step</p>
                <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, margin: 0 }}>{scopeOutReport.nextStep}</p>
              </div>
            )}

            {scopeOutReport.resourceLinks && (() => {
              try {
                const links = typeof scopeOutReport.resourceLinks === "string"
                  ? JSON.parse(scopeOutReport.resourceLinks)
                  : scopeOutReport.resourceLinks;
                return links?.length > 0 ? (
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {links.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#fff", border: "1px solid #fca5a5", borderRadius: "10px", textDecoration: "none", gap: "8px" }}>
                        <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "600" }}>{link.label}</span>
                        <span style={{ fontSize: "14px" }}>→</span>
                      </a>
                    ))}
                  </div>
                ) : null;
              } catch { return null; }
            })()}

            {scopeOutReport.afterResolved && (
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "14px 0 0 0", fontStyle: "italic", lineHeight: 1.5 }}>
                {scopeOutReport.afterResolved}
              </p>
            )}
          </div>
        )}

        {/* YOUR SITUATION */}
        <Section title="Here's what I learned from you" accent="var(--accent)">
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
            {situationLines.map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{line}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Look right?</span>
            <button onClick={() => navigate("/decision-tree")}
              style={{ fontSize: "13px", color: "var(--accent-dark)", fontWeight: "600", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>
              Something off? Start over
            </button>
          </div>
        </Section>

        {/* Render cheatsheet content once loaded */}
        {!loading && !error && (
          <>
            {/* OVERVIEW */}
            {data?.overview && (
              <Section title="Your Journey at a Glance" accent="var(--accent)">
                <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-line" }}>
                  {data.overview}
                </p>
              </Section>
            )}

            {/* YOUR STEPS */}
            {data?.steps && (
              <Section title="Your Steps" accent="var(--accent)">
                {renderSteps(data.steps)}
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "12px 0 0 0" }}>
                  Full step-by-step instructions → Game Plan
                </p>
              </Section>
            )}

            {/* WHAT TO PREPARE NOW */}
            {data?.what_to_prepare && (
              <Section title="What to Prepare Now" accent="#059669">
                {renderWhatToPrepare(data.what_to_prepare)}
              </Section>
            )}

            {/* DOCUMENTS */}
            {data?.documents && (
              <Section title="Document Checklist" accent="var(--accent)">
                {renderDocuments(data.documents)}
              </Section>
            )}

            {/* COST */}
            {data?.fees && (
              <Section title="Cost" accent="var(--accent)">
                {renderFees(data.fees)}
              </Section>
            )}

            {/* KEY DECISIONS */}
            {data?.cheatsheet_tips && (
              <Section title="Key Decisions" accent="var(--tip-border)">
                {renderTips(data.cheatsheet_tips, session)}
              </Section>
            )}

            {/* SOURCES */}
            {data?.sources && (
              <Section title="Sources" accent="var(--border-color)">
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 10px 0" }}>
                  Official Ontario government sources. Read them yourself.
                </p>
                {renderSources(data.sources)}
              </Section>
            )}

            {/* Fallback: raw text if no structured data */}
            {data?.raw && (
              <Section title="Your Cheatsheet" accent="var(--accent)">
                <p style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.7, whiteSpace: "pre-line", margin: 0 }}>
                  {data.raw}
                </p>
              </Section>
            )}

            {/* ACTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
              <button
                onClick={() => navigate("/game-plan", { state: { session, cheatsheet: data } })}
                style={{
                  width: "100%", padding: "15px",
                  backgroundColor: "var(--accent-dark)", color: "#fff",
                  borderRadius: "14px", fontWeight: "700", fontSize: "15px",
                  border: "none", cursor: "pointer", letterSpacing: "0.01em"
                }}>
                Continue to Game Plan →
              </button>

              <button onClick={() => setShowSaveModal(true)}
                style={{
                  width: "100%", padding: "13px",
                  backgroundColor: "transparent",
                  border: "2px solid var(--accent)",
                  color: "var(--accent-dark)",
                  borderRadius: "14px", fontWeight: "600", fontSize: "14px",
                  cursor: "pointer"
                }}>
                Save to My Repo
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/decision-tree")}
                  style={{
                    flex: 1, padding: "11px",
                    backgroundColor: "transparent",
                    border: "1.5px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    borderRadius: "12px", fontSize: "13px", cursor: "pointer"
                  }}>
                  Start Over
                </button>
                <button onClick={() => navigate("/")}
                  style={{
                    flex: 1, padding: "11px",
                    backgroundColor: "var(--bg-accent)",
                    border: "none",
                    color: "var(--accent-dark)",
                    borderRadius: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer"
                  }}>
                  Home
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <BottomBar />

      {/* Save Modal — not logged in */}
      {showSaveModal && !localStorage.getItem("token") && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "flex-end", padding: "24px" }}>
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", padding: "28px", width: "100%" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px 0" }}>Save your Cheatsheet</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              Create a free account to save this and access it anytime from your Repo.
            </p>
            <button onClick={() => navigate("/auth")}
              style={{ width: "100%", padding: "14px", background: "var(--accent-dark)", color: "#fff", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: "pointer", marginBottom: "8px" }}>
              Sign up / Log in →
            </button>
            <button onClick={() => setShowSaveModal(false)}
              style={{ width: "100%", padding: "12px", background: "transparent", color: "var(--text-muted)", fontSize: "13px", border: "none", cursor: "pointer" }}>
              No thanks, I'll screenshot
            </button>
          </div>
        </div>
      )}

      {/* Save Modal — logged in */}
      {showSaveModal && localStorage.getItem("token") && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "flex-end", padding: "24px" }}>
          <div style={{ background: "var(--bg-card)", borderRadius: "20px", padding: "28px", width: "100%" }}>
            <h2 style={{ fontSize: "17px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 8px 0" }}>Save your Cheatsheet</h2>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              This cheatsheet will be saved to your Repo. Access it anytime.
            </p>
            <button onClick={handleSave} disabled={saveLoading}
              style={{ width: "100%", padding: "14px", background: saveLoading ? "var(--border-color)" : "var(--accent-dark)", color: "#fff", borderRadius: "12px", fontWeight: "700", fontSize: "14px", border: "none", cursor: saveLoading ? "not-allowed" : "pointer", marginBottom: "8px" }}>
              {saveLoading ? "Saving..." : "Save it →"}
            </button>
            <button onClick={() => setShowSaveModal(false)}
              style={{ width: "100%", padding: "12px", background: "transparent", color: "var(--text-muted)", fontSize: "13px", border: "none", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}