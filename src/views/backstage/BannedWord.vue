<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  wordGetListService,
  wordAddService,
  wordEditService,
  wordDeleteService,
  treeSaveService,
  treeVerifyService,
  treeRebuildService
} from '@/api/bannedWord'
import { useUserStore } from '@/stores/components/user'
const user = useUserStore()
console.log(user)

// const search = ref('')

// 数据部分
const form = ref({
  name: '',
  type: ''
})
const bannedWordList = ref([])
const pageCount = ref(0)
const currentPage = ref(1)

watch(currentPage, async (newPage) => {
  const response = await wordGetListService(type.value, newPage, 13)
  let data = response.data
  data.forEach((element) => {
    element.typeShow = types[element.type]
  })
  bannedWordList.value = data
  pageCount.value = response.maxPage
})

// 对话框（添加 修改） 部分
const showType = ref('')
const type = ref('')
const types = {
  b: '禁止关键词',
  m: '替换关键词',
  c: '审核关键词',
  '': '不限类型'
}
const handleType = async (command) => {
  type.value = command
  showType.value = types[command]
  const response = await wordGetListService(command, 1, 13)
  let data = response.data
  data.forEach((element) => {
    element.typeShow = types[element.type]
  })
  bannedWordList.value = data
  pageCount.value = response.maxPage
  currentPage.value = 1
}
handleType('')
const EditDialogFormVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加敏感词'
  EditDialogFormVisible.value = true
}

const AddSubmit = async () => {
  const response = await wordAddService(form.value.name, form.value.type)
  ElMessage({
    type: 'success',
    message: response
  })
  form.value.name = ''
  form.value.type = ''
  EditDialogFormVisible.value = false
}

const globalIndex = ref(-1)

const handleEdit = (index) => {
  isEdit.value = true
  dialogTitle.value = '修改敏感词'
  globalIndex.value = index
  form.value.name = bannedWordList.value[index].word
  EditDialogFormVisible.value = true
}

const EditSubmit = async () => {
  console.log(bannedWordList.value)
  const response = await wordEditService(
    bannedWordList.value[globalIndex.value]['id'],
    form.value.name,
    form.value.type
  )
  ElMessage({
    type: 'success',
    message: response
  })
  form.value.name = ''
  form.value.type = ''
  EditDialogFormVisible.value = false
}

const handleSubmit = async () => {
  if (isEdit.value) {
    await EditSubmit()
  } else {
    await AddSubmit()
  }
}

// 删除
const handleDelete = async (index) => {
  const response = await wordDeleteService(bannedWordList.value[index].id)
  ElMessage({
    type: 'success',
    message: response.msg
  })
}

// 保存到文件
const handleSave = async () => {
  const response = await treeSaveService()
  ElMessage({
    type: 'success',
    message: response.msg
  })
}

// 数据一致性校验、重建
const rebuildDialogVisible = ref(false)
const handleVerify = async () => {
  const response = await treeVerifyService()
  console.log(response.msg)
  if (response.msg == '检测成功！') {
    ElMessage({
      // 发送成功信息
      message: response.msg,
      type: 'success'
    })
  } else if (response.msg == '检测失败') {
    rebuildDialogVisible.value = true // 打开重建DFA树的弹窗
  }
}

const handleRebuild = async () => {
  const response = await treeRebuildService()
  ElMessage({
    message: response.msg,
    type: 'success'
  })
  rebuildDialogVisible.value = false
}
</script>

<template>
  <div>
    <el-empty v-if="!user.login" description="请先登录" />
    <el-empty v-else-if="user.info?.identity !== 'k'" description="您不是关键词管理员" />
    <div v-else>
      <!-- 类型选择 -->
      <el-row class="flex justify-between">
        <el-dropdown @command="handleType">
          <el-button type="primary">
            {{ showType }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="b">禁止关键词</el-dropdown-item>
              <el-dropdown-item command="c">审核关键词</el-dropdown-item>
              <el-dropdown-item command="m">替换关键词</el-dropdown-item>
              <el-dropdown-item command="">不限类型</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="w-56">
          <el-button @click="handleAdd" style="width: 15vw">添加敏感词</el-button>
        </div>
        <div>
          <el-button type="success" round @click="handleSave">保存到文件</el-button>
          <el-button type="warning" round @click="handleVerify">检测数据一致性</el-button>
        </div>
      </el-row>

      <!--数据展示-->
      <el-table :data="bannedWordList" style="width: 100%">
        <el-table-column label="违禁词" prop="word" />
        <el-table-column label="类型" prop="typeShow" />
        <el-table-column align="right" class="flex justify-between">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 对话框 -->
      <el-dialog v-model="EditDialogFormVisible" :title="dialogTitle" width="500">
        <el-form :model="form">
          <el-form-item label="敏感词">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option label="禁止关键词" value="b" />
              <el-option label="审核关键词" value="c" />
              <el-option label="替换关键词" value="m" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div>
            <el-button @click="EditDialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit"> 提交 </el-button>
          </div>
        </template>
      </el-dialog>
      <div>
        <el-pagination
          class="justify-center"
          layout="prev, pager, next"
          :page-count="pageCount"
          v-model:current-page="currentPage"
        />
      </div>
    </div>
    <el-dialog v-model="rebuildDialogVisible" title="检测失败" width="500">
      <span>是否重建字典树？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="rebuildDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleRebuild"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style></style>
