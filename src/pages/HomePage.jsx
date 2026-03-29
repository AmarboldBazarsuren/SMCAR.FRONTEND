// Файл: frontend/src/pages/HomePage.jsx
// Light theme — цагаан дэвсгэртэй

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
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

const DEFAULT_BRANDS = [
  { name: 'Kia',           count: 22950 },
  { name: 'Hyundai',       count: 19592 },
  { name: 'Mercedes-Benz', count: 9191  },
  { name: 'BMW',           count: 8621  },
  { name: 'Genesis',       count: 6607  },
  { name: 'Chevrolet',     count: 3251  },
  { name: 'Renault',       count: 2932  },
  { name: 'Audi',          count: 2579  },
  { name: 'Porsche',       count: 1497  },
  { name: 'Mini',          count: 1345  },
  { name: 'Land Rover',    count: 1189  },
  { name: 'Volvo',         count: 1096  },
  { name: 'Toyota',        count: 987   },
  { name: 'Lexus',         count: 876   },
  { name: 'Honda',         count: 765   },
  { name: 'Ford',          count: 654   },
  { name: 'Jeep',          count: 543   },
  { name: 'Volkswagen',    count: 498   },
  { name: 'Tesla',         count: 432   },
  { name: 'Lincoln',       count: 321   },
  { name: 'Maserati',      count: 234   },
  { name: 'Jaguar',        count: 198   },
  { name: 'Bentley',       count: 145   },
  { name: 'Rolls-Royce',   count: 98    },
  { name: 'Lamborghini',   count: 76    },
  { name: 'Ferrari',       count: 54    },
  { name: 'Peugeot',       count: 210   },
  { name: 'Nissan',        count: 187   },
]

