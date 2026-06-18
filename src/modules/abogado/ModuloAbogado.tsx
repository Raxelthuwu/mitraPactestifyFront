import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsultarReportesPage } from './pages/ConsultarReportesPage'
import { VerReportesPage } from './pages/VerReportesPage'

export default function ModuloAbogado() {
  return (
    <Routes>
      <Route index element={<ConsultarReportesPage />} />
      <Route path="reportes" element={<VerReportesPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
