import 'jsdom-global/register'
import Header from '../header'
import React from 'react'
import {mount} from 'enzyme'

describe('Header', () => {
  const user = 'bernini'
  const connectionStatus = 'Connected'
  const name = 'Home'

  const header = mount(<Header user={user} connectionStatus={connectionStatus} name={name} />)
  it('Should display the correct page title', () => {
    expect(header.find('.header_title h1').text()).toEqual('Home')
  })
  it('Should display the correct status', () => {
    expect(header.find('div.socket_status').hasClass('Connected')).toEqual(true)
  })
})
