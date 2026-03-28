// Файл: frontend/src/pages/admin/AdminVehiclesPage.jsx
// Үүрэг: Admin гараар нэмсэн машинуудын жагсаалт, устгах

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Edit, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminGetVehicles, adminDeleteVehicle } from '../../services/vehicleService.js'
import { formatMNT, formatMileage, formatCC } from '../../utils/formatters.js'

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const LIMIT = 15

  useEffect(() => { loadVehicles() }, [page])

  const loadVehicles = async () => {
    console.log(`📋 Admin машин жагсаалт: page ${page}`)
    setLoading(true)
    try {
      const data = await adminGetVehicles({ page, limit: LIMIT })
      setVehicles(data.data || [])
      setTotal(data.total || 0)
      console.log(`✅ ${data.data?.length} машин ачааллаа`)
    } catch (err) {
      console.error('❌ Admin машин жагсаалт алдаа:', err.message)
      toast.error('Машинуудыг татаж чадсангүй')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (vehicle) => {
    if (!confirm(`"${vehicle.title}" машинг устгах уу?`)) return
    try {
      await adminDeleteVehicle(vehicle._id)
      toast.success('Машин устгалаа')
      console.log('✅ Машин устгалаа:', vehicle.title)
      loadVehicles()
    } catch (err) {
      console.error('❌ Машин устгахад алдаа:', err.message)
      toast.error('Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="p-8">
      {/* Гарчиг */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Машинууд</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Нийт <span className="text-white">{total}</span> машин
          </p>
        </div>
        <Link to="/admin/vehicles/new" className="btn-primary text-sm">
          <Plus size={14} />
          Шинэ машин нэмэх
        </Link>
      </div>

      {/* Машинуудын хүснэгт */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Ачааллаж байна...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-dark-card rounded-xl border border-white/5">
          <div className="text-4xl mb-3">🚗</div>
          <p>Машин оруулаагүй байна</p>
          <Link to="/admin/vehicles/new" className="btn-primary text-sm mt-4 inline-flex">
            Эхний машин нэмэх
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-dark-card border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Машин</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Он / Гүйлт</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Хөдөлгүүр</th>
                  <th className="text-left px-4 py-3 font-medium">Нийт үнэ</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Байдал</th>
                  <th className="text-right px-5 py-3 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map(v => (
                  <tr key={v._id} className="table-row-hover">
                    {/* Машины нэр + зураг */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {v.images?.[0]?.url ? (
                          <img
                            src={v.images[0].url}
                            alt={v.title}
                            className="w-12 h-9 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-9 bg-dark-secondary rounded flex items-center justify-center text-gray-600 flex-shrink-0">
                            🚗
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium line-clamp-1">{v.title}</p>
                          <p className="text-gray-500 text-xs">{v.brand} · {v.model}</p>
                        </div>
                      </div>
                    </td>

                    {/* Он / Гүйлт */}
                    <td className="px-4 py-4 text-gray-400 hidden md:table-cell">
                      <div>{v.year}</div>
                      <div className="text-xs">{formatMileage(v.mileage)}</div>
                    </td>

                    {/* Хөдөлгүүр */}
                    <td className="px-4 py-4 text-gray-400 hidden lg:table-cell">
                      {formatCC(v.engineCC)}
                    </td>

                    {/* Нийт үнэ */}
                    <td className="px-4 py-4">
                      <span className="text-white font-medium">
                        {v.totalPriceMNT ? formatMNT(v.totalPriceMNT) : '–'}
                      </span>
                    </td>

                    {/* Байдал */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        v.isActive
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-gray-500/15 text-gray-400'
                      }`}>
                        {v.isActive ? 'Нийтлэгдсэн' : 'Нуусан'}
                      </span>
                    </td>

                    {/* Үйлдлүүд */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/vehicles/manual/${v._id}`}
                          target="_blank"
                          className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors"
                          title="Харах"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          to={`/admin/vehicles/edit/${v._id}`}
                          className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors"
                          title="Засах"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(v)}
                          className="text-gray-400 hover:text-primary p-1.5 rounded hover:bg-primary/10 transition-colors"
                          title="Устгах"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Хуудаслалт */}
          {total > LIMIT && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-30"
              >
                ← Өмнөх
              </button>
              <span className="text-gray-400 text-sm">
                {page} / {Math.ceil(total / LIMIT)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / LIMIT)}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-30"
              >
                Дараах →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}