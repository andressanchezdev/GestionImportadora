// WarehouseSelector · botón que muestra la bodega activa y abre el menú para cambiarla
// conecta con: navigation (bodega activa), features/warehouses (lista), global useClickOutside (cierra con clic fuera o Escape)
import React, { useRef, useState } from 'react'
import { WAREHOUSES } from '@/features/warehouses'
import { setActiveWarehouse } from '@/features/navigation'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { useClickOutside } from '@/global/hooks/useClickOutside'
import buildingIcon from '@/assets/icons/building.svg'
import { WarehouseMenu } from './WarehouseMenu'
import './WarehouseSelector.css'

export const WarehouseSelector: React.FC = () => {
    const dispatch = useAppDispatch()
    const activeWarehouseId = useAppSelector((state) => state.ui.activeWarehouseId)
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    // ojo: antes el clic fuera y Escape estaban escritos aquí a mano; ahora es el hook compartido
    useClickOutside(wrapperRef, () => setIsOpen(false), isOpen)

    const activeWarehouse = WAREHOUSES.find((w) => w.id === activeWarehouseId) || WAREHOUSES[0]

    return (
        <div className="app-header-warehouse-wrapper" ref={wrapperRef}>
            <span className="app-header-warehouse-title">Tienda:</span>
            <div className="app-header-warehouse-relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`app-header-warehouse-btn ${isOpen ? 'app-header-warehouse-btn-active' : ''}`}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                >
                    <img src={buildingIcon} alt="" className="app-header-warehouse-icon" aria-hidden="true" />
                    <span className="app-header-warehouse-name">{activeWarehouse.name}</span>
                    <span className="app-header-warehouse-badge">{activeWarehouse.id}</span>
                    <svg
                        className={`app-header-warehouse-chevron ${isOpen ? 'app-header-warehouse-chevron-open' : ''}`}
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
                    <WarehouseMenu
                        activeWarehouseId={activeWarehouseId}
                        onSelect={(wh) => {
                            dispatch(setActiveWarehouse(wh))
                            setIsOpen(false)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default WarehouseSelector
