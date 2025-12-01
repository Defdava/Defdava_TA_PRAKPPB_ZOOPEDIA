// src/services/api.js — FINAL CLEAN VERSION
import { supabase } from '../lib/supabaseClient'

/* ============================================
   MAP DATA SUPABASE -> FRONTEND FORMAT
============================================ */
const mapAnimal = (row) => ({
  id: row.id,
  nama: row.name,
  nama_latin: row.name_latin || null,
  gambar: row.image_url || "https://via.placeholder.com/800x600?text=No+Image",
  habitat: row.origin || "Tidak diketahui",
  deskripsi_singkat: row.short_description || "",
  deskripsi_lengkap: row.long_description || "",
  condition: row.condition || "LC",
  created_at: row.created_at
})

/* ============================================
   GET ALL ANIMALS
============================================ */
export const getAllAnimals = async () => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error getAllAnimals:", error)
    return []
  }

  return data?.map(mapAnimal) || []
}

/* ============================================
   GET ANIMAL BY ID
============================================ */
export const getAnimalById = async (id) => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return mapAnimal(data)
}

/* ============================================
   CREATE ANIMAL
============================================ */
export const createAnimal = async (form) => {
  const payload = {
    name: form.name,
    name_latin: form.name_latin || null,
    image_url: form.image_url,
    origin: form.origin || null,
    short_description: form.short_description || null,
    long_description: form.long_description,
    condition: form.condition || 'LC'
  }

  const { data, error } = await supabase
    .from('hewan')
    .insert(payload)
    .select('*')

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return mapAnimal(data[0])
}

/* ============================================
   UPDATE ANIMAL
============================================ */
export const updateAnimal = async (id, form) => {
  const payload = {
    name: form.nama || form.name,
    name_latin: form.nama_latin || null,
    image_url: form.gambar || form.image_url,
    origin: form.habitat || form.origin || null,
    short_description: form.deskripsi_singkat || form.short_description || null,
    long_description: form.deskripsi_lengkap || form.long_description,
    condition: form.condition || 'LC'
  }

  const { data, error } = await supabase
    .from('hewan')
    .update(payload)
    .eq('id', id)
    .select('*')

  if (error) throw error

  window.dispatchEvent(new Event('animal-updated'))

  return mapAnimal(data[0])
}

/* ============================================
   DELETE ANIMAL
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
