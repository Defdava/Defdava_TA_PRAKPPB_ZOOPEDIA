// src/pages/DetailAnimal.jsx → FINAL + EDIT + DELETE
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimalById, updateAnimal, deleteAnimal } from '../services/api'
import Auth from '../lib/Auth'
import { ArrowLeft, Share2, Edit3, Save, X, AlertCircle, Globe, BookOpen, Trash2 } from 'lucide-react'

const IUCN_BADGE = {
  LC: { label: 'Least Concern', color: 'bg-green-500' },
  NT: { label: 'Near Threatened', color: 'bg-yellow-500' },
  VU: { label: 'Vulnerable', color: 'bg-orange-500' },
  EN: { label: 'Endangered', color: 'bg-red-600' },
  CR: { label: 'Critically Endangered', color: 'bg-red-800' },
  EW: { label: 'Extinct in the Wild', color: 'bg-gray-700' },
  EX: { label: 'Extinct', color: 'bg-black' }
}

export default function DetailAnimal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const check = async () => setIsAdmin(await Auth.isAdmin())
    check()
  }, [])

  useEffect(() => {
    getAnimalById(id).then(data => {
      setAnimal(data)
      setEditData(data || {})
    }).catch(err => {
      console.error(err)
      alert('Gagal memuat hewan')
    })
  }, [id])

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: animal?.nama, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link disalin ke clipboard!')
    }
  }

  const startEdit = () => setIsEditing(true)
  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(animal)
  }

  const saveEdit = async () => {
    if (!editData.nama || !editData.gambar || !editData.deskripsi_lengkap) {
      alert('Nama, Gambar, dan Deskripsi Lengkap wajib diisi!')
      return
    }

    setIsSaving(true)
    try {
      const updated = await updateAnimal(id, {
        nama: editData.nama,
        nama_latin: editData.nama_latin, // ignored by API
        gambar: editData.gambar,
        habitat: editData.habitat,
        deskripsi_singkat: editData.deskripsi_singkat,
        deskripsi_lengkap: editData.deskripsi_lengkap,
        condition: editData.condition
      })

      setAnimal(updated)
      setIsEditing(false)
      alert('Hewan berhasil diperbarui!')

      window.dispatchEvent(new Event('animal-updated'))
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan: ' + (err.message || 'Periksa koneksi'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus "${animal.nama}"?`)) return

    setIsDeleting(true)
    try {
      await deleteAnimal(id)
      alert('Hewan berhasil dihapus!')
      navigate(-1)
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus hewan: ' + (err.message || 'Periksa koneksi'))
    } finally {
      setIsDeleting(false)
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
        className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-dark-red/95 text-cream px-6 py-3 rounded-full shadow-2xl hover:bg-red-800 transition-all hover:scale-105"
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

      {/* Gambar */}
      <div className="w-full max-w-5xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-beige">
          {isEditing ? (
            <div className="aspect-video md:aspect-[16/9] bg-gray-100 relative">
              <input
                type="url"
                placeholder="https://example.com/gambar-baru.jpg"
                value={editData.gambar || ''}
                onChange={e => setEditData({ ...editData, gambar: e.target.value })}
                className="w-full h-full p-8 text-center text-gray-600 text-lg bg-transparent outline-none"
              />
            </div>
          ) : (
            <div className="aspect-video md:aspect-[16/9] bg-black/5">
              <img src={animal.gambar} alt={animal.nama} className="w-full h-full object-contain p-8" loading="lazy" />
            </div>
          )}
        </div>
      </div>

      {/* Nama */}
      <div className="px-6 py-10 text-center">
        {isEditing ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <input
              type="text"
              value={editData.nama || ''}
              onChange={e => setEditData({ ...editData, nama: e.target.value })}
              className="text-5xl md:text-7xl font-black text-dark-red text-center w-full bg-transparent border-b-4 border-dark-red focus:outline-none"
              placeholder="Nama Hewan"
            />
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-7xl font-black text-dark-red">{animal.nama}</h1>
          </>
        )}
      </div>

      {/* Panel */}
      <div className="px-6 max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Habitat */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
            <h3 className="text-lg font-bold text-dark-red mb-3 flex items-center gap-2">
              <Globe size={20} /> Habitat
            </h3>
            {isEditing ? (
              <input
                type="text"
                value={editData.habitat || ''}
                onChange={e => setEditData({ ...editData, habitat: e.target.value })}
                className="w-full text-beige text-lg font-medium bg-transparent border-b-2 border-beige focus:outline-none"
              />
            ) : (
              <p className="text-beige text-lg font-medium">{animal.habitat}</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
            <h3 className="text-lg font-bold text-dark-red mb-3 flex items-center gap-2">
              <AlertCircle size={20} /> Status Konservasi
            </h3>
            {isEditing ? (
              <select
                value={editData.condition || 'LC'}
                onChange={e => setEditData({ ...editData, condition: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-beige focus:border-dark-red outline-none text-lg font-medium"
              >
                {Object.entries(IUCN_BADGE).map(([val, { label }]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full ${IUCN_BADGE[animal.condition]?.color || 'bg-gray-400'}`} />
                <p className="text-beige text-lg font-bold">
                  {IUCN_BADGE[animal.condition]?.label || animal.condition}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Deskripsi Singkat */}
        {animal.deskripsi_singkat && !isEditing && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border-4 border-orange-200">
            <p className="text-dark-red text-xl font-bold leading-relaxed text-justify">
              {animal.deskripsi_singkat}
            </p>
          </div>
        )}

        {/* Deskripsi Lengkap */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-beige">
          <h3 className="text-2xl font-bold text-dark-red mb-6 flex items-center gap-3">
            <BookOpen size={28} /> Deskripsi Lengkap
          </h3>
          {isEditing ? (
            <textarea
              value={editData.deskripsi_lengkap || ''}
              onChange={e => setEditData({ ...editData, deskripsi_lengkap: e.target.value })}
              rows={12}
              className="w-full p-6 text-beige text-lg leading-relaxed font-medium resize-none border-4 border-beige rounded-2xl focus:outline-none focus:border-dark-red"
              placeholder="Tulis deskripsi lengkap..."
            />
          ) : (
            <p className="text-beige text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line font-medium">
              {animal.deskripsi_lengkap}
            </p>
          )}
        </div>

        {/* Tombol Admin */}
        {isAdmin && !isEditing && (
          <div className="text-center pt-8 space-x-6">

            {/* EDIT */}
            <button
              onClick={startEdit}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-cream px-10 py-5 rounded-full text-2xl font-black shadow-2xl hover:scale-105 transition-all"
            >
              <Edit3 size={32} /> Edit Hewan
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-4 bg-red-700 text-cream px-10 py-5 rounded-full text-2xl font-black shadow-2xl hover:bg-red-800 hover:scale-105 transition-all disabled:opacity-50"
            >
              <Trash2 size={32} />
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        )}

        {/* Tombol Save / Batal */}
        {isEditing && (
          <div className="text-center pt-8 space-x-6">
            <button
              onClick={saveEdit}
              disabled={isSaving}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-green-700 text-cream px-12 py-6 rounded-full text-2xl font-black shadow-2xl disabled:opacity-60 hover:scale-105 transition-all"
            >
              <Save size={32} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>

            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-4 bg-red-600 text-cream px-10 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-105 transition-all"
            >
              <X size={32} /> Batal
            </button>
          </div>
        )}
      </div>

      <div className="h-32"></div>
    </div>
  )
}
