import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from "../components/layout/BottomBar";
import Mascot from "../components/shared/Mascot";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api";

function buildSessionSummary(session) {
  const lines = [];

  const STATUS_MAP = {
    international_student: "International Student",
    work_permit: "Work Permit Holder",
    visitor: "Visitor",
    permanent_resident: "Permanent Resident",
    protected_person_refugee: "Protected Person / Refugee",
    canadian_citizen: "Canadian Citizen",
  };

  const PERMIT_MAP = {
    validMoreThan6Months: "Study Permit: Valid 6+ months",
    validLessThan6Months: "Study Permit: Expiring soon (< 6 months)",
    expired: "Study Permit: Expired",
  };

  const EXPERIENCE_MAP = {
    Less1Year: "Driving experience: Under 1 year",
    "1To2": "Driving experience: 1–2 years",
    MoreThen2: "Driving experience: 2+ years",
  };

  if (session.P1Q1 && session.P1Q1 !== "age18plus") {
    if (session.P1Q1 === "age16to17") lines.push("Age: 16–17");
    else if (session.P1Q1 === "underAge16") lines.push("Age: Under 16");
  }

  if (session.P1Q2 && STATUS_MAP[session.P1Q2]) lines.push(STATUS_MAP[session.P1Q2]);
  if (session["P1Q2.1IS"] && PERMIT_MAP[session["P1Q2.1IS"]]) lines.push(PERMIT_MAP[session["P1Q2.1IS"]]);

  if (session.P1Q3 === "Yes") lines.push("Has a foreign driver's licence");
  else if (session.P1Q3 === "No") lines.push("No foreign driver's licence");

  if (session["P1Q3.1"]) {
    try {
      const countryName = new Intl.DisplayNames(["en"], { type: "region" }).of(session["P1Q3.1"]);
      lines.push(`Licence from: ${countryName}`);
    } catch {
      lines.push(`Licence from: ${session["P1Q3.1"]}`);
    }
  }

  if (session["P1Q3.2NotAgreement"] && EXPERIENCE_MAP[session["P1Q3.2NotAgreement"]]) {
    lines.push(EXPERIENCE_MAP[session["P1Q3.2NotAgreement"]]);
  }

  if (session["P1Q3.3NotAgreement"] === "Yes") lines.push("Has official driving record");
  else if (session["P1Q3.3NotAgreement"] === "No") lines.push("No official driving record");

  return lines;
}

