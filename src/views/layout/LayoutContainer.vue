<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/components/user'
import { userLoginService, userRegisterService } from '@/api/user'
import { ElMessage } from 'element-plus'
const input = ref('')

const user = useUserStore()
const handleLogin = async () => {
  const res = await userLoginService(loginForm.value)
  if (res?.msg === '用户名或密码错误') {
    ElMessage.error('用户名或密码错误')
    return
  }
  user.Login(res)
  ElMessage.success('登录成功')
  loginFormVisible.value = false
  loginForm.value = { account: '', password: '' }
}
const handleRegister = async () => {
  await userRegisterService(registerForm.value)
  registerFormVisible.value = false
  registerForm.value = { account: '', password: '', passwordConfirm: '', name: '' }
}
const loginFormVisible = ref(false)
const registerFormVisible = ref(false)
const loginForm = ref({ account: '', password: '' })
const registerForm = ref({ account: '', password: '', passwordConfirm: '', name: '' })
const handleQuit = () => {
  user.quit()
}
</script>

// TODO 补上logo，给logo，头像补上通向首页/个人主页的超链接 // FIXME
解决缩放比较小的时候，头像名字间隔不够的问题

<template>
  <div id="header">
    <div class="logo">这是logo</div>
    <div class="searchbox">
      <el-input v-model="input" placeholder="陈哥1" clearable />
      <el-button type="primary">
        <el-icon style="vertical-align: middle">
          <Search />
        </el-icon>
        <span style="vertical-align: middle"> 搜索 </span>
      </el-button>
    </div>
    <div>
      <div v-if="user.login" class="userinfo">
        <img src="E:\vuep1\pili\pili-front\src\assets\avatar.jpg" />
        <span v-if="user?.info?.name">{{ user.info?.name }}</span>
        <el-button type="error" @click="handleQuit()">退出</el-button>
      </div>
      <div v-else class="userinfo">
        <el-button type="warning" @click="() => (registerFormVisible = true)">注册</el-button>
        <el-button type="success" @click="() => (loginFormVisible = true)">登录</el-button>
      </div>
    </div>
  </div>
  <div class="occupy"></div>
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
        <el-button
          @click="
            () => {
              loginFormVisible = false
              loginForm = { account: '', password: '' }
            }
          "
          >取消</el-button
        >
        <el-button type="primary" @click="handleLogin()"> 登录 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="registerFormVisible" title="注册" width="500">
    <el-form :model="registerForm">
      <el-form-item label="账号" :label-width="formLabelWidth">
        <el-input v-model="registerForm.account" autocomplete="off" />
      </el-form-item>
      <el-form-item label="名字" :label-width="formLabelWidth">
        <el-input v-model="registerForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="registerForm.password" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth">
        <el-input v-model="registerForm.passwordConfirm" autocomplete="off" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            () => {
              registerFormVisible = false
              registerForm = { account: '', password: '', passwordConfirm: '', name: '' }
            }
          "
          >取消</el-button
        >
        <el-button type="primary" @click="handleRegister()"> 注册 </el-button>
      </div>
    </template>
  </el-dialog>
  <RouterView></RouterView>
</template>

<style lang="scss" scoped>
.occupy {
  height: 56px;
  width: auto;
}

#header {
  height: 56px;
  background-color: #fff;

  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  width: 100vw;
  box-shadow: 0 2px 4px #00000014;
  z-index: 100;
  .logo {
    width: 6.25vw;
    background-color: pink;
    margin-left: 16px;
    line-height: 56px;
    text-align: center;
  }
  .searchbox {
    width: 44vw;
    display: flex;
    align-items: center;
    el-input {
      border-radius: 40px, 0, 0, 40px;
    }
  }
  .userinfo {
    width: 10vw;
    margin-right: 16px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 36px;
      height: 36px;
      border-radius: 18px;
    }
  }
}
</style>
