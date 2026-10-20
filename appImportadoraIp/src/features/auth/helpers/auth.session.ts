// auth.session · puente entre la sesión guardada en el navegador y el estado de auth
// conecta con: global/helpers/session.storage (guarda y lee), auth.slice (estado inicial) y auth.thunks (guardar y borrar)
import { clearSession, readSession, saveSession } from '@/global/helpers/session.storage'
import type { AuthResponse, AuthState, AuthUser } from '../types/auth.types'

// estado inicial: si hay sesión guardada el usuario entra directo, si no ve el login
// ojo: auth NO va en redux-persist; se lee aquí, de forma síncrona, para no mostrar el login un instante de más
export const getInitialAuthState = (): AuthState => {
  const session = readSession()
  const user = (session?.user as AuthUser | undefined) ?? null
  return { user, status: user ? 'authenticated' : 'anonymous', error: null }
}

export const persistAuthSession = (response: AuthResponse, remember: boolean): void => {
  saveSession(
    { accessToken: response.access_token, refreshToken: response.refresh_token, user: response.user },
    remember
  )
}

export const clearAuthSession = (): void => clearSession()
