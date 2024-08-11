import request from '@/utils/request'

export const getBulletchatService = (VideoId, level) => {
  // 获取弹幕
  return request({
    url: '/video/bulletchat/',
    params: {
      VideoId: VideoId,
      level
    },
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const sendBulletchatService = (data) => {
  //   发弹幕
  //   "content": "好评如潮",
  //   "time": 5,
  //   "video": 1,
  //   "sender": "1"
  console.log(data)
  return request({
    url: '/video/bulletchat/',
    method: 'POST',
    data
  })
}

export const deleteBulletchatService = (id) => {
  // 删除（撤回弹幕）
  return request({
    url: '/video/bulletchat/',
    method: 'DELETE',
    data: {
      id
    }
  })
}

export const getCommentService = (VideoId, userId) => {
  // 获取评论
  return request({
    url: '/video/comment/',
    params: { VideoId, userId }
  })
}

export const sendCommentService = (data) => {
  // 发评论
  // "content": "抢到了二楼",
  // "video": 1,
  // "sender": "1"
  return request({
    url: '/video/comment/',
    method: 'POST',
    data
  })
}

export const deleteCommentService = (id) => {
  return request({
    url: '/video/comment/',
    method: 'DELETE',
    data: { id }
  })
}

export const getVideoInfoService = (VideoId) => {
  return request({
    url: '/video/video/',
    params: { VideoId },
    method: 'GET'
  })
}
