// Файл: frontend/src/components/PricingBreakdown.jsx
import { useState } from 'react'
import { formatMNT, formatKRW } from '../utils/formatters.js'
import OrderModal from './OrderModal.jsx'

export default function PricingBreakdown({ pricing, priceKRW, isManual = false, vehicleId }) {
  const [modalOpen, setModalOpen] = useState(false)

  // MANUAL машин
  if (isManual) {
    return (
      <>
        <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} vehicleId={vehicleId} />

        <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
          <h3 className="text-gray-900 font-bold text-base mb-4">Үнийн мэдээлэл</h3>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-700 text-xs font-medium">✅ Монголд бэлэн зарагдаж байна</p>
            <p className="text-gray-500 text-xs mt-1">Энэ машин гаальд орохгүй — шууд авч болно</p>
          </div>

          {priceKRW && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Солонгос дахь үнэ</span>
                <span className="text-gray-900 text-sm font-semibold">{formatKRW(priceKRW)}</span>
              </div>
              {pricing && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Ханш</span>
                  <span className="text-gray-500 text-sm">1₩ = {pricing.wonToMNT}₮</span>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-bold text-sm">Нийт үнэ</span>
              <span className="text-primary font-bold text-xl">
                {pricing ? formatMNT(pricing.totalPriceMNT) : 'Тодорхойгүй'}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-1">Гаалийн татвар, тээвэр багтаагүй</p>
          </div>

          <button onClick={() => setModalOpen(true)} className="btn-primary w-full mt-4 text-sm">
            📞 Захиалга өгөх
          </button>
        </div>
      </>
    )
  }

  // ENCAR — Хөдөлгүүрийн мэдээлэл дутуу үед
  if (!pricing) {
    return (
      <>
        <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} vehicleId={vehicleId} />

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-gray-900 font-bold text-lg mb-3">Үнийн тооцоолол</h3>
          {priceKRW && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 text-sm">Үндсэн үнэ (₩)</span>
              <span className="text-gray-900 text-sm font-medium">{formatKRW(priceKRW)}</span>
            </div>
          )}
          <p className="text-gray-400 text-xs mt-3">
            ⚠️ Хөдөлгүүрийн мэдээлэл дутуу тул нийт үнэ тооцоологдсонгүй
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-primary w-full mt-4 text-sm">
            📞 Захиалга өгөх
          </button>
        </div>
      </>
    )
  }

  // ENCAR — Бүрэн татварын тооцоолол
  const rows = [
    { label: 'Үндсэн үнэ (₩)', value: formatKRW(pricing.priceKRW) },
    { label: 'Үндсэн үнэ (MNT)', sub: `1₩ = ${pricing.wonToMNT}₮`, value: formatMNT(pricing.basePriceMNT), hint: true },
    { label: 'Монгол үйлчилгээний шимтгэл', value: formatMNT(pricing.mongolServiceFee), hint: true },
    { label: 'Тээврийн зардал', value: formatMNT(pricing.shippingCost), hint: true },
    {
      label: 'Онцгой албан татвар',
      sub: `${pricing.engineCC}cc · ${pricing.carAge} жил · ${pricing.fuelType || 'Бензин/Дизель'}`,
      value: formatMNT(pricing.exciseTax), hint: true,
    },
    {
      label: 'Гаалийн татвар/НӨАТ',
      sub: `Гааль ${pricing.customsDutyRate}% + НӨАТ ${pricing.vatRate}%`,
      value: formatMNT(pricing.totalCustomsAndVAT), hint: true,
    },
  ]

  return (
    <>
      <OrderModal isOpen={modalOpen} onClose={() => setModalOpen(false)} vehicleId={vehicleId} />

      <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
        <h3 className="text-gray-900 font-bold text-base mb-4">Нийт үнийн тооцоолол</h3>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 text-sm">{row.label}</span>
                  {row.hint && (
                    <span className="text-gray-400 text-xs border border-gray-300 rounded-full w-4 h-4 inline-flex items-center justify-center cursor-help flex-shrink-0">?</span>
                  )}
                </div>
                {row.sub && <div className="text-gray-400 text-xs mt-0.5">{row.sub}</div>}
              </div>
              <span className="text-gray-900 text-sm font-semibold whitespace-nowrap">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold text-sm">Нийт дүн</span>
            <span className="text-primary font-bold text-xl">{formatMNT(pricing.totalPriceMNT)}</span>
          </div>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary w-full mt-4 text-sm">
          📞 Захиалга өгөх
        </button>
      </div>
    </>
  )
}