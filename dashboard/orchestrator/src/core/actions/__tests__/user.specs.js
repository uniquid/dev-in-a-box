import * as types from '../user.js'
import * as actions from '../user.js'

describe('User actions', () => {
  it('Should get User infos', () => {
    const info = {}
    const expectedAction = {
      type: types.GET_USER_INFO,
      info
    }
    expect(actions.getUserInfoAction(info)).toEqual(expectedAction)
  })

  it('Should add IP', () => {
    const ip = '123'
    const expectedAction = {
      type: types.ADD_IP,
      ip
    }
    expect(actions.addIpAction(ip)).toEqual(expectedAction)
  })
})