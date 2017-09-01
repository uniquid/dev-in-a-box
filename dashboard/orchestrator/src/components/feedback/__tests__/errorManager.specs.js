import 'jsdom-global/register'
import ErrorManager from '../errorManager'
import React from 'react'
import {mount} from 'enzyme'

describe('Error Manager', () => {
  const errorManager = mount(<ErrorManager status message={'custom error message'} />)
  it('Should display the active class', () => {
    expect(errorManager.find('.window_errManager').hasClass('active')).toEqual(true)
  })
  it('Should display the correct message', () => {
    expect(errorManager.find('.box_description').text()).toEqual('custom error message')
  })
})
