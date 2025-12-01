// src/services/api.js — FINAL DINAMIS TANPA name_latin
import { supabase } from '../lib/supabaseClient'

/* ============================================
   MAP DATA SUPABASE -> FRONTEND FORMAT
============================================ */
const mapAnimal = (row) => ({
  id: row.id,
  nama: row.name,
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
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('Hewan tidak ditemukan')

  return mapAnimal(data)
}

/* ============================================
   CREATE ANIMAL
============================================ */
export const createAnimal = async (form) => {
  const payload = {
    name: form.name,
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
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('Insert ditolak oleh RLS / tidak ada data')

  // supaya halaman Animals auto reload
  window.dispatchEvent(new Event('animal-updated'))

  return mapAnimal(data)
}

/* ============================================
   UPDATE ANIMAL
============================================ */
export const updateAnimal = async (id, form) => {
  const payload = {
    name: form.nama || form.name,
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
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error('Update ditolak oleh RLS / data kosong')

  window.dispatchEvent(new Event('animal-updated'))

  return mapAnimal(data)
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
