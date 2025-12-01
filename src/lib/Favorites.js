// src/lib/Favorites.js
const getKey = () => {
  const user = JSON.parse(localStorage.getItem('zoopedia_user') || 'null')
  const userId = user?.email || 'guest'
  return `zoopedia_fav_${userId}`
}

export const getFavorites = () => {
  try {
    const key = getKey()
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
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

  // Beritahu semua tab/halaman bahwa favorit berubah
  window.dispatchEvent(new CustomEvent('favorites-updated'))

  return updated.includes(id) // true = sekarang jadi favorit
}

export const isFavorite = (id) => {
  return getFavorites().includes(id)
}

export const clearFavorites = () => {
  const key = getKey()
  localStorage.removeItem(key)
  window.dispatchEvent(new CustomEvent('favorites-updated'))
}