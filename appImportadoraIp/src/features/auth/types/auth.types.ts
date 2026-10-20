// auth.types · contratos de la sesión: usuario, credenciales, respuesta del login y estado del slice
// conecta con: auth.service, auth.slice, auth.thunks, auth.selectors y los componentes del login
export interface AuthUser {
  userId: number
  companyId: number
  warehouseId?: number
  name: string
  lastName: string
  email: string
  identification: string
  photo: string
  userType: string
}

// lo que se envía a POST /auth/login (remember no viaja: solo decide dónde se guarda la sesión)
export interface LoginCredentials {
  email: string
  password: string
  remember: boolean
}

// respuesta de POST /auth/login dentro del envoltorio { success, data }
export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export type AuthStatus = 'anonymous' | 'authenticating' | 'authenticated'

export interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}
