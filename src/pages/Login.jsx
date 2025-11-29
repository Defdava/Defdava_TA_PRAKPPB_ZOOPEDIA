// src/pages/Login.jsx
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
    if (!email.trim() || !password) return alert('Email dan password wajib diisi!')

    const emailLower = email.trim().toLowerCase()
    const allAccounts = JSON.parse(localStorage.getItem('zoopedia_accounts') || '[]')
    const account = allAccounts.find(acc => acc.email === emailLower)

    if (!account) return alert('Akun belum terdaftar!')
    if (account.password !== password) return alert('Password salah!')

    Auth.login({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      photo: null,
      role: account.role || 'user'
    })

    alert(`Selamat datang kembali, ${account.name}! ${account.role === 'admin' ? '(Admin)' : ''}`)
    navigate('/dashboard', { replace: true })
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
          <input type="email" placeholder="Email" className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-cream font-black py-6 rounded-xl text-xl shadow-2xl hover:scale-105 transition-all">
            Masuk Zoopedia
          </button>
        </form>

        <p className="text-center mt-8 text-beige font-medium">
          Belum punya akun? <Link to="/register" className="text-dark-red font-black underline hover:text-red-800">Daftar di sini</Link>
        </p>
      </div>
    </div>
  )
}