// auth.selectors · lecturas simples del estado de la sesión
// conecta con: AuthGate (¿hay sesión?), SideMenuUser (usuario), LoginForm (¿está ingresando?)
import type { AuthState } from '../types/auth.types'

// forma mínima del state (así la feature no importa el store de app)
type AuthRootState = { auth: AuthState }

export const selectIsAuthenticated = (state: AuthRootState) => state.auth.status === 'authenticated'
export const selectIsAuthenticating = (state: AuthRootState) => state.auth.status === 'authenticating'
export const selectCurrentUser = (state: AuthRootState) => state.auth.user
