import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  Church,
  Loader2,
  MessageSquareQuote,
  Pencil,
  Trash2,
  User,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CitaBiblicaCard from '../components/CitaBiblicaCard'
import CitaBiblicaForm from '../components/CitaBiblicaForm'
import { eliminarCita, eliminarCulto, useCultoDetalle } from '../hooks/useCultos'
import type { CitaBiblica } from '../types'

export default function CultoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { culto, loading, error, recargar } = useCultoDetalle(id)
  const [confirmando, setConfirmando] = useState(false)
  const [editandoCita, setEditandoCita] = useState<CitaBiblica | null>(null)

  async function handleEliminarCita(citaId: string) {
    try {
      await eliminarCita(citaId)
      await recargar()
    } catch {
      // ignore
    }
  }

  async function handleEliminarCulto() {
    if (!id) return
    if (!confirmando) {
      setConfirmando(true)
      return
    }
    try {
      await eliminarCulto(id)
      navigate('/')
    } catch {
      setConfirmando(false)
    }
  }

  if (loading) {
    return (
      <div className="state">
        <Loader2 className="spin" size={28} />
        <span>Cargando culto...</span>
      </div>
    )
  }

  if (error || !culto) {
    return (
      <div className="state">
        <h3>No se pudo cargar el culto</h3>
        <p>{error ?? 'El culto no existe.'}</p>
        <Link to="/" className="btn btn-outline">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Volver a cultos
      </Link>

      <div className="detail-header">
        {culto.fecha && (
          <div className="detail-fecha">
            {format(new Date(culto.fecha), "EEEE d 'de' MMMM 'de' yyyy", {
              locale: es,
            })}
          </div>
        )}
        <div className="detail-titulo-row">
          <h1>{culto.titulo}</h1>
          <Link to={`/culto/${culto.id}/editar`} className="btn btn-outline sm">
            <Pencil size={15} />
            Editar
          </Link>
        </div>
        <div className="detail-meta">
          {culto.predicador && (
            <span className="chip">
              <User size={14} />
              {culto.predicador}
            </span>
          )}
          {culto.lugar && (
            <span className="chip">
              <Church size={14} />
              {culto.lugar}
            </span>
          )}
        </div>
        {culto.descripcion && (
          <p className="detail-descripcion">{culto.descripcion}</p>
        )}
      </div>

      <div className="detail-citas">
        <div className="section-title">
          <MessageSquareQuote size={18} />
          <h2>Citas bíblicas y apuntes</h2>
          <span className="count">{culto.citas.length}</span>
        </div>

        {culto.citas.length === 0 ? (
          <div className="state small">
            <MessageSquareQuote size={24} />
            <p>Aún no hay citas en este culto.</p>
          </div>
        ) : (
          <div className="lista-citas">
            {culto.citas.map((cita) => (
              <CitaBiblicaCard
                key={cita.id}
                cita={cita}
                onEditar={() => setEditandoCita(cita)}
                onEliminar={handleEliminarCita}
              />
            ))}
          </div>
        )}

        {editandoCita ? (
          <CitaBiblicaForm
            cultoId={culto.id}
            cita={editandoCita}
            onGuardada={async () => {
              setEditandoCita(null)
              await recargar()
            }}
            onCancelar={() => setEditandoCita(null)}
          />
        ) : (
          <CitaBiblicaForm
            cultoId={culto.id}
            onGuardada={recargar}
          />
        )}
      </div>

      <div className="danger-zone">
        <button
          className="btn btn-danger"
          onClick={handleEliminarCulto}
          disabled={confirmando}
        >
          <Trash2 size={16} />
          {confirmando ? '¿Confirmar eliminación?' : 'Eliminar culto'}
        </button>
      </div>
    </div>
  )
}