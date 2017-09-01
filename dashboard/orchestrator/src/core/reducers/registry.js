const ADD_REGISTRY = 'ADD_REGISTRY'
const REGISTRY_DONE = 'REGISTRY_DONE'

let registryState = []

export function registry (state = registryState, action) {
  switch (action.type) {
    case ADD_REGISTRY:
      return [
        ...state,
        action.payload
      ]
    case REGISTRY_DONE:
      return state.filter(element => element.provider_address !== action.payload)
    default:
      return state
  }
}
