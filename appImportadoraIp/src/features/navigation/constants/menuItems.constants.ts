// menuItems · lista fija del menú lateral (módulos y subgestiones)
// conecta con: SideMenu (lo pinta), navigation.slice (elige el primer subitem), MainContent (decide la pantalla)
// ojo: id va en inglés (código) y label en español (lo que ve el cliente); antes los subitems eran solo texto
import type { ERPModule, NavItem } from '../types/navigation.types'
import storeIcon from '@/assets/icons/store.svg'
import walletIcon from '@/assets/icons/wallet.svg'
import packageIcon from '@/assets/icons/package-alt-2-svgrepo-com.svg'
import databaseIcon from '@/assets/icons/database.svg'
import userIcon from '@/assets/icons/user.svg'
import fileTextIcon from '@/assets/icons/file-text.svg'

export const MENU_ITEMS: NavItem[] = [
    {
        id: 'shop',
        label: 'Tienda',
        icon: storeIcon,
        subitems: [{ id: 'catalog', label: 'Catálogo' }, { id: 'transfers', label: 'Traslados' }/*,'Carritos', 'Picking Inmediato'*/], //TODO: Quitar comentarios cuando se implementen
    },
    {
        id: 'cashRegister',
        label: 'Gestion Caja',
        icon: packageIcon,
        subitems: [{ id: 'cashVerification', label: 'Verificación Caja' }/*, 'Factura Carta/Ticket', 'Cierre de Turno'*/],
    },
    {
        id: 'wallet',
        label: 'Gestion Cartera',
        icon: walletIcon,
        subitems: [{ id: 'creditLimits', label: 'Cupos de Crédito' }/*, 'Saldos Clientes', 'Pagos Online', 'Historial Pagos'*/], //TODO: Quitar comentarios cuando se implementen
        badgeCount: 3, // Solo si existen acciones pendientes
    },
    {
        id: 'inventory',
        label: 'Gestion Inventario',
        icon: databaseIcon,
        subitems: [{ id: 'products', label: 'Productos' }, /*'Marcas & Categorías', 'Ubicaciones/Estantes', 'Movimientos'*/],
    },
    {
        id: 'thirdParties',
        label: 'Gestion Terceros',
        icon: userIcon,
        subitems: [{ id: 'customers', label: 'Clientes' }, /*'Proveedores', 'Transportadoras', 'Roles & Permisos'*/],
    },
    {
        id: 'reports',
        label: 'Reportes de Ventas',
        icon: fileTextIcon,
        subitems: [{ id: 'dailySales', label: 'Ventas Diarias' }, /*'Reporte General', 'Rentabilidad por Marca'*/],
    },
]

// título (lo que ve el cliente) que muestra MainContent arriba, por módulo
// ojo: antes esto era un switch dentro de MainContent; el texto es el mismo de antes
export const MODULE_HEADER_TITLES: Record<ERPModule, string> = {
  shop: 'Tienda',
  cashRegister: 'Gestión Caja',
  wallet: 'Gestión Cartera',
  inventory: 'Gestión Inventario',
  transfers: 'Traslados',
  thirdParties: 'Empleados',
  reports: 'Reportes de Ventas',
}

// ícono del encabezado de MainContent por módulo (los que no tienen uno propio usan el de documento)
export const MODULE_HEADER_ICONS: Record<ERPModule, string> = {
  shop: storeIcon,
  cashRegister: packageIcon,
  wallet: walletIcon,
  inventory: databaseIcon,
  transfers: fileTextIcon,
  thirdParties: fileTextIcon,
  reports: fileTextIcon,
}
