import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from '../components/layout/BottomBar'
import Mascot from "../components/shared/Mascot";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api/cheatsheet";

function LoadingStages() {
  const [stage, setStage] = useState(0);
  const stages = [
    "Analyzing your situation...",
    "Checking official requirements...",
    "Building your personalized plan...",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 3000);
    const t2 = setTimeout(() => setStage(2), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{stages[stage]}</p>
      <div className="flex gap-1.5">
        {stages.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= stage ? "var(--accent" : "var(--bg-accent)" }} />
        ))}
      </div>
    </div>
  );
}

export default function CheatsheetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sections, setSections] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [expandedDetails, setExpandedDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  const [detailsContent, setDetailsContent] = useState({});

  useEffect(() => {
    if (Object.keys(session).length === 0) {
      setError("No session data. Please complete the decision tree first.");
      setLoading(false);
      return;
    }
    generateCheatsheet();
  }, []);

  async function generateCheatsheet() {
    try {

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.cheatsheet === "No response from AI." || !data.cheatsheet ||
        data.cheatsheet.includes("quota") ||
        data.cheatsheet.includes("429") ||
        data.cheatsheet.trim() === "") {
        setError("Our AI is taking a break — the free API quota has been used up. Please try again in a few hours. (Yes, the developer is broke.)");
      } else {
        console.log("Raw cheatsheet:", data.cheatsheet);
        setSections(parseCheatsheet(data.cheatsheet));
      }
    } catch (err) {
      setError("Could not generate cheatsheet. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const res = await fetch("https://clearpath-backend-sc9k.onrender.com/api/kits/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId),
        title: "Ontario Driver's License",
        serviceType: "drivers_license",
        content: sections ? JSON.stringify(sections) : ""
      }),
    });

    const data = await res.json();

    if (data.kitID) {
      setShowSaveModal(false);
      alert("Saved! Your Report ID is #CP" + data.kitId);
    }
  }

  async function fetchDetail(key, title) {
    setDetailsLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`https://clearpath-backend-sc9k.onrender.com/api/drivers-license/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          userMessage: `Explain in detail: ${title}. Keep it under 80 words. Plain language. No filler.`
        }),
      });
      const data = await res.json();
      setDetailsContent(prev => ({ ...prev, [key]: data.message || "No details available." }));
    } catch (err) {
      setDetailsContent(prev => ({ ...prev, [key]: "Could not load details." }));
    } finally {
      setDetailsLoading(prev => ({ ...prev, [key]: false }));
    }
  }

  // Parse markdown into 4 sections
  function parseCheatsheet(text) {
    const result = { steps: "", documents: "", cost: "", tips: "" };
    const parts = text.split("**");

    for (let i = 0; i < parts.length; i++) {
      const label = parts[i].toLowerCase().trim();
      if (label === "your steps:") result.steps = parts[i + 1] || "";
      if (label === "document checklist:") result.documents = parts[i + 1] || "";
      if (label === "cost:") result.cost = parts[i + 1] || "";
      if (label === "tips:") result.tips = parts[i + 1] || "";
    }
    return result;
  }

  // Render lines as clean list
  function renderLines(text) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.includes("---"))
      .map((line, i) => {
        // Table rows
        if (line.startsWith("|")) {
          const cells = line.split("|").filter((c) => c.trim());
          if (cells.length === 2 && cells[0].trim() !== "Document") {
            const hasDetails = cells[1].includes("[Details]");
            const requirement = cells[1].replace("[Details]", "").trim();
            const docName = cells[0].trim();
            const key = `detail-${i}`;
            const isOpen = expandedDetails[key];

            return (
              <div key={i}>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--border-light)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{docName}</span>
                  <span className="text-xs text-right" style={{ color: "var(--text-secondary)", maxWidth: "55%" }}>{requirement}</span>
                </div>
                {hasDetails && (
                  <button
                    onClick={() => {
                      setExpandedDetails(prev => ({ ...prev, [key]: !prev[key] }));
                      if (!detailsContent[key] && !detailsLoading[key]) {
                        fetchDetail(key, docName);
                      }
                    }}
                    className="text-xs font-medium mt-1 mb-2"
                    style={{ color: "var(--accent)" }}>
                    {isOpen ? "Hide details" : "Show details"}
                  </button>
                )}
                {isOpen && (
                  <div className="text-xs rounded-lg px-3 py-2 mb-2" style={{ backgroundColor: "var(--bg-accent-light)", color: "var(--text-secondary)" }}>
                    {detailsLoading[key] ? "Loading..." : (detailsContent[key] || "Loading...")}
                  </div>
                )}
              </div>
            );
          }
          return null;
        }
        // Numbered steps
        if (/^\d+\./.test(line)) {
          return (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ backgroundColor: "var(--accent)" }}>
                {line.match(/^(\d+)/)[1]}
              </div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>{line.replace(/^\d+\.\s*/, "")}</p>
            </div>
          );
        }
        // Sub-items (lines starting with -)
        if (line.startsWith("-")) {
          const hasDetails = line.includes("[Details]");
          const cleanLine = line.replace("[Details]", "").replace(/^-\s*/, "").trim();
          const key = `detail-${i}`;
          const isOpen = expandedDetails[key];

          return (
            <div key={i}>
              <p className="text-sm pl-9 py-0.5" style={{ color: "var(--text-secondary)" }}>
                - {cleanLine}
              </p>
              {hasDetails && (
                <button
                  onClick={() => {
                    setExpandedDetails(prev => ({ ...prev, [key]: !prev[key] }));
                    if (!detailsContent[key] && !detailsLoading[key]) {
                      fetchDetail(key, cleanLine);
                    }
                  }}
                  className="text-xs font-medium ml-9 mt-1 mb-2"
                  style={{ color: "var(--accent)" }}>
                  {isOpen ? "Hide details" : "Show details"}
                </button>
              )}
              {isOpen && (
                <div className="text-xs rounded-lg px-3 py-2 ml-9 mb-2" style={{ backgroundColor: "var(--bg-accent-light）", color: "var(--text-secondary)" }}>
                  {detailsLoading[key] ? "Loading..." : (detailsContent[key] || "Loading...")}
                </div>
              )}
            </div>
          );
        }
        // Regular text
        return <p key={i} className="text-sm py-0.5" style={{ color: "var(--text-primary)" }}>{line}</p>;
      });
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <main className="flex-1 px-4 py-5 flex flex-col pb-32">
        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <Mascot emotion="happy" size={40} />
          <div className="rounded-xl px-4 py-2.5 text-sm leading-relaxed"
            style={{ backgroundColor: "var(--bg-accent)", color: "var(--text-primary)" }}>
            <p>Here is your personalized cheatsheet!</p>
          </div>
        </div>

        {/* Loading */}
        {loading && <LoadingStages />}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
            <button onClick={() => navigate("/decision-tree")}
              className="ml-2 underline font-medium hover:text-red-900">
              Back to questions
            </button>
          </div>
        )}

        {/* Cheatsheet Content */}
        {sections && (
          <div className="space-y-4">

            {/* Profile Summary */}
            <div className="rounded-xl border-2 p-4 mb-1" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-accent-light)" }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: "var(--accent)" }}>Your Profile</h3>
              <div className="space-y-1 text-sm" style={{ color: "var(--text-primary)" }}>
                {session.P1Q1 && session.P1Q1 !== "age18plus" && (
                  <p>Age: {session.P1Q1 === "age16to17" ? "16-17" : "Under 16"}</p>
                )}
                {session.P1Q2 && (
                  <p>Status: {{
                    "international_student": "International Student",
                    "work_permit": "Work Permit Holder",
                    "visitor": "Visitor",
                    "permanent_resident": "Permanent Resident",
                    "protected_person_refugee": "Protected Person / Refugee"
                  }[session.P1Q2] || session.P1Q2}</p>
                )}
                {session["P1Q3.1"] && (
                  <p>From: {new Intl.DisplayNames(['en'], { type: 'region' }).of(session["P1Q3.1"])}</p>
                )}
                {session.P1Q3 === "Yes" && (
                  <p>Foreign license: Yes</p>
                )}
              </div>
            </div>

            {/* Documents */}
            {sections.documents && (
              <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--accent)" }}>Document Checklist</h3>
                {renderLines(sections.documents)}
              </div>
            )}

            {/* Tips */}
            {sections.tips && (
              <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--tip-border)", backgroundColor: "var(--bg-tip)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--tip-text)" }}>Tips from Experience</h3>
                {renderLines(sections.tips)}
              </div>
            )}

            {/* Cost */}
            {sections.cost && (
              <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--accent)" }}>Cost</h3>
                {renderLines(sections.cost)}
              </div>
            )}

            {/* Steps */}
            {sections.steps && (
              <div className="rounded-xl border-2 p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--accent)" }}>Your Steps</h3>
                {renderLines(sections.steps)}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={() => setShowSaveModal(true)}
                className="w-full py-3 rounded-xl text-white text-sm font-medium"
                style={{ backgroundColor: "var(--accent-dark)" }}>
                Save to My Repo
              </button>
              <div className="flex gap-3">
                <button onClick={() => navigate("/decision-tree")}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border-2"
                  style={{ borderColor: "var(--accent)", color: "#var(--accent)" }}>
                  Start Over
                </button>
                <button onClick={() => navigate("/")}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                  style={{ backgroundColor: "#var(--accent)" }}>
                  Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showSaveModal && !localStorage.getItem('token') && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
          display: "flex",
          alignItems: "flex-end",
          padding: "24px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
              Save your Cheatsheet
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>
              Save your Cheatsheet and access it anytime from your Repo. Takes 30 seconds.
            </p>
            <button
              onClick={() => navigate('/auth')}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--accent-dark)",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "8px"
              }}>
              Sign up / Log in →
            </button>
            <button
              onClick={() => setShowSaveModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px"
              }}>
              No thanks, I'll screenshot
            </button>
          </div>
        </div>
      )}

      {showSaveModal && localStorage.getItem('token') && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 999,
          display: "flex",
          alignItems: "flex-end",
          padding: "24px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
          }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
              Save your Cheatsheet
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Cheatsheet will be saved to your ClearPath account. Access it anytime.
            </p>
            <button
              onClick={handleSave}
              style={{
                width: "100%",
                padding: "12px",
                background: "var(--accent-dark)",
                color: "#fff",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "8px"
              }}>
              Save it →
            </button>
            <button
              onClick={() => setShowSaveModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px"
              }}>
              No thanks, I'll screenshot
            </button>
          </div>
        </div>
      )}
      <BottomBar />
    </div>
  );
}