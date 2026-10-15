import React, { useState } from 'react'
import './DrawerRight.css'

export const DrawerLateralDerecho: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <aside
            className={`drawer-lateral ${
                isOpen ? 'drawer-lateral-open' : 'drawer-lateral-collapsed'
            }`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="drawer-toggle-btn"
                title={isOpen ? 'Contraer panel' : 'Expandir panel'}
            >
                {isOpen ? '›' : '‹'}
            </button>

            {isOpen ? (
                <div className="drawer-content">
                    <div className="drawer-header">
                        <div className="drawer-title-wrapper">
                            <span className="drawer-title-icon">📋</span>
                            <h3 className="drawer-title">
                                Panel Lateral Derecho
                            </h3>
                        </div>
                        <span className="drawer-badge">
                            Esqueleto Base
                        </span>
                    </div>

                    <div className="drawer-body">
                        <div className="drawer-card-skeleton">
                            <div className="drawer-line-pulse" />
                            <div className="drawer-block-pulse" />
                        </div>

                        <div className="drawer-placeholder">
                            <span className="drawer-placeholder-icon">⚡</span>
                            Espacio preparado para widgets de acción rápida, resumen o carrito.
                        </div>
                    </div>

                    <div className="drawer-footer">
                        <button className="drawer-action-btn">
                            Acción Principal del Drawer
                        </button>
                    </div>
                </div>
            ) : (
                <div className="drawer-collapsed-view">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="drawer-collapsed-icon-btn"
                        title="Expandir panel"
                    >
                        <span className="drawer-collapsed-icon">📋</span>
                    </button>
                    <div className="drawer-collapsed-vertical-text">
                        Panel Derecho
                    </div>
                </div>
            )}
        </aside>
    )
}
