import {
  getParams
} from '@/libs/util'
const USER_MAP = {
  superadmin: {
    name: 'superadmin',
    user_id: '1',
    access: ['superadmin', 'admin', 'user'],
    token: 'superadmin',
    avator: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  },
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin', 'user'],
    token: 'admin',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  },
  user: {
    name: 'user',
    user_id: '3',
    access: ['user'],
    token: 'user',
    avator: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  req = JSON.parse(req.body)
  return {
    token: USER_MAP[req.userName].token
  }
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}