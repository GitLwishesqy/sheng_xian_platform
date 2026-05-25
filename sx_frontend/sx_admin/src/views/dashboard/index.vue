<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in cards" :key="card.title">
        <el-card shadow="hover" class="stat-card">
          <div class="card-inner">
            <div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-title">{{ card.title }}</div>
            </div>
            <el-icon :size="48" :color="card.color"><component :is="card.icon" /></el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="16">
        <el-card>
          <template #header>最近订单</template>
          <el-table :data="recentOrders" stripe size="small">
            <el-table-column prop="orderNo" label="订单号" width="200" />
            <el-table-column prop="payAmount" label="金额" width="100" />
            <el-table-column prop="orderStatus" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusType(row.orderStatus)" size="small">{{ statusText(row.orderStatus) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>快捷操作</template>
          <div class="quick-actions">
            <el-button type="success" @click="$router.push('/product/edit')">新增商品</el-button>
            <el-button type="primary" @click="$router.push('/order')">查看订单</el-button>
            <el-button @click="$router.push('/banner')">管理Banner</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import orderApi from '@/api/order'
import productApi from '@/api/product'

const cards = ref([
  { title: '商品总数', value: 0, icon: 'Goods', color: '#409EFF' },
  { title: '今日订单', value: 0, icon: 'Document', color: '#67C23A' },
  { title: '用户总数', value: 0, icon: 'User', color: '#E6A23C' },
  { title: '本月销售额', value: '¥0', icon: 'Money', color: '#F56C6C' }
])
const recentOrders = ref([])

function statusText(s) {
  const map = { 1:'待付款', 2:'待发货', 3:'待收货', 4:'已签收', 5:'已完成', 6:'已取消' }
  return map[s] || '未知'
}
function statusType(s) {
  const map = { 1:'warning', 2:'primary', 3:'success', 4:'info', 5:'info', 6:'danger' }
  return map[s] || 'info'
}

onMounted(async () => {
  try {
    const [prodRes, orderRes] = await Promise.all([
      productApi.getProductList({ page: 1, pageSize: 1 }),
      orderApi.getOrderList({ page: 1, pageSize: 5 })
    ])
    if (prodRes.code === 200) cards.value[0].value = prodRes.data.total || 0
    if (orderRes.code === 200) {
      recentOrders.value = orderRes.data.records || []
    }
  } catch (e) { /* ignore */ }
})
</script>

<style scoped>
.stat-card .card-inner { display: flex; justify-content: space-between; align-items: center; }
.card-value { font-size: 28px; font-weight: bold; color: #333; }
.card-title { font-size: 14px; color: #999; margin-top: 5px; }
.quick-actions { display: flex; flex-direction: column; gap: 10px; }
.quick-actions .el-button { width: 100%; margin-left: 0; }
</style>
