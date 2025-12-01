// src/services/api.js
import Auth from "../lib/Auth";

const API_URL = "https://apihewann.vercel.app/hewan";

/* ===============================
   MAP DATA API → FRONTEND FORMAT
================================ */
const mapAnimal = (item) => ({
  id: item.id,
  nama: item.name,
  gambar: item.image_url,
  habitat: item.origin,
  deskripsi_singkat: item.short_description || "",
  deskripsi_lengkap: item.long_description || "",
  condition: item.condition,
  created_at: item.created_at,
  updated_at: item.updated_at
});

/* ===============================
   GET SEMUA HEWAN
================================ */
export const getAllAnimals = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!Array.isArray(data)) return [];
    return data.map(mapAnimal);
  } catch (err) {
    console.error("Gagal memuat semua hewan:", err);
    return [];
  }
};

/* ===============================
   GET HEWAN BY ID
   (kalau backend belum punya GET /hewan/:id,
    kita tetap pakai fetch semua lalu find)
================================ */
export const getAnimalById = async (id) => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const hasil = data.find((item) => String(item.id) === String(id));
    return hasil ? mapAnimal(hasil) : null;
  } catch (err) {
    console.error("Gagal memuat hewan:", err);
    throw new Error("Gagal memuat detail hewan.");
  }
};

/* ===================================================
   ADMIN CHECK
=================================================== */
const requireAdmin = () => {
  if (!Auth.isAdmin()) {
    throw new Error("Akses ditolak. Hanya admin.");
  }
};

/* ===============================
   CREATE HEWAN (POST /hewan)
================================ */
export const createAnimal = async (payload) => {
  requireAdmin();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      condition: payload.condition,
      origin: payload.origin,
      short_description: payload.short_description || "",
      long_description: payload.long_description || "",
      image_url: payload.image_url
    })
  });

  if (!res.ok) {
    console.error("Create error:", await res.text());
    throw new Error("Gagal mengunggah hewan.");
  }

  window.dispatchEvent(new Event("animal-updated"));
  return mapAnimal(await res.json());
};

/* ===============================
   UPDATE HEWAN (PUT /hewan)
   (id dikirim di body, masih pakai endpoint base)
================================ */
export const updateAnimal = async (id, payload) => {
  requireAdmin();

  const res = await fetch(API_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id, // penting: kirim id di body
      name: payload.name,
      condition: payload.condition,
      origin: payload.origin,
      short_description: payload.short_description || "",
      long_description: payload.long_description || "",
      image_url: payload.image_url
    })
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Update error:", res.status, text);
    throw new Error("Gagal memperbarui hewan.");
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    // kalau backend cuma balikin pesan, bukan objek hewan penuh
    window.dispatchEvent(new Event("animal-updated"));
    return { ...payload, id }; 
  }

  window.dispatchEvent(new Event("animal-updated"));
  return mapAnimal(json);
};

/* ===============================
   DELETE HEWAN (DELETE /hewan)
   id DIKIRIM DI BODY (sesuai endpoint base)
================================ */
export const deleteAnimal = async (id) => {
  requireAdmin();

  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })  // ⬅️ INI PENTING
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Delete error:", res.status, text);
    throw new Error("Gagal menghapus hewan.");
  }

  window.dispatchEvent(new Event("animal-updated"));
  return true;
};