const DEFAULT_BRAND_MODELS = {
  Kia: [
    { name: 'Sportage', count: 3289 }, { name: 'Sorento',  count: 2541 },
    { name: 'Stonic',   count: 1821 }, { name: 'K5',       count: 1654 },
    { name: 'Carnival', count: 1381 }, { name: 'Seltos',   count: 987  },
    { name: 'EV6',      count: 443  }, { name: 'K3',       count: 312  },
    { name: 'Morning',  count: 211  }, { name: 'Niro',     count: 178  },
  ],
  Hyundai: [
    { name: 'Tucson',   count: 3102 }, { name: 'Santa Fe', count: 2876 },
    { name: 'Avante',   count: 2736 }, { name: 'Sonata',   count: 1987 },
    { name: 'Palisade', count: 1654 }, { name: 'Kona',     count: 1145 },
    { name: 'Grandeur', count: 987  }, { name: 'Venue',    count: 317  },
    { name: 'Ioniq5',   count: 256  }, { name: 'i30',      count: 95   },
  ],
  'Mercedes-Benz': [
    { name: 'E-Class',    count: 2761 }, { name: 'S-Class',   count: 1338 },
    { name: 'GLE-Class',  count: 895  }, { name: 'GLC-Class', count: 836  },
    { name: 'C-Class',    count: 697  }, { name: 'CLS-Class', count: 507  },
    { name: 'CLA-Class',  count: 228  }, { name: 'GLB-Class', count: 316  },
    { name: 'GLS-Class',  count: 251  }, { name: 'GLA-Class', count: 231  },
    { name: 'AMG GT',     count: 163  }, { name: 'G-Class',   count: 123  },
    { name: 'CLE-Class',  count: 74   }, { name: 'EQA',       count: 61   },
    { name: 'EQE',        count: 92   }, { name: 'EQB',       count: 44   },
    { name: 'EQC',        count: 14   }, { name: 'EQS',       count: 79   },
    { name: 'SLC-Class',  count: 11   }, { name: 'Sprinter',  count: 42   },
    { name: 'B-Class',    count: 7    }, { name: 'V-Class',   count: 20   },
    { name: 'SL-Class',   count: 28   },
  ],
  BMW: [
    { name: '5-Series', count: 2187 }, { name: '3-Series', count: 1654 },
    { name: 'X5',       count: 1432 }, { name: 'X3',       count: 987  },
    { name: '7-Series', count: 765  }, { name: 'X6',       count: 654  },
    { name: '4-Series', count: 543  }, { name: 'X4',       count: 432  },
    { name: 'i4',       count: 86   }, { name: '1-Series', count: 235  },
  ],
  Genesis: [
    { name: 'GV80', count: 1876 }, { name: 'G80',  count: 1543 },
    { name: 'GV70', count: 1234 }, { name: 'G70',  count: 876  },
    { name: 'G90',  count: 654  }, { name: 'GV60', count: 312  },
    { name: 'GV90', count: 106  },
  ],
  Chevrolet: [
    { name: 'Trailblazer', count: 876 }, { name: 'Equinox',  count: 654 },
    { name: 'Malibu',      count: 543 }, { name: 'Spark',    count: 432 },
    { name: 'Trax',        count: 321 }, { name: 'Traverse', count: 234 },
    { name: 'Colorado',    count: 149 },
  ],
  Renault: [
    { name: 'QM6',    count: 987 }, { name: 'SM6',    count: 765 },
    { name: 'XM3',    count: 543 }, { name: 'Arkana', count: 321 },
    { name: 'Captur', count: 234 }, { name: 'ZOE',    count: 95  },
  ],
  Audi: [
    { name: 'A6',        count: 928 }, { name: 'Q5',        count: 194 },
    { name: 'Q7',        count: 182 }, { name: 'A7',        count: 175 },
    { name: 'A4',        count: 165 }, { name: 'Q8',        count: 158 },
    { name: 'A5',        count: 157 }, { name: 'A8',        count: 101 },
    { name: 'A3',        count: 96  }, { name: 'Q4 e-tron', count: 96  },
    { name: 'Q3',        count: 86  }, { name: 'e-tron',    count: 73  },
  ],
  Porsche: [
    { name: 'Cayenne',  count: 543 }, { name: 'Macan',    count: 432 },
    { name: 'Panamera', count: 321 }, { name: '911',      count: 145 },
    { name: 'Taycan',   count: 79  },
  ],
  Mini: [
    { name: 'Countryman', count: 543 }, { name: 'Cooper',  count: 432 },
    { name: 'Clubman',    count: 234 }, { name: 'Paceman', count: 156 },
  ],
  'Land Rover': [
    { name: 'Discovery Sport',    count: 207 }, { name: 'Discovery',         count: 202 },
    { name: 'Range Rover Evoque', count: 194 }, { name: 'Range Rover',       count: 191 },
    { name: 'Defender',           count: 145 }, { name: 'Range Rover Sport', count: 134 },
    { name: 'Range Rover Velar',  count: 116 },
  ],
  Volvo: [
    { name: 'XC60', count: 432 }, { name: 'XC90', count: 321 },
    { name: 'XC40', count: 234 }, { name: 'S90',  count: 65  },
    { name: 'V60',  count: 46  },
  ],
  Toyota: [
    { name: 'RAV4',         count: 432 }, { name: 'Camry',      count: 321 },
    { name: 'Land Cruiser', count: 287 }, { name: 'Highlander', count: 234 },
    { name: 'Corolla',      count: 198 }, { name: 'Prius',      count: 145 },
  ],
  Lexus: [
    { name: 'RX', count: 321 }, { name: 'NX', count: 234 },
    { name: 'ES', count: 187 }, { name: 'LX', count: 145 },
    { name: 'UX', count: 98  }, { name: 'IS', count: 87  },
  ],
  Honda: [
    { name: 'CR-V',  count: 287 }, { name: 'Accord', count: 234 },
    { name: 'Civic', count: 198 }, { name: 'Pilot',  count: 145 },
    { name: 'HR-V',  count: 98  },
  ],
  Ford: [
    { name: 'Explorer', count: 234 }, { name: 'F-150',  count: 187 },
    { name: 'Mustang',  count: 145 }, { name: 'Bronco', count: 98  },
    { name: 'Edge',     count: 76  },
  ],
  Jeep: [
    { name: 'Grand Cherokee', count: 198 }, { name: 'Wrangler', count: 156 },
    { name: 'Cherokee',       count: 98  }, { name: 'Compass',  count: 76  },
  ],
  Volkswagen: [
    { name: 'Tiguan', count: 187 }, { name: 'Passat',  count: 145 },
    { name: 'Golf',   count: 123 }, { name: 'Touareg', count: 98  },
  ],
  Tesla: [
    { name: 'Model Y', count: 187 }, { name: 'Model 3', count: 145 },
    { name: 'Model S', count: 67  }, { name: 'Model X', count: 43  },
  ],
  Lincoln: [
    { name: 'Navigator', count: 123 }, { name: 'Aviator', count: 98 },
    { name: 'Corsair',   count: 65  }, { name: 'Nautilus', count: 43 },
  ],
  Maserati: [
    { name: 'Ghibli',       count: 98 }, { name: 'Levante',      count: 87 },
    { name: 'Quattroporte', count: 32 },
  ],
  Jaguar: [
    { name: 'F-Pace', count: 87 }, { name: 'XE', count: 65 }, { name: 'XF', count: 32 },
  ],
  Bentley: [
    { name: 'Bentayga',    count: 67 }, { name: 'Continental GT', count: 43 },
    { name: 'Flying Spur', count: 21 },
  ],
  'Rolls-Royce': [
    { name: 'Cullinan', count: 43 }, { name: 'Ghost',   count: 32 },
    { name: 'Phantom',  count: 14 },
  ],
  Lamborghini: [
    { name: 'Urus', count: 43 }, { name: 'Huracan', count: 21 },
  ],
  Ferrari: [
    { name: 'Roma', count: 16 }, { name: 'SF90', count: 9 },
  ],
  Peugeot: [
    { name: '3008', count: 98 }, { name: '5008', count: 76 }, { name: '2008', count: 54 },
  ],
  Nissan: [
    { name: 'Qashqai', count: 87 }, { name: 'X-Trail', count: 65 },
    { name: 'Murano',  count: 43 }, { name: 'Patrol',  count: 32 },
  ],
}

