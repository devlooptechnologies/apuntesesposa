export interface Culto {
  id: string
  titulo: string
  fecha: string | null
  predicador?: string | null
  lugar?: string | null
  descripcion?: string | null
  created_at: string
}

export interface CitaBiblica {
  id: string
  culto_id: string
  libro: string
  capitulo: number
  versiculo_inicio: number
  versiculo_fin: number | null
  texto?: string | null
  explicacion?: string | null
  created_at: string
}

export interface CultoConCitas extends Culto {
  citas: CitaBiblica[]
}