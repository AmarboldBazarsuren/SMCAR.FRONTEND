// Файл: frontend/src/pages/HomePage.jsx
// Үүрэг: Нүүр хуудас - Banner, брэнд жагсаалт, онцлох машин

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import VehicleCard from '../components/VehicleCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getActiveBanners, getEncarVehicles, getManualVehicles } from '../services/vehicleService.js'
import { formatMNT } from '../utils/formatters.js'

const BRANDS_GRID = [
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

const KIA_MODELS = [
  { name: 'Santafe', count: 3289 },
  { name: 'Starex', count: 1381 },
  { name: 'Ioniq5', count: 443 },
  { name: 'Ioniq', count: 114 },
  { name: 'Ioniq9', count: 16 },
]

const HYUNDAI_MODELS = [
  { name: 'AVANTE', count: 2736 },
  { name: 'Kona', count: 1145 },
  { name: 'Venue', count: 317 },
  { name: 'i30', count: 95 },
  { name: 'Aslan', count: 8 },
]

export default function HomePage() {
  const [banners, setBanners] = useState([])
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [manualVehicles, setManualVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllBrands, setShowAllBrands] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    console.log('🏠 Нүүр хуудас ачааллаж байна...')
    try {
      // ⚡ Rate limit бууруулахын тулд зөвхөн 2 хүсэлт явуулна:
      // 1. Banner (өөрийн MongoDB-аас)
      // 2. Нэг удаагийн машины хүсэлт (нүүр хуудасны бүх хэсэгт ашиглана)
      const [bannersRes, vehiclesRes, manualRes] = await Promise.allSettled([
        getActiveBanners(),
        getEncarVehicles({ limit: 20 }), // Нэг хүсэлтээр 20 машин авч хуваарилна
        getManualVehicles({ limit: 6 }),
      ])

      if (bannersRes.status === 'fulfilled') {
        setBanners(bannersRes.value.data || [])
        console.log(`✅ ${bannersRes.value.data?.length} banner`)
      }

      if (vehiclesRes.status === 'fulfilled') {
        const allVehicles = vehiclesRes.value.data || []
        setFeaturedVehicles(allVehicles)
        console.log(`✅ ${allVehicles.length} машин ачааллаа`)
      }

      if (manualRes.status === 'fulfilled') {
        setManualVehicles(manualRes.value.data || [])
      }
    } catch (err) {
      console.error('❌ Нүүр хуудас алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // 20 машиныг 3 хэсэгт хуваарилах
  const section1 = featuredVehicles.slice(0, 5)   // Онцлох
  const section2 = featuredVehicles.slice(5, 9)    // 4x4 жиипүүд
  const section3 = featuredVehicles.slice(9, 13)   // Зуны гангараа

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      {/* БРЭНД ЖАГСААЛТ */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h2 className="text-white font-semibold text-xl mb-6">Солонгос улсаас автомашин захиалга</h2>

        <div className="grid grid-cols-4 gap-x-8 gap-y-2 mb-4">
          <div>
            <Link to="/vehicles?brand=Kia" className="flex justify-between items-baseline hover:text-primary transition-colors group">
              <span className="font-bold text-white group-hover:text-primary">Kia</span>
              <span className="text-gray-400 text-sm">23544</span>
            </Link>
            <div className="mt-1 space-y-0.5 pl-2">
              {KIA_MODELS.map(m => (
                <Link key={m.name} to={`/vehicles?brand=Kia&model=${m.name}`}
                  className="flex justify-between text-sm text-gray-400 hover:text-white transition-colors">
                  <span>{m.name}</span><span>{m.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Link to="/vehicles?brand=Hyundai" className="flex justify-between items-baseline hover:text-primary transition-colors group">
              <span className="font-bold text-white group-hover:text-primary">Hyundai</span>
              <span className="text-gray-400 text-sm">20186</span>
            </Link>
            <div className="mt-1 space-y-0.5 pl-2">
              {HYUNDAI_MODELS.map(m => (
                <Link key={m.name} to={`/vehicles?brand=Hyundai&model=${m.name}`}
                  className="flex justify-between text-sm text-gray-400 hover:text-white transition-colors">
                  <span>{m.name}</span><span>{m.count}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Link to="/vehicles?brand=Mercedes-Benz" className="flex justify-between items-baseline hover:text-primary transition-colors group">
              <span className="font-bold text-white group-hover:text-primary">Mercedes-Benz</span>
              <span className="text-gray-400 text-sm">9226</span>
            </Link>
          </div>

          <div>
            <Link to="/vehicles?brand=BMW" className="flex justify-between items-baseline hover:text-primary transition-colors group">
              <span className="font-bold text-white group-hover:text-primary">BMW</span>
              <span className="text-gray-400 text-sm">8707</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-x-8 gap-y-1.5">
          {BRANDS_GRID.slice(4).map(brand => (
            <Link key={brand.name} to={`/vehicles?brand=${brand.name}`}
              className="flex justify-between text-sm hover:text-primary transition-colors">
              <span className="text-gray-300">{brand.name}</span>
              <span className="text-gray-500">{brand.count.toLocaleString()}</span>
            </Link>
          ))}
        </div>

        <button onClick={() => setShowAllBrands(!showAllBrands)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mt-4 transition-colors">
          Бүгдийг харах <ChevronDown size={14} className={showAllBrands ? 'rotate-180' : ''} />
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

      {/* 4x4 ЖИИПҮҮД */}
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

      {/* ЗУН */}
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
      <img src={cur.imageUrl} alt={cur.title} className="w-full object-cover" style={{ maxHeight: '500px' }}
        onError={e => e.target.style.display = 'none'} />
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-white/40'}`} />
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
          <img src={image} alt={car.manufacturer} className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
        ) : (
          <div className="w-full h-full bg-dark-secondary flex items-center justify-center text-gray-600 min-h-[400px] text-6xl">🚗</div>
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
        </div>
        {priceMNT && (
          <div className="text-primary font-bold text-lg mb-4">{formatMNT(priceMNT)}</div>
        )}
        <Link to={`/vehicles/encar/${car.id}`}
          className="block w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded text-center transition-colors text-sm uppercase tracking-wider">
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
      <Link to={link} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1">
        <ChevronLeft size={16} /><ChevronRight size={16} />
      </Link>
    </div>
  )
}