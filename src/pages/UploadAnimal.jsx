// src/pages/UploadAnimal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAnimal } from "../services/api";
import Auth from "../lib/Auth";
import { ArrowLeft, Upload, Loader2, Camera, Globe, BookOpen, FileText, AlertTriangle, AlertCircle } from "lucide-react";

const IUCN = [
  { value: "LC", label: "Least Concern" },
  { value: "NT", label: "Near Threatened" },
  { value: "VU", label: "Vulnerable" },
  { value: "EN", label: "Endangered" },
  { value: "CR", label: "Critically Endangered" },
  { value: "EW", label: "Extinct in the Wild" },
  { value: "EX", label: "Extinct" },
];

export default function UploadAnimal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image_url: "",
    origin: "",
    short_description: "",
    long_description: "",
    condition: "LC",
  });

  if (!Auth.isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <AlertCircle size={60} className="mx-auto text-red-600 mb-5" />
          <h1 className="text-3xl font-bold mb-3">Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">Hanya admin yang dapat mengunggah hewan.</p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-3 bg-dark-red text-white rounded-xl">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.image_url || !form.long_description) {
      alert("Nama, gambar, dan deskripsi lengkap wajib!");
      return;
    }

    setLoading(true);
    try {
      await createAnimal(form);
      alert("Hewan berhasil ditambahkan!");
      navigate("/animals");
    } catch (err) {
      alert("Gagal upload: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate("/animals")} className="flex items-center gap-2 mb-6">
        <ArrowLeft /> Kembali
      </button>

      <h1 className="text-4xl font-bold mb-5 text-center">Upload Hewan Baru</h1>

      <form onSubmit={submit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl">
        {/* Nama */}
        <div>
          <label className="font-bold flex items-center gap-2"><Camera /> Nama Hewan *</label>
          <input
            className="w-full border p-3 rounded-xl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        {/* Gambar */}
        <div>
          <label className="font-bold flex items-center gap-2"><Globe /> URL Gambar *</label>
          <input
            className="w-full border p-3 rounded-xl"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            required
          />
        </div>

        {/* Habitat */}
        <div>
          <label className="font-bold flex items-center gap-2"><Globe /> Habitat</label>
          <input
            className="w-full border p-3 rounded-xl"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
          />
        </div>

        {/* Status */}
        <div>
          <label className="font-bold flex items-center gap-2"><AlertTriangle /> Status Konservasi *</label>
          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="w-full border p-3 rounded-xl"
          >
            {IUCN.map((st) => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* Deskripsi Singkat */}
        <div>
          <label className="font-bold flex items-center gap-2"><FileText /> Deskripsi Singkat</label>
          <textarea
            className="w-full border p-3 rounded-xl"
            rows="4"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
        </div>

        {/* Deskripsi Lengkap */}
        <div>
          <label className="font-bold flex items-center gap-2"><BookOpen /> Deskripsi Lengkap *</label>
          <textarea
            className="w-full border p-3 rounded-xl"
            rows="6"
            required
            value={form.long_description}
            onChange={(e) => setForm({ ...form, long_description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Upload />}
          {loading ? "Mengunggah..." : "Upload Hewan"}
        </button>
      </form>
    </div>
  );
}
