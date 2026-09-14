import { BookOpen, Trash2 } from 'lucide-react'
import type { CitaBiblica } from '../types'

interface Props {
  cita: CitaBiblica
  onEliminar?: (id: string) => void
}

function referencia(cita: CitaBiblica) {
  if (cita.versiculo_fin && cita.versiculo_fin !== cita.versiculo_inicio) {
    return `${cita.libro} ${cita.capitulo}:${cita.versiculo_inicio}-${cita.versiculo_fin}`
  }
  return `${cita.libro} ${cita.capitulo}:${cita.versiculo_inicio}`
}

export default function CitaBiblicaCard({ cita, onEliminar }: Props) {
  return (
    <div className="cita-card">
      <div className="cita-card-top">
        <div className="cita-referencia">
          <BookOpen size={16} />
          <span>
            <strong>{referencia(cita)}</strong>
          </span>
        </div>
        {onEliminar && (
          <button
            className="icon-btn danger"
            onClick={() => onEliminar(cita.id)}
            title="Eliminar cita"
            aria-label="Eliminar cita"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <p className="cita-verse">«{cita.texto}»</p>
      {cita.explicacion && (
        <div className="cita-explicacion">
          <strong>Apunte:</strong>
          <p>{cita.explicacion}</p>
        </div>
      )}
    </div>
  )
}