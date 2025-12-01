// src/services/api.js → FINAL + PASTI JALAN + EXPORT SEMUA YANG DIPERLUKAN
import { supabase } from '../lib/supabaseClient'

// Mapping biar semua komponen tetap pake field Inggris (name, image_url, dll)
const mapHewan = (item) => ({
  id: item.id,
  name: item.name || "Hewan Tidak Diketahui",
  name_latin: item.name_latin || "-",
  image_url: item.image_url || "https://via.placeholder.com/800x600/8b4513/fff?text=No+Image",
  origin: item.origin || "Tidak diketahui",
  short_description: item.short_description || "",
  long_description: item.long_description || "Belum ada deskripsi.",
  condition: item.condition || "LC",
  created_at: item.created_at,
  updated_at: item.updated_at
})

export const getAllAnimals = async () => {
  const { data, error } = await supabase
    .from('hewan')
    .select('*')
    .order('created_at', { ascending: false })

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

  if (error) throw error
  return mapHewan(data)
}

export const createAnimal = async (formData) => {
  const { data, error } = await supabase
    .from('hewan')
    .insert([{
      name: formData.name,
      name_latin: formData.name_latin || null,
      image_url: formData.image_url,
      origin: formData.origin || null,
      short_description: formData.short_description || null,
      long_description: formData.long_description,
      condition: formData.condition || 'LC'
    }])
    .select()

  if (error) throw error
  window.dispatchEvent(new Event('animal-updated'))
  return data[0] ? mapHewan(data[0]) : null
}

export const updateAnimal = async (id, updates) => {
  const { data, error } = await supabase
    .from('hewan')
    .update({
      name: updates.name,
      name_latin: updates.name_latin || null,
      image_url: updates.image_url || updates.gambar,
      origin: updates.origin || null,
      short_description: updates.short_description || null,
      long_description: updates.long_description,
      condition: updates.condition || 'LC'
    })
    .eq('id', id)
    .select()

  if (error) throw error
  window.dispatchEvent(new Event('animal-updated'))
  return data[0] ? mapHewan(data[0]) : null
}

export const deleteAnimal = async (id) => {
  const { error } = await supabase
    .from('hewan')
    .delete()
    .eq('id', id)

  if (error) throw error
  window.dispatchEvent(new Event('animal-updated'))
  return true
}