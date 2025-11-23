// src/pages/DetailAnimal.jsx → FINAL + FITUR SHARE SAKTI!
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimalById } from '../services/api'
import { ArrowLeft, Share2 } from 'lucide-react'

export default function DetailAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)

  useEffect(() => {
    getAnimalById(id).then(setAnimal)
  }, [id])

  // FITUR SHARE SAKTI: Simpan ID hewan ke sessionStorage biar tetap ke hewan ini setelah login!
  const handleShare = () => {
    // Simpan ID hewan yang mau dishare
    sessionStorage.setItem('sharedAnimalId', id)

    // Buat link share (bisa pakai ?share=animal-5 atau langsung /animals/5)
    const shareUrl = `${window.location.origin}/animals/${id}`

    if (navigator.share) {
      navigator.share({
        title: `${animal?.nama || 'Hewan'} - Zoopedia Indonesia`,
        text: `Lihat info lengkap ${animal?.nama || 'hewan ini'} (${animal?.nama_latin || ''}) di Zoopedia!`,
        url: shareUrl
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl)
        alert('Link berhasil disalin ke clipboard!')
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link berhasil disalin! Kirim ke temanmu sekarang!')
    }
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-beige border-t-dark-red mx-auto mb-6"></div>
          <p className="text-dark-red text-2xl font-bold">Memuat Hewan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-32">

      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-dark-red/95 backdrop-blur-md text-cream px-6 py-3 rounded-full font-bold text-base shadow-2xl hover:bg-red-800 transition-all hover:scale-105"
      >
        <ArrowLeft size={24} />
        Kembali
      </button>

      {/* TOMBOL SHARE — FIXED DI BAWAH KANAN */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-4 z-50 bg-gradient-to-br from-emerald-600 to-green-700 text-cream px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold text-lg hover:scale-110 transition-all active:scale-95"
      >
        <Share2 size={28} />
        Bagikan
      </button>

      {/* GAMBAR HEWAN */}
      <div className="w-full max-w-5xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-beige">
          <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/9] relative bg-black/10">
            <img
              src={animal.gambar}
              alt={animal.nama}
              className="w-full h-full object-contain p-4 md:p-8"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* NAMA HEWAN */}
      <div className="px-6 py-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-dark-red leading-tight">
          {animal.nama}
        </h1>
        <p className="text-2xl md:text-4xl italic text-beige mt-4 font-medium tracking-wider">
          {animal.nama_latin}
        </p>
      </div>

      {/* DESKRIPSI */}
      <div className="px-6 max-w-4xl mx-auto">
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