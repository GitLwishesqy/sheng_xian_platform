<template>
  <div v-loading="loading">
    <el-card v-if="order.orderNo">
      <template #header>订单详情 — {{ order.orderNo }}</template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单状态">
          <el-tag :type="statusType(order.orderStatus)">{{ statusText(order.orderStatus) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="配送方式">{{ order.deliveryType === 1 ? '配送到家' : '到店自提' }}</el-descriptions-item>
        <el-descriptions-item label="商品总额">¥{{ order.totalAmount }}</el-descriptions-item>
        <el-descriptions-item label="配送费">¥{{ order.deliveryFee || 0 }}</el-descriptions-item>
        <el-descriptions-item label="优惠金额">¥{{ order.discountAmount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="实付金额"><span style="color:#ee0a24;font-weight:bold;font-size:18px">¥{{ order.payAmount }}</span></el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ order.paymentTime || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ order.remark || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider>商品明细</el-divider>
      <el-table :data="order.items || []" stripe size="small">
        <el-table-column label="商品图" width="80">
          <template #default="{ row }">
            <el-image :src="row.productImage" style="width:50px;height:50px;border-radius:4px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="160" />
        <el-table-column prop="specInfo" label="规格" width="120" />
        <el-table-column prop="price" label="单价" width="80" />
        <el-table-column prop="quantity" label="数量" width="60" />
        <el-table-column prop="totalAmount" label="小计" width="100" />
      </el-table>

      <div style="margin-top:20px">
        <el-button @click="$router.back()">返回</el-button>
        <el-button v-if="order.orderStatus === 2" type="success" @click="handleDelivery">确认发货</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import orderApi from '@/api/order'

const route = useRoute()
const loading = ref(false)
const order = ref({})

function statusText(s) { const m={1:'待付款',2:'待发货',3:'已发货',4:'已签收',5:'已完成',6:'已取消',7:'退款中',8:'已退款'}; return m[s]||'未知' }
function statusType(s) { const m={1:'warning',2:'primary',3:'success',4:'info',5:'info',6:'danger'}; return m[s]||'info' }

onMounted(async () => {
  loading.value = true
  const res = await orderApi.getOrderDetail(route.params.id)
  if (res.code === 200) order.value = res.data
  loading.value = false
})

async function handleDelivery() {
  await orderApi.deliveryOrder(order.value.id)
  ElMessage.success('已发货')
  order.value.orderStatus = 3
}
</script>
