import { AxiosError } from 'axios'
import { endpoints } from '../api/endpoints'
import { httpClient } from '../api/httpClient'
import type { LoginRequest, LoginResponse } from '../types/api.types'
import type { User } from '../types/user.types'


type BackendUserResponse = {
  status: number
  user?: {
    name?: string
    role?: User['role']
    'Puesto de votacion'?: string
    Mesas?: number
  }
}

export async function loginRequest(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>(endpoints.login, payload)
  return data
}

export async function getCurrentUserRequest(): Promise<User> {
  try {
    const { data } = await httpClient.get<BackendUserResponse>(endpoints.user)
    return normalizeUser(data)
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      const { data } = await httpClient.get<BackendUserResponse>(endpoints.userFallback)
      return normalizeUser(data)
    }
    throw error
  }
}

export async function logoutRequest() {
  return httpClient.post(endpoints.logout)
}

function normalizeUser(response: BackendUserResponse): User {
  const user = response.user
  if (response.status !== 200 || !user?.name || !user.role) {
    throw new Error('No se pudo cargar la información del usuario.')
  }

  return {
    name: user.name,
    role: user.role,
    puestoVotacion: user['Puesto de votacion'],
    mesas: user.Mesas,
  }
}
