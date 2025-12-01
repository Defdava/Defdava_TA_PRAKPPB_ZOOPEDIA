// src/pages/DetailAnimal.jsx → FINAL + TOMBOL EDIT DI BAWAH DESKRIPSI (ADMIN ONLY)
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimalById, updateAnimal } from '../services/api'
import Auth from '../lib/Auth'
import { ArrowLeft, Share2, Edit3, Save, X, Upload, AlertCircle } from 'lucide-react'

export default function DetailAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Cek admin
  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await Auth.isAdmin()
      setIsAdmin(admin)
    }
    checkAdmin()
  }, [])

  // Load data hewan
  useEffect(() => {
    getAnimalById(id).then(res => {
      setAnimal(res)
      setEditData(res)
    })
  }, [id])

  // Handle Share
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/animals/${id}`
    if (navigator.share) {
      navigator.share({
        title: `${animal?.nama} - Zoopedia Indonesia`,
        text: `Lihat ${animal?.nama} di Zoopedia!`,
        url: shareUrl
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl)
        alert('Link disalin!')
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link disalin!')
    }
  }

  const startEdit = () => setIsEditing(true)
  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(animal)
    setImageFile(null)
  }

  const saveEdit = async () => {
    setIsSaving(true)
    try {
      const updated = await updateAnimal(id, editData, imageFile)
      setAnimal(updated)
      setIsEditing(false)
      setImageFile(null)
      alert('Hewan berhasil diperbarui!')
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message)
    } finally {
      setIsSaving(false)
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

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-dark-red/95 backdrop-blur-md text-cream px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-red-800 transition-all hover:scale-105"
      >
        <ArrowLeft size={24} /> Kembali
      </button>

      {/* Tombol Share */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-4 z-50 bg-gradient-to-br from-emerald-600 to-green-700 text-cream px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-110 transition-all"
      >
        <Share2 size={28} /> Bagikan
      </button>

      {/* Gambar Hewan */}
      <div className="w-full max-w-5xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-beige">
          {isEditing ? (
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
              <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/9] bg-black/20 relative flex items-center justify-center hover:bg-black/30 transition-all">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : editData.gambar}
                  alt="Preview"
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-white text-center">
                    <Upload size={48} className="mx-auto mb-2" />
                    <p className="text-xl font-bold">Ganti Gambar</p>
                  </div>
                </div>
              </div>
            </label>
          ) : (
            <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/9] bg-black/10">
              <img src={animal.gambar} alt={animal.nama} className="w-full h-full object-contain p-4 md:p-8" loading="lazy" />
            </div>
          )}
        </div>
      </div>

      {/* Nama Hewan */}
      <div className="px-6 py-10 text-center">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editData.nama || ''}
              onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
              className="text-5xl md:text-7xl font-black text-dark-red text-center w-full bg-transparent border-b-4 border-dark-red focus:outline-none"
              placeholder="Nama Hewan"
            />
            <input
              type="text"
              value={editData.nama_latin || ''}
              onChange={(e) => setEditData({ ...editData, nama_latin: e.target.value })}
              className="text-2xl md:text-4xl italic text-beige block w-full text-center bg-transparent border-b-2 border-beige focus:outline-none"
              placeholder="Nama Latin"
            />
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-7xl font-black text-dark-red leading-tight">{animal.nama}</h1>
            <p className="text-2xl md:text-4xl italic text-beige mt-4 font-medium tracking-wider">{animal.nama_latin}</p>
          </>
        )}
      </div>

      {/* Informasi Tambahan */}
      <div className="px-6 max-w-4xl mx-auto space-y-6">
        {(animal.habitat || animal.status_konservasi) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {animal.habitat && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
                <h3 className="text-lg font-bold text-dark-red mb-2">Habitat</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.habitat || ''}
                    onChange={(e) => setEditData({ ...editData, habitat: e.target.value })}
                    className="w-full text-beige text-lg font-medium bg-transparent border-b-2 border-beige focus:outline-none"
                  />
                ) : (
                  <p className="text-beige text-lg font-medium">{animal.habitat}</p>
                )}
              </div>
            )}
            {animal.status_konservasi && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
                <h3 className="text-lg font-bold text-dark-red mb-2 flex items-center gap-2">
                  <AlertCircle size={20} /> Status Konservasi
                </h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.status_konservasi || ''}
                    onChange={(e) => setEditData({ ...editData, status_konservasi: e.target.value })}
                    className="w-full text-beige text-lg font-medium bg-transparent border-b-2 border-beige focus:outline-none"
                  />
                ) : (
                  <p className="text-beige text-lg font-medium">{animal.status_konservasi}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deskripsi */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-beige">
          <h3 className="text-2xl font-bold text-dark-red mb-6">Deskripsi</h3>
          {isEditing ? (
            <textarea
              value={editData.deskripsi || ''}
              onChange={(e) => setEditData({ ...editData, deskripsi: e.target.value })}
              rows={10}
              className="w-full p-4 text-beige text-lg leading-relaxed font-medium resize-none border-2 border-beige rounded-xl focus:outline-none focus:border-dark-red"
              placeholder="Tulis deskripsi lengkap hewan di sini..."
            />
          ) : (
            <p className="text-beige text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line font-medium">
              {animal.deskripsi}
            </p>
          )}
        </div>

        {/* TOMBOL EDIT / SIMPAN & BATAL — DI BAWAH DESKRIPSI */}
        {isAdmin && !isEditing && (
          <div className="text-center mt-8">
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-all hover:shadow-blue-500/50"
            >
              <Edit3 size={28} />
              Edit Hewan Ini
            </button>
          </div>
        )}

        {isEditing && (
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={saveEdit}
              disabled={isSaving}
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl disabled:opacity-70"
            >
              <Save size={28} />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-full text-xl font-bold shadow-2xl"
            >
              <X size={28} /> Batal
            </button>
          </div>
        )}
      </div>

      <div className="h-32"></div>
    </div>
  )
}