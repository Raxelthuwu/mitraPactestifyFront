import type { LoginRequest, LoginResponse, Severity } from '../types/api.types'
import type { Place, Reporte } from '../types/domain.types'
import type { Role, User } from '../types/user.types'
import { decodeJwt } from '../auth/jwt'

const ACTIVE_ACCOUNT_KEY = 'ph_mock_active_account'

const places: Place[] = [
  { name: 'ISER', tables: 22 },
  { name: 'Colegio Provincial', tables: 18 },
  { name: 'Escuela Normal', tables: 14 },
]

const reportsByTable = new Map<number, Reporte[]>([
  [
    1,
    [
      { id: 'r-1', text: 'Falta material electoral en la mesa.', severity: 'alto', testigo: 'Ana Torres', hora: '08:42' },
      { id: 'r-2', text: 'La fila avanza con lentitud.', severity: 'medio', testigo: 'Luis Rojas', hora: '09:15' },
    ],
  ],
  [2, [{ id: 'r-3', text: 'La mesa abrió sin novedad.', severity: 'bajo', testigo: 'Marta Díaz', hora: '07:58' }]],
])

function isOccupiedAccount(correo: string) {
  const normalized = correo.toLowerCase()
  return normalized.includes('ocupada') || normalized.includes('ocupado')
}

function base64Url(value: string) {
  return window.btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function createToken(user: User) {
  const header = base64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const payload = base64Url(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 }))
  return `${header}.${payload}.mock`
}

function normalizeEmail(correo: string) {
  return correo.trim().toLowerCase()
}

function getActiveAccount() {
  return window.localStorage.getItem(ACTIVE_ACCOUNT_KEY)
}

function setActiveAccount(correo: string) {
  window.localStorage.setItem(ACTIVE_ACCOUNT_KEY, normalizeEmail(correo))
}

function clearActiveAccount() {
  window.localStorage.removeItem(ACTIVE_ACCOUNT_KEY)
}

function userFromLogin({ correo, cedula }: LoginRequest): User {
  const normalized = correo.toLowerCase()
  if (normalized.includes('coord')) return { name: 'Coordinación Territorial', role: 'Coordinador' }
  if (normalized.includes('abogado')) return { name: 'Equipo Jurídico', role: 'Abogado' }
  return { name: 'Testigo Electoral', role: 'TESTIGO', puestoVotacion: 'ISER', mesas: cedula % 2 === 0 ? 22 : 12 }
}

export const mockApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    await delay(250)
    if (!payload.correo || !payload.password || !payload.cedula) return { status: 400, inicio: false }
    const correo = normalizeEmail(payload.correo)
    const activeAccount = getActiveAccount()
    if (isOccupiedAccount(correo) || activeAccount === correo) return { status: 200, inicio: false }
    setActiveAccount(correo)
    return { status: 200, inicio: true, token: createToken(userFromLogin({ ...payload, correo })) }
  },
  async getUser(token: string): Promise<User> {
    await delay(150)
    const payload = decodeJwt(token)
    const role = payload?.role as Role | undefined
    if (!payload?.name || !role) throw new Error('No se pudo leer la sesión mock.')
    return {
      name: payload.name,
      role,
      puestoVotacion: payload.puestoVotacion,
      mesas: payload.mesas,
    }
  },
  async logout() {
    await delay(100)
    clearActiveAccount()
    return { status: 200 }
  },
  async getPlaces() {
    await delay(250)
    return places
  },
  async createReport(payload: { Reporte: string; Mesa: number; severity: Severity }) {
    await delay(250)
    const reports = reportsByTable.get(payload.Mesa) ?? []
    reportsByTable.set(payload.Mesa, [
      {
        id: crypto.randomUUID(),
        text: payload.Reporte,
        severity: payload.severity,
        testigo: 'Testigo Electoral',
        hora: new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit' }).format(new Date()),
      },
      ...reports,
    ])
    return { status: 200 }
  },
  async getReports(table: number) {
    await delay(250)
    return reportsByTable.get(table) ?? []
  },
  async exportReports(puesto: string, mesa: number) {
    await delay(200)
    const blob = new Blob([`Puesto,Mesa\n${puesto},${mesa}\n`], { type: 'text/csv;charset=utf-8' })
    return { blob, filename: `reportes-${puesto}-mesa-${mesa}.csv` }
  },
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
