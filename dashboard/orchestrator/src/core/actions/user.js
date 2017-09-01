export const GET_USER_INFO = 'GET_USER_INFO'
export const ADD_IP = 'ADD_IP'

export const getUserInfoAction = (info) => {
  console.log(info)
  return {
    type: 'GET_USER_INFO',
    info
  }
}

export const addIpAction = (data) => {
  return {
    type: 'ADD_IP',
    payload: data
  }
}
