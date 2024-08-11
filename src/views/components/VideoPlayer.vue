<script setup>
import { TimeStampFormat } from '@/utils/format'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { tipOffPostService } from '@/api/tipOff'
import { useUserStore } from '@/stores/components/user'
import CommentShow from '@/components/CommentShow.vue'
import {
  getCommentService,
  getVideoInfoService,
  getBulletchatService,
  sendCommentService
} from '@/api/video'
import VideoTest from './VideoTest.vue'
import { CommentLikeCancelService, CommentLikePostService } from '@/api/like'

const user = useUserStore()

const route = useRoute()
// TODO 没有评论时候的处理方法
// TODO 弹幕开关的icon转化 Check-> Close
// TODO 维护弹幕数，评论数,分享数数值
// TODO 添加用户的简介

const CommentList = ref([])
const VideoInfo = ref()
const BulletchatList = ref([])
const VideoId = route.params.id
console.log(VideoId)
const SendCommentContent = ref('')
const commentId = ref('')
const bulletGot = ref(false)

const getVideoInfo = async () => {
  try {
    const res = await getVideoInfoService(VideoId)
    VideoInfo.value = res
    console.log(VideoId)
  } catch (error) {
    console.log(error)
  }
}

getVideoInfo()
const getComment = async () => {
  try {
    const res = await getCommentService(VideoId, user.Account)
    CommentList.value = res
  } catch (error) {
    console.log(error)
  }
}
getComment()

const handleLike = async (id, like, index) => {
  console.log(id, like)
  if (like) {
    CommentList.value[index].like_count = (
      await CommentLikeCancelService(user.Account, id)
    ).like_count
    CommentList.value[index].like = false
  } else {
    CommentList.value[index].like_count = (
      await CommentLikePostService(user.Account, id)
    ).like_count
    CommentList.value[index].like = true
  }
}

const bulletLevel = ref(localStorage.getItem('bulletLevel') || '0')

const getBulletChat = async (level) => {
  try {
    const res = await getBulletchatService(VideoId, Number(level))
    BulletchatList.value = res
    bulletGot.value = true
  } catch (error) {
    console.log(error)
  }
}
getBulletChat(bulletLevel.value)

watch(bulletLevel, async (newBulletLevel) => {
  localStorage.setItem('bulletLevel', newBulletLevel)
  location.reload()
  await getBulletChat(newBulletLevel)
})

const handleSendComment = async () => {
  const res = await sendCommentService({
    content: SendCommentContent.value,
    video: VideoId,
    sender: user.Account
  })
  console.log(res)
  if (res?.msg === '触发屏蔽词，不可发送') {
    ElMessage.error('触发屏蔽词，不可发送')
  } else {
    await getComment()
  }
}

const reasons = [
  '违法违禁',
  '色情低俗',
  '恶意刷屏',
  '赌博诈骗',
  '人身攻击',
  '侵犯隐私',
  '垃圾广告',
  '视频无关',
  '引战',
  '剧透',
  '青少年不良信息',
  '其他'
]
const tipOffFormVisible = ref(false)
const levels = [...Array(5).keys()]
const reason = ref('')
const otherReason = ref('')
const bulletChatId = ref('')
const reportType = ref('')
const handleReport = async (type) => {
  if (type === 'c') {
    await tipOffPostService({
      sender: user.Account,
      reason: reason.value === '其他' ? otherReason : reason.value,
      type,
      id: commentId.value
    })
  } else if (type === 'b') {
    await tipOffPostService({
      sender: user.Account,
      reason: reason.value === '其他' ? otherReason : reason.value,
      type,
      id: bulletChatId.value
    })
  }

  ElMessage.success('举报成功')
  tipOffFormVisible.value = false
}
</script>

