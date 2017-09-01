import {GET_CONTEXTS} from '../actions/contexts'

const contextState = []

export function contexts (state = contextState, action) {
  switch (action.type) {
    case GET_CONTEXTS:
      return action.payload
    default:
      return state
  }
}
