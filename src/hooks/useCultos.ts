import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { CitaBiblica, Culto, CultoConCitas } from '../types'

export function useCultos() {
  const [cultos, setCultos] = useState<Culto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarCultos = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('cultos')
      .select('*')
      .order('fecha', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setCultos(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void cargarCultos()
  }, [cargarCultos])

  return { cultos, loading, error, recargar: cargarCultos }
}

export function useCultoDetalle(id: string | undefined) {
  const [culto, setCulto] = useState<CultoConCitas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarCulto = useCallback(async () => {
    if (!id || !isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    const { data: cultoData, error: cultoError } = await supabase
      .from('cultos')
      .select('*')
      .eq('id', id)
      .single()

    if (cultoError) {
      setError(cultoError.message)
      setLoading(false)
      return
    }

    const { data: citasData, error: citasError } = await supabase
      .from('citas_biblicas')
      .select('*')
      .eq('culto_id', id)
      .order('created_at', { ascending: true })

    if (citasError) {
      setError(citasError.message)
      setLoading(false)
      return
    }

    setCulto({ ...cultoData, citas: citasData ?? [] })
    setLoading(false)
  }, [id])

  useEffect(() => {
    void cargarCulto()
  }, [cargarCulto])

  return { culto, loading, error, recargar: cargarCulto }
}

export async function crearCulto(data: {
  titulo: string
  fecha: string
  predicador?: string
  lugar?: string
  descripcion?: string
}) {
  const { data: culto, error } = await supabase
    .from('cultos')
    .insert([
      {
        titulo: data.titulo,
        fecha: data.fecha,
        predicador: data.predicador || null,
        lugar: data.lugar || null,
        descripcion: data.descripcion || null,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return culto as Culto
}

export async function agregarCita(data: {
  culto_id: string
  libro: string
  capitulo: number
  versiculo_inicio: number
  versiculo_fin?: number | null
  texto?: string
  explicacion?: string
}) {
  const { data: cita, error } = await supabase
    .from('citas_biblicas')
    .insert([
      {
        culto_id: data.culto_id,
        libro: data.libro,
        capitulo: data.capitulo,
        versiculo_inicio: data.versiculo_inicio,
        versiculo_fin: data.versiculo_fin ?? null,
        texto: data.texto || null,
        explicacion: data.explicacion || null,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return cita as CitaBiblica
}

export async function eliminarCulto(id: string) {
  const { error } = await supabase.from('cultos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function eliminarCita(id: string) {
  const { error } = await supabase.from('citas_biblicas').delete().eq('id', id)
  if (error) throw new Error(error.message)
}