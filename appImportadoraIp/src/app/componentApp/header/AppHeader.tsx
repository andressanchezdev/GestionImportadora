import React, { useState, useRef, useEffect } from 'react'
import { WAREHOUSES } from '@/features/warehouses'
import buildingIcon from '@/assets/icons/building.svg'
import './AppHeader.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { setActiveWarehouse } from '@/features/navigation'
import { checkApiHealth, type HealthCheckResult } from '@/api'

export const AppHeader: React.FC = () => {
    const dispatch = useAppDispatch()
    const { activeWarehouseId } = useAppSelector((state) => state.ui)
    const [isOpen, setIsOpen] = useState(false)
    const [apiHealth, setApiHealth] = useState<HealthCheckResult | null>(null)
    const [isCheckingApi, setIsCheckingApi] = useState<boolean>(true)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Handshake inicial de conexión con el backend de Railway
    useEffect(() => {
        let mounted = true
        checkApiHealth()
            .then((result) => {
                if (mounted) {
                    setApiHealth(result)
                    setIsCheckingApi(false)
                    if (result.isConnected) {
                        console.log(`%c[API Railway] ${result.message}`, 'color: #10b981; font-weight: bold;')
                    } else {
                        console.warn(`[API Railway Warning] ${result.message}`)
                    }
                }
            })
            .catch((err) => {
                if (mounted) {
                    setIsCheckingApi(false)
                    console.error('[API Railway Error]', err)
                }
            })
        return () => {
            mounted = false
        }
    }, [])

    const activeWarehouse =
        WAREHOUSES.find((w) => w.id === activeWarehouseId) || WAREHOUSES[0]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

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
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span className="app-header-badge">
                            ERP Premium
                        </span>
                        {/* Indicador de Conexión a la API */}
                        {isCheckingApi ? (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#64748b',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: '#f8fafc',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    border: '1px solid #e2e8f0',
                                }}
                                title="Verificando conectividad con backend en Railway..."
                            >
                                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#f59e0b' }} />
                                Conectando...
                            </span>
                        ) : apiHealth?.isConnected ? (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#059669',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: '#ecfdf5',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    border: '1px solid #a7f3d0',
                                    fontWeight: 600,
                                }}
                                title={apiHealth.message}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#10b981' }} />
                                API Online ({apiHealth.latencyMs}ms)
                            </span>
                        ) : (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: '#dc2626',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: '#fef2f2',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    border: '1px solid #fecaca',
                                    fontWeight: 600,
                                }}
                                title={apiHealth?.message || 'Error al conectar con backend'}
                            >
                                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#ef4444' }} />
                                API Offline
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Selector de Bodega Activa (Custom Dropdown) */}
            <div className="app-header-actions">
                <div className="app-header-warehouse-wrapper" ref={dropdownRef}>
                    <span className="app-header-warehouse-title">
                        Tienda:
                    </span>
                    <div className="app-header-warehouse-relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen((prev) => !prev)}
                            className={`app-header-warehouse-btn ${
                                isOpen ? 'app-header-warehouse-btn-active' : ''
                            }`}
                            aria-expanded={isOpen}
                            aria-haspopup="listbox"
                        >
                            <img
                                src={buildingIcon}
                                alt=""
                                className="app-header-warehouse-icon"
                                aria-hidden="true"
                            />
                            <span className="app-header-warehouse-name">
                                {activeWarehouse.name}
                            </span>
                            <span className="app-header-warehouse-badge">
                                {activeWarehouse.id}
                            </span>
                            <svg
                                className={`app-header-warehouse-chevron ${
                                    isOpen ? 'app-header-warehouse-chevron-open' : ''
                                }`}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {/* Menú Desplegable Flotante */}
                        {isOpen && (
                            <div className="app-header-warehouse-menu" role="listbox">
                                <div className="app-header-warehouse-menu-header">
                                    Bodegas Disponibles
                                </div>
                                <div className="app-header-warehouse-menu-list">
                                    {WAREHOUSES.map((wh) => {
                                        const isSelected = wh.id === activeWarehouseId
                                        return (
                                            <button
                                                type="button"
                                                key={wh.id}
                                                onClick={() => {
                                                    dispatch(setActiveWarehouse(wh))
                                                    setIsOpen(false)
                                                }}
                                                className={`app-header-warehouse-menu-item ${
                                                    isSelected
                                                        ? 'app-header-warehouse-menu-item-selected'
                                                        : ''
                                                }`}
                                                role="option"
                                                aria-selected={isSelected}
                                            >
                                                <div className="app-header-warehouse-menu-item-content">
                                                    <span
                                                        className={`app-header-warehouse-menu-dot ${
                                                            isSelected
                                                                ? 'app-header-warehouse-menu-dot-active'
                                                                : ''
                                                        }`}
                                                    />
                                                    <span className="app-header-warehouse-menu-item-name">
                                                        {wh.name}
                                                    </span>
                                                </div>
                                                <div className="app-header-warehouse-menu-item-right">
                                                    <span className="app-header-warehouse-menu-item-id">
                                                        {wh.id}
                                                    </span>
                                                    {isSelected && (
                                                        <svg
                                                            className="app-header-warehouse-menu-check"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
