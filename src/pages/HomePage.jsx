// Файл: frontend/src/pages/HomePage.jsx
// Үүрэг: Нүүр хуудас
//
// Өөрчлөлт:
// 1. Брэнд дарахад загварууд accordion маягаар нээгддэг болсон
// 2. Брэндийн тоо cache-с татаж харуулдаг болсон (24 цагт шинэчлэгдэнэ)
// 3. Түлшний нэрс монгол болсон

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import {
  getActiveBanners,
  getEncarVehicles,
  getManualVehicles,
  getBrandStats,
} from '../services/vehicleService.js'
import { formatMNT } from '../utils/formatters.js'

// Анхны статик мэдээлэл (cache шинэчлэгдэхийн өмнө харуулна)
// Одоогийн зурган дээрх тоонуудтай таарч байна
const DEFAULT_BRANDS = [
  { name: 'Kia', count: 23544 },
  { name: 'Hyundai', count: 20186 },
  { name: 'Mercedes-Benz', count: 9226 },
  { name: 'BMW', count: 8707 },
  { name: 'Genesis', count: 6701 },
  { name: 'Chevrolet', count: 3309 },
  { name: 'Renault', count: 2945 },
  { name: 'Audi', count: 2609 },
  { name: 'Porsche', count: 1520 },
  { name: 'Mini', count: 1365 },
  { name: 'Land Rover', count: 1191 },
  { name: 'Volvo', count: 1098 },
]

// Анхны загварын жагсаалт (cache байхгүй үед)
const DEFAULT_BRAND_MODELS = {
  Kia: [
    { name: 'Santafe', count: 3289 },
    { name: 'Starex', count: 1381 },
    { name: 'Ioniq5', count: 443 },
    { name: 'Ioniq', count: 114 },
    { name: 'Ioniq9', count: 16 },
  ],
  Hyundai: [
    { name: 'AVANTE', count: 2736 },
    { name: 'Kona', count: 1145 },
    { name: 'Venue', count: 317 },
    { name: 'i30', count: 95 },
    { name: 'Aslan', count: 8 },
  ],
}

