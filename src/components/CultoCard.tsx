import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Church, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Culto } from '../types'

export default function CultoCard({ culto }: { culto: Culto }) {
  const navigate = useNavigate()

  return (
    <article className="cul-card" onClick={() => navigate(`/culto/${culto.id}`)}>
      {culto.fecha && (
        <div className="cul-card-fecha">
          {format(new Date(culto.fecha), 'd MMM yyyy', { locale: es })}
        </div>
      )}
      <h2 className="cul-card-titulo">{culto.titulo}</h2>
      {culto.predicador && (
        <div className="cul-card-meta">
          <User size={14} />
          <span>{culto.predicador}</span>
        </div>
      )}
      {culto.lugar && (
        <div className="cul-card-meta">
          <Church size={14} />
          <span>{culto.lugar}</span>
        </div>
      )}
      {culto.descripcion && (
        <p className="cul-card-desc">{culto.descripcion}</p>
      )}
      <div className="cul-card-footer">
        <Calendar size={14} />
        <span>Ver apuntes y citas</span>
      </div>
    </article>
  )
}