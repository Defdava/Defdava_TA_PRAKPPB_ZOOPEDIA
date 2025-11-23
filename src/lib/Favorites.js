// src/lib/Favorites.js → FINAL: FAVORIT TERPISAH PER AKUN!
const getKey = () => {
  const user = JSON.parse(localStorage.getItem('zoopedia_user') || 'null')
  const userId = user?.email || 'guest' // kalau belum login = guest
  return `zoopedia_fav_${userId}`
}

export const getFavorites = () => {
  try {
    const key = getKey()
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export const toggleFavorite = (id) => {
  const key = getKey()
  const favs = getFavorites()
  let updated

  if (favs.includes(id)) {
    updated = favs.filter(f => f !== id)
  } else {
    updated = [...favs, id]
  }

  localStorage.setItem(key, JSON.stringify(updated))

  // Trigger update ke semua halaman
  window.dispatchEvent(new CustomEvent('favorites-updated'))

  return updated.includes(id)
}

export const isFavorite = (id) => {
  return getFavorites().includes(id)
}

// BONUS: Hapus semua favorit saat logout (biar bersih)
export const clearFavorites = () => {
  const key = getKey()
  localStorage.removeItem(key)
  window.dispatchEvent(new CustomEvent('favorites-updated'))
}