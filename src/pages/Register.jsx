// src/pages/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Auth from '../lib/Auth'
import { Loader2 } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (form.password !== form.confirm) {
      return alert('Password tidak sama!')
    }
    if (form.password.length < 6) {
      return alert('Password minimal 6 karakter!')
    }
    if (!form.name.trim()) {
      return alert('Nama wajib diisi!')
    }

    setLoading(true)

    try {
      await Auth.register(form.email, form.password, form.name)
      // Langsung ke dashboard setelah register berhasil
      navigate('/dashboard', { replace: true })
    } catch (error) {
      alert('Gagal daftar: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-red to-beige flex items-center justify-center p-6">
      <div className="bg-cream p-10 rounded-3xl shadow-2xl w-full max-w-sm border-4 border-dark-red">
        <h1 className="text-4xl font-black text-center text-dark-red mb-8">Daftar Zoopedia</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" 
            placeholder="Nama Lengkap" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
            required 
            disabled={loading} 
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold disabled:opacity-70" 
          />
          
          <input 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
            required 
            disabled={loading} 
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold disabled:opacity-70" 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
            required 
            minLength={6} 
            disabled={loading} 
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold disabled:opacity-70" 
          />
          
          <input 
            type="password" 
            placeholder="Konfirmasi Password" 
            value={form.confirm} 
            onChange={e => setForm({...form, confirm: e.target.value})} 
            required 
            disabled={loading} 
            className="w-full px-6 py-5 rounded-xl border-4 border-beige focus:border-dark-red outline-none font-bold disabled:opacity-70" 
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-cream font-black py-6 rounded-xl text-xl shadow-2xl hover:scale-105 transition-all disabled:opacity-70 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                Mendaftar...
              </>
            ) : (
              'Daftar & Masuk Sekarang'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-beige font-medium">
          Sudah punya akun? <Link to="/login" className="text-dark-red font-black underline">Login</Link>
        </p>
      </div>
    </div>
  )
}