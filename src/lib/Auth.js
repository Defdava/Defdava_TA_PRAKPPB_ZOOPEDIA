// src/lib/Auth.js
import { supabase } from './supabaseClient'

// Generate avatar unik menggunakan DiceBear
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
    this.favorites = []           // array of string UUID
    this.listeners = []
    this._initialized = false
  }

  async init() {
    if (this._initialized) return
    this._initialized = true

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await this._loadUserData(session.user)
    }

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
  }

  async _loadUserData(authUser) {
    this.user = authUser

    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error || !profile) {
      const avatar = generateAvatar(authUser.email)
      const { data: newProfile, error: insertError } = await supabase
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

      if (insertError) throw insertError
      profile = newProfile
    }

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

    const { data, error } = await supabase
      .from('favorites')
      .select('animal_id')
      .eq('user_id', this.user.id)

    if (error) {
      console.error('Gagal memuat favorit:', error.message)
      this.favorites = []
    } else {
      this.favorites = data?.map(row => row.animal_id) || []
    }
  }

  /**
   * Toggle status favorit hewan (tambah / hapus)
   * @param {string} animalId - Harus berupa string UUID
   * @returns {Promise<boolean>} true = sekarang favorit, false = dihapus
   */
  async toggleFavorite(animalId) {
    if (!this.user) {
      throw new Error('Silakan login terlebih dahulu untuk menyimpan favorit')
    }

    // Validasi tipe data
    if (typeof animalId !== 'string' || !animalId.includes('-')) {
      console.error('animalId tidak valid (harus UUID string):', animalId)
      throw new Error('ID hewan tidak valid. Harus berupa UUID (contoh: 123e4567-e89b-12d3-a456-426614174000)')
    }

    console.log('toggleFavorite dipanggil:', {
      animalId,
      isAlreadyFavorite: this.favorites.includes(animalId),
      userId: this.user.id
    })

    try {
      const isCurrentlyFavorite = this.favorites.includes(animalId)

      if (isCurrentlyFavorite) {
        // Hapus dari favorit
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', this.user.id)
          .eq('animal_id', animalId)

        if (error) throw error

        this.favorites = this.favorites.filter(id => id !== animalId)
      } else {
        // Tambah ke favorit
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: this.user.id,
            animal_id: animalId
          })

        if (error) throw error

        this.favorites.push(animalId)
      }

      this._notify()
      return !isCurrentlyFavorite
    } catch (err) {
      console.error('ERROR toggle favorite:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
        animalId,
        status: err.status
      })

      if (err.code === '23505') { // duplicate key violation
        throw new Error('Hewan ini sudah ada di favorit')
      }

      if (err.message?.includes('invalid input syntax')) {
        throw new Error('Tipe data animal_id di database tidak sesuai. Harus bertipe uuid.')
      }

      throw new Error('Gagal menyimpan favorit. Silakan coba lagi atau periksa koneksi.')
    }
  }

  // ────────────────────────────────────────────────────────────────
  // Method autentikasi lainnya (tetap sama)
  // ────────────────────────────────────────────────────────────────

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

  isAuthenticated() {
    return !!this.user
  }

  isAdmin() {
    return this.profile?.role === 'admin'
  }

  getUser() {
    if (!this.profile) return null
    return {
      ...this.user,
      ...this.profile,
      avatar: this.profile.avatar || generateAvatar(this.user?.email || 'user')
    }
  }

  getFavorites() {
    return [...this.favorites]
  }

  isFavorite(id) {
    return this.favorites.includes(id)
  }

  subscribe(callback) {
    this.listeners.push(callback)
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback)
  }

  _notify() {
    this.listeners.forEach(cb => cb(this))
  }
}

// Singleton
const Auth = new AuthManager()
Auth.init().catch(console.error)

export default Auth
