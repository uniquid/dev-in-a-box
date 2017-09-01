import {
  UPDATE_STATUS,
  RESET_STATUS
} from '../actions/status'

export function status (state = [], action) {
  switch (action.type) {
    case UPDATE_STATUS:
      if (action.payload.status === 200) {
        return [
          ...state,
          action.payload
        ]
      } else {
        return [...state, action.payload]
      }
    case RESET_STATUS:
      return []
    default:
      return state
  }
}
