import { Heart } from 'lucide-react'
import Auth from '../lib/Auth'

export default function AnimalCard({ animal, onClick }) {
  const isFav = Auth.getFavorites().includes(animal.id)

  const toggleFav = (e) => {
    e.stopPropagation()
    Auth.toggleFavorite(animal.id)
    window.location.reload() // simple refresh
  }

  return (
    <div onClick={() => onClick(animal.id)} className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition">
      <div className="relative">
        <img src={animal.gambar} alt={animal.nama} className="w-full h-48 object-cover" />
        <button onClick={toggleFav} className="absolute top-2 right-2 bg-white/80 p-2 rounded-full">
          <Heart size={20} className={isFav ? 'fill-red-600 text-red-600' : ''} />
        </button>
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-lg text-dark-red">{animal.nama}</h3>
        <p className="text-sm text-beige">{animal.nama_latin}</p>
      </div>
    </div>
  )
}