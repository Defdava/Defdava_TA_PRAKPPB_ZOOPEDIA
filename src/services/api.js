// src/services/api.js → SUPER OPTIMIZED FOR VERCEL
import { supabase } from '../lib/supabaseClient'

// Mapping data
const mapHewan = (item) => ({
  id: item.id,
  nama: item.name,
  nama_latin: null,
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

  if (error) return []

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
    .maybeSingle()

  if (error) throw error

  return mapHewan(data)
}

/* ============================================
   SUPER FAST INSERT
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

  // FASTEST WAY — only return id
  const { data, error } = await supabase
    .from('hewan')
    .insert(payload)
    .select('id')
    .maybeSingle()

  if (error) throw error

  // Emit refresh event ASAP
  window.dispatchEvent(new Event('animal-updated'))

  return data?.id
}

/* ============================================
   SUPER FAST UPDATE
============================================ */
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
    .select('id')
    .maybeSingle()

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return data?.id
}

/* ============================================
   FAST DELETE
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
