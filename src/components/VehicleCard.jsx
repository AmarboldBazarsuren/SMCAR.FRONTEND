// Файл: frontend/src/components/VehicleCard.jsx
import { Link } from 'react-router-dom'
import { formatMNT, formatMileage } from '../utils/formatters.js'

export default function VehicleCard({ vehicle, type = 'encar' }) {
  const isManual = type === 'manual'

  const id = isManual ? vehicle._id : vehicle.id
  const href = isManual ? `/vehicles/manual/${id}` : `/vehicles/encar/${id}`

  const title = vehicle.title || `${vehicle.brand} ${vehicle.model}`
  const year = vehicle.year
  const mileage = vehicle.mileage
  const imageUrl = isManual
    ? vehicle.images?.[0]?.url
    : vehicle.image_url

  const price = isManual
    ? vehicle.totalPriceMNT
    : vehicle.priceMNT || (vehicle.price ? vehicle.price * 2.43 : null)

  return (
    <Link to={href} className="vehicle-card group block">
      {/* Зураг */}
      <div className="aspect-[4/3] bg-dark-secondary overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-3xl">
            🚗
          </div>
        )}
        {isManual && (
          <div className="absolute top-2 left-2 badge-red text-xs">МАНАЙ</div>
        )}
      </div>

      {/* Мэдээлэл */}
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold line-clamp-1 mb-1">{title}</h3>
        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>{year}он</span>
          {mileage && <span>{formatMileage(mileage)}</span>}
        </div>
        {price ? (
          <p className="text-primary font-bold text-sm">{formatMNT(price)}</p>
        ) : (
          <p className="text-gray-500 text-xs">Үнэ тодорхойгүй</p>
        )}
      </div>
    </Link>
  )
}