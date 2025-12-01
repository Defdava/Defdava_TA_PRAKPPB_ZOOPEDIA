// src/services/api.js → FINAL + INSERT, UPDATE, DELETE
import { supabase } from '../lib/supabaseClient'

const mapHewan = (item) => ({
  id: item.id,
  nama: item.name || "Hewan Tidak Diketahui",
  nama_latin: item.name_latin || "-",
  gambar: item.image_url || "https://via.placeholder.com/800x600?text=No+Image",
  habitat: item.origin || "Tidak diketahui",
  deskripsi: item.long_description || item.short_description || "Belum ada deskripsi.",
  status_konservasi: item.condition
})

export const getAllAnimals = async () => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .order('name')
  if (error) throw error
  return data.map(mapHewan)
}

export const getAnimalById = async (id) => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return mapHewan(data)
}

// BARU: Upload Hewan Baru
export const createAnimal = async (formData) => {
  const { data, error } = await supabase
    .from('hewan')
    .insert([
      {
        name: formData.name,
        name_latin: formData.name_latin,
        image_url: formData.image_url,
        origin: formData.origin,
        short_description: formData.short_description,
        long_description: formData.long_description,
        condition: formData.condition || 'LC', // default jika ada kolom
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    .select()
    .single()

  if (error) throw error
  return mapHewan(data)
}

// BARU: Update Hewan (untuk Edit nanti)
export const updateAnimal = async (id, updates) => {
  const { data, error } = await supabase
    .from('hewan')
    .update({
      name: updates.nama,
      name_latin: updates.nama_latin,
      image_url: updates.gambar,
      origin: updates.habitat,
      short_description: updates.short_description,
      long_description: updates.deskripsi,
      condition: updates.status_konservasi,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapHewan(data)
}

// BARU: Hapus Hewan
export const deleteAnimal = async (id) => {
  const { error } = await supabase
    .from('hewan')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}