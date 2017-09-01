import * as types from '../contractCreator'
import * as actions from '../contractCreator'

describe('Contract builder actions', () => {
  it('Should add the provider to contract builder', () => {
    const provider = 'tank'
    const expectedAction = {
      type: types.ADD_PROVIDER,
      provider
    }
    expect(actions.addProviderAction(provider)).toEqual(expectedAction)
  })

  it('Should add the user to contract builder', () => {
    const user = 'tank_manager'
    const expectedAction = {
      type: types.ADD_USER,
      user
    }
    expect(actions.addUserAction(user)).toEqual(expectedAction)
  })

  it('Should add the version to contract builder', () => {
    const version = '0'
    const expectedAction = {
      type: types.ADD_VERSION,
      version
    }
    expect(actions.addContractVersionAction(version)).toEqual(expectedAction)
  })

  it('Should add the recipe to contract builder', () => {
    const recipe = {}
    const expectedAction = {
      type: types.ADD_RECIPE,
      recipe
    }
    expect(actions.addRecipeAction(recipe)).toEqual(expectedAction)
  })

  it('Should update the recipe to contract builder', () => {
    const recipe = {}
    const expectedAction = {
      type: types.ADD_RECIPE,
      recipe
    }
    expect(actions.addRecipeAction(recipe)).toEqual(expectedAction)
  })

  it('Should add revokator to contract builder', () => {
    const revokation = {}
    const expectedAction = {
      type: types.ADD_REVOCATION,
      revokation
    }
    expect(actions.addRevokationAction(revokation)).toEqual(expectedAction)
  })

  it('Should add parameter to contract builder', () => {
    const parameter = []
    const expectedAction = {
      type: types.ADD_PARAMETER,
      parameter
    }
    expect(actions.addParameterAction(parameter)).toEqual(expectedAction)
  })

  it('Should update parameter to contract builder', () => {
    const parameter = []
    const expectedAction = {
      type: types.UPDATE_PARAMETER,
      parameter
    }
    expect(actions.updateParamAction(parameter)).toEqual(expectedAction)
  })


})
