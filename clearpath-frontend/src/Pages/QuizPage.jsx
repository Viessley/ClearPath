import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from "../components/layout/TopBar";
import BottomBar from '../components/layout/BottomBar'

const API_BASE = 'https://clearpath-backend-sc9k.onrender.com/api/quiz'

export default function QuizPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem('userId')
    ? parseInt(localStorage.getItem('userId'))
    : null

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    try {
      const url = userId
        ? `${API_BASE}/questions?userId=${userId}&limit=7`
        : `${API_BASE}/questions?limit=7`
      const res = await fetch(url)
      const data = await res.json()
      setQuestions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(option) {
    if (isAnswered) return
    setSelectedOption(option)
    setIsAnswered(true)
    setShowExplanation(true)

    const correct = option === questions[currentIndex].correctOption
    setIsCorrect(correct)
    if (correct) setScore(s => s + 1)

    try {
      await fetch(`${API_BASE}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          questionId: questions[currentIndex].id,
          selectedOption: option
        })
      })
    } catch (e) {}
  }

  async function handleShowAnswer() {
    if (isAnswered) return
    setIsAnswered(true)
    setShowExplanation(true)
    setIsCorrect(false)
    setSelectedOption(questions[currentIndex].correctOption)

    try {
      await fetch(`${API_BASE}/see-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          questionId: questions[currentIndex].id
        })
      })
    } catch (e) {}
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setIsCorrect(null)
      setShowExplanation(false)
    }
  }

  if (loading) return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />
      <div className="flex-1 flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Loading questions...</p>
      </div>
      <BottomBar />
    </div>
  )

  if (finished) return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="text-5xl">🎯</div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Round Complete!
        </h2>
        <div className="rounded-2xl p-6 w-full text-center"
          style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--border-color)" }}>
          <p className="text-4xl font-bold" style={{ color: "var(--accent)" }}>
            {score} / {questions.length}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>correct answers</p>
        </div>
        <button
          onClick={() => { setFinished(false); setCurrentIndex(0); setScore(0); setSelectedOption(null); setIsAnswered(false); setIsCorrect(null); setShowExplanation(false); fetchQuestions(); }}
          className="w-full py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          Try Another Round
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-sm"
          style={{ color: "var(--text-muted)" }}>
          Back to Home
        </button>
      </div>
      <BottomBar />
    </div>
  )

  if (questions.length === 0) return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />
      <div className="flex-1 flex items-center justify-center px-6">
        <p style={{ color: "var(--text-muted)" }}>No questions available yet.</p>
      </div>
      <BottomBar />
    </div>
  )

  const q = questions[currentIndex]
  const options = [
    { key: 'a', label: q.optionA },
    { key: 'b', label: q.optionB },
    { key: 'c', label: q.optionC },
    { key: 'd', label: q.optionD },
  ]

  function getOptionStyle(key) {
    if (!isAnswered) return {
      borderColor: "var(--border-light)",
      backgroundColor: "var(--bg-card)",
      color: "var(--text-primary)"
    }
    if (key === q.correctOption) return {
      borderColor: "#10b981",
      backgroundColor: "#d1fae5",
      color: "#065f46"
    }
    if (key === selectedOption && key !== q.correctOption) return {
      borderColor: "#ef4444",
      backgroundColor: "#fee2e2",
      color: "#991b1b"
    }
    return {
      borderColor: "var(--border-light)",
      backgroundColor: "var(--bg-card)",
      color: "var(--text-muted)"
    }
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      <TopBar />

      <main className="flex-1 px-4 pt-20 pb-32 flex flex-col gap-4">

        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            ✓ {score} correct
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "var(--border-light)" }}>
          <div className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, backgroundColor: "var(--accent)" }} />
        </div>

        {/* Question */}
        <div className="rounded-2xl p-4"
          style={{ backgroundColor: "var(--bg-card)", border: "2px solid var(--border-color)" }}>
          <p className="text-sm leading-relaxed font-medium" style={{ color: "var(--text-primary)" }}>
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {options.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              disabled={isAnswered}
              className="w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150"
              style={getOptionStyle(opt.key)}>
              <span className="font-semibold mr-2">{opt.key.toUpperCase()}.</span>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Show Answer button */}
        {!isAnswered && (
          <button
            onClick={handleShowAnswer}
            className="w-full py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)", backgroundColor: "transparent" }}>
            Show Answer
          </button>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="rounded-2xl p-4"
            style={{
              backgroundColor: isCorrect ? "#d1fae5" : "#fff7ed",
              border: `2px solid ${isCorrect ? "#10b981" : "#f59e0b"}`
            }}>
            <p className="text-xs font-bold mb-1" style={{ color: isCorrect ? "#065f46" : "#92400e" }}>
              {isCorrect ? "✓ Correct!" : "✗ Not quite"}
            </p>
            <p className="text-sm" style={{ color: isCorrect ? "#065f46" : "#78350f" }}>
              {q.plainExplanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl font-semibold text-sm mt-2"
            style={{ backgroundColor: "var(--accent-dark)", color: "#fff" }}>
            {currentIndex + 1 >= questions.length ? "See Results" : "Next Question →"}
          </button>
        )}

      </main>

      <BottomBar />
    </div>
  )
}