// warehouses.constants · lista fija de bodegas
// conecta con: AppHeader (selector de bodega)
import type { Warehouse } from '../types/warehouse.types'

export const WAREHOUSES: Warehouse[] = [
    { id: 'WH-01', name: 'Bodega Principal', isDefault: true },
    /*{ id: 'WH-02', name: 'Bodega Norte' },
    { id: 'WH-03', name: 'Bodega Cali Repuestos' },*/
]
