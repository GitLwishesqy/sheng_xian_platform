/**
 * 分类图标映射（前端管理，不依赖数据库）
 * 新增分类时在此文件中添加映射即可
 *
 * 使用方式：
 *   import { getCategoryIcon } from '@/common/categoryIcons.js'
 *   const icon = getCategoryIcon(categoryName)
 */

const iconMap = {
  '新鲜水果': '/static/images/fruit.png',
  '时令蔬菜': '/static/images/vege.png',
  '肉禽蛋品': '/static/images/meat.png',
  '海鲜水产': '/static/images/seafood.png',
  '乳品烘焙': '/static/images/milk.png',
  '休闲零食': '/static/images/snack.png',
  '水果': '/static/images/fruit.png',
  '蔬菜': '/static/images/vege.png',
  '肉类': '/static/images/meat.png',
  '禽蛋': '/static/images/meat.png',
  '海鲜': '/static/images/seafood.png',
  '乳品': '/static/images/milk.png',
  '烘焙': '/static/images/milk.png',
  '零食': '/static/images/snack.png',
  '坚果': '/static/images/snack.png',
  
}

const defaultIcon = '/static/images/fruit.png'

/**
 * 根据分类名称获取本地图标路径
 * @param {string} name - 分类名称
 * @returns {string} 图标路径
 */
export function getCategoryIcon(name) {
  if (!name) return defaultIcon
  return iconMap[name] || defaultIcon
}

/**
 * 根据分类名称获取emoji图标（图片加载失败时的fallback）
 * @param {string} name - 分类名称
 * @returns {string} emoji
 */
export function getCategoryEmoji(name) {
  const emojiMap = {
    '新鲜水果': '🍎', '水果': '🍎',
    '时令蔬菜': '🥬', '蔬菜': '🥬',
    '肉禽蛋品': '🥩', '肉类': '🥩', '禽蛋': '🥚',
    '海鲜水产': '🦐', '海鲜': '🦐',
    '乳品烘焙': '🥛', '乳品': '🥛', '烘焙': '🍞',
    '休闲零食': '🍪', '零食': '🍪', '坚果': '🥜',
  }
  return emojiMap[name] || '🍎'
}
