"use strict";
const iconMap = {
  "新鲜水果": "/static/images/fruit.png",
  "时令蔬菜": "/static/images/vege.png",
  "肉禽蛋品": "/static/images/meat.png",
  "海鲜水产": "/static/images/seafood.png",
  "乳品烘焙": "/static/images/milk.png",
  "休闲零食": "/static/images/snack.png",
  "水果": "/static/images/fruit.png",
  "蔬菜": "/static/images/vege.png",
  "肉类": "/static/images/meat.png",
  "禽蛋": "/static/images/meat.png",
  "海鲜": "/static/images/seafood.png",
  "乳品": "/static/images/milk.png",
  "烘焙": "/static/images/milk.png",
  "零食": "/static/images/snack.png",
  "坚果": "/static/images/snack.png"
};
const defaultIcon = "/static/images/fruit.png";
function getCategoryIcon(name) {
  if (!name)
    return defaultIcon;
  return iconMap[name] || defaultIcon;
}
function getCategoryEmoji(name) {
  const emojiMap = {
    "新鲜水果": "🍎",
    "水果": "🍎",
    "时令蔬菜": "🥬",
    "蔬菜": "🥬",
    "肉禽蛋品": "🥩",
    "肉类": "🥩",
    "禽蛋": "🥚",
    "海鲜水产": "🦐",
    "海鲜": "🦐",
    "乳品烘焙": "🥛",
    "乳品": "🥛",
    "烘焙": "🍞",
    "休闲零食": "🍪",
    "零食": "🍪",
    "坚果": "🥜"
  };
  return emojiMap[name] || "🍎";
}
exports.getCategoryEmoji = getCategoryEmoji;
exports.getCategoryIcon = getCategoryIcon;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/categoryIcons.js.map
