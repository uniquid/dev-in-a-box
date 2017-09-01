import {connection} from '../connection'
import {tail} from '../connection'

describe('Connection Reducer', () => {
  function stateBefore () {
    return {
      auth: false,
      status: '',
      synced: {},
      sessionId: '',
      ws: {}
    }
  }

  it('Should activate the connection', () => {
    const action = {
      type: 'ACTIVATE_CONNECTION',
      payload: 'Connected'
    }
    const actual = connection(stateBefore(), action)
    const expected = {
      auth: false,
      status: 'Connected',
      synced: {},
      sessionId: '',
      ws: {}
    }
    expect(actual).toEqual(expected)
  })

  it('Should deactivate the connection', () => {
      const action = {
        type: 'DEACTIVATE_CONNECTION',
        payload: 'Disconnected'
      }
      const actual = connection(stateBefore(), action)
      const expected = {
        auth: false,
        status: 'Disconnected',
        synced: {},
        sessionId: '',
        ws: {}
    }
    expect(actual).toEqual(expected)
  })

  it('Should add socket object to the state', () => {
      const action = {
        type: 'ADD_SOCKET',
        payload: {
            readyState: 1
        }
      }
      const actual = connection(stateBefore(), action)
      const expected = {
        auth: false,
        status: '',
        synced: {},
        sessionId: '',
        ws: {
          readyState: 1
        }
    }
    expect(actual).toEqual(expected)
  })

  it('Should add sessionID to the state', () => {
      const action = {
        type: 'ADD_SESSIONID',
        payload: '123'
      }
      const actual = connection(stateBefore(), action)
      const expected = {
        auth: false,
        status: '',
        synced: {},
        sessionId: '123',
        ws: {}
    }
    expect(actual).toEqual(expected)
  })

  it('Should check authentication', () => {
      const action = {
        type: 'VERIFY_AUTH',
        payload: true
      }
      const actual = connection(stateBefore(), action)
      const expected = {
        auth: true,
        status: '',
        synced: {},
        sessionId: '',
        ws: {}
    }
    expect(actual).toEqual(expected)
  })

  it('Should check sync', () => {
      const action = {
        type: 'IS_SYNCED',
        payload: {
          'status': {},
          'percent': '80%',
          'message': 'hi'
        }
      }
      const actual = connection(stateBefore(), action)
      const expected = {
        auth: false,
        status: '',
        synced: {
          'status': {},
          'percent': '80%',
          'message': 'hi'
        },
        sessionId: '',
        ws: {}
    }
    expect(actual).toEqual(expected)
  })

})

describe('Tail Reducer', () => {
  function stateBefore () {
    return {
      requests: [
        {
          name: 'test',
          id: 1
        }
      ]
    }
  }

  it('Should increment tails', () => {
    const action = {
      type: 'INCREMENT_TAIL',
      payload: {
				name: 'contexts',
				id: 123
			}
    }
    const actual = tail(stateBefore(), action)
    const expected = {
      requests: [
       {
         name: 'test',
         id: 1
       },
       {
         name: 'contexts',
         id: 123
       }
     ]
    }
    expect(actual).toEqual(expected)
  })

	it('Should decrement tails', () => {
    const action = {
      type: 'DECREMENT_TAIL',
      payload: 0
    }
    const actual = tail(stateBefore(), action)
    const expected = {
      requests: []
    }
    expect(actual).toEqual(expected)
  })

})