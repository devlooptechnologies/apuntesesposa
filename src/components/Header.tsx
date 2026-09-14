import { BookOpen, FolderOpen, Plus } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <BookOpen size={20} />
        <span className="brand-text">Mis Apuntes</span>
      </Link>
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <FolderOpen size={16} />
          Cultos
        </NavLink>
        <NavLink
          to="/nuevo"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <Plus size={16} />
          Nuevo culto
        </NavLink>
      </nav>
    </header>
  )
}