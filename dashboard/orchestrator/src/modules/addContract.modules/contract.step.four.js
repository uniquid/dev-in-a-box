import React from 'react'
import {Link} from 'react-router'
import Select from 'react-select'

const StepFour = (props) => {

  let values = props.value.map(val => val.value)
  let representatives
  if (props.nodes !== undefined) {
    representatives = props.nodes.map(function (node) {
      let newNode = {
        value: '',
        label: ''
      }
      newNode.label = node.name
      newNode.value = node.xpub
      return newNode
    })
  }
  let orch = {
    value: props.orchestratorXpub,
    label :'Orchestrator'
  }
  // let annulments
  // if (representatives !== undefined) {
  //   annulments = representatives.unshift(orch)
  // }
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
          <div className='newContract_configuration'>
            <h2 className='configuration_title'>Select Representatives</h2>
            <p className='configuration_tagline'>Definisci i garanti che autorizzano l'accesso alla macchina </p>
            <div className='form_container'>
              <Select
                options={representatives}
                name='selection_search'
                multi
                value={values}
                onChange={props.selectRepresentatives}
                disabled
              />
            </div>
            <h2 className='configuration_title'>Select Revokation</h2>
            <p className='configuration_tagline'>Select the machine who can annul the contract</p>
            <div className='form_container'>
              <Select
                options={representatives}
                name='revocation_search'
                value={props.valueRevocation.value}
                onChange={props.selectRevocation}
              />
            </div>

            <div className='step_actions'>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepFour
