// src/App.jsx
import { useState, useEffect } from 'react'
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useSearchParams 
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
import Quiz from './pages/Quiz'
import ReviewPage from './pages/ReviewPage'  // ← BARU

function AppContent() {
  const [isAuth, setIsAuth] = useState(Auth.isAuthenticated())
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Deteksi share link: ?share=animal-123
  const sharedAnimalId = searchParams.get('share')?.replace('animal-', '')

  // Simpan halaman terakhir sebelum logout/login
  useEffect(() => {
    if (isAuth && !['/login', '/register', '/'].includes(location.pathname)) {
      const path = location.pathname + location.search
      sessionStorage.setItem('lastPath', path)
    }
  }, [location, isAuth])

  // Splash screen 3 detik
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Update status login secara real-time
  useEffect(() => {
    const update = () => setIsAuth(Auth.isAuthenticated())
    Auth.subscribe(update)
    return () => Auth.unsubscribe(update)
  }, [])

  if (showSplash) return <Splash />

  // Tentukan halaman tujuan setelah login
  const getRedirectPath = () => {
    if (sharedAnimalId && !isNaN(sharedAnimalId)) {
      return `/animals/${sharedAnimalId}`
    }
    const lastPath = sessionStorage.getItem('lastPath')
    if (lastPath && lastPath.startsWith('/animals/')) return lastPath
    return '/dashboard'
  }

  const redirectTo = getRedirectPath()

  return (
    <>
      {isAuth && <HeaderNav />}

      <div className={`min-h-screen bg-cream ${isAuth ? 'pt-20 pb-32' : ''}`}>
        <Routes>
          {/* Root */}
          <Route 
            path="/" 
            element={<Navigate to={isAuth ? redirectTo : "/login"} replace />} 
          />

          {/* Auth Pages */}
          <Route 
            path="/login" 
            element={isAuth ? <Navigate to={redirectTo} replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuth ? <Navigate to={redirectTo} replace /> : <Register />} 
          />

          {/* Protected Pages */}
          <Route 
            path="/dashboard" 
            element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/animals" 
            element={isAuth ? <Animals /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/animals/:id" 
            element={isAuth ? <DetailAnimal /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/education" 
            element={isAuth ? <Education /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/favorites" 
            element={isAuth ? <Favorites /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/profile" 
            element={isAuth ? <Profile /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/quiz" 
            element={isAuth ? <Quiz /> : <Navigate to="/login" replace />} 
          />

          {/* NEW: Halaman Review */}
          <Route 
            path="/review" 
            element={isAuth ? <ReviewPage /> : <Navigate to="/login" replace />} 
          />

          {/* 404 / Fallback */}
          <Route 
            path="*" 
            element={<Navigate to={isAuth ? redirectTo : "/login"} replace />} 
          />
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