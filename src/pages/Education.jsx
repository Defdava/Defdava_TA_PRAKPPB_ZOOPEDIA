// src/pages/Education.jsx
import { useState, useEffect, useRef } from 'react'
import Chart from 'react-apexcharts'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { 
  Leaf, Heart, Shield, Globe, Users, School, PawPrint, AlertTriangle, 
  MessageCircle, X, Send, Bot 
} from 'lucide-react'

// Import API dari services
import { getAllAnimals } from '../services/api'

export default function Education() {
  const [concernLevel, setConcernLevel] = useState(50)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Halo! Saya SafariBot, asisten edukasi & konservasi satwa liar Taman Safari Indonesia.\n\nTanya apa saja ya! Saya bisa jawab tentang:\n• Hewan langka\n• Program pelestarian\n• Cara ikut membantu\n• Fakta menarik\n• Dan banyak lagi!'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load semua hewan dari API
  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const data = await getAllAnimals()
        setAnimals(data)
      } catch (err) {
        console.error('Gagal memuat data hewan:', err)
      }
    }
    loadAnimals()
  }, [])

  // Data Chart IUCN
  const chartData = {
    series: [22, 16, 15, 14, 10, 7, 7, 9],
    options: {
      chart: { type: 'donut', fontFamily: 'Inter, system-ui, sans-serif' },
      colors: ['#dc2626', '#ea580c', '#ca8a04', '#0891b2', '#16a34a', '#7c2d12', '#7c3aed', '#6b7280'],
      labels: ['Ikan (22%)', 'Amfibi (16%)', 'Serangga (15%)', 'Mollusca (14%)', 'Reptil (10%)', 'Mamalia (7%)', 'Burung (7%)', 'Lainnya (9%)'],
      legend: { position: 'bottom', fontSize: '14px', labels: { colors: '#374151' } },
      dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%`, style: { fontSize: '14px', fontWeight: 'bold', colors: ['#fff'] } },
      tooltip: { y: { formatter: (val) => `${val}% dari spesies terancam punah` } },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              value: { show: true, fontSize: '28px', fontWeight: 'bold', color: '#dc2626' },
              total: { show: true, showAlways: true, label: 'Total Terancam', color: '#1f2937', fontSize: '16px' }
            }
          }
        }
      },
      responsive: [{ breakpoint: 480, options: { chart: { width: 300 }, legend: { position: 'bottom' } } }]
    }
  }

  const getMessage = () => {
    if (concernLevel <= 20) return "Ayo mulai peduli yuk! Satwa Indonesia butuh kamu"
    if (concernLevel <= 40) return "Lumayan, tapi bisa lebih peduli lagi nih!"
    if (concernLevel <= 60) return "Keren! Kamu sudah cukup peduli"
    if (concernLevel <= 80) return "Wow! Kamu pecinta satwa sejati!"
    return "LUAR BIASA! Kamu pahlawan konservasi Indonesia!"
  }

  const getEmoji = () => {
    if (concernLevel <= 20) return "Crying Face"
    if (concernLevel <= 40) return "Pensive Face"
    if (concernLevel <= 60) return "Smiling Face with Heart-Eyes"
    if (concernLevel <= 80) return "Smiling Face with Hearts"
    return "Glowing Star"
  }

  // === CHATBOT SUPER PINTAR – BISA JAWAB APA SAJA ===
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userText = inputValue.trim()
    const lower = userText.toLowerCase()

    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInputValue('')
    setLoading(true)

    // Tampilkan typing indicator
    setTimeout(() => setMessages(prev => [...prev, { sender: 'bot', text: '...' }]), 400)

    let reply = ''

    // 1. Salam & sapaan
    if (/halo|hai|hi|helo|hey|pagi|siang|malam|selamat|ass?alam|apa kabar/.test(lower)) {
      reply = 'Halo juga! Senang banget kamu mampir. Mau ngobrol tentang satwa liar atau konservasi hari ini?'
    }

    // 2. Terima kasih
    else if (/terima kasih|makasih|thanks|thank you|matur|suwun/.test(lower)) {
      reply = 'Sama-sama! Senang bisa membantu. Yuk terus dukung pelestarian satwa Indonesia!'
    }

    // 3. Adopsi satwa
    else if (/adopsi|adopt|donasi|sumbang|bantu|program adopsi/.test(lower)) {
      reply = 'Kamu bisa ikut **Program Adopsi Satwa** di Taman Safari!\n\nMulai dari Rp250.000/bulan, kamu bantu biaya pakan, perawatan, dan konservasi hewan favoritmu.\n\nSetiap adopsi = dukungan nyata untuk satwa langka Indonesia!'
    }

    // 4. Tiket & kunjungan
    else if (/tiket|harga|jam buka|beli tiket|kunjung|datang|libur/.test(lower)) {
      reply = 'Mau ke Taman Safari?\n\nKamu bisa beli tiket online di website resmi atau langsung di lokasi.\n\nSetiap kunjunganmu = dukungan langsung untuk program konservasi satwa liar!'
    }

    // 5. Ancaman kepunahan
    else if (/kepunahan|punah|ancaman|penyebab|bahaya|perubahan iklim|polusi|hutan|deforestasi|perburuan/.test(lower)) {
      reply = 'Saat ini lebih dari 1 juta spesies terancam punah di dunia.\n\nDi Indonesia, ancaman utama:\n• Perburuan & perdagangan ilegal\n• Penggundulan hutan (sawit, tambang)\n• Perubahan iklim\n• Polusi plastik di laut\n\nTapi ada harapan! Dengan aksi kecil seperti tidak buang sampah sembarangan, dukung produk ramah lingkungan, dan sebarkan kesadaran — kita bisa menyelamatkan satwa Indonesia!'
    }

    // 6. Program Taman Safari
    else if (/program|breeding|rescue|rehabilitasi|penangkaran|riset|edukasi|animal show/.test(lower)) {
      reply = 'Taman Safari punya banyak program keren:\n\n• Breeding hewan langka (Harimau Sumatra, Badak Jawa, dll)\n• Rescue & rehabilitasi hewan sitaan\n• Riset kesehatan & perilaku satwa\n• Edukasi lewat Safari Goes to School\n• Animal Show edukatif\n• Program Adopsi Satwa untuk publik\n\nSemua hasil tiket masuk digunakan untuk program ini!'
    }

    // 7. Cara membantu
    else if (/bantu|tolong|dukung|cara membantu|apa yang bisa dilakukan|kontribusi/.test(lower)) {
      reply = 'Kamu bisa bantu satwa liar dengan cara sederhana:\n\n• Tidak beli produk dari satwa liar\n• Dukung produk ramah lingkungan (RSPO, dll)\n• Ikut adopsi satwa\n• Tidak buang sampah sembarangan\n• Sebarkan info konservasi\n• Kunjungi Taman Safari (tiket = donasi!)\n\nSetiap aksi kecilmu sangat berarti!'
    }

    // 8. Cari nama hewan di database
    else {
      const matched = animals.find(animal => 
        animal.nama.toLowerCase().includes(lower) || 
        lower.includes(animal.nama.toLowerCase().replace(/\s+/g, ''))
      )

      if (matched) {
        reply = `**${matched.nama}**\n\n${matched.deskripsi_singkat}\n\n**Status Konservasi:** ${matched.condition}\n**Asal/Habitat:** ${matched.habitat}\n\n${matched.deskripsi_lengkap ? matched.deskripsi_lengkap + '\n\n' : ''}Mau tahu lebih dalam? Tanya lagi ya!`
      } 
      // Jawaban ramah jika tidak ketemu
      else {
        reply = `Wah, pertanyaan menarik!\n\nSaya belum punya info spesifik tentang "${userText}", tapi tetap senang diajak ngobrol!\n\nCoba tanya hal lain ya, misalnya:\n• "Kenapa harimau Sumatra terancam punah?"\n• "Bagaimana cara adopsi satwa?"\n• "Apa yang bisa aku lakukan untuk membantu?"\n\nAku siap jawab semua!`
      }
    }

    // Kirim jawaban
    setTimeout(() => {
      setMessages(prev => prev.slice(0, -1)) // hapus "..."
      setMessages(prev => [...prev, { sender: 'bot', text: reply }])
      setLoading(false)
    }, 900)
  }

  return (
    <div className="min-h-screen pt-10 px-6 pb-32 bg-cream relative">

      {/* Tombol Chatbot – fixed kanan atas */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full px-6 py-4 shadow-2xl hover:scale-105 transition-all flex items-center gap-3 font-bold text-lg"
      >
        <MessageCircle size={32} />
        Tanya SafariBot
      </button>

      <h1 className="text-4xl font-black text-dark-red text-center mb-10">
        Edukasi & Konservasi Satwa Liar
      </h1>

      {/* 1. Apa Itu Taman Safari? */}
      <section className="mb-16">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-200">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
            <img 
              src="https://oidlzdozlailawmngruv.supabase.co/storage/v1/object/public/animal-images/Taman%20safari%202.jpg" 
              alt="Pemandangan Taman Safari" 
              className="w-full md:w-96 h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
            <div>
              <div className="flex items-center gap-4 mb-4">
                <PawPrint size={48} className="text-dark-red" />
                <h2 className="text-3xl font-bold text-dark-red">Apa Itu Taman Safari?</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Taman Safari adalah <strong>taman konservasi satwa liar</strong> yang memungkinkan pengunjung melihat hewan dari berbagai negara secara lebih alami. 
                Pengunjung dapat berkeliling dengan kendaraan sambil mengamati hewan yang hidup di habitat mirip aslinya.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                {['Konservasi & Pelestarian', 'Pendidikan Lingkungan', 'Penelitian Satwa', 'Rekreasi Edukatif'].map((item) => (
                  <div key={item} className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-4">
                    <p className="font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pentingnya Pelestarian Hewan */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-dark-red text-center mb-8 flex items-center justify-center gap-3">
          <AlertTriangle className="text-red-600" size={40} />
          Mengapa Pelestarian Hewan Sangat Penting?
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 border-4 border-red-200 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-red-800 mb-4">Penyebab Kepunahan</h3>
            <ul className="space-y-3 text-gray-700">
              {['Perburuan & perdagangan ilegal', 'Penggundulan hutan', 'Perubahan iklim', 'Polusi', 'Konflik dengan manusia'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 border-4 border-green-200 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">Manfaat Pelestarian</h3>
            <ul className="space-y-3 text-gray-700">
              {['Rantai makanan tetap seimbang', 'Keanekaragaman hayati terjaga', 'Ekosistem tetap sehat', 'Satwa endemik tidak punah'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Leaf className="text-green-600" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Program Pelestarian */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-dark-red text-center mb-10">
          Program Pelestarian di Taman Safari Indonesia
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: "Breeding (Penangkaran)", examples: "Harimau Sumatra • Badak Jawa • Orangutan • Gajah Asia • Jalak Bali" },
            { icon: Shield, title: "Rescue & Rehabilitasi", desc: "Menyelamatkan hewan sitaan, terluka, atau korban perdagangan ilegal" },
            { icon: Globe, title: "Riset & Studi Satwa", desc: "Pengamatan perilaku, kesehatan, nutrisi, dan reproduksi" },
            { icon: Users, title: "Kampanye Edukasi", examples: "Safari Goes to School • Demo satwa • Program adopsi satwa" }
          ].map((prog, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl p-6 border-4 border-beige hover:border-dark-red transition-all hover:scale-105">
              <prog.icon size={48} className="text-dark-red mb-4" />
              <h3 className="text-xl font-bold text-dark-red mb-3">{prog.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {prog.desc || prog.examples}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Kegiatan Edukasi */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-dark-red text-center mb-10">
          Belajar Bersama di Taman Safari
        </h2>
        <div className="space-y-6">
          {[
            { title: "Safari Journey", desc: "Melihat hewan liar secara langsung dari mobil" },
            { title: "Animal Show Edukatif", desc: "Pertunjukan yang menjelaskan ancaman & cara pelestarian" },
            { title: "Keeper Talk", desc: "Ngobrol langsung dengan pawang tentang perawatan satwa" },
            { title: "Pusat Edukasi Konservasi", desc: "Belajar tentang hewan endemik & upaya penghijauan" }
          ].map((act) => (
            <div key={act.title} className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-6 border-4 border-orange-300 flex items-center gap-6">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <School size={40} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-red">{act.title}</h3>
                <p className="text-gray-700">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Cara Ikut Membantu */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-dark-red text-center mb-10">
          Kamu Juga Bisa Ikut Menyelamatkan Satwa!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            "Tidak buang sampah sembarangan",
            "Tidak beri makan hewan",
            "Dukung adopsi satwa",
            "Beli produk ramah lingkungan",
            "Hindari produk satwa liar",
            "Sebarkan cinta satwa"
          ].map((tip, i) => (
            <div key={i} className="bg-green-50 border-4 border-green-300 rounded-2xl p-4 text-center hover:bg-green-100 transition-all">
              <Leaf size={32} className="mx-auto text-green-600 mb-2" />
              <p className="text-sm font-bold text-green-800">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Aktivitas untuk Anak & Sekolah */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-dark-red text-center mb-10">
          Aktivitas Seru untuk Anak & Sekolah
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Safari Scavenger Hunt",
            "Mewarnai Satwa Dilindungi",
            "Mini Conservator (simulasi pawang)",
            "Buat Poster Pelestarian",
            "Cerita Rakyat Hewan Indonesia",
            "Adopsi Satwa Virtual"
          ].map((idea) => (
            <div key={idea} className="bg-purple-50 border-4 border-purple-300 rounded-3xl p-6 text-center hover:shadow-2xl transition-all">
              <div className="bg-purple-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <PawPrint size={40} className="text-purple-700" />
              </div>
              <p className="text-lg font-bold text-purple-800">{idea}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grafik Krisis Kepunahan */}
      <section className="mb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-200">
          <h2 className="text-3xl font-bold text-dark-red text-center mb-4">
            Krisis Kepunahan Spesies Global 2025
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Data preliminary IUCN Red List 2025
          </p>
          <div className="max-w-4xl mx-auto">
            <Chart options={chartData.options} series={chartData.series} type="donut" height={450} />
          </div>
          <div className="mt-8 bg-red-50 rounded-2xl p-6 text-center border-4 border-red-300">
            <p className="text-xl font-bold text-red-800">
              Ikan (22%) paling terancam, diikuti amfibi & serangga
            </p>
            <p className="text-red-700 mt-3">
              Penyebab utama: penangkapan berlebih, polusi, deforestasi, dan perubahan iklim
            </p>
          </div>
        </div>
      </section>

      {/* Penutup Inspiratif */}
      <div className="bg-gradient-to-r from-dark-red via-red-600 to-orange-600 text-white rounded-3xl p-12 text-center shadow-2xl mb-20">
        <h2 className="text-4xl font-black mb-6">Setiap Kunjungan = Satu Harapan Baru</h2>
        <p className="text-2xl opacity-95 leading-relaxed max-w-4xl mx-auto">
          Dengan berkunjung ke Taman Safari, kamu tidak hanya bersenang-senang — 
          <strong> kamu turut menyelamatkan satwa liar Indonesia.</strong><br /><br />
          Setiap tiket yang kamu beli, setiap foto yang kamu ambil, setiap cerita yang kamu bagikan — 
          semua itu mendukung konservasi, pendidikan, dan masa depan satwa kita.
        </p>
        <div className="mt-8 flex justify-center gap-6 text-5xl">
          <Heart className="animate-pulse fill-cream text-cream" size={64} />
          <Leaf className="animate-bounce" size={64} />
          <PawPrint className="animate-pulse" size={64} />
        </div>
        <p className="mt-8 text-3xl font-bold">Terima kasih telah menjadi bagian dari perubahan!</p>
      </div>

      {/* Slider Kepedulian */}
      <section className="mt-20 mb-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl shadow-2xl p-10 text-white text-center overflow-hidden">
          <h2 className="text-4xl font-black mb-10 drop-shadow-lg">
            Apakah Anda Sudah Peduli dengan Pelestarian Hewan di Indonesia?
          </h2>
          <div className="px-12 mb-8">
            <Slider
              min={0}
              max={100}
              value={concernLevel}
              onChange={setConcernLevel}
              railStyle={{ backgroundColor: 'rgba(255,255,255,0.4)', height: 16, borderRadius: 8 }}
              trackStyle={{ backgroundColor: '#ffffff', height: 16, borderRadius: 8 }}
              handleStyle={{
                height: 68,
                width: 68,
                marginTop: -26,
                backgroundColor: '#ffffff',
                border: '6px solid #10b981',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                opacity: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '38px'
              }}
            />
          </div>
          <div className="flex justify-between text-sm font-bold mb-6">
            <span>Tidak Peduli</span>
            <span className="text-yellow-300">Netral</span>
            <span>Sangat Peduli!</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-4 border-white/30">
            <p className="text-2xl font-bold">{getMessage()}</p>
            <p className="text-7xl mt-4">{getEmoji()}</p>
          </div>
          <p className="mt-8 text-lg opacity-90">
            Geser slider di atas dan lihat seberapa besar cinta kamu terhadap satwa liar Indonesia!
          </p>
        </div>
      </section>

      {/* === CHAT WINDOW – BISA JAWAB APA SAJA === */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center pb-8 px-4" onClick={() => setIsChatOpen(false)}>
          <div className="bg-white rounded-3xl shadow-3xl w-full max-w-lg h-[620px] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot size={36} />
                <div>
                  <h3 className="font-bold text-xl">SafariBot</h3>
                  <p className="text-sm opacity-90">Siap Jawab Apa Saja!</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 rounded-full p-2 transition">
                <X size={28} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-5 py-3 rounded-2xl shadow-md whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-emerald-500 text-white' : 'bg-white border text-gray-800'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-5 py-3 rounded-2xl text-gray-600">...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !loading && handleSendMessage()}
                  placeholder="Tanya apa saja..."
                  className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={loading || !inputValue.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-full p-4 shadow-lg transition-all"
                >
                  <Send size={24} />
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Saya bisa jawab pertanyaan apa saja seputar satwa & konservasi!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-32"></div>
    </div>
  )
}