export default function HomePage() {
  const [banners, setBanners] = useState([])
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [manualVehicles, setManualVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllBrands, setShowAllBrands] = useState(false)

  // Брэнд accordion state
  const [openBrand, setOpenBrand] = useState(null) // Нээлттэй байгаа брэндийн нэр
  const [brandStats, setBrandStats] = useState(null) // Cache-с ирсэн мэдээлэл
  const [brands, setBrands] = useState(DEFAULT_BRANDS)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [bannersRes, vehiclesRes, manualRes, statsRes] = await Promise.allSettled([
        getActiveBanners(),
        getEncarVehicles({ limit: 20 }),
        getManualVehicles({ limit: 6 }),
        getBrandStats(), // Cache-с брэнд статистик
      ])

      if (bannersRes.status === 'fulfilled') {
        setBanners(bannersRes.value.data || [])
      }

      if (vehiclesRes.status === 'fulfilled') {
        setFeaturedVehicles(vehiclesRes.value.data || [])
      }

      if (manualRes.status === 'fulfilled') {
        setManualVehicles(manualRes.value.data || [])
      }

      // Cache-с брэнд статистик ирсэн бол шинэчлэх
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        const stats = statsRes.value.data
        setBrandStats(stats)

        // Брэндийн жагсаалтыг cache-с шинэчлэх
        const updatedBrands = DEFAULT_BRANDS.map(b => ({
          ...b,
          count: stats[b.name]?.total || b.count, // Cache-аас авна, байхгүй бол default
        }))
        setBrands(updatedBrands)
      }
    } catch (err) {
      console.error('❌ Нүүр хуудас алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Брэнд дарахад accordion toggle
  const toggleBrand = (brandName) => {
    setOpenBrand(prev => prev === brandName ? null : brandName)
  }

  // Брэндийн загваруудыг авах
  const getBrandModels = (brandName) => {
    // Cache-с авна
    if (brandStats && brandStats[brandName]?.models) {
      return brandStats[brandName].models.slice(0, 5)
    }
    // Default мэдээлэл
    return DEFAULT_BRAND_MODELS[brandName] || []
  }

  // Нүүр хуудасны 4 гол брэнд (том нүдтэй)
  const TOP_BRANDS = brands.slice(0, 4)
  // Бусад брэндүүд (жижиг нүдтэй)
  const OTHER_BRANDS = brands.slice(4)
  const VISIBLE_OTHER_BRANDS = showAllBrands ? OTHER_BRANDS : OTHER_BRANDS.slice(0, 8)

  const section1 = featuredVehicles.slice(0, 5)
  const section2 = featuredVehicles.slice(5, 9)
  const section3 = featuredVehicles.slice(9, 13)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* ============================================================
          БРЭНД ЖАГСААЛТ — accordion дизайн
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h2 className="text-white font-semibold text-xl mb-6">
          Солонгос улсаас автомашин захиалга
        </h2>

        {/* Дээрх 4 том брэнд */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-1 mb-4">
          {TOP_BRANDS.map(brand => {
            const isOpen = openBrand === brand.name
            const models = getBrandModels(brand.name)

            return (
              <div key={brand.name}>
                {/* Брэндийн нэр + тоо + accordion товч */}
                <button
                  onClick={() => toggleBrand(brand.name)}
                  className="flex justify-between items-center w-full hover:text-primary transition-colors group py-0.5"
                >
                  <span className="font-bold text-white group-hover:text-primary text-left">
                    {brand.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">{brand.count.toLocaleString()}</span>
                    {isOpen
                      ? <ChevronUp size={12} className="text-primary" />
                      : <ChevronDown size={12} className="text-gray-500 group-hover:text-primary" />
                    }
                  </div>
                </button>

                {/* Загваруудын accordion */}
                {isOpen && (
                  <div className="mt-1 mb-2 pl-2 border-l border-primary/30 space-y-0.5 animate-in">
                    {models.length > 0 ? (
                      <>
                        {models.map(m => (
                          <Link
                            key={m.name}
                            to={`/vehicles?manufacturer=${brand.name}&modelGroup=${m.name}`}
                            className="flex justify-between text-sm text-gray-400 hover:text-white transition-colors py-0.5"
                          >
                            <span>{m.name}</span>
                            <span className="text-gray-500">{m.count?.toLocaleString()}</span>
                          </Link>
                        ))}
                        <Link
                          to={`/vehicles?manufacturer=${brand.name}`}
                          className="block text-xs text-primary hover:underline pt-1"
                        >
                          Бүгдийг харах →
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/vehicles?manufacturer=${brand.name}`}
                        className="block text-sm text-gray-400 hover:text-white py-0.5"
                      >
                        Бүх {brand.name} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Бусад брэндүүд — жижиг */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-1.5">
          {VISIBLE_OTHER_BRANDS.map(brand => {
            const isOpen = openBrand === brand.name
            const models = getBrandModels(brand.name)

            return (
              <div key={brand.name}>
                <button
                  onClick={() => toggleBrand(brand.name)}
                  className="flex justify-between items-center w-full text-sm hover:text-primary transition-colors group py-0.5"
                >
                  <span className="text-gray-300 group-hover:text-primary">{brand.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">{brand.count.toLocaleString()}</span>
                    {isOpen
                      ? <ChevronUp size={10} className="text-primary" />
                      : <ChevronDown size={10} className="text-gray-600 group-hover:text-primary" />
                    }
                  </div>
                </button>

                {/* Accordion */}
                {isOpen && (
                  <div className="mt-1 mb-2 pl-2 border-l border-primary/30 space-y-0.5">
                    {models.length > 0 ? (
                      <>
                        {models.map(m => (
                          <Link
                            key={m.name}
                            to={`/vehicles?manufacturer=${brand.name}&modelGroup=${m.name}`}
                            className="flex justify-between text-xs text-gray-400 hover:text-white transition-colors py-0.5"
                          >
                            <span>{m.name}</span>
                            <span className="text-gray-500">{m.count?.toLocaleString()}</span>
                          </Link>
                        ))}
                        <Link
                          to={`/vehicles?manufacturer=${brand.name}`}
                          className="block text-xs text-primary hover:underline pt-1"
                        >
                          Бүгдийг харах →
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/vehicles?manufacturer=${brand.name}`}
                        className="block text-xs text-gray-400 hover:text-white py-0.5"
                      >
                        Бүх {brand.name} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setShowAllBrands(!showAllBrands)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mt-4 transition-colors"
        >
          {showAllBrands ? 'Хураах' : 'Бүгдийг харах'}
          <ChevronDown size={14} className={showAllBrands ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      </section>

      <div className="border-t border-white/10 my-2" />

      {/* BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-dark-card rounded-xl h-96 flex items-center justify-center">
            <LoadingSpinner text="Ачааллаж байна..." />
          </div>
        ) : banners.length > 0 ? (
          <BannerSlider banners={banners} />
        ) : section1.length > 0 ? (
          <FeaturedCarBanner car={section1[0]} />
        ) : (
          <div className="bg-dark-card rounded-xl h-64 flex items-center justify-center text-gray-500">
            Banner оруулаагүй байна
          </div>
        )}
      </section>

      {/* ADMIN ГАРААР НЭМСЭН МАШИНУУД */}
      {manualVehicles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <SectionHeader title="Манай санал болгох машинууд" link="/vehicles?source=manual" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {manualVehicles.map(v => (
              <VehicleCard key={v._id} vehicle={v} type="manual" />
            ))}
          </div>
        </section>
      )}

      {/* ШИНЭ МАШИНУУД */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader title="Шинэ машинууд" link="/vehicles" />
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {(section2.length > 0 ? section2 : section1.slice(0, 4)).map((v, i) => (
              <VehicleCard key={v.id || i} vehicle={v} type="encar" />
            ))}
          </div>
        )}
      </section>

      {/* ОНЦЛОХ МАШИНУУД */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <SectionHeader title="Онцлох машинууд" link="/vehicles" />
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {(section3.length > 0 ? section3 : section1.slice(0, 4)).map((v, i) => (
              <VehicleCard key={v.id || i} vehicle={v} type="encar" />
            ))}
          </div>
        )}
      </section>

      {/* ЗАХИАЛГЫН ЗААВАР */}
      <section id="how" className="bg-dark-secondary py-16 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-white font-bold text-2xl text-center mb-10">Захиалга өгөх заавар</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Машин сонгох', desc: 'Манай сайтаас эсвэл каталогоос машинаа сонгоно' },
              { step: '02', title: 'Захиалга өгөх', desc: 'Манай менежертэй холбогдож захиалга баталгаажуулна' },
              { step: '03', title: 'Төлбөр хийх', desc: 'Урьдчилгаа төлбөр хийснээр машиныг захиална' },
              { step: '04', title: 'Монголд авах', desc: 'Гааль, тээвэр бүгдийг хариуцаж монголд хүргэнэ' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ============================================================
// HELPER COMPONENTS
// ============================================================

function BannerSlider({ banners }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setIdx(p => (p + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners])

  const cur = banners[idx]
  return (
    <div className="relative rounded-xl overflow-hidden bg-dark-card">
      <img
        src={cur.imageUrl}
        alt={cur.title}
        className="w-full object-cover"
        style={{ maxHeight: '500px' }}
        onError={e => e.target.style.display = 'none'}
      />
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedCarBanner({ car }) {
  const priceMNT = car.priceMNT || car.totalPriceMNT
  const image = car.firstPhoto || car.photos?.[0]

  return (
    <div className="relative rounded-xl overflow-hidden bg-dark-card min-h-[400px] flex">
      <div className="flex-1 relative">
        {image ? (
          <img
            src={image}
            alt={car.manufacturer}
            className="w-full h-full object-cover"
            style={{ minHeight: '400px' }}
          />
        ) : (
          <div className="w-full h-full bg-dark-secondary flex items-center justify-center text-gray-600 min-h-[400px] text-6xl">
            🚗
          </div>
        )}
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-black/95 via-black/80 to-transparent flex flex-col justify-center p-8">
        <span className="badge-red mb-3">ОНЦЛОХ МАШИН</span>
        <h2 className="text-white font-bold text-2xl leading-tight mb-2">
          {car.manufacturer} {car.model}
        </h2>
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs">ОН:</div>
            <div className="text-white font-semibold">{car.year}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">ГҮЙЛТ:</div>
            <div className="text-white font-semibold">{car.mileage?.toLocaleString()} км</div>
          </div>
          {car.fuelType && (
            <div>
              <div className="text-gray-500 text-xs">ТҮЛШ:</div>
              <div className="text-white font-semibold">{car.fuelType}</div>
            </div>
          )}
        </div>
        {priceMNT && (
          <div className="text-primary font-bold text-lg mb-4">{formatMNT(priceMNT)}</div>
        )}
        <Link
          to={`/vehicles/encar/${car.id}`}
          className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded text-center transition-colors text-sm uppercase tracking-wider"
        >
          ДЭЛГЭРЭНГҮЙ ҮЗЭХ
        </Link>
      </div>
    </div>
  )
}

function SectionHeader({ title, link }) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-white font-bold text-xl">{title}</h2>
      <Link
        to={link}
        className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
      >
        <ChevronLeft size={16} /><ChevronRight size={16} />
      </Link>
    </div>
  )
}