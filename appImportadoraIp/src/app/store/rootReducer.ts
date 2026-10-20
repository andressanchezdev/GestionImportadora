// rootReducer · junta los reducers de cada feature (ui, shop, wallet, auth, realtime)
// conecta con: features/*/index, app/store/store
// src/app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import { navigationReducer } from '@/features/navigation'
import { shopReducer } from '@/features/shop'
import { walletReducer } from '@/features/wallet'
import { authReducer } from '@/features/auth'
import { realtimeReducer } from '@/features/realtime'
// import cajaReducer from '@/features/caja/slices/caja.slice'

export const rootReducer = combineReducers({
    ui: navigationReducer,
    shop: shopReducer,
    wallet: walletReducer,
    realtime: realtimeReducer, // estado de la conexión en tiempo real (no se persiste)
    auth: authReducer, // ojo: auth NO está en la whitelist de persistencia; su estado inicial se lee de la sesión guardada
})
