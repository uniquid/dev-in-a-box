import {
  ADD_PROVIDER,
  ADD_USER
} from '../actions/contractCreator'

const contractCreatorState = {
  provider: {
    name: '',
    xpub: ''
  },
  user: {
    name: '',
    xpub: ''
  }
}


export function contractCreator (state = contractCreatorState, action) {
  switch (action.type) {
    case ADD_PROVIDER:
      let providerState = Object.assign({}, state)
      providerState.provider.name = action.provider.name
      providerState.provider.xpub = action.provider.xpub
      return providerState
    case ADD_USER:
      let userState = Object.assign({}, state)
      userState.user.name = action.user.name
      userState.user.xpub = action.user.xpub
      return userState
    default:
      return state
  }
}
