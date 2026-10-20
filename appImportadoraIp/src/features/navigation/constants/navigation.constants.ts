// navigation.constants · estado inicial de la navegación (módulo, subgestión, bodega y caja de arranque)
// conecta con: navigation.slice (initialState)
import type { NavigationState } from '../types/navigation.types'

export const INITIAL_NAVIGATION_STATE: NavigationState = {
  activeModule: 'shop',
  activeSubitem: 'catalog',
  sidebarOpen: true,
  activeWarehouseId: 'WH-01',
  activeWarehouseName: 'Bodega Principal',
  cashRegisterStatus: 'open',
}

// Retrocompatibilidad
export const INITIAL_UI_STATE = INITIAL_NAVIGATION_STATE
