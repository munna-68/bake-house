import { Navigate, Route, Routes } from 'react-router-dom'
import { Dashboard } from './dashboard/Dashboard'
import { Shop } from './pages/Shop'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