const INITIAL_SHOW = 12

export default function HomePage() {
  const [adminBanners,     setAdminBanners]     = useState([])
  const [featuredVehicles, setFeaturedVehicles] = useState([])
  const [manualVehicles,   setManualVehicles]   = useState([])
  const [loading,          setLoading]          = useState(true)
  const [showAllBrands,    setShowAllBrands]    = useState(false)
  const [openBrand,        setOpenBrand]        = useState(null)
  const [brands,           setBrands]           = useState(DEFAULT_BRANDS)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [bannersRes, vehiclesRes, manualRes, statsRes] = await Promise.allSettled([
        getActiveBanners(),
        getEncarVehicles({ limit: 20 }),
        getManualVehicles({ limit: 6 }),
        getBrandStats(),
      ])
      if (bannersRes.status === 'fulfilled')
        setAdminBanners(bannersRes.value.data || [])
      if (vehiclesRes.status === 'fulfilled')
        setFeaturedVehicles(vehiclesRes.value.data || [])
      if (manualRes.status === 'fulfilled')
        setManualVehicles(manualRes.value.data || [])
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        const stats = statsRes.value.data
        setBrands(DEFAULT_BRANDS.map(b => ({
          ...b,
          count: stats[b.name]?.total || b.count,
        })))
      }
    } catch (err) {
      console.error('❌ Нүүр хуудас алдаа:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleBrand = (name) =>
    setOpenBrand(prev => (prev === name ? null : name))

  const visibleBrands = showAllBrands ? brands : brands.slice(0, INITIAL_SHOW)

  // Desktop: 4 багана, Mobile: 2 багана
  const desktopRows = []
  for (let i = 0; i < visibleBrands.length; i += 4) {
    desktopRows.push(visibleBrands.slice(i, i + 4))
  }

  const mobileRows = []
  for (let i = 0; i < visibleBrands.length; i += 2) {
    mobileRows.push(visibleBrands.slice(i, i + 2))
  }

  const section1 = featuredVehicles.slice(0, 5)
  const section2 = featuredVehicles.slice(5, 9)
  const section3 = featuredVehicles.slice(9, 13)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── БРЭНДИЙН ХЭСЭГ ── */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h2 className="text-gray-900 font-semibold text-lg mb-5">
          Солонгос улсаас автомашин захиалга
        </h2>

        {/* DESKTOP (sm+): 4 багана */}
        <div className="hidden sm:block w-full border border-gray-200 rounded overflow-hidden bg-white">
          {desktopRows.map((row, rowIdx) => {
            const openInRow = row.find(b => b.name === openBrand)
            return (
              <div key={rowIdx}>
                <div className="grid grid-cols-4 divide-x divide-gray-200 border-b border-gray-200 last:border-b-0">
                  {row.map((brand) => {
                    const isOpen = openBrand === brand.name
                    return (
                      <button
                        key={brand.name}
                        onClick={() => toggleBrand(brand.name)}
                        className={`flex items-center justify-between px-4 py-3 w-full text-left transition-colors duration-150 ${
                          isOpen ? 'bg-red-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`text-sm font-semibold truncate mr-2 ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
                          {brand.name}
                        </span>
                        <span className="text-gray-400 text-sm tabular-nums flex-shrink-0">
                          {brand.count.toLocaleString()}
                        </span>
                      </button>
                    )
                  })}
                  {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="px-4 py-3" />
                  ))}
                </div>

                {/* Accordion — desktop */}
                {openInRow && (
                  <div className="border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 px-4 py-3">
                      {(DEFAULT_BRAND_MODELS[openInRow.name] || []).map((m) => (
                        <Link
                          key={m.name}
                          to={`/vehicles?manufacturer=${openInRow.name}&modelGroup=${m.name}`}
                          className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors truncate mr-2">
                            {m.name}
                          </span>
                          <span className="text-gray-400 text-xs tabular-nums flex-shrink-0">
                            {m.count?.toLocaleString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="px-6 pb-3">
                      <Link
                        to={`/vehicles?manufacturer=${openInRow.name}`}
                        className="text-primary text-sm hover:underline"
                      >
                        Бүгдийг харах →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* MOBILE (xs): 2 багана */}
        <div className="block sm:hidden w-full border border-gray-200 rounded overflow-hidden bg-white">
          {mobileRows.map((row, rowIdx) => {
            const openInRow = row.find(b => b.name === openBrand)
            return (
              <div key={rowIdx}>
                <div className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 last:border-b-0">
                  {row.map((brand) => {
                    const isOpen = openBrand === brand.name
                    return (
                      <button
                        key={brand.name}
                        onClick={() => toggleBrand(brand.name)}
                        className={`flex items-center justify-between px-3 py-3 w-full text-left transition-colors duration-150 ${
                          isOpen ? 'bg-red-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`text-sm font-semibold truncate mr-2 ${isOpen ? 'text-primary' : 'text-gray-800'}`}>
                          {brand.name}
                        </span>
                        <span className="text-gray-400 text-xs tabular-nums flex-shrink-0">
                          {brand.count.toLocaleString()}
                        </span>
                      </button>
                    )
                  })}
                  {row.length < 2 && <div className="px-3 py-3" />}
                </div>

                {/* Accordion — mobile */}
                {openInRow && (
                  <div className="border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 px-3 py-2">
                      {(DEFAULT_BRAND_MODELS[openInRow.name] || []).map((m) => (
                        <Link
                          key={m.name}
                          to={`/vehicles?manufacturer=${openInRow.name}&modelGroup=${m.name}`}
                          className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors truncate mr-1">
                            {m.name}
                          </span>
                          <span className="text-gray-400 text-xs tabular-nums flex-shrink-0">
                            {m.count?.toLocaleString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="px-5 pb-3">
                      <Link
                        to={`/vehicles?manufacturer=${openInRow.name}`}
                        className="text-primary text-sm hover:underline"
                      >
                        Бүгдийг харах →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Бүгдийг харах товч */}
        <button
          onClick={() => setShowAllBrands(!showAllBrands)}
          className="flex items-center gap-1 mt-3 text-gray-400 hover:text-gray-700 text-sm transition-colors"
        >
          {showAllBrands ? 'Хураах' : 'Бүгдийг харах'}
          <ChevronDown
            size={14}
            className={showAllBrands ? 'rotate-180 transition-transform' : 'transition-transform'}
          />
        </button>
      </section>

      <div className="border-t border-gray-200 my-2" />

      {/* FEATURED BANNER */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-xl h-96 flex items-center justify-center">
            <LoadingSpinner text="Ачааллаж байна..." />
          </div>
        ) : section1.length > 0 ? (
          <FeaturedCarBanner car={section1[0]} />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
            Машин ачааллаж байна...
          </div>
        )}
      </section>

      {/* МАНАЙ САНАЛ БОЛГОХ МАШИНУУД */}
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

      {/* ADMIN BANNER */}
      {adminBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-6">
          <AdminBannerSlider banners={adminBanners} />
        </section>
      )}

      {/* ЗАХИАЛГЫН ЗААВАР */}
      <section id="how" className="bg-white border-t border-gray-200 py-16 mt-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-gray-900 font-bold text-2xl text-center mb-10">Захиалга өгөх заавар</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Машин сонгох',  desc: 'Манай сайтаас эсвэл каталогоос машинаа сонгоно' },
              { step: '02', title: 'Захиалга өгөх', desc: 'Манай менежертэй холбогдож захиалга баталгаажуулна' },
              { step: '03', title: 'Төлбөр хийх',   desc: 'Урьдчилгаа төлбөр хийснээр машиныг захиална' },
              { step: '04', title: 'Монголд авах',   desc: 'Гааль, тээвэр бүгдийг хариуцаж монголд хүргэнэ' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ── HELPER COMPONENTS ──

function FeaturedCarBanner({ car }) {
  const priceMNT = car.priceMNT || car.totalPriceMNT
  const image    = car.firstPhoto || car.photos?.[0]
  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[400px] flex">
      <div className="flex-1 relative">
        {image
          ? <img src={image} alt={car.manufacturer} className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
          : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 min-h-[400px] text-6xl">🚗</div>
        }
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-black/95 via-black/80 to-transparent flex flex-col justify-center p-8">
        <span className="badge-red mb-3">ОНЦЛОХ МАШИН</span>
        <h2 className="text-black font-bold text-2xl leading-tight mb-2">{car.manufacturer} {car.model}</h2>
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div><div className="text-gray-400 text-xs">ОН:</div><div className="text-black font-semibold">{car.year}</div></div>
          <div><div className="text-gray-400 text-xs">ГҮЙЛТ:</div><div className="text-black font-semibold">{car.mileage?.toLocaleString()} км</div></div>
          {car.fuelType && <div><div className="text-gray-400 text-xs">ТҮЛШ:</div><div className="text-black font-semibold">{car.fuelType}</div></div>}
        </div>
        {priceMNT && <div className="text-primary font-bold text-lg mb-4">{formatMNT(priceMNT)}</div>}
        <Link to={`/vehicles/encar/${car.id}`} className="block w-full bg-primary hover:bg-primary-dark text-black font-bold py-3 rounded text-center transition-colors text-sm uppercase tracking-wider">
          ДЭЛГЭРЭНГҮЙ ҮЗЭХ
        </Link>
      </div>
    </div>
  )
}

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
      <div className="flex items-center gap-2 mb-3">
        <span className="badge-red text-xs">ЗАРАА</span>
        <span className="text-gray-500 text-sm">Манай зар мэдэгдэл</span>
      </div>
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200" style={{ minHeight: '400px' }}>
        {cur.linkUrl
          ? <a href={cur.linkUrl} target="_blank" rel="noopener noreferrer"><img src={cur.imageUrl} alt={cur.title} className="w-full h-full object-cover" style={{ minHeight: '400px' }} /></a>
          : <img src={cur.imageUrl} alt={cur.title} className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
        }
        {cur.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-black font-bold text-lg">{cur.title}</h3>
            {cur.description && <p className="text-gray-300 text-sm mt-1">{cur.description}</p>}
          </div>
        )}
        {banners.length > 1 && (
          <div className="absolute bottom-4 right-6 flex gap-2">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-primary' : 'bg-white/40'}`} />
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
      <h2 className="text-gray-900 font-bold text-xl">{title}</h2>
      <Link to={link} className="text-gray-400 hover:text-gray-700 text-sm transition-colors flex items-center gap-1">
        <ChevronLeft size={16} /><ChevronRight size={16} />
      </Link>
    </div>
  )
}