import * as types from '../contracts.js'
import * as actions from '../contracts.js'

describe('Contracts actions', () => {
  it('Should display contracts', () => {
    const contracts = []
    const expectedAction = {
      type: types.GET_CONTRACTS,
      payload: contracts
    }
    expect(actions.getContractsAction(contracts)).toEqual(expectedAction)
  })

  it('Should update contracts confirmations', () => {
    const contractConfirmations = {
      context: 'office',
      id: 0,
      confirmations: 0
    }
    const expectedAction = {
      type: types.UPDATE_CONTRACTS_CONFIRMATIONS,
      contractConfirmations
    }
    expect(actions.updateConfirmationsAction('office', 0, 0)).toEqual(expectedAction)
  })

  it('Should toggle contract', () => {
    const id = 0
    const expectedAction = {
      type: types.TOGGLE_CONTRACT,
      id
    }
    expect(actions.toggledContract(0)).toEqual(expectedAction)
  })

  it('Should delete contract', () => {
    const name = 'test'
    const expectedAction = {
      type: types.DELETE_CONTRACT,
      name
    }
    expect(actions.deleteContractAction(name)).toEqual(expectedAction)
  })
})