// src/services/api.js → FINAL FIXED VERSION
import { supabase } from '../lib/supabaseClient'

/* ============================================
   MAPPING SUPABASE → UI
============================================ */
const mapHewan = (item) => ({
  id: item.id,
  nama: item.name,
  nama_latin: null, // tidak ada di database
  gambar: item.image_url || "https://via.placeholder.com/800x600/8b4513/fff?text=Tanpa+Gambar",
  habitat: item.origin || "Tidak diketahui",
  deskripsi_singkat: item.short_description || "",
  deskripsi_lengkap: item.long_description || "Belum ada deskripsi.",
  condition: item.condition || "LC",
  created_at: item.created_at
})

/* ============================================
   GET ALL
============================================ */
export const getAllAnimals = async () => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map(mapHewan)
}

/* ============================================
   GET BY ID
============================================ */
export const getAnimalById = async (id) => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return mapHewan(data)
}

/* ============================================
   INSERT
============================================ */
export const createAnimal = async (formData) => {
  const payload = {
    name: formData.name,
    condition: formData.condition || 'LC',
    origin: formData.origin || null,
    short_description: formData.short_description || null,
    long_description: formData.long_description,
    image_url: formData.image_url
  }

  const { data, error } = await supabase
    .from('hewan')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return mapHewan(data)
}

/* ============================================
   UPDATE (FULL + FIXED)
============================================ */
export const updateAnimal = async (id, updates) => {
  const payload = {
    name: updates.name,
    image_url: updates.image_url,
    origin: updates.origin || null,
    short_description: updates.short_description || null,
    long_description: updates.long_description,
    condition: updates.condition
  }

  const { data, error } = await supabase
    .from('hewan')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return mapHewan(data)
}

/* ============================================
   DELETE
============================================ */
export const deleteAnimal = async (id) => {
  const { error } = await supabase
    .from('hewan')
    .delete()
    .eq('id', id)

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return true
}
