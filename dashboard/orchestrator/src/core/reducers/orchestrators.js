import {
  GET_ALL_ORCHESTRATORS
} from '../actions/orchestrators'

export function orchestrators (state = [], action) {
  switch (action.type) {
    case GET_ALL_ORCHESTRATORS:
        let orchestrators = action.orchestrators.map(function (orchestrator) {
          orchestrator.checked = false
          return orchestrator
        })
      return orchestrators
    default:
      return state
  }
}
