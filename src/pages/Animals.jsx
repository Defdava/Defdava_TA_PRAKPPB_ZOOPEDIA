// src/pages/Animals.jsx — FINAL dengan Supabase Auth Favorites + Auto Refresh
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import Auth from '../lib/Auth' // ← Gunakan Auth untuk semua operasi favorit

const ITEMS_PER_PAGE = 8

export default function Animals() {
  const [animals, setAnimals] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState({}) // { id: boolean }

  /* ================================
     LOAD DATA HEWAN
  ================================= */
  const loadAnimals = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllAnimals()
      setAnimals(data || [])
    } catch (err) {
      console.error('Gagal memuat daftar hewan:', err)
      setError('Gagal memuat daftar hewan. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnimals()
  }, [])

  // Auto refresh setelah ada perubahan data hewan (upload/edit/delete)
  useEffect(() => {
    const handler = () => loadAnimals()
    window.addEventListener('animal-updated', handler)
    return () => window.removeEventListener('animal-updated', handler)
  }, [])

  /* ================================
     FAVORITES — Sinkronisasi dengan Auth (Supabase)
  ================================= */
  useEffect(() => {
    const updateFavorites = () => {
      const favMap = {}
      animals.forEach(animal => {
        favMap[animal.id] = Auth.isFavorite(animal.id)
      })
      setFavorites(favMap)
    }

    // Initial update
    updateFavorites()

    // Subscribe ke perubahan favorit (real-time)
    Auth.subscribe(updateFavorites)

    return () => {
      Auth.unsubscribe(updateFavorites)
    }
  }, [animals])

  const handleToggleFavorite = async (e, animalId) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await Auth.toggleFavorite(animalId)
      // Update visual akan otomatis lewat subscription
    } catch (err) {
      console.error('Gagal toggle favorite:', err)
      setError(
        err.message?.includes('login')
          ? 'Silakan login terlebih dahulu untuk menyimpan favorit'
          : 'Gagal menyimpan favorit. Coba lagi.'
      )
    }
  }

  /* ================================
     FILTER & PAGINATION
  ================================= */
  const filtered = animals.filter(animal =>
    animal.nama.toLowerCase().includes(search.toLowerCase()) ||
    animal.nama_latin?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const sliceStart = (currentPage - 1) * ITEMS_PER_PAGE
  const currentItems = filtered.slice(sliceStart, sliceStart + ITEMS_PER_PAGE)

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <div className="min-h-screen pt-20 px-4 pb-32 bg-cream">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-black text-center text-dark-red mb-6">
          Koleksi Hewan
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-red" size={28} />
          <input
            type="text"
            placeholder="Cari nama hewan atau nama latin..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-4 rounded-full border-4 border-beige focus:border-dark-red outline-none text-lg font-medium shadow-xl transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl mb-10 flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle size={24} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : currentItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl font-black text-dark-red mb-4">Tidak ditemukan</p>
            <p className="text-xl text-gray-700">
              Tidak ada hewan yang sesuai dengan pencarian "{search}"
            </p>
          </div>
        ) : (
          <>
            {/* Grid Hewan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {currentItems.map(animal => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  isFav={favorites[animal.id] || false}
                  onToggleFav={handleToggleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 md:gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-800 transition"
                >
                  <ChevronLeft size={26} />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  const pageNum = currentPage <= 4
                    ? i + 1
                    : currentPage >= totalPages - 3
                    ? totalPages - 6 + i
                    : currentPage - 3 + i

                  if (pageNum > totalPages || pageNum < 1) return null

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-dark-red text-white'
                          : 'bg-beige hover:bg-orange-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-800 transition"
                >
                  <ChevronRight size={26} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ================================================
   Animal Card Component
================================================ */
function AnimalCard({ animal, isFav, onToggleFav }) {
  const imgRef = useRef()

  // Lazy loading gambar dengan IntersectionObserver
  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          imgRef.current.src = animal.gambar
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(imgRef.current)
    return () => observer.disconnect()
  }, [animal.gambar])

  return (
    <Link to={`/animals/${animal.id}`} className="group block">
      <div className="bg-white border-4 border-beige rounded-2xl shadow-xl overflow-hidden hover:border-dark-red hover:shadow-2xl transition-all duration-300">
        <div className="relative h-52 sm:h-56 bg-gray-100">
          <img
            ref={imgRef}
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" // placeholder
            alt={animal.nama}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Tombol Favorit */}
          <button
            onClick={e => onToggleFav(e, animal.id)}
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all ${
              isFav
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-600'
            }`}
            title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart
              size={22}
              className={isFav ? 'fill-current' : ''}
            />
          </button>
        </div>

        <div className="p-4 text-center">
          <h3 className="font-black text-xl text-dark-red">{animal.nama}</h3>
          {animal.nama_latin && (
            <p className="text-sm text-gray-600 italic mt-1">{animal.nama_latin}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ================================================
   Loading Skeleton
================================================ */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-2xl h-72 animate-pulse"
        />
      ))}
    </div>
  )
}
