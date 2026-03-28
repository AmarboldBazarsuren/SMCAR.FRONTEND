// Файл: frontend/src/hooks/useAuth.js
// Үүрэг: Admin нэвтрэх/гарах state удирдах custom hook

import { useState, useEffect } from 'react'
import { adminLogin } from '../services/adminService.js'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Хуудас ачаалахад token шалгах
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const savedAdmin = localStorage.getItem('adminInfo')

    if (token && savedAdmin) {
      try {
        setAdminInfo(JSON.parse(savedAdmin))
        setIsAuthenticated(true)
        console.log('✅ Admin session дахин ачааллаа')
      } catch (e) {
        console.warn('⚠️  Admin session алдаатай, дахин нэвтрэх шаардлагатай')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminInfo')
      }
    }
    setLoading(false)
  }, [])

  /**
   * Нэвтрэх
   */
  const login = async (email, password) => {
    console.log(`🔐 Нэвтрэж байна: ${email}`)
    const data = await adminLogin(email, password)

    if (data.success) {
      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminInfo', JSON.stringify(data.admin))
      setAdminInfo(data.admin)
      setIsAuthenticated(true)
      console.log('✅ Admin амжилттай нэвтэрлээ')
    }

    return data
  }

  /**
   * Гарах
   */
  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    setAdminInfo(null)
    setIsAuthenticated(false)
    console.log('👋 Admin гарлаа')
    window.location.href = '/admin/login'
  }

  return { isAuthenticated, adminInfo, loading, login, logout }
}