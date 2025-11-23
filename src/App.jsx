// src/App.jsx → FINAL: SPLASH MUNCUL SETIAP REFRESH + RESTORE HALAMAN!
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
  const [showSplash, setShowSplash] = useState(true) // ← SELALU TRUE = SPLASH MUNCUL DULU!
  const location = useLocation()

  // Simpan halaman terakhir setiap navigasi
  useEffect(() => {
    if (isAuth && !['/login', '/register', '/'].includes(location.pathname)) {
      sessionStorage.setItem('lastPath', location.pathname + location.search)
    }
  }, [location, isAuth])

  // SPLASH SELALU MUNCUL 3 DETIK SETIAP REFRESH!
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, []) // ← KOSONG = JALAN SEKALI TIAP REFRESH!

  // Update auth real-time
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  // TAMPILKAN SPLASH DULU SELALU!
  if (showSplash) {
    return <Splash />
  }

  const lastPath = sessionStorage.getItem('lastPath') || '/dashboard'

  return (
    <>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuth ? lastPath : "/login"} replace />} />
          <Route path="/login" element={isAuth ? <Navigate to={lastPath} replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to={lastPath} replace /> : <Register />} />

          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to={isAuth ? lastPath : "/login"} replace />} />
        </Routes>

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