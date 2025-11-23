// src/App.jsx → FINAL TERAKHIR: SEMUA FITUR JALAN SEMPURNA!
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
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()

  // Simpan halaman terakhir sebelum refresh
  useEffect(() => {
    if (isAuth) {
      sessionStorage.setItem('lastPath', location.pathname + location.search)
    }
  }, [location, isAuth])

  // Splash muncul setiap refresh (3 detik)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Update auth real-time
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  // Tampilkan splash dulu
  if (showSplash) {
    return <Splash />
  }

  // Ambil halaman terakhir setelah splash selesai
  const lastPath = sessionStorage.getItem('lastPath') || '/dashboard'

  return (
    <>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuth ? lastPath : "/login"} replace />} />
          <Route path="/login" element={isAuth ? <Navigate to={lastPath} replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to={lastPath} replace /> : <Register />} />

          {/* Halaman yang butuh login */}
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          {/* Semua route yang gak ketemu → arahin ke halaman terakhir */}
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