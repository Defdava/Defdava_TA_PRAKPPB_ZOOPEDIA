// src/pages/Register.jsx → FINAL MULTI USER!
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Auth from '../lib/Auth'
import { Cat } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name) return alert('Nama wajib diisi!')
    if (!email) return alert('Email wajib diisi!')
    if (!form.password) return alert('Password wajib diisi!')
    if (form.password !== form.confirm) return alert('Password tidak sama!')
    if (form.password.length < 6) return alert('Password minimal 6 karakter!')

    // Ambil semua akun yang sudah ada
    const allAccounts = JSON.parse(localStorage.getItem('zoopedia_accounts') || '[]')

    // Cek email sudah ada belum
    if (allAccounts.some(acc => acc.email === email)) {
      return alert('Email ini sudah terdaftar! Silakan login.')
    }

    // Buat akun baru
    const newAccount = {
      name,
      email,
      password: form.password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    }

    // Simpan ke array
    allAccounts.push(newAccount)
    localStorage.setItem('zoopedia_accounts', JSON.stringify(allAccounts))

    // Login otomatis
    Auth.login({
      name,
      email,
      avatar: newAccount.avatar,
      photo: null
    })

    alert(`Selamat datang, ${name}! Akun berhasil dibuat!`)
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

        <h1 className="text-4xl font-black text-center text-dark-red mb-4">Daftar Zoopedia</h1>
        <p className="text-center text-beige text-lg mb-8">Gabung jadi pecinta satwa Indonesia!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password (min. 6 karakter)"
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none text-dark-red font-bold text-lg shadow-inner"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 text-cream font-black py-6 rounded-xl text-xl shadow-2xl hover:scale-105 transition-all"
          >
            Daftar & Masuk Sekarang!
          </button>
        </form>

        <p className="text-center mt-8 text-beige font-medium">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-dark-red font-black underline hover:text-red-800">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  )
}