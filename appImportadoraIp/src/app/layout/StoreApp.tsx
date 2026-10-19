import { Provider } from 'react-redux'
import { store } from '@/app/store/store'
import '@/app/store/store.css'

import { AppHeader } from '@/app/componentApp/header/AppHeader'
import { SideMenuLateral } from '@/app/componentApp/sideMenu/SideMenu'
import { ContenedorMainContent } from '@/app/componentApp/contentMain/ContenedorMainContent'
import { DrawerLateralDerecho } from '@/app/componentApp/drawerRigth/DrawerRight'

export function StoreApp() {
  return (
    <Provider store={store}>
      <div className="store-app-layout">
        {/* Barra Superior */}
        <AppHeader />

        {/* Cuerpo del Layout con los 3 bloques estructurales */}
        <div className="store-app-body">
          {/* Menú lateral izquierdo (340px) */}
          <SideMenuLateral />

          {/* Lienzo central flexible (flex-1) */}
          <ContenedorMainContent />

          {/* Panel lateral derecho desplegable */}
          <DrawerLateralDerecho />
        </div>
      </div>
    </Provider>
  )
}

export default StoreApp
