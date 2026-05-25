"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const stores_cart = require("../../stores/cart.js");
const _sfc_main = {
  data() {
    return {
      categories: [],
      subCategories: [],
      currentId: 0,
      products: [],
      page: 1,
      loading: false,
      noMore: false,
      defaultImg: "/static/images/default-product.png"
    };
  },
  onLoad() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      const res = await api_product.productApi.getCategoryList();
      if (res.code === 200) {
        this.categories = (res.data || []).filter((c) => !c.parentId || c.parentId === 0);
        if (this.categories.length > 0)
          this.switchCategory(this.categories[0]);
      }
    },
    async switchCategory(item) {
      this.currentId = item.id;
      this.page = 1;
      this.noMore = false;
      this.products = [];
      const res = await api_product.productApi.getCategoryList();
      if (res.code === 200) {
        this.subCategories = (res.data || []).filter((c) => c.parentId === item.id);
      }
      this.loadProducts();
    },
    async loadProducts() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const res = await api_product.productApi.getProductList({
          categoryId: this.currentId,
          page: this.page,
          pageSize: 20
        });
        if (res.code === 200) {
          const data = res.data;
          this.products = this.page === 1 ? data.records : [...this.products, ...data.records];
          this.noMore = data.records.length < 20;
        }
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.page++;
      this.loadProducts();
    },
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    },
    addCart(item) {
      const cartStore = stores_cart.useCartStore();
      cartStore.addToCart({ productId: item.id, quantity: 1 }).then(() => {
        common_vendor.index.showToast({ title: "已加入购物车", icon: "success" });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categories, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: item.id,
        c: common_vendor.n($data.currentId === item.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchCategory(item), item.id)
      };
    }),
    b: $data.subCategories.length
  }, $data.subCategories.length ? {
    c: common_vendor.f($data.subCategories, (sub, k0, i0) => {
      return {
        a: common_vendor.t(sub.name),
        b: sub.id,
        c: common_vendor.n($data.currentId === sub.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.switchCategory(sub), sub.id)
      };
    })
  } : {}, {
    d: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: item.coverImage || $data.defaultImg,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.o(($event) => $options.addCart(item), item.id),
        e: item.id,
        f: common_vendor.o(($event) => $options.goDetail(item.id), item.id)
      };
    }),
    e: $data.products.length === 0
  }, $data.products.length === 0 ? {} : {}, {
    f: $data.loading
  }, $data.loading ? {} : {}, {
    g: $data.noMore
  }, $data.noMore ? {} : {}, {
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8145b772"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/category.js.map
