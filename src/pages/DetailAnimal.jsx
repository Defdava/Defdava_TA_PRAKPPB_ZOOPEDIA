// src/pages/DetailAnimal.jsx → FINAL + FITUR SHARE LINK!
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

  const handleShare = () => {
    const url = window.location.href
    const title = `${animal.nama} - Zoopedia`
    const text = `Lihat info lengkap ${animal.nama} (${animal.nama_latin}) di Zoopedia!`

    if (navigator.share) {
      // HP Android / iPhone → buka menu share (WA, IG, TikTok, dll)
      navigator.share({ title, text, url })
        .catch(() => alert('Gagal share, tapi link sudah disalin!'))
    } else {
      // PC / Laptop → copy otomatis ke clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link berhasil disalin! Kirim ke temanmu sekarang!')
      })
    }
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-beige border-t-dark-red mx-auto mb-6"></div>
          <p className="text-dark-red text-2xl font-bold">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-20">

      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => navigate(-1)}
        className="fixed back-button left-4 z-50 flex items-center gap-3 bg-dark-red/95 backdrop-blur-md text-cream px-6 py-3 rounded-full font-bold text-base shadow-2xl hover:bg-red-800 transition-all hover:scale-105"
      >
        <ArrowLeft size={24} />
        Kembali
      </button>

      {/* GAMBAR HEWAN */}
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

      {/* NAMA HEWAN */}
      <div className="px-6 py-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-dark-red leading-tight detail-title">
          {animal.nama}
        </h1>
        <p className="text-2xl md:text-4xl italic text-beige mt-4 font-medium tracking-wider detail-latin">
          {animal.nama_latin}
        </p>
      </div>

      {/* DESKRIPSI */}
      <div className="px-6 py-8508 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-beige">
          <p className="text-beige text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line font-medium">
            {animal.deskripsi}
          </p>
        </div>
      </div>

      {/* TOMBOL SHARE — KEREN BANGET! */}
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-cream font-black py-6 rounded-3xl text-2xl shadow-2xl flex items-center justify-center gap-5 transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12l7.13-4.85c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.85c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          BAGIKAN KE TEMANMU!
        </button>
      </div>

      {/* SPACE UNTUK BOTTOMNAV */}
      <div className="h-32"></div>
    </div>
  )
}