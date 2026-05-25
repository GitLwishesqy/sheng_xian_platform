<template>
  <div>
    <el-card>
      <template #header>
        <span>{{ isEdit ? '编辑商品' : '新增商品' }}</span>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" size="default">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类" prop="categoryId">
              <el-tree-select v-model="form.categoryId" :data="categories" :props="{ label: 'name', value: 'id' }"
                check-strictly placeholder="选择分类" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="售价" prop="price">
              <el-input-number v-model="form.price" :min="0" :precision="2" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原价">
              <el-input-number v-model="form.originalPrice" :min="0" :precision="2" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="form.stock" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="副标题">
          <el-input v-model="form.subtitle" placeholder="商品卖点/副标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.coverImage" placeholder="封面图URL" />
        </el-form-item>
        <el-form-item label="商品单位">
          <el-input v-model="form.unit" placeholder="如：份、斤、500g" style="width:200px" />
        </el-form-item>
        <el-form-item label="存储条件">
          <el-select v-model="form.storageCondition" placeholder="请选择" style="width:200px">
            <el-option label="常温" value="常温" />
            <el-option label="冷藏" value="冷藏" />
            <el-option label="冷冻" value="冷冻" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="saving" @click="handleSave">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- SKU 管理 -->
    <el-card v-if="isEdit" style="margin-top:16px">
      <template #header>SKU 规格管理</template>
      <el-button type="primary" size="small" @click="showSkuDialog = true" style="margin-bottom:10px">添加SKU</el-button>
      <el-table :data="skuList" stripe size="small">
        <el-table-column prop="specName" label="规格名" width="120" />
        <el-table-column prop="specValue" label="规格值" width="120" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="skuCode" label="编码" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="danger" link @click="deleteSku(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- SKU 弹窗 -->
    <el-dialog v-model="showSkuDialog" title="添加SKU" width="400px">
      <el-form :model="skuForm" label-width="80px">
        <el-form-item label="规格名称"><el-input v-model="skuForm.specName" placeholder="如：重量" /></el-form-item>
        <el-form-item label="规格值"><el-input v-model="skuForm.specValue" placeholder="如：500g" /></el-form-item>
        <el-form-item label="价格"><el-input-number v-model="skuForm.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="skuForm.stock" :min="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showSkuDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSku">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import productApi from '@/api/product'

const route = useRoute()
const router = useRouter()
const isEdit = ref(!!route.params.id)
const productId = ref(route.params.id)
const saving = ref(false)
const categories = ref([])
const skuList = ref([])
const showSkuDialog = ref(false)
const skuForm = reactive({ specName: '', specValue: '', price: 0, stock: 0 })

const form = reactive({
  name: '', categoryId: '', subtitle: '', coverImage: '', unit: '份',
  price: 0, originalPrice: null, stock: 0, storageCondition: '', sort: 0
})

const rules = {
  name: [{ required: true, message: '请输入商品名称' }],
  categoryId: [{ required: true, message: '请选择分类' }],
  price: [{ required: true, message: '请输入价格' }],
  stock: [{ required: true, message: '请输入库存' }]
}

onMounted(async () => {
  const cateRes = await productApi.getCategoryList()
  if (cateRes.code === 200) categories.value = cateRes.data || []
  if (isEdit.value) {
    const res = await productApi.getProductDetail(productId.value)
    if (res.code === 200) Object.assign(form, res.data)
    loadSkus()
  }
})

async function loadSkus() {
  const res = await productApi.getSkuList(productId.value)
  if (res.code === 200) skuList.value = res.data || []
}

async function handleSave() {
  saving.value = true
  try {
    const data = { ...form, images: JSON.stringify([]), detail: '' }
    if (isEdit.value) {
      await productApi.updateProduct(productId.value, data)
      ElMessage.success('修改成功')
    } else {
      await productApi.addProduct(data)
      ElMessage.success('新增成功')
      router.back()
    }
  } finally { saving.value = false }
}

async function saveSku() {
  await productApi.addSku(productId.value, skuForm)
  ElMessage.success('SKU添加成功')
  showSkuDialog.value = false
  Object.assign(skuForm, { specName: '', specValue: '', price: 0, stock: 0 })
  loadSkus()
}

async function deleteSku(id) {
  await productApi.deleteSku(id)
  ElMessage.success('删除成功')
  loadSkus()
}
</script>
