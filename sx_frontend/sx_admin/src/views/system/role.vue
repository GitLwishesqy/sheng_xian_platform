<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openDialog()" style="margin-bottom:16px">新增角色</el-button>
      <el-table :data="tableData" stripe v-loading="loading">
        <el-table-column prop="name" label="角色名称" width="160" />
        <el-table-column prop="code" label="角色编码" width="200" />
        <el-table-column prop="remark" label="备注" min-width="200" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-button type="success" link @click="assignMenu(row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogForm.id ? '编辑角色' : '新增角色'" width="450px">
      <el-form :model="dialogForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="dialogForm.name" /></el-form-item>
        <el-form-item label="编码"><el-input v-model="dialogForm.code" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="dialogForm.remark" type="textarea" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="menuVisible" title="分配菜单权限" width="400px">
      <el-tree
        ref="menuTree"
        :data="menuData"
        :props="{ label: 'name', children: 'children' }"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <template #footer>
        <el-button @click="menuVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenus">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import systemApi from '@/api/system'

const loading = ref(false); const tableData = ref([]); const dialogVisible = ref(false)
const menuVisible = ref(false); const menuData = ref([]); const menuTree = ref(null)
const currentRoleId = ref(null)
const dialogForm = reactive({ id: null, name: '', code: '', remark: '' })

onMounted(() => loadData())

async function loadData() {
  loading.value = true
  const res = await systemApi.getRoleList()
  if (res.code === 200) tableData.value = res.data.records || res.data || []
  loading.value = false
}

function openDialog(row) {
  Object.assign(dialogForm, row ? { ...row } : { id: null, name: '', code: '', remark: '' })
  dialogVisible.value = true
}

async function handleSave() {
  if (dialogForm.id) { await systemApi.updateRole(dialogForm.id, dialogForm); ElMessage.success('修改成功') }
  else { await systemApi.addRole(dialogForm); ElMessage.success('新增成功') }
  dialogVisible.value = false; loadData()
}

async function assignMenu(row) {
  currentRoleId.value = row.id
  const res = await systemApi.getMenuTree()
  if (res.code === 200) menuData.value = res.data || []
  menuVisible.value = true
}

async function saveMenus() {
  const keys = menuTree.value.getCheckedKeys()
  await systemApi.assignRoleMenu(currentRoleId.value, keys)
  ElMessage.success('权限已保存')
  menuVisible.value = false
}
</script>
