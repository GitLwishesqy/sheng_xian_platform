<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openDialog()" style="margin-bottom:16px">新增Banner</el-button>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column label="图片" width="200">
          <template #default="{ row }">
            <el-image :src="row.image" style="width:180px;height:80px;border-radius:8px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑Banner' : '新增Banner'" width="500px">
      <el-form :model="dialogForm" label-width="100px">
        <el-form-item label="标题"><el-input v-model="dialogForm.title" /></el-form-item>
        <el-form-item label="图片URL"><el-input v-model="dialogForm.image" /></el-form-item>
        <el-form-item label="链接类型">
          <el-select v-model="dialogForm.linkType" style="width:100%">
            <el-option label="无跳转" :value="0" />
            <el-option label="商品详情" :value="1" />
            <el-option label="分类" :value="2" />
            <el-option label="自定义URL" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接值"><el-input v-model="dialogForm.linkValue" placeholder="商品ID/分类ID/URL" /></el-form-item>
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
import marketingApi from '@/api/marketing'

const loading = ref(false); const tableData = ref([]); const dialogVisible = ref(false)
const dialogForm = reactive({ id: null, title: '', image: '', linkType: 0, linkValue: '', sort: 0, status: 1 })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  const res = await marketingApi.getBannerList()
  if (res.code === 200) tableData.value = res.data || []
  loading.value = false
}

function openDialog(row) {
  Object.assign(dialogForm, row ? { ...row } : { id: null, title: '', image: '', linkType: 0, linkValue: '', sort: 0, status: 1 })
  dialogVisible.value = true
}

async function handleSave() {
  if (dialogForm.id) { await marketingApi.updateBanner(dialogForm.id, dialogForm); ElMessage.success('修改成功') }
  else { await marketingApi.addBanner(dialogForm); ElMessage.success('新增成功') }
  dialogVisible.value = false; loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除？', '提示', { type: 'warning' })
  await marketingApi.deleteBanner(id)
  ElMessage.success('删除成功'); loadData()
}
</script>
