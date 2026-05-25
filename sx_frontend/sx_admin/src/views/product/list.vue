<template>
  <div>
    <el-card>
      <div class="toolbar">
        <el-select v-model="search.categoryId" placeholder="商品分类" clearable style="width:200px">
          <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
        </el-select>
        <el-input v-model="search.keyword" placeholder="搜索商品" clearable style="width:200px;margin-left:10px" />
        <el-button type="success" @click="loadData" style="margin-left:10px">查询</el-button>
        <el-button type="primary" @click="$router.push('/product/edit')">新增商品</el-button>
      </div>

      <el-table :data="tableData" stripe v-loading="loading" style="margin-top:16px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="商品名称" min-width="160" />
        <el-table-column prop="price" label="售价" width="100" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-switch :model-value="row.status === 1" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="$router.push('/product/edit/' + row.id)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page" :page-size="pageSize" :total="total"
        layout="total, prev, pager, next" @current-change="loadData"
        style="margin-top:16px;justify-content:flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import productApi from '@/api/product'

const loading = ref(false)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref([])
const categories = ref([])
const search = reactive({ categoryId: '', keyword: '' })

onMounted(() => { loadCategories(); loadData() })

async function loadCategories() {
  const res = await productApi.getCategoryList()
  if (res.code === 200) categories.value = flattenCategories(res.data || [])
}

function flattenCategories(list, result = []) {
  list.forEach(c => { result.push(c); if (c.children) flattenCategories(c.children, result) })
  return result
}

async function loadData() {
  loading.value = true
  try {
    const params = { page: page.value, pageSize: pageSize.value }
    if (search.categoryId) params.categoryId = search.categoryId
    if (search.keyword) params.keyword = search.keyword
    const res = await productApi.getProductList(params)
    if (res.code === 200) { tableData.value = res.data.records || []; total.value = res.data.total || 0 }
  } finally { loading.value = false }
}

async function toggleStatus(row) {
  const newStatus = row.status === 1 ? 0 : 1
  await productApi.toggleProductStatus(row.id, newStatus)
  row.status = newStatus
  ElMessage.success(newStatus === 1 ? '已上架' : '已下架')
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该商品？', '提示', { type: 'warning' })
  await productApi.deleteProduct(row.id)
  ElMessage.success('删除成功')
  loadData()
}
</script>

<style scoped>
.toolbar { display: flex; align-items: center; }
</style>
