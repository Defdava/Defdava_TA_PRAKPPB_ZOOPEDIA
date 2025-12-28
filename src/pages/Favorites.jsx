// src/pages/Favorites.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, AlertCircle, Loader2 } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import Auth from '../lib/Auth'

export default function Favorites() {
  const [animals, setAnimals] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load semua hewan sekali saja
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const data = await getAllAnimals()
        setAnimals(data || [])
      } catch (err) {
        console.error('Gagal memuat daftar hewan:', err)
      }
    }
    loadAnimals()
  }, [])

  // Sinkronisasi dengan Auth (real-time)
  useEffect(() => {
    const updateState = () => {
      setFavorites(Auth.getFavorites())
      setLoading(false)
    }

    // Initial
    updateState()

    // Subscribe ke perubahan
    Auth.subscribe(updateState)

    return () => {
      Auth.unsubscribe(updateState)
    }
  }, [])

  const handleRemoveFavorite = async (e, animalId) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await Auth.toggleFavorite(animalId)
      // Visual update sudah otomatis lewat subscription
    } catch (err) {
      console.error('Gagal menghapus favorit:', err)
      setError('Gagal menghapus dari favorit. Coba lagi nanti.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-dark-red" />
          <p className="text-beige">Memuat daftar favorit...</p>
        </div>
      </div>
    )
  }

  const favoriteAnimals = animals.filter(a => favorites.includes(a.id))

  if (favoriteAnimals.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-6 pb-32 text-center">
        <AlertCircle size={90} className="mx-auto text-beige mb-8 opacity-80" />
        <h1 className="text-5xl font-bold text-dark-red mb-6">Belum Ada Favorit</h1>
        <p className="text-xl text-beige max-w-md mx-auto">
          {Auth.isAuthenticated()
            ? 'Tambahkan hewan favoritmu dengan menekan ikon hati di halaman daftar hewan!'
            : 'Login terlebih dahulu untuk bisa menyimpan hewan favorit secara permanen'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 px-6 pb-32">
      <h1 className="text-5xl font-bold text-dark-red text-center mb-12 tracking-tight">
        Hewan Favoritku
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 max-w-3xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {favoriteAnimals.map(animal => (
          <div key={animal.id} className="group relative">
            <Link to={`/animals/${animal.id}`} className="block">
              <div className="bg-cream rounded-3xl shadow-2xl overflow-hidden border-4 border-dark-red transition-all duration-300 group-hover:border-red-800 group-hover:scale-105">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={animal.gambar}
                    alt={animal.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-red/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-dark-red text-xl">{animal.nama}</h3>
                  <p className="text-sm text-beige italic mt-1">{animal.nama_latin}</p>
                </div>
              </div>
            </Link>

            <button
              onClick={(e) => handleRemoveFavorite(e, animal.id)}
              className="absolute top-4 right-4 bg-cream p-3.5 rounded-full shadow-2xl border-4 border-dark-red hover:scale-110 transition-all duration-300 z-10"
              title="Hapus dari favorit"
            >
              <Heart size={28} className="fill-dark-red text-dark-red drop-shadow-lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
