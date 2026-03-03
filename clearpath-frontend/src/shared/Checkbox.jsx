import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DecisionTreePage from './pages/DecisionTreePage'
import AIChatPage from './pages/AIChatPage'
import CheatsheetPage from './pages/CheatsheetPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decision-tree" element={<DecisionTreePage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/cheatsheet" element={<CheatsheetPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App