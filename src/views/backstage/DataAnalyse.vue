<script setup>
import { useUserStore } from '@/stores/components/user'
import { statisticsGetService, wordsGetService } from '@/api/analyse'
import { wordAddService, wordSafeService } from '@/api/bannedWord'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const user = useUserStore()
const statistics = ref({})
const getStatistics = async () => {
  const res = await statisticsGetService()
  statistics.value = res
  console.log(statistics.value)
}
getStatistics()

const words = ref([])
const leftTableData = ref(new Array(5).fill({ word: '', frequency: '' }))
const rightTableData = ref(new Array(5).fill({ word: '', frequency: '' }))
const getWords = async () => {
  const res = await wordsGetService()
  words.value = res
  if (res.length <= 5) {
    leftTableData.value = res
    while (leftTableData.value.length < 5) {
      leftTableData.value.push({ word: '', frequency: '' })
    }
  } else {
    leftTableData.value = res.slice(0, 5)
    rightTableData.value = res.slice(5, res.length)
    while (rightTableData.value.length < 5) {
      rightTableData.value.push({ word: '', frequency: '' })
    }
  }
  console.log(words.value)
}
getWords()

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#909399'
  }
  if (percentage < 70) {
    return '#e6a23c'
  }
  return '#67c23a'
}

const form = ref({ name: '', type: '' })
const EditDialogFormVisible = ref(false)
const dialogTitle = ref('')
const handleAdd = (index, row) => {
  dialogTitle.value = '添加敏感词'
  EditDialogFormVisible.value = true
  form.value.name = row.word
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
  await getWords()
}
const safeSubmit = async (index, row) => {
  await wordSafeService(row.word)
  await getWords()
}
</script>

<template>
  <!--举报处理进度-->
  <el-empty v-if="!user.login" description="请先登录"></el-empty>
  <el-empty
    v-else-if="user.info?.identity !== 'r' && user.info?.identity !== 'k'"
    description="您不是举报管理员或关键词管理员"
  ></el-empty>
  <div v-else>
    <div v-if="statistics">
      <div>举报处理进度</div>
      <el-progress
        :percentage="(100 * statistics.solve_and_reject_num) / statistics.all_num"
        class="my-5"
        :color="customColorMethod"
      />
      <el-row class="text-center my-20">
        <el-col :span="6">
          <el-statistic title="总举报数" :value="statistics.all_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="未处理举报数" :value="statistics.not_solve_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已处理举报数" :value="statistics.solve_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="已拒绝举报数" :value="statistics.reject_num" />
        </el-col>
      </el-row>
      <el-row class="text-center my-20">
        <el-col :span="6">
          <el-statistic title="总关键词数" :value="statistics.all_word_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="禁止关键词数" :value="statistics.banned_word_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="替换关键词数" :value="statistics.mask_word_num" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="审核关键词数" :value="statistics.check_word_num" />
        </el-col>
      </el-row>
    </div>

    <!--最多出现的词-->
    <div class="flex justify-center mt-20">
      <el-table :data="leftTableData" style="width: 50%">
        <el-table-column label="词" width="180">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.word }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出现次数" width="180">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.frequency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleAdd(scope.$index, scope.row)" type="danger"
              >加入敏感词</el-button
            >
            <el-button size="small" type="success" @click="safeSubmit(scope.$index, scope.row)"
              >安全</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="rightTableData" style="width: 50%">
        <el-table-column label="词" width="180">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.word }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出现次数" width="180">
          <template #default="scope">
            <span style="margin-left: 10px">{{ scope.row.frequency }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleAdd(scope.$index, scope.row)" type="danger"
              >加入敏感词</el-button
            >
            <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)"
              >安全</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
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
        <el-button type="primary" @click="AddSubmit()"> 提交 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style></style>
