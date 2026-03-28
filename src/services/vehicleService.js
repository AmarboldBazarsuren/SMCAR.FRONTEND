// Файл: frontend/src/services/vehicleService.js
// Үүрэг: Машинтай холбоотой бүх API дуудлагууд

import api from './api.js'

// ============================================================
// НИЙТИЙН API - Encar машинууд
// ============================================================

/**
 * Encar машинуудын жагсаалт татах
 * @param {Object} filters - brand, model, year_min, year_max, limit, offset
 */
export const getEncarVehicles = async (filters = {}) => {
  console.log('🔍 Encar машин жагсаалт татаж байна...', filters)
  const response = await api.get('/vehicles', { params: filters })
  return response.data
}

/**
 * Encar машины дэлгэрэнгүй + татвар тооцоолол
 * @param {string} id - Машины ID
 */
export const getEncarVehicleDetail = async (id) => {
  console.log(`🔍 Encar машин дэлгэрэнгүй татаж байна: ID ${id}`)
  const response = await api.get(`/vehicles/encar/${id}`)
  return response.data
}

/**
 * Admin гараар нэмсэн машинуудын жагсаалт
 */
export const getManualVehicles = async (filters = {}) => {
  const response = await api.get('/vehicles/manual', { params: filters })
  return response.data
}

/**
 * Гараар нэмсэн машины дэлгэрэнгүй
 */
export const getManualVehicleDetail = async (id) => {
  const response = await api.get(`/vehicles/manual/${id}`)
  return response.data
}

/**
 * Брэндүүдийн жагсаалт
 */
export const getBrands = async () => {
  const response = await api.get('/vehicles/brands')
  return response.data
}

/**
 * Тооцоолол
 * @param {Object} body - { priceKRW, year, engineCC }
 */
export const calculatePrice = async (body) => {
  const response = await api.post('/vehicles/calculate-price', body)
  return response.data
}

/**
 * Banner зургууд
 */
export const getActiveBanners = async () => {
  const response = await api.get('/banners')
  return response.data
}

// ============================================================
// ADMIN API - Машин удирдах
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