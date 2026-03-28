// Файл: frontend/src/components/PricingBreakdown.jsx
import { formatMNT, formatKRW } from '../utils/formatters.js'

export default function PricingBreakdown({ pricing, priceKRW }) {
  if (!pricing) {
    return (
      <div className="bg-dark-card border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-2">Үнийн тооцоолол</h3>
        {priceKRW && (
          <p className="text-gray-400 text-sm">Солонгос дахь үнэ: <span className="text-white font-semibold">{formatKRW(priceKRW)}</span></p>
        )}
        <p className="text-gray-500 text-xs mt-3">Нийт үнийн тооцоолол боломжгүй байна</p>
      </div>
    )
  }

  const rows = [
    { label: 'Солонгос дахь үнэ', value: formatKRW(pricing.priceKRW), highlight: false },
    { label: `Үндсэн үнэ (1₩=${pricing.wonToMNT}₮)`, value: formatMNT(pricing.basePriceMNT), highlight: false },
    { label: 'Монгол үйлчилгээний шимтгэл', value: formatMNT(pricing.mongolServiceFee), highlight: false },
    { label: 'Тээврийн зардал', value: formatMNT(pricing.shippingCost), highlight: false },
    { label: `Онцгой татвар (${pricing.carAge} жил)`, value: formatMNT(pricing.exciseTax), highlight: false },
    { label: `Гаалийн татвар/НӨАТ`, value: formatMNT(pricing.totalCustomsAndVAT), highlight: false },
  ]

  return (
    <div className="bg-dark-card border border-white/10 rounded-xl p-6 sticky top-20">
      <h3 className="text-white font-bold text-lg mb-4">Үнийн тооцоолол</h3>

      <div className="space-y-2.5 mb-4">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between items-start gap-2">
            <span className="text-gray-400 text-xs leading-relaxed">{row.label}</span>
            <span className="text-white text-xs font-medium whitespace-nowrap">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">НИЙТ ДҮН:</span>
          <span className="text-primary font-bold text-xl">{formatMNT(pricing.totalPriceMNT)}</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Машины нас: {pricing.carAge} жил · {pricing.engineCC}cc
        </p>
      </div>

      {/* Урьдчилгаа */}
      <div className="mt-4 bg-dark-secondary rounded-lg p-4">
        <div className="flex justify-between text-sm mb-1">
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