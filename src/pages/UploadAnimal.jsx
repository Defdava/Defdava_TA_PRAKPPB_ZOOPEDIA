// src/pages/admin/UploadAnimal.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Auth from '../lib/Auth'
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react'

const API_URL = "https://apihewann.vercel.app/hewan"

export default function UploadAnimal() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', name_latin: '', image_url: '', origin: '', short_description: '', long_description: ''
  })

  if (!Auth.isAdmin()) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-red-100 border-4 border-red-600 rounded-3xl p-10 text-center">
          <AlertCircle size={80} className="mx-auto mb-4 text-red-600" />
          <h1 className="text-3xl font-black text-red-800">Akses Ditolak</h1>
          <p className="text-xl mt-4">Hanya Admin yang bisa mengunggah hewan.</p>
          <button onClick={() => navigate('/dashboard')} className="mt-6 bg-dark-red text-cream px-8 py-4 rounded-xl font-bold">
            Kembali
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
        alert('Gagal upload: ' + await res.text())
      }
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-red to-beige pt-20 pb-32">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cream mb-6 font-bold">
          <ArrowLeft /> Kembali
        </button>
        <div className="bg-cream rounded-3xl shadow-2xl p-8 border-4 border-dark-red">
          <h1 className="text-4xl font-black text-dark-red text-center mb-8">Upload Hewan Baru</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {['name', 'name_latin', 'image_url', 'origin'].map(field => (
              <input key={field} placeholder={field.replace('_', ' ').toUpperCase()} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold" required />
            ))}
            <textarea placeholder="Deskripsi Singkat" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold h-32" required />
            <textarea placeholder="Deskripsi Panjang" value={form.long_description} onChange={e => setForm({...form, long_description: e.target.value})} className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold h-48" required />

            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-xl text-xl flex items-center justify-center gap-3 shadow-2xl">
              <Upload size={28} />
              {loading ? 'Mengunggah...' : 'Upload Hewan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}