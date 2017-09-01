import 'jsdom-global/register'
import Auth from '../auth'
import React from 'react'
import {mount} from 'enzyme'

describe('Auth Component', () => {
  const wrapper = mount(<Auth />)
  it('Should assert initial state', () => {
    expect(wrapper.state().code).toEqual([])
  })
  it('Should check the value of a button', () => {
    wrapper.find('.matrix_column .matrix_input').forEach(function (node, i) {
      node.simulate('click')
      expect(wrapper.state().code).toEqual([i+1])
      wrapper.instance().resetCode()
    })
  })

  it('Should reset the code state', () => {
    wrapper.find('.matrix_column .matrix_input').at(1).simulate('click')
    wrapper.find('.matrix_column .matrix_input').at(3).simulate('click')
    wrapper.find('.matrix_column .matrix_input').at(4).simulate('click')
    expect(wrapper.state().code).toEqual([2, 4, 5])
    wrapper.find('.reset_pin').simulate('click')
    expect(wrapper.state().code).toEqual([])
  })
})
