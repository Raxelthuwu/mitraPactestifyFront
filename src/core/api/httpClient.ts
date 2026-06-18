import axios from 'axios'
import { authEvents } from '../auth/authEvents'
import { tokenStorage } from '../auth/tokenStorage'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) authEvents.emitLogout()
    return Promise.reject(error)
  },
)
