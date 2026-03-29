// Файл: frontend/src/components/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Лого + тайлбар */}
          <div>
            <div className="font-display text-2xl tracking-wider mb-3">
              <span className="text-gray-900">SMCAR</span>
              <span className="text-primary">.MN</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Солонгосоос машин захиалах, импортлох найдвартай үйлчилгээ.
              Гааль, тээвэр бүгдийг хариуцна.
            </p>
          </div>

          {/* Холбоос */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Холбоосууд</h3>
            <div className="space-y-2">
              {[
                { to: '/', label: 'Нүүр хуудас' },
                { to: '/vehicles', label: 'Машинууд' },
                { to: '/#how', label: 'Захиалгын заавар' },
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-gray-500 hover:text-gray-900 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Холбоо барих */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Холбоо барих</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📞 +976 72220707</p>
              <p>✉️ info@smcar.mn</p>
              <p>📍 Улаанбаатар, Монгол</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} SMCar.mn — Бүх эрх хуулиар хамгаалагдсан
        </div>
      </div>
    </footer>
  )
}