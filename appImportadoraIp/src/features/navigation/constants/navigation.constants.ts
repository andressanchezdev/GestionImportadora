import type { NavigationState } from '../types/navigation.types'

export const INITIAL_NAVIGATION_STATE: NavigationState = {
  activeModule: 'tienda',
  activeSubitem: 'Catálogo',
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

// Retrocompatibilidad
export const INITIAL_UI_STATE = INITIAL_NAVIGATION_STATE
