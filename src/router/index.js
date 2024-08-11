import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/components/user'
let user
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/HomePage',
      children: [
        {
          path: '/HomePage',
          component: () => import('@/views/components/HomePage.vue')
        },
        {
          path: '/Video/:id',
          component: () => import('@/views/components/VideoPlayer.vue')
        },
        {
          path: '/VideoTest',
          component: () => import('@/views/components/VideoTest.vue')
        },
        {
          path: '/test',
          component: () => import('@/views/components/TestCom.vue')
        }
        // TODO 个人中心
      ]
    },
    {
      path: '/admin',
      component: () => import('@/views/layout/BackStage.vue'),
      redirect: '/admin/Analyse',
      children: [
        {
          name: '数据分析',
          path: '/admin/Analyse',
          component: () => import('@/views/backstage/DataAnalyse.vue')
        },
        {
          name: '敏感词管理',
          path: '/admin/BannedWord',
          component: () => import('@/views/backstage/BannedWord.vue')
          // TODO 要加一个统计触发次数的功能吗？
        },
        {
          name: '举报管理',
          path: '/admin/TipOff',
          component: () => import('@/views/backstage/TipOff.vue')
        }
      ]
    },
    {
      path: '/test',
      component: () => import('@/views/components/TestCom.vue')
    }
  ]
})

router.beforeEach(() => {
  if (!user) {
    user = useUserStore()
  }
  try {
    user.Account = localStorage.getItem('Account')
    console.log(user)
    if (!user.Account) {
      user.login = false
      return
    }
    user.info = JSON.parse(localStorage.getItem('info'))
    user.token = localStorage.getItem('token')
    user.login = true
  } catch (e) {
    user.login = false
  }
})

export default router
