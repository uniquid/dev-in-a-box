import React from 'react'
import {Link} from 'react-router'

const StepOne = (props) => {
  console.log(props)
  let rows = []
  let grows = []
  props.nodes.map(function (machine) {
    if (machine.name.indexOf(props.filterText) === -1) {
      return ''
    } else {
      rows.push(
        <div key={'provider' + machine.xpub} className='list_item provider'>
          <input onClick={props.selectProvider} value={machine.xpub} id={machine.xpub} name='provider' type='radio' className='radio item_checkbox'/>
          <label htmlFor={machine.xpub}>{machine.name}</label>
        </div>
      )
    }
  })
  props.nodes.map(function (machine, i) {
    if (machine.name.indexOf(props.filterGuaranteedNodes) === -1) {
      return ''
    } else {
      grows.push(
        <div key={'provider' + machine.xpub} className='list_item provider'>
          <input onClick={props.selectUser} value={machine.xpub} id={machine.xpub + i} name='provider' type='radio' className='radio item_checkbox'/>
          <label htmlFor={machine.xpub + i}>{machine.name}</label>
        </div>
      )
    }
  })
  return (
    <div>
    <div id="secondary_header">
      <div className="header_breadcrumb">
        <h3 className="breadcrumb_title"><Link to={'/context/' + props.name}>{props.name}</Link> / <Link to={'/context/' + props.name + '/new'}>New</Link> / Guarantor</h3>
      </div>
      <nav className="header_menu">
        <h4 className='menu_title'>Choose machine & guarantor</h4>
      </nav>
    </div>
      <div className='medium-6 columns'>
        <section className='newContract_selection'>
          <h4 className='selection_title'>Select the guarantor</h4>
          <div className='form_container'>
            <input  onChange={props.handleChange} className='selection_search' placeholder='search the node...' value={props.filterText} />
            <span className='icon-magnifying-glass'></span>
          </div>
          <form className='form_definition selection_list'>
            {rows}
          </form>
        </section>
      </div>
      <div className='medium-6 columns'>
        <section className='newContract_selection'>
          <h4 className='selection_title'>Select the guaranteed</h4>
          <div className='form_container'>
            <input  onChange={props.handleChangeGuaranteed} className='selection_search' placeholder='search the node...' value={props.filterGuaranteedNodes} />
            <span className='icon-magnifying-glass'></span>
          </div>
          <form className='form_definition selection_list'>
            {grows}
          </form>
        </section>
      </div>
    </div>
  )
}

export default StepOne
