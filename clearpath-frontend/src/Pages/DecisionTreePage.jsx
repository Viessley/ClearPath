import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from '../components/layout/BottomBar'
import Mascot from "../components/shared/Mascot";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api/drivers-license";

export default function DecisionTreePage() {
  const navigate = useNavigate();

  const location = useLocation();
  const resumeSession = location.state?.session || null;
  const resumeFrom = location.state?.resumeFrom || null;

  // Current question state
  const [question, setQuestion] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  // Flow state
  const [session, setSession] = useState({});
  const [history, setHistory] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // AI support state
  const [aiSupport, setAiSupport] = useState(false);
  const [aiInputType, setAiInputType] = useState(null);

  // Country search state
  const [showMore, setShowMore] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Animation
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (resumeFrom && resumeSession) {
      setSession(resumeSession);
      resumeDecisionTree(resumeFrom, resumeSession[resumeFrom], resumeSession);
    } else {
      fetchStart();
    }
  }, []);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [question]);

  async function fetchStart() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/start`);
      const data = await res.json();
      setQuestion(data.question);
      setOptions(data.options || []);
      setQuestionId("P1Q1");
      setFeedback(null);
      setSelectedValue(null);
      setDone(false);
      setAiSupport(false);
    } catch (err) {
      setError("Our server decided to take an unauthorized vacation. The developer has been notified and is not having a good time right now. Check back in a few minutes, or email clearpathwesley@gmail.com to make his day worse.");
    } finally {
      setLoading(false);
    }
  }

  async function resumeDecisionTree(qId, value, sess) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/answer?questionId=${encodeURIComponent(qId)}&value=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }

      const updatedSession = { ...sess, [qId]: value };
      setSession(updatedSession);
      setFeedback(data.feedback || null);

      const type = data.type;
      if (type === "AI_SUPPORT") {
        navigate("/ai-chat", { state: { session: updatedSession, stuckAt: questionId, feedback: data.feedback } });
        return;
      } else if (type === "NEXT_QUESTION") {
        setQuestion(data.question || null);
        setQuestionId(data.questionId || null);
        setOptions(data.options || []);
        setSelectedValue(null);
        setDone(data.done || false);
        setAiSupport(data.aiSupport || false);
        setAiInputType(data.inputType || null);
      } else if (type === "ANSWER") {
        setQuestion(null); setOptions([]); setSelectedValue(null);
        setDone(true); setAiSupport(false);
      }
    } catch (err) {
      setError("Lost connection mid-way. Not your fault. Refresh and try again — your progress might still be there. If not, I really don't know what to tell you besides find a better connection. I'll pray for you.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(value) { setSelectedValue(value); }

  async function handleNext() {
    if (!selectedValue || !questionId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/answer?questionId=${encodeURIComponent(questionId)}&value=${encodeURIComponent(selectedValue)}`
      );
      const data = await res.json();

      if (data.error) { setError(data.error); setLoading(false); return; }

      setHistory((prev) => [...prev, {
        question, questionId, options, feedback, selectedValue,
        session: { ...session }, done, aiSupport, aiInputType,
      }]);

      const updatedSession = { ...session, [questionId]: selectedValue };
      setSession(updatedSession);

      const type = data.type;
      setFeedback(data.feedback || null);

      if (type === "AI_SUPPORT") {
        navigate("/ai-chat", { state: { session: updatedSession, stuckAt: questionId, feedback: data.feedback } });
        return;
      } else if (type === "NEXT_QUESTION") {
        setQuestion(data.question || null);
        setQuestionId(data.questionId || null);
        setOptions(data.options || []);
        setSelectedValue(null);
        setDone(data.done || false);
        setAiSupport(data.aiSupport || false);
        setAiInputType(data.inputType || null);
      }
      else if (type === "ANSWER") {
        setQuestion(null); setOptions([]); setSelectedValue(null);
        setDone(true); setAiSupport(false);
      } else if (type === "NEXT_SECTION") {
        setQuestion(null); setOptions([]); setSelectedValue(null);
        setDone(false); setAiSupport(false);
        setFeedback((data.feedback || "") + "\n\n(Section: " + (data.sectionId || "unknown") + " — coming soon)");
      }
    } catch (err) {
      setError("Lost connection mid-way. Not your fault. Refresh and try again — your progress might still be there. If not, I really don't know what to tell you besides find a better connection. I'll pray for you.");
    } finally {
      setLoading(false);
    }
  }

  function handlePrev() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setQuestion(prev.question); setQuestionId(prev.questionId);
    setOptions(prev.options); setFeedback(prev.feedback);
    setSelectedValue(prev.selectedValue); setSession(prev.session);
    setDone(prev.done); setAiSupport(prev.aiSupport);
    setAiInputType(prev.aiInputType);
  }

  function goToAIChat() {
    navigate("/ai-chat", { state: { session, stuckAt: questionId, feedback } });
  }

  function goToCheatsheet() { navigate("/cheatsheet", { state: { session } }); }

  const stepCount = history.length + 1;

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

        {/* Mascot + speech bubble */}
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

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        )}

        {/* Question Card */}
        {!loading && question && !done && (
          <div ref={cardRef}
            className={`transition-all duration-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <div className="rounded-xl border-2 px-4 py-3 mb-4"
              style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-card)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Q{stepCount}: {question}</p>
            </div>

            {/* Options */}
            {(() => {
              const TOP_COUNTRIES = ["IN", "CN", "PH", "GB", "US", "PK", "IR", "NG"];
              const isCountryQuestion = options.length > 20;

              if (isCountryQuestion) {
                const topOptions = options.filter(opt => TOP_COUNTRIES.includes(opt.value));
                const restOptions = options;
                const filtered = restOptions.filter(opt => opt.label.toLowerCase().includes(countrySearch.toLowerCase()));

                return (
                  <div>
                    {!showMore && (
                      <div className="grid grid-cols-2 gap-2">
                        {topOptions.map((opt) => {
                          const isSelected = selectedValue === opt.value;
                          return (
                            <button key={opt.value} onClick={() => { handleSelect(opt.value); setShowMore(false); }}
                              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 ${isSelected ? "shadow-sm" : "hover:border-gray-300"}`}
                              style={{ borderColor: isSelected ? "var(--accent)" : "var(--border-light)", backgroundColor: isSelected ? "var(--bg-accent)" : "var(--bg-card)", color: "var(--text-primary)" }}>
                              <div className="flex items-center justify-between">
                                <span>{opt.label}</span>
                                {isSelected && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button onClick={() => setShowMore(!showMore)}
                      className="w-full mt-3 py-2.5 text-sm font-medium rounded-xl border-2 transition-all"
                      style={{ borderColor: "var(--border-color)", color: "var(--accent)" }}>
                      {showMore ? "Hide other countries" : "My country is not listed"}
                    </button>

                    {showMore && (
                      <div className="mt-2">
                        <input type="text" placeholder="Search country..." value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border-2 text-sm mb-2"
                          style={{ borderColor: "var(--border-color)" }} />
                        <div className="max-h-36 overflow-y-auto space-y-1.5">
                          {filtered.map((opt) => {
                            const isSelected = selectedValue === opt.value;
                            return (
                              <button key={opt.value} onClick={() => handleSelect(opt.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${isSelected ? "shadow-sm" : "hover:border-gray-300"}`}
                                style={{ borderColor: isSelected ? "var(--accent)" : "var(--border-light)", backgroundColor: isSelected ? "var(--bg-accent-light)" : "var(--bg-card)", color: "var(--text-primary)" }}>
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="space-y-2.5">
                    {options.map((opt) => {
                      const isSelected = selectedValue === opt.value;
                      return (
                        <button key={opt.value} onClick={() => handleSelect(opt.value)}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 ${isSelected ? "shadow-sm" : "hover:border-gray-300"}`}
                          style={{ borderColor: isSelected ? "var(--accent)" : "var(--border-light)", backgroundColor: isSelected ? "var(--bg-accent-light)" : "var(--bg-card)", color: "var(--text-primary)" }}>
                          <div className="flex items-center justify-between">
                            <span>{opt.label}</span>
                            {isSelected && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              }
            })()}
          </div>
        )}

        {/* Done */}
        {!loading && done && (
          <div className={`transition-all duration-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            <div className="rounded-xl border-2 px-5 py-5 text-center" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-accent)" }}>
              <div className="text-3xl mb-3">✅</div>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Assessment Complete</h2>
              {feedback && <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feedback}</p>}
              <button onClick={goToCheatsheet} className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "var(--accent)" }}>
                Generate My Cheatsheet →
              </button>
            </div>
          </div>
        )}

        {/* AI Support */}
        {!loading && aiSupport && !done && (
          <div className="mt-4">
            <button onClick={goToAIChat} className="w-full py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--accent)" }}>
              💬 Chat with ClearPath AI
            </button>
          </div>
        )}

        {/* Nav Buttons */}
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

        {done && (
          <div className="flex items-center justify-between mt-4 pb-2">
            <button onClick={handlePrev} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "var(--accent)" }}>← Back</button>
            <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Home</button>
          </div>
        )}
      </main>
      <BottomBar />
    </div>
  );
}