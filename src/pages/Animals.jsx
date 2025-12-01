// src/pages/Animals.jsx → FINAL: 6 HEWAN (3+3) + AUTO REFRESH + VERCEL FRIENDLY + FAVORIT
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import { toggleFavorite, isFavorite } from '../lib/Favorites'

const ITEMS_PER_PAGE = 6

export default function Animals() {
  const [animals, setAnimals] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState({})

  // Muat ulang data hewan
  const loadAnimals = async () => {
    try {
      setLoading(true)
      const data = await getAllAnimals()
      setAnimals(data || [])
    } catch (err) {
      console.error('Gagal memuat hewan:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load pertama kali
  useEffect(() => {
    loadAnimals()
  }, [])

  // Dengarkan event upload/edit → otomatis refresh
  useEffect(() => {
    const handler = () => loadAnimals()
    window.addEventListener('animal-updated', handler)
    return () => window.removeEventListener('animal-updated', handler)
  }, [])

  // Update status favorit
  useEffect(() => {
    const updateFav = () => {
      const newFavs = {}
      animals.forEach(a => {
        newFavs[a.id] = isFavorite(a.id)
      })
      setFavorites(newFavs)
    }
    updateFav()
    window.addEventListener('favorites-updated', updateFav)
    return () => window.removeEventListener('favorites-updated', updateFav)
  }, [animals])

  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id)
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter & Pagination
  const filtered = animals.filter(animal =>
    animal.nama.toLowerCase().includes(search.toLowerCase()) ||
    (animal.nama_latin && animal.nama_latin.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filtered.slice(start, start + ITEMS_PER_PAGE)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-32 bg-cream">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-black text-center text-dark-red mb-4">Koleksi Hewan</h1>
        <p className="text-center text-lg text-gray-700 mb-10">Jelajahi satwa Indonesia</p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-red" size={26} />
          <input
            type="text"
            placeholder="Cari hewan..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
            className="w-full pl-14 pr-6 py-4 rounded-full border-4 border-beige focus:border-dark-red outline-none text-lg font-medium shadow-xl"
          />
        </div>

        {/* Loading */}
        {loading && animals.length === 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 rounded-2xl h-56 animate-pulse" />)}
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-gray-200 rounded-2xl h-56 animate-pulse" />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl font-black text-dark-red">Tidak ada hewan ditemukan</p>
          </div>
        ) : (
          <>
            {/* Layout 3 atas + 3 bawah */}
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                {currentItems.slice(0, 3).map(animal => (
                  <Card key={animal.id} animal={animal} isFav={favorites[animal.id]} onFav={handleFavorite} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                {currentItems.slice(3, 6).map(animal => (
                  <Card key={animal.id} animal={animal} isFav={favorites[animal.id]} onFav={handleFavorite} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-300 hover:scale-110 transition-all">
                  <ChevronLeft size={28} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-12 h-12 rounded-full font-bold transition-all ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-orange-600 to-red-700 text-cream scale-110 shadow-xl'
                          : 'bg-cream text-dark-red hover:bg-beige'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-300 hover:scale-110 transition-all">
                  <ChevronRight size={28} />
                </button>
              </div>
            )}

            <p className="text-center mt-8 text-gray-600 font-medium">
              Halaman {currentPage} dari {totalPages} • {filtered.length} hewan
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// Card Component — Rapih & Konsisten
function Card({ animal, isFav, onFav }) {
  return (
    <div className="group relative">
      <Link to={`/animals/${animal.id}`} className="block">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-beige group-hover:border-dark-red transition-all duration-300 hover:shadow-2xl">
          <div className="h-48 relative overflow-hidden bg-gray-100">
            <img
              src={animal.gambar}
              alt={animal.nama}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div className="p-4 text-center">
            <h3 className="text-lg font-black text-dark-red leading-tight">
              {animal.nama}
            </h3>
          </div>
        </div>
      </Link>

      {/* Tombol Favorit */}
      <button
        onClick={(e) => onFav(e, animal.id)}
        className="absolute top-3 right-3 bg-cream/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg ring-4 ring-cream hover:ring-dark-red transition-all z-10"
      >
        <Heart size={22} className={isFav ? "fill-red-600 text-red-600" : "text-gray-700"} />
      </button>
    </div>
  )
}