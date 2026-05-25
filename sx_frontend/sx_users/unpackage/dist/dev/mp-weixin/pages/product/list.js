"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const stores_cart = require("../../stores/cart.js");
const _sfc_main = {
  data() {
    return {
      categoryId: "",
      keyword: "",
      sortType: 0,
      sortAsc: true,
      products: [],
      page: 1,
      loading: false,
      noMore: false,
      scrollH: 600,
      defaultImg: "/static/images/default-product.png"
    };
  },
  onLoad(options) {
    if (options.categoryId)
      this.categoryId = options.categoryId;
    if (options.keyword)
      this.keyword = options.keyword;
    if (options.title)
      common_vendor.index.setNavigationBarTitle({ title: options.title });
    const sys = common_vendor.index.getSystemInfoSync();
    this.scrollH = sys.windowHeight - 44;
    this.loadProducts();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.noMore = false;
    this.products = [];
    this.loadProducts().then(() => common_vendor.index.stopPullDownRefresh());
  },
  methods: {
    async loadProducts() {
      if (this.loading || this.noMore)
        return;
      this.loading = true;
      try {
        const params = { page: this.page, pageSize: 20 };
        if (this.categoryId)
          params.categoryId = this.categoryId;
        if (this.keyword)
          params.keyword = this.keyword;
        if (this.sortType === 1)
          params.sortField = "sales";
        if (this.sortType === 2) {
          params.sortField = "price";
          params.sortOrder = this.sortAsc ? "asc" : "desc";
        }
        const res = this.keyword ? await api_product.productApi.searchProduct(this.keyword, { page: this.page, pageSize: 20 }) : await api_product.productApi.getProductList(params);
        if (res.code === 200) {
          const data = res.data;
          this.products = this.page === 1 ? data.records : [...this.products, ...data.records];
          this.noMore = data.records.length < 20;
        }
      } finally {
        this.loading = false;
      }
    },
    setSort(type) {
      if (type === 2 && this.sortType === 2) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortType = type;
        this.sortAsc = true;
      }
      this.page = 1;
      this.noMore = false;
      this.products = [];
      this.loadProducts();
    },
    loadMore() {
      this.page++;
      this.loadProducts();
    },
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    },
    addCart(item) {
      stores_cart.useCartStore().addToCart({ productId: item.id, quantity: 1 }).then(() => {
        common_vendor.index.showToast({ title: "已加入购物车", icon: "success" });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($data.sortType === 0 ? "active" : ""),
    b: common_vendor.o(($event) => $options.setSort(0)),
    c: common_vendor.n($data.sortType === 1 ? "active" : ""),
    d: common_vendor.o(($event) => $options.setSort(1)),
    e: $data.sortType === 2
  }, $data.sortType === 2 ? {
    f: common_vendor.t($data.sortAsc ? "↑" : "↓")
  } : {}, {
    g: common_vendor.n($data.sortType === 2 ? "active" : ""),
    h: common_vendor.o(($event) => $options.setSort(2)),
    i: common_vendor.f($data.products, (item, k0, i0) => {
      return common_vendor.e({
        a: item.coverImage || $data.defaultImg,
        b: common_vendor.t(item.name),
        c: item.storageCondition
      }, item.storageCondition ? {
        d: common_vendor.t(item.storageCondition)
      } : {}, {
        e: common_vendor.t(item.price),
        f: item.originalPrice
      }, item.originalPrice ? {
        g: common_vendor.t(item.originalPrice)
      } : {}, {
        h: common_vendor.o(($event) => $options.addCart(item), item.id),
        i: item.id,
        j: common_vendor.o(($event) => $options.goDetail(item.id), item.id)
      });
    }),
    j: $data.loading
  }, $data.loading ? {} : {}, {
    k: $data.noMore
  }, $data.noMore ? {} : {}, {
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    m: $data.scrollH + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e958a167"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/list.js.map
