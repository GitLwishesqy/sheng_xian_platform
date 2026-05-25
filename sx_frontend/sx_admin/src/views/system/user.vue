<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openDialog()" style="margin-bottom:16px">新增管理员</el-button>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="nickname" label="姓名" width="140" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑管理员' : '新增管理员'" width="450px">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="dialogForm.username" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="dialogForm.nickname" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="dialogForm.phone" /></el-form-item>
        <el-form-item label="密码" v-if="!dialogForm.id">
          <el-input v-model="dialogForm.password" type="password" placeholder="留空不修改" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="dialogForm.status" :active-value="1" :inactive-value="0" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import systemApi from '@/api/system'

const loading = ref(false); const tableData = ref([]); const dialogVisible = ref(false)
const dialogForm = reactive({ id: null, username: '', nickname: '', phone: '', password: '', status: 1 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  const res = await systemApi.getAdminList()
  if (res.code === 200) tableData.value = res.data.records || res.data || []
  loading.value = false
}

function openDialog(row) {
  Object.assign(dialogForm, row ? { ...row, password: '' } : { id: null, username: '', nickname: '', phone: '', password: '', status: 1 })
  dialogVisible.value = true
}

async function handleSave() {
  if (dialogForm.id) {
    await systemApi.updateAdmin(dialogForm.id, dialogForm)
    ElMessage.success('修改成功')
  } else {
    await systemApi.addAdmin(dialogForm)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false; loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
}
</script>
