import {
    useAppDispatch,
    useAppSelector,
    setActiveModule,
    type ERPModule,
} from '@/app/store/store'

interface NavItem {
    id: ERPModule
    label: string
    icon: string
    subitems: string[]
    badge?: string
}

const MENU_ITEMS: NavItem[] = [
    {
        id: 'tienda',
        label: 'Tienda (POS)',
        icon: '🛒',
        subitems: ['Catálogo & Venta', 'Carrito Activo', 'Precios P0-P3', 'Picking Inmediato'],
        badge: 'POS Activo',
    },
    {
        id: 'cartera',
        label: 'Cartera & Pagos',
        icon: '💳',
        subitems: ['Cupos de Crédito', 'Saldos Clientes', 'Pagos Online', 'Historial Pagos'],
        badge: '3 Pend.',
    },
    {
        id: 'caja',
        label: 'Caja & Facturación',
        icon: '💵',
        subitems: ['Verificación Caja', 'Factura Carta/Ticket', 'Cierre de Turno'],
    },
    {
        id: 'inventario',
        label: 'Control Inventario',
        icon: '📦',
        subitems: ['Productos & Stock', 'Marcas & Categorías', 'Ubicaciones/Estantes', 'Movimientos'],
        badge: 'Alertas',
    },
    {
        id: 'traslados',
        label: 'Surtido & Traslados',
        icon: '🚚',
        subitems: ['Pipeline Alistamiento', 'Traslados Bodegas', 'Ingreso Traslado'],
    },
    {
        id: 'empleados',
        label: 'Terceros & Personal',
        icon: '👥',
        subitems: ['Clientes', 'Proveedores', 'Transportadoras', 'Roles & Permisos'],
    },
    {
        id: 'reportes',
        label: 'Reportes de Ventas',
        icon: '📊',
        subitems: ['Ventas Diarias', 'Reporte General', 'Rentabilidad por Marca'],
    },
]

export const SideMenuLateral: React.FC = () => {
    const dispatch = useAppDispatch()
    const activeModule = useAppSelector((state) => state.ui.activeModule)

    return (
        <aside
            style={{ width: '340px' }}
            className="w-[340px] min-w-[340px] max-w-[340px] bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full select-none"
        >
            {/* Encabezado del menú */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Panel de Administrador
                </span>
                <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">
                    340px
                </span>
            </div>

            {/* Lista de Navegación de los 7 Módulos */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                {MENU_ITEMS.map((item) => {
                    const isActive = activeModule === item.id
                    return (
                        <div key={item.id} className="space-y-1">
                            <button
                                onClick={() => dispatch(setActiveModule(item.id))}
                                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition cursor-pointer ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </button>

                            {/* Submenú del módulo activo */}
                            {isActive && (
                                <div className="pl-10 pr-2 py-1 space-y-1 border-l-2 border-indigo-500/40 ml-4">
                                    {item.subitems.map((sub, idx) => (
                                        <button
                                            key={idx}
                                            className="block w-full text-left text-xs py-1.5 px-2 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60 transition cursor-pointer"
                                        >
                                            • {sub}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Pie de estado */}
            <div className="p-3.5 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500">
                <p className="font-semibold text-slate-400">Servidor Railway</p>
                <p className="truncate text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    En línea · Producción
                </p>
            </div>
        </aside>
    )
}
