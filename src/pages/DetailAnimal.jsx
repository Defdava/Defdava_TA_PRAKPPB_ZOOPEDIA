// src/pages/DetailAnimal.jsx → FINAL FIX TANPA BUG
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimalById, updateAnimal, deleteAnimal } from '../services/api'
import Auth from '../lib/Auth'
import {
  ArrowLeft,
  Share2,
  Edit3,
  Save,
  X,
  Globe,
  BookOpen,
  AlertTriangle,
  Trash2
} from 'lucide-react'

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

  // CEK ADMIN
  useEffect(() => {
    const check = async () => {
      const res = await Auth.isAdmin?.()
      setIsAdmin(Boolean(res))
    }
    check()
  }, [])

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnimalById(id)
        setAnimal(data)
        setEditData({
          nama: data.nama,
          gambar: data.gambar,
          habitat: data.habitat,
          deskripsi_singkat: data.deskripsi_singkat,
          deskripsi_lengkap: data.deskripsi_lengkap,
          condition: data.condition
        })
      } catch (err) {
        console.error(err)
        alert('Gagal memuat hewan')
        navigate('/animals')
      }
    }
    load()
  }, [id, navigate])

  // BAGIKAN
  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: animal?.nama, url })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link disalin!')
    }
  }

  const startEdit = () => setIsEditing(true)

  const cancelEdit = () => {
    setIsEditing(false)
    setEditData({
      nama: animal.nama,
      gambar: animal.gambar,
      habitat: animal.habitat,
      deskripsi_singkat: animal.deskripsi_singkat,
      deskripsi_lengkap: animal.deskripsi_lengkap,
      condition: animal.condition
    })
  }

  // SIMPAN (FINAL)
  const saveEdit = async () => {
    if (!editData.nama || !editData.gambar || !editData.deskripsi_lengkap) {
      alert('Nama, gambar, dan deskripsi lengkap wajib diisi!')
      return
    }

    setIsSaving(true)

    try {
      const updatedAnimal = await updateAnimal(id, {
        nama: editData.nama,
        gambar: editData.gambar,
        habitat: editData.habitat,
        deskripsi_singkat: editData.deskripsi_singkat,
        deskripsi_lengkap: editData.deskripsi_lengkap,
        condition: editData.condition
      })

      setAnimal(updatedAnimal)
      setIsEditing(false)

      alert('Hewan berhasil diperbarui!')
      window.dispatchEvent(new Event('animal-updated'))
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  // HAPUS
  const handleDelete = async () => {
    if (!window.confirm('Yakin ingin menghapus hewan ini?')) return
    setIsDeleting(true)

    try {
      await deleteAnimal(id)
      alert('Hewan berhasil dihapus.')
      navigate('/animals')
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus: ' + err.message)
    } finally {
      setIsDeleting(false)
    }
  }

  // LOADING
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

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-3 bg-dark-red text-cream px-6 py-3 rounded-full font-bold shadow-xl hover:bg-red-800 transition-all hover:scale-105"
      >
        <ArrowLeft size={24} /> Kembali
      </button>

      {/* SHARE */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-4 z-50 bg-green-700 text-cream px-6 py-4 rounded-full shadow-xl flex items-center gap-3 font-bold hover:scale-110 transition-all"
      >
        <Share2 size={28} /> Bagikan
      </button>

      {/* GAMBAR */}
      <div className="w-full max-w-5xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-beige">
          {isEditing ? (
            <input
              type="url"
              value={editData.gambar}
              onChange={e => setEditData({ ...editData, gambar: e.target.value })}
              className="w-full p-6 text-lg text-center bg-gray-100 outline-none"
              placeholder="https://example.com/gambar.jpg"
            />
          ) : (
            <img
              src={animal.gambar}
              alt={animal.nama}
              className="w-full object-contain p-8"
            />
          )}
        </div>
      </div>

      {/* NAMA */}
      <div className="px-6 py-10 text-center">
        {isEditing ? (
          <input
            type="text"
            value={editData.nama}
            onChange={e => setEditData({ ...editData, nama: e.target.value })}
            className="text-5xl md:text-7xl font-black text-dark-red text-center w-full bg-transparent border-b-4 border-dark-red focus:outline-none"
          />
        ) : (
          <h1 className="text-5xl md:text-7xl font-black text-dark-red">
            {animal.nama}
          </h1>
        )}
      </div>

      {/* INFO */}
      <div className="px-6 max-w-4xl mx-auto space-y-8">

        {/* Habitat & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Habitat */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
            <h3 className="text-lg font-bold text-dark-red mb-3 flex items-center gap-2">
              <Globe size={20} /> Habitat
            </h3>
            {isEditing ? (
              <input
                type="text"
                value={editData.habitat}
                onChange={e => setEditData({ ...editData, habitat: e.target.value })}
                className="w-full border-b-2 border-beige bg-transparent text-lg"
              />
            ) : (
              <p className="text-beige text-lg">{animal.habitat || 'Tidak diketahui'}</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
            <h3 className="text-lg font-bold text-dark-red mb-3 flex items-center gap-2">
              <AlertTriangle size={20} /> Status Konservasi
            </h3>
            {isEditing ? (
              <select
                value={editData.condition}
                onChange={e => setEditData({ ...editData, condition: e.target.value })}
                className="w-full p-3 rounded-xl border-2 border-beige"
              >
                {Object.entries(IUCN_BADGE).map(([code, { label }]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full ${IUCN_BADGE[animal.condition]?.color}`} />
                <span className="text-beige font-bold">
                  {IUCN_BADGE[animal.condition]?.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* deskripsi singkat */}
        {animal.deskripsi_singkat && !isEditing && (
          <div className="bg-orange-50 rounded-3xl p-8 border-4 border-orange-200">
            <p className="text-dark-red text-xl font-bold text-justify">
              {animal.deskripsi_singkat}
            </p>
          </div>
        )}

        {/* deskripsi lengkap */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-beige">
          <h3 className="text-2xl font-bold text-dark-red mb-6 flex items-center gap-3">
            <BookOpen size={28} /> Deskripsi Lengkap
          </h3>
          {isEditing ? (
            <textarea
              value={editData.deskripsi_lengkap}
              onChange={e => setEditData({ ...editData, deskripsi_lengkap: e.target.value })}
              rows={10}
              className="w-full border-4 border-beige rounded-xl p-6 text-lg"
            />
          ) : (
            <p className="text-beige text-lg leading-relaxed whitespace-pre-line">
              {animal.deskripsi_lengkap}
            </p>
          )}
        </div>

        {/* tombol admin */}
        {!isEditing && isAdmin && (
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
            <button
              onClick={startEdit}
              className="bg-indigo-600 text-cream px-10 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 transition-all"
            >
              <Edit3 className="inline mr-2" /> Edit Hewan
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-700 text-cream px-10 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 transition-all disabled:opacity-60"
            >
              <Trash2 className="inline mr-2" /> {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        )}

        {/* tombol edit */}
        {isEditing && (
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
            <button
              onClick={saveEdit}
              disabled={isSaving}
              className="bg-emerald-700 text-cream px-10 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 transition-all disabled:opacity-60"
            >
              <Save className="inline mr-2" /> {isSaving ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={cancelEdit}
              className="bg-red-600 text-cream px-10 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 transition-all"
            >
              <X className="inline mr-2" /> Batal
            </button>
          </div>
        )}

      </div>

      <div className="h-32"></div>
    </div>
  )
}
