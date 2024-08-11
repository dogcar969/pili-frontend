import request from '../utils/request'

export const statisticsGetService = async () => {
  return request({
    url: '/video/statistics/',
    method: 'GET'
  })
}

export const wordsGetService = async () => {
  return request({
    url: '/video/frequency/'
  })
}
