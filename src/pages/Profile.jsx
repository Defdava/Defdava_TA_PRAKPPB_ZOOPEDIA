// src/pages/Profile.jsx
import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, X, User, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Auth from '../lib/Auth'

export default function Profile() {
  const user = Auth.getUser() || {}
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [photo, setPhoto] = useState(user.photo || user.avatar || '')
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Load foto dari localStorage saat pertama buka
  useEffect(() => {
    if (user.photo) setPhoto(user.photo)
  }, [user.photo])

  // Cari ulasan dari user ini
  const allReviews = JSON.parse(localStorage.getItem('websiteReviews') || '[]')
  const userReview = allReviews.find(r => 
    (user.id && r.userId === user.id) || 
    (!user.id && r.userId === user.email)
  )

  // Buka galeri
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Upload dari galeri
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result
        setPhoto(dataUrl)
        Auth.updateProfile({ photo: dataUrl })
        alert('Foto profil berhasil diubah!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Buka kamera
  const openCamera = async () => {
    setIsCameraOpen(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      alert('Gak bisa buka kamera. Pastikan kamu izinin akses kamera ya!')
    }
  }

  // Ambil foto dari kamera
  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      setPhoto(dataUrl)
      Auth.updateProfile({ photo: dataUrl })
      alert('Foto dari kamera berhasil disimpan!')
      closeCamera()
    }
  }

  // Tutup kamera
  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
  }

  // Simpan nama & email
  const handleSave = () => {
    Auth.updateProfile({ name, email })
    alert('Profil berhasil diperbarui!')
  }

  // Logout
  const handleLogout = () => {
    if (confirm('Yakin mau keluar?')) {
      Auth.logout()
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-32 bg-cream">
      <h1 className="text-4xl font-black text-center text-dark-red mb-10">Profil Saya</h1>

      <div className="max-w-2xl mx-auto">

        {/* FOTO PROFIL BESAR */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-dark-red shadow-2xl bg-white">
              {photo ? (
                <img src={photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <User size={80} className="text-cream" />
                </div>
              )}
            </div>

            {/* Tombol Ganti Foto */}
            <div className="absolute bottom-2 right-2 flex gap-3">
              <button
                onClick={handleUploadClick}
                className="p-4 bg-dark-red text-cream rounded-full shadow-xl hover:scale-110 transition-all"
                title="Upload dari galeri"
              >
                <Upload size={28} />
              </button>
              <button
                onClick={openCamera}
                className="p-4 bg-orange-600 text-cream rounded-full shadow-xl hover:scale-110 transition-all"
                title="Ambil foto langsung"
              >
                <Camera size={28} />
              </button>
            </div>
          </div>

          <p className="mt-6 text-xl font-bold text-dark-red">Hai, {name || 'Pengunjung'}!</p>
        </div>

        {/* Form Edit Profil */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div>
            <label className="block text-dark-red font-bold mb-2">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-lg"
              placeholder="Masukkan nama kamu"
            />
          </div>

          <div>
            <label className="block text-dark-red font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-lg"
              placeholder="email@contoh.com"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-cream font-black py-5 rounded-xl shadow-xl hover:scale-105 transition-all text-xl"
          >
            Simpan Perubahan
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-beige text-dark-red font-black py-5 rounded-xl shadow-xl hover:bg-light-beige transition-all text-xl"
          >
            Keluar Akun
          </button>
        </div>

        {/* Ulasan yang pernah dibuat user */}
        <div className="mt-12 bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-black text-dark-red mb-6">Ulasanmu untuk Zoopedia</h3>
          
          {userReview ? (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border-4 border-purple-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={28} className={s <= userReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">• {userReview.date}</span>
              </div>
              <p className="text-xl text-gray-800 italic leading-relaxed">"{userReview.review}"</p>
              <Link
                to="/review"
                className="mt-6 inline-block text-dark-red font-bold text-lg hover:underline"
              >
                Edit Ulasan →
              </Link>
            </div>
          ) : (
            <div className="text-center py-10">
              <Star size={64} className="mx-auto text-gray-300 mb-6" />
              <p className="text-xl text-gray-600 mb-6">Kamu belum memberikan ulasan untuk Zoopedia</p>
              <Link
                to="/review"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-xl hover:scale-105 transition-all"
              >
                <Star size={32} className="fill-yellow-300 text-yellow-300" />
                Tulis Ulasan Sekarang
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* INPUT HIDDEN UNTUK UPLOAD */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* MODAL KAMERA */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-6">
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-3xl">
            <button
              onClick={closeCamera}
              className="absolute top-4 right-4 z-10 p-3 bg-dark-red text-cream rounded-full shadow-xl hover:scale-110 transition"
            >
              <X size={28} />
            </button>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-lg rounded-t-3xl"
            />

            <div className="p-6 bg-gradient-to-r from-dark-red to-red-800">
              <button
                onClick={takePhoto}
                className="w-full py-6 bg-cream text-dark-red font-black text-2xl rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center gap-4"
              >
                <Camera size={40} />
                Ambil Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas tersembunyi untuk ambil foto */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}