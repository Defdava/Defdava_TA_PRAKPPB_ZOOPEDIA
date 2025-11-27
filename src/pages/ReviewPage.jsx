// src/pages/ReviewPage.jsx
import { useState } from 'react'
import { Star, Send, ArrowLeft, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import Auth from '../lib/Auth'

export default function ReviewPage() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [review, setReview] = useState('')
  const [message, setMessage] = useState('')

  const user = Auth.getUser() || {}

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!rating || !review.trim()) {
      setMessage('Harap isi rating dan tulis ulasan!')
      return
    }

    const newReview = {
      id: Date.now().toString(),
      userId: user.id || user.email,
      userName: user.name || 'Pengunjung',
      userPhoto: user.photo || '',
      rating,
      review: review.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const existing = JSON.parse(localStorage.getItem('websiteReviews') || '[]')
    const filtered = existing.filter(r => r.userId !== newReview.userId) // hapus ulasan lama dari user ini
    const updated = [newReview, ...filtered]
    localStorage.setItem('websiteReviews', JSON.stringify(updated))

    setMessage('Terima kasih banyak! Ulasanmu sudah tersimpan dan akan muncul di Dashboard.')
    setRating(0)
    setReview('')
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-32 bg-cream">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-dark-red font-bold mb-8 hover:underline">
          <ArrowLeft size={24} />
          Kembali ke Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-black text-dark-red text-center mb-10">
            Beri Ulasan untuk Zoopedia
          </h1>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-dark-red mb-6">
                Seberapa puas kamu dengan Zoopedia?
              </p>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      size={56}
                      className={`transition-all duration-200 ${
                        star <= (hovered || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-lg font-medium text-gray-700">
                {rating === 5 && 'Luar Biasa!'}
                {rating === 4 && 'Sangat Bagus'}
                {rating === 3 && 'Cukup Baik'}
                {rating === 2 && 'Kurang'}
                {rating === 1 && 'Tidak Suka'}
                {!rating && 'Pilih bintang di atas'}
              </p>
            </div>

            <div>
              <label className="block text-dark-red font-bold mb-4 text-xl">
                Tulis ulasanmu
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows="8"
                className="w-full px-6 py-5 rounded-2xl border-4 border-beige focus:border-dark-red outline-none text-lg resize-none transition-all"
                placeholder="Ceritakan pengalamanmu menggunakan Zoopedia... Apa yang kamu suka? Ada saran untuk kami?"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-dark-red to-red-700 hover:from-red-700 hover:to-red-800 text-cream font-black py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all text-2xl flex items-center justify-center gap-4"
            >
              <Send size={36} />
              Kirim Ulasan
            </button>

            {message && (
              <div className={`text-center p-6 rounded-2xl text-lg font-bold ${
                message.includes('Terima kasih')
                  ? 'bg-green-100 text-green-800 border-4 border-green-300'
                  : 'bg-red-100 text-red-800 border-4 border-red-300'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}