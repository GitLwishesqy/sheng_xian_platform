"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_cart = require("../../stores/cart.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return { editMode: false, defaultImg: "/static/images/default-product.png" };
  },
  computed: {
    cartList() {
      return stores_cart.useCartStore().cartList;
    },
    selectedItems() {
      return stores_cart.useCartStore().selectedItems;
    },
    selectedCount() {
      return (stores_cart.useCartStore().selectedItems || []).length;
    },
    isAllSelected() {
      return stores_cart.useCartStore().isAllSelected;
    },
    totalPrice() {
      return stores_cart.useCartStore().totalPrice;
    }
  },
  onShow() {
    stores_cart.useCartStore().fetchCartList();
  },
  methods: {
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    },
    goHome() {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    },
    onCheck(item) {
      stores_cart.useCartStore().toggleSelect(item.id, item.selected ? 0 : 1);
    },
    onCheckAll() {
      stores_cart.useCartStore().selectAll(this.isAllSelected ? 0 : 1);
    },
    increase(item) {
      stores_cart.useCartStore().updateQuantity(item.id, item.quantity + 1);
    },
    decrease(item) {
      if (item.quantity <= 1) {
        common_vendor.index.showModal({
          title: "提示",
          content: "确定删除该商品？",
          success: (res) => {
            if (res.confirm)
              stores_cart.useCartStore().removeItem(item.id);
          }
        });
      } else {
        stores_cart.useCartStore().updateQuantity(item.id, item.quantity - 1);
      }
    },
    deleteSelected() {
      if (this.selectedItems.length === 0)
        return;
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除选中商品？",
        success: (res) => {
          if (res.confirm)
            this.selectedItems.forEach((i) => stores_cart.useCartStore().removeItem(i.id));
        }
      });
    },
    goSettle() {
      const items = this.selectedItems.map((i) => ({
        productId: i.productId,
        skuId: i.skuId,
        quantity: i.quantity,
        price: i.price,
        productName: i.productName || "商品",
        productImage: i.productImage || "",
        specInfo: i.specInfo || ""
      }));
      common_vendor.index.navigateTo({ url: "/pages/order/confirm?items=" + encodeURIComponent(JSON.stringify(items)) });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.cartList.length > 0
  }, $options.cartList.length > 0 ? {
    b: common_vendor.t($data.editMode ? "完成" : "管理"),
    c: common_vendor.o(($event) => $data.editMode = !$data.editMode)
  } : {}, {
    d: $options.cartList.length > 0
  }, $options.cartList.length > 0 ? {
    e: common_vendor.f($options.cartList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.selected ? $setup.ICON.checked : $setup.ICON.unchecked,
        b: common_vendor.o(($event) => $options.onCheck(item), item.id),
        c: item.productImage || $data.defaultImg,
        d: common_vendor.o(($event) => $options.goDetail(item.productId), item.id),
        e: common_vendor.t(item.productName || "商品"),
        f: item.specInfo
      }, item.specInfo ? {
        g: common_vendor.t(item.specInfo)
      } : {}, {
        h: common_vendor.t(item.price),
        i: common_vendor.o(($event) => $options.decrease(item), item.id),
        j: common_vendor.t(item.quantity),
        k: common_vendor.o(($event) => $options.increase(item), item.id),
        l: item.id
      });
    })
  } : {
    f: $setup.ICON.cart,
    g: common_vendor.o((...args) => $options.goHome && $options.goHome(...args))
  }, {
    h: $options.cartList.length > 0
  }, $options.cartList.length > 0 ? common_vendor.e({
    i: $options.isAllSelected ? $setup.ICON.checked : $setup.ICON.unchecked,
    j: common_vendor.o((...args) => $options.onCheckAll && $options.onCheckAll(...args)),
    k: !$data.editMode
  }, !$data.editMode ? {
    l: common_vendor.t($options.totalPrice.toFixed(2))
  } : {}, {
    m: !$data.editMode
  }, !$data.editMode ? {
    n: common_vendor.t($options.selectedCount),
    o: common_vendor.o((...args) => $options.goSettle && $options.goSettle(...args)),
    p: $options.selectedItems.length === 0
  } : {
    q: common_vendor.t($options.selectedItems.length),
    r: common_vendor.o((...args) => $options.deleteSelected && $options.deleteSelected(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c91e7611"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/cart.js.map
