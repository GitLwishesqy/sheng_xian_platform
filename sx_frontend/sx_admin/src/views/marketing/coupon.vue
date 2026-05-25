<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openDialog()" style="margin-bottom:16px">创建优惠券</el-button>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">{{ row.type === 1 ? '满减' : row.type === 2 ? '折扣' : '现金' }}</template>
        </el-table-column>
        <el-table-column prop="discountValue" label="优惠值" width="80" />
        <el-table-column prop="minAmount" label="门槛" width="80" />
        <el-table-column label="领取/总量" width="100">
          <template #default="{ row }">{{ row.receivedCount }}/{{ row.totalCount }}</template>
        </el-table-column>
        <el-table-column prop="endTime" label="有效期至" width="170" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 1" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑优惠券' : '创建优惠券'" width="500px">
      <el-form :model="dialogForm" label-width="100px">
        <el-form-item label="名称"><el-input v-model="dialogForm.name" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="dialogForm.type" style="width:100%">
            <el-option label="满减券" :value="1" />
            <el-option label="折扣券" :value="2" />
            <el-option label="现金券" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="优惠值"><el-input-number v-model="dialogForm.discountValue" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="使用门槛"><el-input-number v-model="dialogForm.minAmount" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="发放总量"><el-input-number v-model="dialogForm.totalCount" :min="1" /></el-form-item>
        <el-form-item label="有效期">
          <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至"
            start-placeholder="开始" end-placeholder="结束" value-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import marketingApi from '@/api/marketing'

const loading = ref(false); const tableData = ref([]); const dialogVisible = ref(false); const dateRange = ref([])
const dialogForm = reactive({ id: null, name: '', type: 1, discountValue: 0, minAmount: 0, totalCount: 100, startTime: '', endTime: '', status: 1 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  const res = await marketingApi.getCouponList()
  if (res.code === 200) tableData.value = res.data || []
  loading.value = false
}

function openDialog(row) {
  if (row) {
    Object.assign(dialogForm, { ...row })
    dateRange.value = [row.startTime, row.endTime]
  } else {
    Object.assign(dialogForm, { id: null, name: '', type: 1, discountValue: 0, minAmount: 0, totalCount: 100, startTime: '', endTime: '', status: 1 })
    dateRange.value = []
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (dateRange.value.length === 2) {
    dialogForm.startTime = dateRange.value[0]
    dialogForm.endTime = dateRange.value[1]
  }
  if (dialogForm.id) { await marketingApi.updateCoupon(dialogForm.id, dialogForm); ElMessage.success('修改成功') }
  else { await marketingApi.addCoupon(dialogForm); ElMessage.success('创建成功') }
  dialogVisible.value = false; loadData()
}

async function toggleStatus(row) {
  const newStatus = row.status === 1 ? 0 : 1
  await marketingApi.toggleCouponStatus(row.id, newStatus)
  row.status = newStatus
  ElMessage.success(newStatus ? '已启用' : '已停用')
}
</script>
