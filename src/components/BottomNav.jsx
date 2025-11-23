import { NavLink } from 'react-router-dom'
import { Home, Cat, BookOpen, Heart, User } from 'lucide-react'

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-red text-cream border-t-4 border-mid-red z-50">
      <div className="flex justify-around py-3">
        <NavLink to="/dashboard" className={({isActive}) => `p-2 ${isActive ? 'text-cream' : 'text-light-beige'}`}>
          <Home size={28} />
        </NavLink>
        <NavLink to="/animals" className={({isActive}) => `p-2 ${isActive ? 'text-cream' : 'text-light-beige'}`}>
          <Cat size={28} />
        </NavLink>
        <NavLink to="/education" className={({isActive}) => `p-2 ${isActive ? 'text-cream' : 'text-light-beige'}`}>
          <BookOpen size={28} />
        </NavLink>
        <NavLink to="/favorites" className={({isActive}) => `p-2 ${isActive ? 'text-cream' : 'text-light-beige'}`}>
          <Heart size={28} />
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `p-2 ${isActive ? 'text-cream' : 'text-light-beige'}`}>
          <User size={28} />
        </NavLink>
      </div>
    </div>
  )
}
