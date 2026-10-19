import React from 'react'
import './ContenedorMainContent.css'
import { useAppSelector } from '@/app/store/store'
import { ShopCatalogScreen } from '@/features/shop'
import { CarteraScreen } from '@/features/cartera'
import fileTextIcon from '@/assets/icons/file-text.svg'
import packageIcon from '@/assets/icons/package-alt-2-svgrepo-com.svg'
import storeIcon from '@/assets/icons/store.svg'
import walletIcon from '@/assets/icons/wallet.svg'
import databaseIcon from '@/assets/icons/database.svg'

export const ContenedorMainContent: React.FC = () => {
  const { activeModule, activeSubitem } = useAppSelector((state) => state.ui)

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'tienda':
        return storeIcon
      case 'caja':
        return packageIcon
      case 'cartera':
        return walletIcon
      case 'inventario':
        return databaseIcon
      default:
        return fileTextIcon
    }
  }

  const formatModuleName = (mod: string) => {
    switch (mod) {
      case 'tienda':
        return 'Tienda'
      case 'caja':
        return 'Gestión Caja'
      case 'cartera':
        return 'Gestión Cartera'
      case 'inventario':
        return 'Gestión Inventario'
      case 'traslados':
        return 'Traslados'
      case 'empleados':
        return 'Empleados'
      case 'reportes':
        return 'Reportes de Ventas'
      default:
        return mod
    }
  }

  const renderContent = () => {
    if (activeModule === 'tienda' && (activeSubitem === 'Catálogo' || !activeSubitem)) {
      return <ShopCatalogScreen />
    }

    if (activeModule === 'cartera') {
      return <CarteraScreen />
    }

    return (
      <div className="main-content-canvas-section">
        <div className="main-content-canvas-header">
          <h3 className="main-content-canvas-title">
            {formatModuleName(activeModule)} · {activeSubitem || 'General'}
          </h3>
          <span className="main-content-canvas-tag">Próxima Fase</span>
        </div>
        <div className="main-content-canvas-placeholder">
          <img
            src={getModuleIcon(activeModule)}
            alt=""
            style={{ width: 36, height: 36, opacity: 0.6 }}
          />
          <h4 className="main-content-canvas-placeholder-heading">
            Submódulo preparado para integración
          </h4>
          <p className="main-content-canvas-placeholder-text">
            Este espacio cargará la pantalla de <strong>{activeSubitem || activeModule}</strong>{' '}
            conectada a su feature de dominio en las siguientes fases.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="contenedor-main-content">
      {/* Encabezado del Área de Trabajo */}
      <div className="main-content-header">
        <h2 className="main-content-title">
          <img
            src={getModuleIcon(activeModule)}
            alt=""
            style={{ width: 22, height: 22, objectFit: 'contain' }}
          />
          <span>
            {formatModuleName(activeModule)} · {activeSubitem || 'Inicio'}
          </span>
        </h2>
      </div>

      {/* Contenido dinámico del submódulo activo */}
      <div className="main-content-viewport" style={{ flex: 1, marginTop: 8 }}>
        {renderContent()}
      </div>
    </main>
  )
}

export default ContenedorMainContent
