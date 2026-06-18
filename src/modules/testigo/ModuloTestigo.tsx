import { Navigate, Route, Routes } from 'react-router-dom'
import { HacerReportePage } from './pages/HacerReportePage'
import { SeleccionMesaPage } from './pages/SeleccionMesaPage'

export default function ModuloTestigo() {
  return (
    <Routes>
      <Route index element={<SeleccionMesaPage />} />
      <Route path="reporte" element={<HacerReportePage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}
