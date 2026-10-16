import { Routes, Route, Navigate } from "react-router"
import CasesPage from "./pages/CasesPage"
import NewCasePage from "./pages/NewCasePage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cases" replace />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/cases/new" element={<NewCasePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App