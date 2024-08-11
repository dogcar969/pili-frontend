<script setup>
import { TimeStampFormat } from '@/utils/format'
import { ref, defineEmits } from 'vue'
const prop = defineProps({
  comment: Object,
  like: Boolean,
  index: Number
})
const emit = defineEmits(['like'])

const isDislike = ref(false)
if (prop.like) {
  console.log(prop.comment.id)
}

// watch(
//   () => user.login,
//   async () => {
//     if (user.login) {
//       isLike.value = (await CommentLikeGetService(user.Account, props.comment.id)).like === 'True'
//     } else {
//       isLike.value = false
//     }
//   }
// )

const handleLike = () => {
  emit('like', prop.comment.id, prop.like, prop.index)
}
// const handleLike = async () => {
//   if (!user.login) {
//     ElMessage.error('请先登录')
//     return
//   }
//   if (isLike.value) {
//     like_count.value = (await CommentLikeCancelService(user.Account, props.comment.id)).like_count
//     isLike.value = (await CommentLikeGetService(user.Account, props.comment.id)).like === 'True'
//   } else {
//     like_count.value = (await CommentLikePostService(user.Account, props.comment.id)).like_count
//     isLike.value = (await CommentLikeGetService(user.Account, props.comment.id)).like === 'True'
//   }
// }
</script>
<template>
  <div class="Comment">
    <div class="comment-avatar">
      <div class="comment-avatar-size">
        <img src="E:\vuep1\pili\pili-front\src\assets\avatar.jpg" alt="" height="40" />
      </div>
    </div>
    <div class="comment-user-info">
      {{ comment.sender.name }}
    </div>
    <div class="comment-content">
      {{ comment.content }}
    </div>
    <div class="comment-info">
      <div class="comment-timestamp">
        {{ TimeStampFormat(comment.timestamp) }}
      </div>
      <div class="comment-like cursor-pointer" @click="handleLike">
        <svg
          class="like-icon"
          width="16px"
          height="16px"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          v-if="!like"
        >
          <path
            fill="#cdcdcd"
            d="M621.674667 408.021333c16.618667-74.24 28.224-127.936 34.837333-161.194666C673.152 163.093333 629.941333 85.333333 544.298667 85.333333c-77.226667 0-116.010667 38.378667-138.88 115.093334l-0.586667 2.24c-13.728 62.058667-34.72 110.165333-62.506667 144.586666a158.261333 158.261333 0 0 1-119.733333 58.965334l-21.909333 0.469333C148.437333 407.808 106.666667 450.816 106.666667 503.498667V821.333333c0 64.8 52.106667 117.333333 116.394666 117.333334h412.522667c84.736 0 160.373333-53.568 189.12-133.92l85.696-239.584c21.802667-60.96-9.536-128.202667-70.005333-150.186667a115.552 115.552 0 0 0-39.488-6.954667H621.674667zM544.256 149.333333c39.253333 0 59.498667 36.48 49.888 84.928-7.573333 38.144-21.984 104.426667-43.221333 198.666667-4.512 20.021333 10.56 39.093333 30.912 39.093333h218.666666c6.101333 0 12.16 1.066667 17.909334 3.168 27.445333 9.984 41.674667 40.554667 31.776 68.266667l-85.568 239.573333C744.981333 838.026667 693.301333 874.666667 635.402667 874.666667H223.498667C194.314667 874.666667 170.666667 850.784 170.666667 821.333333V503.498667c0-17.866667 14.144-32.448 31.829333-32.821334l21.866667-0.469333a221.12 221.12 0 0 0 167.381333-82.56c34.346667-42.602667 59.146667-99.306667 74.869333-169.877333C482.101333 166.336 499.552 149.333333 544.266667 149.333333z"
          />
        </svg>
        <svg
          t="1714994514400"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1573"
          width="16px"
          height="16px"
          v-if="like"
        >
          <path
            d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311h-0.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z"
            p-id="1574"
            fill="#1296db"
          ></path>
        </svg>
        <span>{{ comment.like_count }}</span>
      </div>
      <div class="comment-dislike" @click="isDislike = !isDislike">
        <svg
          t="1706431212374"
          class="dislike-icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1854"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="16px"
          height="16px"
          v-if="!isDislike"
        >
          <path
            d="M554.666667 896c-72.533333 0-128-55.466667-128-128v-42.666667c0-72.533333-55.466667-128-128-128H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333V213.333333c0-46.933333 38.4-85.333333 85.333334-85.333333h85.333333c29.866667 0 51.2 12.8 68.266667 34.133333 29.866667-21.333333 64-34.133333 102.4-34.133333h298.666666c55.466667-4.266667 110.933333 42.666667 128 119.466667l42.666667 213.333333v8.533333c0 72.533333-55.466667 128-128 128h-85.333333v170.666667c0 72.533333-55.466667 128-128 128z m-213.333334-379.733333c98.133333 21.333333 170.666667 106.666667 170.666667 209.066666v42.666667c0 25.6 17.066667 42.666667 42.666667 42.666667s42.666667-17.066667 42.666666-42.666667v-213.333333c0-25.6 17.066667-42.666667 42.666667-42.666667h128c21.333333 0 42.666667-17.066667 42.666667-38.4l-42.666667-209.066667c-8.533333-34.133333-25.6-51.2-38.4-51.2H426.666667c-46.933333 0-85.333333 38.4-85.333334 85.333334v217.6zM170.666667 213.333333v298.666667h85.333333V213.333333H170.666667z"
            p-id="1855"
            fill="#dbdbdb"
          ></path>
        </svg>
        <svg
          t="1715062223743"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4639"
          width="16"
          height="16"
          v-if="isDislike"
        >
          <path
            d="M214.656 640a85.44 85.44 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 170.666666 0v341.333334a85.44 85.44 0 0 1-85.333333 85.333333zM898.346667 601.749333A106.346667 106.346667 0 0 1 816.597333 640H690.986667c19.285333 78.997333 9.749333 158.464-26.24 208.426667A106.944 106.944 0 0 1 577.322667 896c-49.792 0-49.792-46.122667-49.792-79.786667 0-66.368-14.208-176.213333-168.704-219.52a21.653333 21.653333 0 0 1-16.170667-20.693333V234.538667A106.666667 106.666667 0 0 1 449.194667 128H762.24a106.496 106.496 0 0 1 104.789333 87.466667l54.378667 298.965333a106.325333 106.325333 0 0 1-23.04 87.317333z"
            fill="#1296db"
            p-id="4640"
          ></path>
        </svg>
      </div>
      <button @click="$emit('report')">举报</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Comment {
  padding: 22px 0 0 80px;
  position: relative;
  .comment-avatar {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    width: 80px;
    cursor: pointer;
    .comment-avatar-size {
      height: 40px;
      width: 40px;
    }
  }
  .comment-user-info {
    font-size: 13px;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  .comment-content {
    font-size: 15px;
    line-height: 24px;
    position: relative;
    padding: 2px 0;
  }
  .comment-info {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 2px;
    font-size: 13px;
    color: #9499a0;
    .comment-timestamp {
      margin-right: 20px;
    }
    .comment-like {
      margin-right: 19px;
      display: flex;
      align-items: center;
      .like-icon {
        margin-right: 5px;
      }
    }
    .comment-dislike {
      margin-right: 19px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
