// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Auth from '../lib/Auth'
import { Cat, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)

    try {
      await Auth.login(email, password)
      // Langsung ke dashboard tanpa alert
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message = error.message.includes('Invalid') 
        ? 'Email atau password salah!' 
        : error.message
      alert(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-red to-beige flex items-center justify-center p-6">
      <div className="bg-cream p-10 rounded-3xl shadow-2xl w-full max-w-sm border-4 border-dark-red">

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-3xl animate-pulse"></div>
            <Cat size={100} className="relative text-orange-500 drop-shadow-2xl animate-bounce" strokeWidth={3} />
          </div>
        </div>

        <h1 className="text-4xl font-black text-center text-dark-red mb-8">Zoopedia</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner disabled:opacity-70"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-cream font-black py-6 rounded-xl text-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                Sedang Masuk...
              </>
            ) : (
              'Masuk Zoopedia'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-beige font-medium">
          Belum punya akun?{' '}
          <Link to="/register" className="text-dark-red font-black underline hover:text-red-800">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}