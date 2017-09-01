export const GET_BALANCE = 'GET_BALANCE'
export const GET_NODES_INFO = 'GET_NODES_INFO'

export const getBalanceAction = (balance) => {
  return {
    type: 'GET_BALANCE',
    balance
  }
}

export const totalNodeInfoAction = (nodes) => {
  return {
    type: 'GET_NODES_INFO',
    nodes
  }
}

