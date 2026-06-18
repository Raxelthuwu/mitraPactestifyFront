import { AxiosError } from 'axios'
import { endpoints } from '../api/endpoints'
import { httpClient } from '../api/httpClient'
import { mockApi } from '../api/mockApi'
import type { LoginRequest, LoginResponse } from '../types/api.types'
import type { User } from '../types/user.types'

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

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
  if (useMocks) return mockApi.login(payload)
  const { data } = await httpClient.post<LoginResponse>(endpoints.login, payload)
  return data
}

export async function getCurrentUserRequest(token: string): Promise<User> {
  if (useMocks) return mockApi.getUser(token)

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
  if (useMocks) return mockApi.logout()
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
