import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DecisionTreePage from './Pages/DecisionTreePage'
import AIChatPage from './Pages/AIChatPage'
import CheatsheetPage from './Pages/CheatsheetPage'
import AuthPage from './Pages/AuthPage'
import AuthCallbackPage from './Pages/AuthCallbackPage'
import KitViewPage from './Pages/KitViewPage'
import QuizPage from './pages/QuizPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decision-tree" element={<DecisionTreePage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/cheatsheet" element={<CheatsheetPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/kit/:id" element={<KitViewPage />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App