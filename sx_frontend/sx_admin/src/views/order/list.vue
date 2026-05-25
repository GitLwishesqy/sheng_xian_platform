<template>
  <div>
    <el-card>
      <div class="toolbar">
        <el-select v-model="search.orderStatus" placeholder="订单状态" clearable style="width:160px">
          <el-option label="待付款" :value="1" />
          <el-option label="待发货" :value="2" />
          <el-option label="已发货" :value="3" />
          <el-option label="已完成" :value="5" />
          <el-option label="已取消" :value="6" />
        </el-select>
        <el-input v-model="search.orderNo" placeholder="订单号" clearable style="width:200px;margin-left:10px" />
        <el-button type="success" @click="loadData" style="margin-left:10px">查询</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading" style="margin-top:16px">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="payAmount" label="实付金额" width="100" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="statusType(row.orderStatus)" size="small">{{ statusText(row.orderStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryType" label="配送方式" width="100">
          <template #default="{ row }">{{ row.deliveryType === 1 ? '配送到家' : '到店自提' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="$router.push('/order/detail/' + row.id)">详情</el-button>
            <el-button v-if="row.orderStatus === 2" type="success" link @click="handleDelivery(row)">发货</el-button>
            <el-button v-if="row.orderStatus === 1" type="danger" link @click="handleCancel(row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total"
        layout="total, prev, pager, next" @current-change="loadData"
        style="margin-top:16px;justify-content:flex-end" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import orderApi from '@/api/order'

const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref([])
const search = reactive({ orderStatus: '', orderNo: '' })

function statusText(s) { const m = { 1:'待付款',2:'待发货',3:'已发货',4:'已签收',5:'已完成',6:'已取消',7:'退款中',8:'已退款' }; return m[s]||'未知' }
function statusType(s) { const m = { 1:'warning',2:'primary',3:'success',4:'info',5:'info',6:'danger',7:'danger',8:'info' }; return m[s]||'info' }

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (search.orderStatus) params.orderStatus = search.orderStatus
    if (search.orderNo) params.orderNo = search.orderNo
    const res = await orderApi.getOrderList(params)
    if (res.code === 200) { tableData.value = res.data.records || []; total.value = res.data.total || 0 }
  } finally { loading.value = false }
}

async function handleDelivery(row) {
  await orderApi.deliveryOrder(row.id)
  ElMessage.success('已发货')
  loadData()
}

async function handleCancel(row) {
  await ElMessageBox.confirm('确定取消订单？', '提示', { type: 'warning' })
  await orderApi.cancelOrder(row.id)
  ElMessage.success('已取消')
  loadData()
}
</script>

<style scoped>
.toolbar { display: flex; align-items: center; }
</style>
