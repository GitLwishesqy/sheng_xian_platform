"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const stores_cart = require("../../stores/cart.js");
const common_icons = require("../../common/icons.js");
const _sfc_main = {
  setup() {
    return { ICON: common_icons.ICON };
  },
  data() {
    return {
      id: "",
      product: {},
      skuList: [],
      selectedSkuId: null,
      skuPrice: null,
      skuStock: null,
      reviews: [],
      reviewCount: 0,
      defaultImg: "/static/images/default-product.png"
    };
  },
  computed: {
    imgList() {
      if (!this.product.images)
        return [];
      try {
        return typeof this.product.images === "string" ? JSON.parse(this.product.images) : this.product.images;
      } catch {
        return [];
      }
    },
    cartCount() {
      return stores_cart.useCartStore().cartCount;
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.loadData();
    }
  },
  methods: {
    async loadData() {
      try {
        const res = await api_product.productApi.getProductDetail(this.id);
        if (res.code === 200) {
          this.product = res.data;
          if (res.data.skuList)
            this.skuList = res.data.skuList;
        }
        const revRes = await api_product.productApi.getProductReviews(this.id, { page: 1, pageSize: 3 });
        if (revRes.code === 200) {
          this.reviews = revRes.data.records || [];
          this.reviewCount = revRes.data.total || 0;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/product/detail.vue:129", "加载商品详情失败", e);
      }
    },
    selectSku(sku) {
      this.selectedSkuId = sku.id;
      this.skuPrice = sku.price;
      this.skuStock = sku.stock;
    },
    addToCart() {
      const data = { productId: this.product.id, quantity: 1 };
      if (this.selectedSkuId)
        data.skuId = this.selectedSkuId;
      stores_cart.useCartStore().addToCart(data).then(() => {
        common_vendor.index.showToast({ title: "已加入购物车", icon: "success" });
      });
    },
    buyNow() {
      const data = { productId: this.product.id, quantity: 1 };
      if (this.selectedSkuId)
        data.skuId = this.selectedSkuId;
      const items = [data];
      common_vendor.index.navigateTo({ url: "/pages/order/confirm?items=" + encodeURIComponent(JSON.stringify(items)) });
    },
    goCart() {
      common_vendor.index.switchTab({ url: "/pages/cart/cart" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.product.name
  }, $data.product.name ? common_vendor.e({
    b: $options.imgList.length > 1
  }, $options.imgList.length > 1 ? {
    c: common_vendor.f($options.imgList, (url, i, i0) => {
      return {
        a: url,
        b: i
      };
    })
  } : {
    d: $options.imgList.length === 1 ? $options.imgList[0] : $data.product.coverImage || $data.defaultImg
  }, {
    e: common_vendor.t($data.skuPrice || $data.product.price),
    f: $data.product.originalPrice
  }, $data.product.originalPrice ? {
    g: common_vendor.t($data.product.originalPrice)
  } : {}, {
    h: common_vendor.t($data.product.name),
    i: $data.product.subtitle
  }, $data.product.subtitle ? {
    j: common_vendor.t($data.product.subtitle)
  } : {}, {
    k: common_vendor.t($data.product.sales || 0),
    l: common_vendor.t($data.skuStock !== null ? $data.skuStock : $data.product.stock),
    m: $data.product.unit
  }, $data.product.unit ? {
    n: common_vendor.t($data.product.unit)
  } : {}, {
    o: $data.product.storageCondition
  }, $data.product.storageCondition ? common_vendor.e({
    p: common_vendor.t($data.product.storageCondition),
    q: $data.product.shelfLife
  }, $data.product.shelfLife ? {
    r: common_vendor.t($data.product.shelfLife)
  } : {}) : {}, {
    s: $data.skuList.length > 0
  }, $data.skuList.length > 0 ? {
    t: common_vendor.f($data.skuList, (sku, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(sku.specValue),
        b: common_vendor.t(sku.specName ? " " + sku.specName : ""),
        c: sku.price !== $data.product.price
      }, sku.price !== $data.product.price ? {
        d: common_vendor.t(sku.price)
      } : {}, {
        e: sku.id,
        f: common_vendor.n($data.selectedSkuId === sku.id ? "active" : ""),
        g: common_vendor.o(($event) => $options.selectSku(sku), sku.id)
      });
    })
  } : {}, {
    v: $data.product.detail
  }, $data.product.detail ? {
    w: $data.product.detail
  } : {}, {
    x: common_vendor.t($data.reviewCount),
    y: $data.reviews.length === 0
  }, $data.reviews.length === 0 ? {} : {}, {
    z: common_vendor.f($data.reviews, (rv, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(rv.userId),
        b: common_vendor.t("★".repeat(rv.rating)),
        c: common_vendor.t("☆".repeat(5 - rv.rating)),
        d: rv.content
      }, rv.content ? {
        e: common_vendor.t(rv.content)
      } : {}, {
        f: rv.id
      });
    }),
    A: $setup.ICON.cart,
    B: $options.cartCount
  }, $options.cartCount ? {
    C: common_vendor.t($options.cartCount)
  } : {}, {
    D: common_vendor.o((...args) => $options.goCart && $options.goCart(...args)),
    E: common_vendor.o((...args) => $options.addToCart && $options.addToCart(...args)),
    F: common_vendor.o((...args) => $options.buyNow && $options.buyNow(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-acf502d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/detail.js.map
