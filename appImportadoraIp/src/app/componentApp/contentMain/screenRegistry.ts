// screenRegistry · mapa de qué pantalla de feature se muestra por módulo y subgestión
// conecta con: MainContent (pide la pantalla); las pantallas vienen de features/shop, features/wallet y features/customers
// ojo: para sumar una pantalla nueva solo se agrega una línea aquí (antes eran if encadenados dentro de MainContent)
import { createElement, type ComponentType, type ReactNode } from 'react'
import type { ERPModule } from '@/features/navigation'
import { ShopCatalogScreen } from '@/features/shop'
import { WalletScreen } from '@/features/wallet'
import { CustomersScreen } from '@/features/customers'

interface ScreenEntry {
  screen?: ComponentType // pantalla para cualquier subgestión del módulo
  subitems?: Record<string, ComponentType> // pantalla por id de subgestión
}

export const SCREEN_REGISTRY: Partial<Record<ERPModule, ScreenEntry>> = {
  shop: { subitems: { catalog: ShopCatalogScreen } },
  wallet: { screen: WalletScreen },
  thirdParties: { subitems: { customers: CustomersScreen } },
}

// devuelve la pantalla del módulo/subgestión ya creada, o null si todavía no existe (se muestra el aviso de "Próxima Fase")
export const renderScreen = (moduleId: ERPModule, subitemId: string): ReactNode => {
  const entry = SCREEN_REGISTRY[moduleId]
  const Screen = entry?.subitems?.[subitemId] ?? entry?.screen
  return Screen ? createElement(Screen) : null
}
