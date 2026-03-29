// Файл: frontend/src/pages/HomePage.jsx
// Өөрчлөлтүүд:
// 1. Бүх брэндийн загваруудыг accordion дээр харагддаг болсон
// 2. Admin banner онцлох машинуудын ДООР тусдаа харагдана
// 3. Брэндийн жагсаалт 2-3 дугаар зурган шиг гоё харагдана

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

// Анхны статик мэдээлэл
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
  { name: 'Toyota', count: 987 },
  { name: 'Lexus', count: 876 },
  { name: 'Honda', count: 765 },
  { name: 'Ford', count: 654 },
  { name: 'Jeep', count: 543 },
  { name: 'Volkswagen', count: 498 },
  { name: 'Tesla', count: 432 },
  { name: 'Lincoln', count: 321 },
  { name: 'Maserati', count: 234 },
  { name: 'Jaguar', count: 198 },
  { name: 'Bentley', count: 145 },
  { name: 'Rolls-Royce', count: 98 },
  { name: 'Lamborghini', count: 76 },
  { name: 'Ferrari', count: 54 },
  { name: 'Peugeot', count: 210 },
  { name: 'Nissan', count: 187 },
]

// Default загварууд - бүх брэндэд
const DEFAULT_BRAND_MODELS = {
  Kia: [
    { name: 'Sportage', count: 3289 }, { name: 'Sorento', count: 2541 },
    { name: 'Stonic', count: 1821 }, { name: 'K5', count: 1654 },
    { name: 'Carnival', count: 1381 }, { name: 'Seltos', count: 987 },
    { name: 'EV6', count: 443 }, { name: 'K3', count: 312 },
    { name: 'Morning', count: 211 }, { name: 'Niro', count: 178 },
  ],
  Hyundai: [
    { name: 'Tucson', count: 3102 }, { name: 'Santa Fe', count: 2876 },
    { name: 'Avante', count: 2736 }, { name: 'Sonata', count: 1987 },
    { name: 'Palisade', count: 1654 }, { name: 'Kona', count: 1145 },
    { name: 'Grandeur', count: 987 }, { name: 'Venue', count: 317 },
    { name: 'Ioniq5', count: 256 }, { name: 'i30', count: 95 },
  ],
  'Mercedes-Benz': [
    { name: 'E-Class', count: 1876 }, { name: 'C-Class', count: 1654 },
    { name: 'GLE', count: 1234 }, { name: 'GLC', count: 987 },
    { name: 'S-Class', count: 765 }, { name: 'GLB', count: 543 },
    { name: 'CLA', count: 432 }, { name: 'A-Class', count: 321 },
    { name: 'GLS', count: 234 }, { name: 'EQS', count: 120 },
  ],
  BMW: [
    { name: '5-Series', count: 2187 }, { name: '3-Series', count: 1654 },
    { name: 'X5', count: 1432 }, { name: 'X3', count: 987 },
    { name: '7-Series', count: 765 }, { name: 'X6', count: 654 },
    { name: '4-Series', count: 543 }, { name: 'X4', count: 432 },
    { name: 'i4', count: 86 }, { name: '1-Series', count: 235 },
  ],
  Genesis: [
    { name: 'GV80', count: 1876 }, { name: 'G80', count: 1543 },
    { name: 'GV70', count: 1234 }, { name: 'G70', count: 876 },
    { name: 'G90', count: 654 }, { name: 'GV60', count: 312 },
    { name: 'GV90', count: 106 },
  ],
  Chevrolet: [
    { name: 'Trailblazer', count: 876 }, { name: 'Equinox', count: 654 },
    { name: 'Malibu', count: 543 }, { name: 'Spark', count: 432 },
    { name: 'Trax', count: 321 }, { name: 'Traverse', count: 234 },
    { name: 'Colorado', count: 149 },
  ],
  Renault: [
    { name: 'QM6', count: 987 }, { name: 'SM6', count: 765 },
    { name: 'XM3', count: 543 }, { name: 'Arkana', count: 321 },
    { name: 'Captur', count: 234 }, { name: 'ZOE', count: 95 },
  ],
  Audi: [
    { name: 'Q5', count: 765 }, { name: 'A6', count: 654 },
    { name: 'A4', count: 543 }, { name: 'Q7', count: 432 },
    { name: 'A5', count: 321 }, { name: 'Q3', count: 234 },
    { name: 'e-tron', count: 120 }, { name: 'A8', count: 86 },
  ],
  Porsche: [
    { name: 'Cayenne', count: 543 }, { name: 'Macan', count: 432 },
    { name: 'Panamera', count: 321 }, { name: '911', count: 145 },
    { name: 'Taycan', count: 79 },
  ],
  Mini: [
    { name: 'Countryman', count: 543 }, { name: 'Cooper', count: 432 },
    { name: 'Clubman', count: 234 }, { name: 'Paceman', count: 156 },
  ],
  'Land Rover': [
    { name: 'Range Rover Sport', count: 432 }, { name: 'Range Rover', count: 321 },
    { name: 'Discovery', count: 234 }, { name: 'Defender', count: 145 },
    { name: 'Evoque', count: 59 },
  ],
  Volvo: [
    { name: 'XC60', count: 432 }, { name: 'XC90', count: 321 },
    { name: 'XC40', count: 234 }, { name: 'S90', count: 65 },
    { name: 'V60', count: 46 },
  ],
  Toyota: [
    { name: 'RAV4', count: 432 }, { name: 'Camry', count: 321 },
    { name: 'Land Cruiser', count: 287 }, { name: 'Highlander', count: 234 },
    { name: 'Corolla', count: 198 }, { name: 'Prius', count: 145 },
    { name: 'Venza', count: 98 }, { name: 'Crown', count: 76 },
  ],
  Lexus: [
    { name: 'RX', count: 321 }, { name: 'NX', count: 234 },
    { name: 'ES', count: 187 }, { name: 'LX', count: 145 },
    { name: 'UX', count: 98 }, { name: 'IS', count: 87 },
    { name: 'GX', count: 65 }, { name: 'LS', count: 43 },
  ],
  Honda: [
    { name: 'CR-V', count: 287 }, { name: 'Accord', count: 234 },
    { name: 'Civic', count: 198 }, { name: 'Pilot', count: 145 },
    { name: 'HR-V', count: 98 }, { name: 'Odyssey', count: 76 },
  ],
  Ford: [
    { name: 'Explorer', count: 234 }, { name: 'F-150', count: 187 },
    { name: 'Mustang', count: 145 }, { name: 'Bronco', count: 98 },
    { name: 'Edge', count: 76 }, { name: 'Ranger', count: 54 },
  ],
  Jeep: [
    { name: 'Grand Cherokee', count: 198 }, { name: 'Wrangler', count: 156 },
    { name: 'Cherokee', count: 98 }, { name: 'Compass', count: 76 },
    { name: 'Renegade', count: 43 },
  ],
  Volkswagen: [
    { name: 'Tiguan', count: 187 }, { name: 'Passat', count: 145 },
    { name: 'Golf', count: 123 }, { name: 'Touareg', count: 98 },
    { name: 'Arteon', count: 65 }, { name: 'ID.4', count: 43 },
  ],
  Tesla: [
    { name: 'Model Y', count: 187 }, { name: 'Model 3', count: 145 },
    { name: 'Model S', count: 67 }, { name: 'Model X', count: 43 },
  ],
  Lincoln: [
    { name: 'Navigator', count: 123 }, { name: 'Aviator', count: 98 },
    { name: 'Corsair', count: 65 }, { name: 'Nautilus', count: 43 },
  ],
  Maserati: [
    { name: 'Ghibli', count: 98 }, { name: 'Levante', count: 87 },
    { name: 'Quattroporte', count: 32 }, { name: 'Grecale', count: 17 },
  ],
  Jaguar: [
    { name: 'F-Pace', count: 87 }, { name: 'XE', count: 65 },
    { name: 'XF', count: 32 }, { name: 'I-Pace', count: 14 },
  ],
  Bentley: [
    { name: 'Bentayga', count: 67 }, { name: 'Continental GT', count: 43 },
    { name: 'Flying Spur', count: 21 }, { name: 'Mulsanne', count: 14 },
  ],
  'Rolls-Royce': [
    { name: 'Cullinan', count: 43 }, { name: 'Ghost', count: 32 },
    { name: 'Phantom', count: 14 }, { name: 'Wraith', count: 9 },
  ],
  Lamborghini: [
    { name: 'Urus', count: 43 }, { name: 'Huracan', count: 21 },
    { name: 'Aventador', count: 12 },
  ],
  Ferrari: [
    { name: 'GTC4Lusso', count: 21 }, { name: 'Roma', count: 16 },
    { name: 'SF90', count: 9 }, { name: 'F8', count: 8 },
  ],
  Peugeot: [
    { name: '3008', count: 98 }, { name: '5008', count: 76 },
    { name: '2008', count: 54 }, { name: '508', count: 32 },
  ],
  Nissan: [
    { name: 'Qashqai', count: 87 }, { name: 'X-Trail', count: 65 },
    { name: 'Murano', count: 43 }, { name: 'Patrol', count: 32 },
    { name: 'Leaf', count: 20 },
  ],
}

