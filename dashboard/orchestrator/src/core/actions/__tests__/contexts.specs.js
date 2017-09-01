import * as types from '../contexts.js'
import * as actions from '../contexts.js'

describe('Contexts actions', () => {
  it('Should display contexts', () => {
    const data = []
    const expectedAction = {
      type: types.GET_CONTEXTS,
      payload: data
    }
    expect(actions.getContextsAction(data)).toEqual(expectedAction)
  })
})