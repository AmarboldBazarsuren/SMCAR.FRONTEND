// Файл: frontend/src/pages/admin/AdminBannersPage.jsx
// Үүрэг: Нүүр хуудасны banner зураг нэмэх, засах, устгах

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from '../../services/adminService.js'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editBanner, setEditBanner] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({ title: '', linkUrl: '', description: '', order: '0' })
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const fileRef = useRef()

  useEffect(() => { loadBanners() }, [])

  const loadBanners = async () => {
    console.log('📋 Banner жагсаалт ачааллаж байна...')
    try {
      const data = await adminGetBanners()
      setBanners(data.data || [])
      console.log(`✅ ${data.count} banner ачааллаа`)
    } catch (err) {
      console.error('❌ Banner ачааллахад алдаа:', err.message)
      toast.error('Banner жагсаалт татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setImgPreview(URL.createObjectURL(file))
    console.log(`🖼️  Зураг сонгогдлоо: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`)
  }

  const openCreate = () => {
    setEditBanner(null)
    setForm({ title: '', linkUrl: '', description: '', order: '0' })
    setImgFile(null)
    setImgPreview(null)
    setShowForm(true)
  }

  const openEdit = (banner) => {
    setEditBanner(banner)
    setForm({
      title: banner.title,
      linkUrl: banner.linkUrl || '',
      description: banner.description || '',
      order: String(banner.order || 0),
    })
    setImgPreview(banner.imageUrl)
    setImgFile(null)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Гарчиг оруулна уу'); return }
    if (!editBanner && !imgFile) { toast.error('Зураг оруулна уу'); return }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('linkUrl', form.linkUrl)
      fd.append('description', form.description)
      fd.append('order', form.order)
      if (imgFile) fd.append('image', imgFile)

      if (editBanner) {
        await adminUpdateBanner(editBanner._id, fd)
        toast.success('Banner шинэчлэгдлээ!')
        console.log('✅ Banner шинэчлэгдлээ:', form.title)
      } else {
        await adminCreateBanner(fd)
        toast.success('Banner нэмэгдлээ!')
        console.log('✅ Шинэ banner нэмэгдлээ:', form.title)
      }

      setShowForm(false)
      loadBanners()
    } catch (err) {
      const msg = err?.response?.data?.message || 'Алдаа гарлаа'
      console.error('❌ Banner хадгалахад алдаа:', msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (banner) => {
    if (!confirm(`"${banner.title}" banner-г устгах уу?`)) return
    try {
      await adminDeleteBanner(banner._id)
      toast.success('Banner устгалаа')
      console.log('✅ Banner устгалаа:', banner.title)
      loadBanners()
    } catch (err) {
      console.error('❌ Banner устгахад алдаа:', err.message)
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="p-8">
      {/* Гарчиг */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Banner зургууд</h1>
          <p className="text-gray-400 text-sm mt-0.5">Нүүр хуудасны том зургуудыг энд удирдана</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={14} />
          Banner нэмэх
        </button>
      </div>

      {/* Banner нэмэх / засах маягт */}
      {showForm && (
        <div className="bg-dark-card border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white font-semibold">
              {editBanner ? 'Banner засах' : 'Шинэ banner нэмэх'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Зүүн: Зураг upload */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Banner зураг {editBanner ? '(солихгүй бол хоосон орхино)' : '*'}
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-primary/50 rounded-lg overflow-hidden cursor-pointer transition-colors"
                  style={{ minHeight: '180px' }}
                >
                  {imgPreview ? (
                    <img src={imgPreview} alt="preview" className="w-full h-44 object-cover" />
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center text-gray-500 gap-2">
                      <Upload size={24} />
                      <span className="text-sm">Зураг сонгоно уу</span>
                      <span className="text-xs">JPG, PNG, WEBP (5MB хүртэл)</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {/* Баруун: Мэдээлэл */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Гарчиг *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Жишээ: Зуны урамшуулал"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Холбоос (дарахад явах)</label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={e => setForm(p => ({ ...p, linkUrl: e.target.value }))}
                    placeholder="/vehicles?brand=BMW"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Дараалал (жижиг = эхэнд)</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Тайлбар</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Banner-ийн тайлбар..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm px-5 py-2">
                Цуцлах
              </button>
              <button type="submit" disabled={submitting} className="btn-primary text-sm px-6 py-2 disabled:opacity-50">
                {submitting ? 'Хадгалж байна...' : editBanner ? 'Хадгалах' : 'Нэмэх'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner жагсаалт */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Ачааллаж байна...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-dark-card rounded-xl border border-white/5">
          <div className="text-4xl mb-3">🖼️</div>
          <p>Banner байхгүй байна</p>
          <button onClick={openCreate} className="btn-primary text-sm mt-4">
            Эхний banner нэмэх
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(banner => (
            <div key={banner._id} className="bg-dark-card border border-white/10 rounded-xl overflow-hidden">
              <div className="aspect-[3/1] relative">
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded font-medium ${
                  banner.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {banner.isActive ? 'Идэвхтэй' : 'Нуусан'}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-white font-medium text-sm">{banner.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Дараалал: {banner.order}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(banner)}
                    className="text-gray-400 hover:text-white text-xs border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
                  >
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="text-gray-400 hover:text-primary text-xs border border-white/10 hover:border-primary/30 px-3 py-1.5 rounded transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}