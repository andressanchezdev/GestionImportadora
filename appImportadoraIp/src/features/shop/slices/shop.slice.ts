import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Product, PriceLevelKey } from '../types/shop.types'
import { INITIAL_SHOP_STATE } from '../constants/shop.constants'

export const shopSlice = createSlice({
    name: 'shop',
    initialState: INITIAL_SHOP_STATE,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.searchQuery = action.payload
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.filters.selectedCategory = action.payload
        },
        setSelectedBrand: (state, action: PayloadAction<string>) => {
            state.filters.selectedBrand = action.payload
        },
        setOnlyInStock: (state, action: PayloadAction<boolean>) => {
            state.filters.onlyInStock = action.payload
        },
        setPriceLevel: (state, action: PayloadAction<PriceLevelKey>) => {
            state.filters.priceLevel = action.payload
        },
        resetFilters: (state) => {
            state.filters = {
                ...INITIAL_SHOP_STATE.filters,
                priceLevel: state.filters.priceLevel, // conserva el nivel de precio seleccionado
            }
        },
        addToCart: (
            state,
            action: PayloadAction<{
                product: Product
                quantity: number
                priceLevel?: PriceLevelKey
            }>
        ) => {
            const { product, quantity } = action.payload
            const level = action.payload.priceLevel ?? state.filters.priceLevel
            const priceKey = level.toLowerCase() as keyof typeof product.prices
            const unitPrice = product.prices[priceKey]

            const existingIndex = state.cart.findIndex(
                (item) => item.productId === product.id && item.priceLevel === level
            )

            if (existingIndex >= 0) {
                const existing = state.cart[existingIndex]
                existing.quantity += quantity
                existing.subtotal = existing.quantity * existing.selectedPrice
            } else {
                state.cart.push({
                    productId: product.id,
                    product,
                    quantity,
                    selectedPrice: unitPrice,
                    priceLevel: level,
                    subtotal: quantity * unitPrice,
                })
            }
        },
        updateCartQuantity: (
            state,
            action: PayloadAction<{ productId: string; quantity: number }>
        ) => {
            const { productId, quantity } = action.payload
            if (quantity <= 0) {
                state.cart = state.cart.filter((item) => item.productId !== productId)
            } else {
                const item = state.cart.find((i) => i.productId === productId)
                if (item) {
                    item.quantity = quantity
                    item.subtotal = quantity * item.selectedPrice
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter((item) => item.productId !== action.payload)
        },
        clearCart: (state) => {
            state.cart = []
        },
        toggleCartDrawer: (state) => {
            state.isCartDrawerOpen = !state.isCartDrawerOpen
        },
        setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isCartDrawerOpen = action.payload
        },
        setSelectedProductId: (state, action: PayloadAction<string | null>) => {
            state.selectedProductId = action.payload
        },
    },
})

export const {
    setSearchQuery,
    setSelectedCategory,
    setSelectedBrand,
    setOnlyInStock,
    setPriceLevel,
    resetFilters,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleCartDrawer,
    setCartDrawerOpen,
    setSelectedProductId,
} = shopSlice.actions

export default shopSlice.reducer
