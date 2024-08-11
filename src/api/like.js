import request from '../utils/request'
export const CommentLikeGetService = (userId, commentId) => {
  return request({
    url: '/video/commentLike/',
    method: 'GET',
    params: { userId, commentId }
  })
}
export const CommentLikePostService = (userId, commentId) => {
  return request({
    url: '/video/commentLike/',
    method: 'POST',
    data: { userId, commentId }
  })
}
export const CommentLikeCancelService = (userId, commentId) => {
  return request({
    url: '/video/commentLike/',
    method: 'DELETE',
    data: { userId, commentId }
  })
}
