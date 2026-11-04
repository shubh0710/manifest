import { Routes, Route, Navigate } from "react-router"
import RequireAuth from "./components/RequireAuth"
import AppLayout from "./layouts/AppLayout"
import AuthLayout from "./layouts/AuthLayout"
import LogInPage from "./pages/LogInPage"
import OpenCasesPage from "./pages/OpenCasesPage"
import NewCasePage from "./pages/NewCasePage"
import AssignedCasesPage from "./pages/AssignedCasesPage"
import ClosedCasesPage from "./pages/ClosedCasesPage"
import CasePage from "./pages/CasePage"
import NotFoundPage from "./pages/NotFoundPage"

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LogInPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/cases/open" replace />} />
        <Route path="/cases" element={<Navigate to="/cases/open" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/cases/open" element={<OpenCasesPage />} />
          <Route path="/cases/assigned" element={<AssignedCasesPage />} />
          <Route path="/cases/closed" element={<ClosedCasesPage />} />
          <Route path="/cases/new" element={<NewCasePage />} />
          <Route path="/cases/:caseId" element={<CasePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App