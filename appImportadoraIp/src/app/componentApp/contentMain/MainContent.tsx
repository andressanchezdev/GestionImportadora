// MainContent · lienzo central: muestra la pantalla según el módulo y subitem activos
// conecta con: navigation (estado ui), screenRegistry (qué pantalla toca) y MainContentPlaceholder (si aún no hay pantalla)
import React from 'react'
import './MainContent.css'
import { useAppSelector } from '@/global/hooks/useRedux'
// ojo: el título y el ícono por módulo salen de navigation, y la pantalla sale de screenRegistry (antes eran switch e if dentro de este componente)
import { getModuleIcon, getModuleTitle, getSubitemLabel } from '@/features/navigation'
import { renderScreen } from './screenRegistry'
import { MainContentPlaceholder } from './MainContentPlaceholder'

export const MainContent: React.FC = () => {
  const { activeModule, activeSubitem } = useAppSelector((state) => state.ui)
  // ojo: activeSubitem es id en inglés; el texto del cliente sale de getSubitemLabel
  const subitemLabel = getSubitemLabel(activeModule, activeSubitem)
  const screen = renderScreen(activeModule, activeSubitem)

  return (
    <main className="main-content">
      {/* Encabezado del Área de Trabajo */}
      <div className="main-content-header">
        <h2 className="main-content-title">
          <img src={getModuleIcon(activeModule)} alt="" className="main-content-title-icon" />
          <span>
            {subitemLabel || 'Inicio'}
          </span>
        </h2>
      </div>

      {/* Contenido dinámico del submódulo activo (la key reinicia la animación de entrada al cambiar) */}
      <div className="main-content-viewport" key={`${activeModule}-${activeSubitem}`}>
        {screen ?? <MainContentPlaceholder moduleId={activeModule} subitemLabel={subitemLabel} />}
      </div>
    </main>
  )
}

export default MainContent
