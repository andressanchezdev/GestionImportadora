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
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { rootReducer } from './rootReducer'

// ============================================================================
// 1. CONFIGURACIÓN DEL STORE & PERSISTENCIA
// ============================================================================
const persistConfig = {
  key: 'ip_online_root',
  storage,
  whitelist: ['ui', 'shop', 'cartera'], //afuturo aqui las demas 
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

// ============================================================================
// 2. HOOKS TIPADOS DE REDUX
// ============================================================================

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ============================================================================
// 3. RE-EXPORTACIONES PARA MANTENER RETROCOMPATIBILIDAD LIMPIA
// ============================================================================

//export * from './types/ui.types'
//export * from './constants/ui.constants'
//export * from './slices/ui.slice'
export default store
