import {
  GET_BALANCE,
  GET_NODES_INFO
} from '../actions/imprinter'

export function imprinter (state = {}, action) {
  switch (action.type) {
    case GET_BALANCE:
        return Object.assign({}, state, {
            ...state,
            balance: action.balance.userBalance
        })
     case GET_NODES_INFO:
        return Object.assign({}, state, {
            ...state,
            totalNodes: action.nodes.length,
            totalCREATED: action.nodes.filter(node => node.status === 'CREATED').length,
            totalImprinted: action.nodes.filter(node => node.status === 'IMPRINTED').length,
            totalOrchestrated: action.nodes.filter(node => node.status === 'ORCHESTRATED').length
        })
    
    default:
      return state
  }
}
