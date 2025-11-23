// src/lib/Auth.js → FINAL MERGED VERSION (LOGIN, SESSION, FAVORIT PER AKUN, REALTIME)
class AuthManager {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('zoopedia_user')) || null
    this.listeners = [] 
    this._loadFavorites() 
  }

  // Load favorit sesuai user login
  _loadFavorites() {
    if (!this.user?.email) {
      this.favorites = []
      return
    }
    const key = `zoopedia_fav_${this.user.email}`
    try {
      this.favorites = JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
      this.favorites = []
    }
  }

  // Simpan favorit per akun
  _saveFavorites() {
    if (!this.user?.email) return
    const key = `zoopedia_fav_${this.user.email}`
    localStorage.setItem(key, JSON.stringify(this.favorites))
  }

  // Hapus favorit saat logout
  _clearFavorites() {
    if (!this.user?.email) return
    const key = `zoopedia_fav_${this.user.email}`
    localStorage.removeItem(key)
    this.favorites = []
  }

  // LOGIN
  login(userData) {
    this.user = userData
    localStorage.setItem('zoopedia_user', JSON.stringify(userData))
    this._loadFavorites()
    this._notify()
  }

  // LOGOUT
  logout() {
    this._clearFavorites()
    this.user = null
    localStorage.removeItem('zoopedia_user')
    this._notify()
  }

  // Status
  isAuthenticated() {
    return !!this.user
  }

  getUser() {
    return this.user
  }

  // Edit data user
  updateProfile(data) {
    if (!this.user) return
    this.user = { ...this.user, ...data }
    localStorage.setItem('zoopedia_user', JSON.stringify(this.user))
    this._notify()
  }

  // FAVORIT: tambah/hapus
  toggleFavorite(id) {
    if (!this.user) return this.favorites || []

    const idx = this.favorites.indexOf(id)
    if (idx === -1) this.favorites.push(id)
    else this.favorites.splice(idx, 1)

    this._saveFavorites()
    this._notify() 
    return [...this.favorites]
  }

  getFavorites() {
    return [...this.favorites]
  }

  isFavorite(id) {
    return this.favorites.includes(id)
  }

  // Listener realtime UI
  subscribe(callback) {
    this.listeners.push(callback)
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback)
  }

  _notify() {
    this.listeners.forEach(cb => cb())
  }
}

// Export instance
const Auth = new AuthManager()

// Sinkronisasi antar-tab (optional tapi sangat membantu)
window.addEventListener('storage', (e) => {
  if (e.key === 'zoopedia_user' || e.key?.startsWith('zoopedia_fav_')) {
    const newUser = JSON.parse(localStorage.getItem('zoopedia_user') || 'null')
    if (JSON.stringify(Auth.user) !== JSON.stringify(newUser)) {
      Auth.user = newUser
      Auth._loadFavorites()
      Auth._notify()
    }
  }
})

export default Auth
