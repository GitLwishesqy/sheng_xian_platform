<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">
        <img src="/logo.svg" class="login-logo" alt="logo" />
        <span>生鲜平台管理后台</span>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" :loading="loading" style="width:100%" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import systemApi from '@/api/system'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ username: 'admin', password: 'admin123' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  loading.value = true
  try {
    const res = await systemApi.login(form.username, form.password)
    userStore.setLogin(res.data.token, res.data.nickname || form.username)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
}
.login-card {
  width: 420px; background: #fff; border-radius: 12px; padding: 40px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
}
.login-title { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 30px; color: #333; font-size: 24px; }
.login-logo { width: 40px; height: 40px; }
</style>
