import React from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import StoreApp from '@/app/layout/StoreApp'


//aqui se centra el inicio de app, renderiza/carga store.tsx la cual es la base de la app 
//en store esta toda la logica, componentes, hooks, etc.
//en store.tsx se renderiza layout/layout.tsx la cual es la base de la app
//en layout.tsx se renderiza header/AppHeader.tsx, contentMain/ContenedorMainContent.tsx y sideMenu/SideMenu.tsx
export default function App() {
  return <StoreApp />
}

// Montaje directo en DOM
const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
