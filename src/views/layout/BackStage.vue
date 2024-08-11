<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { userLoginService } from '@/api/user'
import { useUserStore } from '@/stores/components/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const title = ref(route.name)
const urls = ['/admin/Analyse/', '/admin/BannedWord/', '/admin/TipOff/']
const avatar = ref('../assets/defaultAvatar.png')
const handleSelect = async (index) => {
  await router.push(urls[index])
  title.value = route.name
}

const user = useUserStore()

const loginFormVisible = ref(false)
const loginForm = ref({ account: '', password: '' })
const handleLogin = async () => {
  const res = await userLoginService(loginForm.value)
  if (res?.msg === '用户名或密码错误') {
    ElMessage.error('用户名或密码错误')
    loginFormVisible.value = false
    return
  }
  user.Login(res)
  ElMessage.success('登录成功')
  loginFormVisible.value = false
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header className="flex justify-between items-center h-12 bg-cyan-600 px-10"
        ><div class="left">{{ title }}</div>
        <div class="right flex items-center gap-x-5" v-if="user.login">
          <span>{{ user.info?.name }}</span
          ><el-avatar :size="50" :src="avatar" />
          <el-button @click="user.quit()">退出</el-button>
        </div>
        <div v-else>
          <el-button @click="loginFormVisible = true">登录</el-button>
        </div>
      </el-header>
      <el-container style="height: 44rem">
        <el-aside width="200px">
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#2f4052"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleSelect"
            style="height: 100%"
          >
            <el-menu-item index="0">
              <el-icon><CoffeeCup /></el-icon>
              <span>数据分析</span>
            </el-menu-item>
            <el-menu-item index="1">
              <el-icon><Edit /></el-icon>
              <span>敏感词管理</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><List /></el-icon>
              <span>举报管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main><RouterView></RouterView></el-main>
      </el-container>
    </el-container>
  </div>
  <el-dialog v-model="loginFormVisible" title="登录" width="500">
    <el-form :model="loginForm">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="loginForm.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="loginForm.password" autocomplete="off" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="loginFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleLogin()"> 登录 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
