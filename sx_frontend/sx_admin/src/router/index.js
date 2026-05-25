import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DataAnalysis' }
      },
      {
        path: 'product',
        name: 'ProductList',
        component: () => import('@/views/product/list.vue'),
        meta: { title: '商品管理', icon: 'Goods' }
      },
      {
        path: 'product/edit/:id?',
        name: 'ProductEdit',
        component: () => import('@/views/product/edit.vue'),
        meta: { title: '商品编辑', hidden: true }
      },
      {
        path: 'category',
        name: 'CategoryList',
        component: () => import('@/views/category/list.vue'),
        meta: { title: '分类管理', icon: 'Menu' }
      },
      {
        path: 'order',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单管理', icon: 'Document' }
      },
      {
        path: 'order/detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: 'user',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'banner',
        name: 'BannerList',
        component: () => import('@/views/marketing/banner.vue'),
        meta: { title: 'Banner管理', icon: 'Picture' }
      },
      {
        path: 'coupon',
        name: 'CouponList',
        component: () => import('@/views/marketing/coupon.vue'),
        meta: { title: '优惠券管理', icon: 'Ticket' }
      },
      {
        path: 'system/user',
        name: 'SystemUser',
        component: () => import('@/views/system/user.vue'),
        meta: { title: '管理员管理', icon: 'Avatar' }
      },
      {
        path: 'system/role',
        name: 'SystemRole',
        component: () => import('@/views/system/role.vue'),
        meta: { title: '角色管理', icon: 'Key' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
