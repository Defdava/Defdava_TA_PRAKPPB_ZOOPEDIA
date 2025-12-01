// src/pages/Splash.jsx → RESPONSIVE MOBILE + AUTO-NAVIGATE
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
        navigate('/login', { replace: true })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-b from-dark-red via-red-700 to-orange-900 flex flex-col items-center justify-center text-cream px-6">

      {/* LOGO */}
      <div className="p-10 sm:p-12 bg-gradient-to-br from-orange-500 to-red-700 rounded-3xl shadow-2xl animate-bounce">
        <Cat 
          size={100}        // MOBILE
          className="text-cream drop-shadow-2xl sm:size-[130px] md:size-[150px]" 
          strokeWidth={4} 
        />
      </div>

      {/* TITLE — RESPONSIVE */}
      <h1 
        className="
          mt-10 
          font-black 
          tracking-widest 
          bg-gradient-to-r from-beige to-yellow-100 bg-clip-text text-transparent
          text-[13vw]       /* MOBILE - 13% width, tidak akan terpotong */
          sm:text-[10vw]    /* Tablet */
          md:text-7xl       /* Desktop */
          lg:text-8xl
          animate-pulse
          text-center
        "
      >
        ZOOPEDIA
      </h1>

      {/* SUBTITLE */}
      <p 
        className="
          mt-4 
          text-center 
          text-beige/90 
          text-[4vw]      /* mobile */
          sm:text-xl 
          md:text-2xl 
          font-light
        "
      >
        Informasi Hewan Dalam Genggaman
      </p>

      {/* LOADING DOTS */}
      <div className="mt-16 flex gap-5">
        {[0, 1, 2].map(i => (
          <div 
            key={i}
            className="w-4 h-4 sm:w-6 sm:h-6 bg-beige rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
