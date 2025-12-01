// src/pages/Animals.jsx → FINAL: AUTO-REFRESH SETELAH UPLOAD & EDIT
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

  // 🔥 Fungsi muat ulang data
  const loadAnimals = async () => {
    setLoading(true)
    const data = await getAllAnimals()
    setAnimals(data || [])
    setLoading(false)
  }

  // 🔥 Load pertama kali
  useEffect(() => {
    loadAnimals()
  }, [])

  // 🔥 Dengarkan event “animal-updated”
  useEffect(() => {
    const refresh = () => loadAnimals()
    window.addEventListener("animal-updated", refresh)

    return () => window.removeEventListener("animal-updated", refresh)
  }, [])

  // Update favorit
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
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
    toggleFavorite(id)
  }

  // Filter pencarian
  const filtered = animals.filter(animal =>
    animal.nama.toLowerCase().includes(search.toLowerCase()) ||
    animal.nama_latin.toLowerCase().includes(search.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentAnimals = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-32 bg-cream">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl font-black text-center text-dark-red mb-6">Daftar Hewan</h1>
        <p className="text-center text-beige text-lg mb-10">Temukan satwa endemik Indonesia</p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-5 top-5 text-beige" size={28} />
          <input
            type="text"
            placeholder="Cari nama hewan atau nama latin..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-16 pr-8 py-5 rounded-full border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-2xl transition-all"
          />
        </div>

        {/* Info hasil */}
        <p className="text-center text-beige mb-8 font-medium">
          Menampilkan {currentAnimals.length} dari {filtered.length} hewan
          {search && ` untuk "${search}"`}
        </p>

        {/* Grid Hewan */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 border-2 border-dashed rounded-3xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl text-beige">Tidak ditemukan hewan</p>
            <p className="text-xl text-beige/70 mt-4">Coba kata kunci lain ya!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16">
              {currentAnimals.map(animal => (
                <div key={animal.id} className="group relative">
                  <Link to={`/animals/${animal.id}`} className="block">
                    <div className="bg-cream rounded-3xl shadow-2xl overflow-hidden border-4 border-beige group-hover:border-dark-red transition-all duration-300 hover:scale-105">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={animal.gambar}
                          alt={animal.nama}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-red/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 text-center">
                        <h3 className="font-black text-dark-red text-xl">{animal.nama}</h3>
                        <p className="text-sm text-beige italic font-medium">{animal.nama_latin}</p>
                      </div>
                    </div>
                  </Link>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => handleFavorite(e, animal.id)}
                    className="absolute top-4 right-4 bg-cream/95 backdrop-blur-xl p-4 rounded-full shadow-2xl ring-4 ring-cream hover:ring-dark-red transition-all hover:scale-125 z-10"
                  >
                    <Heart
                      size={32}
                      className={`drop-shadow-lg transition-all duration-300 ${
                        favorites[animal.id]
                          ? 'fill-red-600 text-red-600 scale-110'
                          : 'text-beige hover:text-dark-red'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-16">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-4 rounded-full shadow-xl transition-all ${
                    currentPage === 1
                      ? 'bg-beige/50 text-beige cursor-not-allowed'
                      : 'bg-dark-red text-cream hover:bg-red-800 hover:scale-110'
                  }`}
                >
                  <ChevronLeft size={32} />
                </button>

                <div className="flex gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-14 h-14 rounded-full font-black text-xl shadow-xl transition-all ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-orange-600 to-red-700 text-cream scale-110'
                          : 'bg-cream text-dark-red hover:bg-beige hover:scale-105'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-4 rounded-full shadow-xl transition-all ${
                    currentPage === totalPages
                      ? 'bg-beige/50 text-beige cursor-not-allowed'
                      : 'bg-dark-red text-cream hover:bg-red-800 hover:scale-110'
                  }`}
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            )}

            {/* Info halaman */}
            <p className="text-center mt-8 text-beige font-medium">
              Halaman {currentPage} dari {totalPages}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
