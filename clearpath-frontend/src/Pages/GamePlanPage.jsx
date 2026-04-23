import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from "../components/layout/BottomBar";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api";

export default function GamePlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    if (Object.keys(session).length === 0) {
      setError("No session data found. Please complete the decision tree first.");
      setLoading(false);
      return;
    }
    fetchGamePlan();
  }, []);

  async function fetchGamePlan() {
    try {
      const res = await fetch(`${API_BASE}/game-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError("No game plan found for your situation.");
      } else {
        setSteps(data);
      }
    } catch (err) {
      setError("Could not load your game plan. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function parseLinks(linksStr) {
    if (!linksStr) return [];
    try {
      return typeof linksStr === "string" ? JSON.parse(linksStr) : linksStr;
    } catch {
      return [];
    }
  }

  if (loading) return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#5B9D93", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Building your Game Plan...</p>
        </div>
      </div>
      <BottomBar />
    </div>
  );

  if (error) return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />
      <div className="flex-1 flex items-center justify-center px-6">
        <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
      <BottomBar />
    </div>
  );

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <main className="flex-1 px-4 pt-20 pb-32 flex flex-col gap-4">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Your Game Plan</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Step-by-step — follow it in order.
          </p>
        </div>

        {/* Steps */}
        {steps.map((step, i) => {
          const isExpanded = expandedStep === step.step;
          const links = parseLinks(step.links);

          return (
            <div key={step.id} style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              border: "1px solid var(--border-light)",
              overflow: "hidden"
            }}>
              {/* Step header */}
              <button
                onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                className="w-full text-left"
                style={{ padding: "14px 16px" }}>
                <div className="flex items-start gap-3">
                  {/* Step number */}
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: "var(--accent-dark)",
                    color: "#fff", fontSize: "13px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {step.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {step.description}
                    </p>
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "14px", flexShrink: 0 }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{
                  padding: "0 16px 16px 16px",
                  borderTop: "1px solid var(--border-light)"
                }}>
                  {/* Detail text */}
                  <div style={{ paddingTop: "12px" }}>
                    {step.detail?.split("\n").map((para, j) => (
                      para.trim() ? (
                        <p key={j} className="text-sm" style={{
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                          marginBottom: "8px"
                        }}>
                          {para.trim()}
                        </p>
                      ) : null
                    ))}
                  </div>

                  {/* Links */}
                  {links.length > 0 && (
                    <div style={{
                      marginTop: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}>
                      {links.map((link, j) => (
                        <a
                          key={j}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            backgroundColor: "var(--bg-accent-light)",
                            borderRadius: "10px",
                            textDecoration: "none",
                          }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--accent-dark)" }}>
                            {link.label}
                          </span>
                          <span style={{ fontSize: "14px", color: "var(--accent-dark)" }}>→</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom actions */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => navigate("/cheatsheet", { state: { session } })}
            className="w-full py-3 rounded-xl text-sm font-medium border-2"
            style={{ borderColor: "var(--accent)", color: "var(--accent)", backgroundColor: "transparent" }}>
            ← Back to Cheatsheet
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl text-sm"
            style={{ color: "var(--text-muted)" }}>
            Home
          </button>
        </div>

      </main>

      <BottomBar />
    </div>
  );
}
