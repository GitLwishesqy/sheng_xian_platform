import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
  baseURL: '',
  timeout: 15000
})

// 请求拦截器
http.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// 响应拦截器
http.interceptors.response.use(
  response => {
    const data = response.data
    if (data.code === 200) {
      return data
    } else if (data.code === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
      return Promise.reject(data)
    } else {
      ElMessage.error(data.message || '操作失败')
      return Promise.reject(data)
    }
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    ElMessage.error('网络错误')
    return Promise.reject(error)
  }
)

export default http
