// src/services/api.js → FIX "Cannot coerce" + PASTI JALAN
import { supabase } from '../lib/supabaseClient'

export const createAnimal = async (formData) => {
  const { data, error } = await supabase
    .from('hewan')
    .insert([
      {
        name: formData.name,
        name_latin: formData.name_latin || null,
        image_url: formData.image_url,
        origin: formData.origin || null,
        short_description: formData.short_description || null,
        long_description: formData.long_description,
        condition: formData.condition || 'LC'
      }
    ])
    .select()   // ← HAPUS .single() DI SINI!!!

  if (error) {
    console.error('Gagal insert:', error)
    throw error
  }

  // Ambil data pertama (pasti cuma 1)
  const newAnimal = data[0]
  console.log('Berhasil upload:', newAnimal)

  window.dispatchEvent(new Event('animal-updated'))
  return newAnimal
}

export const updateAnimal = async (id, updates) => {
  const { data, error } = await supabase
    .from('hewan')
    .update({
      name: updates.name,
      name_latin: updates.name_latin || null,
      image_url: updates.image_url,
      origin: updates.origin || null,
      short_description: updates.short_description || null,
      long_description: updates.long_description,
      condition: updates.condition || 'LC'
    })
    .eq('id', id)
    .select()   // ← HAPUS .single() DI SINI JUGA!!!

  if (error) throw error
  if (!data || data.length === 0) throw new Error('Hewan tidak ditemukan')

  const updated = data[0]
  window.dispatchEvent(new Event('animal-updated'))
  return updated
}