import { Cat } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-10 px-6 pb-32">
      <div className="text-center">
        <Cat size={80} className="mx-auto text-dark-red mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold text-dark-red mb-4">Selamat Datang di Zoopedia!</h1>
        <p className="text-lg text-beige max-w-md mx-auto">
          Jelajahi ratusan hewan dari seluruh dunia, tambahkan favoritmu,
          dan pelajari fakta menarik selama perjalanan di Taman Safari.
        </p>
      </div>
    </div>
  )
}