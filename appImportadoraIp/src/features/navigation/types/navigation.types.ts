export type ERPModule =
  | 'tienda'
  | 'cartera'
  | 'caja'
  | 'inventario'
  | 'traslados'
  | 'empleados'
  | 'reportes'

export interface NavItem {
  id: ERPModule
  label: string
  icon: string
  subitems: string[]
  badgeCount?: number
}

export interface UserProfile {
  id: string
  name: string
  role: string
  branch: string
}

export interface UIState {
  activeModule: ERPModule
  activeSubitem: string
  sidebarOpen: boolean
  activeWarehouseId: string
  activeWarehouseName: string
  companyId: string
  companyName: string
  currentUser: UserProfile
  cashRegisterStatus: 'open' | 'closed'
}

// Alias semántico para Navigation
export type NavigationState = UIState
