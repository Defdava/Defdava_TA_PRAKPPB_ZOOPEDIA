// src/pages/Splash.jsx → FINAL: LANGSUNG KE HALAMAN TERAKHIR!
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Auth from "../lib/Auth"
import { Cat } from "lucide-react"

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Auth.isAuthenticated()) {
        const lastPath = sessionStorage.getItem('lastPath') || '/dashboard'
        navigate(lastPath, { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen bg-gradient-to-b from-dark-red via-red-700 to-orange-900 flex flex-col items-center justify-center text-cream">
      <div className="p-12 bg-gradient-to-br from-orange-500 to-red-700 rounded-3xl shadow-2xl animate-bounce">
        <Cat size={140} className="text-cream drop-shadow-2xl" strokeWidth={4} />
      </div>

      <h1 className="mt-12 text-8xl font-black tracking-widest bg-gradient-to-r from-beige to-yellow-100 bg-clip-text text-transparent animate-pulse">
        ZOOPEDIA
      </h1>

      <p className="mt-6 text-2xl font-light text-beige/90">
        Informasi Hewan Dalam Genggaman
      </p>

      <div className="mt-20 flex gap-5">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-6 h-6 bg-beige rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}