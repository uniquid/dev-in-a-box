import React from 'react'
import {Link} from 'react-router'

const StepThree = (props) => {
  // let annulment = []
  // if (props.valueRevocation.label.length > 0) {
  //   annulment.push(
  //     <div key={props.valueRevocation.label} className='graph_node graph_annulment'>
  //       <div className='annulment_list'>
  //         <div className='list_item'>
  //           <span>{props.valueRevocation.label}</span>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  //
  // let representatives = props.contract.representatives.map(function (representative, i) {
  //   return (
  //     <div key={i} className='list_item'>
  //       <span>{representative.label}</span>
  //     </div>
  //   )
  // })
  // let recipe = props.contract.recipe.content.map(function (props, i) {
  //   if (props.checked === true) {
  //     return (
  //       <div key={i} className='list_item'>
  //         <span>{props.value}</span>
  //       </div>
  //     )
  //   }
  // })
  let rows = []
  if (props.nodes !== undefined) {
    props.nodes.map(function (machine) {
      if (machine.name.indexOf(props.filterText) === -1) {
        return ''
      } else {
        rows.push(
          <div key={'user' + machine.xpub} className='list_item user clearfix'>
          <input onClick={props.selectUser} className='radio item_checkbox' id={'user-' + machine.xpub} value={machine.xpub} name='provider' type='radio' />
          <label htmlFor={'user-' + machine.xpub}>{machine.name}</label>
          </div>
        )
      }
    })
  }

  return (
    <div className='step3_review'>
      <div id='secondary_header'>
        <div className='header_breadcrumb'>
          <h3 className='breadcrumb_title'>
            <Link to={'/context/' + props.name}>{props.name}</Link> / <Link to={'/context/' + props.name + '/new-contract'}>New Contract</Link>
          </h3>
        </div>
        <nav className='header_menu'>
          <h4 className='menu_title'>Review & Send</h4>
        </nav>
      </div>
      <div className='row'>
        <div className='medium-6 medium-centered columns'>
          <section className='newContract_selection'>
            <h4 className='selection_title'>Select the user</h4>
            <p className='selection_tagline'>The user is the machine who can performs the methods made available by the provider.</p>
            <div className='form_container'>
              <input  onChange={props.handleChange} className='selection_search' placeholder='search the node...' value={props.filterText} />
              <span className='icon-magnifying-glass'></span>
            </div>
            <form className='form_definition selection_list'>
              {rows}
            </form>
          </section>
        </div>
      </div>

    </div>
  )
}


export default StepThree
