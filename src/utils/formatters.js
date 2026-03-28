// Файл: frontend/src/utils/formatters.js
// Үүрэг: Тоо, мөнгө, огноог форматлах helper функцууд

/**
 * Монгол төгрөгийн форматлах
 * Жишээ: 155445000 → "155'445'000₮"
 */
export const formatMNT = (amount) => {
  if (!amount && amount !== 0) return 'Тодорхойгүй'
  return `${Math.round(amount).toLocaleString('mn-MN').replace(/,/g, "'")}₮`
}

/**
 * Солонгос воны форматлах
 * Жишээ: 45700000 → "45,700,000₩"
 */
export const formatKRW = (amount) => {
  if (!amount && amount !== 0) return 'Тодорхойгүй'
  return `${Number(amount).toLocaleString('ko-KR')}₩`
}

/**
 * Км форматлах
 * Жишээ: 41231 → "41,231 км"
 */
export const formatMileage = (km) => {
  if (!km && km !== 0) return 'Тодорхойгүй'
  return `${Number(km).toLocaleString()}км`
}

/**
 * Машины насыг тооцоолох
 * @param {number} year - Үйлдвэрлэсэн он
 * @returns {number} - Насны жил
 */
export const getCarAge = (year) => {
  return new Date().getFullYear() - year
}

/**
 * Огноо форматлах
 * Жишээ: "2024-01-15T..." → "2024.01.15"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Engine CC форматлах
 * Жишээ: 1991 → "1991cc"
 */
export const formatCC = (cc) => {
  if (!cc) return ''
  return `${cc}cc`
}