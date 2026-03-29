// Файл: frontend/src/components/PricingBreakdown.jsx
// Image 3-ийн дагуу үнийн дэлгэрэнгүй харуулах

import { formatMNT, formatKRW } from '../utils/formatters.js'

export default function PricingBreakdown({ pricing, priceKRW }) {
  if (!pricing) {
    return (
      <div className="bg-dark-card border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-3">Үнийн тооцоолол</h3>
        {priceKRW && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-400 text-sm">Үндсэн үнэ (₩)</span>
            <span className="text-white text-sm font-medium">{formatKRW(priceKRW)}</span>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-3">
          ⚠️ Хөдөлгүүрийн мэдээлэл дутуу тул нийт үнэ тооцоологдсонгүй
        </p>
      </div>
    )
  }

  // Image 3-ийн дарааллаар мөрүүд
  const rows = [
    {
      label: 'Үндсэн үнэ (₩)',
      sub: null,
      value: formatKRW(pricing.priceKRW),
      valueClass: 'text-white',
    },
    {
      label: `Үндсэн үнэ (MNT)`,
      sub: `1₩ = ${pricing.wonToMNT}₮`,
      value: formatMNT(pricing.basePriceMNT),
      valueClass: 'text-white',
      hint: '?',
    },
    {
      label: 'Монгол үйлчилгээний шимтгэл',
      sub: null,
      value: formatMNT(pricing.mongolServiceFee),
      valueClass: 'text-white',
      hint: '?',
    },
    {
      label: 'Тээврийн зардал',
      sub: null,
      value: formatMNT(pricing.shippingCost),
      valueClass: 'text-white',
      hint: '?',
    },
    {
      label: 'Онцгой албан татвар',
      sub: `${pricing.engineCC}cc · ${pricing.carAge} жил · ${pricing.fuelType || 'Бензин/Дизель'}`,
      value: formatMNT(pricing.exciseTax),
      valueClass: 'text-white',
      hint: '?',
    },
    {
      label: 'Гаалийн татвар/НӨАТ',
      sub: `Гааль ${pricing.customsDutyRate}% + НӨАТ ${pricing.vatRate}%`,
      value: formatMNT(pricing.totalCustomsAndVAT),
      valueClass: 'text-white',
      hint: '?',
    },
  ]

  return (
    <div className="bg-dark-card border border-white/10 rounded-xl p-5 sticky top-20">
      <h3 className="text-white font-bold text-base mb-1">VIN:</h3>

      {/* VIN хэсэг байгаа бол */}
      <div className="mb-4">
        <p className="text-gray-500 text-xs">Машины VIN дугаар байгаа бол энд харагдана</p>
      </div>

      {/* Үнийн дэлгэрэнгүй — Image 3 загвараар */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between items-start gap-3">
            <div className="flex items-start gap-1 min-w-0">
              <div>
                <span className="text-gray-300 text-sm">{row.label}</span>
                {row.hint && (
                  <span className="ml-1 text-gray-600 text-xs border border-gray-600 rounded-full w-4 h-4 inline-flex items-center justify-center cursor-help">?</span>
                )}
                {row.sub && (
                  <div className="text-gray-500 text-xs mt-0.5">{row.sub}</div>
                )}
              </div>
            </div>
            <span className={`${row.valueClass} text-sm font-semibold whitespace-nowrap`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Нийт дүн */}
      <div className="border-t border-white/10 mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-sm">Нийт дүн</span>
          <span className="text-primary font-bold text-xl">{formatMNT(pricing.totalPriceMNT)}</span>
        </div>
      </div>

      {/* Урьдчилгаа / Үлдэгдэл */}
      <div className="mt-3 bg-dark-secondary rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Урьдчилгаа (85%)</span>
          <span className="text-white font-semibold">{formatMNT(pricing.advancePaymentMNT)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Үлдэгдэл (15%)</span>
          <span className="text-white font-semibold">{formatMNT(pricing.remainingPaymentMNT)}</span>
        </div>
      </div>

      <button className="btn-primary w-full mt-4 text-sm">
        📞 Захиалга өгөх
      </button>
    </div>
  )
}