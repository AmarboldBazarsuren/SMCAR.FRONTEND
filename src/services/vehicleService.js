// Файл: frontend/src/services/vehicleService.js
// Үүрэг: Машинтай холбоотой бүх API дуудлагууд
//
// Нэмэгдсэн: getBrandStats — нүүр хуудасны брэнд + загварын статистик

import api from './api.js'

// ============================================================
// НИЙТИЙН API
// ============================================================

export const getEncarVehicles = async (filters = {}) => {
  const response = await api.get('/vehicles', { params: filters })
  return response.data
}

export const getEncarVehicleDetail = async (id) => {
  const response = await api.get(`/vehicles/encar/${id}`)
  return response.data
}

export const getManualVehicles = async (filters = {}) => {
  const response = await api.get('/vehicles/manual', { params: filters })
  return response.data
}

export const getManualVehicleDetail = async (id) => {
  const response = await api.get(`/vehicles/manual/${id}`)
  return response.data
}

export const getBrands = async () => {
  const response = await api.get('/vehicles/brands')
  return response.data
}

export const getModelsByBrand = async (brand) => {
  const response = await api.get(`/vehicles/brands/${brand}/models`)
  return response.data
}

export const calculatePrice = async (body) => {
  const response = await api.post('/vehicles/calculate-price', body)
  return response.data
}

export const getExchangeRate = async () => {
  const response = await api.get('/exchange-rate')
  return response.data
}

export const getActiveBanners = async () => {
  const response = await api.get('/banners')
  return response.data
}

// ⭐ Шинэ: Брэндийн статистик (cache-с)
// Response: { success, fromCache, data: { Kia: { total, models: [{name, count}] }, ... } }
export const getBrandStats = async () => {
  try {
    const response = await api.get('/vehicles/brand-stats')
    return response.data
  } catch {
    return { success: false, data: null }
  }
}

// ============================================================
// ADMIN API
// ============================================================

export const adminGetVehicles = async (params = {}) => {
  const response = await api.get('/admin/vehicles', { params })
  return response.data
}

export const adminGetVehicleById = async (id) => {
  const response = await api.get(`/admin/vehicles/${id}`)
  return response.data
}

export const adminCreateVehicle = async (formData) => {
  const response = await api.post('/admin/vehicles', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const adminUpdateVehicle = async (id, formData) => {
  const response = await api.put(`/admin/vehicles/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const adminDeleteVehicle = async (id) => {
  const response = await api.delete(`/admin/vehicles/${id}`)
  return response.data
}

export const adminDeleteVehicleImage = async (vehicleId, imageId) => {
  const response = await api.delete(`/admin/vehicles/${vehicleId}/images/${imageId}`)
  return response.data
}

// ============================================================
// ADMIN CACHE API
// ============================================================

export const adminGetCacheStats = async () => {
  const response = await api.get('/admin/cache/stats')
  return response.data
}

export const adminRefreshCache = async () => {
  const response = await api.post('/admin/cache/refresh')
  return response.data
}

export const adminClearCache = async () => {
  const response = await api.delete('/admin/cache/clear')
  return response.data
}