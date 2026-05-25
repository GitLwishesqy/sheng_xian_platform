"use strict";
const common_vendor = require("../common/vendor.js");
const api_cart = require("../api/cart.js");
const useCartStore = common_vendor.defineStore("cart", () => {
  const cartList = common_vendor.ref([]);
  const cartCount = common_vendor.computed(() => cartList.value.length);
  async function fetchCartList() {
    try {
      const res = await api_cart.cartApi.getCartList();
      if (res.code === 200) {
        cartList.value = res.data || [];
      }
    } catch (e) {
      common_vendor.index.__f__("error", "at stores/cart.js:16", "获取购物车失败", e);
    }
  }
  async function addToCart(data) {
    const res = await api_cart.cartApi.addToCart(data);
    if (res.code === 200) {
      await fetchCartList();
    }
    return res;
  }
  async function updateQuantity(id, quantity) {
    await api_cart.cartApi.updateQuantity(id, quantity);
    const item = cartList.value.find((i) => i.id === id);
    if (item)
      item.quantity = quantity;
  }
  async function toggleSelect(id, selected) {
    await api_cart.cartApi.toggleSelect(id, selected);
    const item = cartList.value.find((i) => i.id === id);
    if (item)
      item.selected = selected;
  }
  async function selectAll(selected) {
    await api_cart.cartApi.selectAll(selected);
    cartList.value.forEach((i) => i.selected = selected);
  }
  async function removeItem(id) {
    await api_cart.cartApi.removeItem(id);
    cartList.value = cartList.value.filter((i) => i.id !== id);
  }
  async function clearCart() {
    await api_cart.cartApi.clearCart();
    cartList.value = [];
  }
  const selectedItems = common_vendor.computed(() => cartList.value.filter((i) => i.selected));
  const totalPrice = common_vendor.computed(() => {
    return selectedItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0);
  });
  const isAllSelected = common_vendor.computed(() => {
    return cartList.value.length > 0 && cartList.value.every((i) => i.selected);
  });
  return {
    cartList,
    cartCount,
    selectedItems,
    totalPrice,
    isAllSelected,
    fetchCartList,
    addToCart,
    updateQuantity,
    toggleSelect,
    selectAll,
    removeItem,
    clearCart
  };
});
exports.useCartStore = useCartStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/cart.js.map
