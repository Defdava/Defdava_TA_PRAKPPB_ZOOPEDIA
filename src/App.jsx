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

  // 1. Splash 3 detik
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // 2. Cek status login sekali saat app mulai
  useEffect(() => {
    const check = async () => {
      await Auth.init?.()
      setIsAuthenticated(Auth.isAuthenticated())
    }
    check()
  }, [])

  // 3. Simpan halaman terakhir (kecuali login/register)
  useEffect(() => {
    if (isAuthenticated === true) {
      const path = location.pathname + location.search
      if (!['/login', '/register'].includes(location.pathname)) {
        sessionStorage.setItem('lastPageBeforeRefresh', path)
      }
    }
  }, [location, isAuthenticated])

  // 4. Dengarkan perubahan login/logout
  useEffect(() => {
    const handler = () => setIsAuthenticated(Auth.isAuthenticated())
    Auth.subscribe?.(handler)
    return () => Auth.unsubscribe?.(handler)
  }, [])

  // Splash
  if (showSplash) return <Splash />

  // Loading auth
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
      </Routes>
    )
  }

  // Jika sudah login → restore halaman terakhir untuk root
  const lastPage = sessionStorage.getItem('lastPageBeforeRefresh') || '/*'

  return (
    <>
      <HeaderNav />

      <div className="min-h-screen bg-cream pt-20 pb-32">
        <Routes>
          {/* Root diarahkan ke lastPage */}
          <Route path="/" element={<Navigate to={lastPage} replace />} />

          {/* Semua halaman protected */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<DetailAnimal />} />
          <Route path="/education" element={<Education />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/upload-animal" element={<UploadAnimal />} />

          {/* 404 → kembali ke lastPage */}
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
