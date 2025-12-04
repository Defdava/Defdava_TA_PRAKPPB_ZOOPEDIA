// src/pages/Profile.jsx
import { useState, useRef, useEffect } from 'react'
import { Camera, Upload, X, Loader2, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Auth from '../lib/Auth'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [quizHistory, setQuizHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const loadData = async () => {
    const u = Auth.getUser()
    setUser(u)
    setName(u?.name || '')

    // Ambil riwayat kuis
    const history = await Auth.getQuizHistory()
    setQuizHistory(history || [])
    setLoadingHistory(false)
  }

  useEffect(() => {
    loadData()
    Auth.subscribe(loadData)
    return () => Auth.unsubscribe(loadData)
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return alert('Maksimal 5MB!')
    if (!file.type.startsWith('image/')) return alert('Harus gambar!')

    setIsUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      await Auth.updateProfile({ avatar: reader.result })
      setUser(Auth.getUser())
      setIsUploading(false)
      alert('Foto profil berhasil diubah!')
    }
    reader.readAsDataURL(file)
  }

  const saveName = async () => {
    if (!name.trim() || name.trim().length < 3) return alert('Nama minimal 3 karakter!')
    setIsSaving(true)
    await Auth.updateProfile({ name: name.trim() })
    setUser(Auth.getUser())
    setIsSaving(false)
    alert('Nama berhasil diperbarui!')
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 1280 }
      })
      setIsCameraOpen(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          videoRef.current.style.transform = "scaleX(-1)"
        }
      }, 100)
    } catch (err) {
      alert('Tidak bisa mengakses kamera!')
    }
  }

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
    }
    setIsCameraOpen(false)
  }

  const takePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const size = 512
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    const sourceSize = Math.min(video.videoWidth, video.videoHeight)
    const sx = (video.videoWidth - sourceSize) / 2
    const sy = (video.videoHeight - sourceSize) / 2

    ctx.translate(size, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, sx, sy, sourceSize, sourceSize, 0, 0, size, size)
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.fill()

    const photoUrl = canvas.toDataURL('image/png', 0.95)
    Auth.updateProfile({ avatar: photoUrl }).then(() => {
      setUser(Auth.getUser())
      closeCamera()
      alert('Foto profil berhasil diambil!')
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-dark-red" size={80} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-32 bg-cream">
      <h1 className="text-4xl font-black text-center text-dark-red mb-10 tracking-tight">Profil Saya</h1>

      <div className="max-w-4xl mx-auto space-y-12">

        {/* Avatar + Tombol */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-10 border-dark-red shadow-2xl ring-8 ring-cream/50">
              {isUploading ? (
                <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center">
                  <Loader2 size={70} className="text-cream animate-spin" />
                </div>
              ) : (
                <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-4">
              <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-dark-red text-cream rounded-full shadow-2xl hover:scale-110 transition-all">
                <Upload size={32} />
              </button>
              <button onClick={openCamera} className="p-5 bg-gradient-to-br from-orange-500 to-red-600 text-cream rounded-full shadow-2xl hover:scale-110 transition-all">
                <Camera size={32} />
              </button>
            </div>
          </div>

          <p className="mt-10 text-3xl font-black text-dark-red">Hai, {user.name}!</p>
          {user.role === 'admin' && (
            <div className="mt-3 px-8 py-3 bg-yellow-400 text-black rounded-full font-bold text-lg shadow-lg animate-pulse">
              ADMIN ZOOPEDIA
            </div>
          )}
        </div>

        {/* Form Edit Profil */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8 border-4 border-beige">
          <div>
            <label className="block text-dark-red font-black text-xl mb-3">Nama Lengkap</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-dark-red font-black text-xl mb-3">Email</label>
            <input value={user.email} disabled className="w-full px-6 py-5 rounded-2xl border-4 border-beige bg-gray-50 text-gray-600 text-lg" />
          </div>

          <button onClick={saveName} disabled={isSaving} className="w-full bg-gradient-to-r from-emerald-600 to-green-700 text-cream font-black py-6 rounded-2xl text-xl shadow-xl hover:scale-105 transition-all disabled:opacity-60">
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>

          <button
            onClick={() => confirm('Yakin keluar?') && Auth.logout().then(() => navigate('/login'))}
            className="w-full bg-beige text-dark-red font-black py-6 rounded-2xl text-xl shadow-xl hover:bg-light-beige transition-all"
          >
            Keluar Akun
          </button>
        </div>

        {/* RIWAYAT KUIS */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-beige">
          <div className="flex items-center gap-4 mb-6">
            <Trophy size={40} className="text-dark-red" />
            <h2 className="text-3xl font-black text-dark-red">Riwayat Hasil Kuis</h2>
          </div>

          {loadingHistory ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto animate-spin text-dark-red" size={50} />
            </div>
          ) : quizHistory.length === 0 ? (
            <p className="text-center text-gray-600 py-12 text-lg font-medium">
              Belum ada riwayat kuis. Yuk coba main kuis dulu!
            </p>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border-2 border-dark-red/20 shadow-md"
                >
                  <div>
                    <p className="font-bold text-dark-red text-xl">
                      {h.score} / {h.total} ({h.percentage}%)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(h.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {h.percentage >= 90 && <Trophy size={48} className="text-yellow-500 animate-bounce" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Input & Canvas */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* MODAL KAMERA (SELFIE MODE) */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-6">
          <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-3xl">
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-5 bg-gradient-to-b from-black/70 to-transparent">
              <h3 className="text-2xl font-black text-cream tracking-wider">Ambil Foto Profil</h3>
              <button onClick={closeCamera} className="p-3 bg-dark-red/90 text-cream rounded-full shadow-xl hover:scale-110 transition-all backdrop-blur-sm">
                <X size={28} />
              </button>
            </div>

            <div className="relative aspect-square bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border-8 border-cream/80 shadow-2xl"></div>
              </div>

              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-cream font-bold text-sm tracking-wider">LIVE</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-t from-dark-red via-red-700 to-red-800">
              <button onClick={takePhoto} className="relative w-full flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-cream/30 blur-xl animate-pulse"></div>
                  <div className="relative w-24 h-24 rounded-full bg-cream shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95">
                    <div className="w-20 h-20 rounded-full bg-white border-8 border-dark-red"></div>
                  </div>
                </div>
              </button>
              <p className="text-center text-cream font-bold text-lg mt-6 tracking-wider">
                Tekan untuk ambil foto
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}