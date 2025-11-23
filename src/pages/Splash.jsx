// src/pages/Splash.jsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Cat } from "lucide-react"

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login")  // pindah ke login setelah 2.5 detik
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen bg-dark-red flex flex-col items-center justify-center text-cream animate-fadeIn">
      {/* Logo */}
      <div className="p-6 bg-mid-red rounded-3xl shadow-2xl animate-bounce-slow">
        <Cat size={90} className="text-beige" />
      </div>

      {/* Judul */}
      <h1 className="mt-6 text-4xl font-extrabold tracking-widest">
        ZOOPEDIA
      </h1>

      {/* Subtext */}
      <p className="text-light-beige mt-2 tracking-wide">
        Informasi Hewan Dalam Genggaman
      </p>
    </div>
  )
}
