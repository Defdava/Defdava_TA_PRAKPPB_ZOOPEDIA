// src/App.jsx → FINAL TERAKHIR: PAKAI AUTH KAMU + REFRESH TETAP DI HALAMAN SAMA + VERCEL AMAN!
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

function AppContent() {
  const [isAuth, setIsAuth] = useState(Auth.isAuthenticated())
  const location = useLocation()

  // Real-time update login status → Header & BottomNav langsung muncul/hilang!
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  // Simpan halaman terakhir setiap navigasi (kecuali login/register)
  useEffect(() => {
    if (isAuth && !['/login', '/register', '/'].includes(location.pathname)) {
      sessionStorage.setItem('lastPath', location.pathname + location.search)
    }
  }, [location, isAuth])

  // Ambil halaman terakhir
  const lastPath = sessionStorage.getItem('lastPath') || '/dashboard'

  return (
    <>
      {/* HEADER & BOTTOMNAV HANYA MUNCUL KALAU SUDAH LOGIN */}
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>
          {/* Root → langsung ke splash atau halaman terakhir */}
          <Route path="/" element={isAuth ? <Navigate to={lastPath} replace /> : <Splash />} />

          {/* Login & Register */}
          <Route path="/login" element={isAuth ? <Navigate to={lastPath} replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to={lastPath} replace /> : <Register />} />

          {/* Halaman utama (harus login) */}
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          {/* Fallback → arahin ke halaman terakhir atau splash */}
          <Route path="*" element={<Navigate to={isAuth ? lastPath : "/"} replace />} />
        </Routes>

        {/* BOTTOMNAV HANYA MUNCUL KALAU SUDAH LOGIN */}
        {isAuth && <BottomNav />}
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