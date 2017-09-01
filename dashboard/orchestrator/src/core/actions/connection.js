export const ACTIVATE_CONNECTION = 'ACTIVATE_CONNECTION'
export const DEACTIVATE_CONNECTION = 'DEACTIVATE_CONNECTION'
export const INCREMENT_TAIL = 'INCREMENT_TAIL'
export const DECREMENT_TAIL = 'DECREMENT_TAIL'
export const ADD_SOCKET = 'ADD_SOCKET'
export const VERIFY_AUTH = 'VERIFY_AUTH'
export const ADD_IP = 'ADD_IP'
export const ADD_SESSIONID = 'ADD_SESSIONID'
export const IS_SYNCED = 'IS_SYNCED'

export const addTail = (msg) => {
  return {
    type: 'INCREMENT_TAIL',
    payload: msg
  }
}

export const removeTail = (index) => {
  return {
    type: 'DECREMENT_TAIL',
    payload: index
  }
}

// export const addIpAction = (data) => {
//   console.log(data)
//   console.log('jaijsdai')
//   return {
//     type: 'ADD_IP',
//     payload: data
//   }
// }

export const addSessionIdAction = (val) => {
  return {
    type: 'ADD_SESSIONID',
    payload: val
  }
}

export const verifyAuthAction = (auth) => {
  return {
    type: 'VERIFY_AUTH',
    payload: auth
  }
}

export const isSyncedAction = (status, percent, message) => {
  let res = {
    status: status,
    percent: percent,
    message: message
  }
  return {
    type: 'IS_SYNCED',
    payload: res
  }
}

export const updateConnectionAction = (status) => {
  if (status === 1) {
    status = 'Connected'
    return {
      type: 'ACTIVATE_CONNECTION',
      payload: status
    }
  } else {
    status = 'Disconnected'
    return {
      type: 'DEACTIVATE_CONNECTION',
      payload: status
    }
  }
}

export const addSocketAction = (socket) => {
  return {
    type: 'ADD_SOCKET',
    payload: socket
  }
}
