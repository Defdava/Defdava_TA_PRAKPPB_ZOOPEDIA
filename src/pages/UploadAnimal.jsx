// src/pages/UploadAnimal.jsx → FINAL (100% Sesuai Tabel Supabase)
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, AlertCircle, Loader2, Globe, BookOpen, Camera, FileText, AlertTriangle } from 'lucide-react'
import Auth from '../lib/Auth'
import { createAnimal } from '../services/api'

const IUCN_STATUS = [
  { value: 'LC', label: 'Least Concern (LC) - Resiko Rendah', color: 'bg-green-500' },
  { value: 'NT', label: 'Near Threatened (NT) - Hampir Terancam', color: 'bg-yellow-500' },
  { value: 'VU', label: 'Vulnerable (VU) - Rentan', color: 'bg-orange-500' },
  { value: 'EN', label: 'Endangered (EN) - Terancam Punah', color: 'bg-red-600' },
  { value: 'CR', label: 'Critically Endangered (CR) - Kritis', color: 'bg-red-800' },
  { value: 'EW', label: 'Extinct in the Wild (EW) - Punah di Alam', color: 'bg-gray-700' },
  { value: 'EX', label: 'Extinct (EX) - Punah Total', color: 'bg-black' }
]

export default function UploadAnimal() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // FORM SESUAI TABEL SUPABASE
  const [form, setForm] = useState({
    name: '',
    image_url: '',
    origin: '',
    short_description: '',
    long_description: '',
    condition: 'LC'
  })

  // Akses admin
  if (!Auth.isAdmin()) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-32 px-6 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md border-4 border-red-200">
          <AlertCircle size={80} className="mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-black text-dark-red mb-4">Akses Ditolak</h1>
          <p className="text-lg text-gray-700 mb-8">Hanya Admin yang bisa mengunggah hewan baru</p>
          <button onClick={() => navigate('/dashboard')} className="bg-dark-red text-cream font-black px-10 py-4 rounded-xl hover:scale-105 transition-all shadow-xl">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.image_url || !form.long_description) {
      alert('Harap isi semua field wajib (bertanda *)!')
      return
    }

    setLoading(true)
    try {
      await createAnimal(form)
      alert('Hewan berhasil ditambahkan ke Zoopedia!')
      navigate('/animals')
    } catch (err) {
      console.error(err)
      alert('Gagal upload: ' + (err.message || 'Periksa koneksi atau RLS'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <button 
            onClick={() => navigate('/animals')} 
            className="flex items-center gap-3 text-dark-red font-bold text-lg hover:text-orange-600 transition-all"
          >
            <ArrowLeft size={28} /> Kembali ke Daftar Hewan
          </button>

          <h1 className="text-5xl font-black text-dark-red mt-6 text-center">Upload Hewan Baru</h1>
          <p className="text-center text-xl text-gray-700 mt-3 font-medium">Tambahkan hewan baru ke koleksi Zoopedia</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-beige">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Nama Hewan */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Camera size={28} className="text-orange-600" /> Nama Hewan <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                placeholder="Contoh: Harimau Sumatera"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium transition-all"
                required
              />
            </div>

            {/* URL Gambar */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Globe size={28} className="text-blue-600" /> URL Gambar <span className="text-red-500">*</span>
              </label>
              <input 
                type="url"
                placeholder="https://example.com/hewan.jpg"
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium"
                required
              />
            </div>

            {/* Asal / Habitat */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <Globe size={28} className="text-green-600" /> Asal / Habitat
              </label>
              <input
                type="text"
                placeholder="Contoh: Sumatera, Indonesia"
                value={form.origin}
                onChange={e => setForm({ ...form, origin: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium"
              />
            </div>

            {/* Status Konservasi */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <AlertTriangle size={28} className="text-red-600" /> Status Konservasi <span className="text-red-500">*</span>
              </label>

              <select
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium cursor-pointer"
              >
                {IUCN_STATUS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <div className="mt-3 flex items-center gap-2">
                <span 
                  className={`w-6 h-6 rounded-full ${
                    IUCN_STATUS.find(s => s.value === form.condition)?.color || 'bg-gray-400'
                  }`}
                />
                <p className="text-sm font-medium text-gray-700">
                  Status saat ini: <strong>{IUCN_STATUS.find(s => s.value === form.condition)?.label}</strong>
                </p>
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <FileText size={28} className="text-indigo-600" /> Deskripsi Singkat
              </label>
              <textarea
                placeholder="Ringkasan singkat tentang hewan ini..."
                value={form.short_description}
                onChange={e => setForm({ ...form, short_description: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg h-32 resize-none"
              />
            </div>

            {/* Deskripsi Lengkap */}
            <div>
              <label className="flex items-center gap-3 text-dark-red font-black text-xl mb-3">
                <BookOpen size={28} className="text-teal-600" /> Deskripsi Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Ceritakan secara detail: habitat, perilaku, ancaman, dll..."
                value={form.long_description}
                onChange={e => setForm({ ...form, long_description: e.target.value })}
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg h-48 resize-none"
                required
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-cream font-black py-6 rounded-2xl text-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-60 flex items-center justify-center gap-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={36} />
                    Mengunggah Hewan...
                  </>
                ) : (
                  <>
                    <Upload size={36} />
                    Upload Hewan Baru
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        <div className="text-center mt-12 text-gray-600 font-medium">
          <p>Terima kasih telah memperkaya pengetahuan satwa Indonesia</p>
        </div>
      </div>
    </div>
  )
}
