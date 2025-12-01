// src/services/api.js → FINAL (Sesuai Struktur Tabel Supabase)
import { supabase } from '../lib/supabaseClient'

// Mapping biar nama tetap konsisten di frontend
const mapHewan = (item) => ({
  id: item.id,
  nama: item.name,
  nama_latin: null, // Tidak ada di DB → tetap null
  gambar: item.image_url || "https://via.placeholder.com/800x600/8b4513/fff?text=Tanpa+Gambar",
  habitat: item.origin || "Tidak diketahui",
  deskripsi_singkat: item.short_description || "",
  deskripsi_lengkap: item.long_description || "Belum ada deskripsi.",
  condition: item.condition || "LC",
  created_at: item.created_at
})

export const getAllAnimals = async () => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error getAllAnimals:', error)
    return []
  }

  return data.map(mapHewan)
}

export const getAnimalById = async (id) => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error getAnimalById:', error)
    throw error
  }

  return mapHewan(data)
}

export const createAnimal = async (formData) => {
  const payload = {
    name: formData.name || formData.nama,
    condition: formData.condition || 'LC',
    origin: formData.origin || formData.habitat || null,
    short_description: formData.short_description || formData.deskripsi_singkat || null,
    long_description: formData.long_description || formData.deskripsi_lengkap,
    image_url: formData.image_url || formData.gambar
  }

  const { data, error } = await supabase
    .from('hewan')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('Gagal upload hewan:', error)
    throw error
  }

  window.dispatchEvent(new Event('animal-updated'))
  return mapHewan(data)
}

export const updateAnimal = async (id, updates) => {
  const payload = {
    name: updates.nama,
    condition: updates.condition,
    origin: updates.habitat || null,
    short_description: updates.deskripsi_singkat || null,
    long_description: updates.deskripsi_lengkap,
    image_url: updates.gambar
  }

  const { data, error } = await supabase
    .from('hewan')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Gagal update hewan:', error)
    throw error
  }

  window.dispatchEvent(new Event('animal-updated'))
  return mapHewan(data)
}

export const deleteAnimal = async (id) => {
  const { error } = await supabase
    .from('hewan')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Gagal hapus hewan:', error)
    throw error
  }

  window.dispatchEvent(new Event('animal-updated'))
  return true
}
