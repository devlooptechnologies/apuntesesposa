import { useState } from 'react'
import { ArrowRight, BookOpen, Loader2, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import CultoCard from '../components/CultoCard'
import { useCultos } from '../hooks/useCultos'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Home() {
  const { cultos, loading } = useCultos()
  const [busqueda, setBusqueda] = useState('')

  const filtrados = cultos.filter((c) => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return true
    return (
      c.titulo.toLowerCase().includes(q) ||
      (c.predicador?.toLowerCase().includes(q) ?? false) ||
      (c.lugar?.toLowerCase().includes(q) ?? false)
    )
  })

  return (
    <div className="page">
      <div className="page-hero">
        <h1>Mis Apuntes de Cultos</h1>
        <p>
          Guarda cada culto, sus citas bíblicas y los apuntes de la
          predicación en un solo lugar.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="banner warn">
          <strong>Supabase no está configurado.</strong>
          <span>
            {' '}
            Crea un archivo <code>.env</code> con{' '}
            <code>VITE_SUPABASE_URL</code> y{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> (ver README).
          </span>
        </div>
      )}

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, predicador o lugar..."
          />
        </div>
        <Link to="/nuevo" className="btn btn-primary">
          Nuevo culto
          <ArrowRight size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="state">
          <Loader2 className="spin" size={28} />
          <span>Cargando cultos...</span>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="state">
          <BookOpen size={32} />
          <h3>
            {busqueda ? 'Sin resultados' : 'Todavía no hay cultos'}
          </h3>
          <p>
            {busqueda
              ? 'Prueba con otra búsqueda.'
              : 'Crea tu primer culto para empezar a guardar apuntes.'}
          </p>
          {!busqueda && (
            <Link to="/nuevo" className="btn btn-primary">
              Crear culto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid-cultos">
          {filtrados.map((c) => (
            <CultoCard key={c.id} culto={c} />
          ))}
        </div>
      )}
    </div>
  )
}