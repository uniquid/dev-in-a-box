import {user} from '../user'

describe('Imprinted Nodes Reducer', () => {
  function stateBefore () {
    return {}
  }
  it('Should get user info', () => {
    const action = {
      type: 'GET_USER_INFO',
      payload: {
        name: 'bernini',
        photo: 'image.jpg',
        xpub: '123'
      }
    }
    const actual = user(stateBefore(), action)
    const expected = {
      name: 'bernini',
      photo: 'image.jpg',
      xpub: '123'
    }
    expect(actual).toEqual(expected)
  })
})