export default function HomePage() {
  const [banners, setBanners] = useState([])
  const [adminBanners, setAdminBanners] = useState([])
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [manualVehicles, setManualVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [openBrand, setOpenBrand] = useState(null)
  const [brandStats, setBrandStats] = useState(null)
  const [brands, setBrands] = useState(DEFAULT_BRANDS)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [bannersRes, vehiclesRes, manualRes, statsRes] = await Promise.allSettled([
        getActiveBanners(),
        getEncarVehicles({ limit: 20 }),
        getManualVehicles({ limit: 6 }),
        getBrandStats(),
      ])

      if (bannersRes.status === 'fulfilled') {
        const allBanners = bannersRes.value.data || []
        // Admin banner-уудыг тусад нь хадгална
        setAdminBanners(allBanners)
      }

      if (vehiclesRes.status === 'fulfilled') {
        setFeaturedVehicles(vehiclesRes.value.data || [])
      }

      if (manualRes.status === 'fulfilled') {
        setManualVehicles(manualRes.value.data || [])
      }

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        const stats = statsRes.value.data
        setBrandStats(stats)
        const updatedBrands = DEFAULT_BRANDS.map(b => ({
          ...b,
          count: stats[b.name]?.total || b.count,
        }))
        setBrands(updatedBrands)
      }
    } catch (err) {
      console.error('❌ Нүүр хуудас алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleBrand = (brandName) => {
    setOpenBrand(prev => prev === brandName ? null : brandName)
  }

  const getBrandModels = (brandName) => {
    if (brandStats && brandStats[brandName]?.models?.length) {
      return brandStats[brandName].models.slice(0, 10)
    }
    return DEFAULT_BRAND_MODELS[brandName] || []
  }

  const TOP_BRANDS = brands.slice(0, 4)
  const OTHER_BRANDS = brands.slice(4)
  const VISIBLE_OTHER_BRANDS = showAllBrands ? OTHER_BRANDS : OTHER_BRANDS.slice(0, 8)

  const section1 = featuredVehicles.slice(0, 5)
  const section2 = featuredVehicles.slice(5, 9)
  const section3 = featuredVehicles.slice(9, 13)

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* ============================================================
          БРЭНД ЖАГСААЛТ — 2-3 дугаар зурган шиг accordion
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <h2 className="text-white font-semibold text-lg mb-5">
          Солонгос улсаас автомашин захиалга
        </h2>

        {/* Дээрх 4 том брэнд */}
        <div className="grid grid-cols-4 gap-x-6 mb-2">
          {TOP_BRANDS.map(brand => {
            const isOpen = openBrand === brand.name
            const models = getBrandModels(brand.name)

            return (
              <div key={brand.name} className="border-b border-white/5 pb-1">
                <button
                  onClick={() => toggleBrand(brand.name)}
                  className="flex justify-between items-center w-full hover:text-primary transition-colors group py-1"
                >
                  <span className="font-bold text-white group-hover:text-primary text-left text-sm">
                    {brand.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400 text-sm tabular-nums">{brand.count.toLocaleString()}</span>
                    {isOpen
                      ? <ChevronUp size={12} className="text-primary flex-shrink-0" />
                      : <ChevronDown size={12} className="text-gray-500 group-hover:text-primary flex-shrink-0" />
                    }
                  </div>
                </button>

                {/* Accordion — загварууд */}
                {isOpen && (
                  <div className="mt-1 mb-3 pl-2 border-l-2 border-primary/40 space-y-0 bg-dark-secondary/30 rounded-r py-1">
                    {models.length > 0 ? (
                      <>
                        {models.map(m => (
                          <Link
                            key={m.name}
                            to={`/vehicles?manufacturer=${brand.name}&modelGroup=${m.name}`}
                            className="flex justify-between text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors py-1 px-2 rounded"
                          >
                            <span>{m.name}</span>
                            <span className="text-gray-500 tabular-nums">{m.count?.toLocaleString()}</span>
                          </Link>
                        ))}
                        <Link
                          to={`/vehicles?manufacturer=${brand.name}`}
                          className="block text-xs text-primary hover:underline pt-1 px-2"
                        >
                          Бүгдийг харах →
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/vehicles?manufacturer=${brand.name}`}
                        className="block text-xs text-gray-400 hover:text-white py-1 px-2"
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

        {/* Бусад брэндүүд */}
        <div className="grid grid-cols-4 gap-x-6 mt-1">
          {VISIBLE_OTHER_BRANDS.map(brand => {
            const isOpen = openBrand === brand.name
            const models = getBrandModels(brand.name)

            return (
              <div key={brand.name} className="border-b border-white/5 pb-1">
                <button
                  onClick={() => toggleBrand(brand.name)}
                  className="flex justify-between items-center w-full text-xs hover:text-primary transition-colors group py-1"
                >
                  <span className="text-gray-300 group-hover:text-primary">{brand.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 tabular-nums">{brand.count.toLocaleString()}</span>
                    {isOpen
                      ? <ChevronUp size={10} className="text-primary flex-shrink-0" />
                      : <ChevronDown size={10} className="text-gray-600 group-hover:text-primary flex-shrink-0" />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-1 mb-2 pl-2 border-l-2 border-primary/40 bg-dark-secondary/30 rounded-r py-1">
                    {models.length > 0 ? (
                      <>
                        {models.map(m => (
                          <Link
                            key={m.name}
                            to={`/vehicles?manufacturer=${brand.name}&modelGroup=${m.name}`}
                            className="flex justify-between text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors py-0.5 px-2 rounded"
                          >
                            <span>{m.name}</span>
                            <span className="text-gray-500 tabular-nums">{m.count?.toLocaleString()}</span>
                          </Link>
                        ))}
                        <Link
                          to={`/vehicles?manufacturer=${brand.name}`}
                          className="block text-xs text-primary hover:underline pt-1 px-2"
                        >
                          Бүгдийг харах →
                        </Link>
                      </>
                    ) : (
                      <Link
                        to={`/vehicles?manufacturer=${brand.name}`}
                        className="block text-xs text-gray-400 hover:text-white py-0.5 px-2"
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
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-white mt-3 transition-colors"
        >
          {showAllBrands ? 'Хураах' : 'Бүгдийг харах'}
          <ChevronDown size={12} className={showAllBrands ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </button>
      </section>

      <div className="border-t border-white/10 my-2" />

      {/* ============================================================
          ENCAR BANNER (үндсэн том banner)
          ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-dark-card rounded-xl h-96 flex items-center justify-center">
            <LoadingSpinner text="Ачааллаж байна..." />
          </div>
        ) : section1.length > 0 ? (
          <FeaturedCarBanner car={section1[0]} />
        ) : (
          <div className="bg-dark-card rounded-xl h-64 flex items-center justify-center text-gray-500">
            Машин ачааллаж байна...
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

      {/* ============================================================
          ADMIN BANNER — Онцлох машинуудын ДООР
          Encar banner-тай ижил хэмжээтэй
          ============================================================ */}
      {adminBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <AdminBannerSlider banners={adminBanners} />
        </section>
      )}

      {/* ЗАХИАЛГЫН ЗААВАР */}
      <section id="how" className="bg-dark-secondary py-16 mt-6">
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

// Encar-аас татсан онцлох машины том banner
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

// Admin-аас оруулсан banner slider — Encar banner-тай ижил хэмжээ
function AdminBannerSlider({ banners }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => setIdx(p => (p + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners])

  const cur = banners[idx]

  return (
    <div>
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="badge-red text-xs">ЗАРАА</span>
        <span className="text-gray-400 text-sm">Манай зар мэдэгдэл</span>
      </div>

      {/* Banner — Encar banner шиг хэмжээ (min-h-[400px]) */}
      <div className="relative rounded-xl overflow-hidden bg-dark-card" style={{ minHeight: '400px' }}>
        {cur.linkUrl ? (
          <a href={cur.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img
              src={cur.imageUrl}
              alt={cur.title}
              className="w-full h-full object-cover"
              style={{ minHeight: '400px' }}
              onError={e => e.target.style.display = 'none'}
            />
          </a>
        ) : (
          <img
            src={cur.imageUrl}
            alt={cur.title}
            className="w-full h-full object-cover"
            style={{ minHeight: '400px' }}
            onError={e => e.target.style.display = 'none'}
          />
        )}

        {/* Доод мэдээлэл */}
        {cur.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white font-bold text-lg">{cur.title}</h3>
            {cur.description && (
              <p className="text-gray-300 text-sm mt-1">{cur.description}</p>
            )}
          </div>
        )}

        {/* Pagination dots */}
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