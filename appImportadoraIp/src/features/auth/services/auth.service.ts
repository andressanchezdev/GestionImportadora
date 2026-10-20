// auth.service · llamada al backend para iniciar sesión (POST /auth/login)
// conecta con: api/client (axios con interceptores) y api/config (endpoint); la usa auth.thunks
// ojo: igual que importadora-online (mismo endpoint y mismo cuerpo { email, password })
import { apiClient, API_CONFIG, type APIResponse } from '@/api'
import type { AuthResponse, LoginCredentials } from '../types/auth.types'

export const loginRequest = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<APIResponse<AuthResponse>>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password })
  return data.data
}
