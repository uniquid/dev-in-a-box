import {
  GET_CONTRACTS,
  SEND_CONTRACT,
  UPDATE_CONTRACTS_CONFIRMATIONS
} from '../actions/contracts'

const contractsState = []
const newContractsState = []


export function newContracts (state = newContractsState, action) {
  switch (action.type) {
    case SEND_CONTRACT:
      return [
        ...state,
        action.payload
      ]
    default:
      return state
  }
}

export function contracts (state = contractsState, action) {
  switch (action.type) {
    case GET_CONTRACTS:
      let contractsWConfirmations = action.payload.map(function (contract) {
        let newContract = {
          ...contract,
          confirmations: 0
        }
        return newContract
      })
      return contractsWConfirmations
    case UPDATE_CONTRACTS_CONFIRMATIONS:
      let newContracts = state.map((item, index) => {
        if (index !== action.contractConfirmations.id) {
          return item
        }
        return {
          ...item,
          confirmations: action.contractConfirmations.confirmations
        }
      })
      return newContracts
    default:
      return state
  }
}
