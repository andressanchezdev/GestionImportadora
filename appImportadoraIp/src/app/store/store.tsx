import { configureStore, combineReducers, createSlice, type PayloadAction } from '@reduxjs/toolkit'
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
import storage from 'redux-persist/lib/storage'
import { Provider, type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import './store.css'

import { AppHeader } from '@/app/componentApp/header/AppHeader'
import { SideMenuLateral } from '@/app/componentApp/sideMenu/SideMenu'
import { ContenedorMainContent } from '@/app/componentApp/contenedorMainContent/ContenedorMainContent'
import { DrawerLateralDerecho } from '@/app/componentApp/drawerLateralDerecho/DrawerRight'

// ============================================================================
// 1. TIPOS Y MODELOS DE LA CAPA DE APLICACIÓN (UI & NAVEGACIÓN)
// ============================================================================

export type ERPModule =
  | 'tienda'
  | 'cartera'
  | 'caja'
  | 'inventario'
  | 'traslados'
  | 'empleados'
  | 'reportes'

export interface UIState {
  activeModule: ERPModule
  sidebarOpen: boolean
  activeWarehouseId: string
  activeWarehouseName: string
  companyId: string
  companyName: string
  currentUser: {
    id: string
    name: string
    role: string
    branch: string
  }
  cashRegisterStatus: 'open' | 'closed'
}

const initialUIState: UIState = {
  activeModule: 'tienda',
  sidebarOpen: true,
  activeWarehouseId: 'WH-01',
  activeWarehouseName: 'Bodega Principal',
  companyId: 'CP-PREMIUM-01',
  companyName: 'Importadora Premium Online S.A.S',
  currentUser: {
    id: 'USR-01',
    name: 'Usuario Administrador',
    role: 'Administrador / Facturación',
    branch: 'Sucursal Central',
  },
  cashRegisterStatus: 'open',
}

// ============================================================================
// 2. SLICE DE UI (GESTIÓN TÉCNICA DEL LAYOUT)
// ============================================================================

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUIState,
  reducers: {
    setActiveModule: (state, action: PayloadAction<ERPModule>) => {
      state.activeModule = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setActiveWarehouse: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      state.activeWarehouseId = action.payload.id
      state.activeWarehouseName = action.payload.name
    },
    setCashRegisterStatus: (state, action: PayloadAction<'open' | 'closed'>) => {
      state.cashRegisterStatus = action.payload
    },
  },
})

export const {
  setActiveModule,
  toggleSidebar,
  setSidebarOpen,
  setActiveWarehouse,
  setCashRegisterStatus,
} = uiSlice.actions

// ============================================================================
// 3. CONFIGURACIÓN DEL STORE & PERSISTENCIA
// ============================================================================

const rootReducer = combineReducers({
  ui: uiSlice.reducer,
})

const persistConfig = {
  key: 'ip_online_root',
  storage,
  whitelist: ['ui'],
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
// 4. HOOKS TIPADOS DE REDUX
// ============================================================================

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ============================================================================
// 5. COMPONENTE RAÍZ DEL ESQUELETO (ENSAMBLAJE DEL LAYOUT)
// ============================================================================

export function StoreApp() {
  return (
    <Provider store={store}>
      <div className="store-app-layout">
        {/* Barra Superior */}
        <AppHeader />

        {/* Cuerpo del Layout con los 3 bloques estructurales */}
        <div className="store-app-body">
          {/* Menú lateral izquierdo (340px) */}
          <SideMenuLateral />

          {/* Lienzo central flexible (flex-1) */}
          <ContenedorMainContent />

          {/* Panel lateral derecho desplegable */}
          <DrawerLateralDerecho />
        </div>
      </div>
    </Provider>
  )
}

export default StoreApp
