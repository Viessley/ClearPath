import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import BottomBar from '../components/layout/BottomBar'
import Mascot from "../components/shared/Mascot";

const API_BASE = "https://clearpath-backend-sc9k.onrender.com/api/drivers-license";

export default function AIChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};
  const stuckAt = location.state?.questionId || null;
  const lastFeedback = location.state?.feedback || null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate contextual opening message based on where user got stuck
  function getOpeningMessage() {
    if (Object.keys(session).length === 0) {
      return "It looks like you came here directly. Please go through the decision tree first so I can understand your situation.";
    }

    if (!stuckAt) {
      return "Tell me what you need help with, and I'll guide you through it.";
    }

    const openers = {
      // Age / Guardian consent
      "P1Q1.1": "No worries. Let's figure out your guardian situation. Which part is unclear?\n\n- Not sure who can sign for you\n- Not sure how to get the consent document\n- Your guardian is hard to reach\n- Something else",

      "P1Q1.1NotSure": "Let's figure this out together. Can you tell me a bit about your family situation? For example:\n\n- Do you live with a parent or guardian in Canada?\n- Are your parents overseas?\n- Are you in foster care or living independently?",

      // Study Permit
      "P1Q2.1IS": "Let's sort out your Study Permit. Which part is unclear?\n\n- Not sure if it's expired\n- Not sure what a Study Permit looks like\n- Have a document but not sure if it counts\n- Something else",

      "P1Q2.1ISLess6Months": "Your Study Permit expires soon, which affects your options. What would you like to know?\n\n- Can I still apply for a driver's license?\n- How do I extend my Study Permit?\n- What happens if it expires while I'm in the process?",

      "P1Q2.1ISExpired": "Your permit situation sounds complex. Which describes you best?\n\n- Waiting for a renewal decision\n- Not sure if I'm on maintained status\n- Applied for PGWP but haven't received it\n- Not sure what to do next",

      // Work Permit
      "P1Q2.1WP": "Let's figure out your Work Permit type. Do you have your permit document in front of you? Look for these words:\n\n- 'This does not restrict the holder to a specific employer' = Open Work Permit\n- A specific employer name listed = Employer-specific\n\nTell me what you see.",

      "P1Q2.2WPNotSure": "If you have your Work Permit handy, look for the words 'This permit does not restrict the holder to a specific employer'. Do you see that anywhere on the document?",

      // Protected Person / Refugee
      "P1Q2.1PPR": "Let's figure out your status. Do you have any documents from Immigration Canada (IRCC)?\n\n- A paper with 'IMM 1434' on it\n- A card with your photo and 'IMM 7703'\n- A decision letter\n- Not sure what I have\n\nTell me what you have and I'll help identify them.",

      // Visitor
      "P1Q2.1VIS": "Visitor status can mean different things. Let me help clarify:\n\n- Did you enter Canada as a tourist with just your passport?\n- Do you have a document called 'Visitor Record' (IMM 1442)?\n- Are you waiting for PR or Work Permit approval?\n- Not sure what documents you have",

      // Permanent Resident
      "P1Q2.1PR": "Let's figure out your PR stage. Do you have:\n\n- A plastic card (PR Card)\n- A paper document called COPR (IMM 5292)\n- Both\n- Not sure what I have",

      "P1Q2.2PRCard": "Let's check your PR Card. Look at the front of the card - there should be an expiry date. What does it say? If you're not sure where to look, it's usually near the bottom right.",

      "P1Q2.2PRNew": "You need both your COPR (landing paper) and a valid passport from your home country. Which of these do you have questions about?\n\n- What is COPR exactly?\n- My passport might be expired\n- I'm not sure if my documents are enough",

      // Foreign License
      "P1Q3.3NotAgreement": "A driving record (also called a 'driver's abstract') is an official document from your home country that shows your driving history - when you got your license, any violations, etc. It's different from your license itself.\n\nWhich country is your license from? I can help you figure out how to get one.",
    };

    return openers[stuckAt] || (lastFeedback
      ? lastFeedback + "\n\nWhat specifically would you like to know more about?"
      : "I can see you got stuck at one of the questions. Tell me what's confusing and I'll help clarify.");
  }

  useEffect(() => {
    setMessages([{ role: "ai", text: getOpeningMessage() }]);
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Include stuckAt context so AI knows where user got confused
      const contextMessage = stuckAt
        ? `[User was answering question ${stuckAt} and selected "not sure". Their session so far: ${JSON.stringify(session)}] ${userMessage}`
        : userMessage;

      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, userMessage: contextMessage, stuckAt }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, {
        role: "ai",
        text: data.message || "Sorry, I could not process that. Please try again."
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "Connection error. Please make sure the backend is running."
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

  // Render message text with line breaks
  function renderMessageText(text) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-accent-light)" }}>
      <TopBar />

      {/* Chat messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "ai" && <Mascot emotion="neutral" size={32} />}
            <div
              className="rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%]"
              style={{
                backgroundColor: msg.role === "ai" ? "var(--bg-accent)" : "var(--accent)",
                color: msg.role === "ai" ? "var(--text-primary)" : "var(--bg-card)",
              }}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-2.5 mb-4">
            <Mascot emotion="thinking" size={32} />
            <div className="rounded-xl px-4 py-2.5 text-sm" style={{ backgroundColor: "var(--bg-accent)", color: "var(--accent)" }}>
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-sm mx-auto flex items-center gap-2">
          <button onClick={() => navigate(-1)}
            className="px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
            Back
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: "var(--border-color)" }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ backgroundColor: loading || !input.trim() ? "var(--text-muted)" : "var(--accent)" }}>
            Send
          </button>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}