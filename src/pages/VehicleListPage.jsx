// Файл: frontend/src/pages/VehicleListPage.jsx
// Үүрэг: Encar машинуудын жагсаалт, шүүлтүүр, хайлт

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, ChevronDown, Filter } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEncarVehicles, getManualVehicles } from '../services/vehicleService.js'

const BRANDS = ['Kia', 'Hyundai', 'Mercedes-Benz', 'BMW', 'Genesis', 'Chevrolet',
  'Renault', 'Audi', 'Porsche', 'Mini', 'Land Rover', 'Volvo', 'Lexus', 'Toyota',
  'Ford', 'Jeep', 'Tesla']

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid']

export default function VehicleListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [manualVehicles, setManualVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const LIMIT = 20

  // Шүүлтүүр state
  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    year_min: searchParams.get('year_min') || '',
    year_max: searchParams.get('year_max') || '',
    price_min: searchParams.get('price_min') || '',
    price_max: searchParams.get('price_max') || '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const loadVehicles = useCallback(async (newOffset = 0) => {
    setLoading(true)
    console.log('🔍 Машин жагсаалт ачааллаж байна...', filters)
    try {
      const params = {
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
        limit: LIMIT,
        offset: newOffset,
      }

      const [encarRes, manualRes] = await Promise.allSettled([
        getEncarVehicles(params),
        getManualVehicles({ brand: filters.brand, limit: 6 }),
      ])

      if (encarRes.status === 'fulfilled') {
        const data = encarRes.value
        setVehicles(data.data || [])
        setTotal(data.total || 0)
        console.log(`✅ ${data.data?.length} машин ачааллаа (Нийт: ${data.total})`)
      } else {
        console.error('❌ Encar машин ачааллахад алдаа:', encarRes.reason?.message)
        setVehicles([])
      }

      if (manualRes.status === 'fulfilled') {
        setManualVehicles(manualRes.value.data || [])
      }
    } catch (err) {
      console.error('❌ Машин ачааллахад алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    setOffset(0)
    loadVehicles(0)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // URL params шинэчлэх
    const newParams = { ...filters, [key]: value }
    setSearchParams(Object.fromEntries(Object.entries(newParams).filter(([, v]) => v !== '')))
  }

  const clearFilters = () => {
    setFilters({ brand: '', model: '', year_min: '', year_max: '', price_min: '', price_max: '' })
    setSearchParams({})
  }

  const loadMore = () => {
    const newOffset = offset + LIMIT
    setOffset(newOffset)
    loadVehicles(newOffset)
  }

  const hasMore = offset + LIMIT < total

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Гарчиг */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-white font-bold text-2xl">
              {filters.brand ? `${filters.brand} машинууд` : 'Бүх машинууд'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Нийт <span className="text-white font-medium">{total.toLocaleString()}</span> машин олдлоо
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-gray-300 px-4 py-2 rounded text-sm transition-colors"
          >
            <Filter size={14} />
            Шүүлтүүр
            {Object.values(filters).some(v => v !== '') && (
              <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Шүүлтүүр хэсэг */}
        {showFilters && (
          <div className="bg-dark-card border border-white/10 rounded-lg p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Брэнд */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Брэнд</label>
                <select
                  value={filters.brand}
                  onChange={e => handleFilterChange('brand', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Бүгд</option>
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Загвар */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Загвар</label>
                <input
                  type="text"
                  placeholder="Жишээ: Tucson"
                  value={filters.model}
                  onChange={e => handleFilterChange('model', e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Он (min) */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Он (эхлэх)</label>
                <input
                  type="number"
                  placeholder="2018"
                  value={filters.year_min}
                  onChange={e => handleFilterChange('year_min', e.target.value)}
                  className="input-field text-sm"
                  min="2000" max="2025"
                />
              </div>

              {/* Он (max) */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Он (дуусах)</label>
                <input
                  type="number"
                  placeholder="2024"
                  value={filters.year_max}
                  onChange={e => handleFilterChange('year_max', e.target.value)}
                  className="input-field text-sm"
                  min="2000" max="2025"
                />
              </div>

              {/* Үнэ min */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Үнэ min (₩)</label>
                <input
                  type="number"
                  placeholder="10000000"
                  value={filters.price_min}
                  onChange={e => handleFilterChange('price_min', e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Үнэ max */}
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Үнэ max (₩)</label>
                <input
                  type="number"
                  placeholder="100000000"
                  value={filters.price_max}
                  onChange={e => handleFilterChange('price_max', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white transition-colors">
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
          </div>
        )}

        {/* Идэвхтэй шүүлтүүрийн tag-ууд */}
        {Object.entries(filters).some(([, v]) => v !== '') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).filter(([, v]) => v !== '').map(([key, val]) => (
              <span
                key={key}
                className="flex items-center gap-1 bg-primary/20 text-primary text-xs px-3 py-1 rounded-full"
              >
                {key}: {val}
                <button onClick={() => handleFilterChange(key, '')} className="hover:text-white ml-1">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Admin гараар нэмсэн машинууд (жагсаалтын дээр) */}
        {manualVehicles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="badge-red">МАНАЙ</span>
              Санал болгох машинууд
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {manualVehicles.map(v => (
                <VehicleCard key={v._id} vehicle={v} type="manual" />
              ))}
            </div>
            <div className="border-t border-white/10 mt-6 mb-2" />
          </div>
        )}

        {/* Encar машинуудын жагсаалт */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
          <span>Encar.com-оос</span>
          <span className="w-4 h-px bg-gray-700" />
          <span>{total.toLocaleString()} машин</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Солонгосоос машин хайж байна..." />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>Машин олдсонгүй. Шүүлтүүрийг өөрчилж үзнэ үү.</p>
            <button onClick={clearFilters} className="mt-4 btn-primary text-sm">
              Шүүлтүүр цэвэрлэх
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vehicles.map((v, i) => (
                <VehicleCard key={v.id || i} vehicle={v} type="encar" />
              ))}
            </div>

            {/* Цааш ачаалах */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary px-10"
                >
                  Цааш харах ({total - offset - LIMIT > 0 ? total - offset - LIMIT : 0} машин үлдсэн)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}