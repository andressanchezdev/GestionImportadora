import React from 'react'
import './SideMenu.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import {
    MENU_ITEMS,
    setActiveModule,
    setActiveSubitem,
} from '@/features/navigation'

export const SideMenuLateral: React.FC = () => {
    const dispatch = useAppDispatch()
    const { activeModule, activeSubitem, currentUser } = useAppSelector(
        (state) => state.ui
    )
    return (
        <aside className="side-menu-lateral">
            {/* Lista de Navegación de los 7 Módulos */}
            <nav className="side-menu-nav">
                {MENU_ITEMS.map((item) => {
                    const isActive = activeModule === item.id
                    return (
                        <div key={item.id} className="side-menu-item-group">
                            <button
                                onClick={() => dispatch(setActiveModule(item.id))}
                                className={`side-menu-item-btn ${isActive
                                    ? 'side-menu-item-btn-active'
                                    : 'side-menu-item-btn-inactive'
                                    }`}
                            >
                                <div className="side-menu-item-label-wrapper">
                                    <img src={item.icon} alt={item.label} className="side-menu-item-icon" />
                                    <span>{item.label}</span>
                                </div>
                                {Boolean(item.badgeCount && item.badgeCount > 0) &&
                                    (<span className={`side-menu-item-badge ${isActive ? 'side-menu-item-badge-active' : 'side-menu-item-badge-inactive'}`}>
                                        {item.badgeCount}
                                    </span>)}

                            </button>

                            {/* Submenú del módulo activo */}
                            {isActive && (
                                <div className="side-menu-subitems">
                                    {item.subitems.map((sub, idx) => {
                                        const isSubActive = activeSubitem === sub
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => dispatch(setActiveSubitem(sub))}
                                                className={`side-menu-subitem-btn ${isSubActive ? 'side-menu-subitem-btn-active' : ''
                                                    }`}
                                            >
                                                • {sub}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* Pie de estado */}
            <div className="side-menu-footer">
                {/* Perfil del Usuario */}
                <div className="app-header-user">
                    <div className="app-header-user-avatar">
                        TU
                    </div>
                    <div className="app-header-user-info">
                        <p className="app-header-user-name">{currentUser?.name}</p>
                        <p className="app-header-user-role">{currentUser?.role}</p>
                    </div>
                </div>

            </div>
        </aside>
    )
}
