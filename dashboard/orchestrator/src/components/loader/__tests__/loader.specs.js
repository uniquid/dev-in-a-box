import 'jsdom-global/register'
import Loader from '../loader'
import React from 'react'
import {mount} from 'enzyme'

describe('Loader', () => {
  const loader = mount(<Loader status={false} percent={80} message={'test'} />)
  it('Should display the active class', () => {
    expect(loader.find('section').hasClass('active')).toEqual(true)
  })
  it('Should display the percentage at 80%', () => {
    expect(loader.find('.react-progress-bar').html()).toEqual(`<div class="react-progress-bar"><div class="react-progress-bar-percent" style="width: 80%;"></div></div>`)
  })
  it('Should display the correct message', () => {
    expect(loader.find('.blockchain_bar h4').text()).toEqual('test')
  })
})
