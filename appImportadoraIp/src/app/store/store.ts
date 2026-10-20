// store · configura redux + persistencia y exporta los tipos RootState y AppDispatch
// conecta con: rootReducer, global/helpers/storage; ojo: antes se llamaba store.tsx (no tenía JSX)
import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from '@/global/helpers/storage'
import { toast } from '@/global/helpers/toast'
import { setUnauthorizedHandler } from '@/api'
import { LOGIN_MESSAGES, logoutThunk } from '@/features/auth'

import { rootReducer } from './rootReducer'

// ============================================================================
// 1. CONFIGURACIÓN DEL STORE & PERSISTENCIA
// ============================================================================
const persistConfig = {
  key: 'ip_online_root_v2', // v2: cambiaron los ids a inglés (módulos y estados), se sube la clave para no cargar datos viejos
  storage,
  whitelist: ['ui', 'shop', 'wallet'], //afuturo aqui las demas 
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

// ojo: si el backend responde 401 (token vencido) se cierra la sesión y se avisa; el login mismo no cuenta (lo filtra api/client)
setUnauthorizedHandler(() => {
  store.dispatch(logoutThunk())
  toast.error(LOGIN_MESSAGES.expiredTitle, { description: LOGIN_MESSAGES.expiredDescription })
})

// ============================================================================
// 2. TIPOS DEL STORE (los hooks tipados están en global/hooks/useRedux.ts)
// ============================================================================

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// ojo: useAppDispatch y useAppSelector ahora viven en global/hooks/useRedux.ts

// ============================================================================
// 3. RE-EXPORTACIONES PARA MANTENER RETROCOMPATIBILIDAD LIMPIA
// ============================================================================

//export * from './types/ui.types'
//export * from './constants/ui.constants'
//export * from './slices/ui.slice'
export default store
