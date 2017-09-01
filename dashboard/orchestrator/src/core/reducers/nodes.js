import {
  GET_NODES,
  GET_IMPRINTED_NODES,
  UPDATE_CONFIRMATIONS,
  GET_ALL_NODES_FROM_IMPRINTER
} from '../actions/nodes'
import update from 'react-addons-update'

const imprintedNodesState = []
const nodesState = []

export function imprintedNodes (state = imprintedNodesState, action) {
  switch (action.type) {
    case GET_IMPRINTED_NODES:
      let imprintedNodes = action.payload.map(function (node) {
        let newNode = {
          ...node,
          confirmations: 0
        }
        return newNode
      })
      return imprintedNodes
    case UPDATE_CONFIRMATIONS:
      return update(state, {
        [action.payload.id]: {
          confirmations: {$set: action.payload.confirmations}
        }
      })
    default:
      return state
  }
}

export function nodes (state = nodesState, action) {
  switch (action.type) {
    case GET_NODES:
      return action.payload
    default:
      return state
  }
}

export function nodesFromImprinter (state = [], action) {
  switch (action.type) {
    case GET_ALL_NODES_FROM_IMPRINTER:
      return action.nodes
    default:
      return state
  }
}