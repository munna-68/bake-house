import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Dashboard } from './dashboard/Dashboard'
import { Shop } from './pages/Shop'

export function App() {
  const location = useLocation()

  // Strip trailing slashes so routes and active tabs match consistently
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return (
      <Navigate
        to={`${location.pathname.replace(/\/+$/, '')}${location.search}${location.hash}`}
        replace
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Shop />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
