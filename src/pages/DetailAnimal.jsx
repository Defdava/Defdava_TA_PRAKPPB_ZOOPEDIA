// src/pages/DetailAnimal.jsx → FINAL: MOBILE & DESKTOP SEMPURNA!
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimalById } from '../services/api'
import { ArrowLeft } from 'lucide-react'

export default function DetailAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)

  useEffect(() => {
    getAnimalById(id).then(setAnimal)
  }, [id])

  if (!animal) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center safe-top safe-bottom">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-beige border-t-dark-red mx-auto mb-6"></div>
          <p className="text-dark-red text-2xl font-bold">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-20 safe-bottom">

      {/* TOMBOL KEMBALI — AMAN DARI NOTCH */}
      <button
        onClick={() => navigate(-1)}
        className="fixed back-button z-50 flex items-center gap-3 bg-dark-red/95 backdrop-blur-md text-cream px-6 py-3 rounded-full font-bold text-base shadow-2xl hover:bg-red-800 transition-all hover:scale-105"
      >
        <ArrowLeft size={24} />
        Kembali
      </button>

      {/* GAMBAR UTAMA — FULL UTUH, DI-SCALE SEDANG, CANTIK DI HP & DESKTOP */}
      <div className="w-full max-w-5xl mx-auto detail-image-container">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-beige detail-image">
          <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/9] relative">
            <img
              src={animal.gambar}
              alt={animal.nama}
              className="w-full h-full object-contain bg-black/5 p-4 md:p-8"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* NAMA HEWAN — DRAMATIS & RESPONSIVE */}
      <div className="px-6 py-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-dark-red leading-tight detail-title">
          {animal.nama}
        </h1>
        <p className="text-2xl md:text-4xl italic text-beige mt-4 font-medium tracking-wider detail-latin">
          {animal.nama_latin}
        </p>
      </div>

      {/* DESKRIPSI — MUDAH DIBACA DI HP */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-beige">
          <p className="text-beige text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line font-medium">
            {animal.deskripsi}
          </p>
        </div>
      </div>

      {/* SPACE UNTUK BOTTOMNAV */}
      <div className="h-32"></div>
    </div>
  )
}