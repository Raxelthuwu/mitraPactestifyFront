export type Role = 'TESTIGO' | 'Abogado' | 'Coordinador'

export interface User {
  name: string
  role: Role
  puestoVotacion?: string
  mesas?: number
}

export function isAbogadoRole(role: Role) {
  return role === 'Abogado' || role === 'Coordinador'
}

export function routeForRole(role: Role) {
  return isAbogadoRole(role) ? '/abogado' : '/testigo'
}
