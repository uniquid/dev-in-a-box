export const DELETE_CONTRACT = 'DELETE_CONTRACT'
export const TOGGLE_CONTRACT = 'TOGGLE_CONTRACT'
export const GET_CONTRACTS = 'GET_CONTRACTS'
export const ADD_CONTRACT = 'ADD_CONTRACT'
export const SEND_CONTRACT = 'SEND_CONTRACT'
export const UPDATE_CONTRACTS_CONFIRMATIONS = 'UPDATE_CONTRACTS_CONFIRMATIONS'


export const getContractsAction = (contract) => {
  return {
    type: 'GET_CONTRACTS',
    payload: contract
  }
}

export const sendContractAction = (contract) => {
  return {
    type: 'SEND_CONTRACTS',
    payload: contract
  }
}

export const updateConfirmationsAction = (context, id, confirmations) => {
  let contractConfirmations = {
    context: context,
    id: id,
    confirmations: confirmations
  }
  return {
    type: 'UPDATE_CONTRACTS_CONFIRMATIONS',
    contractConfirmations
  }
}

export const toggledContract = (id) => {
  return {
    type: 'TOGGLE_CONTRACT',
    id
  }
}

export const addCurrentContractAction = (contract) => {
  return {
    type: 'ADD_CONTRACT',
    contract
  }
}

export const deleteContractAction = (name) => {
  return {
    type: 'DELETE_CONTRACT',
    name
  }
}

// export const deleteMultipleContractsAction = (contractsName) => {
//   return function (dispatch) {
//     contractsName.chosenIds.forEach(function (name) {
//       return (dispatch(deleteContractAction(name)), dispatch(toggledContract(name)))
//     })
//   }
// }
