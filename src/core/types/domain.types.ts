import type { Severity } from './api.types'

export interface Place {
  name: string
  tables: number
}

export interface Reporte {
  id: string
  text: string
  severity: Severity
  testigo?: string
  hora?: string
}