<template>
  <div class="video-container">
    <div class="left-container">
      <!--标题-->
      <div class="title">
        <h1 title="我是标题">{{ VideoInfo?.name }}</h1>
        <div class="video-info-detail">
          <span class="view-item">
            <el-icon class="count">
              <VideoPlay />
            </el-icon>
            {{ VideoInfo?.ViewCount }}
          </span>
          <span class="view-item">
            <el-icon class="count">
              <Comment />
            </el-icon>
            {{ VideoInfo?.likeCount }}
          </span>
          <span class="pubdate">
            {{ TimeStampFormat(VideoInfo?.timestamp) }}
          </span>
        </div>
      </div>
      <VideoTest
        :videoName="VideoInfo.videoName"
        :bulletchats="BulletchatList"
        v-if="bulletGot && VideoInfo"
        :videoId="VideoId"
        @emit="getBulletChat(bulletLevel)"
      ></VideoTest>
      <!--
        <div class="videoplayer-box">
        <div class="ratio">
          <div class="videoplayer"></div>
        </div>
      </div>
      -->

      <div class="support-bar">
        <div class="btn-group">
          <div class="btn-static">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              class="support-btn"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.77234 30.8573V11.7471H7.54573C5.50932 11.7471 3.85742 13.3931 3.85742 15.425V27.1794C3.85742 29.2112 5.50932 30.8573 7.54573 30.8573H9.77234ZM11.9902 30.8573V11.7054C14.9897 10.627 16.6942 7.8853 17.1055 3.33591C17.2666 1.55463 18.9633 0.814421 20.5803 1.59505C22.1847 2.36964 23.243 4.32583 23.243 6.93947C23.243 8.50265 23.0478 10.1054 22.6582 11.7471H29.7324C31.7739 11.7471 33.4289 13.402 33.4289 15.4435C33.4289 15.7416 33.3928 16.0386 33.3215 16.328L30.9883 25.7957C30.2558 28.7683 27.5894 30.8573 24.528 30.8573H11.9911H11.9902Z"
                fill="currentColor"
              ></path>
            </svg>
            <span>
              {{ VideoInfo?.likeCount }}
            </span>
          </div>
          <div class="btn-static">
            <el-icon class="support-btn" size="36">
              <StarFilled />
            </el-icon>
            <span> 0 </span>
          </div>
          <div class="btn-static">
            <el-icon class="support-btn" size="36">
              <Share />
            </el-icon>
            <span> 0 </span>
          </div>
        </div>
        <div class="more">
          <el-select v-model="bulletLevel">
            <el-option
              v-for="item in levels"
              :key="item"
              :label="`第${item.toString()}等级`"
              :value="item.toString()"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="introduction">
        {{ VideoInfo?.introduction }}
      </div>
      <div class="comment-header">
        <el-icon size="40">
          <Comment />
        </el-icon>
        <div class="comment-count">{{ VideoInfo?.commentCount }}</div>
      </div>
      <div class="comment-bar">
        <div class="comment-avatar-container">
          <div class="comment-avatar">
            <img src="E:\vuep1\pili\pili-front\src\assets\avatar.jpg" height="40" />
          </div>
        </div>
        <input
          class="comment-input"
          v-model="SendCommentContent"
          placeholder="新的风暴已经出现，你的妙评何时再现"
        />
        <button class="comment-btn" @click="handleSendComment()">发布</button>
      </div>
      <div class="comment-list" v-if="CommentList">
        <Suspense>
          <CommentShow
            v-for="(item, index) in CommentList"
            :key="index"
            :index="index"
            :comment="item"
            :like="item.like"
            @report="
              () => {
                if (!user.login) {
                  ElMessage.error('请先登录')
                  return
                }
                tipOffFormVisible = true
                commentId = item.id
                reportType = 'c'
              }
            "
            @like="handleLike"
          ></CommentShow>
        </Suspense>
        <div class="no-comment">没有更多评论</div>
      </div>
      <div class="no-comment" v-else>没有更多评论</div>
    </div>
    <div class="right-container">
      <div class="up-info">
        <div class="up-avatar">
          <img height="48" src="E:\vuep1\pili\pili-front\src\assets\avatar.jpg" />
        </div>
        <div class="up-detail">
          <div class="up-name">
            {{ VideoInfo?.producer.name }}
          </div>
          <div class="up-introduction">
            {{ VideoInfo?.producer.introduction }}
          </div>
          <el-button type="primary" class="subscribe">关注</el-button>
        </div>
      </div>
      <el-table
        class="bulletchat-list"
        :row-style="{ height: 0 + 'px' }"
        height="376"
        :data="BulletchatList"
        @row-click="
          (row) => {
            if (!user.login) {
              ElMessage.error('请先登录')
              return
            }
            tipOffFormVisible = true
            bulletChatId = row.id
            reportType = 'b'
          }
        "
      >
        <el-table-column prop="time" label="时间" width="60" />
        <el-table-column label="弹幕内容" width="200">
          <template #default="scope">
            <span style="font-size: 12px">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送时间">
          <template #default="scope">
            <span style="font-size: 12px">{{
              TimeStampFormat(scope.row.timestamp).slice(5, 16)
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="next-play">接下来播放</div>
      <VideoRecommand></VideoRecommand>
      <el-divider />
      <div class="video-list">
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
        <VideoRecommand></VideoRecommand>
      </div>-->
    </div>
  </div>
  <el-dialog v-model="tipOffFormVisible" title="举报" width="500">
    <el-form>
      <el-form-item label="举报原因">
        <el-select v-model="reason" size="large" placeholder="举报原因">
          <el-option v-for="item in reasons" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="reason === '其他'" label="其他原因" :label-width="formLabelWidth">
        <el-input v-model="otherReason" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="tipOffFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReport(reportType)"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.video-container {
  max-width: 2540px;
  min-width: 1080px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  box-sizing: content-box;
  position: relative;
  .left-container {
    width: 51vw;
    height: fit-content;
    .title {
      height: 104px;
      padding-top: 22px;
    }
    .video-info-detail {
      font-size: 13px;
      display: flex;
      justify-content: left;
      align-items: center;
      height: 24px;
      line-height: 18px;
      background-color: pink;
      .view-item {
        display: inline-flex;
        align-items: center;
        margin-right: 12px;
        .count {
          height: 20px;
          width: 20px;
          margin-right: 4px;
        }
      }
    }
    .videoplayer-box {
      width: 51vw;
      .ratio {
        position: relative;
        width: 100%;
        height: 0;
        padding: 0;
        padding-bottom: 56%;
        background-color: black;
        .video {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      }
    }
    .bulletchat-area {
      height: 46px;
      box-shadow: 1px 1px 2px black;
      .bulletchat-bar {
        display: flex;
        justify-content: space-between;
        height: 46px;
        padding: 0 12px 0 20px;
        align-items: center;
        width: 100%;
        .watchnowinfo {
          line-height: 18px;
          margin-right: 24px;
          width: auto;
        }
        .bulletchat-control {
          align-items: center;
          display: flex;
          flex: auto;
          height: 34px;
          justify-content: right;
          .bulletchat-btn {
            margin-right: 12px;
          }
          .inputbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;

            .input {
              border-radius: 8px 8px 8px 8px;
              background-color: #fff;
              display: flex;
              align-items: center;
              .bulletchat-setting {
                margin: 0 6px;
              }
              .bullet-input {
                width: 100%;
                background: none;
                el-button {
                  border-radius: 0 8px 8px 0;
                }
              }
            }
          }
        }
      }
    }
    .support-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      padding-bottom: 12px;
      line-height: 28px;
      border-bottom: 1px solid;
      .btn-group {
        display: flex;
        justify-content: left;
        .btn-static {
          display: flex;
          align-items: center;
          width: 92px;
          white-space: nowrap;
          cursor: pointer;
          margin-right: 8px;
          .support-btn {
            margin-right: 8px;
          }
        }
      }
      .more {
        margin-right: 10px;
        width: 100px;
      }
    }
    .introduction {
      height: auto;
      margin: 16px 0;
      border-bottom: 1px solid;
    }
    .comment-header {
      margin-top: 24px;
      margin-bottom: 22px;
      height: 40px;
      display: flex;
      align-items: center;
      .comment-count {
        margin-left: 6px;
        margin-right: 36px;
      }
    }
    .comment-bar {
      height: 48px;
      display: flex;
      align-items: center;
      .comment-avatar-container {
        display: flex;
        height: 48px;
        width: 80px;
        justify-content: center;
        align-items: center;
        .comment-avatar {
          height: 40px;
          width: 40px;
        }
      }

      .comment-input {
        width: 100%;
        height: 48px;
      }
      .comment-btn {
        width: 80px;
        height: 48px;
        margin-left: 5px;
      }
    }
    .comment-list {
      margin-top: 14px;
      padding-bottom: 100px;
    }
    .no-comment {
      margin-top: 20px;
      font-size: 13px;
      color: #9499a0;
      text-align: center;
    }
  }
  .right-container {
    width: 22.8vw;
    margin-left: 30px;
  }
  .up-info {
    display: flex;
    align-items: center;
    height: 104px;
    overflow: hidden;
    .up-avatar {
      img {
        border-radius: 50%;
      }
    }
    .up-detail {
      margin-left: 12px;
      flex: 1;
      overflow: auto;
      .up-name {
        font-size: 15px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: calc(100% - 12px - 56px);
      }
      .up-introduction {
        margin-top: 2px;
        font-size: 13px;
        line-height: 16px;
        height: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #9499a0;
        overflow: hidden;
        max-width: calc(100% - 12px - 56px);
      }
    }
    .subscribe {
      width: 100%;
      margin-top: 5px;
    }
    .bulletchat-list {
      width: 100%;
    }
  }
  .next-play {
    color: #18191c;
    margin-bottom: 12px;
    margin-top: 18px;
    line-height: 20px;
  }
  .video-list {
    margin-top: 18px;
  }
}
</style>
