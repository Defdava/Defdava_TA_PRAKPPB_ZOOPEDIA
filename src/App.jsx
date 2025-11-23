// src/App.jsx → FINAL FIX: Splash muncul di localhost + production
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
  const [afterRefresh, setAfterRefresh] = useState(false)
  const location = useLocation()

  // Real-time update auth
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  // Simpan halaman terakhir
  useEffect(() => {
    if (isAuth && !['/login', '/register', '/'].includes(location.pathname)) {
      sessionStorage.setItem('lastPath', location.pathname + location.search)
    }
  }, [location, isAuth])

  const lastPath = sessionStorage.getItem('lastPath') || '/dashboard'

  // FIX: Splash muncul saat refresh (LOCALHOST + PRODUCTION)
  useEffect(() => {
    const firstLoad = !sessionStorage.getItem("forceSplash")

    if (firstLoad) {
      sessionStorage.setItem("forceSplash", "yes")
      setAfterRefresh(true)
    } else {
      setAfterRefresh(false)
      sessionStorage.removeItem("forceSplash")
    }
  }, [])

  return (
    <>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>

          {/* ROOT → Splash muncul saat refresh */}
          <Route
            path="/"
            element={
              afterRefresh
                ? <Splash />
                : isAuth
                  ? <Navigate to={lastPath} replace />
                  : <Splash />
            }
          />

          {/* Auth routes */}
          <Route path="/login" element={isAuth ? <Navigate to={lastPath} replace /> : <Login />} />
          <Route path="/register" element={isAuth ? <Navigate to={lastPath} replace /> : <Register />} />

          {/* Protected pages */}
          <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/animals" element={isAuth ? <Animals /> : <Navigate to="/login" replace />} />
          <Route path="/animals/:id" element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} />
          <Route path="/education" element={isAuth ? <Education /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuth ? lastPath : "/"} replace />} />
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
