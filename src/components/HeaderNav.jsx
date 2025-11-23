// src/components/HeaderNav.jsx → FINAL: DI DASHBOARD ADA TOMBOL "HEWAN" DI KANAN!
import { ArrowLeft, ArrowRight, Cat, PawPrint } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const pages = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/animals', name: 'Hewan' },
  { path: '/education', name: 'Edukasi' },
  { path: '/favorites', name: 'Favorit' },
  { path: '/profile', name: 'Profil' }
]

export default function HeaderNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentIndex = pages.findIndex(p => p.path === location.pathname)
  const currentPage = pages[currentIndex] || pages[0]
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null

  const isDashboard = location.pathname === '/dashboard'

  return (
    <header className="bg-dark-red text-cream shadow-2xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 min-h-[80px]">

        {/* Kiri: Previous (hanya muncul kalau bukan Dashboard) */}
        {!isDashboard && (
          <button
            onClick={() => prevPage && navigate(prevPage.path)}
            disabled={!prevPage}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
              prevPage
                ? 'bg-mid-red hover:bg-red-800 shadow-lg hover:scale-105'
                : 'bg-dark-red/40 cursor-not-allowed opacity-50'
            }`}
          >
            <ArrowLeft size={26} />
            <span className="hidden sm:inline">{prevPage?.name || 'Awal'}</span>
          </button>
        )}

        {/* Tengah: Logo + Judul */}
        <div className={`flex items-center gap-3 ${isDashboard ? 'mx-auto' : ''}`}>
          <div className="p-2 bg-cream/20 rounded-xl animate-pulse">
            <Cat size={38} className="text-cream drop-shadow-lg" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-wider">ZOOPEDIA</h1>
            <p className="text-xs opacity-90 -mt-1">
              {isDashboard ? 'Selamat Datang!' : currentPage.name}
            </p>
          </div>
        </div>

        {/* Kanan: 
            - Kalau di Dashboard → TOMBOL HEWAN BESAR
            - Kalau di halaman lain → Tombol Next */}
        {isDashboard ? (
          <button
            onClick={() => navigate('/animals')}
            className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-cream font-black text-xl px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:scale-110 transition-all duration-300 animate-pulse"
          >
            <PawPrint size={36} className="drop-shadow-lg" />
            Hewan
          </button>
        ) : (
          <button
            onClick={() => nextPage && navigate(nextPage.path)}
            disabled={!nextPage}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all flex-row-reverse ${
              nextPage
                ? 'bg-mid-red hover:bg-red-800 shadow-lg hover:scale-105'
                : 'bg-dark-red/40 cursor-not-allowed opacity-50'
            }`}
          >
            <ArrowRight size={26} />
            <span className="hidden sm:inline">{nextPage?.name || 'Akhir'}</span>
          </button>
        )}
      </div>

      {/* Progress Bar — Hanya muncul kalau bukan Dashboard */}
      {!isDashboard && (
        <div className="h-2 bg-dark-red/40 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-red-600 to-beige transition-all duration-700 ease-out"
            style={{ width: `${((currentIndex + 1) / pages.length) * 100}%` }}
          />
        </div>
      )}
    </header>
  )
}