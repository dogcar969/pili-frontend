<template>
  <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>

<script>
import Artplayer from '@/components/ArtPlayer.vue'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import { useUserStore } from '@/stores/components/user'
import { sendBulletchatService } from '@/api/video'
import { ElMessage } from 'element-plus'

export default {
  props: ['videoName', 'bulletchats', 'videoId'],
  data() {
    return {
      //  https://media.w3.org/2010/05/sintel/trailer.mp4
      instance: null,
      option: {
        url: `http://127.0.0.1:8000/video/stream_video/?videoName=${this?.videoName}`,
        autoSize: false,
        fullscreen: true,
        fullscreenWeb: true,
        autoOrientation: true,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        plugins: [
          artplayerPluginDanmuku({
            danmuku: this.bulletchats
            // beforeEmit: async (danmu) => {
            //   const user = useUserStore()
            //   if (!user.login) {
            //     ElMessage.error('请先登录')
            //     return
            //   }
            //   const Danmu = danmu
            //   const res = await sendBulletchatService({
            //     content: Danmu.text,
            //     time: Math.floor(Danmu.time).toString(),
            //     video: this.videoId.toString(),
            //     sender: user.Account
            //   })
            //   console.log(res.msg)
            //   if (res.msg === '触发屏蔽词，不可发送') {
            //     ElMessage.error('触发屏蔽词，不可发送')
            //     return false
            //   }
            //   this.$emit('emit')
            //   return true
            // }
          })
        ]
      },
      style: {
        width: '51vw',
        height: '29vw',
        margin: ''
      }
    }
  },
  components: {
    Artplayer
  },
  methods: {
    getInstance(art) {
      art.on('artplayerPluginDanmuku:emit', async (danmu) => {
        const user = useUserStore()
        if (!user.login) {
          ElMessage.error('请先登录')
          return
        }
        const res = await sendBulletchatService({
          content: danmu.text,
          time: Math.floor(danmu.time).toString(),
          video: this.videoId.toString(),
          sender: useUserStore().Account
        })
        if (res?.msg === '触发屏蔽词，不可发送') {
          ElMessage.error('触发屏蔽词，不可发送')
        } else {
          ElMessage.success(`发送成功，弹幕等级为${res?.level}`)
        }
        this.$emit('emit')
      })
      art.on('artplayerPluginDanmuku:loaded', (danmus) => {
        console.info('加载弹幕', danmus.length)
      })
    }
  },
  mounted() {
    console.log(this.bulletchats)
  }
}
</script>
