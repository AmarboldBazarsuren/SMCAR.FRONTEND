// Файл: frontend/src/App.jsx
// Үүрэг: Бүх хуудасны route тохиргоо

import { Routes, Route } from 'react-router-dom'

// Нийтийн хуудсууд
import HomePage from './pages/HomePage.jsx'
import VehicleListPage from './pages/VehicleListPage.jsx'
import VehicleDetailPage from './pages/VehicleDetailPage.jsx'
import ManualVehicleDetailPage from './pages/ManualVehicleDetailPage.jsx'

// Admin хуудсууд
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminBannersPage from './pages/admin/AdminBannersPage.jsx'
import AdminVehiclesPage from './pages/admin/AdminVehiclesPage.jsx'
import AdminVehicleFormPage from './pages/admin/AdminVehicleFormPage.jsx'
import AdminPricingPage from './pages/admin/AdminPricingPage.jsx'
import AdminTaxPage from './pages/admin/AdminTaxPage.jsx'

// Admin route хамгаалах wrapper
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* ============================================================
          НИЙТИЙН ХУУДСУУД - Token шаардахгүй
          ============================================================ */}
      <Route path="/" element={<HomePage />} />
      <Route path="/vehicles" element={<VehicleListPage />} />
      <Route path="/vehicles/encar/:id" element={<VehicleDetailPage />} />
      <Route path="/vehicles/manual/:id" element={<ManualVehicleDetailPage />} />

      {/* ============================================================
          ADMIN ХУУДСУУД
          ============================================================ */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes - нэвтэрсэн байх шаардлагатай */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="vehicles" element={<AdminVehiclesPage />} />
        <Route path="vehicles/new" element={<AdminVehicleFormPage />} />
        <Route path="vehicles/edit/:id" element={<AdminVehicleFormPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="tax" element={<AdminTaxPage />} />
      </Route>
    </Routes>
  )
}