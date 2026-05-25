"use strict";
const common_vendor = require("../../common/vendor.js");
const api_home = require("../../api/home.js");
const api_product = require("../../api/product.js");
const common_categoryIcons = require("../../common/categoryIcons.js");
const _sfc_main = {
  setup() {
    return { getCategoryIcon: common_categoryIcons.getCategoryIcon, getCategoryEmoji: common_categoryIcons.getCategoryEmoji };
  },
  data() {
    return {
      banners: [],
      categories: [],
      products: [],
      defaultImg: "/static/images/default-product.png",
      iconErrors: {}
      // 记录图片加载失败的分类
    };
  },
  onShow() {
    this.loadData();
  },
  onPullDownRefresh() {
    this.loadData().then(() => common_vendor.index.stopPullDownRefresh());
  },
  methods: {
    async loadData() {
      try {
        const [bannerRes, cateRes, prodRes] = await Promise.all([
          api_home.homeApi.getBanners(),
          api_product.productApi.getCategoryList(true),
          api_home.homeApi.getRecommendProducts()
        ]);
        if (bannerRes.code === 200)
          this.banners = bannerRes.data || [];
        if (cateRes.code === 200)
          this.categories = (cateRes.data || []).slice(0, 8);
        if (prodRes.code === 200)
          this.products = prodRes.data && prodRes.data.records || [];
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:93", "首页加载失败", e);
      }
    },
    getIcon(name) {
      return common_categoryIcons.getCategoryIcon(name);
    },
    getEmoji(name) {
      return common_categoryIcons.getCategoryEmoji(name);
    },
    onIconError(name) {
      this.iconErrors[name] = true;
    },
    goSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/search" });
    },
    goDetail(id) {
      common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + id });
    },
    goProductList() {
      common_vendor.index.navigateTo({ url: "/pages/product/list" });
    },
    goCategory(item) {
      common_vendor.index.navigateTo({ url: "/pages/product/list?categoryId=" + item.id + "&title=" + item.name });
    },
    onBannerClick(item) {
      if (item.linkType === 1 && item.linkValue) {
        common_vendor.index.navigateTo({ url: "/pages/product/detail?id=" + item.linkValue });
      } else if (item.linkType === 2 && item.linkValue) {
        common_vendor.index.navigateTo({ url: "/pages/product/list?categoryId=" + item.linkValue });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goSearch && $options.goSearch(...args)),
    b: $data.banners.length
  }, $data.banners.length ? {
    c: common_vendor.f($data.banners, (item, k0, i0) => {
      return {
        a: item.image,
        b: item.id,
        c: common_vendor.o(($event) => $options.onBannerClick(item), item.id)
      };
    })
  } : {}, {
    d: $data.categories.length
  }, $data.categories.length ? {
    e: common_vendor.f($data.categories, (item, k0, i0) => {
      return common_vendor.e({
        a: !$data.iconErrors[item.name]
      }, !$data.iconErrors[item.name] ? {
        b: $options.getIcon(item.name),
        c: common_vendor.o(($event) => $options.onIconError(item.name), item.id)
      } : {
        d: common_vendor.t($options.getEmoji(item.name))
      }, {
        e: common_vendor.t(item.name),
        f: item.id,
        g: common_vendor.o(($event) => $options.goCategory(item), item.id)
      });
    })
  } : {}, {
    f: common_vendor.o((...args) => $options.goProductList && $options.goProductList(...args)),
    g: $data.products.length
  }, $data.products.length ? {
    h: common_vendor.f($data.products, (item, k0, i0) => {
      return {
        a: item.coverImage || $data.defaultImg,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: common_vendor.t(item.sales || 0),
        e: item.id,
        f: common_vendor.o(($event) => $options.goDetail(item.id), item.id)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
