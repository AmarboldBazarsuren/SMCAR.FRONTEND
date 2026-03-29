// Файл: frontend/src/services/api.js
// Үүрэг: Backend API-тай холбогдох axios instance
// Энд token автоматаар нэмэгдэнэ, алдааг console дээр харуулна

import axios from 'axios'

// Axios instance үүсгэх
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ============================================================
// REQUEST INTERCEPTOR - Хүсэлт явуулахаас өмнө token нэмэх
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`📡 API хүсэлт: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API хүсэлтийн алдаа:', error.message)
    return Promise.reject(error)
  }
)

// ============================================================
// RESPONSE INTERCEPTOR - Хариу ирэхэд алдаа шалгах
// ============================================================
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      console.error(`❌ API алдаа ${status}:`, data?.message || 'Тодорхойгүй алдаа')

      // 401 - Token хугацаа дуусвал login хуудас руу явуулах
      if (status === 401) {
        const isAdminRoute = window.location.pathname.startsWith('/admin')
        if (isAdminRoute && window.location.pathname !== '/admin/login') {
          console.warn('⚠️  Token дууссан, login хуудас руу явуулж байна...')
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminInfo')
          window.location.href = '/admin/login'
        }
      }

      // 429 - Rate limit
      if (status === 429) {
        console.warn('⚠️  API rate limit хэтэрсэн. Хэсэг хүлээгээд дахин оролдоорой.')
      }
    } else if (error.request) {
      console.error('❌ Серверт холбогдоход алдаа: Хариу ирсэнгүй')
      console.error('💡 Backend сервер ажиллаж байгаа эсэхийг шалгаарай: http://localhost:5000')
    } else {
      console.error('❌ Хүсэлт үүсгэхэд алдаа:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api