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
        subitems: [
            { id: 'catalog', label: 'Catálogo' },
            { id: 'pendings', label: 'Pedidos Pendientes' },
            { id: 'inmediatePicking', label: 'Picking Inmediato' },
            { id: 'orderHistory', label: 'Historial de Pedidos' },
            { id: 'savedCarts', label: 'Carritos Virtuales' },
        ],
    },
    {
        id: 'cashRegister',
        label: 'Gestión Caja',
        icon: packageIcon,
        subitems: [
            { id: 'cashVerification', label: 'Verificación Caja' },
            { id: 'posBilling', label: 'Facturación / Cobro' },
            { id: 'receipts', label: 'Recibos de Caja' },
            { id: 'shiftClose', label: 'Cierre de Turno' },
        ],
    },
    {
        id: 'wallet',
        label: 'Gestión Cartera',
        icon: walletIcon,
        subitems: [
            { id: 'creditLimits', label: 'Créditos' },
            { id: 'customerBalances', label: 'Saldos Clientes' },
            { id: 'onlinePayments', label: 'Pagos Online' },
            { id: 'paymentHistory', label: 'Historial de Pagos' },
            { id: 'creditNotes', label: 'Notas Crédito' },
        ],
        badgeCount: 3, // Solo si existen acciones pendientes
    },
    {
        id: 'inventory',
        label: 'Gestión Inventario',
        icon: databaseIcon,
        subitems: [
            { id: 'products', label: 'Productos' },
            { id: 'transfers', label: 'Traslados' },
            { id: 'brandsCategories', label: 'Marcas y Categorías' },
            { id: 'models', label: 'Modelos de Moto' },
            { id: 'locations', label: 'Ubicaciones' },
            { id: 'relocation', label: 'Relocalización' },
            { id: 'movements', label: 'Registro de movimientos' },
        ],
    },
    {
        id: 'thirdParties',
        label: 'Gestión roles',
        icon: userIcon,
        subitems: [
            { id: 'customers', label: 'Clientes' },
            { id: 'customerVerification', label: 'Verificación de Clientes' },
            { id: 'suppliers', label: 'Proveedores' },
            { id: 'carriers', label: 'Transportadoras' },
            { id: 'employees', label: 'Empleados' },
            { id: 'rolesPermissions', label: 'Roles & Permisos' },
        ],
    },
    {
        id: 'reports',
        label: 'Reportes de Ventas',
        icon: fileTextIcon,
        subitems: [
            { id: 'dailySales', label: 'Ventas Diarias' },
            { id: 'generalReport', label: 'Reporte General' },
            { id: 'brandProfitability', label: 'Rentabilidad por Marca' },
            { id: 'ordersReport', label: 'Auditoría de Pedidos' },
            { id: 'paymentMethodsReport', label: 'Métodos de Pago' },
        ],
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
    thirdParties: 'Gestión Terceros',
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
