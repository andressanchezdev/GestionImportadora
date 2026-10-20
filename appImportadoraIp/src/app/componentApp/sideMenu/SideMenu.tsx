// SideMenu · menú lateral: lista de módulos con sus subgestiones y, abajo, el estado de la API y el usuario
// conecta con: navigation (MENU_ITEMS y acciones del estado ui); partes: SideMenuItem, ApiStatus y SideMenuUser
import React from 'react'
import './SideMenu.css'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { MENU_ITEMS, setActiveModule, setActiveSubitem } from '@/features/navigation'
import { SideMenuItem } from './item/SideMenuItem'
import { ApiStatus } from './footer/ApiStatus'
import { SideMenuUser } from './footer/SideMenuUser'

export const SideMenu: React.FC = () => {
    const dispatch = useAppDispatch()
    const { activeModule, activeSubitem } = useAppSelector((state) => state.ui)

    return (
        <aside className="side-menu">
            {/* Lista de Navegación de los Módulos */}
            <nav className="side-menu-nav" aria-label="Módulos">
                {MENU_ITEMS.map((item) => (
                    <SideMenuItem
                        key={item.id}
                        item={item}
                        isActive={activeModule === item.id}
                        activeSubitem={activeSubitem}
                        onSelectModule={(id) => dispatch(setActiveModule(id))}
                        onSelectSubitem={(id) => dispatch(setActiveSubitem(id))}
                    />
                ))}
            </nav>

            {/* Pie: estado de la API y usuario */}
            <div className="side-menu-footer">
                <ApiStatus />
                <SideMenuUser />
            </div>
        </aside>
    )
}

export default SideMenu