export default function AIChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};
  const stuckAt = location.state?.stuckAt || null;

  const [messages, setMessages] = useState([]);
  const [chips, setChips] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openerLoading, setOpenerLoading] = useState(true);
  const [systemHint, setSystemHint] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    initChat();
  }, []);

  function buildInitialMessages(openerText) {
    const summary = buildSessionSummary(session);
    const msgs = [];
    if (summary.length > 0) msgs.push({ role: "system", text: summary.join("\n") });
    msgs.push({ role: "ai", text: openerText });
    return msgs;
  }

  async function initChat() {
    setOpenerLoading(true);
    try {
      if (stuckAt) {
        const res = await fetch(`${API_BASE}/ai-support/opener?questionId=${encodeURIComponent(stuckAt)}`);
        const data = await res.json();

        if (data.found && data.opener) {
          setMessages(buildInitialMessages(data.opener));
          if (data.chips) {
            try {
              const parsed = typeof data.chips === "string" ? JSON.parse(data.chips) : data.chips;
              if (data.systemHint) setSystemHint(data.systemHint);
              setChips(Array.isArray(parsed) ? parsed : []);
            } catch { setChips([]); }
          }
        } else {
          await generateAIOpener();
        }
      } else {
        setMessages(buildInitialMessages("Tell me what you need help with."));
      }
    } catch {
      await generateAIOpener();
    } finally {
      setOpenerLoading(false);
    }
  }

  async function generateAIOpener() {
    try {
      const res = await fetch(`${API_BASE}/drivers-license/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session,
          userMessage: "I selected not sure. Help me figure out what I need to know.",
          stuckAt,
        }),
      });
      const data = await res.json();
      const rawText = data.message || "What part are you unsure about?";
      const displayText = rawText.replace(/\[DECISION:.*?\]/s, "").replace("[SCOPE_OUT]", "").trim();
      setMessages(buildInitialMessages(displayText));
    } catch {
      setMessages(buildInitialMessages("What part are you unsure about?"));
    }
  }

  async function sendMessage(messageText) {
    const userMessage = messageText || input.trim();
    if (!userMessage || loading) return;

    setInput("");
    setChips([]);
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/drivers-license/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, userMessage, stuckAt, systemHint }),
      });
      const data = await res.json();

      const rawText = data.message ||
        "This is not your fault. It's all on the developer. You can send a strongly-worded email to clearpathwesley@gmail.com — once he sees it, he will fix it ASAP. So sorry.";

      const decisionMatch = rawText.match(/\[DECISION:\s*({.*?})\]/s);
      const scopeOut = rawText.includes("[SCOPE_OUT]");

      const displayText = rawText
        .replace(/\[DECISION:.*?\]/s, "")
        .replace("[SCOPE_OUT]", "")
        .trim();

      setMessages(prev => [...prev, { role: "ai", text: displayText }]);

      if (decisionMatch) {
        try {
          const decision = JSON.parse(decisionMatch[1]);
          const newSession = { ...session, [decision.questionId]: decision.answer };
          setTimeout(() => {
            navigate("/decision-tree", { state: { session: newSession, resumeFrom: decision.questionId } });
          }, 2000);
        } catch (e) {
          console.error("Failed to parse DECISION signal", e);
        }
      }

      if (scopeOut) {
        setTimeout(() => {
          navigate("/cheatsheet", { state: { session } });
        }, 2000);
      }

    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "Lost connection mid-way. Not your fault. Refresh and try again — your progress might still be there. If not, I really don't know what to tell you besides find a better connection. I'll pray for you.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function renderMessageText(text) {
    return text.split("\n").map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <div className="flex-1 px-4 pt-20 pb-40 overflow-y-auto">

        {openerLoading && (
          <div className="flex items-start gap-2.5 mb-4">
            <Mascot emotion="thinking" size={32} />
            <div className="rounded-xl px-4 py-2.5 text-sm"
              style={{ backgroundColor: "var(--bg-accent)", color: "var(--accent)" }}>
              Thinking...
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === "system") {
            return (
              <div key={i} className="mb-4 px-4 py-3 rounded-xl text-xs"
                style={{
                  backgroundColor: "var(--bg-accent-light)",
                  border: "1px dashed var(--border-color)",
                  color: "var(--text-muted)",
                }}>
                <p className="font-semibold mb-1.5" style={{ color: "var(--accent-dark)" }}>
                  Here's what I know about you so far
                </p>
                {msg.text.split("\n").map((line, j) => (
                  <p key={j}>• {line}</p>
                ))}
              </div>
            );
          }

          return (
            <div key={i}
              className={`flex items-start gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {msg.role === "ai" && <Mascot emotion="neutral" size={32} />}
              <div
                className="rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%]"
                style={{
                  backgroundColor: msg.role === "ai" ? "var(--bg-accent)" : "var(--accent-dark)",
                  color: msg.role === "ai" ? "var(--text-primary)" : "#ffffff",
                }}>
                {renderMessageText(msg.text)}
              </div>
            </div>
          );
        })}

        {chips.length > 0 && !loading && (
          <div className="flex flex-col gap-2 ml-10 mb-4">
            {chips.map((chip, i) => (
              <button key={i} onClick={() => sendMessage(chip.label)}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent-dark)",
                  backgroundColor: "var(--bg-card)",
                }}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-start gap-2.5 mb-4">
            <Mascot emotion="thinking" size={32} />
            <div className="rounded-xl px-4 py-2.5 text-sm"
              style={{ backgroundColor: "var(--bg-accent)", color: "var(--accent)" }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-16 left-0 right-0 border-t px-4 py-3"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-light)" }}>
        <div className="max-w-sm mx-auto flex items-center gap-2">
          <button onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            ← Back
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
            style={{
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-page)",
              color: "var(--text-primary)",
            }}
            disabled={loading}
          />
          <button onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{
              backgroundColor: loading || !input.trim() ? "var(--text-muted)" : "var(--accent-dark)",
            }}>
            Send
          </button>
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
