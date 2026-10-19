// src/app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit'
import { navigationReducer } from '@/features/navigation'
import shopReducer from '@/features/shop/slices/shop.slice'
import { carteraReducer } from '@/features/cartera'
// import cajaReducer from '@/features/caja/slices/caja.slice'

export const rootReducer = combineReducers({
    ui: navigationReducer,
    shop: shopReducer,
    cartera: carteraReducer,
})
