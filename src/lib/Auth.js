// src/lib/Auth.js → FINAL DENGAN ROLE & TOKEN
class AuthManager {
  constructor() {
    this.user = null
    this.favorites = []
    this.listeners = []
    this._loadUser()
    this._loadFavorites()
  }

  _loadUser() {
    try {
      const stored = localStorage.getItem('zoopedia_user')
      if (stored) this.user = JSON.parse(stored)
    } catch {}
  }

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

  _saveFavorites() {
    if (!this.user?.email) return
    localStorage.setItem(`zoopedia_fav_${this.user.email}`, JSON.stringify(this.favorites))
  }

  login(userData) {
    this.user = { ...userData, token: this._generateToken(userData) }
    localStorage.setItem('zoopedia_user', JSON.stringify(this.user))
    this._loadFavorites()
    this._notify()
  }

  logout() {
    this.user = null
    this.favorites = []
    localStorage.removeItem('zoopedia_user')
    this._notify()
  }

  _generateToken(data) {
    const payload = btoa(JSON.stringify({ email: data.email, role: data.role || 'user', exp: Date.now() + 30*24*60*60*1000 }))
    return `zoo.${payload}.sign`
  }

  isAuthenticated() { return !!this.user }
  isAdmin() { return this.user?.role === 'admin' }
  getUser() { return this.user }

  toggleFavorite(id) {
    if (!this.user) return []
    const idx = this.favorites.indexOf(id)
    if (idx === -1) this.favorites.push(id)
    else this.favorites.splice(idx, 1)
    this._saveFavorites()
    this._notify()
    return [...this.favorites]
  }

  getFavorites() { return [...this.favorites] }
  isFavorite(id) { return this.favorites.includes(id) }

  subscribe(cb) { this.listeners.push(cb) }
  unsubscribe(cb) { this.listeners = this.listeners.filter(c => c !== cb) }
  _notify() { this.listeners.forEach(cb => cb()) }
}

const Auth = new AuthManager()

window.addEventListener('storage', (e) => {
  if (e.key === 'zoopedia_user') {
    Auth._loadUser()
    Auth._loadFavorites()
    Auth._notify()
  }
})

export default Auth