// src/App.jsx
import { useState, useEffect } from 'react'
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom'

import Auth from './lib/Auth'
import BottomNav from './components/BottomNav'
import HeaderNav from './components/HeaderNav'

// Pages
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Animals from './pages/Animals'
import DetailAnimal from './pages/DetailAnimal'
import Education from './pages/Education'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'
import UploadAnimal from './pages/UploadAnimal'
import Quiz from './pages/Quiz'
import ReviewPage from './pages/ReviewPage'

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const location = useLocation()

  /* ========================================================
     1. SPLASH SCREEN 3 DETIK
  ======================================================== */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  /* ========================================================
     2. CEK STATUS LOGIN SAAT APP PERTAMA KALI DIMUAT
  ======================================================== */
  useEffect(() => {
    const check = async () => {
      await Auth.init?.()
      setIsAuthenticated(Auth.isAuthenticated())
    }
    check()
  }, [])

  /* ========================================================
     3. SELALU SIMPAN HALAMAN SEKARANG (UNTUK RESTORE RELOAD)
  ======================================================== */
  useEffect(() => {
    const path = location.pathname + location.search
    sessionStorage.setItem("lastPageBeforeRefresh", path)
  }, [location])

  /* ========================================================
     4. LISTEN PERUBAHAN LOGIN/LOGOUT
  ======================================================== */
  useEffect(() => {
    const handler = () => setIsAuthenticated(Auth.isAuthenticated())
    Auth.subscribe?.(handler)
    return () => Auth.unsubscribe?.(handler)
  }, [])

  /* ========================================================
     RENDERING
  ======================================================== */

  // Splash
  if (showSplash) return <Splash />

  // Loading Auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-beige border-t-dark-red"></div>
          <p className="text-dark-red font-bold text-xl mt-6">Memuat Zoopedia...</p>
        </div>
      </div>
    )
  }

  // Jika belum login → force login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Jika user buka route selain login/register → paksa login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  /* ========================================================
     JIKA USER SUDAH LOGIN
     ROOT "/" AKAN DIARAHKAN KE LAST PAGE SEBELUM REFRESH
     NAMUN REFRESH DI HALAMAN APA PUN TETAP BERADA DI HALAMAN ITU
  ======================================================== */

  const lastPage = sessionStorage.getItem("lastPageBeforeRefresh") || "/dashboard"

  return (
    <>
      <HeaderNav />

      <div className="min-h-screen bg-cream pt-20 pb-32">
        <Routes>

          {/* ROOT REDIRECT KE LAST PAGE */}
          <Route path="/" element={<Navigate to={lastPage} replace />} />

          {/* HALAMAN PROTECTED */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<DetailAnimal />} />
          <Route path="/education" element={<Education />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/upload-animal" element={<UploadAnimal />} />

          {/* JIKA PAGE TIDAK ADA → BALIK KE LAST PAGE */}
          <Route path="*" element={<Navigate to={lastPage} replace />} />
        </Routes>

        <BottomNav />
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
