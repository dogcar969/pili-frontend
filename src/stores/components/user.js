import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const login = ref(false)
  const token = ref('')
  const Account = ref()
  const info = ref()
  async function Login({ jwt, account }) {
    login.value = true
    token.value = jwt
    Account.value = account
    info.value = await userGetInfoService(Account.value)
    localStorage.setItem('token', token.value)
    localStorage.setItem('Account', Account.value)
    localStorage.setItem('info', JSON.stringify(info.value))
  }
  function quit() {
    login.value = false
    token.value = ''
    Account.value = ''
    info.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('Account')
    localStorage.removeItem('info')
  }
  return { login, token, Account, info, Login, quit }
})
