// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cat, AlertTriangle } from 'lucide-react'
import { getAllAnimals } from '../services/api'

export default function Dashboard() {
  const [randomAnimals, setRandomAnimals] = useState([])
  const [allAnimals, setAllAnimals] = useState([])
  const [loading, setLoading] = useState(true)

  // Hewan yang dapat label khusus
  const extinctLabels = {
    "Badak Bercula Satu": { label: "PUNAH DI ALAM LIAR", color: "bg-red-600" },
    "Harimau Sumatera": { label: "KRITIS TERANCAM", color: "bg-red-700" },
    "Macan Tutul Jawa": { label: "FUNGSIONAL PUNAH", color: "bg-red-800" },
    "Elang Jawa": { label: "KRITIS TERANCAM", color: "bg-orange-600" }
  }

  // Ambil semua hewan sekali
  useEffect(() => {
    getAllAnimals().then(data => {
      setAllAnimals(data)
      setLoading(false)
      // Mulai langsung tampilkan 5 pertama
      rotateAnimals(data)
    })
  }, [])

  // Fungsi untuk ambil 5 hewan acak
  const getRandomFive = (animals) => {
    const shuffled = [...animals].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 5)
  }

  // Ganti 5 hewan setiap 5 detik
  const rotateAnimals = (animals) => {
    setRandomAnimals(getRandomFive(animals))
  }

  useEffect(() => {
    if (allAnimals.length === 0) return

    const interval = setInterval(() => {
      rotateAnimals(allAnimals)
    }, 5000) // Ganti setiap 5 detik

    return () => clearInterval(interval)
  }, [allAnimals])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-32 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark-red border-t-transparent"></div>
          <p className="mt-4 text-xl text-dark-red">Memuat hewan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 px-6 pb-32 bg-cream">
      {/* Hero */}
      <div className="text-center mb-12">
        <Cat size={80} className="mx-auto text-dark-red mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold text-dark-red mb-4">Selamat Datang di Zoopedia!</h1>
        <p className="text-lg text-beige max-w-md mx-auto">
          Jelajahi ratusan hewan dari seluruh dunia, tambahkan favoritmu,
          dan pelajari fakta menarik selama perjalanan di Taman Safari.
        </p>
      </div>

      {/* Featured Animals - Berganti Otomatis */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="text-red-600" size={32} />
          <h2 className="text-2xl font-bold text-dark-red">Hewan yang Perlu Perhatian</h2>
        </div>
        <p className="text-beige mb-8 text-sm">Berganti setiap 5 detik • Klik untuk detail</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {randomAnimals.map((animal, index) => {
            const labelInfo = extinctLabels[animal.nama]

            return (
              <Link
                key={animal.id}
                to={`/animals/${animal.id}`}
                className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={animal.gambar}
                    alt={animal.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Label Khusus */}
                  {labelInfo && (
                    <div className={`absolute top-3 right-3 ${labelInfo.color} text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}>
                      <AlertTriangle size={14} />
                      {labelInfo.label}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{animal.nama}</h3>
                    <p className="text-sm opacity-90 italic">{animal.nama_latin}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {animal.deskripsi}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Menampilkan hewan secara acak • Refresh halaman untuk melihat yang lain
          </p>
        </div>
      </div>
    </div>
  )
}