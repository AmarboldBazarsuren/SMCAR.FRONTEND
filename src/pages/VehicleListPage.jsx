// Файл: frontend/src/pages/VehicleListPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getEncarVehicles, getManualVehicles } from '../services/vehicleService.js'

const MANUFACTURERS = [
  'Hyundai', 'Kia', 'Genesis', 'Chevrolet', 'Renault',
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche',
  'Toyota', 'Honda', 'Lexus', 'Land Rover', 'Volvo',
  'Ford', 'Jeep', 'Mini',
]

const FUEL_OPTIONS = [
  { value: '가솔린', label: 'Бензин' },
  { value: '디젤',  label: 'Дизель' },
  { value: '전기',  label: 'Цахилгаан' },
  { value: '하이브리드', label: 'Хосолмол (Гибрид)' },
]

export default function VehicleListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [manualVehicles, setManualVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const LIMIT = 20

  const [filters, setFilters] = useState({
    manufacturer: searchParams.get('manufacturer') || searchParams.get('brand') || '',
    modelGroup: searchParams.get('modelGroup') || searchParams.get('model') || '',
    year_min: searchParams.get('year_min') || '',
    year_max: searchParams.get('year_max') || '',
    fuelType: searchParams.get('fuelType') || '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const loadVehicles = useCallback(async (newOffset = 0) => {
    setLoading(true)
    try {
      const params = {
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')),
        limit: LIMIT,
        offset: newOffset,
      }

      const [encarRes, manualRes] = await Promise.allSettled([
        getEncarVehicles(params),
        getManualVehicles({ brand: filters.manufacturer, limit: 4 }),
      ])

      if (encarRes.status === 'fulfilled') {
        const data = encarRes.value
        if (newOffset === 0) setVehicles(data.data || [])
        else setVehicles(prev => [...prev, ...(data.data || [])])
        setTotal(data.total || 0)
      } else {
        if (newOffset === 0) setVehicles([])
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
    const newParams = { ...filters, [key]: value }
    setSearchParams(Object.fromEntries(Object.entries(newParams).filter(([, v]) => v !== '')))
  }

  const clearFilters = () => {
    setFilters({ manufacturer: '', modelGroup: '', year_min: '', year_max: '', fuelType: '' })
    setSearchParams({})
  }

  const loadMore = () => {
    const newOffset = offset + LIMIT
    setOffset(newOffset)
    loadVehicles(newOffset)
  }

  const hasMore = offset + LIMIT < total
  const activeFilterCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Гарчиг */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-gray-900 font-bold text-2xl">
              {filters.manufacturer ? `${filters.manufacturer} машинууд` : 'Бүх машинууд'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Нийт <span className="text-gray-900 font-medium">{total.toLocaleString()}</span> машин
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-500 text-gray-600 px-4 py-2 rounded text-sm transition-colors bg-white"
          >
            <Filter size={14} />
            Шүүлтүүр
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Шүүлтүүр */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Үйлдвэрлэгч</label>
                <select
                  value={filters.manufacturer}
                  onChange={e => handleFilterChange('manufacturer', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Бүгд</option>
                  {MANUFACTURERS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Загвар</label>
                <input
                  type="text"
                  placeholder="Жишээ: Tucson"
                  value={filters.modelGroup}
                  onChange={e => handleFilterChange('modelGroup', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Он (эхлэх)</label>
                <input type="number" placeholder="2018" value={filters.year_min}
                  onChange={e => handleFilterChange('year_min', e.target.value)}
                  className="input-field text-sm" min="2000" max="2026" />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Он (дуусах)</label>
                <input type="number" placeholder="2024" value={filters.year_max}
                  onChange={e => handleFilterChange('year_max', e.target.value)}
                  className="input-field text-sm" min="2000" max="2026" />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Түлшний төрөл</label>
                <select value={filters.fuelType}
                  onChange={e => handleFilterChange('fuelType', e.target.value)}
                  className="input-field text-sm">
                  <option value="">Бүгд</option>
                  {FUEL_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
          </div>
        )}

        {/* Идэвхтэй шүүлтүүрийн tag-ууд */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).filter(([, v]) => v !== '').map(([key, val]) => {
              const displayVal = key === 'fuelType'
                ? (FUEL_OPTIONS.find(f => f.value === val)?.label || val)
                : val
              return (
                <span key={key} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">
                  {displayVal}
                  <button onClick={() => handleFilterChange(key, '')} className="hover:text-primary/70 ml-1">×</button>
                </span>
              )
            })}
          </div>
        )}

        {/* Admin гараар нэмсэн машинууд */}
        {manualVehicles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-gray-900 font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="badge-red">МАНАЙ</span>
              Санал болгох машинууд
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {manualVehicles.map(v => (
                <VehicleCard key={v._id} vehicle={v} type="manual" />
              ))}
            </div>
            <div className="border-t border-gray-200 mt-6 mb-2" />
          </div>
        )}

        {/* Encar машинуудын жагсаалт */}
        <div className="mb-4 text-sm text-gray-500">
          Encar.com-оос · {total.toLocaleString()} машин
        </div>

        {loading && vehicles.length === 0 ? (
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

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-secondary px-10 disabled:opacity-50"
                >
                  {loading ? 'Ачааллаж байна...' : `Цааш харах (${total - offset - vehicles.length} машин үлдсэн)`}
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