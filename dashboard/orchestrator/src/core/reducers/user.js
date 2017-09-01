import {
  GET_USER_INFO,
  ADD_IP
} from '../actions/user'

let userState = {
  name: '',
  ip: '',
  photo: '',
  xpub: '',
  data: null,
  isLoading: false
}

export function user (state = userState, action) {
  switch (action.type) {
    case ADD_IP:
      return Object.assign({}, state, {
        ip: action.payload.ip,
        name: action.payload.name
      })
    case GET_USER_INFO:
      return Object.assign({}, state, {
        name: action.payload.name,
        photo: action.payload.photo,
        xpub: action.payload.xpub
      })
    default:
      return state
  }
}
