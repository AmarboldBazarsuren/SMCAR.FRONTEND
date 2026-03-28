// Файл: frontend/src/pages/admin/AdminTaxPage.jsx
// Үүрэг: Онцгой албан татварын хүснэгтийг admin-аас засах
// Хөдөлгүүрийн хэмжээ × Машины нас → Татварын дүн

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getTaxConfig, updateTaxConfig } from '../../services/adminService.js'
import { formatMNT } from '../../utils/formatters.js'

const AGE_LABELS = ['0–3 жил', '4–6 жил', '7–9 жил', '10+ жил']
const AGE_KEYS = ['tax0to3', 'tax4to6', 'tax7to9', 'tax10plus']

export default function AdminTaxPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadTaxConfig() }, [])

  const loadTaxConfig = async () => {
    console.log('📋 TaxConfig ачааллаж байна...')
    try {
      const data = await getTaxConfig()
      setEntries(data.data?.entries || [])
      console.log(`✅ ${data.data?.entries?.length} татварын мөр ачааллаа`)
    } catch (err) {
      console.error('❌ TaxConfig ачааллахад алдаа:', err.message)
      toast.error('Татварын тохиргоо татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  const updateEntry = (idx, key, val) => {
    setEntries(p => p.map((e, i) => i === idx ? { ...e, [key]: val } : e))
  }

  const handleSave = async () => {
    setSaving(true)
    console.log('💾 TaxConfig хадгалж байна...')
    try {
      // Тоон утгуудыг Number болгох
      const cleaned = entries.map(e => ({
        ...e,
        engineMin: Number(e.engineMin),
        engineMax: Number(e.engineMax),
        tax0to3: Number(e.tax0to3),
        tax4to6: Number(e.tax4to6),
        tax7to9: Number(e.tax7to9),
        tax10plus: Number(e.tax10plus),
      }))
      await updateTaxConfig({ entries: cleaned })
      toast.success('Татварын хүснэгт хадгалагдлаа!')
      console.log('✅ TaxConfig хадгалагдлаа')
    } catch (err) {
      console.error('❌ TaxConfig хадгалахад алдаа:', err.message)
      toast.error('Хадгалахад алдаа гарлаа')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">Ачааллаж байна...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white font-bold text-xl">Онцгой албан татварын хүснэгт</h1>
        <p className="text-gray-400 text-sm mt-1">
          Хөдөлгүүрийн хэмжээ болон машины насаар татварын дүн тооцоологдоно.
          Энд оруулсан утгуудаар автоматаар тооцоолно.
        </p>
      </div>

      {/* Хүснэгт */}
      <div className="bg-dark-card border border-white/10 rounded-xl overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark-secondary border-b border-white/10">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Хөдөлгүүрийн хэмжээ</th>
              {AGE_LABELS.map(label => (
                <th key={label} className="text-left px-4 py-3 text-gray-400 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry, idx) => (
              <tr key={idx} className="table-row-hover">
                {/* Хөдөлгүүрийн нэр */}
                <td className="px-5 py-4">
                  <div className="text-white font-medium text-sm">{entry.engineLabel}</div>
                  <div className="text-gray-500 text-xs">{entry.engineMin}–{entry.engineMax === 999999 ? '∞' : entry.engineMax} cc</div>
                </td>

                {/* Татварын утгуудыг засах input */}
                {AGE_KEYS.map(key => (
                  <td key={key} className="px-4 py-4">
                    <input
                      type="number"
                      value={entry[key]}
                      onChange={e => updateEntry(idx, key, e.target.value)}
                      className="input-field text-sm w-32"
                      min="0"
                    />
                    <div className="text-gray-600 text-xs mt-0.5">{formatMNT(entry[key])}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Тайлбар */}
      <div className="bg-dark-secondary border border-white/5 rounded-lg p-4 mb-6 text-sm text-gray-400">
        <p className="font-medium text-white mb-2">📋 Хэрхэн тооцоологддог вэ?</p>
        <ul className="space-y-1">
          <li>• Машины хөдөлгүүрийн cc болон одоогоос хэдэн жилийн өмнөх гэдгийг тодорхойлно</li>
          <li>• Хүснэгтэд тохирох нүднээс татварын дүнг авна</li>
          <li>• Энэ дүн нь нийт үнийн тооцооллын хэсэг болно</li>
          <li>• Жишээ: 2022 оны 1991cc машин → 0–3 жил, 1501–2500cc нүд → ₮2,300,000</li>
        </ul>
      </div>

      {/* Хадгалах */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8 disabled:opacity-50">
          {saving ? 'Хадгалж байна...' : '💾 Татварын хүснэгт хадгалах'}
        </button>
      </div>
    </div>
  )
}