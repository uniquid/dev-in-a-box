import {error} from '../error'

describe('Error Reducer', () => {
  function stateBefore () {
    return {
      status: '',
      message: '',
      code: 0
    }
  }

  it('Should signal an error', () => {
    const action = {
      type: 'HAS_ERROR',
      error: {
        status: true,
        message: 'error signal',
        code: 404
      }
    }

    const actual = error(stateBefore(), action)
    const expected = {
      status: true,
      message: 'error signal',
      code: 404
    }
    expect(actual).toEqual(expected)
  })

})
