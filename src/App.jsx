// src/App.jsx → FINAL: PAKAI Auth.js KAMU + HEADER & BOTTOMNAV LANGSUNG MUNCUL!
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './lib/Auth'                    // ← INI FILE KAMU!
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

  // DETEKSI LOGIN SECARA REAL-TIME → HEADER & BOTTOMNAV LANGSUNG MUNCUL!
  useEffect(() => {
    const update = () => {
      setIsAuth(Auth.isAuthenticated())
    }

    Auth.subscribe(update)

    return () => {
      Auth.unsubscribe(update)
    }
  }, [])

  return (
    <BrowserRouter>
      {/* HEADER HANYA MUNCUL KALAU SUDAH LOGIN */}
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-20' : ''}`}>
        <Routes>
          {/* Splash pertama kali */}
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Splash />} />

          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />} />

          {/* Halaman yang butuh login */}
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to={isAuth ? "/dashboard" : "/"} replace />} />
        </Routes>

        {/* BOTTOMNAV HANYA MUNCUL KALAU SUDAH LOGIN */}
        {isAuth && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}