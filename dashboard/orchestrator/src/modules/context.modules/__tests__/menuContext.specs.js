import 'jsdom-global/register'
import HeaderContext from '../menuContext'
import React from 'react'
import {mount} from 'enzyme'

describe('HeaderContext Component', () => {
  const wrapper = mount(<HeaderContext
    menu
    name={'office'}
    class={'office'}
    nodes={30}
    contracts={173}
   />)

  it('Should display 30 nodes', () => {
    expect(wrapper.find('.overview_box.nodes h3').text()).toEqual('30')
  })
  it('Should display 173 contracts', () => {
    expect(wrapper.find('.overview_box.contracts h3').text()).toEqual('173')
  })
})
