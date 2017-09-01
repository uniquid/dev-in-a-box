export const GET_NODES = 'GET_NODES'
export const GET_IMPRINTED_NODES = 'GET_IMPRINTED_NODES'
export const UPDATE_CONFIRMATIONS = 'UPDATE_CONFIRMATIONS'
// Filter nodes
export const TOGGLE_CONTROLLER = 'TOGGLE_CONTROLLER'
export const SELECT_NODE = 'SELECT_NODE'
export const RESET_SELECTION = 'RESET_SELECTION'
export const SELECT_ALL = 'SELECT_ALL'
export const GET_ALL_NODES_FROM_IMPRINTER = 'GET_ALL_NODES_FROM_IMPRINTER'

export const getAllNodesFromImprinterAction = (nodes) => {
  return {
    type: 'GET_ALL_NODES_FROM_IMPRINTER',
    nodes
  }
}

export const getNodesAction = (nodes) => {
  return {
    type: 'GET_NODES',
    payload: nodes
  }
}

export const getImprintedNodesAction = (nodes) => {
  return {
    type: 'GET_IMPRINTED_NODES',
    payload: nodes
  }
}

export const updateConfirmationsAction = (id, confirmations) => {
  let nodeConfirmation = {
    id: id,
    confirmations: confirmations
  }
  return {
    type: 'UPDATE_CONFIRMATIONS',
    payload: nodeConfirmation
  }
}
