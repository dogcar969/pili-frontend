import request from '../utils/request'

export const tipOffGetListService = (state, type, page, pageNum) => {
  return request({
    url: '/video/tipOff/',
    method: 'GET',
    params: {
      state,
      type,
      page,
      pageNum
    }
  })
}

export const tipOffDealService = (data) => {
  return request({
    url: '/video/tipOff/',
    method: 'PATCH',
    data
  })
}

export const tipOffPostService = (data) => {
  return request({
    url: '/video/tipOff/',
    method: 'POST',
    data
  })
}

export const tipOffCancelService = (id) => {
  return request({
    url: '/video/tipOff/',
    method: 'DELETE',
    params: {
      id
    }
  })
}
