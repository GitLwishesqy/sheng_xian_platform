import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cartApi from '@/api/cart.js'

export const useCartStore = defineStore('cart', () => {
    const cartList = ref([])
    const cartCount = computed(() => cartList.value.length)

    async function fetchCartList() {
        try {
            const res = await cartApi.getCartList()
            if (res.code === 200) {
                cartList.value = res.data || []
            }
        } catch (e) {
            console.error('获取购物车失败', e)
        }
    }

    async function addToCart(data) {
        const res = await cartApi.addToCart(data)
        if (res.code === 200) {
            await fetchCartList()
        }
        return res
    }

    async function updateQuantity(id, quantity) {
        await cartApi.updateQuantity(id, quantity)
        const item = cartList.value.find(i => i.id === id)
        if (item) item.quantity = quantity
    }

    async function toggleSelect(id, selected) {
        await cartApi.toggleSelect(id, selected)
        const item = cartList.value.find(i => i.id === id)
        if (item) item.selected = selected
    }

    async function selectAll(selected) {
        await cartApi.selectAll(selected)
        cartList.value.forEach(i => i.selected = selected)
    }

    async function removeItem(id) {
        await cartApi.removeItem(id)
        cartList.value = cartList.value.filter(i => i.id !== id)
    }

    async function clearCart() {
        await cartApi.clearCart()
        cartList.value = []
    }

    const selectedItems = computed(() => cartList.value.filter(i => i.selected))
    const totalPrice = computed(() => {
        return selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
    })
    const isAllSelected = computed(() => {
        return cartList.value.length > 0 && cartList.value.every(i => i.selected)
    })

    return { cartList, cartCount, selectedItems, totalPrice, isAllSelected,
             fetchCartList, addToCart, updateQuantity, toggleSelect, selectAll, removeItem, clearCart }
})
