// src/pages/Animals.jsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, Filter, ArrowUpDown } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import { toggleFavorite, isFavorite } from '../lib/Favorites'

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
  const [visibleCards, setVisibleCards] = useState(8)

  const lazyRef = useRef()

  // ==================== LOAD HEWAN ====================
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

  // Auto refresh kalau ada upload/edit
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

  // ==================== LAZY LOAD (BENAR) ====================
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCards(prev => prev + 6)
        }
      },
      { threshold: 1 }
    )

    if (lazyRef.current) observer.observe(lazyRef.current)

    return () => observer.disconnect()
  }, [])

  const shownItems = sorted.slice(0, visibleCards)

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
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-red" size={22} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort A-Z / Z-A */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-red" size={22} />
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-4 border-beige focus:border-dark-red outline-none font-medium text-lg shadow cursor-pointer"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>

        </div>

        {/* List Hewan */}
        {loading ? (
          <LoadingSkeleton />
        ) : shownItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl font-black text-dark-red">Tidak ada hewan ditemukan</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {shownItems.map(animal => (
                <Card
                  key={animal.id}
                  animal={animal}
                  isFav={favorites[animal.id]}
                  onFav={handleFavorite}
                />
              ))}
            </div>

            {/* Lazy load trigger */}
            <div ref={lazyRef} className="h-12"></div>
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
        {/* IMAGE */}
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={animal.gambar}
            alt={animal.nama}
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
