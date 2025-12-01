// src/services/api.js → VERSI FINAL YANG BENAR
import { supabase } from '../lib/supabaseClient'  // ← INI YANG WAJIB!

// Mapping data dari tabel `hewan`
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

export const updateAnimal = async (id, updates, newImageFile = null) => {
  let image_url = updates.gambar

  if (newImageFile) {
    const fileExt = newImageFile.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('animal-images')
      .upload(fileName, newImageFile)
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('animal-images')
      .getPublicUrl(fileName)
    image_url = publicUrl
  }

  const { data, error } = await supabase
    .from('hewan')
    .update({
      name: updates.nama,
      name_latin: updates.nama_latin || null,
      image_url,
      origin: updates.habitat,
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