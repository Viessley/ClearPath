import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DecisionTreePage from './Pages/DecisionTreePage'
import AIChatPage from './Pages/AIChatPage'
import CheatsheetPage from './Pages/CheatsheetPage'
import AuthPage from './Pages/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decision-tree" element={<DecisionTreePage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/cheatsheet" element={<CheatsheetPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App