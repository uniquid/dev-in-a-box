import * as types from '../error.js'
import * as actions from '../error.js'

describe('Error actions', () => {
  it('Should display error', () => {
    const error = {
        status: true,
        message: '',
        code: ''
    }
    const expectedAction = {
      type: types.HAS_ERROR,
      error
    }
    expect(actions.hasErrorAction(true, '', '')).toEqual(expectedAction)
  })
})