import request from '../utils/request'
import sha from '../../sha256'
export const userGetInfoService = (account) => {
  return request({
    url: '/video/user/',
    method: 'GET',
    params: { account }
  })
}

export const userLoginService = ({ account, password }) => {
  console.log(sha(password))
  return request({
    url: '/video/login/',
    method: 'post',
    data: {
      account,
      password: sha(password)
    }
  })
}

export const userRegisterService = ({ account, password, passwordConfirm, name }) => {
  return request({
    url: '/video/register/',
    method: 'post',
    data: {
      account,
      name,
      password: sha(password),
      passwordConfirm: sha(passwordConfirm)
    }
  })
}
