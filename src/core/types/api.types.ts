export type ApiOk<T = Record<string, never>> = { status: 200 } & T

export type ApiError = {
  status: number
  inicio?: boolean | string
}

export type Severity = 'alto' | 'medio' | 'bajo'

export type LoginRequest = {
  correo: string
  cedula: number
  password: string
}

export type LoginResponse = {
  token?: string
  status: number
  inicio: boolean | string
}
