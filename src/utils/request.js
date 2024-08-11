import axios from 'axios'
import { useUserStore } from '@/stores/components/user'
const baseURL = 'http://127.0.0.1:8000'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL,
  timeout: 10000
})
let user

instance.interceptors.request.use(
  (config) => {
    if (!user) {
      user = useUserStore()
    }
    if (user.token) {
      config.headers.Authorization = user.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    ElMessage.error(err?.response?.data?.msg || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
