import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from '../components/layout/BottomBar';
import Mascot from "../components/shared/Mascot";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api/drivers-license";

const TOP_COUNTRIES = ["IN", "CN", "PH", "GB", "US", "PK", "IR", "NG"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionButton({ opt, isSelected, onClick }) {
  return (
    <button
      onClick={() => onClick(opt.value)}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 ${isSelected ? "shadow-sm" : "hover:border-gray-300"}`}
      style={{
        borderColor: isSelected ? "var(--accent)" : "var(--border-light)",
        backgroundColor: isSelected ? "var(--bg-accent-light)" : "var(--bg-card)",
        color: "var(--text-primary)",
      }}
    >
      <div className="flex items-center justify-between">
        <span>{opt.label}</span>
        {isSelected && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

function CountrySelector({ options, selectedValue, onSelect }) {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const topOptions = options.filter(opt => TOP_COUNTRIES.includes(opt.value));
  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      {!showSearch && (
        <div className="grid grid-cols-2 gap-2">
          {topOptions.map(opt => (
            <OptionButton key={opt.value} opt={opt} isSelected={selectedValue === opt.value} onClick={onSelect} />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowSearch(!showSearch)}
        className="w-full mt-3 py-2.5 text-sm font-medium rounded-xl border-2 transition-all"
        style={{ borderColor: "var(--border-color)", color: "var(--accent)" }}
      >
        {showSearch ? "Hide search" : "My country is not listed"}
      </button>

      {showSearch && (
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border-2 text-sm mb-2"
            style={{ borderColor: "var(--border-color)" }}
          />
          <div className="max-h-36 overflow-y-auto space-y-1.5">
            {filtered.map(opt => (
              <OptionButton key={opt.value} opt={opt} isSelected={selectedValue === opt.value} onClick={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DecisionTreePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const resumeSession = location.state?.session || null;
  const resumeFrom   = location.state?.resumeFrom || null;

  // Question state
  const [question,      setQuestion]      = useState(null);
  const [questionId,    setQuestionId]    = useState(null);
  const [options,       setOptions]       = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [feedback,      setFeedback]      = useState(null);

  // Flow state
  const [session,   setSession]   = useState({});
  const [history,   setHistory]   = useState([]);
  const [done,      setDone]      = useState(false);
  const [aiSupport, setAiSupport] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);

  // Animation
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // ─── Init ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (resumeFrom && resumeSession) {
      setSession(resumeSession);
      fetchAnswer(resumeFrom, resumeSession[resumeFrom], resumeSession, false);
    } else {
      fetchStart();
    }
  }, []);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [question]);

  // ─── API calls ──────────────────────────────────────────────────────────────

  async function fetchStart() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/start`);
      const data = await res.json();
      setQuestion(data.question);
      setOptions(data.options || []);
      setQuestionId("P1Q1");
      setFeedback(null);
      setSelectedValue(null);
      setDone(false);
      setAiSupport(false);
    } catch {
      setError("Our server decided to take an unauthorized vacation. Check back in a few minutes, or email clearpathwesley@gmail.com to make his day worse.");
    } finally {
      setLoading(false);
    }
  }

  // Core answer fetcher — used by both handleNext and resume flow.
  // pushHistory: whether to save current state to history stack (false on resume).
  async function fetchAnswer(qId, value, currentSession, pushHistory = true) {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/answer?questionId=${encodeURIComponent(qId)}&value=${encodeURIComponent(value)}`);
      const data = await res.json();

      if (data.error) { setError(data.error); return; }

      const updatedSession = { ...currentSession, [qId]: value };

      if (pushHistory) {
        setHistory(prev => [...prev, { question, questionId, options, feedback, selectedValue, session: { ...currentSession }, done, aiSupport }]);
      }

      setSession(updatedSession);
      setFeedback(data.feedback || null);
      applyResponse(data, updatedSession, qId);

    } catch {
      setError("Lost connection mid-way. Refresh and try again — your progress might still be there.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Response handler ───────────────────────────────────────────────────────

  function applyResponse(data, updatedSession, fromQuestionId) {
    const type = data.type;

    switch (type) {
      case "NEXT_QUESTION":
        setQuestion(data.question || null);
        setQuestionId(data.questionId || null);
        setOptions(data.options || []);
        setSelectedValue(null);
        setDone(false);
        setAiSupport(false);
        break;

      case "AI_SUPPORT":
        navigate("/ai-chat", {
          state: { session: updatedSession, stuckAt: fromQuestionId, feedback: data.feedback }
        });
        break;

      case "ANSWER":
        navigate("/cheatsheet", {
          state: { session: updatedSession }
        });
        break;

      case "NEXT_SECTION":
        setQuestion(null);
        setOptions([]);
        setSelectedValue(null);
        setDone(false);
        setAiSupport(false);
        setFeedback(`${data.feedback || ""}\n\n(Section: ${data.sectionId || "unknown"} — coming soon)`);
        break;

      default:
        setError(`Unknown response type: ${type}`);
    }
  }

  // ─── Event handlers ─────────────────────────────────────────────────────────

  function handleSelect(value) {
    setSelectedValue(value);
  }

  function handleNext() {
    if (!selectedValue || !questionId) return;
    fetchAnswer(questionId, selectedValue, session, true);
  }

  function handlePrev() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setQuestion(prev.question);
    setQuestionId(prev.questionId);
    setOptions(prev.options);
    setFeedback(prev.feedback);
    setSelectedValue(prev.selectedValue);
    setSession(prev.session);
    setDone(prev.done);
    setAiSupport(prev.aiSupport);
  }

  function goToAIChat() {
    navigate("/ai-chat", { state: { session, stuckAt: questionId, feedback } });
  }

  function goToCheatsheet() {
    navigate("/cheatsheet", { state: { session } });
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  const stepCount = history.length + 1;
  const isCountryQuestion = options.length > 20;

  return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <main className="flex-1 px-4 py-5 flex flex-col">

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Step {stepCount}</span>
            <span className="text-xs text-gray-400">{done ? "Complete" : "In progress..."}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: done ? "100%" : `${Math.min(stepCount * 15, 90)}%`, backgroundColor: "var(--accent)" }} />
          </div>
        </div>

        {/* Mascot + feedback bubble */}
        <div className="flex items-start gap-3 mb-5">
          <Mascot emotion={done ? "happy" : aiSupport ? "thinking" : "neutral"} size={40} />
          <div className="rounded-xl px-4 py-2.5 text-sm leading-relaxed"
            style={{ backgroundColor: "var(--bg-accent)", color: "var(--text-primary)" }}>
            <p>{feedback || "Let's figure out the best path for you."}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
            <button onClick={fetchStart} className="ml-2 underline font-medium hover:text-red-900">Retry</button>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full animate-spin"
                style={{ border: "3px solid var(--border-color)", borderTopColor: "var(--accent)" }} />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        )}

        {/* Question card + options */}
        {!loading && question && !done && (
          <div ref={cardRef}
            className={`transition-all duration-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <div className="rounded-xl border-2 px-4 py-3 mb-4"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Q{stepCount}: {question}
              </p>
            </div>

            {isCountryQuestion ? (
              <CountrySelector options={options} selectedValue={selectedValue} onSelect={handleSelect} />
            ) : (
              <div className="space-y-2.5">
                {options.map(opt => (
                  <OptionButton key={opt.value} opt={opt} isSelected={selectedValue === opt.value} onClick={handleSelect} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assessment complete card */}
        {!loading && done && (
          <div className={`transition-all duration-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <div className="rounded-xl border-2 px-5 py-5 text-center"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-accent)" }}>
              <div className="text-3xl mb-3">✅</div>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Assessment Complete</h2>
              {feedback && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feedback}</p>}
              <button onClick={goToCheatsheet}
                className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "var(--accent)" }}>
                Generate My Cheatsheet →
              </button>
            </div>
          </div>
        )}

        {/* AI Support button */}
        {!loading && aiSupport && !done && (
          <div className="mt-4">
            <button onClick={goToAIChat}
              className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--accent)" }}>
              💬 Chat with ClearPath AI
            </button>
          </div>
        )}

        {/* Nav: Prev / Next */}
        {!loading && !done && (
          <div className="flex items-center justify-between mt-6 pb-2">
            <button onClick={handlePrev} disabled={history.length === 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${history.length === 0 ? "text-gray-300 cursor-not-allowed" : "text-white hover:opacity-90 active:scale-[0.98]"}`}
              style={{ backgroundColor: history.length === 0 ? "var(--border-light)" : "var(--accent)" }}>
              ← Prev
            </button>
            <button onClick={handleNext} disabled={!selectedValue}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${!selectedValue ? "text-gray-300 cursor-not-allowed" : "text-white hover:opacity-90 active:scale-[0.98]"}`}
              style={{ backgroundColor: !selectedValue ? "var(--border-light)" : "var(--accent)" }}>
              Next →
            </button>
          </div>
        )}

        {/* Nav: Back / Home (when done) */}
        {done && (
          <div className="flex items-center justify-between mt-4 pb-2">
            <button onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "var(--accent)" }}>
              ← Back
            </button>
            <button onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
              Home
            </button>
          </div>
        )}

      </main>
      <BottomBar />
    </div>
  );
}