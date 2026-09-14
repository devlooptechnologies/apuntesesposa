import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Loader2, Save } from 'lucide-react'
import { crearCulto } from '../hooks/useCultos'
import { isSupabaseConfigured } from '../lib/supabase'

export default function CrearCulto() {
  const navigate = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [predicador, setPredicador] = useState('')
  const [lugar, setLugar] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!titulo.trim()) {
      setError('El título es obligatorio.')
      return
    }
    setGuardando(true)
    try {
      const culto = await crearCulto({
        titulo: titulo.trim(),
        fecha,
        predicador: predicador.trim(),
        lugar: lugar.trim(),
        descripcion: descripcion.trim(),
      })
      navigate(`/culto/${culto.id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="page page-narrow">
      <h1>Nuevo culto</h1>

      {!isSupabaseConfigured && (
        <div className="banner warn">
          <strong>Supabase no está configurado.</strong>
          <span> Revisa el archivo .env (ver README).</span>
        </div>
      )}

      <form className="cita-form" onSubmit={handleSubmit}>
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

        {error && <p className="error-text">{error}</p>}

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
                Guardar culto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}