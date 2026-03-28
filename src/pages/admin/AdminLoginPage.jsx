// Файл: frontend/src/pages/admin/AdminLoginPage.jsx
// Үүрэг: Admin нэвтрэх хуудас
// URL: /admin/login

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth.js'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('И-мэйл болон нууц үгийг оруулна уу')
      return
    }

    setLoading(true)
    console.log(`🔐 Admin нэвтрэж байна: ${email}`)

    try {
      const data = await login(email, password)
      if (data.success) {
        toast.success('Амжилттай нэвтэрлээ!')
        navigate('/admin')
      } else {
        toast.error(data.message || 'Нэвтрэх амжилтгүй')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Нэвтрэх амжилтгүй. Дахин оролдоорой.'
      console.error('❌ Login алдаа:', msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Лого */}
        <div className="text-center mb-8">
          <div className="font-display text-3xl tracking-wider mb-2">
            <span className="text-white">SMCAR</span>
            <span className="text-primary">.MN</span>
          </div>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        {/* Нэвтрэх маягт */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-8">
          <h1 className="text-white font-bold text-xl mb-6">Нэвтрэх</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* И-мэйл */}
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">И-мэйл</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@smcar.mn"
                  className="input-field pl-9"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Нууц үг */}
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">Нууц үг</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Нэвтрэх товч */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Нэвтэрж байна...
                </span>
              ) : 'Нэвтрэх'}
            </button>
          </form>
        </div>

        {/* Нэвтрэх мэдээлэл - dev үед */}
        {import.meta.env.DEV && (
          <div className="mt-4 bg-dark-card border border-yellow-500/20 rounded-lg p-4 text-xs text-gray-400">
            <p className="text-yellow-400 font-medium mb-1">⚠️ Dev мэдээлэл:</p>
            <p>И-мэйл: admin@smcar.mn</p>
            <p>Нууц үг: Admin@12345</p>
            <p className="text-gray-500 mt-1">(Seed script ажиллуулсны дараа)</p>
          </div>
        )}
      </div>
    </div>
  )
}