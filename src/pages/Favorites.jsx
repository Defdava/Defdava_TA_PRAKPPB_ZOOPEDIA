// src/pages/Favorites.jsx → REAL-TIME INSTAN, RAPIH, DAN LANGSUNG UPDATE!
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, AlertCircle } from 'lucide-react'
import { getAllAnimals } from '../services/api'
import { getFavorites, toggleFavorite } from '../lib/Favorites' // sesuai file kamu

export default function Favorites() {
  const [favorites, setFavorites] = useState([]) // hanya ID
  const [animals, setAnimals] = useState([])

  // Load semua hewan
  useEffect(() => {
    const load = async () => {
      const data = await getAllAnimals()
      setAnimals(data)
    }
    load()
  }, [])

  // Update daftar favorit secara real-time
  useEffect(() => {
    const updateFavorites = () => {
      setFavorites(getFavorites())
    }

    updateFavorites() // pertama kali
    window.addEventListener('favorites-updated', updateFavorites)

    return () => window.removeEventListener('favorites-updated', updateFavorites)
  }, [])

  // Filter hewan yang jadi favorit
  const favoriteAnimals = animals.filter(animal => favorites.includes(animal.id))

  // Hapus dari favorit — langsung update visual + storage
  const removeFavorite = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(id) // otomatis trigger event → semua halaman update
  }

  if (favoriteAnimals.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-6 pb-32 text-center">
        <AlertCircle size={90} className="mx-auto text-beige mb-8 opacity-80" />
        <h1 className="text-5xl font-bold text-dark-red mb-6">Belum Ada Favorit</h1>
        <p className="text-xl text-beige max-w-md mx-auto">
          Yuk tambahkan hewan favoritmu dengan menekan ikon hati di daftar hewan!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 px-6 pb-32">
      <h1 className="text-5xl font-bold text-dark-red text-center mb-12 tracking-tight">
        Hewan Favoritku
      </h1>

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

            {/* TOMBOL HAPUS FAVORIT — MERAH & JELAS */}
            <button
              onClick={(e) => removeFavorite(e, animal.id)}
              className="absolute top-4 right-4 bg-cream p-3.5 rounded-full shadow-2xl border-4 border-dark-red hover:scale-110 transition-all duration-300 z-10"
            >
              <Heart size={28} className="fill-dark-red text-dark-red drop-shadow-lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}