// SideMenuUser · tarjeta del usuario en el footer del menú (avatar con iniciales, nombre, rol y botón de cerrar sesión)
// conecta con: features/auth (usuario de la sesión y logoutThunk); las iniciales salen de global/helpers/format
// ojo: antes el usuario salía del estado ui con datos fijos; ahora sale de la sesión (login)
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { getInitials } from '@/global/helpers/format'
import { getDisplayName, logoutThunk, selectCurrentUser } from '@/features/auth'
import logoutIcon from '@/assets/icons/logout.svg'
import './SideMenuUser.css'

export const SideMenuUser: React.FC = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectCurrentUser)
    if (!user) return null

    const displayName = getDisplayName(user)

    return (
        <div className="side-menu-user">
            <div className="side-menu-user-avatar" aria-hidden="true">
                {getInitials(displayName)}
            </div>
            <div className="side-menu-user-info">
                <p className="side-menu-user-name">{displayName}</p>
                <p className="side-menu-user-role">{user.userType}</p>
            </div>
            <button
                type="button"
                className="side-menu-user-logout"
                onClick={() => dispatch(logoutThunk())}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
            >
                <img src={logoutIcon} alt="" className="side-menu-user-logout-icon" />
            </button>
        </div>
    )
}

export default SideMenuUser
