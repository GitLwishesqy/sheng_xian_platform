/**
 * 统一图标路径映射（图片路径实现，emoji仅作兜底）
 * 新增图标：在 static/images/icons/ 下放入对应文件，在此添加映射即可
 */

const BASE = '/static/images/'

export const ICON = {
  // 品牌logo
  logo: BASE + 'icon-logo.png',

  // 订单状态
  pendingPay: BASE + 'icon-pending-pay.png',
  pendingDelivery: BASE + 'icon-pending-delivery.png',
  shipped: BASE + 'icon-shipped.png',
  completed: BASE + 'icon-completed.png',
  cancelled: BASE + 'icon-cancelled.png',
  refunding: BASE + 'icon-refunding.png',

  // 功能入口
  cart: BASE + 'icon-cart.png',
  location: BASE + 'icon-location.png',
  coupon: BASE + 'icon-coupon.png',
  pickup: BASE + 'icon-pickup.png',
  logout: BASE + 'icon-logout.png',
  wechat: BASE + 'icon-wechat.png',
  address: BASE + 'icon-address.png',

  // 选择状态
  checked: BASE + 'icon-checked.png',
  unchecked: BASE + 'icon-unchecked.png',

  // 配送方式
  homeDelivery: BASE + 'icon-home-delivery.png',
  selfPickup: BASE + 'icon-self-pickup.png',
}

/**
 * 根据订单状态码获取对应图标路径
 */
export function getOrderStatusIcon(status) {
  const map = {
    1: ICON.pendingPay,
    2: ICON.pendingDelivery,
    3: ICON.shipped,
    4: ICON.completed,
    5: ICON.completed,
    6: ICON.cancelled,
    7: ICON.refunding,
  }
  return map[status] || ICON.pendingPay
}
