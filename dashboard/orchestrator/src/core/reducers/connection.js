import {
  ACTIVATE_CONNECTION,
  DEACTIVATE_CONNECTION,
  INCREMENT_TAIL,
  DECREMENT_TAIL,
  ADD_SOCKET,
  VERIFY_AUTH,
  ADD_SESSIONID,
  IS_SYNCED
} from '../actions/connection'

const connectionState = {
  auth: false,
  status: '',
  synced: {},
  sessionId: '',
  ws: {}
}

const tailState = []

export function connection (state = connectionState, action) {
  switch (action.type) {
    case ACTIVATE_CONNECTION:
      return Object.assign({}, state, {
        status: action.payload
      })
    case DEACTIVATE_CONNECTION:
      return Object.assign({}, state, {
        status: action.payload
      })
    case ADD_SOCKET:
      return Object.assign({}, state, {
        ws: action.payload
      })
    case ADD_SESSIONID:
      return Object.assign({}, state, {
        sessionId: action.payload
      })
    case VERIFY_AUTH:
      return Object.assign({}, state, {
        auth: action.payload
      })
    case IS_SYNCED:
      return Object.assign({}, state, {
        synced: action.payload
      })
    default:
      return state
  }
}

export function tail (state = tailState, action) {
  switch (action.type) {
    case INCREMENT_TAIL:
      return [
          ...state,
          action.payload
        ]
    case DECREMENT_TAIL:
      return [
          ...state.slice(0, action.payload),
          ...state.slice(action.payload + 1)
        ]
    default:
      return state
  }
}
