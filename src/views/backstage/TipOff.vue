<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { tipOffGetListService, tipOffDealService, tipOffCancelService } from '@/api/tipOff'
import { TimeStampFormat } from '@/utils/format'
import { useUserStore } from '@/stores/components/user'
import { ElMessage } from 'element-plus'
// 显示数据
const user = useUserStore()
const reports = ref([])
const pageCount = ref(0)
const currentPage = ref(1)
function createShowData() {
  for (let i = 0; i < reports.value.length; i++) {
    if (reports.value[i].content.length > 30) {
      reports.value[i].shortContent = reports.value[i].content.substr(0, 30) + '……'
    } else {
      reports.value[i].shortContent = reports.value[i].content
    }
    reports.value[i].showType = typeDescription[reports.value[i].type]
    reports.value[i].timestamp = TimeStampFormat(reports.value[i].timestamp)
  }
}
watch(currentPage, async (newPage) => {
  console.log(newPage)
  const res = await tipOffGetListService(state.value, type.value, newPage, 10)
  reports.value = res.data
  pageCount.value = res.maxPage
  createShowData()
})
// 类型
const typeDescription = {
  '': '不限类型',
  b: '弹幕',
  c: '评论'
}
const typeShow = computed(() => typeDescription[type.value])
const type = ref('')
const handleType = async (command) => {
  type.value = command
  const res = await tipOffGetListService(state.value, type.value, 1, 10)
  reports.value = res.data
  pageCount.value = res.maxPage
  createShowData()
}
onMounted(() => {
  handleType('')
})

// 状态
const state = ref('')
const stateDescription = {
  p: '待解决',
  a: '已解决',
  r: '已拒绝',
  '': '不限状态'
}
const stateShow = computed(() => stateDescription[state.value])
const handleState = async (command) => {
  console.log(command)
  state.value = command
  const res = await tipOffGetListService(state.value, type.value, 1, 10)
  console.log(res)
  reports.value = res.data
  pageCount.value = res.maxPage
  createShowData()
}

const stateToClass = {
  p: { 'background-color': '#cffafe' },
  a: { 'background-color': '#f0f9eb' },
  r: { 'background-color': '#ffe4e6' }
}

const tableRowClassName = ({ row }) => {
  return stateToClass[row.state]
}

// 对话框
const dialogFormVisible = ref(false)
const method = ['删除', '禁言', '封禁']
const period = ['三天', '一周', '一月']
const form = ref({
  method: '',
  period: ''
})
const isBan = computed(() => form.value.method === '禁言')
const dealId = ref('')
const dealIndex = ref('')
const handleEdit = (index, row) => {
  if (row.state !== 'p') {
    ElMessage.error('请不要进行重复处理')
    return
  }
  dialogFormVisible.value = true
  console.log(row)
  dealId.value = row.id
  dealIndex.value = index
  console.log(dealId.value)
}

const handleDeal = async () => {
  if (method !== '禁言') {
    await tipOffDealService({ id: dealId.value, deal: form.value.method, time: form.value.period })
  } else {
    await tipOffDealService({ id: dealId.value, deal: form.value.method })
  }
  const res = await tipOffGetListService(state.value, type.value, currentPage.value, 10)
  reports.value = res.data
  pageCount.value = res.maxPage
  createShowData()
  dialogFormVisible.value = false
}

// 不进行处理
const handleCancel = async (index, row) => {
  if (row.state === 'r') {
    ElMessage.error('该举报已经被拒绝。')
    return
  } else if (row.state === 'a') {
    ElMessage.error('该举报已经被处理。')
    return
  }
  await tipOffCancelService(row.id)
  const res = await tipOffGetListService(state.value, type.value, currentPage.value, 10)
  reports.value = res.data
  pageCount.value = res.maxPage
  createShowData()
}
</script>

<template>
  <!--  -->
  <el-empty v-if="!user.login"></el-empty>
  <el-empty v-else-if="user.info?.identity !== 'r'" description="您不是举报管理员" />
  <div v-else>
    <!-- 分类栏 -->
    <el-row class="gap-2">
      <!-- 类型单选 -->
      <el-dropdown @command="handleType">
        <el-button type="primary">
          {{ typeShow }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="b">弹幕</el-dropdown-item>
            <el-dropdown-item command="c">评论</el-dropdown-item>
            <el-dropdown-item command="">不限类型</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 状态单选 -->
      <el-dropdown @command="handleState">
        <el-button type="primary">
          {{ stateShow }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="p">待解决</el-dropdown-item>
            <el-dropdown-item command="a">已解决</el-dropdown-item>
            <el-dropdown-item command="r">已拒绝</el-dropdown-item>
            <el-dropdown-item command="">不限状态</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-row>
    <!-- 数据展示、处理 -->
    <el-table :data="reports" style="width: 100%" :row-style="tableRowClassName">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">举报人: {{ props.row.sender.name }}</p>
            <p m="t-0 b-2">全文: {{ props.row.content }}</p>
            <a m="t-0 b-2" :href="'http://localhost:5173/Video/' + props.row.video.id"
              >所属视频: {{ props.row.video.name }}</a
            >
            <p m="t-0 b-2">原因: {{ props.row.reason }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="举报时间" prop="timestamp" width="200" />
      <el-table-column label="被举报人" prop="respondent.name" width="150" />
      <el-table-column label="举报内容" prop="shortContent" width="500" />
      <el-table-column label="举报类型" prop="showType" width="100" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)"
            >处理</el-button
          >
          <el-button type="danger" size="small" @click="handleCancel(scope.$index, scope.row)"
            >拒绝</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        class="justify-center"
        layout="prev, pager, next"
        :page-count="pageCount"
        v-model:current-page="currentPage"
      />
    </div>
    <!-- 处理对话框 -->
    <el-dialog v-model="dialogFormVisible" title="处理" width="500">
      <el-form :model="form">
        <el-form-item label="处理方式">
          <el-select v-model="form.method" placeholder="请选择方式">
            <el-option v-for="(item, index) in method" :label="item" :value="item" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理时间" v-if="isBan">
          <el-select v-model="form.period" placeholder="请选择时间">
            <el-option v-for="(item, index) in period" :label="item" :value="item" :key="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDeal"> 确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.pending {
  background-color: #22d3ee;
}
.approve {
  background-color: #4ade80;
}
.reject {
  background-color: #f43f5e;
}
</style>
