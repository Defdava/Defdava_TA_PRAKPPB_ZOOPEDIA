// src/pages/Login.jsx → FINAL MULTI USER! (NO ERROR)
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Auth from '../lib/Auth'
import { Cat } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      return alert('Email dan password wajib diisi!')
    }

    const emailLower = email.trim().toLowerCase()

    // Ambil seluruh akun yang sudah terdaftar
    const allAccounts = JSON.parse(localStorage.getItem('zoopedia_accounts') || '[]')

    // Cari akun berdasarkan email
    const account = allAccounts.find(acc => acc.email === emailLower)

    if (!account) {
      return alert('Akun belum terdaftar! Silakan daftar dulu.')
    }

    // Cek password
    if (account.password !== password) {
      return alert('Password salah!')
    }

    // Login sukses → simpan sesi ke Auth.js
    Auth.login({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      photo: account.photo || null
    })

    alert(`Selamat datang kembali, ${account.name}!`)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-red to-beige flex items-center justify-center p-6">
      <div className="bg-cream p-10 rounded-3xl shadow-2xl w-full max-w-sm border-4 border-dark-red">

        {/* Logo Animasi */}
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
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-cream font-black py-6 rounded-xl text-xl shadow-2xl hover:scale-105 transition-all"
          >
            Masuk Zoopedia
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
