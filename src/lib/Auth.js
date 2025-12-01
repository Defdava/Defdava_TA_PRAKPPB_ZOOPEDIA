// src/lib/Auth.js → FINAL + AVATAR ACAK + ADMIN CHECK
import { supabase } from './supabaseClient'

// Generate avatar cantik & unik berdasarkan email
const generateAvatar = (email = 'user') => {
  const seed = email.trim().toLowerCase()
  const styles = ['adventurer', 'bottts', 'croodles', 'identicon', 'micah', 'open-peeps', 'personas', 'pixel-art']
  const hash = seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const style = styles[Math.abs(hash) % styles.length]
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&size=256&backgroundColor=ffdfbf,d4f1f4,ffd5b3`
}

class AuthManager {
  constructor() {
    this.user = null
    this.profile = null
    this.favorites = []
    this.listeners = []
    this._initialized = false
    this._init()
  }

  async _init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await this._loadUserData(session.user)

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await this._loadUserData(session.user)
      } else if (event === 'SIGNED_OUT') {
        this.user = null
        this.profile = null
        this.favorites = []
        this._notify()
      }
    })

    this._initialized = true
  }

  async _loadUserData(authUser) {
    this.user = authUser
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    // Kalau profil belum ada → buat baru + avatar acak
    if (!profile || error?.code === 'PGRST116') {
      const avatar = generateAvatar(authUser.email)
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || 'Pengguna Zoopedia',
          avatar,
          role: 'user'
        })
        .select()
        .single()
      profile = newProfile
    }

    // Kalau avatar kosong → kasih acak
    if (!profile.avatar) {
      profile.avatar = generateAvatar(authUser.email)
      await supabase.from('profiles').update({ avatar: profile.avatar }).eq('id', authUser.id)
    }

    this.profile = profile
    await this._loadFavorites()
    this._notify()
  }

  async _loadFavorites() {
    if (!this.user) {
      this.favorites = []
      return
    }
    const { data } = await supabase
      .from('favorites')
      .select('animal_id')
      .eq('user_id', this.user.id)
    this.favorites = data ? data.map(f => f.animal_id) : []
  }

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await this._loadUserData(data.user)
    return data
  }

  async register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) throw error
    if (data.user) await this._loadUserData(data.user)
    return data
  }

  async logout() {
    await supabase.auth.signOut()
    this.user = null
    this.profile = null
    this.favorites = []
    this._notify()
  }

  isAuthenticated() { return !!this.user }
  isAdmin() { return this.profile?.role === 'admin' }

  getUser() {
    if (!this.profile) return null
    return {
      ...this.user,
      ...this.profile,
      avatar: this.profile.avatar || generateAvatar(this.user?.email || 'user')
    }
  }

  async updateProfile(updates) {
    if (!this.user) return { error: 'Not logged in' }

    if ('avatar' in updates && !updates.avatar) {
      updates.avatar = generateAvatar(this.user.email)
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', this.user.id)
      .select()
      .single()

    if (!error) {
      this.profile = data
      this._notify()
    }
    return { data, error }
  }

  async toggleFavorite(animalId) {
    if (!this.user) return this.favorites
    const isFav = this.favorites.includes(animalId)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', this.user.id).eq('animal_id', animalId)
      this.favorites = this.favorites.filter(id => id !== animalId)
    } else {
      await supabase.from('favorites').insert({ user_id: this.user.id, animal_id: animalId })
      this.favorites.push(animalId)
    }
    this._notify()
    return [...this.favorites]
  }

  getFavorites() { return [...this.favorites] }
  isFavorite(id) { return this.favorites.includes(id) }

  subscribe(cb) { this.listeners.push(cb) }
  unsubscribe(cb) { this.listeners = this.listeners.filter(l => l !== cb) }
  _notify() { this.listeners.forEach(cb => cb()) }
}

const Auth = new AuthManager()
export default Auth