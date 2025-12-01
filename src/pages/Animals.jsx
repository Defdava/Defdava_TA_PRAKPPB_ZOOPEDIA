// src/pages/Animals.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, Filter, ArrowUpDown } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import { toggleFavorite, isFavorite } from '../lib/Favorites'

const ITEMS_PER_PAGE = 8

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'LC', label: 'Least Concern (LC)' },
  { value: 'NT', label: 'Near Threatened (NT)' },
  { value: 'VU', label: 'Vulnerable (VU)' },
  { value: 'EN', label: 'Endangered (EN)' },
  { value: 'CR', label: 'Critically Endangered (CR)' },
  { value: 'EW', label: 'Extinct in the Wild (EW)' },
  { value: 'EX', label: 'Extinct (EX)' }
]

export default function Animals() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const [favorites, setFavorites] = useState({})

  const [page, setPage] = useState(1)

  // ==================== LOAD DATA ====================
  useEffect(() => {
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
    loadAnimals()
  }, [])

  // Auto refresh jika ada perubahan
  useEffect(() => {
    const handler = () => {
      const reload = async () => {
        const data = await getAllAnimals()
        setAnimals(data || [])
      }
      reload()
    }
    window.addEventListener('animal-updated', handler)
    return () => window.removeEventListener('animal-updated', handler)
  }, [])

  // ==================== FAVORITES ====================
  useEffect(() => {
    const map = {}
    animals.forEach(a => (map[a.id] = isFavorite(a.id)))
    setFavorites(map)
  }, [animals])

  const handleFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    const now = toggleFavorite(id)
    setFavorites(prev => ({ ...prev, [id]: now }))
  }

  // ==================== FILTER ====================
  const filtered = animals
    .filter(
      a =>
        a.nama?.toLowerCase().includes(search.toLowerCase()) ||
        a.nama_latin?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(a => (statusFilter ? a.condition === statusFilter : true))

  // ==================== SORTING ====================
  const sorted = filtered.sort((a, b) =>
    sortOrder === 'asc'
      ? a.nama.localeCompare(b.nama)
      : b.nama.localeCompare(a.nama)
  )

  // ==================== PAGINATION ====================
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentItems = sorted.slice(start, start + ITEMS_PER_PAGE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-32 bg-cream">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl font-black text-center text-dark-red mb-4">Koleksi Hewan</h1>
        <p className="text-center text-lg text-gray-700 mb-10">Jelajahi satwa Indonesia</p>

        {/* Search + Filter + Sorting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-red" size={22} />
            <input
              type="text"
              placeholder="Cari hewan..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-red" size={22} />
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-red" size={22} />
            <select
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value)
                setPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow cursor-pointer"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <LoadingSkeleton />
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl font-black text-dark-red">Tidak ada hewan ditemukan</p>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map(animal => (
                <Card
                  key={animal.id}
                  animal={animal}
                  isFav={favorites[animal.id]}
                  onFav={handleFavorite}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`w-12 h-12 rounded-full font-bold transition-all ${
                      page === i + 1
                        ? 'bg-red-700 text-cream scale-110 shadow-xl'
                        : 'bg-cream text-dark-red hover:bg-beige'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

// ==================== CARD COMPONENT ====================
function Card({ animal, isFav, onFav }) {
  return (
    <div className="group relative">
      <Link
        to={`/animals/${animal.id}`}
        className="block rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      >
        {/* IMAGE - LAZY LOAD */}
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={animal.gambar}
            alt={animal.nama}
            loading="lazy" // LAZY LOAD GAMBAR
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 text-center space-y-1 min-h-[90px] flex flex-col justify-center">
          <h3 className="text-lg font-bold text-dark-red line-clamp-2">
            {animal.nama}
          </h3>
          {animal.nama_latin && (
            <p className="text-sm text-gray-600 italic line-clamp-1">
              {animal.nama_latin}
            </p>
          )}
        </div>
      </Link>

      {/* FAVORITE BUTTON */}
      <button
        onClick={e => onFav(e, animal.id)}
        className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all z-10 hover:scale-110 active:scale-95 ${
          isFav
            ? 'bg-red-600 text-white ring-4 ring-red-300'
            : 'bg-white/90 text-gray-700 ring-1 ring-gray-300 hover:ring-dark-red'
        }`}
      >
        <Heart size={20} className={isFav ? 'fill-current' : ''} />
      </button>
    </div>
  )
}

// ==================== LOADING SKELETON ====================
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 border border-beige rounded-2xl h-64 animate-pulse"
        />
      ))}
    </div>
  )
}
