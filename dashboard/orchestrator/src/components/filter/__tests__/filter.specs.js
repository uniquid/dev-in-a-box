import 'jsdom-global/register'
import ConnectedFilter from '../filter'
import React from 'react'
import {mount} from 'enzyme'

describe('Filter', () => {
  'use strict';
  const data = [
    {name:'pippo', status: 'created'},
    {name:'assop', status: 'imprinting'},
    {name:'zuppa', status: 'orchestrated'},
    {name:'passo', status: 'imprinted'},
    {name:'possa', status: 'orchestrating'},
    {name:'floppoz', status: 'orchestrated'}
  ]
  let filtered_data, state_dump
  const setFiltered = _filtered_data => filtered_data = _filtered_data
  const dump = _state_dump => state_dump = _state_dump
  const wrapper = mount(
      <ConnectedFilter filtered={setFiltered} data={data} filters={['name','status']} matches={{name:'pa', status:'imprinted'}} dump={dump}/>
  )
  it('Should test initial ui state name "pa" and status "imprinted"', () => {
    let input_value = wrapper.find('.filter_item.name input').node.value
    let status_value = wrapper.find('.filter_item.status select').node.value
    expect(input_value).toEqual('pa')
    expect(status_value).toEqual('imprinted')
  })
  it('Should test initial filter name "pa" and status "imprinted"', () => {
    expect(filtered_data).toEqual([
      data[3]
    ])
  })
  it('Should test blank name and blank status', () => {
    let input = wrapper.find('.filter_item.name input')
    input.simulate('change', {target: {value: ''}})
    let select = wrapper.find('.filter_item.status select')
    select.simulate('change', {target: {value: ''}})
    expect(filtered_data).toEqual(data)
  })
  it('Should test the filter name "ppo"', ()=> {
    let input = wrapper.find('.filter_item.name input')
    input.simulate('change', {target: {value: 'ppo'}})
    expect(filtered_data).toEqual([
      data[0],
      data[5]
    ])
  })
  it('Should test the filter name "ppo" and status "orchestrated"', ()=> {
    let select = wrapper.find('.filter_item.status select')
    select.simulate('change', {target: {value: 'orchestrated'}})
    expect(filtered_data).toEqual([
      data[5]
    ])
  })
  it('Should test the filter blank name status "orchestrated"', ()=> {
    let input = wrapper.find('.filter_item.name input')
    input.simulate('change', {target: {value: ''}})
    expect(filtered_data).toEqual([
      data[2],
      data[5]
    ])
  })
  it('Should dump when unmounted', ()=> {
      wrapper.unmount()
      expect(state_dump).toEqual({matches:{status: 'orchestrated'}})
    })
})
