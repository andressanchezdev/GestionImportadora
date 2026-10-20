// auth.thunks · acciones asíncronas de la sesión: iniciar y cerrar sesión
// conecta con: auth.service (login), auth.session (guardar/borrar) y auth.slice (reacciona a los resultados)
import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginRequest } from '../services/auth.service'
import { getLoginErrorMessage } from '../helpers/auth.helpers'
import { clearAuthSession, persistAuthSession } from '../helpers/auth.session'
import type { AuthUser, LoginCredentials } from '../types/auth.types'

// inicia sesión: pide el login, guarda la sesión y devuelve el usuario; si falla devuelve el mensaje
export const loginThunk = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginRequest(credentials)
      persistAuthSession(response, credentials.remember)
      return response.user
    } catch (error) {
      return rejectWithValue(getLoginErrorMessage(error))
    }
  }
)

// cierra sesión: borra los datos guardados (el slice vuelve a "anonymous")
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  clearAuthSession()
})
