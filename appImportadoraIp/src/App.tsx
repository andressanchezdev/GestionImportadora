import React from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import StoreApp from '@/app/store/store'

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
