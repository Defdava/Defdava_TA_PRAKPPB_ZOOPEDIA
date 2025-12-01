// src/pages/DetailAnimal.jsx — FINAL FIX (UPDATE BERHASIL)
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnimalById, updateAnimal } from "../services/api";
import Auth from "../lib/Auth";
import {
  ArrowLeft,
  Share2,
  Edit3,
  Save,
  X,
  Globe,
  BookOpen,
} from "lucide-react";

export default function DetailAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  /* CEK ADMIN */
  useEffect(() => {
    setIsAdmin(Auth.isAdmin());
  }, []);

  /* LOAD DETAIL HEWAN */
  useEffect(() => {
    const load = async () => {
      const data = await getAnimalById(id);
      setAnimal(data);
      setEditData({
        nama: data.nama,
        gambar: data.gambar,
        habitat: data.habitat,
        deskripsi_singkat: data.deskripsi_singkat,
        deskripsi_lengkap: data.deskripsi_lengkap,
        condition: data.condition,
      });
      setLoading(false);
    };
    load();
  }, [id]);

  /* FITUR SHARE */
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/animals/${id}`;

    if (navigator.share) {
      navigator.share({
        title: animal.nama,
        text: `Lihat info tentang ${animal.nama}`,
        url: shareUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link disalin!");
    }
  };

  /* SIMPAN EDIT */
  const saveEdit = async () => {
    setSaving(true);
    try {
      const updated = await updateAnimal(id, {
        name: editData.nama,
        condition: editData.condition,
        origin: editData.habitat,
        short_description: editData.deskripsi_singkat,
        long_description: editData.deskripsi_lengkap,
        image_url: editData.gambar,
      });

      setAnimal(updated);
      setIsEditing(false);
      alert("Berhasil diperbarui!");
    } catch (e) {
      alert("Gagal menyimpan: " + e.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 rounded-full border-8 border-beige border-t-dark-red"></div>
          <p className="mt-4 text-xl font-bold text-dark-red">Memuat hewan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-32">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 
          bg-dark-red text-cream px-5 py-3 rounded-full font-bold shadow-xl hover:scale-105"
      >
        <ArrowLeft /> Kembali
      </button>

      {/* SHARE BUTTON */}
      <button
        onClick={handleShare}
        className="fixed bottom-24 right-4 z-50 bg-green-700 text-cream px-6 py-4 rounded-full shadow-xl 
          flex items-center gap-3 font-bold hover:scale-110"
      >
        <Share2 size={26} />
        Bagikan
      </button>

      {/* GAMBAR */}
      <div className="max-w-5xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-3xl shadow-xl border-8 border-beige overflow-hidden">
          <img
            src={editData.gambar}
            alt={animal.nama}
            className="w-full object-contain p-6"
          />
        </div>

        {isEditing && (
          <input
            type="text"
            value={editData.gambar}
            onChange={(e) =>
              setEditData({ ...editData, gambar: e.target.value })
            }
            className="mt-4 w-full p-4 border-4 border-beige rounded-xl"
          />
        )}
      </div>

      {/* NAMA */}
      <div className="px-6 py-10 text-center">
        {isEditing ? (
          <input
            className="text-5xl font-black w-full text-center bg-transparent border-b-4 border-dark-red"
            value={editData.nama}
            onChange={(e) =>
              setEditData({ ...editData, nama: e.target.value })
            }
          />
        ) : (
          <h1 className="text-6xl font-black text-dark-red">{animal.nama}</h1>
        )}
      </div>

      {/* INFORMASI */}
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* HABITAT */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Globe size={20} /> Habitat
          </h3>

          {isEditing ? (
            <input
              className="mt-3 w-full p-3 border-b-2 border-beige"
              value={editData.habitat}
              onChange={(e) =>
                setEditData({ ...editData, habitat: e.target.value })
              }
            />
          ) : (
            <p className="mt-2 text-beige text-lg">{animal.habitat}</p>
          )}
        </div>

        {/* DESKRIPSI */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige">
          <h3 className="font-bold text-2xl flex items-center gap-2">
            <BookOpen size={24} /> Deskripsi
          </h3>

          {isEditing ? (
            <textarea
              className="mt-3 w-full p-4 border-4 border-beige rounded-xl"
              rows={8}
              value={editData.deskripsi_lengkap}
              onChange={(e) =>
                setEditData({ ...editData, deskripsi_lengkap: e.target.value })
              }
            />
          ) : (
            <p className="mt-2 text-lg text-beige whitespace-pre-line">
              {animal.deskripsi_lengkap}
            </p>
          )}
        </div>

        {/* EDIT TOMBOL (ADMIN) */}
        {isAdmin && !isEditing && (
          <div className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-10 py-4 rounded-full text-xl font-black shadow-xl hover:scale-105"
            >
              <Edit3 className="inline mr-2" /> Edit Hewan
            </button>
          </div>
        )}

        {/* SIMPAN / BATAL */}
        {isEditing && (
          <div className="flex justify-center gap-6 pt-4">
            <button
              onClick={saveEdit}
              disabled={saving}
              className="bg-green-600 text-white px-10 py-4 rounded-full text-xl font-black shadow-xl"
            >
              <Save className="inline mr-2" />{" "}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-red-600 text-white px-10 py-4 rounded-full text-xl font-black shadow-xl"
            >
              <X className="inline mr-2" /> Batal
            </button>
          </div>
        )}
      </div>

      <div className="h-32"></div>
    </div>
  );
}
