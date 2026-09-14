import type { FormEvent } from 'react'
import { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { agregarCita } from '../hooks/useCultos'
import type { CitaBiblica } from '../types'

interface Props {
  cultoId: string
  onCitaAgregada: (cita: CitaBiblica) => void
}

export default function CitaBiblicaForm({ cultoId, onCitaAgregada }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [libro, setLibro] = useState('')
  const [capitulo, setCapitulo] = useState('')
  const [versiculoInicio, setVersiculoInicio] = useState('')
  const [versiculoFin, setVersiculoFin] = useState('')
  const [texto, setTexto] = useState('')
  const [explicacion, setExplicacion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!libro || !capitulo || !versiculoInicio) {
      setError('Completa al menos libro, capítulo y versículo de inicio.')
      return
    }

    setGuardando(true)
    try {
      const cita = await agregarCita({
        culto_id: cultoId,
        libro: libro.trim(),
        capitulo: Number(capitulo),
        versiculo_inicio: Number(versiculoInicio),
        versiculo_fin: versiculoFin ? Number(versiculoFin) : null,
        texto: texto.trim() || undefined,
        explicacion: explicacion.trim() || undefined,
      })
      onCitaAgregada(cita)
      setLibro('')
      setCapitulo('')
      setVersiculoInicio('')
      setVersiculoFin('')
      setTexto('')
      setExplicacion('')
      setAbierto(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la cita.')
    } finally {
      setGuardando(false)
    }
  }

  if (!abierto) {
    return (
      <button
        className="btn btn-outline btn-block"
        onClick={() => setAbierto(true)}
      >
        <Plus size={16} />
        Agregar cita bíblica
      </button>
    )
  }

  return (
    <form className="cita-form" onSubmit={handleSubmit}>
      <div className="cita-form-header">
        <BookOpen size={18} />
        <span>Nueva cita bíblica</span>
      </div>

      <div className="grid-3">
        <label className="field">
          <span>Libro</span>
          <input
            value={libro}
            onChange={(e) => setLibro(e.target.value)}
            placeholder="Juan"
            list="listaLibros"
          />
        </label>
        <datalist id="listaLibros">
          <option value="Génesis" />
          <option value="Éxodo" />
          <option value="Salmos" />
          <option value="Proverbios" />
          <option value="Isaías" />
          <option value="Mateo" />
          <option value="Marcos" />
          <option value="Lucas" />
          <option value="Juan" />
          <option value="Hechos" />
          <option value="Romanos" />
          <option value="1 Corintios" />
          <option value="2 Corintios" />
          <option value="Gálatas" />
          <option value="Efesios" />
          <option value="Filipenses" />
          <option value="Colosenses" />
          <option value="Hebreos" />
          <option value="Apocalipsis" />
        </datalist>
        <label className="field">
          <span>Capítulo</span>
          <input
            type="number"
            min={1}
            value={capitulo}
            onChange={(e) => setCapitulo(e.target.value)}
            placeholder="3"
          />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Versículo inicio</span>
            <input
              type="number"
              min={1}
              value={versiculoInicio}
              onChange={(e) => setVersiculoInicio(e.target.value)}
              placeholder="16"
            />
          </label>
          <label className="field">
            <span>Versículo fin</span>
            <input
              type="number"
              min={1}
              value={versiculoFin}
              onChange={(e) => setVersiculoFin(e.target.value)}
              placeholder="21 (opcional)"
            />
          </label>
        </div>
      </div>

      <label className="field">
        <span>Texto del pasaje (opcional)</span>
        <textarea
          rows={3}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="«Porque de tal manera amó Dios al mundo...»"
        />
      </label>

      <label className="field">
        <span>Explicación / apunte (opcional)</span>
        <textarea
          rows={4}
          value={explicacion}
          onChange={(e) => setExplicacion(e.target.value)}
          placeholder="¿Qué se predicó sobre este pasaje?"
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cita'}
        </button>
      </div>
    </form>
  )
}