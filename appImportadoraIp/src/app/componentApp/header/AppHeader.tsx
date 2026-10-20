// AppHeader · barra superior: logo con el nombre del sistema y el selector de bodega
// conecta con: WarehouseSelector (bodega activa); ojo: el estado de la API (latencia) ahora se muestra en el footer del menú (ApiStatus)
import React from 'react'
import './AppHeader.css'
import { WarehouseSelector } from './warehouse/WarehouseSelector'

export const AppHeader: React.FC = () => {
    return (
        <header className="app-header">
            {/* Logo y Nombre del Sistema */}
            <div className="app-header-brand">
                <div className="app-header-logo">IP</div>
                <div>
                    <h1 className="app-header-title">IP Online</h1>
                    <span className="app-header-badge">ERP Premium</span>
                </div>
            </div>

            {/* Selector de Bodega Activa (Custom Dropdown) */}
            <div className="app-header-actions">
                <WarehouseSelector />
            </div>
        </header>
    )
}

export default AppHeader
