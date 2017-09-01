import * as types from '../connection.js'
import * as actions from '../connection.js'

describe('actions', () => {
  it('Should activate the connection', () => {
    const text = 'Connected'
    const expectedAction = {
      type: types.ACTIVATE_CONNECTION,
      payload: text
    }
    expect(actions.updateConnectionAction(1)).toEqual(expectedAction)
  })

  it('Should deactivate the connection', () => {
    const text = 'Disconnected'
    const expectedAction = {
      type: types.DEACTIVATE_CONNECTION,
      payload: text
    }
    expect(actions.updateConnectionAction(0)).toEqual(expectedAction)
  })

  it('Should increment tail', () => {
    const msg = {}
    const expectedAction = {
      type: types.INCREMENT_TAIL,
      payload: msg
    }
    expect(actions.addTail(msg)).toEqual(expectedAction)
  })

  it('Should decrement tail', () => {
    const index = 0
    const expectedAction = {
      type: types.DECREMENT_TAIL,
      payload: index
    }
    expect(actions.removeTail(index)).toEqual(expectedAction)
  })

  it('Should add socket object', () => {
    const socket = {}
    const expectedAction = {
      type: types.ADD_SOCKET,
      payload: socket
    }
    expect(actions.addSocketAction(socket)).toEqual(expectedAction)
  })

  it('Should verify the authentication matrix', () => {
    const auth = []
    const expectedAction = {
      type: types.VERIFY_AUTH,
      payload: auth
    }
    expect(actions.verifyAuthAction(auth)).toEqual(expectedAction)
  })

  it('Should add the IP', () => {
    const ip = '123'
    const expectedAction = {
      type: types.ADD_IP,
      payload: ip
    }
    expect(actions.addIpAction(ip)).toEqual(expectedAction)
  })

  it('Should add the sessionID', () => {
    const val = '123'
    const expectedAction = {
      type: types.ADD_SESSIONID,
      payload: val
    }
    expect(actions.addSessionIdAction(val)).toEqual(expectedAction)
  })

  it('Should check if synced', () => {
    const res = {
      'status': {},
      'percent': '80%',
      'message': 'hi'
    }
    const expectedAction = {
      type: types.IS_SYNCED,
      payload: res
    }
    expect(actions.isSyncedAction({}, '80%', 'hi')).toEqual(expectedAction)
  })
})