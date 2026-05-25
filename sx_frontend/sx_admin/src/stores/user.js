import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('adminUser', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const nickname = ref(localStorage.getItem('admin_nickname') || '')

  function setLogin(tokenVal, nick) {
    token.value = tokenVal
    nickname.value = nick
    localStorage.setItem('admin_token', tokenVal)
    localStorage.setItem('admin_nickname', nick)
  }

  function logout() {
    token.value = ''
    nickname.value = ''
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_nickname')
  }

  return { token, nickname, setLogin, logout }
})
