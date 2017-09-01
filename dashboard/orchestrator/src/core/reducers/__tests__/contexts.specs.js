import {contexts} from '../contexts'

describe('Contexts Reducer', () => {
  function stateBefore () {
    return [
        {
            name: 'home',
            xpub: 123
        }
    ]
  }

  it('Should get all contexts', () => {
    const action = {
      type: 'GET_CONTEXTS',
      payload: [
        {
            name: 'home',
            xpub: 123
        },
        {
          name: 'office',
          xpub: 123
        }
      ]
    }
    const actual = contexts(stateBefore(), action)
    const expected = [
        {
            name: 'home',
            xpub: 123
        },
        {
            name:'office',
            xpub: 123
        }
    ]
    expect(actual).toEqual(expected)
  })

})
