// src/App.jsx → FINAL TERAKHIR: SPLASH MUNCUL SETIAP REFRESH! 100% JALAN!
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  const [isAuth, setIsAuth] = useState(Auth.isAuthenticated())
  const [ready, setReady] = useState(false) // ← INI KUNCI UTAMANYA!

  // HANYA JALAN SEKALI SAAT APLIKASI DIMUAT
  useEffect(() => {
    // Selalu tampilkan splash saat refresh / buka pertama kali
    setReady(false)

    // Timer 3 detik untuk splash
    const timer = setTimeout(() => {
      setReady(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Update auth real-time
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  // SELAMA BELUM READY → TAMPILKAN SPLASH
  if (!ready) {
    return <Splash />
  }

  // SETELAH 3 DETIK → TAMPILKAN HALAMAN SESUAI
  return (
    <BrowserRouter>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />} />

          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} />
        </Routes>

        {isAuth && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}