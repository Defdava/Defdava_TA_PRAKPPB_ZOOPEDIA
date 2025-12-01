// src/pages/UploadAnimal.jsx → CANTIK, RAPIH, SESUAI STYLE ZOOPEDIA
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, AlertCircle, Loader2, Globe, BookOpen, Camera, FileText } from 'lucide-react'
import Auth from '../lib/Auth'

const API_URL = "https://apihewann.vercel.app/hewan"

export default function UploadAnimal() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    name_latin: '',
    image_url: '',
    origin: '',
    short_description: '',
    long_description: ''
  })

  // Cek Admin
  if (!Auth.isAdmin()) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-32 px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md border-4 border-red-200">
          <AlertCircle size={80} className="mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-black text-dark-red mb-4">Akses Ditolak</h1>
          <p className="text-lg text-gray-700 mb-8">Hanya Admin yang bisa mengunggah hewan baru</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-dark-red text-cream font-black px-10 py-4 rounded-xl hover:scale-105 transition-all shadow-xl"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        alert('Hewan berhasil ditambahkan!')
        navigate('/animals')
      } else {
        const err = await res.text()
        alert('Gagal upload: ' + err)
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/animals')}
            className="flex items-center gap-3 text-dark-red font-bold text-lg hover:text-orange-600 transition-all"
          >
            <ArrowLeft size={28} />
            Kembali ke Daftar Hewan
          </button>
          <h1 className="text-5xl font-black text-dark-red mt-6 text-center">
            Upload Hewan Baru
          </h1>
          <p className="text-center text-xl text-gray-700 mt-3 font-medium">
            Tambahkan hewan baru ke koleksi Zoopedia
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-beige">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Nama Hewan */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Camera size={28} className="text-orange-600" />
                Nama Hewan
              </label>
              <input
                type="text"
                placeholder="Contoh: Harimau Sumatera"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium transition-all"
                required
              />
            </div>

            {/* Nama Latin */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <BookOpen size={28} className="text-purple-600" />
                Nama Latin
              </label>
              <input
                type="text"
                placeholder="Contoh: Panthera tigris sumatrae"
                value={form.name_latin}
                onChange={e => setForm({...form, name_latin: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg italic"
                required
              />
            </div>

            {/* URL Gambar */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Globe size={28} className="text-blue-600" />
                URL Gambar
              </label>
              <input
                type="url"
                placeholder="https://example.com/hewan.jpg"
                value={form.image_url}
                onChange={e => setForm({...form, image_url: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium"
                required
              />
            </div>

            {/* Asal */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Globe size={28} className="text-green-600" />
                Asal / Habitat
              </label>
              <input
                type="text"
                placeholder="Contoh: Sumatera, Indonesia"
                value={form.origin}
                onChange={e => setForm({...form, origin: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium"
                required
              />
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <FileText size={28} className="text-indigo-600" />
                Deskripsi Singkat
              </label>
              <textarea
                placeholder="Maksimal 2-3 kalimat ringkas tentang hewan ini..."
                value={form.short_description}
                onChange={e => setForm({...form, short_description: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg h-32 resize-none"
                required
              />
            </div>

            {/* Deskripsi Panjang */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <BookOpen size={28} className="text-teal-600" />
                Deskripsi Lengkap
              </label>
              <textarea
                placeholder="Ceritakan lebih detail: habitat, makanan, perilaku, status konservasi, fakta menarik..."
                value={form.long_description}
                onChange={e => setForm({...form, long_description: e.target.value})}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg h-48 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-cream font-black py-6 rounded-2xl text-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-60 flex items-center justify-center gap-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={36} />
                    <span>Mengunggah Hewan...</span>
                  </>
                ) : (
                  <>
                    <Upload size={36} />
                    <span>Upload Hewan Baru</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 font-medium">
          <p>Terima kasih telah menambah pengetahuan tentang satwa Indonesia</p>
        </div>
      </div>
    </div>
  )
}