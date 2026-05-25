"use strict";
const common_vendor = require("../../common/vendor.js");
const api_product = require("../../api/product.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      searched: false,
      products: [],
      history: [],
      loading: false,
      defaultImg: "/static/images/default-product.png"
    };
  },
  onLoad() {
    const h = common_vendor.index.getStorageSync("searchHistory");
    if (h)
      this.history = JSON.parse(h);
  },
  methods: {
    doSearch() {
      if (!this.keyword.trim())
        return;
      this.searched = true;
      this.loading = true;
      this.products = [];
      if (!this.history.includes(this.keyword)) {
        this.history.unshift(this.keyword);
        if (this.history.length > 10)
          this.history.pop();
        common_vendor.index.setStorageSync("searchHistory", JSON.stringify(this.history));
      }
      api_product.productApi.searchProduct(this.keyword).then((res) => {
        if (res.code === 200)
          this.products = res.data.records || [];
      }).finally(() => {
        this.loading = false;
      });
    },
    searchHistory(kw) {
      this.keyword = kw;
      this.doSearch();
    },
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    b: $data.keyword,
    c: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    d: $data.keyword
  }, $data.keyword ? {
    e: common_vendor.o(($event) => $data.keyword = "")
  } : {}, {
    f: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    g: !$data.searched && $data.history.length > 0
  }, !$data.searched && $data.history.length > 0 ? {
    h: common_vendor.o(($event) => $data.history = []),
    i: common_vendor.f($data.history, (kw, idx, i0) => {
      return {
        a: common_vendor.t(kw),
        b: idx,
        c: common_vendor.o(($event) => $options.searchHistory(kw), idx)
      };
    })
  } : {}, {
    j: $data.searched
  }, $data.searched ? common_vendor.e({
    k: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: item.coverImage || $data.defaultImg,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.sales || 0),
        e: item.id,
        f: common_vendor.o(($event) => $options.goDetail(item.id), item.id)
      };
    }),
    l: $data.loading
  }, $data.loading ? {} : {}, {
    m: !$data.loading && $data.products.length === 0
  }, !$data.loading && $data.products.length === 0 ? {} : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
