import React from 'react'
import './AppHeader.css'
import {
    useAppDispatch,
    useAppSelector,
    setActiveWarehouse,
    setCashRegisterStatus,
} from '@/app/store/store'

export const AppHeader: React.FC = () => {
    const dispatch = useAppDispatch()
    const { activeWarehouseId, cashRegisterStatus, currentUser } = useAppSelector(
        (state) => state.ui
    )

    const warehouses = [
        { id: 'WH-01', name: 'Bodega Principal' },
        { id: 'WH-02', name: 'Bodega Norte' },
        { id: 'WH-03', name: 'Bodega Cali Repuestos' },
    ]

    return (
        <header className="app-header">
            {/* Logo y Nombre del Sistema */}
            <div className="app-header-brand">
                <div className="app-header-logo">
                    IP
                </div>
                <div>
                    <h1 className="app-header-title">
                        IP Online
                        <span className="app-header-badge">
                            ERP Premium
                        </span>
                    </h1>
                    <p className="app-header-subtitle">Importadora & Distribuidora</p>
                </div>
            </div>

            {/* Controles de Bodega, Caja y Usuario */}
            <div className="app-header-actions">
                {/* Selector de Bodega Activa */}
                <div className="app-header-warehouse-selector">
                    <span className="app-header-warehouse-label">Bodega:</span>
                    <select
                        value={activeWarehouseId}
                        onChange={(e) => {
                            const selected = warehouses.find((w) => w.id === e.target.value)
                            if (selected) dispatch(setActiveWarehouse(selected))
                        }}
                        aria-label="Seleccionar bodega activa"
                        className="app-header-warehouse-select"
                    >
                        {warehouses.map((wh) => (
                            <option key={wh.id} value={wh.id} className="app-header-warehouse-option">
                                {wh.name} ({wh.id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estado de Caja */}
                <button
                    onClick={() =>
                        dispatch(
                            setCashRegisterStatus(cashRegisterStatus === 'open' ? 'closed' : 'open')
                        )
                    }
                    className={`app-header-cash-btn ${
                        cashRegisterStatus === 'open'
                            ? 'app-header-cash-btn-open'
                            : 'app-header-cash-btn-closed'
                    }`}
                    title="Clic para abrir o cerrar caja"
                >
                    <span
                        className={`app-header-cash-dot ${
                            cashRegisterStatus === 'open'
                                ? 'app-header-cash-dot-open'
                                : 'app-header-cash-dot-closed'
                        }`}
                    />
                    {cashRegisterStatus === 'open' ? 'Caja Abierta' : 'Caja Cerrada'}
                </button>

                {/* Perfil del Usuario */}
                <div className="app-header-user">
                    <div className="app-header-user-avatar">
                        TU
                    </div>
                    <div className="app-header-user-info">
                        <p className="app-header-user-name">{currentUser.name}</p>
                        <p className="app-header-user-role">{currentUser.role}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
