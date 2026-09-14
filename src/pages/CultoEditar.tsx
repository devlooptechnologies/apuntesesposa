import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Loader2, Save } from 'lucide-react'
import {
  actualizarCulto,
  useCultoDetalle,
} from '../hooks/useCultos'

export default function CultoEditar() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { culto, loading, error } = useCultoDetalle(id)

  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [predicador, setPredicador] = useState('')
  const [lugar, setLugar] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)

  useEffect(() => {
    if (culto) {
      setTitulo(culto.titulo)
      setFecha(culto.fecha?.slice(0, 10) ?? '')
      setPredicador(culto.predicador ?? '')
      setLugar(culto.lugar ?? '')
      setDescripcion(culto.descripcion ?? '')
    }
  }, [culto])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    setErrorGuardar(null)
    if (!titulo.trim()) {
      setErrorGuardar('El título es obligatorio.')
      return
    }
    setGuardando(true)
    try {
      await actualizarCulto(id, {
        titulo: titulo.trim(),
        fecha,
        predicador: predicador.trim(),
        lugar: lugar.trim(),
        descripcion: descripcion.trim(),
      })
      navigate(`/culto/${id}`, { replace: true })
    } catch (err) {
      setErrorGuardar(
        err instanceof Error ? err.message : 'Error al guardar los cambios.'
      )
    } finally {
      setGuardando(false)
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
    <div className="page page-narrow">
      <Link to={`/culto/${culto.id}`} className="back-link">
        <ArrowLeft size={16} />
        Volver al culto
      </Link>
      <h1>Editar culto</h1>

      <form
        className="cita-form"
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
      >
        <label className="field">
          <span>Título del culto *</span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Culto de adoración y sanidad"
            autoFocus
          />
        </label>

        <label className="field">
          <span>Fecha (opcional)</span>
          <div className="field-icon">
            <Calendar size={16} />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </label>

        <div className="grid-2">
          <label className="field">
            <span>Predicador (opcional)</span>
            <input
              value={predicador}
              onChange={(e) => setPredicador(e.target.value)}
              placeholder="Pastor Juan Pérez"
            />
          </label>
          <label className="field">
            <span>Lugar (opcional)</span>
            <input
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Iglesia Central"
            />
          </label>
        </div>

        <label className="field">
          <span>Descripción (opcional)</span>
          <textarea
            rows={4}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Tema general, sensación del culto, resumen..."
          />
        </label>

        {errorGuardar && <p className="error-text">{errorGuardar}</p>}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Loader2 className="spin" size={16} />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}