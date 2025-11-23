// src/App.jsx → FITUR SHARE HEWAN LANGSUNG JALAN SETELAH LOGIN!
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()

  // DETEKSI SHARE LINK DARI URL → ?share=animal-5
  const sharedAnimalId = searchParams.get('share')?.replace('animal-', '')

  // Simpan halaman terakhir + prioritas ke share link
  useEffect(() => {
    if (isAuth && !['/login', '/register', '/'].includes(location.pathname)) {
      const path = location.pathname + location.search
      sessionStorage.setItem('lastPath', path)
    }
  }, [location, isAuth])

  // Splash 3 detik setiap refresh
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Update auth real-time
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  if (showSplash) return <Splash />

  // Tentukan tujuan akhir setelah login
  const getRedirectPath = () => {
    if (sharedAnimalId && !isNaN(sharedAnimalId)) {
      return `/animals/${sharedAnimalId}`
    }
    const lastPath = sessionStorage.getItem('lastPath')
    return lastPath && lastPath.includes('/animals/') ? lastPath : '/dashboard'
  }

  const redirectTo = getRedirectPath()

  return (
    <>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuth ? redirectTo : "/login"} replace />} />
          
          <Route path="/login" element={isAuth ? <Navigate to={redirectTo} replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to={redirectTo} replace /> : <Register />} />

          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to={isAuth ? redirectTo : "/login"} replace />} />
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