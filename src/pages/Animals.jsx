// src/pages/Animals.jsx — FINAL AUTO REFRESH + LAZY + PAGINATION
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import { toggleFavorite, isFavorite } from '../lib/Favorites'

const ITEMS_PER_PAGE = 8

export default function Animals() {
  const [animals, setAnimals] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState({})

  /* ================================
     LOAD DATA
  ================================= */
  const loadAnimals = async () => {
    setLoading(true)
    const data = await getAllAnimals()
    setAnimals(data)
    setLoading(false)
  }

  useEffect(() => {
    loadAnimals()
  }, [])

  // Auto refresh setelah upload/edit/delete
  useEffect(() => {
    const handler = () => loadAnimals()
    window.addEventListener('animal-updated', handler)
    return () => window.removeEventListener('animal-updated', handler)
  }, [])

  /* ================================
     FAVORITES
  ================================= */
  useEffect(() => {
    const updateFav = () => {
      let map = {}
      animals.forEach(a => map[a.id] = isFavorite(a.id))
      setFavorites(map)
    }
    updateFav()

    window.addEventListener('favorites-updated', updateFav)
    return () => window.removeEventListener('favorites-updated', updateFav)
  }, [animals])

  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    const status = toggleFavorite(id)
    setFavorites(prev => ({ ...prev, [id]: status }))
  }

  /* ================================
     FILTER & PAGINATION
  ================================= */
  const filtered = animals.filter(a =>
    a.nama.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const sliceStart = (currentPage - 1) * ITEMS_PER_PAGE
  const items = filtered.slice(sliceStart, sliceStart + ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen pt-20 px-4 pb-32 bg-cream">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-black text-center text-dark-red mb-4">
          Koleksi Hewan
        </h1>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dark-red" size={26} />
          <input
            type="text"
            placeholder="Cari hewan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-14 pr-6 py-4 rounded-full border-4 border-beige focus:border-dark-red outline-none text-lg font-medium shadow-xl"
          />
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl font-black text-dark-red">Tidak ada hewan ditemukan</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map(a => (
                <AnimalCard
                  key={a.id}
                  animal={a}
                  isFav={favorites[a.id]}
                  onFav={handleFavorite}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-300"
                >
                  <ChevronLeft size={26} />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-full font-bold ${
                      currentPage === i + 1
                        ? 'bg-dark-red text-cream'
                        : 'bg-beige hover:bg-orange-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-dark-red text-cream disabled:bg-gray-300"
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
   CARD COMPONENT
================================================ */
function AnimalCard({ animal, isFav, onFav }) {
  const imgRef = useRef()

  // Lazy load
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          imgRef.current.src = animal.gambar
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    obs.observe(imgRef.current)
    return () => obs.disconnect()
  }, [animal.gambar])

  return (
    <Link to={`/animals/${animal.id}`} className="group block">
      <div className="bg-white border-4 border-beige rounded-2xl shadow-xl overflow-hidden hover:border-dark-red transition">
        <div className="relative h-44 bg-gray-200">
          <img
            ref={imgRef}
            src=""
            alt={animal.nama}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => onFav(e, animal.id)}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-lg ${
              isFav ? 'bg-red-600 text-white' : 'bg-white'
            }`}
          >
            <Heart size={20} className={isFav ? 'fill-white' : ''} />
          </button>
        </div>

        <div className="p-4 text-center">
          <h3 className="font-black text-lg text-dark-red">{animal.nama}</h3>
        </div>
      </div>
    </Link>
  )
}

/* ================================================
   LOADING SKELETON
================================================ */
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-gray-300 h-52 rounded-2xl animate-pulse" />
      ))}
    </div>
  )
}
