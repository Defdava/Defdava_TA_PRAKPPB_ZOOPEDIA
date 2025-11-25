// src/pages/Education.jsx
import { useEffect } from 'react'
import Chart from 'react-apexcharts'

export default function Education() {
  // Data Pie Chart IUCN 2025 (Preliminary)
  const chartData = {
    series: [22, 16, 15, 14, 10, 7, 7, 9],
    options: {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      colors: [
        '#dc2626', // Ikan - merah tua
        '#ea580c', // Amfibi - oranye
        '#ca8a04', // Serangga - kuning
        '#0891b2', // Mollusca - biru laut
        '#16a34a', // Reptil - hijau
        '#7c2d12', // Mamalia - coklat
        '#7c3aed', // Burung - ungu
        '#6b7280', // Lainnya - abu
      ],
      labels: [
        'Ikan (22%)',
        'Amfibi (16%)',
        'Serangga (15%)',
        'Mollusca (14%)',
        'Reptil (10%)',
        'Mamalia (7%)',
        'Burung (7%)',
        'Lainnya (9%)'
      ],
      legend: {
        position: 'bottom',
        fontSize: '14px',
        labels: { colors: '#374151' },
        markers: { width: 12, height: 12, radius: 12 },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${Math.round(val)}%`,
        style: { fontSize: '14px', fontWeight: 'bold', colors: ['#fff'] },
        dropShadow: { enabled: true }
      },
      tooltip: {
        y: { formatter: (val) => `${val}% dari spesies terancam punah` }
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: { show: false },
              value: {
                show: true,
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#dc2626',
                formatter: () => '100%'
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total Terancam',
                color: '#1f2937',
                fontSize: '16px',
                fontWeight: 'bold'
              }
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }]
    }
  }

  return (
    <div className="min-h-screen pt-10 px-6 pb-32 bg-cream">
      <h1 className="text-3xl font-bold text-dark-red mb-8 text-center">
        Edukasi & Konservasi Satwa
      </h1>

      {/* Aturan Berkunjung */}
      <div className="space-y-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-dark-red mb-2 flex items-center gap-3">
            1. Jaga Kebersihan Taman Safari
          </h2>
          <p className="text-gray-700">Buang sampah pada tempatnya agar hewan tidak keracunan plastik.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-dark-red mb-2 flex items-center gap-3">
            2. Jangan Beri Makan Sembarangan
          </h2>
          <p className="text-gray-700">Setiap hewan punya diet khusus dari pawang. Makanan manusia bisa membahayakan.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-dark-red mb-2 flex items-center gap-3">
            3. Jaga Jarak Aman
          </h2>
          <p className="text-gray-700">Demi keselamatan pengunjung dan kesejahteraan hewan.</p>
        </div>
      </div>

      {/* Grafik Kepunahan 2025 */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-red-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-dark-red mb-3">
            Krisis Kepunahan Spesies 2025
          </h2>
          <p className="text-gray-600 text-sm">
            Proporsi spesies hewan yang terancam punah menurut IUCN Red List (data preliminary 2025)
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            height={420}
          />
        </div>

        <div className="mt-8 bg-red-50 rounded-2xl p-6 border border-red-200">
          <p className="text-red-800 font-bold text-center text-lg">
            Ikan (22%) menjadi kelompok paling terancam — diikuti amfibi dan serangga.
          </p>
          <p className="text-red-700 text-center mt-3 text-sm">
            Aktivitas manusia: penangkapan berlebih, polusi, deforestasi, dan perubahan iklim
            adalah penyebab utama krisis ini.
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 italic">
            Sumber: IUCN Red List of Threatened Species – Preliminary Data 2025
          </p>
        </div>
      </div>

      {/* Pesan Penutup */}
      <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 rounded-3xl text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-4">Kamu Bisa Mengubahnya!</h3>
        <p className="text-lg opacity-95">
          Dengan berkunjung ke Taman Safari, kamu turut mendukung konservasi satwa liar Indonesia.
          Setiap tiket = satu langkah menuju pelestarian.
        </p>
      </div>
    </div>
  )
}