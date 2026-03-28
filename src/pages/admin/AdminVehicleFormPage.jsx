// Файл: frontend/src/pages/admin/AdminVehicleFormPage.jsx
// Үүрэг: Шинэ машин нэмэх эсвэл байгаа машин засах маягт

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Upload, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminCreateVehicle, adminUpdateVehicle, adminGetVehicleById, adminDeleteVehicleImage } from '../../services/vehicleService.js'

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'Other']
const TRANSMISSIONS = ['Automatic', 'Manual']

const EMPTY_FORM = {
  title: '', brand: '', model: '', year: new Date().getFullYear(),
  mileage: '', engineCC: '', fuelType: 'Gasoline', transmission: 'Automatic',
  color: '', priceKRW: '', description: '', location: 'Seoul',
  encarUrl: '', features: '', isActive: true,
}

export default function AdminVehicleFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [existingImages, setExistingImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    if (isEdit) loadVehicle()
  }, [id])

  const loadVehicle = async () => {
    console.log(`✏️  Засах машин ачааллаж байна: ID ${id}`)
    try {
      const data = await adminGetVehicleById(id)
      const v = data.data
      setForm({
        title: v.title || '',
        brand: v.brand || '',
        model: v.model || '',
        year: v.year || new Date().getFullYear(),
        mileage: v.mileage || '',
        engineCC: v.engineCC || '',
        fuelType: v.fuelType || 'Gasoline',
        transmission: v.transmission || 'Automatic',
        color: v.color || '',
        priceKRW: v.priceKRW || '',
        description: v.description || '',
        location: v.location || 'Seoul',
        encarUrl: v.encarUrl || '',
        features: Array.isArray(v.features) ? v.features.join(', ') : '',
        isActive: v.isActive !== false,
      })
      setExistingImages(v.images || [])
      console.log('✅ Машин мэдээлэл ачааллаа:', v.title)
    } catch (err) {
      console.error('❌ Машин ачааллахад алдаа:', err.message)
      toast.error('Машин мэдээлэл татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key, val) => {
    setForm(p => ({ ...p, [key]: val }))
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    setNewFiles(p => [...p, ...files])
    setNewPreviews(p => [...p, ...files.map(f => URL.createObjectURL(f))])
    console.log(`🖼️  ${files.length} зураг нэмэгдлээ`)
  }

  const removeNewFile = (idx) => {
    setNewFiles(p => p.filter((_, i) => i !== idx))
    setNewPreviews(p => p.filter((_, i) => i !== idx))
  }

  const handleDeleteExistingImage = async (img) => {
    if (!confirm('Зургийг устгах уу?')) return
    try {
      await adminDeleteVehicleImage(id, img._id)
      setExistingImages(p => p.filter(i => i._id !== img._id))
      toast.success('Зураг устгалаа')
    } catch (err) {
      toast.error('Зураг устгахад алдаа гарлаа')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!form.title || !form.brand || !form.model || !form.year || !form.engineCC || !form.priceKRW) {
      toast.error('Гарчиг, брэнд, загвар, он, хөдөлгүүр, үнэ заавал шаардлагатай')
      return
    }

    setSubmitting(true)
    console.log(`🚗 Машин ${isEdit ? 'засаж' : 'нэмж'} байна...`)

    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      newFiles.forEach(f => fd.append('images', f))

      if (isEdit) {
        await adminUpdateVehicle(id, fd)
        toast.success('Машин шинэчлэгдлээ!')
        console.log('✅ Машин шинэчлэгдлээ:', form.title)
      } else {
        await adminCreateVehicle(fd)
        toast.success('Машин нэмэгдлээ!')
        console.log('✅ Шинэ машин нэмэгдлээ:', form.title)
      }

      navigate('/admin/vehicles')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Алдаа гарлаа'
      console.error('❌ Машин хадгалахад алдаа:', msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400">Ачааллаж байна...</div>
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Гарчиг */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/vehicles" className="text-gray-400 hover:text-white">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-white font-bold text-xl">
            {isEdit ? 'Машин засах' : 'Шинэ машин нэмэх'}
          </h1>
          <p className="text-gray-400 text-sm">Мэдээллийг бүрэн оруулна уу</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ЗУРАГНУУД */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Зурагнууд</h2>

          {/* Байгаа зурагнууд (edit үед) */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map(img => (
                <div key={img._id} className="relative group">
                  <img src={img.url} alt="" className="w-24 h-18 object-cover rounded border border-white/10" style={{ height: '72px' }} />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img)}
                    className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Шинэ зургуудын preview */}
          {newPreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {newPreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-24 object-cover rounded border border-primary/50" style={{ height: '72px' }} />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload товч */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 border border-dashed border-white/20 hover:border-primary/50 text-gray-400 hover:text-white px-5 py-3 rounded-lg transition-colors text-sm"
          >
            <Upload size={14} />
            Зураг нэмэх (олон зураг сонгож болно)
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </div>

        {/* ҮНДСЭН МЭДЭЭЛЭЛ */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Үндсэн мэдээлэл</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">Гарчиг *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="Жишээ: Mercedes-Benz E250 Exclusive"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Брэнд *</label>
              <input type="text" value={form.brand} onChange={e => handleChange('brand', e.target.value)}
                placeholder="Mercedes-Benz" className="input-field" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Загвар *</label>
              <input type="text" value={form.model} onChange={e => handleChange('model', e.target.value)}
                placeholder="E250 Exclusive" className="input-field" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Үйлдвэрлэсэн он *</label>
              <input type="number" value={form.year} onChange={e => handleChange('year', e.target.value)}
                className="input-field" min="1990" max="2026" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Гүйлт (км)</label>
              <input type="number" value={form.mileage} onChange={e => handleChange('mileage', e.target.value)}
                placeholder="41231" className="input-field" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Хөдөлгүүр (cc) *</label>
              <input type="number" value={form.engineCC} onChange={e => handleChange('engineCC', e.target.value)}
                placeholder="1991" className="input-field" required />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Түлшний төрөл</label>
              <select value={form.fuelType} onChange={e => handleChange('fuelType', e.target.value)} className="input-field">
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Хурдны хайрцаг</label>
              <select value={form.transmission} onChange={e => handleChange('transmission', e.target.value)} className="input-field">
                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Өнгө</label>
              <input type="text" value={form.color} onChange={e => handleChange('color', e.target.value)}
                placeholder="Цагаан" className="input-field" />
            </div>
          </div>
        </div>

        {/* ҮНЭ */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">Үнэ (₩ Солонгос вон)</h2>
          <p className="text-gray-500 text-xs mb-4">
            Вон дахь үнийг оруулна. MNT-руу хөрвүүлэх болон татвар автоматаар тооцоологдоно.
          </p>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Солонгос дахь үнэ (₩) *</label>
            <input
              type="number"
              value={form.priceKRW}
              onChange={e => handleChange('priceKRW', e.target.value)}
              placeholder="45700000"
              className="input-field max-w-xs"
              required
            />
            {form.priceKRW && (
              <p className="text-gray-500 text-xs mt-1">
                ≈ {(form.priceKRW * 2.43).toLocaleString()}₮ (ханшаар тооцвол)
              </p>
            )}
          </div>
        </div>

        {/* НЭМЭЛТ */}
        <div className="bg-dark-card border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Нэмэлт мэдээлэл</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Тайлбар</label>
              <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
                rows={3} placeholder="Машины дэлгэрэнгүй тайлбар..." className="input-field resize-none" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Онцлог (таслалаар тусгаарлана)</label>
              <input type="text" value={form.features} onChange={e => handleChange('features', e.target.value)}
                placeholder="Leather Seats, Navigation, Sunroof" className="input-field" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Encar холбоос</label>
              <input type="text" value={form.encarUrl} onChange={e => handleChange('encarUrl', e.target.value)}
                placeholder="https://www.encar.com/..." className="input-field" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Нийтлэх:</label>
              <button
                type="button"
                onClick={() => handleChange('isActive', !form.isActive)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isActive ? 'bg-primary' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-white text-sm">{form.isActive ? 'Нийтлэгдсэн' : 'Нуусан'}</span>
            </div>
          </div>
        </div>

        {/* Товчнууд */}
        <div className="flex justify-end gap-3">
          <Link to="/admin/vehicles" className="btn-secondary px-6">Цуцлах</Link>
          <button type="submit" disabled={submitting} className="btn-primary px-8 disabled:opacity-50">
            {submitting
              ? (isEdit ? 'Хадгалж байна...' : 'Нэмж байна...')
              : (isEdit ? 'Хадгалах' : 'Машин нэмэх')
            }
          </button>
        </div>
      </form>
    </div>
  )
}