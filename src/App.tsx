import { Routes, Route, Navigate } from "react-router"
import AppLayout from "./layouts/AppLayout"
import CasesPage from "./pages/CasesPage"
import NewCasePage from "./pages/NewCasePage"
import AssignedCasesPage from "./pages/AssignedCasesPage"
import ClosedCasesPage from "./pages/ClosedCasesPage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cases" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/assigned" element={<AssignedCasesPage />} />
        <Route path="/cases/closed" element={<ClosedCasesPage />} />
        <Route path="/cases/new" element={<NewCasePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App