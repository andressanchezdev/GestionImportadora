import type { NavItem } from '../types/navigation.types'
import storeIcon from '@/assets/icons/store.svg'
import walletIcon from '@/assets/icons/wallet.svg'
import packageIcon from '@/assets/icons/package-alt-2-svgrepo-com.svg'
import databaseIcon from '@/assets/icons/database.svg'
import userIcon from '@/assets/icons/user.svg'
import fileTextIcon from '@/assets/icons/file-text.svg'

export const MENU_ITEMS: NavItem[] = [
    {
        id: 'tienda',
        label: 'Tienda',
        icon: storeIcon,
        subitems: ['Catálogo', 'Traslados'/*,'Carritos', 'Picking Inmediato'*/], //TODO: Quitar comentarios cuando se implementen
    },
    {
        id: 'caja',
        label: 'Gestion Caja',
        icon: packageIcon,
        subitems: ['Verificación Caja'/*, 'Factura Carta/Ticket', 'Cierre de Turno'*/],
    },
    {
        id: 'cartera',
        label: 'Gestion Cartera',
        icon: walletIcon,
        subitems: ['Cupos de Crédito'/*, 'Saldos Clientes', 'Pagos Online', 'Historial Pagos'*/], //TODO: Quitar comentarios cuando se implementen
        badgeCount: 3, // Solo si existen acciones pendientes
    },
    {
        id: 'inventario',
        label: 'Gestion Inventario',
        icon: databaseIcon,
        subitems: ['Productos', /*'Marcas & Categorías', 'Ubicaciones/Estantes', 'Movimientos'*/],
    },
    {
        id: 'empleados',
        label: 'Gestion Terceros',
        icon: userIcon,
        subitems: ['Clientes', /*'Proveedores', 'Transportadoras', 'Roles & Permisos'*/],
    },
    {
        id: 'reportes',
        label: 'Reportes de Ventas',
        icon: fileTextIcon,
        subitems: ['Ventas Diarias', /*'Reporte General', 'Rentabilidad por Marca'*/],
    },
]
