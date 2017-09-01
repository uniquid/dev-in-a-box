import 'jsdom-global/register'
import Sidebar from '../sidebar'
import React from 'react'
import {mount} from 'enzyme'

describe('Sidebar', () => {
  const palette = 'ocean'
  const contexts = [
    {
      name: 'ciccio',
      xpub: '123'
    },
    {
      name: 'pasticcio',
      xpub: '456'
    }
  ]
  const sidebar = mount(<Sidebar palette={palette} contexts={contexts} />)
  it('Should display contexts', () => {
    expect(sidebar.find('.contexts_list').html()).toEqual(`<ul class="contexts_list"><li class="list_item"><a class="item_link">Asset Directory</a></li><li class="list_item"><a class="item_link">ciccio</a><span class="icon-trash"></span></li><li class="list_item"><a class="item_link">pasticcio</a><span class="icon-trash"></span></li></ul>`)
  })
  it('Should have ocean profile', () => {
    expect(sidebar.find('aside').hasClass('ocean')).toEqual(true)
  })
})
