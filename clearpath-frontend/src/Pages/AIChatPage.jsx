import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Mascot from "../components/shared/Mascot";

const API_BASE = "http://lclearpath-backend-sc9k.onrender.com/api/drivers-license";

export default function AIChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new message appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Opening message from AI
  useEffect(() => {
    if (Object.keys(session).length === 0) {
      setMessages([{
        role: "ai",
        text: "It looks like you came here directly. Please go through the decision tree first so I can understand your situation."
      }]);
      return;
    }
    setMessages([{
      role: "ai",
      text: "I can see your situation from the questions you answered. Tell me what you're unsure about, and I'll help you figure it out."
    }]);
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, userMessage }),
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

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "#f0f9f8" }}>
      <TopBar />

      {/* Chat messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto pb-32">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-2.5 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "ai" && <Mascot emotion="neutral" size={32} />}
            <div
              className="rounded-xl px-4 py-2.5 text-sm leading-relaxed max-w-[80%]"
              style={{
                backgroundColor: msg.role === "ai" ? "#D1EDE9" : "#5B9D93",
                color: msg.role === "ai" ? "#111827" : "#FFFFFF",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-2.5 mb-4">
            <Mascot emotion="thinking" size={32} />
            <div className="rounded-xl px-4 py-2.5 text-sm" style={{ backgroundColor: "#D1EDE9", color: "#5B9D93" }}>
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
            style={{ borderColor: "#5B9D93", color: "#5B9D93" }}>
            Back
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: "#A8D5CF" }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ backgroundColor: loading || !input.trim() ? "#9CA3AF" : "#5B9D93" }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}