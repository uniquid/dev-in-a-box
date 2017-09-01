import {contracts} from '../contracts'

describe('Contracts Reducer', () => {
  function stateBefore () {
    return {
      isFetching: '',
      all: [
          {
          context: 'office',
          list: [
            {
              user: 'user0',
              confirmations: 0,
              provider: 'provider0'
            }
          ]
        }
      ]
    }
  }

  it('Should display all contracts', () => {
    const action = {
      type: 'GET_CONTRACTS',
      payload:[
          {
            user: 'user',
            provider: 'provider'
          }
        ]
    }
    const actual = contracts(stateBefore(), action)
    const expected = {
      isFetching: '',
      all: [
        {
          context: 'office',
          list: [
            {
              user: 'user',
              confirmations: 0,
              provider: 'provider'
            }
          ]
        }
      ]
    }
    expect(actual).toEqual(expected)
  })

  it('Should update all contracts confirmations', () => {
    const action = {
      type: 'UPDATE_CONTRACTS_CONFIRMATIONS',
      contractConfirmations: {
        context: 'office',
        id: 0,
        confirmations: 4
      }
    }
    const actual = contracts(stateBefore(), action)
    const expected = {
      isFetching: '',
      all: [
        {
          context: 'office',
          list: [
            {
              user: 'user0',
              confirmations: 4,
              provider: 'provider0'
            }
          ]
        }
      ]
    }
    expect(actual).toEqual(expected)
  })
})
