import request from '../utils/request'

export const wordGetListService = (type, page, pageNum) => {
  return request({
    url: '/video/word/',
    method: 'GET',
    params: {
      type,
      page,
      pageNum
    }
  })
}

export const wordAddService = (word, type) => {
  return request({
    url: '/video/word/',
    method: 'post',
    params: {
      type,
      word
    }
  })
}

export const wordEditService = (id, word, type) => {
  return request({
    url: '/video/word/',
    method: 'put',
    params: {
      id,
      type,
      word
    }
  })
}

export const wordDeleteService = (id) => {
  return request({
    url: '/video/word/',
    method: 'delete',
    params: {
      id
    }
  })
}

export const treeSaveService = () => {
  return request({
    url: '/video/tree/',
    method: 'post'
  })
}

export const treeVerifyService = () => {
  return request({
    url: '/video/tree/',
    method: 'get'
  })
}

export const treeRebuildService = () => {
  return request({
    url: '/video/tree/',
    method: 'patch'
  })
}

export const wordSafeService = (word) => {
  return request({
    url: '/video/frequency/',
    method: 'post',
    data: {
      word
    }
  })
}
