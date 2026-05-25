<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openDialog()" style="margin-bottom:16px">新增分类</el-button>
      <el-table :data="tableData" stripe row-key="id" v-loading="loading"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" default-expand-all>
        <el-table-column prop="name" label="分类名称" min-width="160" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '显示' : '隐藏' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-button type="success" link @click="openDialog({ parentId: row.id })">添加子分类</el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑分类' : '新增分类'" width="500px">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="父分类">
          <el-tree-select v-model="dialogForm.parentId" :data="tableData" :props="{ label: 'name', value: 'id' }"
            check-strictly placeholder="不选即为顶级分类" clearable style="width:100%" />
        </el-form-item>
        <el-form-item label="名称"><el-input v-model="dialogForm.name" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="dialogForm.sort" :min="0" /></el-form-item>
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
import productApi from '@/api/product'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogForm = reactive({ id: null, parentId: null, name: '', sort: 0, status: 1 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  try {
    const res = await productApi.getCategoryList()
    if (res.code === 200) tableData.value = res.data || []
  } finally { loading.value = false }
}

function openDialog(row) {
  if (row && row.id) {
    Object.assign(dialogForm, { id: row.id, parentId: row.parentId || null, name: row.name, sort: row.sort, status: row.status })
  } else if (row && row.parentId) {
    Object.assign(dialogForm, { id: null, parentId: row.parentId, name: '', sort: 0, status: 1 })
  } else {
    Object.assign(dialogForm, { id: null, parentId: null, name: '', sort: 0, status: 1 })
  }
  dialogVisible.value = true
}

async function handleSave() {
  if (dialogForm.id) {
    await productApi.updateCategory(dialogForm.id, dialogForm)
    ElMessage.success('修改成功')
  } else {
    await productApi.addCategory(dialogForm)
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
  loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除？子分类也会被删除', '提示', { type: 'warning' })
  await productApi.deleteCategory(id)
  ElMessage.success('删除成功')
  loadData()
}
</script>
