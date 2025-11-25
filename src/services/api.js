// src/services/api.js
const API_URL = "https://apihewann.vercel.app/hewan";

const mapAnimal = (item) => ({
  id: item.id,
  nama: item.name,
  nama_latin: item.name_latin || "",
  gambar: item.image_url,
  habitat: item.origin,
  deskripsi: item.long_description || item.short_description
});

export const getAllAnimals = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data.map(mapAnimal);
};

export const getAnimalById = async (id) => {
  const res = await fetch(API_URL);
  const data = await res.json();
  const hasil = data.find((item) => item.id === id);
  return hasil ? mapAnimal(hasil) : null;
};