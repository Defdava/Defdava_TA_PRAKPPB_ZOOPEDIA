// src/pages/Education.jsx
export default function Education() {
  return (
    <div className="min-h-screen pt-10 px-6 pb-24">
      <h1 className="text-3xl font-bold text-dark-red mb-6 text-center">Edukasi di Taman Safari</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-dark-red">1. Jaga Kebersihan</h2>
          <p>Buang sampah pada tempatnya agar hewan tetap sehat.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-dark-red">2. Jangan Beri Makan Sembarangan</h2>
          <p>Setiap hewan memiliki diet khusus dari pawang.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-dark-red">3. Jaga Jarak Aman</h2>
          <p>Demi keselamatan kamu dan hewan.</p>
        </div>
      </div>
    </div>
  )
}