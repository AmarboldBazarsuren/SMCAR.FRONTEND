// Файл: frontend/src/services/adminService.js
// Үүрэг: Admin нэвтрэх, banner, pricing API дуудлагууд

import api from './api.js'

// ============================================================
// AUTH
// ============================================================

export const adminLogin = async (email, password) => {
  console.log(`🔐 Admin нэвтрэж байна: ${email}`)
  const response = await api.post('/admin/auth/login', { email, password })
  return response.data
}

export const getAdminMe = async () => {
  const response = await api.get('/admin/auth/me')
  return response.data
}

// ============================================================
// BANNER
// ============================================================

export const adminGetBanners = async () => {
  const response = await api.get('/admin/banners')
  return response.data
}

export const adminCreateBanner = async (formData) => {
  const response = await api.post('/admin/banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const adminUpdateBanner = async (id, formData) => {
  const response = await api.put(`/admin/banners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const adminDeleteBanner = async (id) => {
  const response = await api.delete(`/admin/banners/${id}`)
  return response.data
}

// ============================================================
// PRICING CONFIG - Валютын ханш
// ============================================================

export const getPricingConfig = async () => {
  const response = await api.get('/admin/pricing')
  return response.data
}

export const updatePricingConfig = async (data) => {
  const response = await api.put('/admin/pricing', data)
  return response.data
}

// ============================================================
// TAX CONFIG - Онцгой татварын хүснэгт
// ============================================================

export const getTaxConfig = async () => {
  const response = await api.get('/admin/pricing/tax')
  return response.data
}

export const updateTaxConfig = async (data) => {
  const response = await api.put('/admin/pricing/tax', data)
  return response.data
}

export const testPriceCalculation = async (data) => {
  const response = await api.post('/admin/pricing/calculate', data)
  return response.data
}