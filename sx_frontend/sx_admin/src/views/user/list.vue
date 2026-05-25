<template>
  <div>
    <el-card>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">{{ row.gender === 1 ? '男' : row.gender === 2 ? '女' : '未知' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="170" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="toggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import userApi from '@/api/user'

const loading = ref(false); const page = ref(1); const pageSize = ref(20); const total = ref(0)
const tableData = ref([])
onMounted(() => loadData())

async function loadData() {
  loading.value = true
  const res = await userApi.getUserList({ page: page.value, pageSize: pageSize.value })
  if (res.code === 200) { tableData.value = res.data.records || []; total.value = res.data.total || 0 }
  loading.value = false
}

async function toggleStatus(row) {
  const newStatus = row.status === 1 ? 0 : 1
  await userApi.toggleUserStatus(row.id, newStatus)
  row.status = newStatus
  ElMessage.success(newStatus ? '已启用' : '已禁用')
}
</script>
