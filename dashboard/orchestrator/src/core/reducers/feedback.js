import {
  HAS_ERROR,
  ADD_CONTRACT_SUCCESS
} from '../actions/feedback'

const feedbackState = {
  status: false,
  code: null,
  message: '',
  title: '',
  icon: ''
}

export function feedback (state = feedbackState, action) {
  switch (action.type) {
    case HAS_ERROR:
      return action.payload
    case ADD_CONTRACT_SUCCESS:
      return action.payload
    default:
      return state
  }
}
