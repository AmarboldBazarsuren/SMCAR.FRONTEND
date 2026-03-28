// Файл: frontend/src/components/admin/ProtectedRoute.jsx
// Үүрэг: Token байхгүй бол /admin/login руу чиглүүлэх

import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken')

  if (!token) {
    console.warn('⚠️  Token байхгүй, login хуудас руу чиглүүлж байна...')
    return <Navigate to="/admin/login" replace />
  }

  return children
}