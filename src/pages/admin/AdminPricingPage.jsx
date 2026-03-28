// Файл: frontend/src/pages/admin/AdminPricingPage.jsx
// Үүрэг: Валютын ханш (1₩ = ?₮) болон тээврийн зардалын тохиргоо
// Admin panel-аас гараар оруулна, автоматаар тооцоолол өөрчлөгдөнө

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getPricingConfig, updatePricingConfig, testPriceCalculation } from '../../services/adminService.js'
import { formatMNT, formatKRW } from '../../utils/formatters.js'

export default function AdminPricingPage() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Тест тооцоолол
  const [testInput, setTestInput] = useState({ priceKRW: '', year: '', engineCC: '' })
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => { loadConfig() }, [])

  const loadConfig = async () => {
    console.log('⚙️  PricingConfig ачааллаж байна...')
    try {
      const data = await getPricingConfig()
      setConfig(data.data)
      console.log('✅ PricingConfig ачааллаа:', data.data)
    } catch (err) {
      console.error('❌ PricingConfig ачааллахад алдаа:', err.message)
      toast.error('Тохиргоо татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return
    if (!config.wonToMNT || config.wonToMNT <= 0) {
      toast.error('Валютын ханш 0-ээс их байх ёстой')
      return
    }

    setSaving(true)
    console.log(`💾 PricingConfig хадгалж байна: 1₩ = ${config.wonToMNT}₮`)
    try {
      await updatePricingConfig({
        wonToMNT: Number(config.wonToMNT),
        mongolServiceFee: Number(config.mongolServiceFee),
        shippingCosts: {
          small: Number(config.shippingCosts.small),
          medium: Number(config.shippingCosts.medium),
          large: Number(config.shippingCosts.large),
          xlarge: Number(config.shippingCosts.xlarge),
        },
        customsDutyRate: Number(config.customsDutyRate),
        vatRate: Number(config.vatRate),
      })
      toast.success('Тохиргоо хадгалагдлаа!')
      console.log('✅ PricingConfig хадгалагдлаа')
    } catch (err) {
      console.error('❌ Хадгалахад алдаа:', err.message)
      toast.error('Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  const handleTestCalc = async () => {
    if (!testInput.priceKRW || !testInput.year || !testInput.engineCC) {
      toast.error('Бүх утгыг оруулна уу')
      return
    }
    setTesting(true)
    console.log('🧮 Тест тооцоолол хийж байна...', testInput)
    try {
      const data = await testPriceCalculation({
        priceKRW: Number(testInput.priceKRW),
        year: Number(testInput.year),
        engineCC: Number(testInput.engineCC),
      })
      setTestResult(data.data)
      console.log('✅ Тест тооцоолол амжилттай:', data.data)
    } catch (err) {
      console.error('❌ Тест тооцоолол алдаа:', err.message)
      toast.error('Тооцоолоход алдаа гарлаа')
    } finally {
      setTesting(false)
    }
  }

  const updateConfig = (key, val) => setConfig(p => ({ ...p, [key]: val }))
  const updateShipping = (key, val) => setConfig(p => ({
    ...p, shippingCosts: { ...p.shippingCosts, [key]: val }
  }))

  if (loading) return <div className="p-8 text-gray-400">Ачааллаж байна...</div>
  if (!config) return <div className="p-8 text-gray-400">Тохиргоо татаж чадсангүй</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-white font-bold text-xl">Валютын ханш & Тохиргоо</h1>
        <p className="text-gray-400 text-sm mt-1">
          Энд оруулсан утгуудаар машины нийт үнэ автоматаар тооцоологдоно
        </p>
      </div>

      {/* ВАЛЮТЫН ХАНШ */}
      <div className="bg-dark-card border border-white/10 rounded-xl p-6 mb-5">
        <h2 className="text-white font-semibold mb-1">Валютын ханш</h2>
        <p className="text-gray-500 text-xs mb-4">
          ⚠️ Энэ утгыг өдөр бүр шинэчилнэ. Ханш өөрчлөгдөхөд бүх машины үнэ автоматаар шинэчлэгдэнэ.
        </p>
        <div className="flex items-end gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">1 ₩ (KRW) = ? ₮ (MNT)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                value={config.wonToMNT}
                onChange={e => updateConfig('wonToMNT', e.target.value)}
                className="input-field w-36"
                min="0.01"
              />
              <span className="text-gray-400 text-sm">₮</span>
            </div>
          </div>
          <div className="bg-dark-secondary px-4 py-2.5 rounded text-sm text-gray-300">
            1,000,000₩ = {(1000000 * Number(config.wonToMNT)).toLocaleString()}₮
          </div>
        </div>
      </div>

      {/* ТОГТМОЛ ЗАРДЛУУД */}
      <div className="bg-dark-card border border-white/10 rounded-xl p-6 mb-5">
        <h2 className="text-white font-semibold mb-4">Тогтмол зардлууд (₮)</h2>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Монгол үйлчилгээний шимтгэл
              <span className="text-gray-600 ml-2 text-xs">Бүх машинд нэг адил нэмэгдэнэ</span>
            </label>
            <input
              type="number"
              value={config.mongolServiceFee}
              onChange={e => updateConfig('mongolServiceFee', e.target.value)}
              className="input-field max-w-xs"
            />
            <p className="text-gray-600 text-xs mt-0.5">{formatMNT(config.mongolServiceFee)}</p>
          </div>
        </div>
      </div>

      {/* ТЭЭВРИЙН ЗАРДАЛ */}
      <div className="bg-dark-card border border-white/10 rounded-xl p-6 mb-5">
        <h2 className="text-white font-semibold mb-1">Тээврийн зардал (₮)</h2>
        <p className="text-gray-500 text-xs mb-4">Хөдөлгүүрийн хэмжээгээр тээврийн зардал өөрчлөгдөнө</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'small', label: '1500cc ба доош (Жижиг)' },
            { key: 'medium', label: '1501–2500cc (Дунд)' },
            { key: 'large', label: '2501–3500cc (Том)' },
            { key: 'xlarge', label: '3501cc+ (Маш том)' },
          ].map(item => (
            <div key={item.key}>
              <label className="text-gray-400 text-xs mb-1 block">{item.label}</label>
              <input
                type="number"
                value={config.shippingCosts[item.key]}
                onChange={e => updateShipping(item.key, e.target.value)}
                className="input-field"
              />
              <p className="text-gray-600 text-xs mt-0.5">{formatMNT(config.shippingCosts[item.key])}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ГААЛИЙН ТАТВАР */}
      <div className="bg-dark-card border border-white/10 rounded-xl p-6 mb-5">
        <h2 className="text-white font-semibold mb-4">Гаалийн татварын хувь</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Гаалийн татвар (%)</label>
            <input type="number" step="0.1" value={config.customsDutyRate}
              onChange={e => updateConfig('customsDutyRate', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">НӨАТ (%)</label>
            <input type="number" step="0.1" value={config.vatRate}
              onChange={e => updateConfig('vatRate', e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Хадгалах */}
      <div className="flex justify-end mb-8">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8 disabled:opacity-50">
          {saving ? 'Хадгалж байна...' : '💾 Хадгалах'}
        </button>
      </div>

      {/* ТЕСТ ТООЦООЛОЛ */}
      <div className="bg-dark-card border border-primary/20 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-1">🧮 Тест тооцоолол</h2>
        <p className="text-gray-500 text-xs mb-4">Одоогийн тохиргоогоор тооцоолол хийж шалгана</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Үнэ (₩)</label>
            <input type="number" value={testInput.priceKRW}
              onChange={e => setTestInput(p => ({ ...p, priceKRW: e.target.value }))}
              placeholder="45700000" className="input-field text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Он</label>
            <input type="number" value={testInput.year}
              onChange={e => setTestInput(p => ({ ...p, year: e.target.value }))}
              placeholder="2022" className="input-field text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1 block">Хөдөлгүүр (cc)</label>
            <input type="number" value={testInput.engineCC}
              onChange={e => setTestInput(p => ({ ...p, engineCC: e.target.value }))}
              placeholder="1991" className="input-field text-sm" />
          </div>
        </div>
        <button onClick={handleTestCalc} disabled={testing} className="btn-primary text-sm disabled:opacity-50">
          {testing ? 'Тооцоолж байна...' : 'Тооцоолох'}
        </button>

        {testResult && (
          <div className="mt-4 bg-dark-secondary rounded-lg p-4 text-sm space-y-1.5">
            {[
              ['Үндсэн үнэ (MNT)', formatMNT(testResult.basePriceMNT)],
              ['Монгол үйлчилгээ', formatMNT(testResult.mongolServiceFee)],
              ['Тээврийн зардал', formatMNT(testResult.shippingCost)],
              ['Онцгой татвар', formatMNT(testResult.exciseTax)],
              [`Гаалийн татвар/НӨАТ`, formatMNT(testResult.totalCustomsAndVAT)],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-400">{label}:</span>
                <span className="text-white">{val}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
              <span className="text-white">НИЙТ ДҮН:</span>
              <span className="text-primary text-base">{formatMNT(testResult.totalPriceMNT)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}