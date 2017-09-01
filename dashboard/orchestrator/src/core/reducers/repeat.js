import {
  ADD_REPEAT,
  DELETE_REPEAT
} from '../actions/repeat'

let repeatState = []

export function repeat (state = repeatState, action) {
  switch (action.type) {
    case ADD_REPEAT:
      let newState = state.slice()
      newState.push(action.payload)
      return newState
    case DELETE_REPEAT:
      let index = state.indexOf(action.payload)
      let filteredState = state.filter((item, i) => i !== index)
      return filteredState
    default:
      return state
  }
}
